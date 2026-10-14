import {
  createMockPlayerRepository,
  createMockTeamRepository,
} from "@test/support/doubles/repositories";
import { createPlayer, createTeam } from "@test/support/fixtures/entities";
import { IPlayerRepository } from "@/applications/repositories/player.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { CreateTeamUseCase } from "@/applications/usecases/team/create-team.usecase";

describe("CreateTeamUseCase", () => {
  let mockTeamRepository: jest.Mocked<ITeamRepository>;
  let mockPlayerRepository: jest.Mocked<IPlayerRepository>;
  const mockTeam = createTeam();

  let useCase: CreateTeamUseCase;

  beforeEach(() => {
    mockTeamRepository = createMockTeamRepository();
    mockPlayerRepository = createMockPlayerRepository();
    useCase = new CreateTeamUseCase(mockTeamRepository, mockPlayerRepository);
  });

  it("should create team and owner player", async () => {
    mockTeamRepository.create.mockResolvedValue(mockTeam);
    mockPlayerRepository.create.mockResolvedValue(createPlayer());

    const result = await useCase.execute({
      name: "Test Team",
      nickname: "TT",
      userId: "user-1",
      userName: "John Doe",
    });

    expect(result.id).toBe("team-1");
  });
});
