import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinks = [
    { href: "#about", label: "על רועי" },
    { href: "#timeline", label: "ציר הזמן" },
    { href: "#memories", label: "זיכרונות" },
    { href: "#gallery", label: "גלריה" },
    { href: "#places", label: "מקומות" },
    { href: "#music", label: "מוזיקה" },
    { href: "#october7", label: "7 באוקטובר" },
    { href: "#tributes", label: "הנצחה" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-semibold text-lg tracking-tight">
          <bdi>רועי משה הי״ד</bdi>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2 lg:gap-6 text-xs lg:text-sm font-medium">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 -mr-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          onClick={toggleMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="פתיחה וסגירה של תפריט הניווט"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg transition-all duration-300 ease-in-out origin-top ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col py-4 px-4 space-y-4 text-base font-medium">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-secondary/40 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
