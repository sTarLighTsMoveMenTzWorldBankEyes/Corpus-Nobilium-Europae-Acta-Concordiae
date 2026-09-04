import React from 'react';
import { Search, X, LayoutGrid, Table as TableIcon, Filter, Mail, Sparkles, Shield, Clock, History } from 'lucide-react';
import { Region, HouseType, DiplomaticStatus, HistoricalEpochKey } from '../types';
import { regionsList, typesList, countriesList, diplomaticStatusesList } from '../data';
import { COUNTRY_FLAGS } from './EuropeMap/europeMapData';
import { HISTORICAL_EPOCHS } from '../utils/timelineUtils';

interface HouseFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegion: Region | 'ALL';
  onRegionChange: (r: Region | 'ALL') => void;
  selectedCountry: string;
  onCountryChange: (c: string) => void;
  selectedType: HouseType | 'ALL';
  onTypeChange: (t: HouseType | 'ALL') => void;
  selectedDiplomaticStatus?: DiplomaticStatus | 'ALL';
  onDiplomaticStatusChange?: (s: DiplomaticStatus | 'ALL') => void;
  selectedEpoch?: HistoricalEpochKey;
  onEpochChange?: (e: HistoricalEpochKey) => void;
  isTimelineOpen?: boolean;
  onToggleTimeline?: () => void;
  viewMode: 'table' | 'cards' | 'mosaic';
  onViewModeChange: (m: 'table' | 'cards' | 'mosaic') => void;
  onResetFilters: () => void;
  onOpenEmailDispatcher?: () => void;
  totalFiltered: number;
  totalCount: number;
}

