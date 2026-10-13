import { royContent } from "@/content/roy";
import { SectionCutout } from "@/components/SectionCutout/SectionCutout";

export function Timeline() {
  const { timeline } = royContent;
  
  return (
    <section id="timeline" className="roy-cutout-section roy-cutout-section--right py-24 px-4">
      <SectionCutout name="timeline" />
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">הסיפור שלו</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative border-r-2 border-primary/20 space-y-8 pr-6 md:pr-8 border-r">
          {timeline.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -right-8 md:-right-10 w-4 h-4 rounded-full bg-background border-2 border-primary/50 group-hover:border-primary transition-colors mt-1.5" />
              
              <div className="space-y-2">
                <span className="text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/10 inline-block mb-2">
                  <bdi>{item.year}</bdi>
                </span>
                <div className={`relative p-6 rounded-2xl ${item.sticker ? 'pl-20 md:pl-24' : ''} ${item.type === 'story' ? 'bg-secondary/40' : 'bg-background border shadow-sm'}`}>
                  {item.sticker && (
                    <img
                      src={item.sticker.src}
                      alt={item.sticker.alt}
                      width={480}
                      height={480}
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none absolute -bottom-2 left-0 z-10 h-20 w-20 object-contain md:h-24 md:w-24"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">
                    <bdi>{item.title}</bdi>
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      <bdi>{item.description}</bdi>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}