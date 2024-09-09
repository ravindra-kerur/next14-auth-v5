import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // interface Session {
  //   user: {
  //     /** The user's role. */
  //     customField: string;
  //     role: UserRole;
  //   } & DefaultSession["user"];
  // }
  interface Session {
    user: ExtendedUser;
  }
}
