import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createUploadUrl } from "@/lib/r2";

// Issues a short-lived presigned PUT URL so the browser uploads
// the PDF directly to R2 (the server never proxies the bytes).
export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || !role) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const fileName: string | undefined = body?.fileName;
  const contentType: string | undefined = body?.contentType;

  if (!fileName || contentType !== "application/pdf") {
    return NextResponse.json(
      { error: "Seuls les fichiers PDF sont acceptés." },
      { status: 400 }
    );
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `reports/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  try {
    const url = await createUploadUrl(key, contentType);
    return NextResponse.json({ url, key });
  } catch {
    return NextResponse.json(
      { error: "Stockage non configuré. Contactez l'administrateur." },
      { status: 500 }
    );
  }
}
