# Webhook setup: push-based index refreshes

GitHub can't call itself, so a tiny Cloudflare Worker (free tier) sits in
the middle: org webhook → Worker → `workflow_dispatch` on the
`daily-refresh` workflow. The workflow is idempotent (it skips the commit
when nothing changed), so extra triggers are harmless. The daily 06:00 UTC
cron stays as a backstop.

## What you do (about 10 minutes)

### 1. Dispatch token (GitHub)

Create a fine-grained personal access token:

1. GitHub → Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token.
2. Resource owner: **CDLI-NLSchools**. Repository access: **Only select
   repositories** → `applications-index`.
3. Permissions → **Actions**: Read and write. (Nothing else needed.)
4. Generate, copy the token. You'll paste it into Cloudflare in step 3.

### 2. Cloudflare Worker

1. Sign up at https://dash.cloudflare.com/sign-up (free plan is fine).
2. Workers & Pages → Create → Create Worker → Deploy (accept the starter).
3. Edit code: delete the starter, paste the entire contents of `worker.js`
   from this folder, Save and deploy. Note the Worker's public URL
   (`https://cdli-index-webhook.<your-subdomain>.workers.dev`).
4. Settings → Variables and Secrets → add two **secrets** (Encrypt):
   - `WEBHOOK_SECRET` — make up a long random string (e.g. 40+ characters).
     Save it somewhere; you'll need it in step 4.
   - `DISPATCH_TOKEN` — the token from step 1.

### 3. Organization webhook (GitHub)

1. Go to https://github.com/organizations/cdli-nlschools/settings/hooks
   (requires org owner/admin) → Add webhook.
2. Payload URL: your Worker URL from step 2.
3. Content type: `application/json`.
4. Secret: the `WEBHOOK_SECRET` from step 2.
5. "Which events would you like to trigger this webhook?": **Let me select
   individual events** → check **Pushes** and **Repositories**. (Everything
   else the index cares about — new repos, renames, description edits —
   arrives via these; topics/description tweaks the webhook misses are
   caught by the daily cron.)
6. Active: checked. Add webhook.

GitHub immediately sends a `ping` event. The Worker answers `pong`
(HTTP 200) — you'll see the green checkmark on the webhook page.

## Verify end-to-end

1. On the webhook page → Recent Deliveries: the `ping` should be 200.
2. Make a trivial change in any indexed repo (e.g. edit a repo
   description), or redeliver the ping.
3. Watch https://github.com/cdli-nlschools/applications-index/actions —
   a `daily-refresh` run should start within a minute.

## If something breaks

- Webhook Recent Deliveries shows exactly what GitHub sent and what the
  Worker returned (401 = wrong secret, 502 = dispatch failed — check the
  `DISPATCH_TOKEN` permissions).
- The daily cron keeps the index fresh regardless, so a broken webhook
  degrades to today's behavior, never to a stale index.
