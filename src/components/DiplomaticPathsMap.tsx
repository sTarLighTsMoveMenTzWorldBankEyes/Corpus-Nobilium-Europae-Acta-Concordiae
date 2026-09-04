import React, { useState, useMemo, useRef } from 'react';
import { 
  Network, 
  MapPin, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Info, 
  ArrowRight, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle2, 
  Crown, 
  Shield,
  Filter,
  ExternalLink,
  Flame,
  Sliders
} from 'lucide-react';
import { EUROPE_COUNTRY_PATHS, EUROPE_MAP_DIMENSIONS } from '../data/europe-map-paths';
import { BADGE_CENTERS_OVERRIDE, COUNTRY_FLAGS, getCountryColorStyle } from './EuropeMap/europeMapData';
import { House } from '../types';
import { useGlowSettings } from './GlowSettingsContext';

interface DiplomaticPathsMapProps {
  houses?: House[];
  onInspectHouseByName?: (houseName: string) => void;
  className?: string;
}

export interface DiplomaticAlliancePath {
  id: string;
  title: string;
  subtitle: string;
  category: 'PEACE_CORRIDOR' | 'ARCHIVE_PROTECTION' | 'CULTURAL_HERITAGE' | 'DIPLOMATIC_PACT';
  houseA: { name: string; country: string; seat: string; code: string; coords: [number, number] };
  houseB: { name: string; country: string; seat: string; code: string; coords: [number, number] };
  intermediateHub?: { name: string; country: string; seat: string; code: string; coords: [number, number] };
  description: string;
  status: 'Aktiv' | 'BESA eID Verifiziert' | 'Krisen-Intervention';
  actaConcordiaePillar: string;
  treatyYear?: string;
  besaEidStatus: string;
}

