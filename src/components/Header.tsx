"use client";
export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b" style={{borderColor:"var(--border)", background:"var(--glass)"}}>
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2 font-bold">
          <span></span><span>کلینیک زیبایی هارمونی چهره</span>
        </div>
        <nav className="text-sm opacity-90 space-x-5 space-x-reverse">
          <a href="#services" className="link">خدمات</a>
          <a href="#gallery" className="link">گالری</a>
          <a href="#reviews" className="link">نظرات</a>
          <a href="#contact" className="link">تماس</a>
        </nav>
      </div>
    </header>
  );
}
