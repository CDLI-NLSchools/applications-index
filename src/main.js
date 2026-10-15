let apps = [];
let sortMode = 'name';
let activeTopics = new Set();

const listEl = document.getElementById('list');
const topicsEl = document.getElementById('topics');
const sortEl = document.getElementById('sort');
const countEl = document.getElementById('count');

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function embedCode(a, height) {
  const title = (a.name || 'Application').replace(/"/g, '&quot;');
  return `<iframe src="${a.url}" width="100%" height="${height}" style="border:0;" title="${title}" allowfullscreen></iframe>`;
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 1500);
}

let openPop = null;
function closeShare() {
  if (openPop) { openPop.remove(); openPop = null; }
  document.removeEventListener('click', outsideClose);
}
function outsideClose(e) {
  if (openPop && !openPop.contains(e.target)) closeShare();
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeShare(); });

function toggleShare(a, btn) {
  if (openPop && openPop.dataset.app === a.name) { closeShare(); return; }
  closeShare();

  const pop = document.createElement('div');
  pop.className = 'share-pop';
  pop.dataset.app = a.name;
  pop.addEventListener('click', (e) => e.stopPropagation());

  const copyLink = document.createElement('button');
  copyLink.type = 'button';
  copyLink.className = 'share-action';
  copyLink.textContent = 'Copy link';
  copyLink.addEventListener('click', () => copyText(a.url, copyLink));
  pop.appendChild(copyLink);

  const emb = document.createElement('div');
  emb.className = 'share-embed';
  const lab = document.createElement('span');
  lab.className = 'share-label';
  lab.textContent = 'Embed in Brightspace';
  emb.appendChild(lab);

  const sel = document.createElement('select');
  [['480', 'Small — 480px tall'], ['640', 'Medium — 640px tall'], ['800', 'Large — 800px tall']].forEach(([v, t]) => {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = t;
    if (v === '640') o.selected = true;
    sel.appendChild(o);
  });
  emb.appendChild(sel);

  const code = document.createElement('textarea');
  code.readOnly = true;
  code.rows = 3;
  code.className = 'embed-code';
  const refresh = () => { code.value = embedCode(a, sel.value); };
  sel.addEventListener('change', refresh);
  refresh();
  emb.appendChild(code);

  const copyEmb = document.createElement('button');
  copyEmb.type = 'button';
  copyEmb.className = 'share-action';
  copyEmb.textContent = 'Copy embed code';
  copyEmb.addEventListener('click', () => copyText(code.value, copyEmb));
  emb.appendChild(copyEmb);
  pop.appendChild(emb);

  if (a.download_url) {
    const dl = document.createElement('button');
    dl.type = 'button';
    dl.className = 'share-action';
    dl.textContent = 'Download HTML file';
    dl.addEventListener('click', async () => {
      const orig = dl.textContent;
      dl.textContent = 'Downloading…';
      try {
        const res = await fetch(a.download_url);
        if (!res.ok) throw new Error('fetch failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const tmp = document.createElement('a');
        tmp.href = url;
        tmp.download = a.name + '.html';
        document.body.appendChild(tmp);
        tmp.click();
        tmp.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } catch (e) {
        window.open(a.download_url, '_blank');
      }
      dl.textContent = orig;
    });
    pop.appendChild(dl);
  }

  btn.closest('.card').appendChild(pop);
  openPop = pop;
  setTimeout(() => document.addEventListener('click', outsideClose), 0);
}

function filtered() {
  if (activeTopics.size === 0) return apps.slice();
  return apps.filter(a => (a.tags || []).some(t => activeTopics.has(t)));
}

function sorted(list) {
  const by = {
    name: (a, b) => (a.name || '').localeCompare(b.name || ''),
    newest: (a, b) => (b.created_at || '').localeCompare(a.created_at || ''),
    updated: (a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''),
    teacher: (a, b) =>
      ((a.creator && a.creator.login) || 'zzz').localeCompare((b.creator && b.creator.login) || 'zzz') ||
      (a.name || '').localeCompare(b.name || ''),
  }[sortMode];
  if (by) return list.sort(by);
  // topic: group by first tag, groups alphabetical, names within group
  return list.sort((a, b) => {
    const ta = (a.tags && a.tags[0]) || 'Untagged';
    const tb = (b.tags && b.tags[0]) || 'Untagged';
    return ta.localeCompare(tb) || (a.name || '').localeCompare(b.name || '');
  });
}

function card(a) {
  const li = document.createElement('li');
  li.className = 'card';

  const title = document.createElement('a');
  title.href = a.url || '#';
  title.target = '_blank';
  title.className = 'card-title';
  title.textContent = a.name || 'Unnamed';
  li.appendChild(title);

  if (a.description) {
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = a.description;
    li.appendChild(desc);
  }

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  if (a.creator && a.creator.login) {
    const by = document.createElement('a');
    by.href = a.creator.url || '#';
    by.target = '_blank';
    by.className = 'creator';
    if (a.creator.avatar_url) {
      const img = document.createElement('img');
      img.src = a.creator.avatar_url;
      img.alt = '';
      img.className = 'avatar';
      img.loading = 'lazy';
      by.appendChild(img);
    }
    const who = document.createElement('span');
    who.textContent = 'by ' + a.creator.login;
    by.appendChild(who);
    meta.appendChild(by);
  }

  if (a.updated_at) {
    const upd = document.createElement('span');
    upd.className = 'updated';
    upd.textContent = 'Updated ' + fmtDate(a.updated_at);
    meta.appendChild(upd);
  }

  if (a.repo) {
    const src = document.createElement('a');
    src.href = a.repo;
    src.target = '_blank';
    src.className = 'repo-link';
    src.textContent = 'Source';
    meta.appendChild(src);
  }

  const shareBtn = document.createElement('button');
  shareBtn.type = 'button';
  shareBtn.className = 'share-btn';
  shareBtn.textContent = 'Share';
  shareBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleShare(a, shareBtn); });
  meta.appendChild(shareBtn);

  li.appendChild(meta);

  if (a.tags && a.tags.length > 0) {
    const tags = document.createElement('div');
    tags.className = 'tags';
    a.tags.forEach(t => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tag';
      chip.textContent = t;
      chip.title = 'Filter by this topic';
      chip.addEventListener('click', () => { toggleTopic(t); });
      tags.appendChild(chip);
    });
    li.appendChild(tags);
  }

  return li;
}

