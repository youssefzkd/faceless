import {
  hardFilters,
  questions,
  scoreWeights,
  summaryLabels,
  tierThresholds,
  type Tier,
} from "@/config/quiz";
import type { Answers, ScoreResult } from "./types";

/** Puntaje máximo teórico, calculado desde la config. */
export function maxPossibleScore(): number {
  return Object.values(scoreWeights).reduce(
    (total, options) => total + Math.max(0, ...Object.values(options)),
    0,
  );
}

/**
 * Calcula puntaje y tier. Corre SIEMPRE en el servidor: el cliente solo
 * manda respuestas crudas.
 */
export function scoreAnswers(answers: Answers): ScoreResult {
  let score = 0;

  for (const question of questions) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    score += scoreWeights[question.id]?.[optionId] ?? 0;
  }

  const triggered = hardFilters.filter((f) => answers[f.questionId] === f.optionId);

  let tier: Tier = "bajo";
  if (score >= tierThresholds.alto) tier = "alto";
  else if (score >= tierThresholds.medio) tier = "medio";

  if (triggered.length > 0) tier = "bajo";

  return {
    score,
    maxScore: maxPossibleScore(),
    tier,
    blocker: triggered[0]?.reason ?? weakestArea(answers),
    hardFiltered: triggered.length > 0,
  };
}

/** Por debajo de esta proporción, una respuesta cuenta como bloqueo. */
const WEAK_RATIO = 0.6;

/**
 * Sin filtro duro, el "bloqueo" es la pregunta donde el lead sacó la menor
 * proporción de los puntos posibles.
 */
function weakestArea(answers: Answers): string {
  let worstId: string | null = null;
  let worstRatio = Infinity;

  for (const question of questions) {
    const optionId = answers[question.id];
    const weights = scoreWeights[question.id];
    if (!optionId || !weights) continue;

    const max = Math.max(0, ...Object.values(weights));
    if (max === 0) continue;

    const ratio = (weights[optionId] ?? 0) / max;
    if (ratio < worstRatio) {
      worstRatio = ratio;
      worstId = question.id;
    }
  }

  // Si hasta lo más flojo salió bien, no hay bloqueo que reportar.
  if (!worstId || worstRatio >= WEAK_RATIO) return "Sin bloqueo claro";

  return summaryLabels[worstId] ?? worstId;
}
