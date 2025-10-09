import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";

const services = [
  { icon:"✨", title:"پاکسازی و مراقبت پوست", text:"پاکسازی عمقی، فیشیال، آبرسانی، درمان آکنه با پروتکل اختصاصی." },
  { icon:"🎯", title:"لیزر موهای زائد", text:"الکساندرایت/دایود با تنظیمات متناسب با تیپ پوستی و خنک‌کننده ایمن." },
  { icon:"💉", title:"تزریقات زیبایی", text:"فیلر و بوتاکس با مواد دارای مجوز، نتیجه طبیعی و بدون اغراق." },
  { icon:"🧘‍♀️", title:"فرم‌دهی و جوانسازی", text:"RF/هایفو/کاویتیشن برای لیفت و سفت‌سازی نواحی صورت و بدن." },
];

const gallery = ["/images/g1.jpg","/images/g2.jpg","/images/g3.jpg","/images/g4.jpg","/images/g5.jpg","/images/g6.jpg"];

const reviews = [
  { name:"الهام", text:"برخورد پرسنل فوق‌العاده بود. مشاوره دقیق و نتیجه عالی." },
  { name:"نرگس", text:"لیزر بدون درد و با دستگاه خیلی خوب انجام شد. رضایت کامل!" },
  { name:"سارا", text:"محیط تمیز و حرفه‌ای. برای فیشیال خیلی راضی بودم." },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="border-b" style={{borderColor:"var(--border)", background:"radial-gradient(1200px 500px at 50% -20%, #1b2140 0%, transparent 55%)"}}>
        <div className="container py-16 grid gap-6 lg:grid-cols-[1.2fr_.8fr] items-center">
          <div>
            <span className="badge mb-3">مشاوره رایگان</span>
            <h1 className="text-3xl md:text-4xl font-bold leading-[1.4] mb-3">با ما جوان ترین و زیباترین خود باشید</h1>
            <p className="text-[var(--muted)] mb-6">برنامه‌ی درمان اختصاصی متناسب با نوع پوست و اهداف شما.</p>
            <div className="flex items-center gap-3">
              <a href="#contact" className="inline-flex bg-[var(--pri)] hover:bg-[var(--pri-2)] text-[#081018] font-semibold px-5 py-2 rounded-xl border border-white/10 shadow-soft">رزرو وقت</a>
              <a href="#services" className="link text-sm">مشاهده خدمات</a>
            </div>
          </div>
          <div className="hidden lg:block relative aspect-[4/3] rounded-3xl border shadow-soft" style={{borderColor:"var(--border)", background:"var(--card)"}}>
            <div className="absolute inset-0 skel rounded-3xl" />
            {/* می‌تونی یک عکس هیرو بگذاری */}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container py-12">
        <SectionTitle>خدمات ما</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s,i)=>(
            <article key={i} className="card">
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-[var(--muted)] text-sm leading-7">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="container py-10">
        <SectionTitle>گالری</SectionTitle>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {gallery.map((src,i)=>(
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border" style={{borderColor:"var(--border)"}}>
              <Image src={src} alt="نمونه کار کلینیک هارمونی چهره" fill className="object-cover" />
            </div>
          ))}
        </div>
        <p className="text-[var(--muted)] text-xs mt-2">* تصاویر صرفاً نمونه هستند؛ تصاویر واقعی خودتان را در پوشه‌ی public/images قرار دهید.</p>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="container py-10">
        <SectionTitle>نظرات مراجعین</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((r,i)=>(
            <blockquote key={i} className="card">
              <p className="leading-7">“{r.text}”</p>
              <footer className="mt-3 text-sm text-[var(--muted)]">— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-10">
        <div className="card bg-gradient-to-br from-[#132044] to-[#0f1b35]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">همین حالا وقت مشاوره رزرو کنید</h3>
              <p className="text-[var(--muted)] text-sm">پاسخ‌گویی واتس‌اپ: ۱۰ تا ۱۹</p>
            </div>
            <a href="#contact" className="inline-flex bg-[var(--pri)] hover:bg-[var(--pri-2)] text-[#081018] font-semibold px-5 py-2 rounded-xl border border-white/10">
              رزرو سریع
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="container py-12 grid gap-6 md:grid-cols-[1.2fr_.8fr]">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">تماس با ما</h2>
          <form action="/api/contact" method="post" className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm opacity-90">نام و نام خانوادگی</span>
              <input name="name" required placeholder="مثلاً: الهام موسوی" className="rounded-xl bg-[#0d1730] border border-[var(--border)] px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm opacity-90">شماره تماس</span>
              <input name="phone" required type="tel" placeholder="09xx…" className="rounded-xl bg-[#0d1730] border border-[var(--border)] px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm opacity-90">پیام شما</span>
              <textarea name="message" rows={4} placeholder="سوالات خود را بنویسید…" className="rounded-xl bg-[#0d1730] border border-[var(--border)] px-3 py-2 text-sm"></textarea>
            </label>
            <button className="justify-self-start bg-[var(--pri)] hover:bg-[var(--pri-2)] text-[#081018] font-semibold px-5 py-2 rounded-xl border border-white/10">ارسال</button>
          </form>
        </div>

        <aside className="card bg-gradient-to-b from-[#111a2e] to-[#0f192c]">
          <h3 className="font-semibold mb-2">اطلاعات تماس</h3>
          <p className="text-[var(--muted)] text-sm leading-7">
            ازادشهر چهارراه میلاد ساختمان پزشکان۷۷
            <br/> موبایل: 09150739223
            <br/>اینستاگرام: @dr_atighinasab_
          </p>
          <div className="mt-4 h-[220px] rounded-xl border border-[var(--border)] border-dashed grid place-items-center text-[var(--muted)] text-sm">
            نقشه اینجا قرار می‌گیرد
          </div>
        </aside>
      </section>

      <Footer />

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/98XXXXXXXXXX"
        className="fixed left-4 bottom-4 z-50 rounded-full px-4 py-2 text-sm font-semibold shadow-soft"
        style={{background:"var(--accent)", color:"#081018", border:"1px solid rgba(255,255,255,.15)"}}
        aria-label="واتس‌اپ"
      >
        واتس‌اپ
      </a>

      {/* Chat widget (Tawk.to/Crisp) — شناسه خود را جایگزین کنید */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/YOUR_TAWK_ID/1gxxxxx';
              s1.charset='UTF-8'; s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();`
        }}
      />
    </>
  );
}
