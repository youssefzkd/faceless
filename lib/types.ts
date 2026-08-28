import type { Tier } from "@/config/quiz";

/** Respuestas crudas: { questionId: optionId } */
export type Answers = Record<string, string>;

export type Contact = {
  name: string;
  email: string;
  /** E.164, ej: +5215512345678 */
  phone: string;
  channel?: string;
};

export type LeadPayload = {
  answers: Answers;
  contact: Contact;
  /** Query param ?src= */
  source?: string;
};

export type ScoreResult = {
  score: number;
  maxScore: number;
  tier: Tier;
  /** Bloqueo principal detectado (para tag y contexto del closer). */
  blocker: string;
  hardFiltered: boolean;
  /** true = se le muestra la pantalla de rechazo, sin WhatsApp. */
  rejected: boolean;
};
