import { royContent } from "@/content/roy";
import { Card, CardContent } from "@/components/ui/card";

export function Legacy() {
  const { legacy, identity } = royContent;
  
  return (
    <section className="py-24 px-4 bg-secondary/10">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">הסיפור שלו לא נגמר שם</h2>
          <div className="w-16 h-1 bg-primary/40 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {legacy.map(item => (
            <Card key={item.id} className="bg-background shadow-sm border overflow-hidden group">
              {item.image && (
                <div className="h-48 bg-muted overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <CardContent className={`p-8 space-y-4 ${!item.image ? 'pt-8' : ''}`}>
                <h3 className="text-2xl font-bold text-foreground">
                  <bdi>{item.title}</bdi>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  <bdi>{item.description}</bdi>
                </p>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noreferrer" className="inline-block mt-4 text-primary font-medium hover:underline">
                    לפרטים נוספים &larr;
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-16 pb-8 text-center space-y-8">
          <p className="text-2xl font-medium text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            <bdi>{royContent.footer.closingSentence}</bdi>
          </p>
          
          <div className="pt-8 border-t border-border/50 inline-block w-48"></div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              <bdi>{identity.fullName} הי״ד</bdi>
            </h2>
            <p className="text-lg text-muted-foreground flex justify-center items-center gap-2 flex-row-reverse">
              <bdi>{identity.birthDate}</bdi> 
              <span>&ndash;</span>
              <bdi>{identity.deathDate}</bdi>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}