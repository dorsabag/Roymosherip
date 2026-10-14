import { SectionCutout } from "@/components/SectionCutout/SectionCutout";
import { useState } from "react";
import { royContent } from "@/content/roy";
import { ChevronDown } from "lucide-react";

export function RoyDictionary() {
  const { dictionary } = royContent;
  const [openId, setOpenId] = useState<string | null>(null);
  
  return (
    <section className="roy-cutout-section roy-cutout-section--right py-24 px-4">
      <SectionCutout name="dictionary" />
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">מילון רועי השלם</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-4">
          {dictionary.map(entry => {
            if (!entry.definition && !entry.story) {
              return (
                <div key={entry.id} className="border rounded-2xl bg-background shadow-sm p-6">
                  <h3 className="text-xl font-bold text-foreground"><bdi>{entry.term}</bdi></h3>
                </div>
              );
            }
            const isOpen = openId === entry.id;
            return (
              <div 
                key={entry.id} 
                className="border rounded-2xl overflow-hidden bg-background shadow-sm transition-all"
              >
                <button 
                  className="w-full text-right p-6 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setOpenId(isOpen ? null : entry.id)}
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">
                      <bdi>{entry.term}</bdi>
                    </h3>
                    {entry.type && (
                      <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                        <bdi>{entry.type}</bdi>
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 space-y-4 text-muted-foreground">
                      <p className="text-lg text-foreground/90 font-medium">
                        <bdi>{entry.definition}</bdi>
                      </p>
                      {entry.story && (
                        <div className="bg-secondary/40 p-4 rounded-xl text-sm leading-relaxed border border-secondary">
                          <bdi>{entry.story}</bdi>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
