import { signOut } from "@/auth";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
            Protected Route
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Welcome to your chat workspace
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-300">
            This page is protected by `proxy.ts`. Unauthenticated visitors are
            redirected to `/sign-in` before this route renders.
          </p>
        </div>

        <div className="rounded-3xl border border-dashed border-black/10 bg-white p-8 dark:border-white/10 dark:bg-neutral-900">
          <h2 className="text-lg font-medium">Next suggested step</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            Start building the conversation UI and message persistence inside
            this protected area.
          </p>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/sign-in" });
            }}
            className="mt-6"
          >
            <button
              className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
