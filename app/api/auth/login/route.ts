import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createToken, setSessionCookie } from "@/lib/auth";

/** Janela de bloqueio apos tentativas erradas. */
const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 10 * 60 * 1000; // 10 minutos

interface Tentativa {
  falhas: number;
  ate: number;
}

/**
 * Estado das tentativas por IP.
 *
 * Em serverless o processo reinicia a cada invocacao, entao este mapa
 * funciona apenas como amortecedor. O bloqueio real continua sendo o
 * do login de usuario, que usa o banco.
 */
const tentativas = new Map<string, Tentativa>();

function chaveDeIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "desconhecido"
  );
}

/** Compara duas strings sem vazar o tempo de resposta. */
function iguais(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    // Ainda assim faz uma comparacao, para nao vazar o tamanho pela duracao.
    timingSafeEqual(bufferA, bufferA);
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

export async function POST(request: NextRequest) {
  const ip = chaveDeIp(request);
  const agora = Date.now();

  const registro = tentativas.get(ip);

  if (registro && registro.ate > agora) {
    const minutos = Math.ceil((registro.ate - agora) / 60000);
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${minutos} minuto(s).` },
      { status: 429 }
    );
  }

  try {
    const corpo = await request.json();
    const email = String(corpo.email ?? "").trim().toLowerCase();
    const senha = String(corpo.password ?? "");

    const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "";

    if (!adminEmail || !adminPassword) {
      console.error(
        "Login indisponivel: ADMIN_EMAIL ou ADMIN_PASSWORD nao configurados."
      );
      return NextResponse.json(
        { error: "Login temporariamente indisponivel." },
        { status: 503 }
      );
    }

    // Ambas as comparacoes rodam sempre, para nao revelar pelo tempo de
    // resposta se o e-mail existe ou se so a senha estava errada.
    const emailConfere = iguais(email, adminEmail);
    const senhaConfere = iguais(senha, adminPassword);

    if (emailConfere && senhaConfere) {
      tentativas.delete(ip);

      const token = await createToken({ id: "1", email: adminEmail, name: "Admin" });
      await setSessionCookie(token);

      return NextResponse.json({ success: true });
    }

    const falhas = (registro?.falhas ?? 0) + 1;
    tentativas.set(ip, {
      falhas,
      ate: falhas >= MAX_TENTATIVAS ? agora + BLOQUEIO_MS : 0,
    });

    return NextResponse.json(
      { error: "Credenciais invalidas" },
      { status: 401 }
    );
  } catch (erro) {
    console.error("Erro no login:", erro);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
