import { Navigation } from "@/components/Navigation/Navigation";
import { Hero } from "@/components/Hero/Hero";
import { AboutRoy } from "@/components/AboutRoy/AboutRoy";
import { Timeline } from "@/components/Timeline/Timeline";
import { FunFacts } from "@/components/FunFacts/FunFacts";
import { RoyDictionary } from "@/components/RoyDictionary/RoyDictionary";
import { Memories } from "@/components/Memories/Memories";
import { Gallery } from "@/components/Gallery/Gallery";
import { PlacesMap } from "@/components/PlacesMap/PlacesMap";
import { SpotifyPlaylistPlayer } from "@/components/SpotifyPlaylistPlayer/SpotifyPlaylistPlayer";
import { October7 } from "@/components/October7/October7";
import { Tributes } from "@/components/Tributes/Tributes";
import { Legacy } from "@/components/Legacy/Legacy";
import { Footer } from "@/components/Footer/Footer";
import { SectionDivider } from "@/components/SectionDivider/SectionDivider";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background w-full selection:bg-primary/20 selection:text-primary">
      <Navigation />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full">
          <Hero />
          <SectionDivider />
          <AboutRoy />
          <SectionDivider />
          <Timeline />
          <SectionDivider />
          <FunFacts />
          <SectionDivider />
          <RoyDictionary />
          <SectionDivider />
          <Memories />
          <SectionDivider />
          <Gallery />
          <SectionDivider />
          <PlacesMap />
          <SectionDivider />
          <SpotifyPlaylistPlayer />
          <SectionDivider />
          <October7 />
          <SectionDivider />
          <Tributes />
          <SectionDivider />
          <Legacy />
        </div>
      </main>
      <div className="w-full">
        <SectionDivider />
        <Footer />
      </div>
    </div>
  );
}