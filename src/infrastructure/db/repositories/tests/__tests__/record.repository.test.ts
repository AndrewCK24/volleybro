import { Types } from "mongoose";
import { RecordRepositoryImpl } from "@/infrastructure/db/repositories/record.repository.mongo";
import { Record as RecordModel } from "@/infrastructure/db/mongoose/schemas/record";
import {
  createMockDocument,
  setupModelMocks,
} from "@/infrastructure/db/repositories/tests/helpers";

jest.mock("@/infrastructure/db/mongoose/schemas/record");

describe("RecordRepositoryImpl", () => {
  let repository: RecordRepositoryImpl;
  const mockRecordId = new Types.ObjectId();
  const mockRecordIdString = mockRecordId.toHexString();
  const mockTeamId = new Types.ObjectId();
  const mockTeamIdString = mockTeamId.toHexString();
  const nonExistentId = new Types.ObjectId();
  const nonExistentIdString = nonExistentId.toHexString();
  const mockRecordData = {
    _id: mockRecordId,
    team_id: mockTeamId,
    info: {
      name: "Test Record",
      scoring: {
        setCount: 3,
        decidingSetPoints: 15,
      },
    },
  };
  const mockRecord = createMockDocument(mockRecordData);
  let mocks: ReturnType<typeof setupModelMocks>;

  beforeEach(() => {
    repository = new RecordRepositoryImpl();
    mocks = setupModelMocks(RecordModel);
    jest.clearAllMocks();
  });

  describe("find", () => {
    it("should return an array of records", async () => {
      mocks.mockFind.mockResolvedValue([mockRecord]);

      const result = await repository.find({ team_id: mockTeamId });

      expect(mocks.mockFind).toHaveBeenCalledWith({ team_id: mockTeamId });
      expect(result).toEqual([mockRecordData]);
    });

    it("should return null when no records are found", async () => {
      mocks.mockFind.mockResolvedValue(null);

      const result = await repository.find({ team_id: nonExistentId });

      expect(result).toBeNull();
    });
  });

  describe("findOne", () => {
    it("should return a single record", async () => {
      mocks.mockFindOne.mockResolvedValue(mockRecord);

      const result = await repository.findOne({ _id: mockRecordIdString });

      expect(mocks.mockFindOne).toHaveBeenCalledWith({
        _id: mockRecordIdString,
      });
      expect(result).toEqual(mockRecordData);
    });

    it("should return null when record is not found", async () => {
      mocks.mockFindOne.mockResolvedValue(null);

      const result = await repository.findOne({ _id: nonExistentIdString });

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and return a new record", async () => {
      const mockSave = jest.fn().mockResolvedValue(mockRecord);
      (RecordModel as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        toJSON: mockRecord.toJSON,
      }));

      const result = await repository.create({
        ...mockRecordData,
        _id: mockRecordIdString,
        team_id: mockTeamIdString,
      });

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockRecordData);
    });
  });

  describe("update", () => {
    const updatedRecordData = {
      ...mockRecordData,
      _id: mockRecordIdString,
      team_id: mockTeamIdString,
      info: { name: "Updated Record", ...mockRecordData.info },
    };
    const updatedRecord = createMockDocument(updatedRecordData);

    it("should update and return the updated record", async () => {
      mocks.mockFindOneAndReplace.mockResolvedValue(updatedRecord);

      const result = await repository.update(
        { _id: mockRecordId },
        updatedRecordData
      );

      expect(mocks.mockFindOneAndReplace).toHaveBeenCalledWith(
        { _id: mockRecordId },
        updatedRecordData,
        { new: true }
      );
      expect(result).toEqual(updatedRecordData);
    });

    it("should return null when record is not found", async () => {
      mocks.mockFindOneAndReplace.mockResolvedValue(null);

      const result = await repository.update(
        { _id: nonExistentId },
        updatedRecordData
      );

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should return true when deletion is successful", async () => {
      mocks.mockFindOneAndDelete.mockResolvedValue(mockRecord);

      const result = await repository.delete({ _id: mockRecordId });

      expect(mocks.mockFindOneAndDelete).toHaveBeenCalledWith({
        _id: mockRecordId,
      });
      expect(result).toBe(true);
    });

    it("should return false when deletion fails", async () => {
      mocks.mockFindOneAndDelete.mockResolvedValue(null);

      const result = await repository.delete({ _id: nonExistentId });

      expect(result).toBe(false);
    });
  });
});
