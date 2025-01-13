import type { DefaultSession } from "next-auth";
import type { User } from "@/entities/user";

// see https://authjs.dev/getting-started/typescript

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    name?: User["name"];
    email?: User["email"];
    image?: User["image"];
    teams?: User["teams"];
  }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  // interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      id: string;
      name?: User["name"];
      email?: User["email"];
      image?: User["image"];
      teams?: User["teams"];
    } & DefaultSession["user"];
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    name?: User["name"];
    email?: User["email"];
    image?: User["image"];
    teams?: User["teams"];
  }
}
