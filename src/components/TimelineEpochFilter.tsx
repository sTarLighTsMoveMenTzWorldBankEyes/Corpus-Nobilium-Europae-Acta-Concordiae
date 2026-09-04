import React, { useState, useMemo } from 'react';
import { 
  History, 
  Calendar, 
  Clock, 
  Shield, 
  Sparkles, 
  Info, 
  ChevronRight, 
  RotateCcw, 
  Sliders, 
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { House, HistoricalEpochKey, DiplomaticStatus } from '../types';
import { 
  HISTORICAL_EPOCHS, 
  EPOCH_MAP, 
  HISTORICAL_DIPLOMATIC_MILESTONES, 
  calculateCenturyStats, 
  extractHouseStartYear,
  TimelineMilestone
} from '../utils/timelineUtils';

interface TimelineEpochFilterProps {
  houses: House[];
  selectedEpoch: HistoricalEpochKey;
  onSelectEpoch: (epoch: HistoricalEpochKey) => void;
  isCumulative: boolean;
  onToggleCumulative: (cumulative: boolean) => void;
  customYearRange: [number, number] | null;
  onSetCustomYearRange: (range: [number, number] | null) => void;
}

export const TimelineEpochFilter: React.FC<TimelineEpochFilterProps> = ({
  houses,
  selectedEpoch,
  onSelectEpoch,
  isCumulative,
  onToggleCumulative,
  customYearRange,
  onSetCustomYearRange
}) => {
  const [hoveredMilestone, setHoveredMilestone] = useState<TimelineMilestone | null>(null);
  const [hoveredCentury, setHoveredCentury] = useState<number | null>(null);
  const [showMilestones, setShowMilestones] = useState<boolean>(true);

  // Century statistics across all houses for the histogram visualization
  const centuryStats = useMemo(() => calculateCenturyStats(houses), [houses]);
  const maxCenturyCount = useMemo(() => Math.max(...centuryStats.map((c) => c.totalHouses), 1), [centuryStats]);

  // Current active epoch object
  const currentEpoch = EPOCH_MAP[selectedEpoch] || EPOCH_MAP.ALL;

  // Filtered houses according to the current timeline state to calculate diplomatic ratios
  const epochHouses = useMemo(() => {
    return houses.filter((h) => {
      const year = extractHouseStartYear(h.period);
      if (customYearRange) {
        return year >= customYearRange[0] && year <= customYearRange[1];
      }
      if (selectedEpoch === 'ALL') return true;
      const epoch = EPOCH_MAP[selectedEpoch];
      if (!epoch) return true;
      if (isCumulative) {
        return year <= epoch.endYear;
      }
      return year >= epoch.startYear && year <= epoch.endYear;
    });
  }, [houses, selectedEpoch, isCumulative, customYearRange]);

  // Diplomatic status counts for current timeline selection
  const diplomaticCounts = useMemo(() => {
    let active = 0;
    let consulting = 0;
    let observing = 0;

    for (const h of epochHouses) {
      const status: DiplomaticStatus = h.DiplomaticStatus || h.diplomaticStatus || 'Consulting';
      if (status === 'Active') active++;
      else if (status === 'Consulting') consulting++;
      else if (status === 'Observing') observing++;
    }

    const total = epochHouses.length || 1;
    return {
      active,
      consulting,
      observing,
      total: epochHouses.length,
      activePct: Math.round((active / total) * 100),
      consultingPct: Math.round((consulting / total) * 100),
      observingPct: Math.round((observing / total) * 100)
    };
  }, [epochHouses]);

  const handleResetTimeline = () => {
    onSelectEpoch('ALL');
    onSetCustomYearRange(null);
  };

  return (
    <div 
      id="timeline-epoch-filter"
      className="bg-[#FAF7F0] border border-[#DFCDB7] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 transition-all"
    >
      {/* Header section: Title and Mode Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFC9] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#3B1921] text-[#E5C170] text-xs font-semibold uppercase tracking-wider">
            <History className="w-3.5 h-3.5 text-[#E5C170]" />
            <span>Historischer Zeitstrahl & Friedensentwicklung</span>
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1A1215]">
            Epochen-Filter: Entstehung der diplomatischen Bindungen (Acta Concordiae)
          </h3>

          <p className="text-xs text-[#6B5A4B] leading-relaxed max-w-2xl">
            Erkunden Sie die Wurzeln der 360 europäischen Adelshäuser durch die Zeitalter.
            Sehen Sie, wie feudale Bündnisse, der Westfälische Friede (1648) und der Wiener Kongress (1815)
            das heutige europäische Friedensnetzwerk geformt haben.
          </p>
        </div>

        {/* Action Toggles: Cumulative mode & Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          {/* Cumulative growth toggle */}
          <button
            id="toggle-cumulative-mode"
            onClick={() => onToggleCumulative(!isCumulative)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isCumulative
                ? 'bg-[#8B1E2F] text-white border-[#8B1E2F] shadow-xs'
                : 'bg-white text-[#5C4C3E] border-[#D8CCBA] hover:bg-[#F4ECE1]'
            }`}
            title="Kumulativ: Zeigt alle bis zum Ende dieser Epoche gegründeten Häuser und visualisiert das stetige Anwachsen des Netzwerks"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isCumulative ? 'Kumulativ (bis Epoche)' : 'Epochen-Fokus'}</span>
          </button>

          {/* Reset button if filter is active */}
          {(selectedEpoch !== 'ALL' || customYearRange !== null) && (
            <button
              id="reset-timeline-btn"
              onClick={handleResetTimeline}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-[#8B1E2F] border border-[#8B1E2F]/40 hover:bg-[#8B1E2F]/10 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>
      </div>

      {/* Epoch Selection Cards / Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#7A6B5C]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8B1E2F] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Epochen wählen:</span>
          </span>
          <span>
            Ausgewählt: <strong className="text-[#1A1215]">{epochHouses.length} Häuser</strong> ({isCumulative ? 'kumulativ bis Epoche' : 'in der Epoche entstanden'})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {HISTORICAL_EPOCHS.map((epoch) => {
            const isSelected = selectedEpoch === epoch.key && customYearRange === null;
            // Calculate count for this specific epoch for badge
            const count = houses.filter((h) => {
              const y = extractHouseStartYear(h.period);
              if (epoch.key === 'ALL') return true;
              if (isCumulative) return y <= epoch.endYear;
              return y >= epoch.startYear && y <= epoch.endYear;
            }).length;

            return (
              <button
                key={epoch.key}
                id={`epoch-tab-${epoch.key.toLowerCase()}`}
                onClick={() => {
                  onSelectEpoch(epoch.key);
                  onSetCustomYearRange(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1A1215] text-[#FAF6EE] border-[#C5A059] ring-2 ring-[#C5A059]/40 shadow-md transform -translate-y-0.5'
                    : 'bg-white border-[#E0D5C3] text-[#3D2F24] hover:border-[#8B1E2F] hover:bg-[#FCF9F4]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-[#E5C170]' : 'text-[#8B1E2F]'}`}>
                      {epoch.shortLabel}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-[#3D252D] text-[#FAF6EE]' : 'bg-[#EFE8DD] text-[#5C4A3C]'
                    }`}>
                      {count}
                    </span>
                  </div>
                  <div className={`text-xs font-serif font-bold line-clamp-1 ${isSelected ? 'text-[#FAF6EE]' : 'text-[#1A1215]'}`}>
                    {epoch.key === 'ALL' ? 'Alle Zeiten' : `${epoch.startYear === 700 ? 'vor 1000' : epoch.startYear}–${epoch.endYear === 2026 ? 'heute' : epoch.endYear}`}
                  </div>
                </div>

                <div className="mt-2 text-[10px] opacity-75 line-clamp-1 italic">
                  {epoch.key === 'RENAISSANCE' ? 'Westfäl. Friede 1648' : epoch.key === 'MODERN' ? 'Wiener Kongress 1815' : epoch.subTitle.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Interactive Time Axis with Histogram and Historical Milestone Pins */}
      <div className="bg-white border border-[#DFCDB7] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1A1215] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#8B1E2F]" />
              <span>Verteilung der Dynastiegründungen über die Jahrhunderte</span>
            </span>
            <span className="text-[11px] text-[#8C7B6C]">
              (Klicken Sie auf ein Jahrhundert, um die Epoche direkt zu fokussieren)
            </span>
          </div>

          <button
            onClick={() => setShowMilestones(!showMilestones)}
            className="text-[11px] text-[#8B1E2F] hover:text-[#5E121E] underline self-start sm:self-auto cursor-pointer"
          >
            {showMilestones ? 'Meilensteine verbergen' : 'Historische Friedensmeilensteine anzeigen'}
          </button>
        </div>

        {/* Histogram Columns */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 pt-2 items-end h-28 border-b border-[#E8DFC9] pb-2">
          {centuryStats.map((c) => {
            const heightPct = Math.max(12, Math.round((c.totalHouses / maxCenturyCount) * 100));
            const isHovered = hoveredCentury === c.centuryNumber;
            const isWithinSelection = 
              customYearRange 
                ? c.startYear <= customYearRange[1] && c.endYear >= customYearRange[0]
                : selectedEpoch === 'ALL'
                ? true
                : isCumulative
                ? c.startYear <= (EPOCH_MAP[selectedEpoch]?.endYear || 2026)
                : c.startYear >= (EPOCH_MAP[selectedEpoch]?.startYear || 700) && c.endYear <= (EPOCH_MAP[selectedEpoch]?.endYear || 2026);

            return (
              <div
                key={c.centuryNumber}
                onMouseEnter={() => setHoveredCentury(c.centuryNumber)}
                onMouseLeave={() => setHoveredCentury(null)}
                onClick={() => {
                  onSetCustomYearRange([c.startYear, c.endYear]);
                }}
                className="group relative flex flex-col items-center h-full justify-end cursor-pointer"
                title={`${c.centuryLabel}: ${c.totalHouses} Häuser (${c.activeCount} Active, ${c.consultingCount} Consulting, ${c.observingCount} Observing)`}
              >
                {/* House count tooltip/badge on top of bar */}
                <span className={`text-[10px] font-bold mb-1 transition-all ${
                  isHovered ? 'text-[#8B1E2F] scale-110' : isWithinSelection ? 'text-[#2E2018]' : 'text-[#A39281]'
                }`}>
                  {c.totalHouses}
                </span>

                {/* The Bar with stacked diplomatic representation */}
                <div 
                  className={`w-full rounded-t-md transition-all duration-200 overflow-hidden flex flex-col-reverse shadow-2xs ${
                    isWithinSelection 
                      ? 'border-2 border-[#8B1E2F]/80' 
                      : 'opacity-35 hover:opacity-75 border border-stone-300'
                  }`}
                  style={{ height: `${heightPct}%` }}
                >
                  {/* Observing slice (slate) */}
                  <div 
                    style={{ height: `${c.totalHouses ? (c.observingCount / c.totalHouses) * 100 : 0}%` }}
                    className="bg-slate-400 w-full"
                    title={`Observing: ${c.observingCount}`}
                  />
                  {/* Consulting slice (amber) */}
                  <div 
                    style={{ height: `${c.totalHouses ? (c.consultingCount / c.totalHouses) * 100 : 0}%` }}
                    className="bg-amber-400 w-full"
                    title={`Consulting: ${c.consultingCount}`}
                  />
                  {/* Active slice (emerald) */}
                  <div 
                    style={{ height: `${c.totalHouses ? (c.activeCount / c.totalHouses) * 100 : 0}%` }}
                    className="bg-emerald-500 w-full"
                    title={`Active: ${c.activeCount}`}
                  />
                </div>

                {/* Century Label below */}
                <span className={`text-[10px] mt-1.5 font-sans truncate w-full text-center ${
                  isWithinSelection ? 'font-bold text-[#1A1215]' : 'text-[#8A7969]'
                }`}>
                  {c.centuryLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Historical Diplomatic Milestones Bar */}
        {showMilestones && (
          <div className="pt-1 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#7A6A5B]">
              <span className="font-semibold text-[#8B1E2F] uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Friedensverträge & Völkerrechts-Zäsuren:</span>
              </span>
              <span className="italic">Klicken Sie auf einen Meilenstein für Details</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {HISTORICAL_DIPLOMATIC_MILESTONES.map((m) => {
                const isEpochMatch = selectedEpoch === m.epochKey || selectedEpoch === 'ALL';
                return (
                  <button
                    key={m.year}
                    onClick={() => {
                      onSelectEpoch(m.epochKey);
                      setHoveredMilestone(m);
                    }}
                    onMouseEnter={() => setHoveredMilestone(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      hoveredMilestone?.year === m.year
                        ? 'bg-[#1A1215] text-[#E5C170] border-[#C5A059] shadow-xs'
                        : isEpochMatch
                        ? 'bg-[#FAF7F2] border-[#D8CCBA] text-[#3D2E24] hover:bg-[#F2ECE1] hover:border-[#8B1E2F]'
                        : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    <span className="font-semibold">{m.year}:</span>
                    <span>{m.label.split(':')[1]?.trim() || m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active / Hovered Milestone Detail Callout */}
            {hoveredMilestone && (
              <div className="bg-[#1A1215] text-[#FAF6EE] p-3 rounded-xl border border-[#C5A059] text-xs space-y-1 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[#E5C170] font-serif font-bold">
                  <span>{hoveredMilestone.label}</span>
                  <span className="text-[10px] uppercase font-sans font-semibold bg-[#3D252E] px-2 py-0.5 rounded text-[#FAF6EE]">
                    {hoveredMilestone.significance}
                  </span>
                </div>
                <p className="text-[#D8C6B3] text-[11px] leading-relaxed">
                  <strong className="text-[#FAF6EE]">Diplomatischer Einfluss auf Acta Concordiae:</strong> {hoveredMilestone.diplomaticImpact}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diplomatic Evolution in 'Acta Concordiae' Context Panel */}
      <div className="bg-[#FAF6F0] border border-[#DDCFBC] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          {/* Epoch Narrative & Historical Role */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1E2F] text-[#FAF6EE]">
                {currentEpoch.label}
              </span>
              {customYearRange && (
                <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-[#E0D5C3] text-[#2C211A]">
                  Fokus: {customYearRange[0]}–{customYearRange[1]}
                </span>
              )}
              {isCumulative && selectedEpoch !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Kumulativ bis {currentEpoch.endYear}
                </span>
              )}
            </div>

            <h4 className="font-serif font-bold text-base text-[#1A1215]">
              {currentEpoch.subTitle}
            </h4>

            <p className="text-xs text-[#524134] leading-relaxed">
              {currentEpoch.historicalSignificance}
            </p>

            <div className="bg-white p-3 rounded-lg border border-[#E0D5C3] space-y-1">
              <div className="text-[11px] font-bold text-[#8B1E2F] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Rolle im Friedenswerk der Acta Concordiae:</span>
              </div>
              <p className="text-xs text-[#2E231B] leading-relaxed italic">
                "{currentEpoch.diplomaticRoleConcordiae}"
              </p>
            </div>

            {/* Key historical treaties of this epoch */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#6B5A4B]">
              <span className="font-semibold text-[#8B1E2F]">Prägende Friedensverträge:</span>
              {currentEpoch.keyTreaties.map((treaty, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white border border-[#D8CCBA] text-[#3D2F24] font-medium"
                >
                  {treaty}
                </span>
              ))}
            </div>
          </div>

          {/* Diplomatic Status Breakdown Gauge */}
          <div className="w-full lg:w-80 bg-white border border-[#DFCDB7] rounded-xl p-4 space-y-3 shrink-0 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1215]">
                <Shield className="w-4 h-4 text-[#8B1E2F]" />
                <span>Diplomatischer Status im Zeitraum</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#8B1E2F]">
                {diplomaticCounts.total} Häuser
              </span>
            </div>

            {/* Split Progress Track */}
            <div className="space-y-1">
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  style={{ width: `${diplomaticCounts.activePct}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Active: ${diplomaticCounts.active} (${diplomaticCounts.activePct}%)`}
                />
                <div 
                  style={{ width: `${diplomaticCounts.consultingPct}%` }}
                  className="bg-amber-500 h-full transition-all duration-300"
                  title={`Consulting: ${diplomaticCounts.consulting} (${diplomaticCounts.consultingPct}%)`}
                />
                <div 
                  style={{ width: `${diplomaticCounts.observingPct}%` }}
                  className="bg-slate-400 h-full transition-all duration-300"
                  title={`Observing: ${diplomaticCounts.observing} (${diplomaticCounts.observingPct}%)`}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#8C7B6C] px-0.5">
                <span>🟢 Active {diplomaticCounts.activePct}%</span>
                <span>🟡 Consulting {diplomaticCounts.consultingPct}%</span>
                <span>⚪ Observing {diplomaticCounts.observingPct}%</span>
              </div>
            </div>

            {/* Status counts details */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-[#EBF7EE] p-2 rounded-lg border border-emerald-300">
                <div className="text-[10px] uppercase font-bold text-emerald-900">Active</div>
                <div className="text-base font-serif font-bold text-emerald-800">{diplomaticCounts.active}</div>
                <div className="text-[9px] text-emerald-700">Initiatoren</div>
              </div>

              <div className="bg-[#FEF7EC] p-2 rounded-lg border border-amber-300">
                <div className="text-[10px] uppercase font-bold text-amber-900">Consulting</div>
                <div className="text-base font-serif font-bold text-amber-800">{diplomaticCounts.consulting}</div>
                <div className="text-[9px] text-amber-700">Archive & Rat</div>
              </div>

              <div className="bg-[#F1F5F9] p-2 rounded-lg border border-slate-300">
                <div className="text-[10px] uppercase font-bold text-slate-900">Observing</div>
                <div className="text-base font-serif font-bold text-slate-800">{diplomaticCounts.observing}</div>
                <div className="text-[9px] text-slate-700">Beobachter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
