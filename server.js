// server.js
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

// Templates (EJS + ejs-mate)
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// fetch polyfill for Node < 18 (safe on >=18 too)
const fetch = global.fetch || ((...args) => import('node-fetch').then(m => m.default(...args)));

app.set('trust proxy', 1);

// Static + parsers (must be before routes)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // needed for /api/bot and /api/bot/lead

// --- HTTP + Socket.IO ---
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

// ---------------- Data ----------------
const services = [
  { id:'botox', slug:'botox', title:'بوتاکس (تزریق بوتولینوم)', text:'کاهش خطوط پیشانی، اخم و پنجه‌کلاغی با نتیجه طبیعی و بدون حالت یخ‌زده.', cover:'/images/services/botox.jpg' },
  { id:'cheek-chin', slug:'cheek-chin-filler', title:'فیلر چانه و گونه', text:'بهبود برجستگی گونه و فرم چانه برای تناسب بهتر چهره با هیالورونیک اسید.', cover:'/images/services/cheek-chin.jpeg' },
  { id:'jawline', slug:'jawline-filler', title:'فیلر خط فک', text:'تعریف مرز فک، اصلاح افتادگی و زاویه‌سازی ملایم و طبیعی.', cover:'/images/services/jawline.jpeg' },
  { id:'lip', slug:'lip-filler', title:'فیلر لب (تزریق ژل لب)', text:'حجم‌دهی طبیعی، مرزبندی و اصلاح عدم تقارن با فیلر هیالورونیک اسید.', cover:'/images/services/lip.png' }
];

// ---------- Gallery (filesystem-driven) ----------
const gallerySections = [
  { key: 'lip',     title: 'فیلر لب' },
  { key: 'chin',    title: 'فیلر چانه' },
  { key: 'cheek',   title: 'فیلر گونه' },
  { key: 'jawline', title: 'فیلر خط فک' },
  { key: 'botox',   title: 'بوتاکس' },
];

