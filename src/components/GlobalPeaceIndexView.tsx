import React, { useState } from 'react';
import { 
  Globe, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ExternalLink, 
  Landmark, 
  HeartHandshake, 
  ArrowRight,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { GLOBAL_PEACE_INDEX_DATA, CountryGPI, getGPIStats } from '../data/gpiData';
import { House } from '../types';

interface GlobalPeaceIndexViewProps {
  houses?: House[];
  onInspectHouseByName?: (houseName: string) => void;
  onBackToDirectory: () => void;
}

export const GlobalPeaceIndexView: React.FC<GlobalPeaceIndexViewProps> = ({
  houses = [],
  onInspectHouseByName,
  onBackToDirectory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState<CountryGPI | null>(GLOBAL_PEACE_INDEX_DATA[0]);

  const stats = getGPIStats();

  const filteredCountries = GLOBAL_PEACE_INDEX_DATA.filter(country => {
    const matchesSearch = country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.actaConcordiaeIntervention.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'ALL' || country.region === regionFilter;
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'CRISIS' && country.conflictStatus === 'Aktive Konfliktzone') ||
      (statusFilter === 'STABLE' && country.peaceLevel === 'Sehr hoch');
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score < 1.4) return 'bg-emerald-600 text-white';
    if (score < 1.8) return 'bg-teal-600 text-white';
    if (score < 2.2) return 'bg-amber-600 text-white';
    if (score < 2.8) return 'bg-orange-600 text-white';
    return 'bg-[#8B1E2F] text-white animate-pulse';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score < 1.4) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score < 1.8) return 'text-teal-700 bg-teal-50 border-teal-200';
    if (score < 2.2) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (score < 2.8) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-[#8B1E2F] bg-rose-50 border-rose-300';
  };

  // Find houses matching this country
  const countryHouses = houses.filter(h => 
    selectedCountry && (h.country === selectedCountry.country || h.region === selectedCountry.region)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <section className="relative bg-[#1A1115] text-[#FAF6EE] rounded-2xl border border-[#C5A059]/40 shadow-xl overflow-hidden p-6 sm:p-10">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#E5C170 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#331821] border border-[#C5A059]/30 text-xs text-[#E5C170] font-sans font-semibold uppercase tracking-[0.2em]">
            <Globe className="w-4 h-4 text-[#E5C170]" />
            <span>Global Peace Index (GPI) & Krisen-Diplomatie</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#FAF6EE]">
            Friedensindex & Acta Concordiae Interventionen
          </h1>

          <p className="text-sm sm:text-base text-[#D8CCA9] max-w-3xl font-sans leading-relaxed">
            Verknüpfung des globalen Friedensindexes (IEP GPI) mit den diplomatischen Schutz-, Vermittlungs- und 
            Kulturgüter-Missionen des Acta Concordiae Projekts. Gezielte Brückenbauer in Krisen- und Konfliktzonen 
            zur Bewahrung des europäischen und weltweiten Erbes.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#C5A059]/20">
            <div className="bg-[#24151B] p-3.5 rounded-xl border border-[#C5A059]/30">
              <span className="block text-xs text-[#B5A593] uppercase tracking-wider">Erfasste Staaten</span>
              <span className="text-2xl font-serif font-bold text-[#FAF6EE]">{stats.totalCountries}</span>
            </div>
            <div className="bg-[#24151B] p-3.5 rounded-xl border border-[#C5A059]/30">
              <span className="block text-xs text-[#B5A593] uppercase tracking-wider">Ø Friedensindex</span>
              <span className="text-2xl font-serif font-bold text-[#E5C170]">{stats.avgScore}</span>
            </div>
            <div className="bg-[#24151B] p-3.5 rounded-xl border border-[#C5A059]/30">
              <span className="block text-xs text-[#B5A593] uppercase tracking-wider">Krisenzonen im Fokus</span>
              <span className="text-2xl font-serif font-bold text-rose-400">{stats.crisisCount}</span>
            </div>
            <div className="bg-[#24151B] p-3.5 rounded-xl border border-[#C5A059]/30">
              <span className="block text-xs text-[#B5A593] uppercase tracking-wider">Stabile Ankerstaaten</span>
              <span className="text-2xl font-serif font-bold text-emerald-400">{stats.stableCount}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Controls & Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E3D9C9] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Land oder Intervention suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F9F6F0] border border-[#E3D9C9] rounded-lg text-sm text-[#1A1215] focus:outline-none focus:ring-2 focus:ring-[#8B1E2F]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            aria-label="Region filtern"
            className="px-3 py-2 bg-[#F9F6F0] border border-[#E3D9C9] rounded-lg text-xs font-sans text-[#4A3E33] focus:outline-none focus:ring-2 focus:ring-[#8B1E2F]"
          >
            <option value="ALL">Alle Regionen</option>
            <option value="DACH & Heiliges Römisches Reich">DACH & HRE</option>
            <option value="Italien, Spanien, Portugal">Mediteran (IT, ES, PT)</option>
            <option value="Frankreich, Benelux, UK">Frankreich, Benelux, UK</option>
            <option value="Skandinavien, Osteuropa, Russland">Skandinavien & Osteuropa</option>
            <option value="Weltweit (Asien, Afrika, Amerika, Naher Osten)">Weltweit (Asien, Afrika, ME)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Konfliktstatus filtern"
            className="px-3 py-2 bg-[#F9F6F0] border border-[#E3D9C9] rounded-lg text-xs font-sans text-[#4A3E33] focus:outline-none focus:ring-2 focus:ring-[#8B1E2F]"
          >
            <option value="ALL">Alle Status</option>
            <option value="STABLE">Nur sehr stabile Anker (GPI &lt; 1.4)</option>
            <option value="CRISIS">Krisenzonen / Aktive Konflikte</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Countries & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Countries */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#6C5D50] px-1 flex items-center justify-between">
            <span>Staaten & Friedens-Ranking ({filteredCountries.length})</span>
            <span className="text-xs font-normal text-[#8C7A6B]">Niedriger Score = Mehr Frieden</span>
          </h2>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountry?.country === c.country;
              return (
                <div
                  key={c.country}
                  onClick={() => setSelectedCountry(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#FAF3E6] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]'
                      : 'bg-white border-[#E3D9C9] hover:border-[#8B1E2F]/40 hover:bg-[#FDFBFA]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-serif font-bold text-xs shadow-inner ${getScoreColor(c.gpiScore)}`}>
                      <span className="text-[10px] opacity-80 uppercase tracking-tighter">Rang</span>
                      <span>#{c.rank}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#1A1215]">{c.country}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold border ${getScoreBadgeColor(c.gpiScore)}`}>
                          GPI: {c.gpiScore}
                        </span>
                      </div>
                      <p className="text-xs text-[#6C5D50] line-clamp-1 mt-0.5">{c.actaConcordiaeIntervention}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium ${
                      c.conflictStatus === 'Aktive Konfliktzone'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : c.conflictStatus === 'Friedenssicherer Anker'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {c.conflictStatus === 'Aktive Konfliktzone' ? <ShieldAlert className="w-3 h-3 text-rose-600" /> : <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                      <span>{c.conflictStatus}</span>
                    </span>
                    <span className="text-[11px] text-[#8C7A6B]">{c.associatedHousesCount} Häuser im Verbund</span>
                  </div>
                </div>
              );
            })}

            {filteredCountries.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-[#E3D9C9]">
                <p className="text-sm text-[#6C5D50]">Keine Staaten gefunden, die den Suchkriterien entsprechen.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Panel for Selected Country */}
        <div className="lg:col-span-5 space-y-6">
          {selectedCountry ? (
            <div className="bg-[#FAF6EE] rounded-2xl border border-[#C5A059]/40 p-6 shadow-md space-y-6 sticky top-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#E3D9C9] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#8B1E2F] font-semibold uppercase tracking-wider mb-1">
                    <span>{selectedCountry.region}</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#1A1215]">{selectedCountry.country}</h2>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-center font-serif font-bold ${getScoreColor(selectedCountry.gpiScore)} shadow-sm`}>
                  <div className="text-[10px] uppercase opacity-90">Global Peace Index</div>
                  <div className="text-lg">{selectedCountry.gpiScore}</div>
                  <div className="text-[10px] opacity-90">Rang #{selectedCountry.rank} von 163</div>
                </div>
              </div>

              {/* Status & Trend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9]">
                  <span className="block text-[11px] text-[#8C7A6B] uppercase font-sans">Friedens-Kategorie</span>
                  <span className="font-serif font-bold text-sm text-[#1A1215] mt-0.5 block">{selectedCountry.peaceLevel}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9]">
                  <span className="block text-[11px] text-[#8C7A6B] uppercase font-sans">Konfliktstatus</span>
                  <span className="font-serif font-bold text-sm text-[#1A1215] mt-0.5 block flex items-center gap-1.5">
                    {selectedCountry.conflictStatus === 'Aktive Konfliktzone' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                    {selectedCountry.conflictStatus}
                  </span>
                </div>
              </div>

              {/* Acta Concordiae Diplomatic Mission */}
              <div className="bg-[#1A1115] text-[#FAF6EE] p-5 rounded-xl border border-[#C5A059]/40 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#E5C170] font-sans font-semibold uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-[#E5C170]" />
                  <span>Acta Concordiae Diplomatie & Intervention</span>
                </div>
                <p className="text-sm font-serif italic text-[#FAF6EE] leading-relaxed">
                  "{selectedCountry.actaConcordiaeIntervention}"
                </p>
                <p className="text-xs text-[#D8CCA9] font-sans leading-normal pt-2 border-t border-[#C5A059]/20">
                  {selectedCountry.conflictStatus === 'Aktive Konfliktzone' 
                    ? 'In dieser Krisenregion setzt das Acta Concordiae Projekt auf humanitäre Kulturgüter-Evakuierung, Vermittlung zwischen verfeindeten Stiftungen und den Schutz historischer Archive.'
                    : 'Dieses Land dient als stabiler Anker im europäischen Bündnisnetzwerk und koordiniert gemeinsame Kulturaustausch- und Friedensinitiativen.'}
                </p>
              </div>

              {/* Associated Houses in this Country / Region */}
              <div className="space-y-3">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#6C5D50] flex items-center justify-between">
                  <span>Verknüpfte Adelshäuser & Archive</span>
                  <span className="text-xs font-normal text-[#8C7A6B]">{countryHouses.length} im Archiv</span>
                </h3>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {countryHouses.slice(0, 6).map((house) => (
                    <div 
                      key={house.id}
                      onClick={() => onInspectHouseByName && onInspectHouseByName(house.name)}
                      className="p-3 bg-white rounded-lg border border-[#E3D9C9] hover:border-[#8B1E2F] transition-all cursor-pointer flex items-center justify-between gap-2 group"
                    >
                      <div>
                        <div className="font-serif font-bold text-sm text-[#1A1215] group-hover:text-[#8B1E2F] transition-colors">
                          {house.name}
                        </div>
                        <div className="text-xs text-[#6C5D50]">{house.seat} ({house.type})</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#8B1E2F] transition-colors shrink-0" />
                    </div>
                  ))}

                  {countryHouses.length === 0 && (
                    <p className="text-xs text-[#6C5D50] italic bg-white p-3 rounded-lg border border-[#E3D9C9]">
                      Keine spezifischen Häuser direkt für {selectedCountry.country} hinterlegt (verwandte Netzwerke greifen über Region {selectedCountry.region}).
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-[#E3D9C9] text-center space-y-3">
              <Globe className="w-10 h-10 text-[#8C7A6B] mx-auto opacity-50" />
              <p className="text-sm text-[#6C5D50]">Bitte wählen Sie links einen Staat aus, um die detaillierten Friedensindex-Daten und diplomatischen Interventionen anzuzeigen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
