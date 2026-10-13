import { useEffect, useRef, useState } from "react";

type Controller = { destroy: () => void; addListener: (event: string, callback: () => void) => void };
type SpotifyApi = { createController: (element: HTMLElement, options: { uri: string; width: string; height: number }, callback: (controller: Controller) => void) => void };
declare global { interface Window { onSpotifyIframeApiReady?: (api: SpotifyApi) => void } }
let apiPromise: Promise<SpotifyApi> | undefined;

function loadApi() {
  if (!apiPromise) apiPromise = new Promise<SpotifyApi>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => reject(new Error("Spotify unavailable")), 12000);
    window.onSpotifyIframeApiReady = (api) => { clearTimeout(timeout); resolve(api); };
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => { clearTimeout(timeout); reject(new Error("Spotify unavailable")); };
    document.head.appendChild(script);
  }).catch(error => { apiPromise = undefined; throw error; });
  return apiPromise;
}

export function SpotifyEmbed({ id }: { id: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let controller: Controller | undefined;
    setFailed(false);
    setReady(false);
    const timeout = window.setTimeout(() => { if (!cancelled) setFailed(true); }, 20000);
    loadApi().then(api => {
      if (cancelled || !container.current) return;
      const mount = document.createElement("div");
      container.current.replaceChildren(mount);
      api.createController(mount, {uri: `spotify:playlist:${id}`, width:"100%", height:380}, result => {
        if (cancelled) { result.destroy(); return; }
        controller = result;
        result.addListener("ready", () => {
          if (!cancelled) { clearTimeout(timeout); setReady(true); setFailed(false); }
        });
      });
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; clearTimeout(timeout); controller?.destroy(); };
  }, [id]);
  return <div>
    {!ready && !failed && <p role="status">טוען את הנגן…</p>}
    {failed && <p role="status">לא הצלחנו לטעון את הנגן.</p>}
    <div ref={container} className={failed ? "hidden" : "min-h-[380px]"} />
    <a className="inline-block underline mt-4" href={`https://open.spotify.com/playlist/${id}`} target="_blank" rel="noopener noreferrer">פתחו את הפלייליסט בספוטיפיי</a>
  </div>;
}