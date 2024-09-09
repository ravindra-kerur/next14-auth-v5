"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  await signOut()
//   await signOut({ redirectTo: "/auth/login", redirect: true });
};

// This is another method to signout from server component
// Why we need this: If we want to do some server staff before we logout the user.
// Crearing some information about the user. Removing the user. whatever we want to do
// before we logout the user.
