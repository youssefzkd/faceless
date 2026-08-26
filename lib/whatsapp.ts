import {
  questions,
  resourceName,
  summaryLabels,
  summaryLineTemplate,
  whatsappLinkStyle,
  whatsappTemplate,
} from "@/config/quiz";
import type { Answers } from "./types";

function labelFor(questionId: string, optionId: string): string {
  const question = questions.find((q) => q.id === questionId);
  return question?.options.find((o) => o.id === optionId)?.label ?? optionId;
}

/** Resumen de respuestas, una línea por pregunta contestada. */
export function buildSummary(answers: Answers): string {
  return questions
    .filter((q) => answers[q.id])
    .map((q) =>
      summaryLineTemplate
        .replace("{pregunta}", summaryLabels[q.id] ?? q.title)
        .replace("{respuesta}", labelFor(q.id, answers[q.id])),
    )
    .join("\n");
}

/** Interpola la plantilla de config con las respuestas y el nombre. */
export function buildMessage(answers: Answers, name: string): string {
  let message = whatsappTemplate
    .replace(/{recurso}/g, resourceName)
    .replace(/{nombre}/g, name.trim() || "un interesado")
    .replace(/{resumen}/g, buildSummary(answers));

  // Variables por pregunta: {q1_estado}, {q3_tiempo}, etc.
  for (const question of questions) {
    const optionId = answers[question.id];
    message = message.replace(
      new RegExp(`{${question.id}}`, "g"),
      optionId ? labelFor(question.id, optionId) : "",
    );
  }

  return message.trim();
}

/** Tope prudente: WhatsApp trunca los mensajes muy largos pasados por URL. */
const MAX_MESSAGE_LENGTH = 1500;

/** El link se arma en runtime; no hay links pre-hechos. */
export function buildWhatsAppLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  const text = encodeURIComponent(message.slice(0, MAX_MESSAGE_LENGTH));

  return whatsappLinkStyle === "api"
    ? `https://api.whatsapp.com/send/?phone=${digits}&text=${text}`
    : `https://wa.me/${digits}?text=${text}`;
}
