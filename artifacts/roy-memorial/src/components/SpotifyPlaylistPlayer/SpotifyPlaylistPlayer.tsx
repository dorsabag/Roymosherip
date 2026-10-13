import { useState, useRef, useEffect } from "react";
import { royContent } from "@/content/roy";
import { SpotifyEmbed } from "./SpotifyEmbed";
import { SectionCutout } from "@/components/SectionCutout/SectionCutout";

export function SpotifyPlaylistPlayer() {
  const { spotify } = royContent;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Load slightly before it comes into view
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Extract playlist ID from URL or URI if provided
  let spotifySrc = "";
  if (spotify.playlistUrl) {
    try {
      const url = new URL(spotify.playlistUrl);
      if (url.hostname === "open.spotify.com" && url.pathname.includes("/playlist/")) {
        const id = url.pathname.split("/playlist/")[1].split("?")[0];
        if (/^[a-zA-Z0-9]+$/.test(id)) spotifySrc = id;
      }
    } catch(e) {}
  } else if (spotify.playlistUri) {
    const id = spotify.playlistUri.replace("spotify:playlist:", "");
    if (/^[a-zA-Z0-9]+$/.test(id)) spotifySrc = id;
  }

  return (
    <section id="music" ref={sectionRef} className="roy-cutout-section py-24 px-4">
      <SectionCutout name="music" />
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">הפסקול של רועי</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>
        
        <p className="text-xl text-center font-medium text-foreground/80 max-w-2xl mx-auto leading-relaxed">
          <bdi>{spotify.intro}</bdi>
        </p>
        
        <div className="bg-secondary/30 p-4 md:p-8 rounded-3xl border shadow-sm">
          {!spotifySrc ? (
            <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-background border-2 border-dashed border-muted-foreground/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
              <p className="text-muted-foreground"><bdi>[PLACEHOLDER: פלייליסט ספוטיפיי יופיע כאן]</bdi></p>
              <p className="text-sm text-muted-foreground/70 max-w-sm">
                כאן יופיע נגן ספוטיפיי לאחר שתוזן כתובת הפלייליסט.
              </p>
            </div>
          ) : (
            isIntersecting ? (
              <SpotifyEmbed id={spotifySrc} />
            ) : (
              <div className="w-full h-[380px] bg-muted animate-pulse rounded-2xl"></div>
            )
          )}
          
          {spotify.musicStory && (
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground text-center">
                <bdi>{spotify.musicStory}</bdi>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}