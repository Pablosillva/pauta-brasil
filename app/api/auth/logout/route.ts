import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  await removeSessionCookie();

  // Aceita tanto fetch (JSON) quanto submissão de formulário (navegação)
  const accept = request.headers.get("accept") ?? "";

  if (accept.includes("application/json")) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.redirect(new URL("/", request.url), {
    status: 303,
  });
}
