"use client";

import { useActionState } from "react";

type AuthActionState = {
  mode: "sign-in" | "sign-up";
  error?: string;
};

const initialStateByMode: Record<AuthActionState["mode"], AuthActionState> = {
  "sign-in": { mode: "sign-in" },
  "sign-up": { mode: "sign-up" },
};

export function AuthForm({
  title,
  description,
  action,
  mode,
  callbackUrl,
}: {
  title: string;
  description: string;
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  mode: AuthActionState["mode"];
  callbackUrl: string;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialStateByMode[mode],
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/80"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">
          {state.error}
        </p>
      ) : null}

      {mode === "sign-up" ? (
        <label className="block space-y-2 text-sm">
          <span>Name</span>
          <input
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none transition focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
            name="name"
            placeholder="Shubham"
            type="text"
            required
          />
        </label>
      ) : null}

      <label className="block space-y-2 text-sm">
        <span>Email</span>
        <input
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none transition focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
          name="email"
          placeholder="you@example.com"
          type="email"
          required
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span>Password</span>
        <input
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none transition focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
          name="password"
          placeholder="Minimum 8 characters"
          type="password"
          minLength={8}
          required
        />
      </label>

      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <button
        className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black"
        type="submit"
        disabled={pending}
      >
        {pending
          ? mode === "sign-in"
            ? "Signing in..."
            : "Creating account..."
          : mode === "sign-in"
            ? "Sign in"
            : "Create account"}
      </button>
    </form>
  );
}
