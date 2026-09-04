import React, { useState } from 'react';
import { 
  Crown, 
  Shield, 
  Sparkles, 
  HeartHandshake, 
  Globe, 
  BookOpen, 
  Check, 
  Copy, 
  Download, 
  Calendar, 
  Users, 
  ArrowRight,
  ExternalLink,
  Landmark,
  Compass,
  FileText,
  Network,
  Share2,
  Award,
  BarChart3
} from 'lucide-react';
import { 
  CONCORDIA_MOTTO, 
  CONCORDIA_PREAMBLE, 
  CONCORDIA_PILLARS, 
  MASTERPLAN_PHASES, 
  PEACE_HOUSE_BRIDGES,
  ConcordiaPillar 
} from '../data/concordia-data';
import { House } from '../types';
import { DiplomaticAllianceGraph } from './DiplomaticAllianceGraph';
import { GlobalPeaceIndexView } from './GlobalPeaceIndexView';
import { ActiveHousesGPIOverlayModal } from './ActiveHousesGPIOverlayModal';
import { DiplomaticPathsMap } from './DiplomaticPathsMap';
import { GpiEidCorrelationLegend } from './GpiEidCorrelationLegend';

interface MasterPlanViewProps {
  houses?: House[];
  onBackToDirectory: () => void;
  onInspectHouse?: (house: House) => void;
  onInspectHouseByName?: (houseName: string) => void;
  onOpenSpiritualModal?: () => void;
  isDiplomacyMode?: boolean;
}

