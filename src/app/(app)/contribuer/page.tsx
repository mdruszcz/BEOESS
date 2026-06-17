import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReportForm } from "@/components/ReportForm";

export default async function ContributePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/contribuer");

  const status = (session.user as { status?: string }).status;
  if (status !== "APPROVED") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-spf-ink">Compte en attente d&apos;approbation</h1>
        <p className="mt-2 text-sm text-slate-600">
          Vous pourrez ajouter des rapports une fois votre compte approuvé par un administrateur.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-spf-ink">Ajouter un rapport</h1>
        <p className="mt-1 text-sm text-slate-500">
          Renseignez les informations du document. Les documents confidentiels sont référencés via
          un lien SharePoint et ne sont jamais hébergés.
        </p>
      </div>
      <div className="rounded-card border border-spf-line bg-white p-6 sm:p-8">
        <ReportForm />
      </div>
    </div>
  );
}
