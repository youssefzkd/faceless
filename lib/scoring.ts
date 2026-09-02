import { hardFilters, questions, scoreWeights } from "@/config/quiz";
import type { Answers, ScoreResult } from "./types";

/** Puntaje máximo teórico, calculado desde la config. */
export function maxPossibleScore(): number {
  return Object.values(scoreWeights).reduce(
    (total, options) => total + Math.max(0, ...Object.values(options)),
    0,
  );
}

/**
 * Calcula el puntaje y si el lead queda rechazado por algún filtro duro.
 * Corre SIEMPRE en el servidor: el cliente solo manda respuestas crudas.
 */
export function scoreAnswers(answers: Answers): ScoreResult {
  let score = 0;

  for (const question of questions) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    score += scoreWeights[question.id]?.[optionId] ?? 0;
  }

  const triggered = hardFilters.filter((f) => answers[f.questionId] === f.optionId);

  return {
    score,
    maxScore: maxPossibleScore(),
    rejected: triggered.some((f) => f.reject === true),
  };
}
