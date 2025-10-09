import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "کلینیک زیبایی هارمونی چهره | Harmony Chehre Beauty Clinic",
  description: "خدمات تخصصی پوست، لیزر، تزریقات، و فرم‌دهی. رزرو وقت و مشاوره.",
  openGraph: {
    title: "کلینیک زیبایی هارمونی چهره",
    description: "مشاوره رایگان و برنامه درمان اختصاصی.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
