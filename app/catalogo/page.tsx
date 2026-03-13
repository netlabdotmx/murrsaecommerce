import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CatalogoContent } from "./catalogo-content";

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-murrsa-cream flex items-center justify-center">
          <Loader2 size={40} className="text-murrsa-red animate-spin" />
        </div>
      }
    >
      <CatalogoContent />
    </Suspense>
  );
}
