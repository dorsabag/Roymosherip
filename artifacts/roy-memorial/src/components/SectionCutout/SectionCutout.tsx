import { useEffect, useRef } from "react";

type CutoutName = "about" | "timeline" | "fun-facts" | "dictionary" | "memories" | "places" | "music";

const imageSizes: Record<CutoutName, { width: number; height: number }> = {
  about: { width: 1085, height: 1500 },
  timeline: { width: 1310, height: 1035 },
  "fun-facts": { width: 1061, height: 890 },
  dictionary: { width: 1408, height: 1228 },
  memories: { width: 1500, height: 1400 },
  places: { width: 1459, height: 1500 },
  music: { width: 1165, height: 921 },
};

/**
 * A purely decorative photograph in a reserved visual lane. Scroll movement
 * stays within that lane, never underneath the section's content.
 */
export function SectionCutout({ name }: { name: CutoutName }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const pictureRef = useRef<HTMLPictureElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const picture = pictureRef.current;
    const section = layer?.parentElement;
    if (!layer || !picture || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        picture.style.transform = "";
        return;
      }
      if (!visible) return;
      const bounds = section.getBoundingClientRect();
      const viewportMiddle = window.innerHeight / 2;
      const distance = (bounds.top + bounds.height / 2 - viewportMiddle) /
        (viewportMiddle + bounds.height / 2);
      const progress = Math.max(-1, Math.min(1, distance));
      // Only move into the clipping frame: a straight bottom edge cannot float.
      const offset = 12 + progress * 12;
      picture.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: "120px 0px" });
    observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [name]);

  return (
    <div ref={layerRef} className={`roy-cutout-layer roy-cutout--${name}`} aria-hidden="true">
      <picture ref={pictureRef} className="roy-cutout-picture">
        <source media="(max-width: 767px)" srcSet={`${import.meta.env.BASE_URL}images/roy/cutouts/${name}-mobile.webp`} type="image/webp" />
        <img
          src={`${import.meta.env.BASE_URL}images/roy/cutouts/${name}.webp`}
          alt=""
          width={imageSizes[name].width}
          height={imageSizes[name].height}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </picture>
    </div>
  );
}