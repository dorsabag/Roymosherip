import { royContent } from "@/content/roy";

export function Hero() {
  const { identity } = royContent;
  
  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center relative px-4 pt-16">
      <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        {identity.heroImage ? (
          <img src={identity.heroImage} alt={`דיוקן מאויר של ${identity.fullName}`} width={640} height={640} fetchPriority="high" loading="eager" className="w-48 h-48 md:w-64 md:h-64 rounded-full object-contain mx-auto shadow-xl border-4 border-background" />
        ) : (
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-muted/50 mx-auto border-4 border-background shadow-xl flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
            <bdi>{`[PLACEHOLDER: תמונת פרופיל או תמונה משמעותית של רועי]`}</bdi>
          </div>
        )}
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            <bdi>{identity.fullName}</bdi>
          </h1>
          <p className="text-xl text-muted-foreground flex items-center justify-center gap-2 flex-row-reverse">
            <bdi>{identity.birthDate}</bdi> 
            <span>&ndash;</span>
            <bdi>{identity.deathDate}</bdi>
          </p>
        </div>
        
        <p className="text-lg md:text-xl max-w-xl mx-auto text-foreground/80 font-medium">
          <bdi className="font-bold text-[30px]">{identity.heroIntro}</bdi>
        </p>
        
        <div className="pt-8">
          <a href="#about" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            הכירו את רועי
          </a>
        </div>
      </div>
    </section>
  );
}