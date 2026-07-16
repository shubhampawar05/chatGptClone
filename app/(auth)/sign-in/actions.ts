"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/db";

type AuthActionState = {
  mode: "sign-in" | "sign-up";
  error?: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function resolveRedirectTo(formData: FormData) {
  const callbackUrl = getStringValue(formData, "callbackUrl");
  if (!callbackUrl.startsWith("/")) {
    return "/chat";
  }

  return callbackUrl;
}

export async function authenticate(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringValue(formData, "email").toLowerCase();
  const password = getStringValue(formData, "password");
  const redirectTo = resolveRedirectTo(formData);

  if (!email || !password) {
    return {
      mode: "sign-in",
      error: "Email and password are required.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        mode: "sign-in",
        error: "Invalid email or password.",
      };
    }

    throw error;
  }

  return { mode: "sign-in" };
}

export async function register(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = getStringValue(formData, "name");
  const email = getStringValue(formData, "email").toLowerCase();
  const password = getStringValue(formData, "password");
  const redirectTo = resolveRedirectTo(formData);

  if (!name || !email || !password) {
    return {
      mode: "sign-up",
      error: "Name, email, and password are required.",
    };
  }

  if (password.length < 8) {
    return {
      mode: "sign-up",
      error: "Password must be at least 8 characters long.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      mode: "sign-up",
      error: "An account with this email already exists.",
    };
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        mode: "sign-up",
        error: "Account created, but automatic sign-in failed. Please sign in manually.",
      };
    }

    throw error;
  }

  return { mode: "sign-up" };
}
