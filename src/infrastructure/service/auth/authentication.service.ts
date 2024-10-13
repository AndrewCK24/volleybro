import { IAuthenticationService } from "@/applications/services/auth/authentication.service.interface";
import { IUserRepository } from "@/applications/repositories/user.repository.interface";
import { User } from "@/entities/user";
import { auth } from "@/auth";

export class AuthenticationService implements IAuthenticationService {
  constructor(private userRepository: IUserRepository) {}
  async verifySession(): Promise<User | undefined> {
    const session = await auth();
    if (!session) throw new Error("Invalid session");

    // TODO: use TypeScript’s Module Augmentation to extend Session type
    // https://authjs.dev/getting-started/typescript
    const user = await this.userRepository.findById(
      (session.user as { _id: string })._id
    );
    if (!user) throw new Error("User not found");

    return user;
  }
}