function listImages(relDir) {
  const abs = path.join(__dirname, 'public', relDir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter(fn => /\.(jpe?g|png|webp|avif)$/i.test(fn))
    .sort()
    .map(fn => `/${relDir}/${fn}`);
}

// NOTE: looks in /public/images/gallery/{lip,chin,cheek or chick,jawline,botox}
const photos = {
  lip:     listImages('images/gallery/lip'),
  chin:    listImages('images/gallery/chin'),
  cheek:   [...listImages('images/gallery/cheek'), ...listImages('images/gallery/chick')],
  jawline: listImages('images/gallery/jawline'),
  botox:   listImages('images/gallery/botox'),
};

// ---------------- Long service content (unchanged) ----------------
const serviceLongContent = {
  botox: {
    seo: { description: 'بوتاکس برای کاهش خطوط دینامیک پیشانی، اخم و اطراف چشم با نتیجه طبیعی در کلینیک هارمونی چهره. معاینه تخصصی، مواد دارای مجوز، و راهنمایی مراقبت بعد.' },
    body: `
      <h2>بوتاکس چیست و چگونه عمل می‌کند؟</h2>
      <p>بوتاکس (Botulinum Toxin) با مهار موقت انقباض برخی عضلات صورت، <strong>خطوط دینامیک</strong> مثل پیشانی، اخم و پنجه‌کلاغی را کاهش می‌دهد تا پوست <strong>صاف‌تر و جوان‌تر</strong> دیده شود. در کلینیک هارمونی چهره روی <em>طبیعی ماندن حالت چهره</em> تأکید داریم.</p>
      <h3>مزایا</h3>
      <ul><li>اصلاح خطوط بدون ایجاد حالت یخ‌زده</li><li>استفاده از برندهای دارای مجوز و معتبر</li><li>تنظیم دوز دقیق بر اساس آناتومی چهره</li><li>مراقبت‌های پس از تزریق و پیگیری</li></ul>
      <h3>کاندیدای مناسب</h3>
      <p>اگر خطوط اخم/پیشانی یا چین‌های اطراف چشم هنگام خندیدن/اخم کردن پررنگ می‌شود، گزینهٔ مناسبی هستید. در دوران بارداری/شیردهی انجام نمی‌شود.</p>
      <h3>فرآیند انجام</h3>
      <ol><li><strong>مشاوره و ارزیابی عضلات:</strong> تعیین نقاط دقیق تزریق</li><li><strong>آماده‌سازی:</strong> ضدعفونی و علامت‌گذاری</li><li><strong>تزریق سریع و کم‌درد:</strong> با سوزن ظریف در چند نقطهٔ هدف</li></ol>
      <h3>شروع اثر و ماندگاری</h3>
      <p>اثر اولیه طی <strong>۳–۷ روز</strong> ظاهر می‌شود و نتیجهٔ کامل حدود ۱۴ روز بعد دیده می‌شود. ماندگاری معمولاً <strong>۳–۶ ماه</strong> است.</p>
      <h3>مراقبت‌های بعد</h3>
      <ul><li>تا ۴ ساعت دراز نکشید و ناحیه را ماساژ ندهید</li><li>روز اول از ورزش سنگین و گرمای زیاد پرهیز کنید</li><li>در صورت نیاز، ویزیت تکمیلی بعد از ۲ هفته انجام می‌شود</li></ul>
      <div class="card" style="margin-top:12px"><p style="margin:0"><strong>مشاوره:</strong> <a href="tel:+989150739223">تماس</a> یا <a href="https://www.instagram.com/dr_atighinasab_/?hl=en" target="_blank" rel="noopener">اینستاگرام</a>.</p></div>
    `,
    faqs: [
      { q:'اثر بوتاکس کی شروع می‌شود؟', a:'بین ۳ تا ۷ روز آغاز می‌شود و نتیجهٔ کامل ~۱۴ روز.' },
      { q:'دوام؟', a:'۳ تا ۶ ماه (متغیر).' },
      { q:'بی‌حالت می‌شوم؟', a:'با تنظیم دوز و نقاط، نتیجه طبیعی است.' },
      { q:'نقاهت؟', a:'بازگشت سریع به فعالیت‌ها؛ کبودی خفیف ممکن است ۱–۳ روز.' },
    ]
  },
  'lip-filler': {
    seo: { description:'فیلر لب با هیالورونیک اسید برای حجم‌دهی طبیعی…' },
    body: `
      <h2>فیلر لب چیست؟</h2>
      <p>فیلر لب برای <strong>حجم‌دهی طبیعی</strong>، مرزبندی و <strong>اصلاح عدم تقارن</strong> استفاده می‌شود.</p>
      <h3>مراقبت‌های بعد</h3>
      <ul><li>۲۴ ساعت گرمای زیاد/باشگاه نروید</li><li>از ماساژ خودسرانه پرهیز کنید</li><li>نوشیدنی کافی؛ پرهیز از الکل/سیگار ۲۴–۴۸ ساعت</li></ul>
    `,
    faqs: [
      { q:'دوام؟', a:'معمولاً ۶–۱۲ ماه.' },
      { q:'طبیعی می‌شود؟', a:'بله، طراحی بر اساس تناسب چهره.' }
    ]
  },
  'cheek-chin-filler': {
    seo: { description:'فیلر گونه و چانه برای تناسب صورت…' },
    body: `<h2>فیلر چانه و گونه چیست؟</h2><p>تعادل نیم‌رخ با تقویت چانه و افزایش برجستگی گونه.</p>`,
    faqs: []
  },
  'jawline-filler': {
    seo: { description:'فیلر خط فک برای زاویه‌سازی ملایم…' },
    body: `<h2>فیلر خط فک</h2><p>تعریف مرز فک و زاویه‌سازی ظریف.</p>`,
    faqs: []
  }
};

// --------------- In-memory storage ----------------
const messages = []; // for Socket.IO site chat
const leads = [];    // chatbot lead capture

// ---------- Gemini usage guards + status/test (kept; no duplicates) ----------
const GEMINI_ENABLED = process.env.GEMINI_ENABLED !== 'false';
const GEMINI_DAILY_LIMIT = Number(process.env.GEMINI_DAILY_LIMIT || 100);
let geminiCallsToday = 0;
let geminiDate = new Date().toDateString();

function canUseGemini() {
  const today = new Date().toDateString();
  if (today !== geminiDate) { geminiDate = today; geminiCallsToday = 0; }
  return GEMINI_ENABLED && !!process.env.GOOGLE_GENAI_API_KEY && geminiCallsToday < GEMINI_DAILY_LIMIT;
}
function countGemini() { geminiCallsToday++; }

app.get('/_gemini_status', (req, res) => {
  res.json({ enabled: GEMINI_ENABLED, haveKey: !!process.env.GOOGLE_GENAI_API_KEY, limit: GEMINI_DAILY_LIMIT, callsToday: geminiCallsToday, date: geminiDate });
});

async function listGeminiModels() {
  const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
  const bases = ['v1','v1beta'];
  const out = [];
  for (const base of bases) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/${base}/models?key=${API_KEY}`);
      const j = await r.json();
      (j.models || []).forEach(m => out.push({ base, name: m.name }));
    } catch (_) {}
  }
  return out;
}
function pickBestFlashModel(models){
  const pref = [
    { base:'v1', name:'models/gemini-2.5-flash' },
    { base:'v1', name:'models/gemini-2.5-flash-lite' },
    { base:'v1', name:'models/gemini-2.0-flash' },
    { base:'v1', name:'models/gemini-2.0-flash-lite' },
    { base:'v1beta', name:'models/gemini-2.5-flash' },
    { base:'v1beta', name:'models/gemini-2.5-flash-lite' },
  ];
  const have = new Set(models.map(m => `${m.base}::${m.name}`));
  for (const p of pref) if (have.has(`${p.base}::${p.name}`)) return p;
  return models.find(m => /gemini-.*flash/i.test(m.name)) || null;
}
async function askGemini_FarsiClinic(userText, { verboseToUser = false } = {}) {
  const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
  if (!API_KEY) return null;

  const models = await listGeminiModels();
  const chosen = pickBestFlashModel(models);
  if (!chosen) return verboseToUser ? 'هیچ مدل سازگار (flash) برای این کلید فعال نیست.' : null;

  const { base, name } = chosen;
  const URL = `https://generativelanguage.googleapis.com/${base}/${name}:generateContent?key=${API_KEY}`;

  const SYSTEM = `تو دستیار کلینیک «هارمونی چهره» هستی و همیشه فارسی و کوتاه پاسخ می‌دهی.
- درباره بوتاکس و فیلرها و مراقبت‌های عمومی قبل/بعد، ایمن و عمومی توضیح بده.
- تشخیص/نسخه/قیمت قطعی نده؛ در موارد خاص تأکید کن معاینه لازم است.
- راه‌های تماس: +989150739223 ، @dr_atighinasab_.`;

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: "user", parts: [{ text: String(userText || '').slice(0, 2000) }] }],
    generationConfig: { maxOutputTokens: 350, temperature: 0.3 }
  };

  try {
    const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await r.json();
    if (!r.ok) return verboseToUser ? (data?.error?.message || String(r.status)) : null;
    const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return txt || (verboseToUser ? 'پاسخ خالی/مسدود.' : null);
  } catch (e) {
    return verboseToUser ? `خطای ارتباط: ${e?.message || e}` : null;
  }
}

