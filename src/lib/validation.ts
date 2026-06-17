import { z } from "zod";

const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN ?? "minfin.fed.be";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Adresse email invalide.")
  .refine((e) => e.endsWith(`@${allowedDomain}`), {
    message: `L'inscription est réservée aux adresses @${allowedDomain}.`,
  });

export const passwordSchema = z
  .string()
  .min(10, "Le mot de passe doit contenir au moins 10 caractères.")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().trim().min(2, "Veuillez indiquer votre nom."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const reportSchema = z
  .object({
    title: z.string().trim().min(3, "Titre trop court.").max(300),
    authorName: z.string().trim().min(2, "Auteur requis."),
    documentDate: z.string().min(1, "Date requise."),
    topic: z.string().trim().min(2, "Thématique requise."),
    summary: z.string().trim().min(10, "Résumé trop court.").max(4000),
    confidentiality: z.enum(["PUBLIC", "INTERNAL", "RESTRICTED"]),
    sourceType: z.enum(["FILE", "SHAREPOINT"]),
    fileKey: z.string().optional(),
    fileName: z.string().optional(),
    sharepointUrl: z.string().url("Lien invalide.").optional(),
  })
  .refine(
    (d) => (d.sourceType === "FILE" ? !!d.fileKey : !!d.sharepointUrl),
    { message: "Source incomplète : fichier ou lien manquant." }
  )
  .refine(
    // Restricted documents must never be hosted — SharePoint link only.
    (d) => !(d.confidentiality === "RESTRICTED" && d.sourceType === "FILE"),
    { message: "Un document confidentiel ne peut pas être hébergé ; utilisez un lien SharePoint." }
  )
  .refine(
    (d) =>
      !d.sharepointUrl ||
      /(^|\.)sharepoint\.com$/i.test(new URL(d.sharepointUrl).hostname),
    { message: "Le lien doit pointer vers un domaine SharePoint." }
  );

export type ReportInput = z.infer<typeof reportSchema>;
