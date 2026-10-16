/**
 * Cloudflare Worker: GitHub org webhook -> applications-index refresh.
 *
 * Receives organization webhook events from the cdli-nlschools org,
 * verifies the HMAC-SHA256 signature, and triggers the `daily-refresh`
 * workflow on the applications-index repo via workflow_dispatch.
 * The workflow itself is idempotent (skips the commit when nothing
 * changed), so over-triggering is harmless. The daily cron remains
 * as a backstop for anything the webhook misses.
 *
 * Required Worker secrets (wrangler secret put, or dashboard):
 *   WEBHOOK_SECRET  - the secret configured on the GitHub org webhook
 *   DISPATCH_TOKEN  - fine-grained PAT with Actions: read/write on
 *                     cdli-nlschools/applications-index
 *
 * Required Worker variable (wrangler.toml [vars] or dashboard):
 *   WORKFLOW_FILE   - e.g. "daily-refresh.yml" (default if unset)
 */

const ORG = 'cdli-nlschools';
const REPO = 'applications-index';
// Events worth a refresh. `push` covers code/content changes;
// `repository` covers created/renamed/edited (description, etc.).
const WATCHED = new Set(['push', 'repository']);

async function verifySignature(secret, signatureHeader, bodyText) {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false;
  const expected = signatureHeader.slice('sha256='.length);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(bodyText));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
  // Constant-time comparison
  if (hex.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const bodyText = await request.text();
    const ok = await verifySignature(
      env.WEBHOOK_SECRET,
      request.headers.get('x-hub-signature-256'),
      bodyText
    );
    if (!ok) {
      return new Response('Bad signature', { status: 401 });
    }

    const event = request.headers.get('x-github-event') || '';
    if (event === 'ping') {
      return new Response('pong', { status: 200 });
    }
    if (!WATCHED.has(event)) {
      return new Response(`ignored event: ${event}`, { status: 200 });
    }

    // Skip pushes to the index repo itself and infra-only noise if needed.
    // (The workflow no-ops on no-change anyway; keep this permissive.)
    let payload = {};
    try {
      payload = JSON.parse(bodyText);
    } catch {
      return new Response('Bad JSON', { status: 400 });
    }
    const repoName = payload.repository && payload.repository.name;
    if (repoName === REPO) {
      return new Response('self-event ignored', { status: 200 });
    }

    const workflowFile = env.WORKFLOW_FILE || 'daily-refresh.yml';
    const dispatchUrl =
      `https://api.github.com/repos/${ORG}/${REPO}/actions/workflows/${workflowFile}/dispatches`;

    const res = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.DISPATCH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'cdli-index-webhook-worker',
      },
      body: JSON.stringify({ ref: 'main' }),
    });

    if (res.status === 204) {
      return new Response('refresh dispatched', { status: 200 });
    }
    const detail = (await res.text()).slice(0, 300);
    return new Response(`dispatch failed (${res.status}): ${detail}`, { status: 502 });
  },
};
