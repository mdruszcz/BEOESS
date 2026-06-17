import Link from "next/link";
import { BookOpen, Star, Clock, UploadCloud, FolderTree, BarChart3 } from "lucide-react";

const TILES = [
  { icon: BookOpen, title: "Tous les rapports", sub: "Explorer la bibliothèque", href: "/rapports" },
  { icon: Star, title: "Rapports à la une", sub: "Sélection du moment", href: "/rapports?tri=une" },
  { icon: Clock, title: "Ajoutés récemment", sub: "Nouveautés", href: "/rapports?tri=recent" },
  { icon: UploadCloud, title: "Ajouter un rapport", sub: "Contribuer à la bibliothèque", href: "/contribuer" },
  { icon: FolderTree, title: "Par thématiques", sub: "Explorer par sujet", href: "/rapports" },
  { icon: BarChart3, title: "Tableaux de bord", sub: "Analyses et indicateurs", href: "/rapports" },
];

export function TileGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {TILES.map(({ icon: Icon, title, sub, href }) => (
        <Link
          key={title}
          href={href}
          className="group flex flex-col gap-3 rounded-card bg-spf-blue p-4 text-white transition hover:bg-spf-royal"
        >
          <Icon size={26} className="opacity-90" />
          <div>
            <div className="text-sm font-bold leading-snug">{title}</div>
            <div className="mt-0.5 text-xs text-blue-100">{sub}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
