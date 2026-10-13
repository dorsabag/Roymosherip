import { SectionCutout } from "@/components/SectionCutout/SectionCutout";
import { useState } from "react";
import { royContent } from "@/content/roy";

function FunFactCard({ label, value }: { label: string, value: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button 
      className="relative w-full h-72 cursor-pointer rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      aria-expanded={flipped}
    >
      <div className={`absolute inset-0 bg-background border shadow-sm p-6 flex items-center justify-center text-center transition-opacity duration-300 ${flipped ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-xl font-medium text-foreground"><bdi>{label}</bdi></h3>
      </div>
      <div className={`absolute inset-0 bg-primary/10 border border-primary/20 p-6 flex items-center justify-center text-center transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-base leading-relaxed font-semibold text-primary"><bdi>{value}</bdi></p>
      </div>
    </button>
  );
}

export function FunFacts() {
  const { funFacts } = royContent;
  
  return (
    <section className="roy-cutout-section roy-cutout-section--right py-24 px-4 bg-secondary/20">
      <SectionCutout name="fun-facts" />
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">הידעתם?</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {funFacts.map(fact => (
            <FunFactCard key={fact.id} label={fact.label} value={fact.value} />
          ))}
        </div>
      </div>
    </section>
  );
}