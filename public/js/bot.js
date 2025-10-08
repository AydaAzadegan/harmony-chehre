console.log('bot.js loaded');

(() => {
  const panel = document.getElementById('bot-panel');
  const toggle = document.getElementById('bot-toggle');
  const closeBtn = document.getElementById('bot-close');
  const log = document.getElementById('bot-log');
  const form = document.getElementById('bot-form');
  const input = document.getElementById('bot-input');

  if (!panel || !toggle) {
    console.warn('Chatbot HTML not found in layout');
    return;
  }

  const add = (who, html) => {
    const row = document.createElement('div');
    row.style.margin = '8px 0';
    row.dir = 'rtl';
    row.innerHTML =
      who === 'bot'
        ? `<div style="background:#F4F7F0; border:1px solid var(--border); padding:8px 10px; border-radius:12px; display:inline-block; max-width:92%;">${html}</div>`
        : `<div style="background:#eef4ff; border:1px solid #d6e3ff; padding:8px 10px; border-radius:12px; display:inline-block; max-width:92%; margin-inline-start:auto;">${escapeHtml(html)}</div>`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  };

  const greet =
    'سلام! من دستیار کلینیک هارمونی چهره هستم. درباره خدمات، ساعات کاری، آدرس و رزرو بپرسید یا «رزرو» را بزنید.';
  const chips = (arr) =>
    `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
      ${arr.map(t=>`<button type="button" class="chip" data-q="${t}" style="border:1px solid var(--border); background:#fff; border-radius:999px; padding:6px 10px; cursor:pointer;">${t}</button>`).join('')}
     </div>`;

  let leadState = null;

  function startLead(){
    leadState = { step:1, service:'', name:'', phone:'' };
    add('bot','برای رزرو کدام خدمت؟' + chips(['بوتاکس','فیلر لب','فیلر گونه و چانه','فیلر خط فک'])); wireChips();
  }

  async function handleLead(text){
    if(!leadState) return false;
    const t = normalize(text);
    if(leadState.step===1){
      if(/بوتاکس/.test(t)) leadState.service='بوتاکس';
      else if(/فيلر لب|فیلر لب|لب/.test(t)) leadState.service='فیلر لب';
      else if(/گونه|چانه/.test(t)) leadState.service='فیلر گونه و چانه';
      else if(/فك|فک|خط فک|jaw/.test(t)) leadState.service='فیلر خط فک';
      else { add('bot','یکی را انتخاب کنید:' + chips(['بوتاکس','فیلر لب','فیلر گونه و چانه','فیلر خط فک'])); wireChips(); return true; }
      leadState.step=2; add('bot',`عالی! نام و نام خانوادگی؟`); return true;
    }
    if(leadState.step===2){
      if(t.length<2){ add('bot','نام معتبر نیست.'); return true; }
      leadState.name=text.trim(); leadState.step=3; add('bot','شماره تماس؟ (0915… یا +98915…)'); return true;
    }
    if(leadState.step===3){
      const phone=(text||'').replace(/\s+/g,'');
      if(!/^(?:\+?98|0)?9\d{9}$/.test(phone)){ add('bot','فرمت شماره درست نیست.'); return true; }
      leadState.phone = phone.startsWith('0') ? '+98'+phone.slice(1) : phone.startsWith('+') ? phone : '+98'+phone;
      try{
        await fetch('/api/bot/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(leadState)});
        add('bot','درخواست ثبت شد. تماس فوری: <a href="tel:+989150739223">+98 915 073 9223</a>');
      }catch{ add('bot','خطا در ثبت. لطفاً تلفنی تماس بگیرید.'); }
      leadState=null; return true;
    }
    return false;
  }

  async function askServer(text){
    const r = await fetch('/api/bot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:text})});
    const data = await r.json().catch(()=>({})); return data?.a || 'متوجه نشدم.';
  }

  document.getElementById('bot-toggle').onclick=()=>{
    panel.style.display = panel.style.display==='block' ? 'none' : 'block';
    if(panel.style.display==='block' && !log.dataset.hi){
      add('bot',greet + chips(['رزرو','بوتاکس','فیلر لب','فیلر گونه و چانه','فیلر خط فک','ساعت کاری','آدرس'])); wireChips(); log.dataset.hi='1';
    }
  };
  document.getElementById('bot-close').onclick=()=>panel.style.display='none';

  document.getElementById('bot-form').onsubmit=async(e)=>{
    e.preventDefault();
    const text=(input.value||'').trim(); if(!text) return;
    add('user',text); input.value='';
    if(await handleLead(text)) return;
    if(/^رزرو$|^نوبت$|^مشاوره$/.test(normalize(text))) { startLead(); return; }
    const a=await askServer(text);
    add('bot',a + chips(['رزرو','بوتاکس','فیلر لب','فیلر گونه و چانه','فیلر خط فک','ساعت کاری','آدرس'])); wireChips();
  };

  function wireChips(){
    log.querySelectorAll('.chip').forEach(btn=>{
      btn.onclick=async()=>{
        const t=btn.getAttribute('data-q');
        add('user',t);
        if(t==='رزرو'){ startLead(); return; }
        if(leadState && leadState.step===1){ await handleLead(t); return; }
        const a=await askServer(t);
        add('bot',a + chips(['رزرو','بوتاکس','فیلر لب','فیلر گونه و چانه','فیلر خط فک','ساعت کاری','آدرس'])); wireChips();
      };
    });
  }

  function normalize(s){ return String(s||'').toLowerCase().replace(/[اآ]/g,'ا').replace(/ي/g,'ی').replace(/ك/g,'ک'); }
  function escapeHtml(s){ return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();
