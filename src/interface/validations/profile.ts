import type { IUpdateProfileInput } from "@/applications/usecases/user/profile.usecase";
import { z } from "zod";

/** PATCH /api/profiles */
export const UpdateProfileRequestSchema = z
  .object({
    // Clients from before the device-local active team still send it; accepted and dropped.
    activeTeamId: z.unknown().optional(),
    info: z.record(z.string(), z.unknown()).optional(),
    preferences: z.record(z.string(), z.unknown()).optional(),
  })
  .strict()
  .transform(
    ({ activeTeamId: _dropped, ...updates }) => updates,
  ) satisfies z.ZodType<IUpdateProfileInput["updates"]>;

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
