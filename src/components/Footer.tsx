import React from 'react';
import { ShieldCheck, BookOpen, Crown, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#171013] text-[#EDE4D5] border-t border-[#342227] mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Archival purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#E5C170]">
              <Crown className="w-5 h-5" />
              <span className="font-serif font-bold tracking-wide text-lg text-[#FAF6EE]">
                Corpus Nobilium Europae
              </span>
            </div>
            <p className="text-xs text-[#B5A593] leading-relaxed font-sans">
              Wissenschaftlich-dokumentarisches Gesamtverzeichnis europäischer Dynastien, Fürsten-, Grafen- 
              und Patrizierhäuser. Konzipiert zur transparenten Verknüpfung von Familiengeschichte, 
              denkmalgeschützten Residenzen, Primärarchiven und öffentlichen Kulturstiftungen.
            </p>
          </div>

          {/* Column 2: Data Protection & Integrity Guidelines */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#E5C170]">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-serif font-bold tracking-wide text-sm text-[#FAF6EE]">
                Datenschutz & Quellenintegrität
              </span>
            </div>
            <p className="text-xs text-[#B5A593] leading-relaxed font-sans">
              Private E-Mail-Adressen von Familienmitgliedern werden aus Datenschutzgründen und Mangel 
              an seriöser öffentlicher Publizität <em>nicht</em> recherchiert oder aufgenommen. 
              Enthalten sind ausschließlich offiziell von den jeweiligen Stiftungen, Museen, Archiven 
              und Verwaltungen öffentlich publizierte Kontaktstellen.
            </p>
          </div>

          {/* Column 3: Historiographical Standards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#E5C170]">
              <BookOpen className="w-5 h-5" />
              <span className="font-serif font-bold tracking-wide text-sm text-[#FAF6EE]">
                Katalogisierungsstandard
              </span>
            </div>
            <p className="text-xs text-[#B5A593] leading-relaxed font-sans">
              Geprüft nach den Beständen des Genealogischen Handbuchs des Adels (GHdA), 
              Gothaischen Genealogischen Taschenbuchs ("Der Gotha"), staatlichen Staatsarchiven 
              (ÖStA, Geheimes Staatsarchiv PK, Archives Nationales, Archivio di Stato) 
              sowie Schloss- und Schlosskulturstiftungen.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#2D1B20] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7969]">
          <div>
            © {new Date().getFullYear()} Europäisches Adelshäuser-Verzeichnis • 335 verifizierte Einträge • Acta Concordiae Europae
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#24171A] hover:bg-[#342025] text-[#D8CCA9] border border-[#422931] transition-colors"
          >
            <span>Nach oben</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
