"use server";
import mongoose from "mongoose";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn as authSignIn, signOut } from "@/auth";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/lib/routes";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import { createVerificationToken } from "@/lib/data/verification-token";

export const signIn = async (provider, options) => {
  try {
    console.log("signIn", Date.now());
    const session = await authSignIn(provider, {
      ...options,
      redirectTo: DEFAULT_SIGN_IN_REDIRECT,
    });
    return session;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "使用者帳號或密碼錯誤" };
        default:
          return { error: "Something went wrong. Please try again later." };
      }
    }
    throw error;
  }
};

export const signUp = async (provider, options) => {
  try {
    const { email, password, name } = options;
    await connectToMongoDB();
    const existedUser = await mongoose.models.User.findOne({ email });
    if (existedUser) {
      return { error: "Email already in use!" };
    }

    const hashedPassword = await hash(password, 10);
    await mongoose.models.User.create({
      email,
      password: hashedPassword,
      name,
    });

    await createVerificationToken(email, "sign-up");
    // TODO: Send email verification to user
    return { success: "Confirmation email sent!" };

    // const session = await authSignIn(provider, {
    //   email,
    //   password,
    //   // TODO: Redirect to email verification page
    //   redirectTo: DEFAULT_SIGN_UP_REDIRECT,
    // });
    // return session;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "帳號已存在" };
        default:
          return { error: "Something went wrong. Please try again later." };
      }
    }
    throw error;
  }
};

export { signOut };