app.get('/_gemini_models', async (req, res) => {
  try { res.json({ ok:true, models: await listGeminiModels() }); }
  catch (e) { res.status(500).json({ ok:false, error: e?.message || String(e) }); }
});
app.get('/_gemini_test', async (req, res) => {
  try { res.json({ ok:true, answer: await askGemini_FarsiClinic(req.query.q || 'سلام درباره بوتاکس کوتاه بگو.', { verboseToUser:true }) }); }
  catch (e) { res.status(500).json({ ok:false, error:e?.message || String(e) }); }
});

// ---------------- Routes ----------------
app.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'کلینیک زیبایی هارمونی چهره',
    services,
    sections: gallerySections, // ok even if you don’t use on homepage
    photos,                    // ok even if you don’t use on homepage
    messages,
    req
  });
});


app.get('/gallery', (req, res) => {
  res.render('gallery', {
    pageTitle: 'گالری نمونه کار | هارمونی چهره',
    sections: gallerySections,
    photos // <— FIXED: was galleryImages (undefined)
  });
});

app.get('/services/:slug', (req, res) => {
  const s = services.find(x => x.slug === req.params.slug);
  if (!s) return res.status(404).send('Service not found');
  const details = serviceLongContent[s.slug] || { body: '', faqs: [], seo: {} };
  const faqLd = details.faqs?.length ? {
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity": details.faqs.map(f => ({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))
  } : null;

  res.render('service', {
    pageTitle: `${s.title} | کلینیک زیبایی هارمونی چهره`,
    metaDescription: details.seo?.description || s.text,
    service: s, details, faqLd
  });
});

app.post('/contact', (req, res) => {
  const { name, phone, message } = req.body || {};
  console.log('Contact form:', { name, phone, message });
  return res.redirect('/#contact-success');
});

