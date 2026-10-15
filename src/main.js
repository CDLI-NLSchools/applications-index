let apps = [];
let sortMode = 'name';
let activeTopic = 'all';

const listEl = document.getElementById('list');
const topicsEl = document.getElementById('topics');
const sortEl = document.getElementById('sort');
const countEl = document.getElementById('count');

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function filtered() {
  if (activeTopic === 'all') return apps.slice();
  return apps.filter(a => (a.tags || []).includes(activeTopic));
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

  li.appendChild(meta);

  if (a.tags && a.tags.length > 0) {
    const tags = document.createElement('div');
    tags.className = 'tags';
    a.tags.forEach(t => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tag';
      chip.textContent = t;
      chip.addEventListener('click', () => { setTopic(t); });
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
    listEl.innerText = activeTopic === 'all' ? 'No applications found.' : 'No applications with this topic yet.';
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
  all.className = 'topic-chip' + (activeTopic === 'all' ? ' active' : '');
  all.textContent = `All (${apps.length})`;
  all.addEventListener('click', () => setTopic('all'));
  topicsEl.appendChild(all);

  topics.forEach(t => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'topic-chip' + (activeTopic === t ? ' active' : '');
    b.textContent = `${t} (${counts[t]})`;
    b.addEventListener('click', () => setTopic(t));
    topicsEl.appendChild(b);
  });
}

function setTopic(t) {
  activeTopic = t;
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
