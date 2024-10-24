import { z } from "zod";
import type { Rally } from "@/entities/record";

// For Forms and Tables
export const RecordInfoFormSchema = z.object({
  // For MatchInfoForm
  name: z.string().optional(),
  number: z.coerce.number().int().positive().optional(),
  phase: z.enum(["0", "1", "2", "3", "4"]).optional(),
  division: z.enum(["0", "1", "2", "3"]).optional(),
  category: z.enum(["0", "1", "2", "3"]).optional(),
  scoring: z.object({
    setCount: z.string(),
    decidingSetPoints: z.coerce.number(),
  }),
});

export type RecordInfoFormValues = z.infer<typeof RecordInfoFormSchema>;

export const RecordMiscFormSchema = z.object({
  // For MatchMiscForm
  location: z
    .object({
      city: z.string().optional(),
      hall: z.string().optional(),
    })
    .optional(),
  time: z
    .object({
      date: z.string().optional(),
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
  weather: z
    .object({
      temperature: z.string().optional(),
    })
    .optional(),
});

export type RecordMiscFormValues = z.infer<typeof RecordMiscFormSchema>;

export type RecordMatchInfoForm = RecordInfoFormValues &
  RecordMiscFormValues & {
    _id?: string;
  };

export const SetOptionsFormSchema = z.object({
  serve: z.enum(["home", "away"]),
  time: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
});

export type SetOptionsFormValues = z.infer<typeof SetOptionsFormSchema>;

export type TableRosterPlayer = {
  _id: string;
  name: string;
  number: number;
  list: string;
};

// For Redux
export type ReduxStatus = {
  isServing: boolean;
  scores: {
    home: number;
    away: number;
  };
  setIndex: number;
  rallyIndex: number;
  inPlay: boolean;
  isSetPoint: boolean;
  recordingMode: "home" | "away" | "substitutes";
};

export type ReduxRecordState = {
  _id: string;
  win: boolean | null;
  status: ReduxStatus;
  isEditing?: boolean;
  recording: Rally;
};
