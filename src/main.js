async function render() {
  try {
    // Use a relative path so the request resolves under /applications-index/
    const res = await fetch('data/applications.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const list = document.getElementById('list');
    if (!apps || apps.length === 0) {
      list.innerText = 'No applications found.';
      return;
    }

    const ul = document.createElement('ul');
    apps.forEach(a => {
      const li = document.createElement('li');

      const title = document.createElement('a');
      title.href = a.url || '#';
      title.textContent = a.name || 'Unnamed';
      title.target = '_blank';
      li.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${a.category || ''}${a.status ? ' · ' + a.status : ''}`;
      li.appendChild(meta);

      ul.appendChild(li);
    });

    list.innerHTML = '';
    list.appendChild(ul);
  } catch (e) {
    const list = document.getElementById('list');
    if (list) list.innerText = 'Error loading data: ' + e.message;
    else console.error(e);
  }
}

render();
