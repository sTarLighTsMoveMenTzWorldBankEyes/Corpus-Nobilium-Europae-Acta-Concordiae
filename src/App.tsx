import React, { useState, useMemo, useRef } from 'react';
import { allHouses, getDirectoryStats, totalCount } from './data';
import { House, Region, HouseType, DiplomaticStatus, HistoricalEpochKey } from './types';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { EuropeMap } from './components/EuropeMap/EuropeMap';
import { HouseFilters } from './components/HouseFilters';
import { TimelineEpochFilter } from './components/TimelineEpochFilter';
import { HouseTable } from './components/HouseTable';
import { HouseCard } from './components/HouseCard';
import { HouseDetailModal } from './components/HouseDetailModal';
import { MasterPlanView } from './components/MasterPlanView';
import { HeraldryGallery } from './components/HeraldryGallery';
import { EmailOutreachModal } from './components/EmailOutreachModal';
import { SpiritualHousesAndEidModal } from './components/SpiritualHousesAndEidModal';
import { EidComplianceDashboard } from './components/EidComplianceDashboard';
import { Footer } from './components/Footer';
import { GlowSettingsProvider } from './components/GlowSettingsContext';
import { GlowSettingsPanel } from './components/GlowSettingsPanel';
import { exportToCsv, exportToJson } from './utils/export';
import { isHouseInEpoch } from './utils/timelineUtils';