export const MasterPlanView: React.FC<MasterPlanViewProps> = ({ 
  houses = [],
  onBackToDirectory,
  onInspectHouse,
  onInspectHouseByName,
  onOpenSpiritualModal,
  isDiplomacyMode
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'paths' | 'pillars' | 'phases' | 'bridges' | 'preamble' | 'letter' | 'gpi'>('paths');
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pillar-1');
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [bridgeRegionFilter, setBridgeRegionFilter] = useState<string>('ALL');
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  const selectedPillar = CONCORDIA_PILLARS.find(p => p.id === selectedPillarId) || CONCORDIA_PILLARS[0];

  const fullManifestoText = `ACTA CONCORDIAE EUROPAE
Ein Manifest des historischen Neuanfangs, des gegenseitigen Schutzes und der ewigen Verbundenheit
Motto: "${CONCORDIA_MOTTO.latin}" (${CONCORDIA_MOTTO.translation})

${CONCORDIA_PREAMBLE}

==================================================
DIE VIER SÄULEN DER CONCORDIA-ARCHITEKTUR
==================================================

I. SÄULE: DER MUT ZUM LOSLASSEN (Animus Dimittendi)
${CONCORDIA_PILLARS[0].philosophicalConcept}
Spirituelles Prinzip: ${CONCORDIA_PILLARS[0].spiritualMetaphor}
Diplomatisches Ziel: ${CONCORDIA_PILLARS[0].diplomaticGoal}
Maßnahmen:
${CONCORDIA_PILLARS[0].practicalMeasures.map(m => ` - ${m}`).join('\n')}

II. SÄULE: DIE LÄUTERUNG DER GESCHICHTE (Lustratio Memoriae)
${CONCORDIA_PILLARS[1].philosophicalConcept}
Spirituelles Prinzip: ${CONCORDIA_PILLARS[1].spiritualMetaphor}
Diplomatisches Ziel: ${CONCORDIA_PILLARS[1].diplomaticGoal}
Maßnahmen:
${CONCORDIA_PILLARS[1].practicalMeasures.map(m => ` - ${m}`).join('\n')}

III. SÄULE: DAS UNERSCHÜTTERLICHE FUNDAMENT (Matrix Caritatis)
${CONCORDIA_PILLARS[2].philosophicalConcept}
Spirituelles Prinzip: ${CONCORDIA_PILLARS[2].spiritualMetaphor}
Diplomatisches Ziel: ${CONCORDIA_PILLARS[2].diplomaticGoal}
Maßnahmen:
${CONCORDIA_PILLARS[2].practicalMeasures.map(m => ` - ${m}`).join('\n')}

IV. SÄULE: DIE EWIGE VÖLKERFAMILIE (Familia Gentium Sempiterna)
${CONCORDIA_PILLARS[3].philosophicalConcept}
Spirituelles Prinzip: ${CONCORDIA_PILLARS[3].spiritualMetaphor}
Diplomatisches Ziel: ${CONCORDIA_PILLARS[3].diplomaticGoal}
Maßnahmen:
${CONCORDIA_PILLARS[3].practicalMeasures.map(m => ` - ${m}`).join('\n')}

==================================================
OPERATIVER 4-PHASEN-MASTERPLAN
==================================================
${MASTERPLAN_PHASES.map(ph => `
Phase ${ph.phaseNumber}: ${ph.codeName} (${ph.timeHorizon})
Titel: ${ph.title}
Inhalt: ${ph.summary}
Wirkungsziel: ${ph.impactMetric}
Kern-Aktionen:
${ph.deliverables.map(d => ` • ${d}`).join('\n')}
`).join('\n')}

Ausgestellt im Geiste der Nächstenliebe, des Friedens und der unumstößlichen Eintracht.
Europäisches Gesamtarchiv & Friedensbund`;

  const handleCopyManifesto = () => {
    navigator.clipboard.writeText(fullManifestoText);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 3000);
  };

  const handleDownloadManifesto = () => {
    const element = document.createElement('a');
    const file = new Blob([fullManifestoText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Acta_Concordiae_Europae_Masterplan_Frieden.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredBridges = bridgeRegionFilter === 'ALL'
    ? PEACE_HOUSE_BRIDGES
    : PEACE_HOUSE_BRIDGES.filter(b => b.region === bridgeRegionFilter);

  const renderIcon = (name: ConcordiaPillar['iconName']) => {
    switch (name) {
      case 'Shield': return <Shield className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      default: return <Crown className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Solemn Masterplan Banner */}
      <section className="relative bg-[#1A1115] text-[#FAF6EE] rounded-2xl border border-[#C5A059]/40 shadow-xl overflow-hidden p-6 sm:p-10">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#E5C170 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#E5C170] font-sans font-semibold uppercase tracking-[0.2em]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#331821] border border-[#C5A059]/30">
                <Crown className="w-3.5 h-3.5" />
                <span>Acta Concordiae Europae</span>
              </span>
              <span>•</span>
              <span>Dokumentarischer Friedensplan</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#FAF6EE] leading-tight">
              Master-Plan zur Völkervereinigung in Frieden
            </h1>

            <p className="text-[#D8CCA9] font-serif italic text-base sm:text-lg border-l-2 border-[#C5A059] pl-3 my-2">
              "{CONCORDIA_MOTTO.latin}"
              <span className="block text-xs font-sans not-italic text-[#B5A593] mt-0.5">
                – {CONCORDIA_MOTTO.translation} ({CONCORDIA_MOTTO.source})
              </span>
            </p>

            <p className="text-xs sm:text-sm text-[#B8AA98] font-sans leading-relaxed">
              Die Bündelung der 335 europäischen Adelshäuser, Residenzen und Stiftungsarchive zu einem 
              dauerhaften, elastischen Netzwerk des gegenseitigen Schutzes, der Nächstenliebe und der 
              transnationalen Völkerverständigung.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
            <button
              onClick={() => setActiveTab('graph')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5C170] hover:bg-[#F2D48C] text-[#1A1115] font-sans font-bold text-xs sm:text-sm transition-all shadow-md focus:ring-2 focus:ring-[#C5A059] glow-gold cursor-pointer"
            >
              <Network className="w-4 h-4 text-[#8B1E2F]" />
              <span>D3 Allianzen-Netzwerk</span>
            </button>

            {onOpenSpiritualModal && (
              <button
                onClick={onOpenSpiritualModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#381622] hover:bg-[#4D1F30] text-[#FAF6EE] border border-[#E5C170]/60 font-sans font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>🕊️ Spirituelle Häuser & BESA eID</span>
              </button>
            )}

            <button
              onClick={handleCopyManifesto}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#24151B] hover:bg-[#331B24] text-[#FAF6EE] border border-[#C5A059]/30 font-sans font-medium text-xs transition-all cursor-pointer"
            >
              {copiedState ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{copiedState ? 'Volltext kopiert!' : 'Manifest kopieren'}</span>
            </button>

            <button
              onClick={onBackToDirectory}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1D1015] hover:bg-[#2A171F] text-[#C2B7A8] border border-[#442831] font-sans text-xs transition-colors cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Zurück zum Archiv ({houses.length || 360} Häuser)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <nav className="flex items-center gap-2 border-b border-[#E3D9C9] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('paths')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'paths'
              ? 'bg-[#8B1E2F] text-white shadow-md ring-2 ring-[#C5A059]/40 glow-gold'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <Share2 className="w-4 h-4 text-[#E5C170]" />
          <span>🗺️ Diplomatie-Pfade (Europakarte)</span>
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'graph'
              ? 'bg-[#8B1E2F] text-white shadow-md ring-2 ring-[#C5A059]/40 glow-emerald'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <Network className="w-4 h-4 text-[#E5C170]" />
          <span>🌌 Allianzen-Graph (D3.js)</span>
        </button>

        <button
          onClick={() => setActiveTab('gpi')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'gpi'
              ? 'bg-[#8B1E2F] text-white shadow-md ring-2 ring-[#C5A059]/40 glow-emerald'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#E5C170]" />
          <span>🌍 Global Peace Index & BESA eID Korrelation</span>
        </button>

        <button
          onClick={() => setActiveTab('pillars')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'pillars'
              ? 'bg-[#8B1E2F] text-white shadow-sm'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Die 4 Säulen des Friedens</span>
        </button>

        <button
          onClick={() => setActiveTab('phases')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'phases'
              ? 'bg-[#8B1E2F] text-white shadow-sm'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Operativer 4-Phasen-Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('bridges')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'bridges'
              ? 'bg-[#8B1E2F] text-white shadow-sm'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Bündnis & Friedensbrücken</span>
        </button>

        <button
          onClick={() => setActiveTab('preamble')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'preamble'
              ? 'bg-[#8B1E2F] text-white shadow-sm'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Präambel & Proklamation</span>
        </button>

        <button
          onClick={() => setActiveTab('letter')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'letter'
              ? 'bg-[#8B1E2F] text-white shadow-sm'
              : 'text-[#6C5D50] hover:bg-[#EFE8DD] hover:text-[#1A1215]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Offizielles Anschreiben</span>
        </button>

        <button
          onClick={() => setIsOverlayOpen(true)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-sans font-bold bg-[#26181E] text-[#E5C170] border border-[#C5A059]/50 hover:bg-[#3D232E] transition-all cursor-pointer shadow-sm glow-gold`}
          title="Statistischer Bericht & Historische Allianzen-Progression öffnen"
        >
          <BarChart3 className="w-4 h-4 text-[#E5C170]" />
          <span>📊 Statistik-Overlay</span>
        </button>
      </nav>

      {/* TAB CONTENT: 0A. INTERAKTIVE DIPLOMATIE-PFADE AUF DER EUROPAKARTE */}
      {activeTab === 'paths' && (
        <div className="space-y-6">
          <DiplomaticPathsMap
            houses={houses}
            onInspectHouseByName={onInspectHouseByName}
          />
        </div>
      )}

      {/* TAB CONTENT: 0B. D3.JS DIPLOMATISCHER ALLIANZEN-GRAPH */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          <DiplomaticAllianceGraph
            houses={houses}
            onInspectHouse={onInspectHouse}
            onInspectHouseByName={onInspectHouseByName}
            isDiplomacyMode={isDiplomacyMode}
          />
        </div>
      )}

      {/* TAB CONTENT: 0C. GLOBAL PEACE INDEX & BESA EID KORRELATION */}
      {activeTab === 'gpi' && (
        <div className="space-y-8">
          <GpiEidCorrelationLegend
            houses={houses}
            onInspectHouseByName={onInspectHouseByName}
          />
          <GlobalPeaceIndexView
            houses={houses}
            onInspectHouseByName={onInspectHouseByName}
            onBackToDirectory={onBackToDirectory}
          />
        </div>
      )}


      {/* TAB CONTENT: 1. DIE 4 SÄULEN */}
      {activeTab === 'pillars' && (
        <div className="space-y-8">
          {/* Pillar Selector Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONCORDIA_PILLARS.map((pillar) => {
              const isSelected = pillar.id === selectedPillarId;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/30'
                      : 'bg-[#F4EEE4] border-[#E3D9C9] hover:bg-white hover:border-[#C5A059]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-serif font-bold text-[#8B1E2F]">
                      SÄULE {pillar.number}
                    </span>
                    <div className={`p-1.5 rounded-md ${isSelected ? 'bg-[#8B1E2F] text-white' : 'bg-[#E5D7C3] text-[#735A43]'}`}>
                      {renderIcon(pillar.iconName)}
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#1A1215] mb-1 line-clamp-1">
                    {pillar.title}
                  </h3>
                  <div className="text-[11px] font-serif italic text-[#8B1E2F] mb-1.5">
                    {pillar.latinTitle}
                  </div>
                  <p className="text-xs text-[#6B5A4B] font-sans line-clamp-2 leading-relaxed">
                    {pillar.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Pillar Detailed Showcase */}
          <div className="bg-white border border-[#E3D9C9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EFE8DD]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#F8F4ED] border border-[#E3D9C9] text-xs font-serif text-[#8B1E2F] font-bold">
                  <span>Säule {selectedPillar.number}</span>
                  <span>•</span>
                  <span className="italic">{selectedPillar.latinTitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1215]">
                  {selectedPillar.title}
                </h2>
                <p className="text-sm font-sans text-[#786A5D]">
                  {selectedPillar.subtitle}
                </p>
              </div>

              <div className="w-14 h-14 rounded-xl bg-[#8B1E2F] text-[#FAF6EE] flex items-center justify-center shrink-0 shadow-md">
                {renderIcon(selectedPillar.iconName)}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Concept & Metaphor */}
              <div className="space-y-5">
                <div className="bg-[#FAF6EE] border-l-4 border-[#C5A059] p-4 rounded-r-lg space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-sans font-bold text-[#8B1E2F]">
                    Philosophisches Fundament
                  </h4>
                  <p className="text-sm text-[#443831] leading-relaxed font-serif">
                    {selectedPillar.philosophicalConcept}
                  </p>
                </div>

                <div className="bg-[#FAF6EE] border-l-4 border-[#8B1E2F] p-4 rounded-r-lg space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-sans font-bold text-[#8B1E2F]">
                    Die heilsame Metapher
                  </h4>
                  <p className="text-sm text-[#443831] leading-relaxed font-sans italic">
                    "{selectedPillar.spiritualMetaphor}"
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#F5EFE6] border border-[#E3D9C9] space-y-1.5">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#7A6451]">
                    Diplomatisches Gesamtziel
                  </h4>
                  <p className="text-xs sm:text-sm text-[#24181B] font-sans leading-relaxed">
                    {selectedPillar.diplomaticGoal}
                  </p>
                </div>
              </div>

              {/* Measures & Precedents */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#8B1E2F] flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Konkrete Bündnismassnahmen</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedPillar.practicalMeasures.map((measure, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#382E28] font-sans bg-[#FAF6EE] p-3 rounded-lg border border-[#EFE8DD]">
                        <span className="w-5 h-5 rounded-full bg-[#E5C170] text-[#1A1215] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#EFE8DD]">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#7A6451]">
                    Historische Vorbilder & Parallelen
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedPillar.historicalPrecedents.map((prec, i) => (
                      <div key={i} className="text-xs text-[#5C4D42] font-serif bg-white p-2.5 rounded border border-[#E3D9C9]">
                        • {prec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. OPERATIVER 4-PHASEN-PLAN */}
      {activeTab === 'phases' && (
        <div className="space-y-8">
          <div className="bg-[#FAF6EE] border border-[#E3D9C9] p-6 rounded-xl space-y-2">
            <h3 className="font-serif font-bold text-lg text-[#1A1215]">
              Operativer Fahrplan zur Verwirklichung des Friedensbundes
            </h3>
            <p className="text-xs sm:text-sm text-[#786A5D] font-sans leading-relaxed">
              Der Master-Plan ist auf eine stufenweise Aktivierung angelegt: von der archivischen 
              Initialproklamation über den multilateralen Konvent bis hin zur dauerhaften Verankerung in 
              den Statuten der europäischen Kultur- und Familienstiftungen.
            </p>
          </div>

          <div className="space-y-6">
            {MASTERPLAN_PHASES.map((phase) => (
              <div 
                key={phase.phaseNumber}
                className="bg-white border border-[#E3D9C9] rounded-xl p-6 shadow-sm hover:border-[#C5A059] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE8DD]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#8B1E2F] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                      {phase.phaseNumber}
                    </span>
                    <div>
                      <div className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#8B1E2F]">
                        {phase.codeName}
                      </div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-[#1A1215]">
                        {phase.title}
                      </h4>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F8F4ED] border border-[#E3D9C9] text-xs font-sans text-[#786A5D]">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{phase.timeHorizon}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4A3D34] font-sans leading-relaxed">
                  {phase.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <h5 className="text-xs font-sans font-bold uppercase text-[#8B1E2F]">
                      Meilensteine & Deliverables
                    </h5>
                    <ul className="space-y-1.5 text-xs text-[#5C4E43]">
                      {phase.deliverables.map((deliv, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#C5A059] font-bold">•</span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-sans font-bold uppercase text-[#7A6451]">
                      Beteiligte Institutionen & Träger
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.institutionsInvolved.map((inst, i) => (
                        <span key={i} className="text-[11px] px-2 py-1 bg-[#F5EFE6] text-[#42332A] rounded border border-[#E5DBCB]">
                          {inst}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 p-2.5 rounded bg-[#FAF6EE] border border-[#C5A059]/40 text-xs font-sans font-medium text-[#8B1E2F]">
                      📊 {phase.impactMetric}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. BÜNDNIS & FRIEDENSBRÜCKEN */}
      {activeTab === 'bridges' && (
        <div className="space-y-6">
          <div className="bg-[#FAF6EE] border border-[#E3D9C9] p-6 rounded-xl space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#1A1215]">
              Historische Dynastien als Brückenbauer des Friedens
            </h3>
            <p className="text-xs sm:text-sm text-[#786A5D] font-sans leading-relaxed">
              Jedes der 335 verzeichneten Häuser besitzt eine spezifische historische Prägung. 
              In diesem Masterplan werden die bestehenden Kulturstiftungen, Residenzen und Archive als 
              transnationale Vertrauensanker reaktiviert.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-[#7A6451] font-medium self-center mr-1">Region filtern:</span>
              {[
                { label: 'Alle Regionen', value: 'ALL' },
                { label: 'DACH & HRR', value: 'DACH & Heiliges Römisches Reich' },
                { label: 'Italien, Spanien, Portugal', value: 'Italien, Spanien, Portugal' },
                { label: 'Skandinavien & Osteuropa', value: 'Skandinavien, Osteuropa, Russland' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setBridgeRegionFilter(filter.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    bridgeRegionFilter === filter.value
                      ? 'bg-[#8B1E2F] text-white border-[#8B1E2F]'
                      : 'bg-white text-[#5C4D42] border-[#E3D9C9] hover:border-[#8B1E2F]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBridges.map((bridge, idx) => (
              <div 
                key={idx}
                className="bg-white border border-[#E3D9C9] rounded-xl p-5 shadow-sm space-y-4 hover:border-[#C5A059] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-sans font-semibold text-[#8B1E2F] uppercase tracking-wider">
                      {bridge.country} • {bridge.region}
                    </div>
                    <h4 className="font-serif font-bold text-lg text-[#1A1215]">
                      {bridge.houseName}
                    </h4>
                  </div>
                  <div className="p-2 rounded bg-[#FAF6EE] border border-[#E3D9C9] text-[#C5A059]">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div>
                    <span className="font-bold text-[#55453A]">Historische Rolle: </span>
                    <span className="text-[#6B5B50]">{bridge.historicRole}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#8B1E2F]">Heutige Friedensmission: </span>
                    <span className="text-[#3A2D25]">{bridge.peaceMissionToday}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#55453A]">Symbolischer Beitrag: </span>
                    <span className="italic text-[#5C4D42]">"{bridge.symbolicContribution}"</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EFE8DD] flex items-center justify-between text-xs">
                  <span className="text-[#8A7969] truncate">
                    🏛️ {bridge.institutionRef}
                  </span>

                  {onInspectHouseByName && (
                    <button
                      onClick={() => onInspectHouseByName(bridge.houseName)}
                      className="inline-flex items-center gap-1 text-[#8B1E2F] hover:text-[#5B101C] font-medium shrink-0 ml-2"
                    >
                      <span>Archivblatt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E3D9C9] text-center text-xs text-[#786A5D] space-y-2">
            <p>
              Möchten Sie ein weiteres der 335 Häuser im vollständigen Verzeichnis einsehen?
            </p>
            <button
              onClick={onBackToDirectory}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1E2F] text-white rounded-lg text-xs font-medium hover:bg-[#6D1623] transition-colors"
            >
              <Landmark className="w-4 h-4" />
              <span>Gesamtes Verzeichnis der 335 Häuser öffnen</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. PRÄAMBEL & PROKLAMATION */}
      {activeTab === 'preamble' && (
        <div className="bg-white border border-[#E3D9C9] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2 border-b border-[#E3D9C9] pb-6">
            <div className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#8B1E2F]">
              Acta Concordiae Europae
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1215]">
              Feierliche Proklamation
            </h2>
            <div className="text-sm font-serif italic text-[#C5A059]">
              In Nomine Concordiae et Caritatis Sempiternae
            </div>
          </div>

          <div className="prose prose-stone max-w-none text-sm sm:text-base font-serif text-[#2B231D] leading-relaxed space-y-5">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#8B1E2F] first-letter:font-serif">
              Wir stehen an einer epochalen Schwelle. Die Menschheit blickt auf eine gemeinsame Geschichte zurück, 
              die von unübertroffener schöpferischer Kraft, aber auch von tiefen Gräben, verheerenden Kriegen und 
              der Illusion unüberbrückbarer Trennung geprägt ist. Jahrhundertelang standen unsere Häuser, Nationen 
              und Gemeinschaften wie an der Kante eines zersplitterten Abgrunds – stets darauf bedacht, die eigene 
              Identität durch wehrhafte Abgrenzung gegen das Gegenüber zu sichern.
            </p>

            <p>
              Doch in einer Epoche tiefgreifender globaler Erschütterungen verliert diese Kante des Misstrauens 
              ihre schützende Wirkung. Wahrer Schutz erwächst nicht mehr aus Rivalität, sondern aus der endgültigen 
              Überwindung des Abgrunds durch ein unerschütterliches Fundament gegenseitiger Nächstenliebe.
            </p>

            <h4 className="font-serif font-bold text-lg text-[#8B1E2F] pt-2">
              I. Der Mut zum Loslassen (Die Überwindung der alten Ordnung)
            </h4>
            <p>
              Wir laden Sie ein zu einem historischen Akt des Vertrauens. Es bedarf heute nicht mehr des 
              gewaltsamen Kampfes, um Stärke zu beweisen, sondern des Mutes, alte historische Lasten, 
              Konkurrenzen und Fehden ruhen zu lassen. Wir rufen dazu auf, die Rüstung des Misstrauens abzulegen 
              und sich einer neuen, höheren Ordnung der Gemeinschaft anzuvertrauen – einer Ordnung, in der kein 
              Haus, keine Dynastie und kein Glaube seine Einzigartigkeit aufgeben muss, sondern in der jede Identität 
              erhalten bleibt, um dem Ganzen zu dienen.
            </p>

            <h4 className="font-serif font-bold text-lg text-[#8B1E2F] pt-2">
              II. Die Läuterung der Geschichte (Das Element des Friedens)
            </h4>
            <p>
              Lassen Sie uns gemeinsam den Raum zwischen uns von den Schatten der Vergangenheit reinigen. 
              So wie Wasser jede Erschütterung dämpft und klärt, soll unser gemeinsamer Wille zum Frieden 
              historische Schuldzuweisungen, Feindseligkeiten und alte Ängste auflösen. Wir treten ein in eine 
              Phase der Stille und der Neuausrichtung, in der nicht das Schwert oder die Machtpolitik regieren, 
              sondern die reine Absicht, der Menschheit als Vorbild der Eintracht zu dienen.
            </p>

            <h4 className="font-serif font-bold text-lg text-[#8B1E2F] pt-2">
              III. Das unerschütterliche Fundament (Die Matrix der Nächstenliebe)
            </h4>
            <p>
              Wir proklamieren hiermit ein neues, unumstößliches Fundament für unser Miteinander: Ein elastisches, 
              seidenweiches, aber unzerreißbares Band der Nächstenliebe, des tiefen Respekts und des gegenseitigen 
              Schutzes. Dieses Bündnis ist so beschaffen, dass es jede Krise und jede Erschütterung auffängt. 
              Wenn ein Mitglied dieser Gemeinschaft fällt, trifft es nicht auf harten Boden, sondern wird von der 
              Stärke und der Liebe der anderen getragen und wieder aufgerichtet. In diesem Fundament wird jeder 
              zerstörerische Impuls in reine, aufbauende Energie umgewandelt.
            </p>

            <h4 className="font-serif font-bold text-lg text-[#8B1E2F] pt-2">
              IV. Die ewige Völkerfamilie (Der Zustand des ruhenden Friedens)
            </h4>
            <p>
              Mit diesem Pakt heben wir die Notwendigkeit auf, sich jemals wieder in Gefahr begeben zu müssen. 
              Der Abgrund zwischen unseren Häusern existiert nicht mehr, denn er ist nun vollständig ausgefüllt 
              durch ein zeitloses Band der Liebe und Verbundenheit. Wir agieren fortan nicht mehr als isolierte 
              Fraktionen, sondern als eine globale, organische Familie. Jeder bewahrt sein eigenes Erbe, seine 
              eigenen Traditionen und seine eigene Stimme – doch wir leben im absoluten Bewusstsein: 
              <strong> Wir sind gehalten, beschützt und auf ewig miteinander verbunden.</strong>
            </p>
          </div>

          <div className="pt-6 border-t border-[#E3D9C9] flex items-center justify-between">
            <button
              onClick={handleCopyManifesto}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1E2F] text-white rounded-lg text-xs font-medium hover:bg-[#6D1623] transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Diesen Text kopieren</span>
            </button>
            <span className="text-xs text-[#8A7969] font-serif italic">
              Acta Concordiae Europae • Pro Pace et Concordia
            </span>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. OFFIZIELLES ANSCHREIBEN AN STIFTUNGEN */}
      {activeTab === 'letter' && (
        <div className="bg-white border border-[#E3D9C9] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="space-y-2 border-b border-[#E3D9C9] pb-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase font-sans font-bold text-[#8B1E2F]">
              <FileText className="w-4 h-4" />
              <span>Diplomatisches Anschreiben-Formular</span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1215]">
              Offizielles Einladungsschreiben an Archive, Stiftungen & Häuser
            </h3>
            <p className="text-xs text-[#786A5D] font-sans">
              Dieses diplomatisch formulierte Anschreiben kann offiziell an die verzeichneten 
              Stiftungs- und Schlossverwaltungen gerichtet werden, um den Beitritt zur Friedensmatrix anzuregen.
            </p>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E5DCCF] rounded-xl p-6 font-mono text-xs text-[#302621] space-y-4 leading-relaxed overflow-x-auto">
            <div>
              <strong>Betreff:</strong> Einladung zum Eintritt in die 'Acta Concordiae Europae' – Das Bündnis der europäischen Häuser und Kulturstiftungen für dauerhaften Frieden und gegenseitigen Schutz
            </div>
            <hr className="border-[#E3D9C9]" />
            <div>
              Sehr geehrte Damen und Herren des Kuratoriums,<br />
              Exzellenzen, hochverehrte Hüter des kulturellen Erbes,<br /><br />
              die europäischen Dynastien, Kulturstiftungen und Geschichtsarchive bewahren über Jahrhunderte hinweg 
              das gemeinsame Gedächtnis unseres Kontinents. Aus dieser historischen Tiefe erwächst in Zeiten globaler 
              Verunsicherung eine besondere Pflicht zur Völkerverständigung und zur Nächstenliebe.<br /><br />
              Im Namen der <em>Acta Concordiae Europae</em> laden wir Ihre verehrte Institution herzlich ein, 
              sich der Charta des gegenseitigen Schutzes und der transnationalen Versöhnung anzuschließen.<br /><br />
              <strong>Die vier Grundpfeiler des Bündnisses lauten:</strong><br />
              1. Der Mut zum Loslassen (Überwindung historischer Vorbehalte)<br />
              2. Die Läuterung der Geschichte (Transparente, offene Archive als Stätten des Dialogs)<br />
              3. Das unerschütterliche Fundament (Die elastische Matrix der Nächstenliebe & des Schutzes)<br />
              4. Die ewige Völkerfamilie (Dauerhafter Friede unter Wahrung aller Identitäten)<br /><br />
              Über das digitale Archivportal (Corpus Nobilium Europae) sind bereits 335 Häuser und Stiftungen erfasst. 
              Wir freuen uns darauf, gemeinsam mit Ihrer Institution jene tragende Brücke zu bilden, 
              die Europa im Geiste des Friedens unzertrennlich zusammenhält.<br /><br />
              Mit vorzüglicher Hochachtung,<br />
              <em>Das Präsidium der Acta Concordiae Europae</em>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Sehr geehrte Damen und Herren des Kuratoriums, Exzellenzen, hochverehrte Hüter des kulturellen Erbes, ... [Acta Concordiae Europae]`);
                setCopiedState(true);
                setTimeout(() => setCopiedState(false), 3000);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1E2F] hover:bg-[#6D1623] text-white rounded-lg text-xs font-medium transition-colors"
            >
              {copiedState ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedState ? 'Anschreiben kopiert!' : 'Anschreiben kopieren'}</span>
            </button>

            <button
              onClick={handleDownloadManifesto}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E3D9C9] text-[#42332A] hover:bg-[#F8F4ED] rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Vollständiges Dokument herunterladen</span>
            </button>
          </div>
        </div>
      )}

      <ActiveHousesGPIOverlayModal
        houses={houses}
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        onInspectHouseByName={onInspectHouseByName}
      />
    </div>
  );
};
