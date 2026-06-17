"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportSchema } from "@/lib/validation";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");
  return session.user;
}

async function requireAdmin() {
  const user = await requireUser();
  if ((user as { role?: string }).role !== "ADMIN") redirect("/");
  return user;
}

export type ActionResult = { ok: boolean; error?: string };

export async function createReport(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();

  const raw = {
    title: formData.get("title"),
    authorName: formData.get("authorName"),
    documentDate: formData.get("documentDate"),
    topic: formData.get("topic"),
    summary: formData.get("summary"),
    confidentiality: formData.get("confidentiality"),
    sourceType: formData.get("sourceType"),
    fileKey: formData.get("fileKey") || undefined,
    fileName: formData.get("fileName") || undefined,
    sharepointUrl: formData.get("sharepointUrl") || undefined,
  };

  const parsed = reportSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const d = parsed.data;
  await prisma.report.create({
    data: {
      title: d.title,
      authorName: d.authorName,
      documentDate: new Date(d.documentDate),
      topic: d.topic,
      summary: d.summary,
      confidentiality: d.confidentiality,
      sourceType: d.sourceType,
      fileKey: d.sourceType === "FILE" ? d.fileKey : null,
      fileName: d.sourceType === "FILE" ? d.fileName : null,
      sharepointUrl: d.sourceType === "SHAREPOINT" ? d.sharepointUrl : null,
      createdById: user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/rapports");
  redirect("/rapports");
}

export async function deleteReport(id: string): Promise<void> {
  await requireAdmin();
  await prisma.report.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/rapports");
  revalidatePath("/admin/rapports");
}

export async function setAccountStatus(
  userId: string,
  status: "APPROVED" | "REJECTED"
): Promise<void> {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/admin/comptes");
}

export async function setAccountRole(userId: string, role: "READER" | "ADMIN"): Promise<void> {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/comptes");
}
