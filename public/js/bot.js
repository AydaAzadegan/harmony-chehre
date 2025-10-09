(() => {
  const panel = document.getElementById('bot-panel');
  const toggle = document.getElementById('bot-toggle');
  const closeBtn = document.getElementById('bot-close');
  const log = document.getElementById('bot-log');
  const form = document.getElementById('bot-form');
  const input = document.getElementById('bot-input');

  if (!toggle || !panel || !form || !input || !log) return;

  const add = (who, html) => {
    const row = document.createElement('div');
    row.style.margin = '8px 0';
    row.innerHTML = who === 'bot'
      ? `<div style="background:#F4F7F0; border:1px solid var(--border); padding:8px 10px; border-radius:10px; display:inline-block; max-width:90%;">${html}</div>`
      : `<div style="background:#eef4ff; border:1px solid #d6e3ff; padding:8px 10px; border-radius:10px; display:inline-block; max-width:90%; margin-inline-start:auto;">${escapeHtml(html)}</div>`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  };

  const hello = 'سلام! من دستیار کلینیک هارمونی چهره هستم. درباره «بوتاکس»، «فیلر لب»، «گونه و چانه»، «خط فک»، ساعات کاری، آدرس و رزرو بپرسید.';
  const chips = () =>
    `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
      ${['بوتاکس','فیلر لب','فیلر گونه و چانه','فیلر خط فک','ساعت کاری','آدرس','رزرو'].map(t =>
        `<button type="button" class="chip" data-q="${t}"
         style="border:1px solid var(--border); background:#fff; border-radius:999px; padding:6px 10px; cursor:pointer;">${t}</button>`
      ).join('')}
     </div>`;

  async function ask(text){
    try{
      const res = await fetch('/api/bot', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ q: text })
      });
      const data = await res.json();
      return data?.a || 'پاسخی دریافت نشد.';
    } catch(e){
      return 'اتصال برقرار نشد.';
    }
  }

  toggle.addEventListener('click', () => {
    const show = panel.style.display !== 'block';
    panel.style.display = show ? 'block' : 'none';
    if (show && !log.dataset.hello) {
      add('bot', hello + chips());
      log.dataset.hello = '1';
      wireChips();
    }
  });
  closeBtn.addEventListener('click', () => panel.style.display = 'none');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = (input.value || '').trim();
    if (!text) return;
    add('user', text);
    input.value = '';
    const a = await ask(text);
    add('bot', a + chips());
    wireChips();
  });

  function wireChips(){
    log.querySelectorAll('.chip').forEach(btn => {
      btn.onclick = async () => {
        const t = btn.getAttribute('data-q');
        add('user', t);
        const a = await ask(t);
        add('bot', a + chips());
        wireChips();
      };
    });
  }

  function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();
