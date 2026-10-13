import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "@/components/Gallery/Lightbox";
import type { TributeItem } from "@/content/roy";

type CarouselItem = Extract<TributeItem, { kind: "carousel" }>;

export function TributeCarousel({ item }: { item: CarouselItem }) {
  const { photos } = item;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndexState] = useState<number | null>(null);
  const photoButtonRef = useRef<HTMLButtonElement>(null);
  const wasExpanded = useRef(false);

  const setExpandedIndex = useCallback((index: number | null) => {
    setExpandedIndexState(index);
    if (index !== null) setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (expandedIndex !== null) {
      wasExpanded.current = true;
    } else if (wasExpanded.current) {
      photoButtonRef.current?.focus();
      wasExpanded.current = false;
    }
  }, [expandedIndex]);

  const previous = () => setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
  const next = () => setActiveIndex((index) => (index + 1) % photos.length);
  const photo = photos[activeIndex];

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-muted" data-testid={`carousel-tribute-${item.id}`}>
        <button
          ref={photoButtonRef}
          type="button"
          onClick={() => setExpandedIndex(activeIndex)}
          aria-label={`הגדלת תמונה ${activeIndex + 1} מתוך ${photos.length}: ${photo.alt}`}
          className="absolute inset-0 h-full w-full cursor-zoom-in focus-visible:z-20 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
          data-testid={`carousel-open-${item.id}`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            decoding="async"
            className="h-full w-full object-cover"
            data-testid={`carousel-image-${item.id}`}
          />
        </button>

        <button
          type="button"
          onClick={previous}
          aria-label="תמונה קודמת"
          className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          data-testid={`carousel-previous-${item.id}`}
        >
          <ChevronRight aria-hidden="true" className="size-6" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="תמונה הבאה"
          className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          data-testid={`carousel-next-${item.id}`}
        >
          <ChevronLeft aria-hidden="true" className="size-6" />
        </button>
      </div>
      <div className="flex min-h-12 items-center justify-center border-t border-border/60 bg-background/70">
        {photos.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`מעבר לתמונה ${index + 1} מתוך ${photos.length}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className="grid size-6 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className={`size-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-muted-foreground/50"}`} />
          </button>
        ))}
      </div>

      {expandedIndex !== null && createPortal(
        <Lightbox
          gallery={photos}
          selectedIndex={expandedIndex}
          setSelectedIndex={setExpandedIndex}
        />,
        document.body
      )}
    </>
  );
}