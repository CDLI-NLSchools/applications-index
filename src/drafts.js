let drafts = [];
let sortMode = 'name';
let activeTopics = new Set();
let query = '';

const listEl = document.getElementById('list');
const topicsEl = document.getElementById('topics');
const sortEl = document.getElementById('sort');
const searchEl = document.getElementById('search');
const countEl = document.getElementById('count');

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function filtered() {
  let list = drafts.slice();
  if (activeTopics.size > 0) {
    list = list.filter(a => (a.tags || []).some(t => activeTopics.has(t)));
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(a =>
      (a.name || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q)) ||
      ((a.creator && a.creator.login) || '').toLowerCase().includes(q));
  }
  return list;
}

function courseOf(a) {
  return (a.courses && a.courses[0] && a.courses[0].name) || 'Untagged';
}

function sorted(list) {
  const by = {
    name: (a, b) => (a.name || '').localeCompare(b.name || ''),
    newest: (a, b) => (b.created_at || '').localeCompare(a.created_at || ''),
    updated: (a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''),
    teacher: (a, b) =>
      ((a.creator && a.creator.login) || 'zzz').localeCompare((b.creator && b.creator.login) || 'zzz') ||
      (a.name || '').localeCompare(b.name || ''),
    course: (a, b) => {
      const ca = courseOf(a), cb = courseOf(b);
      if (ca === 'Untagged' && cb !== 'Untagged') return 1;
      if (cb === 'Untagged' && ca !== 'Untagged') return -1;
      return ca.localeCompare(cb) || (a.name || '').localeCompare(b.name || '');
    },
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

  const badge = document.createElement('span');
  badge.className = 'draft-badge';
  badge.textContent = 'Draft: awaiting QA';
  li.appendChild(badge);

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
    listEl.innerText = drafts.length === 0
      ? 'No drafts are awaiting QA right now.'
      : 'No drafts match your search or the selected topics.';
    countEl.textContent = `${drafts.length} draft${drafts.length === 1 ? '' : 's'} awaiting QA`;
    return;
  }

  if (sortMode === 'topic' || sortMode === 'teacher' || sortMode === 'course') {
    const groupOf = sortMode === 'topic'
      ? (a) => (a.tags && a.tags[0]) || 'Untagged'
      : sortMode === 'teacher'
        ? (a) => (a.creator && a.creator.login) || 'Unknown'
        : courseOf;
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

  countEl.textContent = `${drafts.length} draft${drafts.length === 1 ? '' : 's'} awaiting QA`;
}

function renderTopics() {
  const counts = {};
  drafts.forEach(a => (a.tags || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  const topics = Object.keys(counts).sort();
  topicsEl.innerHTML = '';
  if (topics.length === 0) return;

  const all = document.createElement('button');
  all.type = 'button';
  all.className = 'topic-chip' + (activeTopics.size === 0 ? ' active' : '');
  all.textContent = `All (${drafts.length})`;
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
  searchEl.addEventListener('input', () => { query = searchEl.value.trim(); render(); });
  try {
    // Relative path so the request resolves under /applications-index/.
    // no-store so a fresh page load always picks up the daily refresh,
    // even if the browser cached yesterday's JSON.
    const res = await fetch('data/drafts.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    drafts = await res.json();
    renderTopics();
    render();
  } catch (e) {
    listEl.innerText = 'Error loading data: ' + e.message;
  }
}

init();
