import { useState, useRef, useEffect } from "react";
import { royContent } from "@/content/roy";
import Lightbox from "./Lightbox";

export function Gallery() {
  const { gallery } = royContent;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const lastSelectedIndex = useRef<number | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (selectedIndex !== null) {
      lastSelectedIndex.current = selectedIndex;
    } else if (lastSelectedIndex.current !== null) {
      // Restore focus to the gallery item that opened the lightbox
      const el = itemRefs.current[lastSelectedIndex.current];
      if (el) el.focus();
      lastSelectedIndex.current = null;
    }
  }, [selectedIndex]);

  return (
    <section id="gallery" className="py-24 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">רועי בתמונות</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {gallery.map((photo, index) => (
            <button 
              key={photo.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              className="block w-full text-left break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl bg-muted border focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => setSelectedIndex(index)}
              aria-label={`פתיחת תמונה ${index + 1}: ${photo.alt}`}
            >
              {photo.src ? (
                <img 
                  src={photo.src} 
                  alt={photo.alt} 
                  width={photo.width}
                  height={photo.height}
                  decoding="async"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className={`w-full flex items-center justify-center p-4 text-center text-muted-foreground text-sm border-dashed border-2 border-muted-foreground/20
                  ${photo.orientation === 'portrait' ? 'aspect-[3/4]' : photo.orientation === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'}`}>
                  <bdi>{photo.alt}</bdi>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>
      {selectedIndex !== null && (
          <Lightbox
            gallery={gallery} 
            selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} 
          />
      )}
    </section>
  );
}