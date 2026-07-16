import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { authenticate, register } from "./actions";
import { AuthForm } from "./auth-form";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/chat");
  }

  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl && params.callbackUrl.startsWith("/")
      ? params.callbackUrl
      : "/chat";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,1),_rgba(244,244,245,1))] px-4 py-10 text-neutral-950 dark:bg-[radial-gradient(circle_at_top,_rgba(244,244,245,0.14),_transparent_30%),linear-gradient(180deg,_rgba(10,10,10,1),_rgba(23,23,23,1))] dark:text-neutral-50">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-8 lg:flex-row lg:items-center">
        <section className="max-w-xl space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
            ChatGPT Clone
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Email authentication for your protected AI workspace.
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-300">
            This setup gives your clone a clean account system, a protected chat
            area, and route-level redirects when a visitor is not signed in.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10">
              Prisma user storage
            </span>
            <span className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10">
              Credentials auth
            </span>
            <span className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10">
              Protected routes
            </span>
          </div>
        </section>

        <section className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
          <AuthForm
            title="Sign in"
            description="Use your existing email and password."
            action={authenticate}
            mode="sign-in"
            callbackUrl={callbackUrl}
          />
          <AuthForm
            title="Create account"
            description="Create a new account stored in your database."
            action={register}
            mode="sign-up"
            callbackUrl={callbackUrl}
          />
        </section>
      </div>

      <footer className="mx-auto mt-6 max-w-6xl text-sm text-neutral-500 dark:text-neutral-400">
        Protected app route: <span className="font-medium">/chat</span>
      </footer>
    </main>
  );
}
