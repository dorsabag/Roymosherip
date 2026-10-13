import { royContent } from "@/content/roy";

export function October7() {
  const { october7 } = royContent;
  
  return (
    <section id="october7" className="scroll-mt-16 py-24 px-4 bg-foreground text-background">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">7 באוקטובר 2023</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>
        
        <div className="text-lg md:text-xl leading-relaxed md:leading-loose text-background/90 max-w-4xl mx-auto font-medium whitespace-pre-line text-center">
          <bdi>{october7.text}</bdi>
        </div>
      </div>
    </section>
  );
}