export const DIPLOMATIC_PATHS_DATA: DiplomaticAlliancePath[] = [
  {
    id: 'path-1',
    title: 'Donau-Friedenskorridor & Archivschutz',
    subtitle: 'Mitteleuropäisches Herzbündnis der Acta Concordiae',
    category: 'PEACE_CORRIDOR',
    houseA: { name: 'Haus Habsburg-Lothringen', country: 'Österreich', seat: 'Wien', code: 'AT', coords: [394, 473] },
    houseB: { name: 'Haus Hohenzollern', country: 'Deutschland', seat: 'Sigmaringen / Berlin', code: 'DE', coords: [350, 415] },
    intermediateHub: { name: 'Haus Lobkowicz', country: 'Tschechien', seat: 'Prag', code: 'CZ', coords: [405, 436] },
    description: 'Historischer Ausgleich zwischen den einst rivalisierenden Großmächten des Heiligen Römischen Reiches. Reaktivierung der gemeinsamen Kulturstiftung zur Friedenssicherung in Mitteleuropa.',
    status: 'BESA eID Verifiziert',
    actaConcordiaePillar: 'I. Säule (Animus Dimittendi) & III. Säule (Matrix Caritatis)',
    treatyYear: '1648 / 2026',
    besaEidStatus: '100% Swiss Trust eID Validiert'
  },
  {
    id: 'path-[#2]',
    title: 'Franko-Alpines Kultur- & Schutzabkommen',
    subtitle: 'Transalpiner Friedens- & Denkmalschutzraum',
    category: 'CULTURAL_HERITAGE',
    houseA: { name: 'Haus Bourbon-Orléans', country: 'Frankreich', seat: 'Paris / Amboise', code: 'FR', coords: [258, 489] },
    houseB: { name: 'Haus Savoyen (Savoia)', country: 'Italien', seat: 'Turin / Rom', code: 'IT', coords: [372, 545] },
    intermediateHub: { name: 'Schweizer Kulturstiftung', country: 'Schweiz', seat: 'Bern / Genf', code: 'CH', coords: [325, 488] },
    description: 'Bündnis zur Bewahrung des kulturellen Erbes entlang des Rheins und der Alpen. Verknüpfung der Schlossarchive Paris, Turin und Vaduz über den neutralen Schweizer Trust-Hub.',
    status: 'Aktiv',
    actaConcordiaePillar: 'II. Säule (Lustratio Memoriae)',
    treatyYear: '1815 / 2026',
    besaEidStatus: 'BESA eID Zertifiziert'
  },
  {
    id: 'path-3',
    title: 'Ibero-Atlantischer Friedenspakt',
    subtitle: 'Süd-Europäische Erbe- & Schiffsarchiv-Matrix',
    category: 'DIPLOMATIC_PACT',
    houseA: { name: 'Haus Borbón-Anjou', country: 'Spanien', seat: 'Madrid', code: 'ES', coords: [165, 584] },
    houseB: { name: 'Haus Braganza', country: 'Portugal', seat: 'Lissabon / Guimarães', code: 'PT', coords: [106, 583] },
    description: 'Enges Bündnis zur gemeinsamen Bewahrung des ibero-europäischen Welterbes, der Ozean-Dokumentationsarchive und des Schutzes diplomatischer Freiräume.',
    status: 'BESA eID Verifiziert',
    actaConcordiaePillar: 'IV. Säule (Familia Gentium Sempiterna)',
    treatyYear: '1668 / 2026',
    besaEidStatus: 'BESA eID Validiert'
  },
  {
    id: 'path-4',
    title: 'Nordisch-Ostsee-Friedenskorridor',
    subtitle: 'Skandinavisch-Polnisches Stiftungsnetzwerk',
    category: 'ARCHIVE_PROTECTION',
    houseA: { name: 'Haus Bernadotte', country: 'Schweden', seat: 'Stockholm', code: 'SE', coords: [398, 255] },
    houseB: { name: 'Fürstenhaus Radziwiłł / Czartoryski', country: 'Polen', seat: 'Warschau / Krakau', code: 'PL', coords: [445, 391] },
    intermediateHub: { name: 'Haus Glücksburg', country: 'Dänemark', seat: 'Kopenhagen', code: 'DK', coords: [347, 331] },
    description: 'Ostsee-Netzwerk für freien Dokumentenaustausch, Denkmalschutz und die Vermeidung maritimer und territorialer Spannungen im Baltischen Raum.',
    status: 'Aktiv',
    actaConcordiaePillar: 'III. Säule (Matrix Caritatis)',
    treatyYear: '1919 / 2026',
    besaEidStatus: 'BESA eID Akkreditiert'
  },
  {
    id: 'path-5',
    title: 'Kiewer SOS-Kulturgut-Notbrücke',
    subtitle: 'Humanitärer Evakuierungs- & Schutzkorridor',
    category: 'ARCHIVE_PROTECTION',
    houseA: { name: 'Kiewer Fürstenarchiv-Rat', country: 'Ukraine', seat: 'Kiew', code: 'UA', coords: [580, 420] },
    houseB: { name: 'Habsburgisch-Donauischer Konvent', country: 'Österreich', seat: 'Wien', code: 'AT', coords: [394, 473] },
    intermediateHub: { name: 'Mittelosteuropäischer Magnatenrat', country: 'Polen', seat: 'Warschau', code: 'PL', coords: [445, 391] },
    description: 'Aktive Notfall-Mission zur Sicherung historischer Pergamente, sakraler Kulturgüter und Fürstenarchive aus ukrainischen Konfliktzonen in sichere Stiftungsdepots.',
    status: 'Krisen-Intervention',
    actaConcordiaePillar: 'III. Säule (SOS-Kulturgüterschutz)',
    treatyYear: '2024 / 2026',
    besaEidStatus: 'BESA eID Not-Akkreditierung'
  },
  {
    id: 'path-6',
    title: 'Anglo-Kontinentales Konkordat',
    subtitle: 'Commonwealth-Europäisches Vermittlungssystem',
    category: 'DIPLOMATIC_PACT',
    houseA: { name: 'Haus Windsor / Sachsen-Coburg', country: 'Großbritannien', seat: 'London / Windsor', code: 'GB', coords: [217, 360] },
    houseB: { name: 'Haus Sachsen-Coburg und Gotha', country: 'Belgien', seat: 'Brüssel', code: 'BE', coords: [288, 416] },
    intermediateHub: { name: 'Haus Welfen / Hannover', country: 'Deutschland', seat: 'Hannover', code: 'DE', coords: [350, 415] },
    description: 'Transnationale Vertrauensbrücke zwischen dem Vereinigten Königreich und den kontinentaleuropäischen Stiftungs- und Parlamentsarchiven.',
    status: 'Aktiv',
    actaConcordiaePillar: 'IV. Säule (Familia Gentium Sempiterna)',
    treatyYear: '1831 / 2026',
    besaEidStatus: 'BESA eID Synchronisiert'
  }
];

