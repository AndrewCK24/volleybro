import {
  createMockPlayerRepository,
  createMockTeamRepository,
} from "@test/support/doubles/repositories";
import { createPlayer, createTeam } from "@test/support/fixtures/entities";
import { IPlayerRepository } from "@/applications/repositories/player.repository.interface";
import { ITeamRepository } from "@/applications/repositories/team.repository.interface";
import { CreateTeamUseCase } from "@/applications/usecases/team/create-team.usecase";
import { PlayerRole, PlayerStatus } from "@/entities/player";

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

  it("creates the team with the caller as its joined owner", async () => {
    mockTeamRepository.create.mockResolvedValue(mockTeam);
    mockPlayerRepository.create.mockResolvedValue(createPlayer());

    const result = await useCase.execute({
      name: "Test Team",
      nickname: "TT",
      userId: "user-1",
      userName: "John Doe",
    });

    expect(result).toBe(mockTeam);
    expect(mockPlayerRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: mockTeam.id,
        userId: "user-1",
        status: PlayerStatus.JOINED,
        role: PlayerRole.OWNER,
      }),
    );
  });
});
