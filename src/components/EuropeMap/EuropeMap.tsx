import React, { useState, useMemo, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  X, 
  Info,
  ArrowDown,
  Flame,
  Layers,
  Sparkles,
  BarChart3,
  Share2,
  Sliders
} from 'lucide-react';
import { EUROPE_COUNTRY_PATHS, EUROPE_MAP_DIMENSIONS } from '../../data/europe-map-paths';
import { allHouses } from '../../data';
import { GLOBAL_PEACE_INDEX_DATA } from '../../data/gpiData';
import { useGlowSettings } from '../GlowSettingsContext';
import { 
  getCountryMetadataMap, 
  getCountryColorStyle, 
  SPECIAL_PINS, 
  BADGE_CENTERS_OVERRIDE, 
  COUNTRY_FLAGS, 
  CountryMeta,
  MapViewMode,
  DENSITY_TIERS,
  STANDARD_REGIONS,
  DIPLO_CONNECTIONS
} from './europeMapData';

interface EuropeMapProps {
  selectedCountry: string;
  onSelectCountry: (countryName: string) => void;
  onScrollToResults?: () => void;
}

export const EuropeMap: React.FC<EuropeMapProps> = ({
  selectedCountry,
  onSelectCountry,
  onScrollToResults
}) => {
  const { 
    settings: glowSettings, 
    setIsPanelOpen: setIsGlowPanelOpen,
    getPrimaryGlowColor,
    getGlowOpacity,
    getPulseDurationClass
  } = useGlowSettings();

  const [mapViewMode, setMapViewMode] = useState<MapViewMode>('density');
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const primaryGlowColor = getPrimaryGlowColor();
  const glowOpacity = getGlowOpacity();
  const pulseClass = getPulseDurationClass();

  // Metadata cache
  const metadataMap = useMemo(() => getCountryMetadataMap(), []);

  // Sorted list of documented countries for the quick filter pill bar
  const documentedCountries = useMemo(() => {
    return (Array.from(metadataMap.values()) as CountryMeta[]).sort((a, b) => b.housesCount - a.housesCount);
  }, [metadataMap]);

  // Top 5 density hubs for analytical insights
  const topDensityHubs = useMemo(() => {
    return documentedCountries.slice(0, 5);
  }, [documentedCountries]);

  // Count of countries per density tier for the heatmap legend
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = {
      epizentrum: 0,
      high: 0,
      medium: 0,
      moderate: 0,
      low: 0
    };
    for (const country of documentedCountries) {
      if (country.densityLevel in counts) {
        counts[country.densityLevel]++;
      }
    }
    return counts;
  }, [documentedCountries]);

  // Current hovered country info
  const hoveredCountryData = useMemo(() => {
    if (!hoveredCountryId) return null;
    const pathItem = EUROPE_COUNTRY_PATHS.find((p) => p.id === hoveredCountryId);
    if (!pathItem) return null;
    const meta = metadataMap.get(pathItem.germanName);
    return {
      pathItem,
      meta: meta || {
        code: pathItem.id,
        name: pathItem.germanName,
        germanName: pathItem.germanName,
        flag: COUNTRY_FLAGS[pathItem.germanName] || '🏛️',
        housesCount: 0,
        notableHouses: [],
        region: pathItem.region,
        rank: 0,
        percentOfTotal: 0,
        densityLevel: 'none' as const,
        densityLabel: 'Keine Adelsarchive erfasst'
      }
    };
  }, [hoveredCountryId, metadataMap]);

  // Active selected country metadata
  const selectedMeta = useMemo(() => {
    if (selectedCountry === 'ALL') return null;
    return metadataMap.get(selectedCountry) || null;
  }, [selectedCountry, metadataMap]);

  // Hovered active houses count and GPI rating
  const hoveredActiveHousesCount = useMemo(() => {
    if (!hoveredCountryData) return 0;
    return allHouses.filter(
      (h) => h.country === hoveredCountryData.meta.germanName && (h.DiplomaticStatus || h.diplomaticStatus) === 'Active'
    ).length;
  }, [hoveredCountryData]);

  const hoveredCountryGpi = useMemo(() => {
    if (!hoveredCountryData) return null;
    return GLOBAL_PEACE_INDEX_DATA.find((g) => g.country === hoveredCountryData.meta.germanName) || null;
  }, [hoveredCountryData]);

  // Dynamic ViewBox for Zoom & Pan
  const currentViewBox = useMemo(() => {
    const baseW = EUROPE_MAP_DIMENSIONS.width;
    const baseH = EUROPE_MAP_DIMENSIONS.height;
    const currentW = baseW / zoomLevel;
    const currentH = baseH / zoomLevel;
    const minX = Math.max(0, Math.min(baseW - currentW, (baseW - currentW) / 2 + panOffset.x));
    const minY = Math.max(0, Math.min(baseH - currentH, (baseH - currentH) / 2 + panOffset.y));
    return `${minX} ${minY} ${currentW} ${currentH}`;
  }, [zoomLevel, panOffset]);

  const handleCountryClick = (germanName: string, housesCount: number) => {
    if (housesCount === 0) return; // Non-clickable backdrop
    if (selectedCountry === germanName) {
      onSelectCountry('ALL');
    } else {
      onSelectCountry(germanName);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    setTooltipPos({ x: relX, y: relY });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.5, prev + 0.3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(1, prev - 0.3);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <section 
      id="europe-vector-map-section" 
      aria-label="Interaktive Europa-Landkarte der Adelshäuser"
      className="bg-[#F8F4EC] border-b border-[#E3D9C9] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#E6DCce]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex p-1.5 rounded-md bg-[#8B1E2F]/10 text-[#8B1E2F]">
                <MapPin className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#1F171A] tracking-tight">
                Interaktive Europakarte der Dynastien & Adelsarchive
              </h2>
            </div>
            <p className="text-xs text-[#7A6B5C]">
              Visualisierung aller 335 verzeichneten Adelshäuser nach Territorialdichte oder kulturhistorischen Regionen.
            </p>
          </div>

          {/* Controls: Mode Switch & Collapse */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* View Mode Segmented Toggle (Standard vs. Density Heatmap) */}
            <div 
              role="group"
              aria-label="Kartenmodus umschalten"
              className="inline-flex items-center p-0.5 bg-[#EAE1D1] border border-[#D5C6B2] rounded-lg shadow-2xs"
            >
              <button
                id="map-view-mode-density-btn"
                onClick={() => setMapViewMode('density')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  mapViewMode === 'density'
                    ? 'bg-[#7F1D1D] text-white shadow-xs'
                    : 'text-[#5A493B] hover:text-[#1F171A] hover:bg-white/60'
                }`}
                title="Thermische Heatmap der Adelshäuser-Konzentration anzeigen"
              >
                <Flame className={`w-3.5 h-3.5 ${mapViewMode === 'density' ? 'text-[#FBBF24]' : 'text-[#8B1E2F]'}`} />
                <span>Dichte-Heatmap</span>
              </button>

              <button
                id="map-view-mode-diplomatic-btn"
                onClick={() => setMapViewMode('diplomatic_reach')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  mapViewMode === 'diplomatic_reach'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-[#5A493B] hover:text-[#1F171A] hover:bg-white/60'
                }`}
                title="Diplomatisches Netzwerk und grenzüberschreitende Reichweite zwischen Hauptstädten anzeigen"
              >
                <Share2 className={`w-3.5 h-3.5 ${mapViewMode === 'diplomatic_reach' ? 'text-[#FBBF24]' : 'text-[#059669]'}`} />
                <span>Diplomatie-Reichweite</span>
              </button>

              <button
                id="map-view-mode-standard-btn"
                onClick={() => setMapViewMode('standard')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  mapViewMode === 'standard'
                    ? 'bg-white text-[#1F171A] shadow-xs border border-[#D0C2AE]'
                    : 'text-[#5A493B] hover:text-[#1F171A] hover:bg-white/60'
                }`}
                title="Klassische Ansicht nach historischen Territorialregionen"
              >
                <Layers className="w-3.5 h-3.5 text-[#655342]" />
                <span>Standard-Ansicht</span>
              </button>
            </div>

            {selectedCountry !== 'ALL' && (
              <button
                id="map-reset-country-filter-btn"
                onClick={() => onSelectCountry('ALL')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B1E2F] text-white text-xs font-medium hover:bg-[#6D1623] shadow-xs transition-colors"
                title="Länderfilter aufheben"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filter aufheben</span>
                <span className="sm:hidden">Alle</span>
              </button>
            )}

            <button
              id="map-toggle-collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#D8CCBA] bg-white text-xs text-[#524436] hover:bg-[#FAF7F0] transition-colors"
              title={isCollapsed ? 'Karte ausklappen' : 'Karte einklappen'}
            >
              {isCollapsed ? (
                <>
                  <span>Karte anzeigen</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Einklappen</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Country Indicator Banner */}
        {selectedCountry !== 'ALL' && selectedMeta && (
          <div className="mt-3 p-3 bg-[#FAF4EA] border border-[#E4CDB3] rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label={selectedCountry}>
                {selectedMeta.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1E2F]">
                    Aktiver Länderfilter:
                  </span>
                  <span className="text-sm font-serif font-bold text-[#1A1215]">
                    {selectedMeta.germanName}
                  </span>
                  <span className="text-xs bg-[#8B1E2F] text-white px-2 py-0.5 rounded-full font-medium">
                    {selectedMeta.housesCount} {selectedMeta.housesCount === 1 ? 'Adelshaus' : 'Adelshäuser'}
                  </span>
                  <span className="text-xs bg-[#EAE0D0] text-[#554638] px-2 py-0.5 rounded-full font-semibold">
                    Rang #{selectedMeta.rank} ({selectedMeta.percentOfTotal}%)
                  </span>
                </div>
                <div className="text-[11px] text-[#7A6A5A] mt-0.5">
                  Bedeutende Dynastien: <span className="text-[#3F3328] font-medium">{selectedMeta.notableHouses.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onScrollToResults && (
                <button
                  onClick={onScrollToResults}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#D5C2AD] hover:bg-[#F2E8DC] text-xs text-[#4A3B2F] rounded-md font-medium transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Zu den Ergebnissen ({selectedMeta.housesCount})</span>
                </button>
              )}
              <button
                onClick={() => onSelectCountry('ALL')}
                className="p-1 hover:bg-[#EBDDCF] rounded-md text-[#7A6B5C] hover:text-[#1A1215] transition-colors"
                title="Länderfilter entfernen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Heatmap Insights Bar (Active in Density View) */}
        {!isCollapsed && mapViewMode === 'density' && (
          <div className="mt-3 p-2.5 bg-[#FAF2E6] border border-[#E6D7C2] rounded-lg flex flex-wrap items-center justify-between gap-2 shadow-2xs text-xs animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1 rounded bg-[#B91C1C]/15 text-[#B91C1C]">
                <Flame className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold text-[#30241B]">
                Europäische Dichte-Hotspots:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {topDensityHubs.map((hub) => (
                  <button
                    key={hub.germanName}
                    id={`heatmap-hub-${hub.code.toLowerCase()}`}
                    onClick={() => handleCountryClick(hub.germanName, hub.housesCount)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      selectedCountry === hub.germanName
                        ? 'bg-[#7F1D1D] text-white shadow-2xs'
                        : 'bg-white hover:bg-[#F0E6D6] text-[#47392E] border border-[#DCCDBA]'
                    }`}
                    title={`${hub.germanName}: Rang #${hub.rank}, ${hub.housesCount} Häuser (${hub.percentOfTotal}% des europäischen Gesamtbestands)`}
                  >
                    <span>{hub.flag}</span>
                    <span>{hub.germanName}</span>
                    <span className="text-[10px] font-bold text-[#8B1E2F] bg-[#FAF2E6] px-1 rounded">
                      {hub.housesCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-[#786959] hidden lg:block">
              Deutschland (90) & Italien (60) vereinen <strong className="text-[#7F1D1D] font-bold">44.8%</strong> aller 335 Archive
            </div>
          </div>
        )}

        {/* Main Map Visual Canvas & Controls */}
        {!isCollapsed && (
          <div className="mt-3 space-y-3">
            {/* SVG Map Container Card */}
            <div 
              ref={mapContainerRef}
              className="relative bg-[#EDE6D8] border border-[#D8CCBA] rounded-xl overflow-hidden shadow-inner select-none"
              style={{ minHeight: '380px' }}
            >
              {/* Parchment Grid Overlay & Compass Watermark */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `radial-gradient(#8B1E2F 0.75px, transparent 0.75px)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Water / Sea Label Watermarks */}
              <div className="absolute top-12 left-12 text-[11px] font-serif uppercase tracking-[0.25em] text-[#A69885] pointer-events-none select-none opacity-60">
                Atlantischer Ozean
              </div>
              <div className="absolute bottom-6 left-1/3 text-[11px] font-serif uppercase tracking-[0.25em] text-[#A69885] pointer-events-none select-none opacity-60">
                Mittelmeer (Mare Nostrum)
              </div>
              <div className="absolute top-24 left-1/3 text-[10px] font-serif uppercase tracking-[0.2em] text-[#A69885] pointer-events-none select-none opacity-60">
                Nordsee
              </div>
              <div className="absolute top-28 right-1/3 text-[10px] font-serif uppercase tracking-[0.2em] text-[#A69885] pointer-events-none select-none opacity-60">
                Ostsee
              </div>

              {/* View Mode Indicator Tag on Canvas */}
              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] font-semibold tracking-wide backdrop-blur-xs shadow-2xs border ${
                  mapViewMode === 'density'
                    ? 'bg-[#7F1D1D]/90 text-white border-[#FBBF24]/40'
                    : 'bg-white/90 text-[#3F3327] border-[#D5C6B2]'
                }`}>
                  {mapViewMode === 'density' ? (
                    <>
                      <Flame className="w-3 h-3 text-[#FBBF24]" />
                      <span>Heatmap-Modus: Adelshäuser-Dichte</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3 h-3 text-[#7A6A5A]" />
                      <span>Standard-Modus: Kulturregionen</span>
                    </>
                  )}
                </span>
              </div>

              {/* Zoom & Pan Toolbar */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-xs border border-[#D5C6B2] rounded-lg p-1 shadow-sm">
                <button
                  id="map-glow-settings-btn"
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
                  id="map-zoom-in-btn"
                  onClick={handleZoomIn}
                  className="p-1.5 text-[#544638] hover:text-[#1A1215] hover:bg-[#F4EFE6] rounded transition-colors"
                  title="Vergrößern (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  id="map-zoom-out-btn"
                  onClick={handleZoomOut}
                  className="p-1.5 text-[#544638] hover:text-[#1A1215] hover:bg-[#F4EFE6] rounded transition-colors"
                  title="Verkleinern (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                {zoomLevel !== 1 && (
                  <button
                    id="map-reset-zoom-btn"
                    onClick={handleResetZoom}
                    className="p-1.5 text-[#8B1E2F] hover:bg-[#F4EFE6] rounded transition-colors"
                    title="Ansicht zurücksetzen"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Interactive Vector SVG Canvas */}
              <svg
                viewBox={currentViewBox}
                className="w-full h-auto block cursor-default"
                style={{ maxHeight: '520px', minHeight: '360px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                  setHoveredCountryId(null);
                  setTooltipPos(null);
                }}
              >
                <defs>
                  {/* Glowing shadow filters */}
                  <filter id="country-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow 
                      dx="0" 
                      dy="2" 
                      stdDeviation={glowSettings.enabled ? glowSettings.blurRadius : 0} 
                      floodColor={primaryGlowColor} 
                      floodOpacity={glowOpacity} 
                    />
                  </filter>
                  <filter id="badge-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Country Polygons Layer */}
                <g id="european-countries-layer">
                  {EUROPE_COUNTRY_PATHS.map((country) => {
                    const meta = metadataMap.get(country.germanName);
                    const housesCount = meta ? meta.housesCount : 0;
                    const isSelected = selectedCountry === country.germanName;
                    const isHovered = hoveredCountryId === country.id;
                    const style = getCountryColorStyle(
                      housesCount, 
                      country.region, 
                      isSelected, 
                      isHovered, 
                      mapViewMode
                    );

                    return (
                      <path
                        key={country.id}
                        id={`map-country-${country.id.toLowerCase()}`}
                        d={country.path}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={style.strokeWidth}
                        opacity={style.opacity}
                        filter={isSelected || isHovered ? 'url(#country-glow)' : undefined}
                        className={`transition-colors duration-150 ${
                          housesCount > 0 ? 'cursor-pointer hover:brightness-95' : 'cursor-default'
                        }`}
                        onMouseEnter={() => setHoveredCountryId(country.id)}
                        onClick={() => handleCountryClick(country.germanName, housesCount)}
                      />
                    );
                  })}
                </g>

                {/* Diplomatic Reach Weighted Connections Layer */}
                {mapViewMode === 'diplomatic_reach' && (
                  <g id="diplomatic-reach-connections-layer">
                    {DIPLO_CONNECTIONS.map((conn, idx) => {
                      const [x1, y1] = conn.fromCoords;
                      const [x2, y2] = conn.toCoords;
                      const dx = x2 - x1;
                      const dy = y2 - y1;
                      const cx = (x1 + x2) / 2 - dy * 0.18;
                      const cy = (y1 + y2) / 2 + dx * 0.18;
                      const pathStr = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
                      const strokeW = conn.weight * 0.7;

                      return (
                        <g key={`diplo-line-${idx}`} className="group cursor-pointer" title={`${conn.label} (Gewichtung: ${conn.weight}/5)`}>
                          <path
                            d={pathStr}
                            fill="none"
                            stroke="#059669"
                            strokeWidth={strokeW + 2.5}
                            strokeOpacity={0.25}
                          />
                          <path
                            d={pathStr}
                            fill="none"
                            stroke={conn.weight >= 5 ? '#FBBF24' : '#34D399'}
                            strokeWidth={strokeW}
                            strokeDasharray={conn.weight < 4 ? '5,3' : undefined}
                            strokeOpacity={0.9}
                            className="transition-all group-hover:stroke-white group-hover:stroke-[3px]"
                          />
                          <circle cx={cx} cy={cy} r={2.2} fill="#F59E0B" stroke="#064E3B" strokeWidth={1} />
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Microstate Interactive Target Pins */}
                <g id="microstates-layer">
                  {Object.entries(SPECIAL_PINS).map(([code, pin]) => {
                    const pathItem = EUROPE_COUNTRY_PATHS.find((p) => p.id === code);
                    const germanName = pathItem ? pathItem.germanName : pin.label;
                    const meta = metadataMap.get(germanName);
                    const housesCount = meta ? meta.housesCount : 0;
                    const isSelected = selectedCountry === germanName;
                    const isHovered = hoveredCountryId === code;

                    // Pin coloration based on viewMode and heat
                    let pinCoreFill = '#9E2A2B';
                    let pinPulseFill = '#8B1E2F';

                    if (isSelected) {
                      pinCoreFill = '#560B17';
                      pinPulseFill = '#F59E0B';
                    } else if (mapViewMode === 'density') {
                      pinCoreFill = '#D97706';
                      pinPulseFill = '#F59E0B';
                    }

                    return (
                      <g 
                        key={code}
                        id={`map-pin-${code.toLowerCase()}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredCountryId(code)}
                        onClick={() => handleCountryClick(germanName, housesCount)}
                      >
                        {/* Outer pulse ring for high visibility */}
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={pin.pinRadius + 4}
                          fill={pinPulseFill}
                          opacity={isSelected || isHovered ? 0.5 : 0.25}
                          className="transition-all animate-pulse"
                        />
                        {/* Center core pin */}
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={pin.pinRadius}
                          fill={pinCoreFill}
                          stroke="#FFF8EE"
                          strokeWidth={1.5}
                          filter="url(#badge-shadow)"
                        />
                        {/* Pin label text */}
                        <text
                          x={pin.x}
                          y={pin.y + 3.5}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          pointerEvents="none"
                        >
                          {code}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Country House Count Badges on Major Territories */}
                <g id="country-labels-layer" pointerEvents="none">
                  {EUROPE_COUNTRY_PATHS.map((country) => {
                    const meta = metadataMap.get(country.germanName);
                    if (!meta || meta.housesCount === 0) return null;
                    
                    // Skip microstates that already have dedicated pins
                    if (['LI', 'MC', 'LU', 'SM', 'VA'].includes(country.id)) return null;

                    const center = BADGE_CENTERS_OVERRIDE[country.id] || country.center;
                    const isSelected = selectedCountry === country.germanName;
                    const isHovered = hoveredCountryId === country.id;

                    // Dynamic badge styling based on viewMode and heat
                    let badgeFill = '#1A1215';
                    let badgeStroke = '#FFFFFF';
                    let badgeTextFill = '#FFFFFF';

                    if (isSelected) {
                      badgeFill = '#F59E0B';
                      badgeStroke = '#560B17';
                      badgeTextFill = '#1A1215';
                    } else if (isHovered) {
                      badgeFill = '#FFFFFF';
                      badgeStroke = '#B91C1C';
                      badgeTextFill = '#7F1D1D';
                    } else if (mapViewMode === 'density') {
                      if (meta.housesCount >= 40) {
                        badgeFill = '#560B17';
                        badgeStroke = '#F59E0B';
                        badgeTextFill = '#FFFBEB';
                      } else if (meta.housesCount >= 16) {
                        badgeFill = '#7F1D1D';
                        badgeStroke = '#FCA5A5';
                        badgeTextFill = '#FFFFFF';
                      } else if (meta.housesCount >= 9) {
                        badgeFill = '#C2410C';
                        badgeStroke = '#FDBA74';
                        badgeTextFill = '#FFFFFF';
                      } else if (meta.housesCount >= 4) {
                        badgeFill = '#D97706';
                        badgeStroke = '#FDE68A';
                        badgeTextFill = '#FFFFFF';
                      } else {
                        badgeFill = '#78350F';
                        badgeStroke = '#FEF3C7';
                        badgeTextFill = '#FFFFFF';
                      }
                    }

                    const badgeText = `${meta.housesCount}`;
                    const badgeWidth = meta.housesCount > 9 ? 22 : 18;

                    return (
                      <g key={`badge-${country.id}`} transform={`translate(${center[0]}, ${center[1]})`}>
                        <rect
                          x={-badgeWidth / 2}
                          y={-9}
                          width={badgeWidth}
                          height={18}
                          rx={9}
                          fill={badgeFill}
                          stroke={badgeStroke}
                          strokeWidth={1}
                          filter="url(#badge-shadow)"
                          opacity={0.94}
                        />
                        <text
                          x={0}
                          y={3.5}
                          textAnchor="middle"
                          fill={badgeTextFill}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="system-ui, sans-serif"
                        >
                          {badgeText}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Floating Dynamic Tooltip / Analytical Country Card */}
              {hoveredCountryData && tooltipPos && (
                <div
                  className="absolute pointer-events-none z-30 transition-transform duration-75"
                  style={{
                    left: `${Math.min(tooltipPos.x + 14, (mapContainerRef.current?.clientWidth || 600) - 270)}px`,
                    top: `${Math.max(10, Math.min(tooltipPos.y - 50, (mapContainerRef.current?.clientHeight || 400) - 180))}px`,
                    width: '260px'
                  }}
                >
                  <div className="bg-[#181114]/95 text-[#FAF6EE] backdrop-blur-md border border-[#D5C2AD]/30 rounded-xl p-3 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl leading-none">
                          {hoveredCountryData.meta.flag}
                        </span>
                        <div>
                          <div className="font-serif font-bold text-sm text-white leading-tight">
                            {hoveredCountryData.meta.germanName}
                          </div>
                          <div className="text-[10px] text-[#CDBEAF]">
                            {hoveredCountryData.meta.region}
                          </div>
                        </div>
                      </div>
                      {hoveredCountryData.meta.housesCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#8B1E2F] text-white">
                          {hoveredCountryData.meta.housesCount} {hoveredCountryData.meta.housesCount === 1 ? 'Haus' : 'Häuser'}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#D8CEBE] leading-relaxed space-y-1.5">
                      {/* Acta Concordiae Active Houses & Global Peace Index Indicator */}
                      <div className="space-y-1 py-1.5 bg-emerald-950/50 rounded-md px-2 border border-emerald-500/30">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-emerald-300 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#E5C170]" />
                            {hoveredActiveHousesCount} Aktive Friedenshäuser
                          </span>
                          {hoveredCountryGpi && (
                            <span className="text-[#F7D070] font-mono font-bold">
                              GPI #{hoveredCountryGpi.rank} ({hoveredCountryGpi.gpiScore})
                            </span>
                          )}
                        </div>
                        {hoveredCountryGpi && (
                          <div className="text-[9.5px] text-[#D8CEBE] flex items-center justify-between">
                            <span>Niveau: <strong className="text-white">{hoveredCountryGpi.peaceLevel}</strong></span>
                            <span className="text-emerald-400">{hoveredCountryGpi.conflictStatus}</span>
                          </div>
                        )}
                      </div>

                      {hoveredCountryData.meta.housesCount > 0 ? (
                        <>
                          {/* Heatmap Metrics in Density View */}
                          {mapViewMode === 'density' && (
                            <div className="space-y-1.5 py-1 bg-white/5 rounded-md px-2 border border-white/10 my-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-[#FBBF24] font-medium flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-[#F97316]" />
                                  {hoveredCountryData.meta.densityLabel}
                                </span>
                                <span className="text-white/80 font-semibold">
                                  Rang #{hoveredCountryData.meta.rank} in Europa
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex justify-between text-[9px] text-[#BCAEA0]">
                                  <span>Anteil am Europa-Archiv:</span>
                                  <span className="text-white font-medium">{hoveredCountryData.meta.percentOfTotal}% (von 335)</span>
                                </div>
                                <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] via-[#EF4444] to-[#991B1B]"
                                    style={{ width: `${Math.min(100, Math.max(8, (hoveredCountryData.meta.housesCount / 90) * 100))}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {hoveredCountryData.meta.notableHouses.length > 0 && (
                            <div className="text-[10.5px] mt-1">
                              <span className="text-[#BCAEA0]">Bedeutende Dynastien: </span>
                              <span className="text-white font-medium">{hoveredCountryData.meta.notableHouses.join(', ')}</span>
                            </div>
                          )}

                          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1 text-[10px] font-semibold text-[#F7D070]">
                            <span>
                              {selectedCountry === hoveredCountryData.meta.germanName
                                ? 'Klicken, um Filter aufzuheben'
                                : 'Klicken, um Häuser zu filtern →'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400 italic text-[11px] py-1">
                          Keine eigenständigen Adelsarchive in diesem Land erfasst.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Map Footer Bar: Dynamic Mode-Specific Legend */}
              <div className="absolute bottom-2.5 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6A5B4C] bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-[#D8CCBA]/80 shadow-xs pointer-events-auto">
                {mapViewMode === 'density' ? (
                  /* DENSITY HEATMAP LEGEND */
                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#3E3228] text-[10.5px] uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-[#B91C1C]" />
                      <span>Heatmap-Skala:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px]">
                      {DENSITY_TIERS.map((tier) => {
                        const countInTier = tierCounts[tier.id] || 0;
                        return (
                          <span key={tier.id} className="flex items-center gap-1.5" title={`${tier.description} (${countInTier} Länder)`}>
                            <span 
                              className="w-3 h-3 rounded-xs border shadow-2xs" 
                              style={{ backgroundColor: tier.color, borderColor: tier.borderColor }} 
                            />
                            <span className="font-medium text-[#2C221C]">{tier.label}</span>
                            <span className="text-[9.5px] text-[#7A6B5C]">({countInTier})</span>
                          </span>
                        );
                      })}
                      <span className="flex items-center gap-1.5 text-[9.5px] text-[#7A6B5C]">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#ECE5D8] border border-[#D5C9B5]" />
                        <span>Keine (0)</span>
                      </span>
                    </div>
                  </div>
                ) : mapViewMode === 'diplomatic_reach' ? (
                  /* DIPLOMATIC REACH LEGEND */
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#064E3B] text-[10.5px] uppercase tracking-wider">
                      <Share2 className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Diplomatie-Netzwerk:</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1.5 font-medium text-[#064E3B]">
                        <span className="w-3 h-3 rounded-xs bg-[#064E3B] border border-[#F59E0B]" />
                        <span>Hauptknoten (40+)</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-[#064E3B]">
                        <span className="w-3 h-3 rounded-xs bg-[#065F46] border border-[#34D399]" />
                        <span>Aktiver Partner (16+)</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-[#064E3B]">
                        <span className="w-4 h-1 bg-[#FBBF24] inline-block rounded-xs" />
                        <span>Gewichtete Bündnis-Pfade</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* STANDARD REGIONAL LEGEND */
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#3E3228] text-[10.5px] uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-[#6B5A4B]" />
                      <span>Kulturräume & Regionen:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px]">
                      {STANDARD_REGIONS.map((reg) => (
                        <span key={reg.name} className="flex items-center gap-1.5">
                          <span 
                            className="w-3 h-3 rounded-xs border shadow-2xs" 
                            style={{ backgroundColor: reg.color, borderColor: reg.borderColor }} 
                          />
                          <span className="font-medium text-[#2C221C]">{reg.shortLabel}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Hint */}
                <div className="flex items-center gap-1 text-[10px] text-[#7A6B5C] ml-auto">
                  <Info className="w-3 h-3 text-[#8B1E2F]" />
                  <span>Klick auf ein Land filtert das Verzeichnis</span>
                </div>
              </div>
            </div>

            {/* Quick Country Pills Bar: Horizontal Scrollable Selector */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#5C4D3E]">
                <span>Schnellauswahl nach Land ({documentedCountries.length} Länder erfasst):</span>
                {selectedCountry !== 'ALL' && (
                  <button
                    onClick={() => onSelectCountry('ALL')}
                    className="text-[#8B1E2F] hover:underline font-medium"
                  >
                    Filter aufheben
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  onClick={() => onSelectCountry('ALL')}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCountry === 'ALL'
                      ? 'bg-[#1A1215] text-white shadow-xs'
                      : 'bg-white hover:bg-[#EAE1D1] text-[#4A3D30] border border-[#D5C6B2]'
                  }`}
                >
                  Alle Länder (335)
                </button>

                {documentedCountries.map((c) => {
                  const isSelected = selectedCountry === c.germanName;
                  return (
                    <button
                      key={c.germanName}
                      id={`country-pill-${c.code.toLowerCase()}`}
                      onClick={() => handleCountryClick(c.germanName, c.housesCount)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-[#8B1E2F] text-white shadow-xs'
                          : 'bg-white hover:bg-[#EFE7D8] text-[#42362C] border border-[#D8CCBA]'
                      }`}
                      title={`${c.germanName}: Rang #${c.rank}, ${c.housesCount} Adelshäuser (${c.percentOfTotal}%)`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.germanName}</span>
                      <span 
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-[#6B1422] text-white' : 'bg-[#EAE2D3] text-[#554638]'
                        }`}
                      >
                        {c.housesCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
