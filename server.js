// server.js
const path = require('path');
const express = require('express');
const app = express();

// Templating (EJS + ejs-mate layouts)
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Trust proxy (Render/Reverse proxies)
app.set('trust proxy', 1);

// Static + parsers
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // <-- needed for /api/bot and /api/bot/lead

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // MUST be enabled before /api/bot

// --- HTTP + Socket.IO ---
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

// ---------------- Data ----------------
const services = [
  {
    id: 'botox',
    slug: 'botox',
    title: 'بوتاکس (تزریق بوتولینوم)',
    text: 'کاهش خطوط پیشانی، اخم و پنجه‌کلاغی با نتیجه طبیعی و بدون حالت یخ‌زده.',
    cover: '/images/services/botox.jpg' // مطمئن شو فایل دقیقاً با همین نام هست (حساس به حروف)
  },
  {
    id: 'cheek-chin',
    slug: 'cheek-chin-filler',
    title: 'فیلر چانه و گونه',
    text: 'بهبود برجستگی گونه و فرم چانه برای تناسب بهتر چهره با هیالورونیک اسید.',
    cover: '/images/services/cheek-chin.jpeg'
  },
  {
    id: 'jawline',
    slug: 'jawline-filler',
    title: 'فیلر خط فک',
    text: 'تعریف مرز فک، اصلاح افتادگی و زاویه‌سازی ملایم و طبیعی.',
    cover: '/images/services/jawline.jpeg'
  },
  {
    id: 'lip',
    slug: 'lip-filler',
    title: 'فیلر لب (تزریق ژل لب)',
    text: 'حجم‌دهی طبیعی، مرزبندی و اصلاح عدم تقارن با فیلر هیالورونیک اسید.',
    cover: '/images/services/lip.png'
  }
];