// ---------- Chatbot: FAQ / intents ----------
app.post('/api/bot', async (req, res) => {
  const raw = String(req.body?.q || '');
  const norm = raw.toLowerCase()
    .replace(/[اآ]/g,'ا').replace(/ي/g,'ی').replace(/ك/g,'ک')
    .replace(/[^\u0600-\u06FFa-z0-9\s]/g,'').trim();

  const reply = (t) => res.json({ a: t });

  // Safety first
  if (/درد شديد|خونريزي|خونریزی|اورژانس|سوزش شديد/.test(norm)) {
    return reply(`اگر علائم شدید دارید لطفاً فوراً تماس بگیرید: <a href="tel:+989150739223">+98 915 073 9223</a>`);
  }

  // Fast keyword intents
  if (/بوتاکس|بوتكس|botox/.test(norm)) {
    return reply(`بوتاکس خطوط پیشانی/اخم/اطراف چشم را کاهش می‌دهد. شروع اثر ۳–۷ روز، نتیجه کامل ~۱۴ روز، ماندگاری ۳–۶ ماه.
      صفحه جزئیات: <a href="/services/botox">/services/botox</a>`);
  }
  if (/فيلر لب|فیلر لب|ژل لب|lip/.test(norm)) {
    return reply(`فیلر لب برای حجم‌دهی طبیعی و مرزبندی؛ ماندگاری ۶–۱۲ ماه.
      صفحه جزئیات: <a href="/services/lip-filler">/services/lip-filler</a>`);
  }
  if (/گونه|چانه/.test(norm)) {
    return reply(`فیلر گونه و چانه برای تعادل چهره؛ ماندگاری ۹–۱۲ ماه.
      صفحه جزئیات: <a href="/services/cheek-chin-filler">/services/cheek-chin-filler</a>`);
  }
  if (/فك|فک|خط فک|jaw/.test(norm)) {
    return reply(`فیلر خط فک برای زاویه‌سازی ملایم؛ ماندگاری ~۱۲ ماه.
      صفحه جزئیات: <a href="/services/jawline-filler">/services/jawline-filler</a>`);
  }
  if (/ساعت|باز|working|hours/.test(norm)) {
    return reply(`ساعات کاری: شنبه تا پنجشنبه ۱۰ تا ۱۹ — جمعه تعطیل.`);
  }
  if (/آدرس|لوکيشن|لوکیشن|location|نقشه|کجاست/.test(norm)) {
    return reply(`نقشه: <a href="https://www.google.com/maps?q=36.328056,59.535389" target="_blank" rel="noopener">Google Maps</a>`);
  }
  if (/رزرو|نوبت|مشاوره|booking|reserve/.test(norm)) {
    return reply(`برای رزرو «رزرو» را بزنید تا اطلاعات تماس شما ثبت شود.`);
  }

  // Fallback → Gemini
  if (canUseGemini()) {
    const ans = await askGemini_FarsiClinic(raw);
    countGemini();
    if (ans) return reply(ans);
  }
  return reply('در حال حاضر پاسخ هوشمند دردسترس نیست.');
});

// ---------- Chatbot: Lead capture ----------
app.post('/api/bot/lead', (req, res) => {
  const { service = '', name = '', phone = '' } = req.body || {};
  const p = String(phone).replace(/\s+/g, '');
  if (!service || !name || !/^(?:\+?98|0)?9\d{9}$/.test(p)) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }
  const phoneE164 = p.startsWith('0') ? '+98' + p.slice(1) : p.startsWith('+') ? p : '+98' + p;

  const lead = { service:String(service), name:String(name), phone:phoneE164, ts:new Date().toISOString(), source:'chatbot' };
  leads.push(lead);
  console.log('New lead (chatbot):', lead);
  return res.json({ ok: true });
});

// ---------- Socket.IO (simple site chat) ----------
io.on('connection', (socket) => {
  socket.emit('chat:init', messages.slice(-30));
  socket.on('chat:msg', (payload) => {
    const msg = {
      id: Date.now() + ':' + socket.id,
      text: String(payload?.text || '').slice(0, 500),
      name: String(payload?.name || 'مهمان').slice(0, 40),
      ts: new Date().toISOString()
    };
    if (!msg.text.trim()) return;
    messages.push(msg);
    io.emit('chat:broadcast', msg);
  });
});

// ---------------- Start ----------------
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Harmony Chehre Beauty Clinic running at http://localhost:${PORT}`);
});
