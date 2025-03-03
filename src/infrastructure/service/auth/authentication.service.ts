import { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { User } from "@/entities/user";
import { auth } from "@/auth";

export class AuthenticationService implements IAuthenticationService {
  constructor(private userRepository: IUserRepository) {}
  async verifySession(): Promise<User | undefined> {
    const session = await auth();
    if (!session) throw new Error("Invalid session");

    const user = await this.userRepository.findOne({
      _id: session.user.id,
    });
    if (!user) throw new Error("User not found");

    return user;
  }
}
