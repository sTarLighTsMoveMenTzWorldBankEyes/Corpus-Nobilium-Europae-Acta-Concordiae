import React from 'react';
import { Crown, Landmark, Shield, BookOpen, Download, Database, HeartHandshake, FileText, Mail, Sparkles, Sliders } from 'lucide-react';
import { DirectoryStats } from '../data';
import { useGlowSettings } from './GlowSettingsContext';

interface HeaderProps {
  stats: DirectoryStats;
  activeMainTab: 'directory' | 'masterplan' | 'heraldry' | 'eid_compliance';
  onSelectMainTab: (tab: 'directory' | 'masterplan' | 'heraldry' | 'eid_compliance') => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onOpenEmailDispatcher?: () => void;
  onOpenSpiritualModal?: () => void;
  isDiplomacyMode?: boolean;
  onToggleDiplomacyMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  stats, 
  activeMainTab,
  onSelectMainTab,
  onExportCsv, 
  onExportJson,
  onOpenEmailDispatcher,
  onOpenSpiritualModal,
  isDiplomacyMode,
  onToggleDiplomacyMode
}) => {
  const { settings: glowSettings, setIsPanelOpen: setIsGlowPanelOpen, getPrimaryGlowColor } = useGlowSettings();

  return (
    <header className="relative bg-[#1A1215] text-[#EDE6D8] border-b border-[#3D282D] overflow-hidden">
      {/* Decorative subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Gold hairline accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />

      {/* Navigation Top-Bar */}
      <div className="border-b border-[#2E1A20] bg-[#140D10]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2.5">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-tab-directory"
              onClick={() => onSelectMainTab('directory')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                activeMainTab === 'directory'
                  ? 'bg-[#C5A059] text-[#1A1215] shadow-sm font-semibold'
                  : 'text-[#C2B7A8] hover:text-[#FAF6EE] hover:bg-[#28161D]'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Häuser-Archiv ({stats.total})</span>
            </button>

            <button
              id="nav-tab-heraldry"
              onClick={() => onSelectMainTab('heraldry')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                activeMainTab === 'heraldry'
                  ? 'bg-[#C5A059] text-[#1A1215] shadow-sm font-semibold'
                  : 'text-[#E5C170] hover:text-[#FAF6EE] hover:bg-[#28161D] border border-[#C5A059]/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#E5C170]" />
              <span>Heraldry Gallery</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] rounded bg-[#3D232A] text-[#FAF6EE]">
                Wappen-Mosaik
              </span>
            </button>

            <button
              id="nav-tab-masterplan"
              onClick={() => onSelectMainTab('masterplan')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                activeMainTab === 'masterplan'
                  ? 'bg-[#C5A059] text-[#1A1215] shadow-sm font-semibold'
                  : 'text-[#E5C170] hover:text-[#FAF6EE] hover:bg-[#28161D] border border-[#C5A059]/40'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Acta Concordiae • Master-Plan</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] rounded bg-[#3D232A] text-[#FAF6EE]">
                Allianzen-Graph
              </span>
            </button>

            <button
              id="nav-tab-eid-compliance"
              onClick={() => onSelectMainTab('eid_compliance')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                activeMainTab === 'eid_compliance'
                  ? 'bg-[#C5A059] text-[#1A1215] shadow-sm font-semibold'
                  : 'text-[#E5C170] hover:text-[#FAF6EE] hover:bg-[#28161D] border border-[#C5A059]/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#E5C170]" />
              <span>eID-Compliance-Dashboard</span>
              <span className="hidden xl:inline-block px-1.5 py-0.2 text-[10px] rounded bg-[#3D232A] text-[#FAF6EE]">
                Treemap
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="header-glow-settings-btn"
              onClick={() => setIsGlowPanelOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2B1720] hover:bg-[#3D202B] text-[#E5C170] text-xs font-semibold border border-[#C5A059]/40 shadow-xs transition-all cursor-pointer relative group"
              title="Karten Glow- & Farb-Pulse Einstellungen anpassen"
            >
              <Sliders className="w-3.5 h-3.5 text-[#E5C170] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Glow-Puls</span>
              <span 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: glowSettings.enabled ? getPrimaryGlowColor() : '#523E48',
                  boxShadow: glowSettings.enabled ? `0 0 6px ${getPrimaryGlowColor()}` : 'none'
                }}
              />
            </button>

            {onToggleDiplomacyMode && (
              <button
                id="header-diplomacy-mode-toggle"
                onClick={onToggleDiplomacyMode}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  isDiplomacyMode
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-400 glow-emerald'
                    : 'bg-[#2B1720] hover:bg-[#3D202B] text-[#E5C170] border border-[#C5A059]/40'
                }`}
                title={isDiplomacyMode ? 'Diplomatie-Modus deaktivieren' : 'Diplomatie-Modus aktivieren (hebt aktive Häuser und Allianzen hervor)'}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>🕊️ Diplomatie-Modus</span>
                <span className={`px-1 py-0.2 rounded text-[10px] font-mono ${isDiplomacyMode ? 'bg-emerald-900 text-white' : 'bg-[#3D222B] text-[#E5C170]'}`}>
                  {isDiplomacyMode ? 'ON' : 'OFF'}
                </span>
              </button>
            )}

            {onOpenSpiritualModal && (
              <button
                id="header-spiritual-modal-btn"
                onClick={onOpenSpiritualModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2D161F] hover:bg-[#3D1E2B] text-[#E5C170] text-xs font-medium border border-[#C5A059]/50 shadow-xs transition-colors cursor-pointer glow-gold"
                title="Spirituelle Friedenshäuser & BESA eID Pakt öffnen"
              >
                <span>🕊️ Spirituelle Häuser & eID</span>
              </button>
            )}

            {onOpenEmailDispatcher && (
              <button
                id="header-topbar-email-btn"
                onClick={onOpenEmailDispatcher}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#8B1E2F] hover:bg-[#A32438] text-[#FAF6EE] text-xs font-medium border border-[#C5A059]/40 shadow-xs transition-colors cursor-pointer"
                title="Diplomatischen E-Mail-Dispatcher & Zeitverzögerten Versand öffnen"
              >
                <Mail className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span className="hidden sm:inline">E-Mail-Dispatcher</span>
                <span className="bg-[#2B151A] px-1.5 py-0.2 text-[10px] rounded text-[#E5C170] font-semibold">
                  360
                </span>
              </button>
            )}
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2D161B] border border-[#C5A059]/40 flex items-center justify-center text-[#E5C170] shadow-md">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#C5A059]">
                Corpus Nobilium Europae & Acta Concordiae
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-tight text-[#FAF6EE] font-semibold">
              {activeMainTab === 'masterplan' 
                ? 'Acta Concordiae Europae • Der Friedens-Masterplan' 
                : 'Verzeichnis europäischer Adelshäuser'}
            </h1>

            <p className="text-sm sm:text-base text-[#C2B7A8] max-w-3xl leading-relaxed font-sans">
              {activeMainTab === 'masterplan' ? (
                <span>
                  Historisches Manifest, philosophische 4-Säulen-Architektur und operativer Fahrplan 
                  zur dauerhaften <strong className="text-[#E5C170]">Völkervereinigung in Frieden</strong>, 
                  gegenseitigem Schutz und transnationaler Nächstenliebe durch die Träger europäischen Kulturerbes.
                </span>
              ) : (
                <span>
                  Dokumentation von <strong className="text-[#E5C170] font-semibold">{stats.total} verifizierten europäischen Adelshäusern</strong>, 
                  Königsdynastien und historischen Patriziergeschlechtern. Mit primären Registerquellen, 
                  Kulturstiftungen, Schlossarchiven und öffentlichen Kontaktstellen.
                </span>
              )}
            </p>
          </div>

          {/* Quick Action Export & Contact CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 md:pt-0">
            {activeMainTab === 'directory' ? (
              <>
                {onOpenEmailDispatcher && (
                  <button
                    id="header-cta-email-dispatcher-btn"
                    onClick={onOpenEmailDispatcher}
                    className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md bg-gradient-to-r from-[#8B1E2F] to-[#6A1422] hover:from-[#A32438] hover:to-[#7E1E2D] text-white border border-[#C5A059]/60 text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/60 cursor-pointer group"
                    title="Zeitverzögertes Kontaktieren & Bündelung für alle 360 verifizierten Adelshäuser öffnen"
                  >
                    <Mail className="w-4 h-4 text-[#FDE68A] group-hover:scale-110 transition-transform" />
                    <span>E-Mail-Dispatcher (360)</span>
                  </button>
                )}

                <button
                  id="export-csv-btn"
                  onClick={onExportCsv}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-md bg-[#2B191E] hover:bg-[#3D232A] text-[#E5C170] border border-[#C5A059]/30 text-xs sm:text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50"
                  title="Vollständigen Datensatz als CSV mit UTF-8 BOM für Excel exportieren"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>

                <button
                  id="export-json-btn"
                  onClick={onExportJson}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-md bg-[#22171B] hover:bg-[#322026] text-[#D4C8B8] border border-[#4A333A] text-xs sm:text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50"
                  title="Vollständigen Datensatz im JSON-Format exportieren"
                >
                  <Database className="w-4 h-4" />
                  <span>JSON</span>
                </button>

                <button
                  onClick={() => onSelectMainTab('masterplan')}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-md bg-[#2D1B22] hover:bg-[#3E252E] text-white border border-[#C5A059]/40 text-xs sm:text-sm font-medium transition-colors shadow-sm"
                >
                  <HeartHandshake className="w-4 h-4 text-[#E5C170]" />
                  <span>Master-Plan</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectMainTab('directory')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2B191E] hover:bg-[#3D232A] text-[#FAF6EE] border border-[#C5A059]/30 text-xs sm:text-sm font-medium transition-colors shadow-sm"
                >
                  <Landmark className="w-4 h-4 text-[#E5C170]" />
                  <span>Zum Gesamtarchiv (335 Häuser)</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-7 pt-6 border-t border-[#382227]">
          <div className="bg-[#24171A]/80 border border-[#452830] rounded-lg p-3.5 flex items-center gap-3.5">
            <div className="p-2 rounded bg-[#381F26] text-[#E5C170]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6EE]">{stats.total}</div>
              <div className="text-xs text-[#A89C8C] font-sans">Verifizierte Häuser</div>
            </div>
          </div>

          <div className="bg-[#24171A]/80 border border-[#452830] rounded-lg p-3.5 flex items-center gap-3.5">
            <div className="p-2 rounded bg-[#381F26] text-[#E5C170]">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6EE]">{stats.countriesCount}</div>
              <div className="text-xs text-[#A89C8C] font-sans">Europäische Länder</div>
            </div>
          </div>

          <div className="bg-[#24171A]/80 border border-[#452830] rounded-lg p-3.5 flex items-center gap-3.5">
            <div className="p-2 rounded bg-[#381F26] text-[#E5C170]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6EE]">4 Säulen</div>
              <div className="text-xs text-[#A89C8C] font-sans">Friedens-Architektur</div>
            </div>
          </div>

          <div className="bg-[#24171A]/80 border border-[#452830] rounded-lg p-3.5 flex items-center gap-3.5">
            <div className="p-2 rounded bg-[#381F26] text-[#E5C170]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6EE]">100%</div>
              <div className="text-xs text-[#A89C8C] font-sans">Reale Quellen & Stiftungen</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
