import { IAuthenticationService } from "@/src/applications/services/auth/authentication.service.interface";
import { IUserRepository } from "@/src/applications/repositories/user.repository.interface";
import { User } from "@/src/entities/user";
import { auth } from "@/auth";

export class AuthenticationService implements IAuthenticationService {
  constructor(private userRepository: IUserRepository) {}
  async verifySession(): Promise<User | undefined> {
    const session = await auth();
    if (!session) throw new Error("Invalid session");

    const user = await this.userRepository.findById(
      (session.user as { _id: string })._id
    );
    if (!user) throw new Error("User not found");

    return user;
  }
}