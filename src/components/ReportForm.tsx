"use client";

import { useActionState, useState } from "react";
import { UploadCloud, Link as LinkIcon, FileUp, AlertCircle, Loader2, FileText, X } from "lucide-react";
import { createReport, type ActionResult } from "@/lib/actions";

const TOPICS = ["Fiscalité", "Économie", "Budget", "Digitalisation", "Indicateurs", "Réglementation", "Autre"];

const CONFIDENTIALITY = [
  { value: "PUBLIC", label: "Public", hint: "Visible par tous" },
  { value: "INTERNAL", label: "Interne", hint: "Agents connectés" },
  { value: "RESTRICTED", label: "Restreint", hint: "Lien SharePoint uniquement" },
] as const;

const MAX_MB = 25;

export function ReportForm() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createReport, {
    ok: true,
  });

  const [sourceType, setSourceType] = useState<"FILE" | "SHAREPOINT">("SHAREPOINT");
  const [confidentiality, setConfidentiality] = useState<string>("INTERNAL");

  // R2 upload state
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Restricted documents force SharePoint (never hosted).
  const fileDisabled = confidentiality === "RESTRICTED";

  async function handleFile(f: File) {
    setUploadError(null);
    if (f.type !== "application/pdf") {
      setUploadError("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setUploadError(`Fichier trop volumineux (max ${MAX_MB} Mo).`);
      return;
    }
    setFile(f);
    setUploading(true);
    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: f.name, contentType: f.type }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Échec de la préparation de l'envoi.");
      }
      const { url, key } = await res.json();
      const put = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": f.type },
        body: f,
      });
      if (!put.ok) throw new Error("Échec de l'envoi vers le stockage.");
      setFileKey(key);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Erreur d'envoi.");
      setFile(null);
      setFileKey("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      {/* Title */}
      <Field label="Titre" htmlFor="title" required>
        <input
          id="title"
          name="title"
          required
          maxLength={300}
          className="input"
          placeholder="Titre complet du rapport ou de l'analyse"
        />
      </Field>

      {/* Author + Date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Auteur" htmlFor="authorName" required>
          <input id="authorName" name="authorName" required className="input" placeholder="Nom de l'auteur" />
        </Field>
        <Field label="Date du document" htmlFor="documentDate" required>
          <input id="documentDate" name="documentDate" type="date" required className="input" />
        </Field>
      </div>

      {/* Topic */}
      <Field label="Thématique" htmlFor="topic" required>
        <select id="topic" name="topic" required className="input" defaultValue="">
          <option value="" disabled>
            Choisir une thématique…
          </option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      {/* Summary */}
      <Field label="Résumé" htmlFor="summary" required>
        <textarea
          id="summary"
          name="summary"
          required
          rows={4}
          maxLength={4000}
          className="input resize-none"
          placeholder="Bref résumé du contenu, des objectifs et des conclusions principales…"
        />
      </Field>

      {/* Confidentiality */}
      <div>
        <Label>Confidentialité</Label>
        <input type="hidden" name="confidentiality" value={confidentiality} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {CONFIDENTIALITY.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setConfidentiality(c.value);
                if (c.value === "RESTRICTED") setSourceType("SHAREPOINT");
              }}
              className={`flex flex-col items-start rounded border px-3 py-2 text-left transition ${
                confidentiality === c.value
                  ? "border-spf-blue bg-spf-sky"
                  : "border-spf-line hover:bg-slate-50"
              }`}
            >
              <span className="text-sm font-medium text-spf-ink">{c.label}</span>
              <span className="text-[11px] text-slate-500">{c.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Source type toggle */}
      <div>
        <Label>Source du document</Label>
        <input type="hidden" name="sourceType" value={sourceType} />
        <input type="hidden" name="fileKey" value={sourceType === "FILE" ? fileKey : ""} />
        <input type="hidden" name="fileName" value={sourceType === "FILE" ? file?.name ?? "" : ""} />
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={fileDisabled}
            onClick={() => setSourceType("FILE")}
            className={`flex items-start gap-3 rounded border px-4 py-3 text-left transition ${
              sourceType === "FILE" ? "border-spf-blue bg-spf-sky" : "border-spf-line hover:bg-slate-50"
            } ${fileDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <FileUp size={18} className="mt-0.5 text-spf-royal" />
            <div>
              <div className="text-sm font-medium text-spf-ink">Fichier PDF</div>
              <div className="text-xs text-slate-500">Hébergé dans la bibliothèque</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setSourceType("SHAREPOINT")}
            className={`flex items-start gap-3 rounded border px-4 py-3 text-left transition ${
              sourceType === "SHAREPOINT" ? "border-spf-blue bg-spf-sky" : "border-spf-line hover:bg-slate-50"
            }`}
          >
            <LinkIcon size={18} className="mt-0.5 text-spf-royal" />
            <div>
              <div className="text-sm font-medium text-spf-ink">Lien SharePoint</div>
              <div className="text-xs text-slate-500">Document conservé sur SharePoint</div>
            </div>
          </button>
        </div>
        {fileDisabled && (
          <p className="mt-2 text-xs text-amber-600">
            Un document restreint ne peut pas être hébergé : utilisez un lien SharePoint.
          </p>
        )}
      </div>

      {/* Source input */}
      {sourceType === "FILE" ? (
        <div>
          {file ? (
            <div className="flex items-center gap-3 rounded border border-emerald-300 bg-emerald-50 px-4 py-3">
              <FileText size={20} className="text-rose-600" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-spf-ink">{file.name}</div>
                <div className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(1)} Mo
                  {uploading ? " · envoi en cours…" : fileKey ? " · prêt" : ""}
                </div>
              </div>
              {uploading ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileKey("");
                  }}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded border-2 border-dashed border-spf-line bg-slate-50 px-6 py-10 text-center hover:border-spf-blue hover:bg-spf-sky/40">
              <UploadCloud size={24} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                Choisir un fichier PDF
              </span>
              <span className="text-[11px] text-slate-400">PDF uniquement · max {MAX_MB} Mo</span>
              <input
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </label>
          )}
          {uploadError && (
            <p className="mt-2 flex items-center gap-1 text-xs text-rose-600">
              <AlertCircle size={12} /> {uploadError}
            </p>
          )}
        </div>
      ) : (
        <Field label="Lien SharePoint" htmlFor="sharepointUrl" required>
          <input
            id="sharepointUrl"
            name="sharepointUrl"
            type="url"
            required
            className="input"
            placeholder="https://minfin.sharepoint.com/sites/etudes/…"
          />
        </Field>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-3 border-t border-spf-line pt-5">
        <button
          type="submit"
          disabled={pending || uploading || (sourceType === "FILE" && !fileKey)}
          className="flex items-center gap-2 rounded bg-spf-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-spf-royal disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          Publier le rapport
        </button>
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 block text-sm font-medium text-slate-700">{children}</div>;
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
