(() => {
  const socket = io();

  const $messages = document.getElementById('chat-messages');
  const $form = document.getElementById('chat-form');
  const $input = document.getElementById('chat-input');
  const $name = document.getElementById('chat-name');

  const render = (m) => {
    const item = document.createElement('div');
    item.className = 'chat-msg';
    item.innerHTML = `<strong>${escapeHtml(m.name || 'مهمان')}</strong>: ${escapeHtml(m.text)}
      <small>${new Date(m.ts).toLocaleString('fa-IR')}</small>`;
    $messages.appendChild(item);
    $messages.scrollTop = $messages.scrollHeight;
  };

  const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  socket.on('chat:init', (list) => {
    $messages.innerHTML = '';
    list.forEach(render);
  });

  socket.on('chat:broadcast', render);

  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      name: ($name.value || 'مهمان').trim(),
      text: ($input.value || '').trim()
    };
    if (!payload.text) return;
    socket.emit('chat:msg', payload);
    $input.value = '';
    $input.focus();
  });
})();
