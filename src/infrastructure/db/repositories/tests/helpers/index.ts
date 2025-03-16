export function createMockDocument<T>(data: Partial<T>) {
  return {
    ...data,
    toJSON: jest.fn().mockReturnValue(data),
  };
}

export function setupModelMocks(mockModel: any) {
  const mockFind = jest.fn();
  const mockFindOne = jest.fn();
  const mockFindOneAndReplace = jest.fn();
  const mockFindOneAndDelete = jest.fn();

  mockModel.find = mockFind;
  mockModel.findOne = mockFindOne;
  mockModel.findOneAndReplace = mockFindOneAndReplace;
  mockModel.findOneAndDelete = mockFindOneAndDelete;

  return {
    mockFind,
    mockFindOne,
    mockFindOneAndReplace,
    mockFindOneAndDelete,
  };
}