export const DiplomaticPathsMap: React.FC<DiplomaticPathsMapProps> = ({
  houses = [],
  onInspectHouseByName,
  className = ''
}) => {
  const { 
    settings: glowSettings, 
    setIsPanelOpen: setIsGlowPanelOpen,
    getPrimaryGlowColor,
    getSecondaryGlowColor,
    getGlowOpacity,
    getPulseDurationClass
  } = useGlowSettings();

  const [selectedPathId, setSelectedPathId] = useState<string>('path-1');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [hoveredPathId, setHoveredPathId] = useState<string | null>(null);

  // Zoom and map state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activePath = DIPLOMATIC_PATHS_DATA.find(p => p.id === selectedPathId) || DIPLOMATIC_PATHS_DATA[0];

  const primaryGlowColor = getPrimaryGlowColor();
  const secondaryGlowColor = getSecondaryGlowColor();
  const glowOpacity = getGlowOpacity();
  const pulseClass = getPulseDurationClass();

  const filteredPaths = useMemo(() => {
    if (categoryFilter === 'ALL') return DIPLOMATIC_PATHS_DATA;
    return DIPLOMATIC_PATHS_DATA.filter(p => p.category === categoryFilter);
  }, [categoryFilter]);

  // SVG Curved Path Generator (Quadratic Bezier Curve M x1 y1 Q cx cy x2 y2)
  const renderCurvedPath = (
    from: [number, number], 
    to: [number, number], 
    curvature: number = 0.25
  ) => {
    const [x1, y1] = from;
    const [x2, y2] = to;
    const dx = x2 - x1;
    const dy = y2 - y1;
    // Calculate control point for elegant curved arc
    const cx = (x1 + x2) / 2 - dy * curvature;
    const cy = (y1 + y2) / 2 + dx * curvature;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const currentViewBox = useMemo(() => {
    const baseW = EUROPE_MAP_DIMENSIONS.width;
    const baseH = EUROPE_MAP_DIMENSIONS.height;
    const currentW = baseW / zoomLevel;
    const currentH = baseH / zoomLevel;
    const minX = Math.max(0, Math.min(baseW - currentW, (baseW - currentW) / 2 + panOffset.x));
    const minY = Math.max(0, Math.min(baseH - currentH, (baseH - currentH) / 2 + panOffset.y));
    return `${minX} ${minY} ${currentW} ${currentH}`;
  }, [zoomLevel, panOffset]);

  return (
    <div className={`bg-[#FAF7F0] border border-[#DFCDB7] rounded-2xl p-5 sm:p-7 shadow-md space-y-6 ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E3D9C9] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B1E2F] text-white text-xs font-semibold uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5 text-[#E5C170]" />
            <span>Acta Concordiae Transnationale Bündnisse</span>
          </div>

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1215] flex items-center gap-2">
            <span>Interaktive Diplomatie-Pfade auf der Europakarte</span>
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
          </h3>

          <p className="text-xs text-[#6B5A4B] leading-relaxed max-w-3xl">
            Zeichnet dynamische Friedens- und Kulturkorridore zwischen Adelshäusern verschiedener Nationen. 
            Jeder Pfad repräsentiert ein aktives Projekt der <strong>Acta Concordiae Europae</strong> zur grenzüberschreitenden Versöhnung, 
            Depotsicherung und BESA eID-Authentifizierung.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#D8CCBA] shrink-0 shadow-2xs">
          <div className="p-2 rounded-lg bg-[#1A1215] text-[#E5C170]">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider">
              Aktive Friedensbrücken
            </span>
            <div className="text-base font-serif font-bold text-[#1A1215]">
              {DIPLOMATIC_PATHS_DATA.length} Transnationale Pfade
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E3D9C9] text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#8B1E2F] uppercase tracking-wider mr-1">Kategorie:</span>
          {[
            { id: 'ALL', label: 'Alle Pfade' },
            { id: 'PEACE_CORRIDOR', label: '🕊️ Friedenskorridore' },
            { id: 'ARCHIVE_PROTECTION', label: '📜 Archiv- & Kulturgüterschutz' },
            { id: 'CULTURAL_HERITAGE', label: '🏰 Kultur- & Stiftungsbrücken' },
            { id: 'DIPLOMATIC_PACT', label: '🤝 Staats- & Dynastiepakte' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#8B1E2F] text-white shadow-2xs'
                  : 'bg-[#F8F4EC] text-[#5C4C3E] hover:bg-[#EAE1D1]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-[#7A6B5C] hidden sm:block">
          Geklickter Pfad hebt beteiligte Hauptstädte & Häuser hervor
        </div>
      </div>

      {/* Main Vector Map Canvas & Path Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Europe Canvas with Arc Path Overlay */}
        <div className="lg:col-span-7 bg-[#EDE6D8] border border-[#D8CCBA] rounded-xl overflow-hidden relative shadow-inner select-none min-h-[420px]">
          {/* Parchment background pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#8B1E2F 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Canvas Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-xs border border-[#D5C6B2] rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setIsGlowPanelOpen(true)}
              className="p-1.5 text-[#8B1E2F] hover:bg-[#F4EFE6] rounded transition-all flex items-center justify-center relative group"
              title="Glow- & Puls-Einstellungen anpassen"
            >
              <Sliders className="w-4 h-4 text-[#8B1E2F] group-hover:scale-110 transition-transform" />
              {glowSettings.enabled && (
                <span 
                  className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: primaryGlowColor }}
                />
              )}
            </button>
            <div className="w-full h-px bg-[#E3D9C9] my-0.5" />
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.3))}
              className="p-1.5 text-[#544638] hover:text-[#1A1215] hover:bg-[#F4EFE6] rounded transition-colors"
              title="Vergrößern"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.3))}
              className="p-1.5 text-[#544638] hover:text-[#1A1215] hover:bg-[#F4EFE6] rounded transition-colors"
              title="Verkleinern"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-[#8B1E2F] hover:bg-[#F4EFE6] rounded transition-colors"
                title="Ansicht zurücksetzen"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* SVG Map Canvas */}
          <svg
            viewBox={currentViewBox}
            className="w-full h-auto block"
            style={{ minHeight: '400px', maxHeight: '560px' }}
          >
            <defs>
              <filter id="path-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow 
                  dx="0" 
                  dy="0" 
                  stdDeviation={glowSettings.enabled ? glowSettings.blurRadius : 0} 
                  floodColor={primaryGlowColor} 
                  floodOpacity={glowOpacity} 
                />
              </filter>
              <filter id="path-glow-red" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow 
                  dx="0" 
                  dy="0" 
                  stdDeviation={glowSettings.enabled ? glowSettings.blurRadius * 1.2 : 0} 
                  floodColor={glowSettings.colorTheme === 'ruby' ? '#F43F5E' : '#E11D48'} 
                  floodOpacity={glowOpacity * 1.1} 
                />
              </filter>
              {/* Dynamic Linear Gradients for Arcs */}
              <linearGradient id="goldArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B1E2F" />
                <stop offset="50%" stopColor={primaryGlowColor} />
                <stop offset="100%" stopColor={secondaryGlowColor} />
              </linearGradient>
            </defs>

            {/* Base Countries Layer */}
            <g id="paths-map-countries">
              {EUROPE_COUNTRY_PATHS.map((country) => {
                const isConnected = activePath.houseA.code === country.id || 
                  activePath.houseB.code === country.id || 
                  (activePath.intermediateHub && activePath.intermediateHub.code === country.id);

                return (
                  <path
                    key={country.id}
                    d={country.path}
                    fill={isConnected ? '#C2410C' : '#E4DDD0'}
                    stroke={isConnected ? '#F59E0B' : '#C5BCAE'}
                    strokeWidth={isConnected ? 1.8 : 0.8}
                    opacity={isConnected ? 0.95 : 0.55}
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>

            {/* Diplomatic Path Arcs Layer */}
            <g id="diplomatic-arcs-layer">
              {filteredPaths.map((pathItem) => {
                const isSelected = pathItem.id === selectedPathId;
                const isHovered = pathItem.id === hoveredPathId;

                const pathA = renderCurvedPath(pathItem.houseA.coords, pathItem.houseB.coords, 0.22);
                const pathHub = pathItem.intermediateHub ? renderCurvedPath(pathItem.houseA.coords, pathItem.intermediateHub.coords, -0.22) : null;

                return (
                  <g 
                    key={pathItem.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedPathId(pathItem.id)}
                    onMouseEnter={() => setHoveredPathId(pathItem.id)}
                    onMouseLeave={() => setHoveredPathId(null)}
                  >
                    {/* Shadow / Outer Glow Line */}
                    <path
                      d={pathA}
                      fill="none"
                      stroke={pathItem.status === 'Krisen-Intervention' ? '#E11D48' : '#D97706'}
                      strokeWidth={isSelected ? 6 : isHovered ? 4 : 2}
                      strokeOpacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.3}
                      filter={isSelected ? (pathItem.status === 'Krisen-Intervention' ? 'url(#path-glow-red)' : 'url(#path-glow)') : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Main Colored Arc */}
                    <path
                      d={pathA}
                      fill="none"
                      stroke={pathItem.status === 'Krisen-Intervention' ? '#F43F5E' : '#E5C170'}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.8}
                      strokeDasharray={pathItem.status === 'Krisen-Intervention' ? '6,4' : 'none'}
                      strokeOpacity={isSelected ? 1 : isHovered ? 0.9 : 0.5}
                      className="transition-all duration-300"
                    />

                    {/* Intermediate Hub Branch Path if exists */}
                    {pathHub && pathItem.intermediateHub && (
                      <path
                        d={pathHub}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth={isSelected ? 3 : 1.5}
                        strokeDasharray="4,3"
                        strokeOpacity={isSelected ? 0.95 : 0.4}
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* Glowing Anchor Node Badges for Active Path */}
            <g id="active-path-nodes" pointerEvents="none">
              {/* Node A */}
              <g transform={`translate(${activePath.houseA.coords[0]}, ${activePath.houseA.coords[1]})`}>
                <circle r={12} fill="#8B1E2F" opacity={0.3} className="animate-ping" />
                <circle r={8} fill="#8B1E2F" stroke="#E5C170" strokeWidth={2} />
                <text y={3} textAnchor="middle" fill="#FAF6EE" fontSize="8" fontWeight="bold">A</text>
              </g>

              {/* Node B */}
              <g transform={`translate(${activePath.houseB.coords[0]}, ${activePath.houseB.coords[1]})`}>
                <circle r={12} fill="#10B981" opacity={0.3} className="animate-ping" />
                <circle r={8} fill="#047857" stroke="#E5C170" strokeWidth={2} />
                <text y={3} textAnchor="middle" fill="#FAF6EE" fontSize="8" fontWeight="bold">B</text>
              </g>

              {/* Intermediate Hub Node */}
              {activePath.intermediateHub && (
                <g transform={`translate(${activePath.intermediateHub.coords[0]}, ${activePath.intermediateHub.coords[1]})`}>
                  <circle r={10} fill="#D97706" opacity={0.3} className="animate-pulse" />
                  <circle r={6.5} fill="#B45309" stroke="#FFFFFF" strokeWidth={1.5} />
                  <text y={2.5} textAnchor="middle" fill="#FAF6EE" fontSize="7" fontWeight="bold">H</text>
                </g>
              )}
            </g>
          </svg>

          {/* Overlay Map Banner for Active Path */}
          <div className="absolute bottom-3 left-3 right-3 bg-[#1A1115]/95 text-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 backdrop-blur-md flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-serif font-bold text-[#E5C170] truncate">{activePath.title}</span>
            </div>
            <span className="text-[10px] text-[#D8CCA9] shrink-0 font-mono">
              {activePath.houseA.country} ↔ {activePath.houseB.country}
            </span>
          </div>
        </div>

        {/* Right Side: Interactive Path Dossier & List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Path Dossier Card */}
          <div className="bg-[#1A1115] text-[#FAF6EE] rounded-2xl border border-[#C5A059]/50 p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-[#C5A059]/30 pb-3">
              <div>
                <span className="text-[10px] font-sans text-[#E5C170] font-bold uppercase tracking-widest block mb-0.5">
                  Acta Concordiae Diplomatie-Dossier
                </span>
                <h4 className="font-serif font-bold text-xl text-[#FAF6EE]">
                  {activePath.title}
                </h4>
                <div className="text-xs text-[#D8CCA9] italic">
                  {activePath.subtitle}
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                activePath.status === 'Krisen-Intervention' 
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/50' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              }`}>
                {activePath.status}
              </span>
            </div>

            {/* Partner Houses & Capitals */}
            <div className="space-y-2 text-xs">
              <div className="bg-[#24151B] p-3 rounded-xl border border-[#C5A059]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8B1E2F] text-white font-bold text-[10px] flex items-center justify-center">A</span>
                    <span className="font-serif font-bold text-[#FAF6EE]">{activePath.houseA.name}</span>
                  </div>
                  <span className="text-[10px] text-[#E5C170] font-mono">{activePath.houseA.seat} ({activePath.houseA.country})</span>
                </div>

                <div className="flex items-center justify-center text-[#C5A059]">
                  <Share2 className="w-3.5 h-3.5 rotate-90" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center">B</span>
                    <span className="font-serif font-bold text-[#FAF6EE]">{activePath.houseB.name}</span>
                  </div>
                  <span className="text-[10px] text-[#E5C170] font-mono">{activePath.houseB.seat} ({activePath.houseB.country})</span>
                </div>

                {activePath.intermediateHub && (
                  <div className="pt-2 border-t border-[#3D252E] flex items-center justify-between text-[11px] text-[#D8CCA9]">
                    <span>Hub / Vermittler: <strong>{activePath.intermediateHub.name}</strong></span>
                    <span>{activePath.intermediateHub.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description & BESA eID Verification */}
            <p className="text-xs text-[#D8CCA9] leading-relaxed font-sans">
              {activePath.description}
            </p>

            <div className="bg-[#2A1820] p-3 rounded-xl border border-[#C5A059]/30 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#E5C170] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BESA eID Verifikation & Vertrauen:</span>
                </span>
                <span className="text-emerald-400 font-mono font-semibold">{activePath.besaEidStatus}</span>
              </div>
              <div className="text-[10px] text-[#B5A593]">
                Verankert in: {activePath.actaConcordiaePillar}
              </div>
            </div>

            {/* Inspect Houses Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {onInspectHouseByName && (
                <>
                  <button
                    onClick={() => onInspectHouseByName(activePath.houseA.name)}
                    className="flex-1 py-2 px-3 bg-[#331D26] hover:bg-[#4D2838] text-[#FAF6EE] rounded-lg border border-[#C5A059]/40 font-sans font-semibold text-xs transition-colors cursor-pointer text-center truncate"
                  >
                    Dossier {activePath.houseA.code}
                  </button>
                  <button
                    onClick={() => onInspectHouseByName(activePath.houseB.name)}
                    className="flex-1 py-2 px-3 bg-[#331D26] hover:bg-[#4D2838] text-[#FAF6EE] rounded-lg border border-[#C5A059]/40 font-sans font-semibold text-xs transition-colors cursor-pointer text-center truncate"
                  >
                    Dossier {activePath.houseB.code}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick List of All Diplomatic Paths */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#6C5D50] uppercase tracking-wider block px-1">
              Weitere Diplomatie-Pfade ({filteredPaths.length}):
            </span>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredPaths.map((p) => {
                const isSelected = p.id === selectedPathId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPathId(p.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#FAF2E3] border-[#C5A059] shadow-sm font-semibold'
                        : 'bg-white border-[#E3D9C9] hover:bg-[#FDFBFA]'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-serif text-xs text-[#1A1215] truncate">{p.title}</div>
                      <div className="text-[10px] text-[#7A6B5C] font-sans">
                        {p.houseA.country} ↔ {p.houseB.country}
                      </div>
                    </div>

                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#8B1E2F]' : 'text-stone-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
