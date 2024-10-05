import type { ReduxRecordState } from "@/src/lib/features/record/types";

export const serveOrderHelper = (state: ReduxRecordState) => {
  const { win } = state.recording;
  const { isServing } = state.status;
  const { starting, liberos, options } = state.lineups.home;

  if (win && !isServing) {
    const servingPlayer = starting.shift();
    starting.push(servingPlayer);
    if (starting[3].position === "L") {
      const frontRowL = { ...starting[3] };
      starting[3] = liberos[0];
      liberos[0] = frontRowL;
    }
    // state.sets[setNum].counts.rotation += 1;
  } else if (!win && isServing) {
    if (
      options.liberoSwitchMode &&
      starting[0].position === options.liberoSwitchPosition
    ) {
      const targetPlayer = { ...starting[0] };
      starting[0] = liberos[0];
      liberos[0] = targetPlayer;
    }
  }
};
