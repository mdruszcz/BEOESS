import { PrismaClient, Confidentiality, SourceType, Role, AccountStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Administrateur";

  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in your environment before seeding."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMIN, status: AccountStatus.APPROVED },
    create: {
      email,
      passwordHash,
      displayName: name,
      role: Role.ADMIN,
      status: AccountStatus.APPROVED,
    },
  });

  console.log(`✓ Admin ready: ${admin.email}`);

  // A couple of sample reports so the front page isn't empty on first run.
  const count = await prisma.report.count();
  if (count === 0) {
    await prisma.report.createMany({
      data: [
        {
          title: "Impact budgétaire des nouvelles mesures fiscales 2026",
          authorName: "Sophie Dubois",
          documentDate: new Date("2026-06-12"),
          topic: "Fiscalité",
          summary:
            "Analyse de l'impact des mesures fiscales introduites en 2026 sur les recettes de l'État et la charge fiscale des ménages.",
          confidentiality: Confidentiality.PUBLIC,
          sourceType: SourceType.SHAREPOINT,
          sharepointUrl: "https://minfin.sharepoint.com/sites/etudes/exemple-1",
          createdById: admin.id,
        },
        {
          title: "Économie belge : Perspectives 2026–2028",
          authorName: "Marc Dussac",
          documentDate: new Date("2026-06-10"),
          topic: "Économie",
          summary:
            "Projections macroéconomiques à moyen terme : croissance, inflation, marché du travail et finances publiques.",
          confidentiality: Confidentiality.PUBLIC,
          sourceType: SourceType.SHAREPOINT,
          sharepointUrl: "https://minfin.sharepoint.com/sites/etudes/exemple-2",
          createdById: admin.id,
        },
        {
          title: "Digitalisation des processus : État d'avancement",
          authorName: "Julie Martin",
          documentDate: new Date("2026-06-08"),
          topic: "Digitalisation",
          summary:
            "Point d'étape sur les chantiers de digitalisation du Service d'Études et perspectives pour le second semestre.",
          confidentiality: Confidentiality.INTERNAL,
          sourceType: SourceType.SHAREPOINT,
          sharepointUrl: "https://minfin.sharepoint.com/sites/etudes/exemple-3",
          createdById: admin.id,
        },
      ],
    });
    console.log("✓ Sample reports created");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
