let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let filter = 'all';

  const list = document.getElementById('todo-list');
  const input = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskCount = document.getElementById('task-count');
  const footerCount = document.getElementById('footer-count');
  const emptyEl = document.getElementById('empty');
  const clearDoneBtn = document.getElementById('clear-done');

  function save() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

  function render() {
    list.innerHTML = '';
    const filtered = tasks.filter(t =>
      filter === 'all' ? true : filter === 'done' ? t.done : !t.done
    );

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (task.done ? ' done' : '');
      li.dataset.id = task.id;

      const checkBtn = document.createElement('button');
      checkBtn.className = 'check-btn' + (task.done ? ' checked' : '');
      checkBtn.title = task.done ? 'Mark active' : 'Mark done';
      checkBtn.addEventListener('click', () => toggle(task.id));

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.innerHTML = '✕';
      del.title = 'Delete';
      del.addEventListener('click', () => remove(task.id));

      li.append(checkBtn, span, del);
      list.appendChild(li);
    });

    const remaining = tasks.filter(t => !t.done).length;
    const done = tasks.filter(t => t.done).length;
    taskCount.textContent = remaining;
    footerCount.textContent = `${done} of ${tasks.length} done`;
    emptyEl.style.display = filtered.length === 0 ? 'block' : 'none';
  }

  function addTask() {
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    tasks.unshift({ id: Date.now(), text, done: false });
    save(); render();
    input.value = '';
    input.focus();
  }

  function toggle(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    save(); render();
  }

  function remove(id) {
    const li = list.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.style.transition = 'opacity 0.2s, transform 0.2s';
      li.style.opacity = '0';
      li.style.transform = 'translateX(20px)';
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        save(); render();
      }, 200);
    }
  }

  addBtn.addEventListener('click', addTask);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  clearDoneBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.done);
    save(); render();
  });

  render();