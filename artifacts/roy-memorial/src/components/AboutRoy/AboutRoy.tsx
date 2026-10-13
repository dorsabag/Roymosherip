import { royContent } from "@/content/roy";
import { Card, CardContent } from "@/components/ui/card";
import { SectionCutout } from "@/components/SectionCutout/SectionCutout";

const emphasizedPhrases = [
  "משפחה",
  "בית ושפע",
  "שמחה",
  "מסירות הלב והנפש",
  "חברים",
  "חוויות",
  "צחוקים",
  "השתטויות",
  "סקרנות",
  "עזרה",
  "הראשון להתייצב",
  "ולגונן",
  "להימנע מלהטריד",
  "הכי אהוב בחדר",
  "חכם באופן יוצא דופן",
  "לפתור",
  "צניעות וענווה",
  "הסתפקות במועט",
  "לאחרים",
  "בבן אדם אחד",
];

const emphasizedPhrasesPattern = new RegExp(
  `(${emphasizedPhrases
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g",
);

function renderEmphasizedText(text: string) {
  const emphasizedSet = new Set(emphasizedPhrases);

  return text.split(emphasizedPhrasesPattern).map((part, index) =>
    emphasizedSet.has(part) ? (
      <strong key={index} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function AboutRoy() {
  const { intro } = royContent;
  
  return (
    <section id="about" className="roy-cutout-section py-24 px-4 bg-secondary/30">
      <SectionCutout name="about" />
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <bdi>{intro.title}</bdi>
          </h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>
        
        <div className="prose prose-lg max-w-none w-full mx-auto text-center text-foreground/90 font-medium leading-relaxed whitespace-pre-line">
          <bdi className="font-medium">{renderEmphasizedText(intro.text)}</bdi>
          <span className="block mt-2 text-xl font-bold">
            <bdi>{intro.closingLine}</bdi>
          </span>
        </div>
        
        {intro.stats.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {intro.stats.map((stat, i) => (
            <Card key={i} className="bg-background/50 border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-2 flex flex-col justify-center h-full">
                <div className="text-sm text-muted-foreground font-medium">
                  <bdi>{stat.label}</bdi>
                </div>
                <div className="text-lg font-bold text-foreground">
                  <bdi>{stat.value}</bdi>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
      </div>
    </section>
  );
}