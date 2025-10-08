export default function Footer() {
  const instagramUrl = "https://www.instagram.com/dr_atighinasab_/?hl=en";
  const phoneE164 = "+989150739223";

  return (
    <footer className="mt-14 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container grid gap-6 md:grid-cols-3 py-8 text-sm">
        <div>
          <h4 className="font-semibold mb-2">درباره ما</h4>
          <p className="text-[var(--muted)] leading-7">
            کلینیک هارمونی چهره با تیم مجرب و تجهیزات روز دنیا در حوزه‌ی زیبایی و سلامت پوست.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">ساعت کاری</h4>
          <p className="text-[var(--muted)] leading-7">
            شنبه تا پنجشنبه: ۱۰ تا ۱۹<br />جمعه: تعطیل
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">راه‌های ارتباطی</h4>
          <p className="text-[var(--muted)] leading-7">
            <a
              className="link"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              اینستاگرام
            </a>{" "}
            ·{" "}
            <a className="link" href={`tel:${phoneE164}`} aria-label="تماس تلفنی">
              تماس تلفنی
            </a>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--muted)] pb-10">
        © {new Date().getFullYear()} Harmony Chehre Beauty Clinic
      </div>
    </footer>
  );
}
