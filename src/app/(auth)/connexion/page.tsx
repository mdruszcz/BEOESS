"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";

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
      setError("Identifiants incorrects, ou compte non encore approuvé.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="rounded-card bg-white p-8 shadow-xl">
      <h1 className="text-lg font-bold text-spf-ink">Connexion</h1>
      <p className="mt-1 text-xs text-slate-500">
        Accès réservé aux agents du SPF Finances.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <Field label="Adresse email" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@minfin.fed.be"
            className="w-full rounded border border-spf-line px-3 py-2.5 text-sm outline-none focus:border-spf-blue"
          />
        </Field>
        <Field label="Mot de passe" htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-spf-line px-3 py-2.5 text-sm outline-none focus:border-spf-blue"
          />
        </Field>
        <button
          disabled={loading}
          className="w-full rounded bg-spf-blue py-2.5 text-sm font-semibold text-white hover:bg-spf-royal disabled:opacity-60"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-spf-royal hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
