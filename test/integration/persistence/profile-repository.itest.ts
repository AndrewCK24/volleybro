import type { IProfileRepository } from "@/applications/repositories/profile.repository.interface";
import { NotFoundError } from "@/entities/errors";
import { container } from "@/infrastructure/di/inversify.config";
import { TYPES } from "@/infrastructure/di/types";
import { oid } from "../support/seed";

const profiles = () =>
  container.get<IProfileRepository>(TYPES.ProfileRepository);

describe("profile reads and writes", () => {
  it("finds no profile for a user without one", async () => {
    expect(await profiles().findByUserId(oid())).toBeNull();
  });

  it("stores a profile and reads it back with string ids", async () => {
    const userId = oid();

    const created = await profiles().create({ userId });

    expect(created).toMatchObject({ userId });
    expect(await profiles().findByUserId(userId)).toEqual(created);
  });

  it("persists the fields an update changes", async () => {
    const { id, userId } = await profiles().create({
      userId: oid(),
      preferences: { theme: "light" },
    });

    const updated = await profiles().update(id, {
      preferences: { theme: "dark" },
    });

    expect(updated.preferences).toEqual({ theme: "dark" });
    expect((await profiles().findByUserId(userId))!.preferences).toEqual({
      theme: "dark",
    });
  });

  it("refuses to update a profile that does not exist", async () => {
    await expect(profiles().update(oid(), { info: {} })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
