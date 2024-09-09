"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const exisitingUser: any = await getUserByEmail(
    existingToken.email as string
  );

  if (!exisitingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: exisitingUser.id },
    data: {
      emailVerified: new Date(),
      // why we need this: During the registration process it is not needed.
      // But we are going to reuse this newVerification action for whenever user wants to modify
      // their email. In settings page, whenever user adds new email, we are not going to update the email
      // immediatly in the db. We are simply going to create the token with that new email and send an email to that
      // email.
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified" };
};
