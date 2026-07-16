import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "@/lib/db";

const publicRoutes = new Set(["/sign-in"]);
const defaultProtectedRedirect = "/chat";

const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await compare(password, user.passwordHash);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
    authorized({ auth, request }) {
      const { pathname, search } = request.nextUrl;
      const isPublicRoute = publicRoutes.has(pathname);
      const isAuthenticated = Boolean(auth?.user);

      if (isPublicRoute && isAuthenticated) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = defaultProtectedRedirect;
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
      }

      if (!isPublicRoute && !isAuthenticated) {
        const signInUrl = request.nextUrl.clone();
        signInUrl.pathname = "/sign-in";
        signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return NextResponse.redirect(signInUrl);
      }

      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
