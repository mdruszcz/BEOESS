import Link from "next/link";
import { Search, HelpCircle, Lock, LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { SpfLogo } from "@/components/SpfLogo";
import { LoginBar } from "@/components/LoginBar";

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Rapports & analyses", href: "/rapports" },
  { label: "Contribuer", href: "/contribuer" },
];

export async function SiteHeader() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <header className="border-b border-spf-line bg-white">
      {/* Top row: brand + login / account */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-4">
          <SpfLogo />
          <div className="hidden border-l border-spf-line pl-4 sm:block">
            <div className="text-sm font-bold text-spf-ink">
              Bibliothèque des rapports et analyses
            </div>
            <div className="text-xs text-slate-500">Service d&apos;Études</div>
          </div>
        </Link>

        {session?.user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-600 sm:inline">
              {session.user.name}
            </span>
            {role === "ADMIN" && (
              <Link
                href="/admin"
                className="rounded bg-spf-sky px-3 py-1.5 font-medium text-spf-royal hover:bg-blue-100"
              >
                Administration
              </Link>
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="flex items-center gap-1.5 rounded border border-spf-line px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50">
                <LogOut size={14} /> Déconnexion
              </button>
            </form>
          </div>
        ) : (
          <LoginBar />
        )}
      </div>

      {/* Secondary row: nav + helper links + search */}
      <div className="border-t border-spf-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-spf-sky hover:text-spf-royal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!session?.user && (
              <>
                <Link
                  href="/connexion"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-spf-royal"
                >
                  <Lock size={12} /> Mot de passe oublié&nbsp;?
                </Link>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <HelpCircle size={12} /> Aide
                </span>
              </>
            )}
            <form action="/rapports" className="relative">
              <input
                type="search"
                name="q"
                placeholder="Rechercher un rapport, une analyse, un auteur…"
                className="w-full min-w-[240px] rounded border border-spf-line py-1.5 pl-3 pr-9 text-sm outline-none focus:border-spf-blue sm:w-80"
              />
              <button
                aria-label="Rechercher"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-spf-royal"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