export default function App() {
  const stats = useMemo(() => getDirectoryStats(), []);

  const [mainTab, setMainTab] = useState<'directory' | 'masterplan' | 'heraldry' | 'eid_compliance'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<HouseType | 'ALL'>('ALL');
  const [selectedDiplomaticStatus, setSelectedDiplomaticStatus] = useState<DiplomaticStatus | 'ALL'>('ALL');
  const [selectedEpoch, setSelectedEpoch] = useState<HistoricalEpochKey>('ALL');
  const [isTimelineCumulative, setIsTimelineCumulative] = useState<boolean>(false);
  const [customYearRange, setCustomYearRange] = useState<[number, number] | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'mosaic'>('table');
  const [activeHouseModal, setActiveHouseModal] = useState<House | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailModalPreselectedHouse, setEmailModalPreselectedHouse] = useState<House | null>(null);
  const [isSpiritualModalOpen, setIsSpiritualModalOpen] = useState<boolean>(false);
  const [isDiplomacyMode, setIsDiplomacyMode] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleOpenEmailDispatcher = (house?: House) => {
    setEmailModalPreselectedHouse(house || null);
    setIsEmailModalOpen(true);
  };

  // Synchronize country selection with region filter so that selecting a country from map never conflicts with a different region
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    if (countryName !== 'ALL' && selectedRegion !== 'ALL') {
      const countryHouse = allHouses.find((h) => h.country === countryName);
      if (countryHouse && countryHouse.region !== selectedRegion) {
        setSelectedRegion('ALL');
      }
    }
  };

  const handleScrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Quick lookup helper for inspecting a house by name from MasterPlanView
  const handleInspectHouseByName = (houseName: string) => {
    const cleaned = houseName.toLowerCase().replace('haus', '').trim();
    const found = allHouses.find((h) => 
      h.name.toLowerCase().includes(cleaned) ||
      h.altNames?.some((alt) => alt.toLowerCase().includes(cleaned))
    );
    if (found) {
      setActiveHouseModal(found);
    } else {
      // Fallback: switch to directory and set search query
      setMainTab('directory');
      setSearchQuery(cleaned);
    }
  };

  // Filtered houses calculation
  const filteredHouses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return allHouses.filter((h) => {
      // Region filter
      if (selectedRegion !== 'ALL' && h.region !== selectedRegion) {
        return false;
      }

      // Country filter
      if (selectedCountry !== 'ALL' && h.country !== selectedCountry) {
        return false;
      }

      // Type filter
      if (selectedType !== 'ALL' && h.type !== selectedType) {
        return false;
      }

      // Diplomatic status filter (Acta Concordiae)
      if (selectedDiplomaticStatus !== 'ALL') {
        const dipStatus = h.DiplomaticStatus || h.diplomaticStatus || 'Consulting';
        if (dipStatus !== selectedDiplomaticStatus) {
          return false;
        }
      }

      // Historical Epoch & Timeline filter
      if (!isHouseInEpoch(h, selectedEpoch, isTimelineCumulative, customYearRange || undefined)) {
        return false;
      }

      // Search query filter
      if (query) {
        const matchesName = h.name.toLowerCase().includes(query);
        const matchesAlt = h.altNames?.some((alt) => alt.toLowerCase().includes(query));
        const matchesSeat = h.seat.toLowerCase().includes(query);
        const matchesCountry = h.country.toLowerCase().includes(query);
        const matchesRegion = h.region.toLowerCase().includes(query);
        const matchesPeriod = h.period.toLowerCase().includes(query);
        const matchesDesc = h.description.toLowerCase().includes(query);
        const matchesInstitution = h.institution.toLowerCase().includes(query);
        const matchesCrest = h.crestMotif?.toLowerCase().includes(query);
        const dipStatus = h.DiplomaticStatus || h.diplomaticStatus || '';
        const matchesDiplomatic = 
          dipStatus.toLowerCase().includes(query) ||
          (dipStatus === 'Active' && (query === 'aktiv' || query === 'active')) ||
          (dipStatus === 'Consulting' && (query === 'beratend' || query === 'konsultation' || query === 'consulting')) ||
          (dipStatus === 'Observing' && (query === 'beobachtend' || query === 'beobachter' || query === 'observing'));

        if (
          !matchesName &&
          !matchesAlt &&
          !matchesSeat &&
          !matchesCountry &&
          !matchesRegion &&
          !matchesPeriod &&
          !matchesDesc &&
          !matchesInstitution &&
          !matchesCrest &&
          !matchesDiplomatic
        ) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedCountry, selectedType, selectedDiplomaticStatus, selectedEpoch, isTimelineCumulative, customYearRange]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('ALL');
    setSelectedCountry('ALL');
    setSelectedType('ALL');
    setSelectedDiplomaticStatus('ALL');
    setSelectedEpoch('ALL');
    setIsTimelineCumulative(false);
    setCustomYearRange(null);
  };

  const handleExportCsv = () => {
    exportToCsv(filteredHouses, `Adelshaeuser_Verzeichnis_${filteredHouses.length}_Eintraege.csv`);
  };

  const handleExportJson = () => {
    exportToJson(filteredHouses, `Adelshaeuser_Verzeichnis_${filteredHouses.length}_Eintraege.json`);
  };

  return (
    <GlowSettingsProvider>
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1E252B]">
      {/* Top Banner Header */}
      <Header 
        stats={stats} 
        activeMainTab={mainTab}
        onSelectMainTab={setMainTab}
        onExportCsv={handleExportCsv} 
        onExportJson={handleExportJson} 
        onOpenEmailDispatcher={() => handleOpenEmailDispatcher()}
        onOpenSpiritualModal={() => setIsSpiritualModalOpen(true)}
        isDiplomacyMode={isDiplomacyMode}
        onToggleDiplomacyMode={() => setIsDiplomacyMode(!isDiplomacyMode)}
      />

      {isDiplomacyMode && (
        <div className="bg-[#102B20] text-[#E5C170] border-b border-emerald-500/30 px-4 py-2.5 text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-inner">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-white">🕊️ Diplomatie-Modus Aktiv:</span>
          <span>Nicht-aktive Häuser im Verzeichnis sind gedimmt; im Master-Plan Allianzen-Graph strahlen aktive diplomatische Häuser im goldenen und smaragdgrünen Leuchten.</span>
          <button 
            onClick={() => setIsDiplomacyMode(false)}
            className="ml-4 px-2 py-0.5 rounded bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-[11px]"
          >
            Modus beenden
          </button>
        </div>
      )}

      {mainTab === 'directory' ? (
        <>
          {/* Interactive Region Quick Filter */}
          <StatsBar
            stats={stats}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />

          {/* Interactive Europe Vector Map */}
          <EuropeMap
            selectedCountry={selectedCountry}
            onSelectCountry={handleCountryChange}
            onScrollToResults={handleScrollToResults}
          />

          {/* Main Filter & Search Control Panel */}
          <div ref={resultsRef}>
            <HouseFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedDiplomaticStatus={selectedDiplomaticStatus}
              onDiplomaticStatusChange={setSelectedDiplomaticStatus}
              selectedEpoch={selectedEpoch}
              onEpochChange={setSelectedEpoch}
              isTimelineOpen={isTimelineOpen}
              onToggleTimeline={() => setIsTimelineOpen(!isTimelineOpen)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onResetFilters={handleResetFilters}
              onOpenEmailDispatcher={() => handleOpenEmailDispatcher()}
              totalFiltered={filteredHouses.length}
              totalCount={totalCount}
            />
          </div>

          {/* Interactive Historical Timeline & Epoch Filter */}
          {isTimelineOpen && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <TimelineEpochFilter
                houses={allHouses}
                selectedEpoch={selectedEpoch}
                onSelectEpoch={setSelectedEpoch}
                isCumulative={isTimelineCumulative}
                onToggleCumulative={setIsTimelineCumulative}
                customYearRange={customYearRange}
                onSetCustomYearRange={setCustomYearRange}
              />
            </div>
          )}

          {/* Main Directory Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {viewMode === 'table' ? (
              <div className="space-y-6">
                <HouseTable
                  data={filteredHouses}
                  onSelectHouse={setActiveHouseModal}
                  onContactHouse={handleOpenEmailDispatcher}
                  isDiplomacyMode={isDiplomacyMode}
                />

                {/* Note on table view */}
                <div className="text-center text-xs text-[#786A5D]">
                  Klicken Sie auf den Namen eines Hauses oder das Augen-Symbol, um das vollständige archivalische Verzeichnisblatt zu öffnen.
                </div>
              </div>
            ) : viewMode === 'cards' ? (
              /* Cards Grid View */
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredHouses.map((house) => (
                    <HouseCard
                      key={house.id}
                      house={house}
                      onSelect={setActiveHouseModal}
                      onContact={handleOpenEmailDispatcher}
                      isDiplomacyMode={isDiplomacyMode}
                    />
                  ))}
                </div>

                {filteredHouses.length === 0 && (
                  <div className="bg-white border border-[#E3D9C9] rounded-xl p-12 text-center text-[#786A5D]">
                    <p className="text-base font-serif font-semibold text-[#1A1215]">Keine Häuser gefunden</p>
                    <p className="text-xs mt-1">Bitte passen Sie Ihre Such- oder Filterkriterien an.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 bg-[#8B1E2F] text-white rounded-md text-xs font-medium hover:bg-[#6D1623] transition-colors"
                    >
                      Alle Filter zurücksetzen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Heraldry Gallery Mosaic View within Directory */
              <div className="space-y-6">
                <HeraldryGallery
                  houses={filteredHouses}
                  onSelectHouse={setActiveHouseModal}
                  onContactHouse={handleOpenEmailDispatcher}
                  onBackToDirectory={() => setViewMode('table')}
                />
              </div>
            )}
          </main>
        </>
      ) : mainTab === 'heraldry' ? (
        /* Dedicated Full-Screen Heraldry Gallery View */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeraldryGallery
            houses={allHouses}
            onSelectHouse={setActiveHouseModal}
            onContactHouse={handleOpenEmailDispatcher}
            onBackToDirectory={() => setMainTab('directory')}
          />
        </main>
      ) : mainTab === 'eid_compliance' ? (
        /* eID Compliance Dashboard & Treemap View */
        <main className="flex-1 w-full">
          <EidComplianceDashboard
            houses={allHouses}
            onSelectHouse={setActiveHouseModal}
            onBackToDirectory={() => setMainTab('directory')}
          />
        </main>
      ) : (
        /* Master-Plan: Acta Concordiae Europae View */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MasterPlanView
            houses={allHouses}
            onBackToDirectory={() => setMainTab('directory')}
            onInspectHouse={setActiveHouseModal}
            onInspectHouseByName={handleInspectHouseByName}
            onOpenSpiritualModal={() => setIsSpiritualModalOpen(true)}
            isDiplomacyMode={isDiplomacyMode}
          />
        </main>
      )}

      {/* House Detail Modal / Inspector Drawer */}
      <HouseDetailModal
        house={activeHouseModal}
        onClose={() => setActiveHouseModal(null)}
        onOpenDispatcherForHouse={handleOpenEmailDispatcher}
      />

      {/* Email Outreach Suite & Batch Dispatcher Modal */}
      <EmailOutreachModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailModalPreselectedHouse(null);
        }}
        filteredHouses={filteredHouses}
        allHouses={allHouses}
        preselectedHouse={emailModalPreselectedHouse}
      />

      {/* Spiritual Houses & World eID Peace Pact Accreditation Modal */}
      <SpiritualHousesAndEidModal
        isOpen={isSpiritualModalOpen}
        onClose={() => setIsSpiritualModalOpen(false)}
        onComposeToEmail={(email, name) => {
          setIsEmailModalOpen(true);
          setEmailModalPreselectedHouse({
            id: 'spiritual-' + email,
            name: name,
            country: 'Europa / Global',
            region: 'CENTRAL_EUROPE',
            period: 'Seit Jahrhunderten',
            seat: name,
            type: 'Kulturstiftung',
            institution: name,
            contactPerson: 'Kanzlei / Verwaltung',
            email: email,
            emailStatus: 'VALIDATED',
            emailVerificationDate: '2026-03-24',
            officialUrl: '',
            archiveSource: 'BESA eID & Swiss Trust Register',
            description: 'Geistliches Friedenshaus der Acta Concordiae',
            historicalSignificance: 'Traditionslinie der interreligiösen Friedensstiftung',
            crestMotif: 'Friedenstaube & Palmzweig',
            diplomaticStatus: 'Active',
            DiplomaticStatus: 'Active'
          });
        }}
      />

      {/* Archival Imprint & Data Integrity Footer */}
      <Footer />

      {/* Global Map Glow & Color Pulse Settings Modal Panel */}
      <GlowSettingsPanel />
    </div>
    </GlowSettingsProvider>
  );
}
