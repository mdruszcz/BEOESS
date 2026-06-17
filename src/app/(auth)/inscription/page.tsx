"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-card bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto text-emerald-500" size={40} />
        <h1 className="mt-3 text-lg font-bold text-spf-ink">Demande enregistrée</h1>
        <p className="mt-2 text-sm text-slate-600">
          Votre compte doit être approuvé par un administrateur avant la première connexion.
          Vous serez en mesure de vous connecter une fois l&apos;approbation effectuée.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded bg-spf-blue px-4 py-2 text-sm font-semibold text-white hover:bg-spf-royal"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-card bg-white p-8 shadow-xl">
      <h1 className="text-lg font-bold text-spf-ink">Créer un compte</h1>
      <p className="mt-1 text-xs text-slate-500">
        Réservé aux adresses @minfin.fed.be. Approbation par un administrateur requise.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium text-slate-600">
            Nom complet
          </label>
          <input
            id="name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded border border-spf-line px-3 py-2.5 text-sm outline-none focus:border-spf-blue"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-600">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@minfin.fed.be"
            className="w-full rounded border border-spf-line px-3 py-2.5 text-sm outline-none focus:border-spf-blue"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-600">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-spf-line px-3 py-2.5 text-sm outline-none focus:border-spf-blue"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Au moins 10 caractères, dont un chiffre.
          </p>
        </div>
        <button
          disabled={loading}
          className="w-full rounded bg-spf-blue py-2.5 text-sm font-semibold text-white hover:bg-spf-royal disabled:opacity-60"
        >
          Créer mon compte
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-spf-royal hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
