import { User } from "@/src/entities/user";

export interface IAuthenticationService {
  verifySession(token: string): Promise<User | undefined>;
}
