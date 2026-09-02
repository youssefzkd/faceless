import { NextResponse } from "next/server";
import { questions, waNumber } from "@/config/quiz";
import { sendLead } from "@/lib/ghl";
import { scoreAnswers } from "@/lib/scoring";
import type { LeadPayload } from "@/lib/types";
import { isValidEmail, isValidName, isValidPhone } from "@/lib/validate";
import { buildMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { answers, contact, source } = payload ?? {};

  if (!answers || !contact) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (
    !isValidName(contact.name ?? "") ||
    !isValidEmail(contact.email ?? "") ||
    !isValidPhone(contact.phone)
  ) {
    return NextResponse.json({ error: "invalid_contact" }, { status: 400 });
  }

  // Solo se aceptan opciones que existen en la config.
  const clean: Record<string, string> = {};
  for (const question of questions) {
    const optionId = answers[question.id];
    if (optionId && question.options.some((o) => o.id === optionId)) {
      clean[question.id] = optionId;
    }
  }

  // El scoring se calcula aquí, en el servidor. Nunca en el cliente.
  const score = scoreAnswers(clean);

  const result = await sendLead({ answers: clean, contact, source }, score);
  if (!result.ok) {
    console.error("[lead] fallo el envío a GHL:", result.error);
  }

  const message = buildMessage(clean, contact.name);

  // Un filtro con `reject` corta acá: ni WhatsApp ni recurso.
  if (score.rejected) {
    return NextResponse.json({ kind: "rechazo", message: "", link: "" });
  }

  if (!waNumber) {
    // Sin número configurado el lead queda sin destino: hay que verlo en logs.
    console.error("[lead] Sin WhatsApp configurado. Revisa NEXT_PUBLIC_WA_CLOSER en Vercel.");
  }

  return NextResponse.json({
    kind: waNumber ? "whatsapp" : "thankyou",
    message,
    link: waNumber ? buildWhatsAppLink(waNumber, message) : "",
  });
}
