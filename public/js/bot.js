// @ts-nocheck
// public/js/bot.js

document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);

  const panel  = $('bot-panel');
  const toggle = $('bot-toggle');
  const closeB = $('bot-close');
  const log    = $('bot-log');
  const form   = $('bot-form');
  const input  = $('bot-input');

  if (!panel || !toggle || !log || !form || !input) {
    console.error('[bot] missing elements', {panel, toggle, log, form, input});
    return;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  function add(who, html) {
    const row = document.createElement('div');
    row.style.margin = '8px 0';
    row.innerHTML = who === 'bot'
      ? `<div style="background:#F4F7F0; border:1px solid var(--border); padding:8px 10px; border-radius:10px; display:inline-block; max-width:90%;">${html}</div>`
      : `<div style="background:#eef4ff; border:1px solid #d6e3ff; padding:8px 10px; border-radius:10px; display:inline-block; max-width:90%; margin-inline-start:auto;">${escapeHtml(html)}</div>`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  async function ask(text) {
    try {
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text })
      });
      const data = await res.json().catch(() => ({}));
      return data?.a || 'پاسخی دریافت نشد.';
    } catch (e) {
      console.error('[bot] ask error', e);
      return 'اتصال برقرار نشد.';
    }
  }

  function chipsHtml() {
    const items = ['بوتاکس','فیلر لب','فیلر گونه و چانه','فیلر خط فک','ساعت کاری','آدرس','رزرو'];
    return `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
      ${items.map(t => `<button type="button" class="chip" data-q="${t}"
         style="border:1px solid var(--border); background:#fff; border-radius:999px; padding:6px 10px; cursor:pointer;">${t}</button>`).join('')}
    </div>`;
  }

  function wireChips() {
    log.querySelectorAll('.chip').forEach(btn => {
      btn.onclick = async () => {
        const text = btn.getAttribute('data-q');
        add('user', text);
        const a = await ask(text);
        add('bot', a + chipsHtml());
        wireChips();
      };
    });
  }

  const hello = 'سلام! من دستیار کلینیک هارمونی چهره هستم. درباره «بوتاکس»، «فیلر لب»، «گونه و چانه»، «خط فک»، ساعات کاری، آدرس و رزرو بپرسید.';

  toggle.onclick = () => {
    const visible = panel.style.display === 'block';
    panel.style.display = visible ? 'none' : 'block';
    if (!visible && !log.dataset.hello) {
      add('bot', hello + chipsHtml());
      log.dataset.hello = '1';
      wireChips();
    }
  };

  if (closeB) closeB.onclick = () => { panel.style.display = 'none'; };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = (input.value || '').trim();
    if (!text) return;
    add('user', text);
    input.value = '';
    const a = await ask(text);
    add('bot', a + chipsHtml());
    wireChips();
  };

  console.log('[bot] ready');
});
