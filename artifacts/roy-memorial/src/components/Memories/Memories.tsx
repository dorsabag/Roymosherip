import { SectionCutout } from "@/components/SectionCutout/SectionCutout";
import { useState } from "react";
import { useListMemories, getListMemoriesQueryKey } from "@workspace/api-client-react";
import { memoryPrompts } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MemoryForm } from "./MemoryForm";

export function Memories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: memories = [], isLoading, isError } = useListMemories({
    query: {
      queryKey: getListMemoriesQueryKey(),
      refetchInterval: 30000 // Refetch every 30 seconds
    }
  });

  return (
    <section id="memories" className="roy-cutout-section py-24 px-4 bg-background">
      <SectionCutout name="memories" />
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">חברים ומשפחה כותבים על רועי</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>

        <div className="flex justify-center pb-8">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:-translate-y-1">
                שתפו זיכרון משלכם
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 border-0 bg-secondary/10 overflow-hidden" dir="rtl">
              <div className="bg-background p-6 sm:p-8 rounded-xl border max-h-[90vh] overflow-y-auto">
                <DialogTitle className="text-2xl font-bold mb-6 text-center">שתף זיכרון מרועי</DialogTitle>
                <MemoryForm onSuccess={() => setIsModalOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-muted animate-pulse rounded-2xl h-64"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed">
            לא הצלחנו לטעון את הזיכרונות כעת.
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-16 px-4 bg-secondary/20 rounded-3xl border border-dashed">
            <h3 className="text-xl font-medium text-foreground/80 mb-2">מקום לזיכרונות שלכם</h3>
            <p className="text-muted-foreground">כאן יופיעו זיכרונות לאחר אישור המשפחה.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {memories.map(memory => {
              const prompt = memoryPrompts.find(p => p.key === memory.promptKey)?.label;
              return (
                <div key={memory.id} className="break-inside-avoid bg-secondary/20 border shadow-sm rounded-2xl p-6 md:p-8 hover:shadow-md transition-shadow">
                  {prompt && (
                    <div className="text-primary font-bold text-lg mb-4 leading-snug">
                      {prompt}
                    </div>
                  )}
                  <p className="text-foreground/90 leading-relaxed font-medium mb-6 whitespace-pre-wrap">
                    {memory.memoryText}
                  </p>
                  <div className="pt-4 border-t border-border/50">
                    <p className="font-bold text-foreground">{memory.name}</p>
                    <p className="text-sm text-muted-foreground">{memory.relationship}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}