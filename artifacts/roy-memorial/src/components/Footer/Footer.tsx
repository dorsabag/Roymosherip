import { royContent } from "@/content/roy";

export function Footer() {
  return (
    <footer className="bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-muted-foreground font-medium text-lg">
          {royContent.footer.madeWithLove}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a href="#memories" className="hover:text-primary transition-colors">שתפו זיכרון</a>
          <a href="#gallery" className="hover:text-primary transition-colors">גלריה</a>
          <a href="#music" className="hover:text-primary transition-colors">הפסקול של רועי</a>
        </div>
      </div>
    </footer>
  );
}