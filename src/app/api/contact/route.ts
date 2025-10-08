import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get("name") || "");
  const phone = String(form.get("phone") || "");
  const message = String(form.get("message") || "");

  console.log("CONTACT_FORM:", { name, phone, message });
  // TODO: اتصال به ایمیل (Resend/Mailtrap) یا DB
  return NextResponse.redirect(new URL("/#contact", req.url));
}
