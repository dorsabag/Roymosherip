import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { GalleryItem } from "@/content/roy";

export default function Lightbox({
  gallery,
  selectedIndex,
  setSelectedIndex
}: {
  gallery: GalleryItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number | null) => void;
}) {
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
        return;
      }
      
      if (e.key === "ArrowRight") {
         setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : selectedIndex);
        return;
      }
      
      if (e.key === "ArrowLeft") {
         setSelectedIndex(selectedIndex < gallery.length - 1 ? selectedIndex + 1 : selectedIndex);
        return;
      }

      // Basic focus trap
      if (e.key === 'Tab') {
        const focusableElements = lightboxRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, gallery.length, setSelectedIndex]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // In RTL, swipe left (drag left) goes to "next", swipe right goes to "prev"
    if (isLeftSwipe && selectedIndex < gallery.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
    if (isRightSwipe && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div 
      ref={lightboxRef}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
      onClick={() => setSelectedIndex(null)}
      role="dialog"
      aria-modal="true"
      aria-label="תצוגת תמונה מוגדלת"
    >
      <button 
        ref={closeButtonRef}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
        onClick={() => setSelectedIndex(null)}
        aria-label="סגירת תמונה"
      >
        <X className="w-8 h-8" />
      </button>

      {selectedIndex > 0 && (
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 hidden md:block focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
          onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex - 1); }}
          aria-label="תמונה קודמת"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      )}

      <div 
        className="max-w-5xl max-h-[85vh] px-4 w-full flex flex-col items-center justify-center touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {gallery[selectedIndex].src ? (
          <img 
            src={gallery[selectedIndex].src} 
            alt={gallery[selectedIndex].alt} 
            className="max-h-[80vh] w-auto object-contain rounded-sm" 
          />
        ) : (
          <div className="w-full max-w-2xl aspect-[4/3] bg-muted/20 border border-white/20 text-white/60 flex items-center justify-center rounded-sm p-4 text-center">
            <bdi>{gallery[selectedIndex].alt}</bdi>
          </div>
        )}
        
        {gallery[selectedIndex].caption && (
          <div className="mt-4 text-white/80 text-center">
            <bdi>{gallery[selectedIndex].caption}</bdi>
          </div>
        )}
      </div>

      {selectedIndex < gallery.length - 1 && (
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 hidden md:block focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
          onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex + 1); }}
          aria-label="תמונה הבאה"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
      )}
    </div>
  );
}