const serviceLongContent = {
  botox: {
    seo: {
      description:
        'بوتاکس برای کاهش خطوط دینامیک پیشانی، اخم و اطراف چشم با نتیجه طبیعی در کلینیک هارمونی چهره. معاینه تخصصی، مواد دارای مجوز، و راهنمایی مراقبت بعد.'
    },
    body: `
      <h2>بوتاکس چیست و چگونه عمل می‌کند؟</h2>
      <p>بوتاکس (Botulinum Toxin) با مهار موقت انقباض برخی عضلات صورت، <strong>خطوط دینامیک</strong> مثل پیشانی، اخم و پنجه‌کلاغی را کاهش می‌دهد تا پوست <strong>صاف‌تر و جوان‌تر</strong> دیده شود. در کلینیک هارمونی چهره روی <em>طبیعی ماندن حالت چهره</em> تأکید داریم.</p>

      <h3>مزایای بوتاکس در هارمونی چهره</h3>
      <ul>
        <li>اصلاح خطوط بدون ایجاد حالت یخ‌زده</li>
        <li>استفاده از برندهای دارای مجوز و معتبر</li>
        <li>تنظیم دوز دقیق بر اساس آناتومی چهره</li>
        <li>مراقبت‌های پس از تزریق و پیگیری</li>
      </ul>

      <h3>کاندیدای مناسب</h3>
      <p>اگر خطوط اخم/پیشانی یا چین‌های اطراف چشم هنگام خندیدن/اخم کردن پررنگ می‌شود، گزینهٔ مناسبی هستید. در دوران بارداری/شیردهی انجام نمی‌شود.</p>

      <h3>فرآیند انجام</h3>
      <ol>
        <li><strong>مشاوره و ارزیابی عضلات:</strong> تعیین نقاط دقیق تزریق</li>
        <li><strong>آماده‌سازی:</strong> ضدعفونی و علامت‌گذاری</li>
        <li><strong>تزریق سریع و کم‌درد:</strong> با سوزن ظریف در چند نقطهٔ هدف</li>
      </ol>

      <h3>شروع اثر و ماندگاری</h3>
      <p>اثر اولیه طی <strong>۳–۷ روز</strong> ظاهر می‌شود و نتیجهٔ کامل حدود ۱۴ روز بعد دیده می‌شود. ماندگاری معمولاً <strong>۳–۶ ماه</strong> است و با تکرار منظم پایدارتر می‌شود.</p>

      <h3>مراقبت‌های بعد</h3>
      <ul>
        <li>تا ۴ ساعت دراز نکشید و ناحیه را ماساژ ندهید</li>
        <li>روز اول از ورزش سنگین و گرمای زیاد پرهیز کنید</li>
        <li>در صورت نیاز، ویزیت تکمیلی بعد از ۲ هفته انجام می‌شود</li>
      </ul>

      <div class="card" style="margin-top:12px">
        <p style="margin:0"><strong>مشاوره:</strong> برای انتخاب نواحی مناسب و دوز استاندارد
        با <a href="tel:+989150739223">تماس تلفنی</a> یا
        <a href="https://www.instagram.com/dr_atighinasab_/?hl=en" target="_blank" rel="noopener">اینستاگرام</a> هماهنگ کنید.</p>
      </div>
    `,
    faqs: [
      { q: 'اثر بوتاکس کی شروع می‌شود؟', a: 'بین ۳ تا ۷ روز آغاز می‌شود و نتیجهٔ کامل حدود ۱۴ روز بعد مشخص است.' },
      { q: 'مدت ماندگاری بوتاکس چقدر است؟', a: 'به‌طور معمول ۳ تا ۶ ماه؛ با تکرار منظم پایدارتر می‌شود.' },
      { q: 'آیا صورتم بی‌حالت می‌شود؟', a: 'خیر؛ با تنظیم دوز و نقاط تزریق، نتیجه طبیعی خواهد بود.' },
      { q: 'آیا نقاهت دارد؟', a: 'خیر؛ می‌توانید همان روز به کارهای روزانه برگردید. کبودی خفیف ممکن است ۱–۳ روز باقی بماند.' }
    ]
  },

  'lip-filler': {
    seo: {
      description:
        'فیلر لب با هیالورونیک اسید برای حجم‌دهی طبیعی، مرزبندی و اصلاح عدم تقارن لب. مشاوره تخصصی، مواد دارای مجوز، و نتایج طبیعی در کلینیک هارمونی چهره.'
    },
    body: `
      <h2>فیلر لب چیست؟</h2>
      <p>فیلر لب روشی غیرجراحی برای <strong>حجم‌دهی طبیعی</strong>، مرزبندی (Lip Border) و
      <strong>اصلاح عدم تقارن</strong> است. در کلینیک هارمونی چهره از فیلرهای <strong>هیالورونیک اسید</strong> دارای مجوز استفاده می‌شود؛
      ماده‌ای سازگار با بدن که به‌مرور توسط بدن جذب می‌گردد.</p>

      <h3>مزایای فیلر لب در کلینیک هارمونی چهره</h3>
      <ul>
        <li>طراحی فرم لب بر اساس تناسب چهره و درخواست شما (Natural / Defined)</li>
        <li>استفاده از فیلر برند معتبر با ماندگاری متعادل</li>
        <li>بی‌حسی موضعی و تکنیک تزریق کم‌درد</li>
        <li>تأکید بر نتیجه طبیعی و عدم اغراق</li>
      </ul>

      <h3>کاندیدای مناسب</h3>
      <p>اگر لب باریک، نامتقارن یا مرزبندی محوی دارید یا به‌دنبال <em>فرم‌دهی طبیعی</em> هستید،
      کاندیدای مناسبی محسوب می‌شوید. در بارداری/شیردهی یا سابقه آلرژی شدید، ابتدا با پزشک مشورت کنید.</p>

      <h3>مراحل انجام کار</h3>
      <ol>
        <li><strong>مشاوره و طراحی:</strong> بررسی فرم فعلی لب و تعیین هدف.</li>
        <li><strong>بی‌حسی و آماده‌سازی:</strong> ضدعفونی و بی‌حسی موضعی.</li>
        <li><strong>تزریق اصولی:</strong> با کانولا/سوزن ریز در لایه‌های مناسب برای نتیجه یکنواخت.</li>
        <li><strong>فرم‌دهی نهایی:</strong> ماساژ ملایم و ارزیابی تقارن.</li>
      </ol>

      <h3>مراقبت‌های بعد از فیلر لب</h3>
      <ul>
        <li>تا ۲۴ ساعت از گرمای زیاد (سونا/باشگاه) خودداری کنید.</li>
        <li>از فشار دادن/ماساژ لب‌ها پرهیز کنید مگر طبق دستور پزشک.</li>
        <li>نوشیدنی فراوان، پرهیز از الکل/سیگار در ۲۴–۴۸ ساعت اول.</li>
        <li>تورم/کبودی خفیف طبیعی است و طی چند روز کاهش می‌یابد.</li>
      </ul>

      <h3>دوام و ترمیم</h3>
      <p>ماندگاری بسته به نوع فیلر و متابولیسم بدن معمولاً <strong>۶ تا ۱۲ ماه</strong> است.
      برای حفظ فرم، جلسات ترمیمی کم‌حجم پیشنهاد می‌شود.</p>

      <h3>عوارض احتمالی</h3>
      <p>قرمزی، کبودی یا تورم خفیف گذراست. برای کاهش ریسک، سابقه حساسیت و بیماری‌ها را حتماً اطلاع دهید.</p>

      <div class="card" style="margin-top:12px">
        <p style="margin:0"><strong>مشاوره رایگان:</strong> برای ارزیابی فرم مناسب لب و انتخاب فیلر،
        از طریق <a href="tel:+989150739223">تماس تلفنی</a> یا
        <a href="https://www.instagram.com/dr_atighinasab_/?hl=en" target="_blank" rel="noopener">اینستاگرام</a> هماهنگ کنید.</p>
      </div>
    `,
    faqs: [
      { q: 'فیلر لب چقدر دوام دارد؟', a: 'معمولاً ۶ تا ۱۲ ماه (بسته به نوع فیلر و متابولیسم). برای حفظ فرم، ترمیم دوره‌ای توصیه می‌شود.' },
      { q: 'آیا نتیجه طبیعی خواهد بود؟', a: 'بله. در کلینیک هارمونی چهره طراحی بر پایه تناسب چهره است تا لب‌ها طبیعی و متقارن به‌نظر برسند.' },
      { q: 'دوره نقاهت چقدر است؟', a: 'به‌طور معمول همان روز به فعالیت‌های روزمره برمی‌گردید. تورم خفیف ۱–۳ روز طبیعی است.' },
      { q: 'در بارداری/شیردهی قابل انجام است؟', a: 'خیر، در این دوره انجام نمی‌شود. زمان مناسب بعد از پایان شیردهی است.' },
      { q: 'اگر پشیمان شوم، امکان حل‌کردن فیلر هست؟', a: 'برای فیلرهای هیالورونیک اسید، آنزیم هیالورونیداز می‌تواند در موارد لازم تجویز شود.' }
    ]
  },

  'cheek-chin-filler': {
    seo: {
      description:
        'فیلر گونه و چانه با هیالورونیک اسید برای تناسب صورت، افزایش برجستگی گونه و تعریف بهتر چانه در کلینیک هارمونی چهره.'
    },
    body: `
      <h2>فیلر چانه و گونه چیست؟</h2>
      <p>با فیلر <strong>هیالورونیک اسید</strong> می‌توان <strong>برجستگی گونه</strong> را افزایش داد،
      افتادگی خفیف را بهبود داد و <strong>تعادل نیم‌رخ</strong> را با تقویت چانه بهتر کرد. هدف ما نتیجه‌ای
      <em>طبیعی و هماهنگ</em> با سایر اجزای صورت است.</p>

      <h3>مزایا</h3>
      <ul>
        <li>تعادل چهره و بهبود نیم‌رخ (پروفایلینگ)</li>
        <li>اصلاح عدم تقارن خفیف گونه/چانه</li>
        <li>استفاده از فیلرهای معتبر با ماندگاری متعادل</li>
      </ul>

      <h3>فرآیند انجام</h3>
      <ol>
        <li><strong>مشاوره و طراحی:</strong> بررسی نسبت‌های صورت و تعیین نقاط تزریق.</li>
        <li><strong>بی‌حسی و تزریق:</strong> با سوزن ظریف یا کانولا برای یکنواختی و ایمنی بیشتر.</li>
        <li><strong>فرم‌دهی نهایی:</strong> ارزیابی تقارن و نتیجه‌ی طبیعی.</li>
      </ol>

      <h3>مراقبت‌ها و ماندگاری</h3>
      <p>تورم/کبودی خفیف طی چند روز کاهش می‌یابد. ماندگاری معمولاً <strong>۹–۱۲ ماه</strong> (بسته به متابولیسم و نوع فیلر).</p>

      <div class="card" style="margin-top:12px">
        <p style="margin:0"><strong>مشاوره:</strong> برای تعیین مقدار فیلر و نقاط دقیق،
        با <a href="tel:+989150739223">تماس</a> یا
        <a href="https://www.instagram.com/dr_atighinasab_/?hl=en" target="_blank" rel="noopener">اینستاگرام</a> هماهنگ کنید.</p>
      </div>
    `,
    faqs: [
      { q: 'فیلر گونه و چانه برای چه کسانی مناسب است؟', a: 'برای افرادی که گونه‌های کم‌حجم، چانهٔ عقب‌رفته یا عدم تقارن خفیف دارند و به دنبال نتیجه طبیعی هستند.' },
      { q: 'دوام چقدر است؟', a: 'معمولاً بین ۹ تا ۱۲ ماه؛ به نوع فیلر و سبک زندگی بستگی دارد.' },
      { q: 'دوره نقاهت دارد؟', a: 'خیر؛ فعالیت روزمره بلافاصله ممکن است. تورم/کبودی خفیف طبیعی است.' }
    ]
  },

  'jawline-filler': {
    seo: {
      description:
        'فیلر خط فک برای زاویه‌سازی ملایم، تعریف مرز فک و کاهش ظاهر افتادگی با حفظ حالت طبیعی صورت در هارمونی چهره.'
    },
    body: `
      <h2>فیلر خط فک</h2>
      <p>با تزریق فیلر در امتداد خط فک می‌توان <strong>مرز فک</strong> را واضح‌تر کرد،
      ظاهر افتادگی خفیف را بهبود داد و <strong>زاویه‌سازی</strong> ظریف ایجاد نمود—بدون اغراق.</p>

      <h3>مزایا</h3>
      <ul>
        <li>تعریف بهتر مرز فک و زاویه فکی</li>
        <li>اصلاح عدم تقارن‌های خفیف دو طرف فک</li>
        <li>نتیجه طبیعی و هماهنگ با گردن و چانه</li>
      </ul>

      <h3>نحوه انجام</h3>
      <ol>
        <li><strong>آنالیز صورت:</strong> تعیین نقاط استراتژیک تزریق در طول خط فک.</li>
        <li><strong>تزریق:</strong> با کانولا/سوزن ریز برای یکنواختی و ایمنی.</li>
        <li><strong>ارزیابی نهایی:</strong> تنظیمات جزئی برای تقارن و طبیعی بودن.</li>
      </ol>

      <h3>ماندگاری و مراقبت</h3>
      <p>ماندگاری معمولاً <strong>۱۲ ماه</strong> و بسته به نوع فیلر/متابولیسم متغیر است.
      در ۲۴–۴۸ ساعت اول از گرمای زیاد و ماساژ محل تزریق پرهیز کنید.</p>

      <div class="card" style="margin-top:12px">
        <p style="margin:0"><strong>رزرو:</strong> جهت بررسی صلاحیت و مقدار فیلر،
        <a href="tel:+989150739223">تماس</a> بگیرید یا در
        <a href="https://www.instagram.com/dr_atighinasab_/?hl=en" target="_blank" rel="noopener">اینستاگرام</a> پیام دهید.</p>
      </div>
    `,
    faqs: [
      { q: 'زاویه‌سازی فک طبیعی خواهد بود؟', a: 'بله؛ هدف ما تعریف ملایم مرز فک با حفظ تناسب صورت است.' },
      { q: 'آیا برای افتادگی پوست مناسب است؟', a: 'برای افتادگی خفیف کمک‌کننده است؛ موارد شدید نیاز به روش‌های ترکیبی دارند.' },
      { q: 'دوام چقدر است؟', a: 'میانگین ۱۲ ماه؛ بسته به نوع فیلر و سبک زندگی.' }
    ]
  }
};

