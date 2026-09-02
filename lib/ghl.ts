/**
 * Único punto de contacto con GoHighLevel.
 *
 * Si algún día hay que cambiar de la API v2 a un inbound webhook, se edita
 * SOLO este archivo: el resto de la app únicamente llama a `sendLead()`.
 */
import { ghlBaseTag, ghlCustomFieldIds, ghlSourceTags, questions } from "@/config/quiz";
import type { LeadPayload, ScoreResult } from "./types";

const BASE_URL = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

export type SendLeadResult = {
  ok: boolean;
  /** true si GHL_ENABLED=false y solo se logueó el payload. */
  skipped: boolean;
  contactId?: string;
  error?: string;
};

type CustomField = { id: string; field_value: string };

function buildCustomFields(lead: LeadPayload, score: ScoreResult): CustomField[] {
  const values: Record<string, string> = {
    quiz_score: String(score.score),
    yt_channel: lead.contact.channel?.trim() ?? "",
  };

  for (const question of questions) {
    const optionId = lead.answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((o) => o.id === optionId);
    // Los campos RADIO de GHL solo aceptan sus propias opciones, tal cual.
    values[question.id] = option?.ghlValue ?? option?.label ?? optionId;
  }

  // Los custom fields van por ID, nunca por nombre.
  return Object.entries(values)
    .map(([key, value]) => ({ id: ghlCustomFieldIds[key] ?? "", field_value: value }))
    .filter((field) => field.id !== "" && field.field_value !== "");
}

function buildTags(lead: LeadPayload): string[] {
  const tags = [ghlBaseTag];
  const sourceTag = lead.source ? ghlSourceTags[slug(lead.source)] : undefined;
  if (sourceTag) tags.push(sourceTag);
  return tags;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildBody(lead: LeadPayload, score: ScoreResult, locationId: string) {
  const [firstName, ...rest] = lead.contact.name.trim().split(/\s+/);

  return {
    locationId,
    firstName,
    lastName: rest.join(" ") || undefined,
    name: lead.contact.name.trim(),
    email: lead.contact.email.trim().toLowerCase(),
    phone: lead.contact.phone, // E.164
    source: lead.source ? `quiz-${lead.source}` : "quiz-faceless",
    tags: buildTags(lead),
    customFields: buildCustomFields(lead, score),
  };
}

/** Upsert del contacto en GoHighLevel. */
export async function sendLead(
  lead: LeadPayload,
  score: ScoreResult,
): Promise<SendLeadResult> {
  const enabled = process.env.GHL_ENABLED === "true";
  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID;

  const body = buildBody(lead, score, locationId ?? "");

  if (!enabled) {
    console.log("[ghl] GHL_ENABLED=false — payload que se habría enviado:");
    console.log(JSON.stringify(body, null, 2));
    return { ok: true, skipped: true };
  }

  if (!token || !locationId) {
    console.error("[ghl] Falta GHL_PIT o GHL_LOCATION_ID");
    return { ok: false, skipped: false, error: "missing_credentials" };
  }

  try {
    const response = await fetch(`${BASE_URL}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: API_VERSION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error(`[ghl] ${response.status}: ${text}`);
      return { ok: false, skipped: false, error: `ghl_${response.status}` };
    }

    const data = text ? JSON.parse(text) : {};
    return { ok: true, skipped: false, contactId: data?.contact?.id };
  } catch (error) {
    console.error("[ghl] error de red:", error);
    return { ok: false, skipped: false, error: "network_error" };
  }
}
