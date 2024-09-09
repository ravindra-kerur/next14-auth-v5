"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const settings = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser: any = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // User who is going to change the field is logged in using credentials or
  // is logged in using OAuth
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // To update the fields, check the conditions
  // Email change
  if (values.email && values.email !== user.email) {
    const existingUser: any = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email as string,
      verificationToken.token
    );

    return { success: "Verification token sent!" };
  }

  // Password change
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

    if (!passwordMatch) {
      return { error: "Incorrect password" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  });

  return { success: "Settings updated successfully" };
};
