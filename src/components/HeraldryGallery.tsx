import React, { useState, useMemo, useRef } from 'react';
import { 
  Shield, 
  Sparkles, 
  Search, 
  X, 
  Filter, 
  Layers, 
  Grid3X3, 
  LayoutGrid, 
  SlidersHorizontal,
  Mail,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { House, DiplomaticStatus, DIPLOMATIC_STATUS_MAP, Region } from '../types';
import { HeraldicShield } from './HeraldicShield';
import { COUNTRY_FLAGS } from './EuropeMap/europeMapData';
import { BesaEidBadge } from './BesaEidBadge';

interface HeraldryGalleryProps {
  houses: House[];
  onSelectHouse: (house: House) => void;
  onContactHouse?: (house: House) => void;
  onBackToDirectory?: () => void;
}

type MosaicDensity = 'compact' | 'medium' | 'large';

export const HeraldryGallery: React.FC<HeraldryGalleryProps> = ({
  houses,
  onSelectHouse,
  onContactHouse,
  onBackToDirectory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DiplomaticStatus | 'ALL'>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('ALL');
  const [selectedChargeTag, setSelectedChargeTag] = useState<string>('ALL');
  const [density, setDensity] = useState<MosaicDensity>('medium');
  const [highlightStatusAura, setHighlightStatusAura] = useState<boolean>(true);

  // Hover state for interactive mosaic tooltip
  const [hoveredHouse, setHoveredHouse] = useState<House | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Quick charge tags for heraldic exploration
  const chargeTags = [
    { label: 'Alle Motive', value: 'ALL' },
    { label: '🦅 Adler & Greife', value: 'adler' },
    { label: '🦁 Löwen & Leoparden', value: 'löwe' },
    { label: '⚜️ Lilien (Fleur-de-lis)', value: 'lilie' },
    { label: '👑 Kronen', value: 'krone' },
    { label: '✝️ Kreuze', value: 'kreuz' },
    { label: '🌹 Rosen', value: 'rose' },
    { label: '🦌 Hirsche & Geweihe', value: 'hirsch' },
    { label: '⭐ Sterne & Monde', value: 'stern' },
    { label: '🏰 Burgen & Türme', value: 'turm' },
    { label: '⚔️ Schwerter & Lanzen', value: 'schwert' },
    { label: '🔷 Rauten & Wecken', value: 'wecken' }
  ];

  // Filtered houses
  const filteredHouses = useMemo(() => {
    return houses.filter((h) => {
      // Diplomatic status filter
      if (selectedStatus !== 'ALL') {
        const dipStatus = h.DiplomaticStatus || h.diplomaticStatus || 'Consulting';
        if (dipStatus !== selectedStatus) return false;
      }

      // Region filter
      if (selectedRegion !== 'ALL' && h.region !== selectedRegion) {
        return false;
      }

      // Charge tag filter
      if (selectedChargeTag !== 'ALL') {
        const motifLower = (h.crestMotif || '').toLowerCase();
        if (!motifLower.includes(selectedChargeTag.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = h.name.toLowerCase().includes(q);
        const matchesMotif = (h.crestMotif || '').toLowerCase().includes(q);
        const matchesCountry = h.country.toLowerCase().includes(q);
        const matchesSeat = h.seat.toLowerCase().includes(q);
        const dipStatus = (h.DiplomaticStatus || h.diplomaticStatus || '').toLowerCase();
        const matchesDip = dipStatus.includes(q);

        if (!matchesName && !matchesMotif && !matchesCountry && !matchesSeat && !matchesDip) {
          return false;
        }
      }

      return true;
    });
  }, [houses, selectedStatus, selectedRegion, selectedChargeTag, searchQuery]);

  // Status breakdown counts
  const statusStats = useMemo(() => {
    let active = 0;
    let consulting = 0;
    let observing = 0;

    for (const h of houses) {
      const status = h.DiplomaticStatus || h.diplomaticStatus || 'Consulting';
      if (status === 'Active') active++;
      else if (status === 'Consulting') consulting++;
      else if (status === 'Observing') observing++;
    }

    return { active, consulting, observing, total: houses.length };
  }, [houses]);

  // Handle mouse move over a tile to update tooltip position relative to container
  const handleMouseEnterTile = (house: House, e: React.MouseEvent) => {
    setHoveredHouse(house);
    updateTooltipPos(e);
  };

  const handleMouseMoveTile = (e: React.MouseEvent) => {
    updateTooltipPos(e);
  };

  const handleMouseLeaveTile = () => {
    setHoveredHouse(null);
    setTooltipPos(null);
  };

  const updateTooltipPos = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltipPos({ x, y });
  };

  const isFilterActive = 
    searchQuery.trim() !== '' || 
    selectedStatus !== 'ALL' || 
    selectedRegion !== 'ALL' || 
    selectedChargeTag !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedRegion('ALL');
    setSelectedChargeTag('ALL');
  };

  return (
    <div 
      id="heraldry-gallery-view" 
      ref={containerRef}
      className="relative space-y-6 select-none"
    >
      {/* Hero Banner with European Heraldic Identity */}
      <div className="bg-gradient-to-br from-[#1E1216] via-[#2A161E] to-[#170E12] text-[#FAF6EE] rounded-2xl p-6 sm:p-8 border border-[#52333B] shadow-xl relative overflow-hidden">
        {/* Subtle decorative gold fleur-de-lis / background accents */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D1E27] border border-[#C5A059]/40 text-[#E5C170] text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#E5C170]" />
              <span>Corpus Nobilium Europae • Wappen-Mosaik</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#FAF6EE] tracking-tight">
              Heraldry Gallery: Die Wappen der europäischen Häuser
            </h1>

            <p className="text-sm text-[#D1C2B0] leading-relaxed">
              Interaktives Mosaik der 360 Wappenmotive und Blasonierungen. Bewegen Sie den Mauszeiger über ein Wappen, 
              um den <span className="text-[#FAF6EE] font-semibold">Haussitz, Namen</span> und den aktuellen{' '}
              <span className="text-[#4ADE80] font-semibold">DiplomaticStatus</span> im Friedenswerk der <em>Acta Concordiae</em> einzusehen.
            </p>
          </div>

          {/* Diplomatic Status Quick Counts & Overview */}
          <div className="grid grid-cols-3 gap-2.5 bg-[#140C0F]/90 backdrop-blur-xs p-3.5 rounded-xl border border-[#482A33] text-center shrink-0">
            <button
              onClick={() => setSelectedStatus(selectedStatus === 'Active' ? 'ALL' : 'Active')}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                selectedStatus === 'Active'
                  ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/50'
                  : 'bg-[#1C1216] border-emerald-800/40 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </div>
              <div className="text-lg font-serif font-bold text-emerald-200 mt-0.5">
                {statusStats.active}
              </div>
            </button>

            <button
              onClick={() => setSelectedStatus(selectedStatus === 'Consulting' ? 'ALL' : 'Consulting')}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                selectedStatus === 'Consulting'
                  ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-500/50'
                  : 'bg-[#1C1216] border-amber-800/40 hover:border-amber-500'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Consulting</span>
              </div>
              <div className="text-lg font-serif font-bold text-amber-200 mt-0.5">
                {statusStats.consulting}
              </div>
            </button>

            <button
              onClick={() => setSelectedStatus(selectedStatus === 'Observing' ? 'ALL' : 'Observing')}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                selectedStatus === 'Observing'
                  ? 'bg-stone-900 border-stone-400 ring-2 ring-stone-500/50'
                  : 'bg-[#1C1216] border-stone-700/40 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                <span>Observing</span>
              </div>
              <div className="text-lg font-serif font-bold text-stone-200 mt-0.5">
                {statusStats.observing}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Control & Filter Toolbar */}
      <div className="bg-[#FAF7F0] border border-[#E3D9C9] rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7B6B]" />
            <input
              id="heraldry-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wappenmotiv, Hausname oder Wappenfigur suchen (z.B. Löwe, Doppeladler, Lilie)..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#D8CCBA] rounded-lg text-xs text-[#2B231D] placeholder-[#948474] focus:outline-none focus:ring-1 focus:ring-[#8B1E2F] focus:border-[#8B1E2F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#948474] hover:text-[#2B231D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Density and Display Toggles */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Status Aura Glow Toggle */}
            <button
              onClick={() => setHighlightStatusAura(!highlightStatusAura)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                highlightStatusAura
                  ? 'bg-[#EBF7EE] border-emerald-400 text-emerald-900 font-semibold'
                  : 'bg-white border-[#D8CCBA] text-[#5C4C3E] hover:bg-[#F4ECE1]'
              }`}
              title="Aura-Ringe um Wappenschilde entsprechend dem diplomatischen Status (Grün: Active, Bernstein: Consulting, Schiefer: Observing)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Status-Aura</span>
              <span className={`w-2 h-2 rounded-full ${highlightStatusAura ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            </button>

            {/* Density Selector */}
            <div className="inline-flex items-center bg-white border border-[#D8CCBA] rounded-lg p-0.5 text-xs text-[#5C4C3E]">
              <button
                onClick={() => setDensity('compact')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  density === 'compact' ? 'bg-[#8B1E2F] text-white font-medium shadow-2xs' : 'hover:bg-[#F5ECE0]'
                }`}
                title="Kompakter Wappenteppich (Maximale Wappendichte)"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Teppich</span>
              </button>

              <button
                onClick={() => setDensity('medium')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  density === 'medium' ? 'bg-[#8B1E2F] text-white font-medium shadow-2xs' : 'hover:bg-[#F5ECE0]'
                }`}
                title="Klassisches Wappen-Mosaik mit Haustitel"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mosaik</span>
              </button>

              <button
                onClick={() => setDensity('large')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  density === 'large' ? 'bg-[#8B1E2F] text-white font-medium shadow-2xs' : 'hover:bg-[#F5ECE0]'
                }`}
                title="Pracht-Wappengalerie mit vergrößerter Ansicht"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pracht</span>
              </button>
            </div>

            {onBackToDirectory && (
              <button
                onClick={onBackToDirectory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2EAE0] hover:bg-[#EAE0D3] text-[#3D2C1F] border border-[#D8CCBA] rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Zurück zum Archiv</span>
              </button>
            )}
          </div>
        </div>

        {/* Heraldic Charge Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin text-xs">
          <div className="text-[#786A5D] font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#8B1E2F]" />
            <span>Motive:</span>
          </div>

          {chargeTags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => setSelectedChargeTag(tag.value)}
              className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedChargeTag === tag.value
                  ? 'bg-[#8B1E2F] text-[#FAF6EE] font-semibold shadow-2xs'
                  : 'bg-white border border-[#D8CCBA] text-[#4A3C31] hover:bg-[#F0E6D8]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Status indicator bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8DFC9] text-xs text-[#6A5A4D]">
          <div className="flex items-center gap-2">
            <span>
              Angezeigt: <strong className="text-[#1A1215]">{filteredHouses.length}</strong> von {houses.length} Häusern
            </span>
            {selectedStatus !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E8DFC9] text-[#2E231B] font-medium">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('ALL')} className="hover:text-red-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedChargeTag !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E8DFC9] text-[#2E231B] font-medium">
                Motiv: {chargeTags.find((t) => t.value === selectedChargeTag)?.label}
                <button onClick={() => setSelectedChargeTag('ALL')} className="hover:text-red-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#8B1E2F] hover:text-[#5E121E] underline font-medium cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      {/* Primary Interactive Mosaic Grid */}
      <div className="bg-[#FAF7F2] border border-[#E0D5C3] rounded-2xl p-4 sm:p-6 shadow-sm min-h-[480px]">
        {filteredHouses.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Shield className="w-12 h-12 text-[#C5A059] mx-auto opacity-60" />
            <h3 className="text-base font-serif font-bold text-[#1A1215]">
              Keine Wappen gefunden
            </h3>
            <p className="text-xs text-[#7A6B5C] max-w-sm mx-auto">
              Für Ihre aktuellen Such- oder Filterkriterien konnten keine Wappenmotive ermittelt werden.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-1.5 bg-[#8B1E2F] text-white rounded-md text-xs font-medium hover:bg-[#6E1624] transition-colors cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-3 sm:gap-4 transition-all ${
              density === 'compact'
                ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12'
                : density === 'medium'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {filteredHouses.map((house) => {
              const diplomaticStatus: DiplomaticStatus = 
                house.DiplomaticStatus || house.diplomaticStatus || 'Consulting';
              const statusConfig = DIPLOMATIC_STATUS_MAP[diplomaticStatus] || DIPLOMATIC_STATUS_MAP.Consulting;
              const flag = COUNTRY_FLAGS[house.country] || '🏰';
              const isHovered = hoveredHouse?.id === house.id;

              return (
                <div
                  key={house.id}
                  id={`crest-mosaic-tile-${house.id}`}
                  onClick={() => onSelectHouse(house)}
                  onMouseEnter={(e) => handleMouseEnterTile(house, e)}
                  onMouseMove={handleMouseMoveTile}
                  onMouseLeave={handleMouseLeaveTile}
                  className={`group relative rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-between text-center ${
                    density === 'compact'
                      ? 'p-2 bg-white/80 hover:bg-white border border-[#E5DBCA] hover:border-[#C5A059] hover:shadow-lg hover:z-20 hover:-translate-y-1'
                      : density === 'medium'
                      ? 'p-3.5 bg-white border border-[#E3D8C6] hover:border-[#8B1E2F] hover:shadow-xl hover:z-20 hover:-translate-y-1'
                      : 'p-4 bg-white border border-[#DDCFBC] hover:border-[#8B1E2F] hover:shadow-xl hover:z-20 hover:-translate-y-1'
                  } ${
                    isHovered ? 'ring-2 ring-[#C5A059] shadow-xl' : ''
                  }`}
                >
                  {/* Diplomatic Status Indicator Dot at Top Right */}
                  <div 
                    className="absolute top-2 right-2 flex items-center gap-1"
                    title={`Diplomatic Status: ${statusConfig.labelEn} (${statusConfig.labelDe})`}
                  >
                    <span 
                      className={`w-2.5 h-2.5 rounded-full ${statusConfig.dotClass} shadow-2xs ring-1 ring-white`} 
                    />
                  </div>

                  {/* Country Flag & Region Tag for Medium & Large */}
                  {density !== 'compact' && (
                    <div className="w-full flex items-center justify-between text-[11px] text-[#7A6B5C] mb-2 px-1">
                      <span className="font-normal" title={house.country}>
                        {flag} {house.country.slice(0, 14)}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#8B1E2F]">
                        {house.region.includes('DACH') ? 'DACH' : house.region.includes('Frankreich') ? 'West' : house.region.includes('Italien') ? 'Süd' : 'Ost'}
                      </span>
                    </div>
                  )}

                  {/* The Heraldic Shield Visual */}
                  <div className="my-1.5 flex items-center justify-center">
                    <HeraldicShield
                      motif={house.crestMotif}
                      houseName={house.name}
                      diplomaticStatus={diplomaticStatus}
                      showStatusBorder={highlightStatusAura}
                      size={density === 'compact' ? 'sm' : density === 'medium' ? 'md' : 'lg'}
                    />
                  </div>

                  {/* House Title and Status for Medium & Large modes */}
                  {density !== 'compact' && (
                    <div className="w-full mt-2 pt-2 border-t border-[#F0E6D8] space-y-1">
                      <h4 className="font-serif font-bold text-xs text-[#1A1215] leading-snug line-clamp-2 group-hover:text-[#8B1E2F] transition-colors">
                        {house.name}
                      </h4>

                      {/* Explicit Diplomatic Status Badge on tile */}
                      <div className="pt-0.5 flex items-center justify-center">
                        <span 
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                          <span>{statusConfig.labelEn}</span>
                        </span>
                      </div>

                      {/* Blazon / Motif excerpt for Large mode */}
                      {density === 'large' && (
                        <p className="text-[11px] text-[#6A594A] line-clamp-2 italic pt-1 leading-relaxed">
                          "{house.crestMotif}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Compact Mode Title */}
                  {density === 'compact' && (
                    <div className="w-full mt-1">
                      <span className="text-[10px] font-medium text-[#42352B] line-clamp-1 group-hover:text-[#8B1E2F]">
                        {house.name.replace('Haus ', '')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Tooltip showing House Name and current DiplomaticStatus on hover */}
      {hoveredHouse && tooltipPos && (
        <div
          id="heraldry-interactive-hover-tooltip"
          className="pointer-events-none fixed z-50 bg-[#1A1215]/95 text-[#FAF6EE] backdrop-blur-md p-4 rounded-xl border border-[#C5A059] shadow-2xl w-80 max-w-[90vw] transition-all duration-75"
          style={{
            // Keep tooltip near cursor while ensuring it doesn't overflow viewport
            left: `${Math.min(window.innerWidth - 340, Math.max(16, tooltipPos.x + (containerRef.current?.getBoundingClientRect().left || 0) + 16))}px`,
            top: `${Math.min(window.innerHeight - 240, Math.max(16, tooltipPos.y + (containerRef.current?.getBoundingClientRect().top || 0) - 20))}px`
          }}
        >
          {/* Header with Country & Region */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#D1C2B0] border-b border-[#3D252C] pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 font-medium">
              <span>{COUNTRY_FLAGS[hoveredHouse.country] || '🏰'}</span>
              <span>{hoveredHouse.country}</span>
              <span>•</span>
              <span>{hoveredHouse.seat}</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-[#C5A059] bg-[#2E181F] px-1.5 py-0.5 rounded">
              {hoveredHouse.type}
            </span>
          </div>

          {/* House Name */}
          <div className="space-y-1 mb-3">
            <h3 className="font-serif font-bold text-base text-[#FAF6EE] leading-snug">
              {hoveredHouse.name}
            </h3>
            {hoveredHouse.altNames && hoveredHouse.altNames.length > 0 && (
              <p className="text-[11px] text-[#A89887] italic line-clamp-1">
                auch: {hoveredHouse.altNames.join(', ')}
              </p>
            )}
          </div>

          {/* Current DiplomaticStatus Section (Key Requirement) */}
          {(() => {
            const dipStatus: DiplomaticStatus = 
              hoveredHouse.DiplomaticStatus || hoveredHouse.diplomaticStatus || 'Consulting';
            const statusConfig = DIPLOMATIC_STATUS_MAP[dipStatus] || DIPLOMATIC_STATUS_MAP.Consulting;

            return (
              <div 
                id="tooltip-diplomatic-status-section"
                className="bg-[#26151B] p-2.5 rounded-lg border border-[#482833] space-y-1.5 mb-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#C5A059] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>Diplomatic Status:</span>
                  </span>

                  <span 
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${
                      dipStatus === 'Active'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : dipStatus === 'Consulting'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : 'bg-stone-900 text-stone-300 border-stone-600/50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
                    <span>{statusConfig.labelEn} ({statusConfig.labelDe})</span>
                  </span>
                </div>

                <div className="text-[11px] text-[#D8C7B5] leading-tight">
                  <strong className="text-[#FAF6EE]">{statusConfig.shortDesc}:</strong> {statusConfig.roleDescription.slice(0, 95)}...
                </div>
              </div>
            );
          })()}

          {/* Crest Motif / Blazon */}
          <div className="space-y-1 mb-3 text-xs">
            <div className="text-[10px] uppercase tracking-wider text-[#A89887] font-semibold flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#C5A059]" />
              <span>Wappenmotiv / Blasonierung:</span>
            </div>
            <div className="text-[11px] text-[#E5D7C5] italic bg-[#140C0F] p-2 rounded border border-[#2D161D] leading-relaxed">
              "{hoveredHouse.crestMotif}"
            </div>
          </div>

          {/* Click hint footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#3D252C] text-[10px] text-[#A89887]">
            <span>Klicken zum Öffnen des Archivblatts</span>
            <ChevronRight className="w-3 h-3 text-[#C5A059]" />
          </div>
        </div>
      )}

      {/* Persistent Active Spotlight Bar at bottom for instant reference */}
      {hoveredHouse && (
        <div 
          id="heraldry-spotlight-bar"
          className="sticky bottom-4 z-40 bg-[#1A1215] text-[#FAF6EE] border-2 border-[#C5A059] rounded-xl p-3.5 sm:p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 bg-[#28151D] p-1.5 rounded-lg border border-[#482833]">
              <HeraldicShield
                motif={hoveredHouse.crestMotif}
                houseName={hoveredHouse.name}
                diplomaticStatus={hoveredHouse.DiplomaticStatus || hoveredHouse.diplomaticStatus || 'Consulting'}
                size="sm"
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-[#FAF6EE] truncate">
                  {hoveredHouse.name}
                </h4>
                <span className="text-xs text-[#C5A059]">
                  {COUNTRY_FLAGS[hoveredHouse.country] || '🏰'} {hoveredHouse.country} ({hoveredHouse.seat})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {(() => {
                  const dipStatus: DiplomaticStatus = 
                    hoveredHouse.DiplomaticStatus || hoveredHouse.diplomaticStatus || 'Consulting';
                  const statusConfig = DIPLOMATIC_STATUS_MAP[dipStatus] || DIPLOMATIC_STATUS_MAP.Consulting;
                  return (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-emerald-300">
                      <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
                      <span>DiplomaticStatus: <strong>{statusConfig.labelEn}</strong> ({statusConfig.labelDe})</span>
                    </span>
                  );
                })()}
                <span className="text-[#887869] hidden md:inline">•</span>
                <span className="text-xs text-[#D8C7B5] italic truncate max-w-md hidden md:inline">
                  "{hoveredHouse.crestMotif}"
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <BesaEidBadge
              house={hoveredHouse}
              size="sm"
              variant="card-stamp"
            />

            {onContactHouse && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onContactHouse(hoveredHouse);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B1E2F] hover:bg-[#A32438] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                title="Diplomatisches Anschreiben vorbereiten"
              >
                <Mail className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>Anschreiben</span>
              </button>
            )}

            <button
              onClick={() => onSelectHouse(hoveredHouse)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#1A1215] rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Archivblatt</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
