import mongoose from "mongoose";

jest.unmock("@/infrastructure/db/mongoose/connect-to-mongodb");

import { connectToMongoDB } from "@/infrastructure/db/mongoose/connect-to-mongodb";

describe("connectToMongoDB", () => {
  beforeEach(() => {
    process.env.MONGODB_URI = "mongodb://127.0.0.1:1/test";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("connects once for concurrent calls while the first is in flight", async () => {
    const connect = jest
      .spyOn(mongoose, "connect")
      .mockImplementation(async () => mongoose);

    await Promise.all([connectToMongoDB(), connectToMongoDB()]);

    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("retries on the next call after a failed connect", async () => {
    const connect = jest
      .spyOn(mongoose, "connect")
      .mockRejectedValueOnce(new Error("down"))
      .mockResolvedValueOnce(mongoose);

    await expect(connectToMongoDB()).rejects.toThrow("down");
    await connectToMongoDB();

    expect(connect).toHaveBeenCalledTimes(2);
  });
});
