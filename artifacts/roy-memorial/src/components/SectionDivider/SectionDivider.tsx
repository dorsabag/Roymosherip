import { Heart } from "lucide-react";

export function SectionDivider() {
  return (
    <div aria-hidden="true" className="bg-secondary/20 px-4 py-6 md:py-8">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <Heart className="h-4 w-4 shrink-0 text-primary/60" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      </div>
    </div>
  );
}