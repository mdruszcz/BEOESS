"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginBar() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Identifiants incorrects ou compte non approuvé.");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            autoComplete="email"
            required
            className="w-40 rounded border border-spf-line px-3 py-2 text-sm outline-none focus:border-spf-blue"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            autoComplete="current-password"
            required
            className="w-36 rounded border border-spf-line px-3 py-2 text-sm outline-none focus:border-spf-blue"
          />
          <button
            disabled={loading}
            className="rounded bg-spf-blue px-4 py-2 text-sm font-semibold text-white hover:bg-spf-royal disabled:opacity-60"
          >
            Se connecter
          </button>
        </div>
        {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
      </div>
    </form>
  );
}
