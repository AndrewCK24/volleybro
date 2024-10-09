import { User } from "@/entities/user";

export interface IAuthenticationService {
  verifySession(token: string): Promise<User | undefined>;
}
