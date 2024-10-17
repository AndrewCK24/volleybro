import { z } from "zod";
import { Lineup } from "@/entities/team";
import { Position } from "@/entities/record";

// For Forms
export const LiberoSwitchFormSchema = z.object({
  mode: z.enum(["0", "1", "2"]),
  position: z.enum([Position.NONE, Position.MB, Position.OP, Position.OH]),
});

export type LiberoSwitchFormValues = z.infer<typeof LiberoSwitchFormSchema>;

// For Redux
export enum LineupOptionMode {
  NONE = "",
  PLAYERINFO = "playerInfo",
  POSITIONS = "positions",
  SUBSTITUTES = "substitutes",
}

export type ReduxLineupStatus = {
  edited: boolean;
  lineupIndex: number;
  optionMode: LineupOptionMode;
  editingMember: {
    _id: string;
    list: string;
    zone: number;
  };
};

export type ReduxLineupState = {
  lineups: Lineup[];
  status: ReduxLineupStatus;
};
