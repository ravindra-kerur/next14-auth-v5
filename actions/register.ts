"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  //   console.log(values);
  const validatedFields = RegisterSchema.safeParse(values);

  const { email, password, name }: any = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check is user aleady exists.
  //   const existingUser = await db.user.findUnique({ where: { email } });
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use." };
  }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  if (!validatedFields.success) {
    return { error: "Register account failed" };
  }

  const verificationToken:any = await generateVerificationToken(email);
  // Send verification token email
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Confirmation email sent!",
  };
};