function render() {
  const list = sorted(filtered());
  listEl.innerHTML = '';

  if (list.length === 0) {
    listEl.innerText = activeTopics.size === 0 ? 'No applications found.' : 'No applications match the selected topics.';
    return;
  }

  if (sortMode === 'topic' || sortMode === 'teacher') {
    const groupOf = sortMode === 'topic'
      ? (a) => (a.tags && a.tags[0]) || 'Untagged'
      : (a) => (a.creator && a.creator.login) || 'Unknown';
    // Teacher groups are already ordered by the sort; topic groups too.
    let currentGroup = null;
    let ul = null;
    list.forEach(a => {
      const g = groupOf(a);
      if (g !== currentGroup) {
        currentGroup = g;
        const h = document.createElement('h2');
        h.className = 'topic-heading';
        h.textContent = sortMode === 'teacher' ? 'by ' + g : g;
        listEl.appendChild(h);
        ul = document.createElement('ul');
        ul.className = 'cards';
        listEl.appendChild(ul);
      }
      ul.appendChild(card(a));
    });
  } else {
    const ul = document.createElement('ul');
    ul.className = 'cards';
    list.forEach(a => ul.appendChild(card(a)));
    listEl.appendChild(ul);
  }

  countEl.textContent = `${apps.length} application${apps.length === 1 ? '' : 's'}`;
}

function renderTopics() {
  const counts = {};
  apps.forEach(a => (a.tags || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  const topics = Object.keys(counts).sort();
  topicsEl.innerHTML = '';
  if (topics.length === 0) return;

  const all = document.createElement('button');
  all.type = 'button';
  all.className = 'topic-chip' + (activeTopics.size === 0 ? ' active' : '');
  all.textContent = `All (${apps.length})`;
  all.title = 'Clear topic selection';
  all.addEventListener('click', () => setTopics(new Set()));
  topicsEl.appendChild(all);

  topics.forEach(t => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'topic-chip' + (activeTopics.has(t) ? ' active' : '');
    b.textContent = `${t} (${counts[t]})`;
    b.setAttribute('aria-pressed', activeTopics.has(t) ? 'true' : 'false');
    b.addEventListener('click', () => toggleTopic(t));
    topicsEl.appendChild(b);
  });
}

function toggleTopic(t) {
  const next = new Set(activeTopics);
  if (next.has(t)) next.delete(t);
  else next.add(t);
  setTopics(next);
}

function setTopics(next) {
  activeTopics = next;
  renderTopics();
  render();
}

async function init() {
  sortEl.addEventListener('change', () => { sortMode = sortEl.value; render(); });
  try {
    // Relative path so the request resolves under /applications-index/.
    // no-store so a fresh page load always picks up the daily refresh,
    // even if the browser cached yesterday's JSON.
    const res = await fetch('data/applications.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    apps = await res.json();
    renderTopics();
    render();
  } catch (e) {
    listEl.innerText = 'Error loading data: ' + e.message;
  }
}

init();