// --------------- Chat storage ----------------
const messages = []; // for /socket.io simple site chat
const leads = [];    // chatbot lead capture (in-memory)

// ---------------- Routes ----------------
app.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'کلینیک زیبایی هارمونی چهره',
    services,
    gallery: [],
    messages,
    req
  });
});

app.get('/services/:slug', (req, res) => {
  const s = services.find(x => x.slug === req.params.slug);
  if (!s) return res.status(404).send('Service not found');

  const details = serviceLongContent[s.slug] || { body: '', faqs: [], seo: {} };
  const faqLd = details.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": details.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    : null;

  res.render('service', {
    pageTitle: `${s.title} | کلینیک زیبایی هارمونی چهره`,
    metaDescription: details.seo?.description || s.text,
    service: s,
    details,
    faqLd
  });
});

app.post('/contact', (req, res) => {
  const { name, phone, message } = req.body || {};
  console.log('Contact form:', { name, phone, message });
  return res.redirect('/#contact-success');
});





// ---------- (safety) ensure globals exist so we don't crash ----------
global.messages = global.messages || [];
const messages = global.messages;

global.leads = global.leads || [];
const leads = global.leads;

// ---------- Gemini usage guards + status route ----------
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

// Quick status check (open in browser): /_gemini_status
app.get('/_gemini_status', (req, res) => {
  res.json({
    enabled: GEMINI_ENABLED,
    haveKey: !!process.env.GOOGLE_GENAI_API_KEY,
    limit: GEMINI_DAILY_LIMIT,
    callsToday: geminiCallsToday,
    date: geminiDate
  });
});