export const HouseFilters: React.FC<HouseFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedCountry,
  onCountryChange,
  selectedType,
  onTypeChange,
  selectedDiplomaticStatus = 'ALL',
  onDiplomaticStatusChange,
  selectedEpoch = 'ALL',
  onEpochChange,
  isTimelineOpen = false,
  onToggleTimeline,
  viewMode,
  onViewModeChange,
  onResetFilters,
  onOpenEmailDispatcher,
  totalFiltered,
  totalCount
}) => {
  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    selectedRegion !== 'ALL' ||
    selectedCountry !== 'ALL' ||
    selectedType !== 'ALL' ||
    selectedDiplomaticStatus !== 'ALL' ||
    selectedEpoch !== 'ALL';

  return (
    <div className="bg-[#FAF7F0] border-b border-[#E3D9C9] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top bar: Search bar + View mode toggles */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main search field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7968]">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="house-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Dynastie, Residenz, Persönlichkeit, Epoche oder Wappen suchen (z. B. Habsburg, Versailles, Medici, Romanow)..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#D8CCBA] rounded-lg text-sm text-[#241F1A] placeholder-[#9E9080] focus:outline-none focus:ring-2 focus:ring-[#7E1E2D]/40 focus:border-[#7E1E2D] shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A7968] hover:text-[#241F1A]"
                title="Suchbegriff löschen"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-[#7A6B5C] mr-1 hidden sm:inline">Ansicht:</span>
            <div className="inline-flex rounded-lg border border-[#D8CCBA] bg-white p-1 shadow-sm">
              <button
                id="view-mode-table-btn"
                onClick={() => onViewModeChange('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#1A1215] text-[#FAF6EE] shadow-sm'
                    : 'text-[#615344] hover:text-[#1A1215]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabelle</span>
              </button>
              <button
                id="view-mode-cards-btn"
                onClick={() => onViewModeChange('cards')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#1A1215] text-[#FAF6EE] shadow-sm'
                    : 'text-[#615344] hover:text-[#1A1215]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Karten</span>
              </button>
              <button
                id="view-mode-mosaic-btn"
                onClick={() => onViewModeChange('mosaic')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'mosaic'
                    ? 'bg-[#1A1215] text-[#FAF6EE] shadow-sm font-semibold'
                    : 'text-[#615344] hover:text-[#1A1215]'
                }`}
                title="Wappen-Mosaik / Heraldry Gallery"
              >
                <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Wappen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar: Dropdown filters + Status indicator */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#6D5D4E] font-medium mr-1">
            <Filter className="w-3.5 h-3.5 text-[#8B1E2F]" />
            <span>Kriterien:</span>
          </div>

          {/* Region filter */}
          <select
            id="filter-region-select"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value as Region | 'ALL')}
            className="px-2.5 py-1.5 bg-white border border-[#D8CCBA] rounded-md text-xs text-[#332A22] focus:outline-none focus:ring-1 focus:ring-[#7E1E2D]"
          >
            <option value="ALL">Alle Regionen</option>
            {regionsList.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Country filter */}
          <select
            id="filter-country-select"
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className={`px-2.5 py-1.5 rounded-md text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#7E1E2D] ${
              selectedCountry !== 'ALL'
                ? 'bg-[#F9EFEF] border border-[#C88A96] text-[#7E1E2D] font-medium'
                : 'bg-white border border-[#D8CCBA] text-[#332A22]'
            }`}
          >
            <option value="ALL">🗺️ Alle Länder ({countriesList.length})</option>
            {countriesList.map((c) => (
              <option key={c} value={c}>
                {COUNTRY_FLAGS[c] ? `${COUNTRY_FLAGS[c]} ${c}` : c}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            id="filter-type-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as HouseType | 'ALL')}
            className="px-2.5 py-1.5 bg-white border border-[#D8CCBA] rounded-md text-xs text-[#332A22] focus:outline-none focus:ring-1 focus:ring-[#7E1E2D]"
          >
            <option value="ALL">Alle Rangstufen</option>
            {typesList.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Diplomatic Status filter */}
          {onDiplomaticStatusChange && (
            <select
              id="filter-diplomatic-status-select"
              value={selectedDiplomaticStatus}
              onChange={(e) => onDiplomaticStatusChange(e.target.value as DiplomaticStatus | 'ALL')}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#7E1E2D] ${
                selectedDiplomaticStatus !== 'ALL'
                  ? 'bg-[#EBF7EE] border border-emerald-400 text-emerald-900 font-semibold'
                  : 'bg-white border border-[#D8CCBA] text-[#332A22]'
              }`}
            >
              <option value="ALL">🕊️ Acta Concordiae Status (Alle)</option>
              <option value="Active">🟢 Active (Aktiv)</option>
              <option value="Consulting">🟡 Consulting (Beratend)</option>
              <option value="Observing">⚪ Observing (Beobachtend)</option>
            </select>
          )}

          {/* Historical Epoch filter */}
          {onEpochChange && (
            <select
              id="filter-epoch-select"
              value={selectedEpoch}
              onChange={(e) => onEpochChange(e.target.value as HistoricalEpochKey)}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#7E1E2D] ${
                selectedEpoch !== 'ALL'
                  ? 'bg-[#FFFBEB] border border-amber-500 text-amber-950 font-bold'
                  : 'bg-white border border-[#D8CCBA] text-[#332A22]'
              }`}
            >
              <option value="ALL">⏳ Alle Epochen (750–heute)</option>
              <option value="MIDDLE_AGES">🏰 Mittelalter (750–1499)</option>
              <option value="HIGH_MIDDLE_AGES">⚔️ Hochmittelalter (vor 1250)</option>
              <option value="LATE_MIDDLE_AGES">📜 Spätmittelalter (1250–1499)</option>
              <option value="RENAISSANCE">🕊️ Renaissance & Westfäl. Friede (1500–1648)</option>
              <option value="BAROQUE_ENLIGHTENMENT">👑 Barock & Aufklärung (1649–1789)</option>
              <option value="MODERN">🏛️ Neuzeit & Wiener Kongress (ab 1789)</option>
            </select>
          )}

          {/* Interactive Timeline Visualizer Toggle Button */}
          {onToggleTimeline && (
            <button
              id="toggle-timeline-panel-btn"
              onClick={onToggleTimeline}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                isTimelineOpen
                  ? 'bg-[#3B1921] text-[#E5C170] border-[#C5A059] shadow-xs'
                  : selectedEpoch !== 'ALL'
                  ? 'bg-[#FDF6E2] text-[#8B1E2F] border-amber-400 hover:bg-[#F9ECC7]'
                  : 'bg-white text-[#4A3B2C] border-[#D8CCBA] hover:bg-[#F2ECE1] hover:border-[#8B1E2F]'
              }`}
              title="Interaktiven Zeitstrahl mit Epochen-Visualisierung und Friedensmeilensteinen ein-/ausblenden"
            >
              <History className="w-3.5 h-3.5" />
              <span>Zeitstrahl-Filter</span>
              {selectedEpoch !== 'ALL' && (
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-0.5 animate-pulse" />
              )}
            </button>
          )}

          {/* Reset Filters button */}
          {isAnyFilterActive && (
            <button
              id="reset-filters-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#7E1E2D] hover:text-[#55101C] bg-[#F4EBEB] hover:bg-[#EBDFDF] rounded-md font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Filter zurücksetzen</span>
            </button>
          )}

          {/* Results counter & Email Batch Action */}
          <div className="ml-auto flex items-center gap-2.5">
            {onOpenEmailDispatcher && (
              <button
                id="filter-email-dispatch-btn"
                onClick={onOpenEmailDispatcher}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B1E2F] hover:bg-[#6D1623] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title={`E-Mail-Bündel & zeitverzögertes Kontaktieren für ${totalFiltered} Häuser öffnen`}
              >
                <Mail className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>E-Mail-Bündel ({totalFiltered})</span>
              </button>
            )}

            <div className="text-xs text-[#6B5C4E] font-medium hidden sm:block">
              <span className="font-semibold text-[#1A1215]">{totalFiltered}</span> von{' '}
              <span>{totalCount}</span> Häusern
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
