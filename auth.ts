import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client"
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/accounts";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // https://next-auth.js.org/configuration/pages
  // Ex: If we have logged-in with xyz@gmail.com for github, and try to login with same email id for google.
  // We will get the error page from from google. We want our own page. To do this we need pages as below
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // If something else goes wrong regardless of login or something brakes
  },

  // https://next-auth.js.org/configuration/events
  // Sent when an account in a given provider is linked to a user in our user database.
  // For example, when a user signs up with Twitter or when an existing user links their Google account.
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    // block the use until he/she finishes with email verification with credentials provider
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser: any = await getUserById(user.id as string);

      // Prevent sign in without email verification
      if (!existingUser || !existingUser?.emailVerified) return false;

      // If the user is enabled for 2fA. Prevent the user until he is verified
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor confirmation for next
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({ session, token }) {
      // console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // session.user.customField = "ssss";

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
        // Property 'role' does not exist on type '{}'.
        // This is the typescript error. To fix this issue follow this url - https://next-auth.js.org/getting-started/typescript
        // Also chk this: https://stackoverflow.com/questions/74425533/property-role-does-not-exist-on-type-user-adapteruser-in-nextauth
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      // Update the changes done in the settings page
      // We have to assign the values manually
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    async jwt({ token, user, profile }) {
      console.log("I AM BEING CALLED AGAIN!");
      // console.log("Token:->", token);
      // Add custom fileds to the token whatever we need
      // token.customField = "Test";

      if (!token.sub) return token;
      const existingUser: any = await getUserById(token.sub);
      // console.log("User:->", existingUser);
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      // Update the token when user changes something in the settings page
      // We have to assign the values manually
      token.name = existingUser.name;
      token.email = existingUser.email;

      // For OAuth accounts to check user is from google or github or other providers
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