// ---------- Gemini fallback (REST; no SDK) with retries + logging ----------
async function askGemini_FarsiClinic(userText) {
  const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
  if (!API_KEY) return 'کلید سرویس در دسترس نیست.';

  const SYSTEM =
`تو دستیار کلینیک «هارمونی چهره» هستی و همیشه فارسی و کوتاه پاسخ می‌دهی.
- خدمات زیبایی (بوتاکس، فیلر لب/گونه/چانه/خط فک) و مراقبت‌های عمومی قبل/بعد را ایمن توضیح بده.
- تشخیص/نسخه/قیمت قطعی نده؛ در موارد خاص تأکید کن معاینه لازم است.
- اگر بی‌ربط بود، مؤدبانه کوتاه پاسخ بده و گفتگو را به خدمات برگردان.
- راه‌های تماس (در صورت مرتبط بودن): +989150739223 ، @dr_atighinasab_ .
- لینک‌های داخلی: /services/botox /services/lip-filler /services/cheek-chin-filler /services/jawline-filler`;

  const payload = {
    contents: [
      { role: "user", parts: [{ text: `${SYSTEM}\n\nپرسش کاربر:\n${String(userText||'').slice(0,2000)}` }] }
    ],
    generationConfig: { maxOutputTokens: 350, temperature: 0.3 }
  };

  // Try a few model IDs (some projects allow only certain aliases)
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b"
  ];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await r.json();

      if (!r.ok) {
        console.error('Gemini HTTP error', r.status, { model, data });
        // 400 invalid payload/model, 403 permission/billing/region, 429 quota, 5xx service
        continue; // try next model
      }

      const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (txt) return txt;

      console.warn('Gemini empty/blocked response', { model, data });
      // try next model if empty/blocked
    } catch (e) {
      console.error('Gemini fetch error', { model, error: e?.message || e });
      // try next model
    }
  }

  // If all attempts failed:
  return 'در حال حاضر پاسخ هوشمند دردسترس نیست.';
}

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
    return reply(ans);
  }

  // Disabled / over limit / no key
  return reply('برای پاسخ دقیق‌تر نیاز به بررسی حضوری است. می‌توانید پرسش را شفاف‌تر بیان کنید یا با ما تماس بگیرید.');
});

// ---------- Chatbot: Lead capture ----------
app.post('/api/bot/lead', (req, res) => {
  const { service = '', name = '', phone = '' } = req.body || {};
  const p = String(phone).replace(/\s+/g, '');
  if (!service || !name || !/^(?:\+?98|0)?9\d{9}$/.test(p)) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }
  const phoneE164 = p.startsWith('0') ? '+98' + p.slice(1) : p.startsWith('+') ? p : '+98' + p;

  const lead = {
    service: String(service),
    name: String(name),
    phone: phoneE164,
    ts: new Date().toISOString(),
    source: 'chatbot'
  };
  leads.push(lead);
  console.log('New lead (chatbot):', lead);

  // TODO: email/telegram notification if you like
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
