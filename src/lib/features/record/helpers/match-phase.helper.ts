import type { ReduxRecording } from "@/src/lib/features/record/types";

export const matchPhaseHelper = (
  rally: ReduxRecording,
  point: number = 25
): {
  inPlay: boolean;
  isSetPoint: boolean;
} => {
  const { home, away } = rally;
  // Game is in progress if both scores are less than point - 1
  if (home.score < point - 1 && away.score < point - 1)
    return { inPlay: true, isSetPoint: false };

  // Set point if one side's score is point - 1 and leading by at least 1 point
  if (
    (home.score === point - 1 && home.score > away.score) ||
    (away.score === point - 1 && away.score > home.score)
  )
    return { inPlay: true, isSetPoint: true };

  // Set point if both scores are >= point - 1 and one side is leading by 1 point
  if (
    home.score >= point - 1 &&
    away.score >= point - 1 &&
    (home.score - away.score === 1 || away.score - home.score === 1)
  )
    return { inPlay: true, isSetPoint: true };

  // Game over if one side's score is >= point and leading by at least 2 points
  if (home.score >= point && home.score - away.score >= 2)
    return { inPlay: false, isSetPoint: false };
  if (away.score >= point && away.score - home.score >= 2)
    return { inPlay: false, isSetPoint: false };

  // Otherwise, the game is still in progress
  return { inPlay: true, isSetPoint: false };
};
