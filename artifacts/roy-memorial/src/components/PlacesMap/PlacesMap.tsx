import { useState, useEffect, useRef } from "react";
import { royContent, type RoyPlace, type MappedPlace } from "@/content/roy";
import { Component, ReactNode, ErrorInfo } from 'react';
import MapComponent from "./MapComponent";
import { SectionCutout } from "@/components/SectionCutout/SectionCutout";

class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Map component error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-muted">
          <div className="text-muted-foreground/50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <p className="text-muted-foreground">לא ניתן לטעון את המפה כעת. ניתן להמשיך לקרוא על המקומות למטה.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PlacesMap() {
  const { places } = royContent;
  const mappedPlaces = places.filter((place): place is MappedPlace =>
    typeof place.latitude === "number" && typeof place.longitude === "number"
  );
  const [activePlace, setActivePlace] = useState(places[0]);
  const [focusRequest, setFocusRequest] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  function handleCardClick(place: RoyPlace) {
    setActivePlace(place);
    if (typeof place.latitude !== "number" || typeof place.longitude !== "number") return;

    setFocusRequest((request) => request + 1);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      mapContainerRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "center",
      });
    }
  }
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // Load before it comes fully into view
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="places" ref={sectionRef} className="roy-cutout-section py-24 px-4">
      <SectionCutout name="places" />
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">מקומות מרכזיים</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div ref={mapContainerRef} className="lg:col-span-2 h-[320px] lg:h-[500px] bg-muted rounded-2xl overflow-hidden border shadow-sm relative z-0">
            {mappedPlaces.length > 0 ? (
              isIntersecting ? (
                <MapErrorBoundary>
                  <MapComponent places={mappedPlaces} activePlace={mappedPlaces.find(place => place.id === activePlace?.id) ?? mappedPlaces[0]} focusRequest={focusRequest} onPlaceSelect={setActivePlace} />
                </MapErrorBoundary>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-muted">
                  <div className="text-muted-foreground/50 mb-4 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <p className="text-muted-foreground animate-pulse">טוען מפה...</p>
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-muted">
                <div className="text-muted-foreground/50 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <p className="text-muted-foreground">לא נוספו מיקומים מדויקים למפה</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6 hidden lg:block">מקומות</h3>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] gap-4 pb-4 lg:pb-0 scrollbar-hide pr-2">
              {places.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handleCardClick(place)}
                  aria-pressed={activePlace?.id === place.id}
                  className={`flex-none w-72 lg:w-full text-right p-6 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${typeof place.latitude === "number" && typeof place.longitude === "number" ? "cursor-pointer" : ""} ${activePlace?.id === place.id ? 'bg-background/95 border-primary shadow-sm' : 'bg-background hover:bg-secondary/40 hover:border-secondary-foreground/20'}`}
                >
                  <h4 className="text-lg font-bold text-foreground mb-1"><bdi>{place.name}</bdi></h4>
                  {place.year && <p className="text-sm text-primary mb-3 font-medium"><bdi>{place.year}</bdi></p>}
                  {place.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3"><bdi>{place.description}</bdi></p>
                  )}
                  {typeof place.latitude === "number" && typeof place.longitude === "number" && (
                    <span className="block mt-3 text-sm font-semibold text-primary">הצג במפה</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}