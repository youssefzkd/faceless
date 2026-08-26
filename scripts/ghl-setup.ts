/**
 * Setup de GoHighLevel.
 *
 *   1. Valida el token con una llamada de lectura
 *   2. Lista los custom fields existentes
 *   3. Crea los que falten (uno por pregunta + score + tier + canal)
 *   4. Imprime el mapa de IDs listo para pegar en config/quiz.ts
 *
 * Uso:  npm run ghl:setup      (lee GHL_PIT y GHL_LOCATION_ID de .env)
 */
import { config } from "dotenv";
import { ghlCustomFieldIds, questions, summaryLabels } from "../config/quiz";

// Next.js usa .env.local; dotenv por defecto solo lee .env. Cargamos los dos.
config({ path: ".env.local" });
config({ path: ".env" });

const BASE_URL = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

const token = process.env.GHL_PIT;
const locationId = process.env.GHL_LOCATION_ID;

type RemoteField = { id: string; name: string; fieldKey?: string; dataType?: string };

/** Campos que necesita el quiz: clave en config → nombre en GHL. */
const REQUIRED_FIELDS: { key: string; name: string }[] = [
  ...questions.map((q) => ({
    key: q.id,
    name: `Quiz - ${summaryLabels[q.id] ?? q.title}`.slice(0, 60),
  })),
  { key: "quiz_score", name: "Quiz - Puntaje" },
  { key: "quiz_tier", name: "Quiz - Tier" },
  { key: "yt_channel", name: "Quiz - Canal de YouTube" },
];

function headers() {
  return {
    Authorization: `Bearer ${token}`,
    Version: API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function call(path: string, init?: RequestInit) {
  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers: headers() });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} → ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : {};
}

async function main() {
  if (!token || !locationId) {
    console.error("Falta GHL_PIT o GHL_LOCATION_ID. Cópialos en tu archivo .env");
    process.exit(1);
  }

  // 1. Validar el token
  console.log("→ Validando token...");
  const location = await call(`/locations/${locationId}`);
  console.log(`  OK. Location: ${location?.location?.name ?? locationId}\n`);

  // 2. Listar los custom fields existentes
  console.log("→ Custom fields existentes:");
  const existing: RemoteField[] =
    (await call(`/locations/${locationId}/customFields?model=contact`))?.customFields ?? [];

  for (const field of existing) {
    console.log(`  ${field.id}  ${field.name}`);
  }
  console.log("");

  // 3. Crear los que falten
  const map: Record<string, string> = {};

  for (const required of REQUIRED_FIELDS) {
    // Campos ya mapeados a mano en la config (reusados de la cuenta): no se tocan.
    const alreadyMapped = ghlCustomFieldIds[required.key];
    if (alreadyMapped) {
      map[required.key] = alreadyMapped;
      const name = existing.find((f) => f.id === alreadyMapped)?.name ?? "(id fijado a mano)";
      console.log(`↻ reusado:   ${name}`);
      continue;
    }

    const match = existing.find((f) => f.name === required.name);

    if (match) {
      map[required.key] = match.id;
      console.log(`= ya existe: ${required.name}`);
      continue;
    }

    console.log(`+ creando:   ${required.name}`);
    const created = await call(`/locations/${locationId}/customFields`, {
      method: "POST",
      body: JSON.stringify({
        name: required.name,
        dataType: "TEXT",
        model: "contact",
        placeholder: required.name,
      }),
    });

    const id = created?.customField?.id ?? created?.id;
    if (!id) throw new Error(`No se pudo leer el id de ${required.name}`);
    map[required.key] = id;
  }

  // 4. Imprimir el mapa listo para pegar
  const lines = Object.entries(map)
    .map(([key, id]) => `  ${key}: "${id}",`)
    .join("\n");

  console.log("\n─────────────────────────────────────────────────────────");
  console.log("Pega esto en config/quiz.ts, reemplazando ghlCustomFieldIds:");
  console.log("─────────────────────────────────────────────────────────\n");
  console.log(`export const ghlCustomFieldIds: Record<string, string> = {\n${lines}\n};`);
  console.log("");
}

main().catch((error) => {
  console.error("\nError:", error instanceof Error ? error.message : error);
  process.exit(1);
});
