import { ExternalLink } from "lucide-react";
import { royContent, type TributeItem } from "@/content/roy";
import { TributeCarousel } from "./TributeCarousel";

function safeWebUrl(value: string, httpsOnly = false): string | null {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || (!httpsOnly && url.protocol === "http:")) {
      return url.href;
    }
  } catch {
    // A relative or malformed address is not suitable for an external link or embed.
  }
  return null;
}

function TributeMedia({ item }: { item: TributeItem }) {
  if (item.kind === "photo") {
    return (
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
        data-testid={`img-tribute-${item.id}`}
      />
    );
  }

  if (item.kind === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        controls
        preload="metadata"
        playsInline
        aria-label={item.title}
        className="block aspect-video w-full bg-foreground/90 object-contain"
        data-testid={`video-tribute-${item.id}`}
      />
    );
  }

  if (item.kind === "youtube") {
    const videoId = encodeURIComponent(item.videoId);

    return (
      <div>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={`סרטון: ${item.title}`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block aspect-video w-full border-0 bg-muted"
          data-testid={`iframe-tribute-${item.id}`}
        />
        <div className="flex min-h-12 items-center justify-start border-t border-border/60 bg-background/70 px-4 py-3">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            data-testid={`link-open-tribute-${item.id}`}
          >
            צפייה ב-YouTube
            <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
          </a>
        </div>
      </div>
    );
  }

  if (item.kind === "carousel") {
    return <TributeCarousel item={item} />;
  }

  const embedUrl = safeWebUrl(item.embedUrl, true);
  const externalUrl = safeWebUrl(item.url);

  return (
    <div>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={`תצוגת אתר: ${item.title}`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block aspect-[4/3] w-full border-0 bg-muted md:aspect-[16/10]"
          data-testid={`iframe-tribute-${item.id}`}
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-muted px-8 text-center text-sm leading-relaxed text-muted-foreground md:aspect-[16/10]">
          לא ניתן להציג את האתר כאן.
        </div>
      )}
      <div className="flex min-h-12 items-center justify-start border-t border-border/60 bg-background/70 px-4 py-3">
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            data-testid={`link-open-tribute-${item.id}`}
          >
            פתיחה באתר המקורי
            <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">קישור לאתר אינו זמין</span>
        )}
      </div>
    </div>
  );
}

export function Tributes() {
  const { tributes } = royContent;

  return (
    <section id="tributes" dir="rtl" aria-labelledby="tributes-heading" className="scroll-mt-20 bg-secondary/20 px-4 pt-14 pb-24 md:px-8 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 space-y-6 text-center md:mb-16">
          <h2 id="tributes-heading" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            הנצחה
          </h2>
          <div aria-hidden="true" className="mx-auto h-1 w-16 rounded-full bg-primary/40" />
          <p className="mx-auto max-w-xl text-base leading-loose text-muted-foreground md:text-lg">
            תמונות, סרטונים ואתרים המוקדשים לזכרו של רועי.
          </p>
        </header>

        {tributes.length === 0 ? (
          <div className="mx-auto max-w-2xl border-y border-border/70 px-6 py-16 text-center md:py-20" data-testid="status-tributes-empty">
            <p className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
              מקום לשמור בו את זכרו
            </p>
            <p className="mt-4 text-base leading-loose text-muted-foreground">
              פריטי הנצחה יוצגו כאן כשיהיו זמינים.
            </p>
          </div>
        ) : (
          <div className={tributes.length === 1 ? "mx-auto max-w-3xl" : "grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"}>
            {tributes.map((item) => (
              <article
                key={item.id}
                className="break-inside-avoid overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm"
                data-testid={`card-tribute-${item.id}`}
              >
                <div className="overflow-hidden bg-muted">
                  <TributeMedia item={item} />
                </div>
                <div className="flex min-h-32 items-center border-t border-border/60 px-5 py-5 md:px-6">
                  <h3 className="text-lg font-semibold leading-relaxed text-foreground" data-testid={`text-tribute-title-${item.id}`}>
                    <bdi>{item.title}</bdi>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}