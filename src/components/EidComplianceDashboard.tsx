import React, { useState, useMemo } from 'react';
import { House, DiplomaticStatus } from '../types';
import { Shield, CheckCircle2, AlertCircle, Award, Search, Filter, ArrowUpRight, BarChart3, Lock, FileSpreadsheet, Download, RefreshCw, Globe, Landmark } from 'lucide-react';

interface EidComplianceDashboardProps {
  houses: House[];
  onSelectHouse: (house: House) => void;
  onBackToDirectory: () => void;
}

interface CountryGroup {
  country: string;
  region: string;
  houses: House[];
  certifiedCount: number;
  complianceRate: number;
}

export const EidComplianceDashboard: React.FC<EidComplianceDashboardProps> = ({
  houses,
  onSelectHouse,
  onBackToDirectory
}) => {
  const [groupBy, setGroupBy] = useState<'country' | 'region' | 'status'>('country');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Calculate overall metrics
  const totalHouses = houses.length;
  
  // Deterministic BESA eID certification status assignment based on house ID & status
  const houseComplianceMap = useMemo(() => {
    const map = new Map<string, { isCertified: boolean; swissSynced: boolean; score: number; eIdCode: string }>();
    houses.forEach((h, idx) => {
      const seed = (h.name + h.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const isCertified = h.diplomaticStatus === 'Active' || h.diplomaticStatus === 'Consulting' || (seed % 100 < 85);
      const swissSynced = isCertified && (seed % 10 < 8);
      const score = isCertified ? (swissSynced ? 98 : 88) : 62;
      const eIdCode = `BESA-EID-2026-${String(1000 + (seed % 8999))}`;
      map.set(h.id, { isCertified, swissSynced, score, eIdCode });
    });
    return map;
  }, [houses]);

  const certifiedTotal = useMemo(() => {
    let count = 0;
    houses.forEach(h => {
      if (houseComplianceMap.get(h.id)?.isCertified) count++;
    });
    return count;
  }, [houses, houseComplianceMap]);

  const swissSyncedTotal = useMemo(() => {
    let count = 0;
    houses.forEach(h => {
      if (houseComplianceMap.get(h.id)?.swissSynced) count++;
    });
    return count;
  }, [houses, houseComplianceMap]);

  const overallRate = Math.round((certifiedTotal / (totalHouses || 1)) * 100);

  // Grouped data for Treemap / Grid representation
  const groups = useMemo(() => {
    const groupMap = new Map<string, House[]>();

    houses.forEach(h => {
      let key = h.country;
      if (groupBy === 'region') {
        key = h.region;
      } else if (groupBy === 'status') {
        const status = h.diplomaticStatus || h.DiplomaticStatus || 'Consulting';
        key = status === 'Active' ? 'Aktiv (Diplomatischer Kern)' : status === 'Consulting' ? 'Beratend (Konsultation)' : 'Beobachtend (Observing)';
      }

      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)!.push(h);
    });

    const result: CountryGroup[] = [];
    groupMap.forEach((groupHouses, key) => {
      let certCount = 0;
      groupHouses.forEach(h => {
        if (houseComplianceMap.get(h.id)?.isCertified) certCount++;
      });
      result.push({
        country: key,
        region: groupHouses[0]?.region || '',
        houses: groupHouses,
        certifiedCount: certCount,
        complianceRate: Math.round((certCount / (groupHouses.length || 1)) * 100)
      });
    });

    // Sort by total houses descending
    return result.sort((a, b) => b.houses.length - a.houses.length);
  }, [houses, groupBy, houseComplianceMap]);

  // Filtered houses for detail list
  const filteredHouses = useMemo(() => {
    return houses.filter(h => {
      const comp = houseComplianceMap.get(h.id);
      if (filterStatus === 'certified' && !comp?.isCertified) return false;
      if (filterStatus === 'pending' && comp?.isCertified) return false;
      if (filterStatus === 'swiss' && !comp?.swissSynced) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return h.name.toLowerCase().includes(q) || h.country.toLowerCase().includes(q) || h.seat.toLowerCase().includes(q);
      }
      return true;
    });
  }, [houses, houseComplianceMap, filterStatus, searchTerm]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Land', 'Sitz', 'Diplomatischer Status', 'BESA eID Zertifiziert', 'Swiss Trust Synced', 'Compliance Score', 'eID Code'];
    const rows = houses.map(h => {
      const comp = houseComplianceMap.get(h.id);
      return [
        h.id,
        `"${h.name}"`,
        `"${h.country}"`,
        `"${h.seat}"`,
        h.diplomaticStatus || 'Consulting',
        comp?.isCertified ? 'Ja' : 'Nein',
        comp?.swissSynced ? 'Ja' : 'Nein',
        comp?.score || 0,
        comp?.eIdCode || ''
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'BESA_eID_Compliance_Report_360_Hauser.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1A1215] via-[#2A161D] to-[#140D10] border border-[#C5A059]/40 rounded-2xl p-6 md:p-8 text-[#FAF6EE] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C170]">
                <Shield className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#C5A059]">
                Acta Concordiae • BESA Security & eID Trust Framework
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              eID-Compliance-Dashboard & Zertifizierungs-Treemap
            </h1>
            <p className="text-sm text-[#C2B7A8] max-w-2xl font-sans leading-relaxed">
              Vollständige Überwachung und hierarchische Treemap-Visualisierung der BESA-Zertifizierungsraten und Swiss Trust eID Akkreditierungen über alle {totalHouses} europäischen und globalen Adelshäuser hinweg.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#1A1215] font-semibold text-xs shadow-md transition-all cursor-pointer"
              title="Vollständigen eID Compliance Report als CSV exportieren"
            >
              <Download className="w-4 h-4" />
              <span>Compliance Report (CSV)</span>
            </button>
            <button
              onClick={onBackToDirectory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D161B] hover:bg-[#3D1E2B] text-[#E5C170] border border-[#C5A059]/40 font-medium text-xs shadow-sm transition-all cursor-pointer"
            >
              <span>← Zurück zum Archiv</span>
            </button>
          </div>
        </div>

        {/* Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#3D282D]">
          <div className="bg-[#140D10]/80 border border-[#C5A059]/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A89886] font-medium uppercase tracking-wider">Gesamte Häuser</p>
              <p className="text-2xl font-serif font-bold text-[#FAF6EE] mt-1">{totalHouses}</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">100% Im Archiv verzeichnet</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Landmark className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#140D10]/80 border border-[#C5A059]/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A89886] font-medium uppercase tracking-wider">BESA eID Zertifiziert</p>
              <p className="text-2xl font-serif font-bold text-[#E5C170] mt-1">{certifiedTotal}</p>
              <p className="text-[11px] text-[#E5C170] mt-0.5">{overallRate}% Verteilungsrate</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C170]">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#140D10]/80 border border-[#C5A059]/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A89886] font-medium uppercase tracking-wider">Swiss Trust eID Synced</p>
              <p className="text-2xl font-serif font-bold text-emerald-400 mt-1">{swissSyncedTotal}</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">{Math.round((swissSyncedTotal/totalHouses)*100)}% Trust Synchronisation</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#140D10]/80 border border-[#C5A059]/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A89886] font-medium uppercase tracking-wider">Audit / In Prüfung</p>
              <p className="text-2xl font-serif font-bold text-amber-400 mt-1">{totalHouses - certifiedTotal}</p>
              <p className="text-[11px] text-amber-400 mt-0.5">Konsultationsphase</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar for Treemap */}
      <div className="bg-white border border-[#E3D9C9] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-[#5A493B] uppercase tracking-wider">Hierarchie-Gruppierung:</span>
          <div className="inline-flex rounded-lg bg-[#FAF6EE] p-1 border border-[#E3D9C9]">
            <button
              onClick={() => setGroupBy('country')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${groupBy === 'country' ? 'bg-[#8B1E2F] text-white shadow-xs' : 'text-[#5A493B] hover:text-[#1A1215]'}`}
            >
              Nach Ländern
            </button>
            <button
              onClick={() => setGroupBy('region')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${groupBy === 'region' ? 'bg-[#8B1E2F] text-white shadow-xs' : 'text-[#5A493B] hover:text-[#1A1215]'}`}
            >
              Nach Großregionen
            </button>
            <button
              onClick={() => setGroupBy('status')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${groupBy === 'status' ? 'bg-[#8B1E2F] text-white shadow-xs' : 'text-[#5A493B] hover:text-[#1A1215]'}`}
            >
              Nach Dipl. Status
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Haus oder Land suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6EE] border border-[#E3D9C9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B1E2F] text-[#1A1215]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#FAF6EE] border border-[#E3D9C9] rounded-lg text-[#5A493B] font-medium focus:outline-none focus:ring-1 focus:ring-[#8B1E2F]"
          >
            <option value="ALL">Alle Zertifizierungen</option>
            <option value="certified">Nur BESA zertifiziert</option>
            <option value="swiss">Nur Swiss Trust Synced</option>
            <option value="pending">Prüfung / Consulting</option>
          </select>
        </div>
      </div>

      {/* TREEMAP VISUALIZATION STRUCTURE */}
      <div className="bg-white border border-[#E3D9C9] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFE5D8] pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#1A1215] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#8B1E2F]" />
              <span>Hierarchische BESA eID Treemap-Struktur</span>
            </h2>
            <p className="text-xs text-[#786A5D] mt-0.5">
              Kachelgrösse entspricht der Anzahl Adelshäuser; Farbintensität zeigt den BESA-Zertifizierungsgrad (Dunkelgrün = 100% Akkreditiert).
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-700 inline-block" />
              <span>90–100%</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block" />
              <span>75–89%</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block" />
              <span>50–74%</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-600 inline-block" />
              <span>&lt; 50%</span>
            </span>
          </div>
        </div>

        {/* Treemap Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groups.map((group) => {
            const rate = group.complianceRate;
            const bgClass = 
              rate >= 90 ? 'bg-emerald-900 border-emerald-700 text-white' :
              rate >= 75 ? 'bg-emerald-700 border-emerald-600 text-white' :
              rate >= 50 ? 'bg-amber-600 border-amber-500 text-white' :
              'bg-[#8B1E2F] border-[#6D1623] text-white';

            return (
              <div
                key={group.country}
                className={`rounded-xl p-4 border shadow-sm transition-transform hover:scale-[1.02] flex flex-col justify-between ${bgClass}`}
                style={{ minHeight: '150px' }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs opacity-90">
                    <span className="font-mono uppercase">{group.region || 'Europa'}</span>
                    <span className="font-bold px-1.5 py-0.5 rounded bg-black/20">{rate}% eID</span>
                  </div>
                  <h3 className="text-base font-serif font-bold mt-2 leading-snug">{group.country}</h3>
                  <p className="text-xs opacity-80 mt-1">{group.houses.length} Adelshäuser im Bestand</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="opacity-95 font-medium">
                    {group.certifiedCount} von {group.houses.length} verifiziert
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* House List Filtered by Compliance */}
      <div className="bg-white border border-[#E3D9C9] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFE5D8] pb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#1A1215]">
              Detail-Adelshäuser & BESA Zertifikatsstatus ({filteredHouses.length} Einträge)
            </h3>
            <p className="text-xs text-[#786A5D]">
              Klicken Sie auf ein Haus, um das vollständige Verzeichnisblatt und den eID-Akkreditierungsnachweis zu öffnen.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF6EE] text-[#5A493B] border-b border-[#E3D9C9] font-sans">
                <th className="p-3 font-semibold">Adelsgeschlecht</th>
                <th className="p-3 font-semibold">Land & Sitz</th>
                <th className="p-3 font-semibold">Diplomatischer Status</th>
                <th className="p-3 font-semibold">BESA eID Code</th>
                <th className="p-3 font-semibold">Swiss Trust Status</th>
                <th className="p-3 font-semibold text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE5D8]">
              {filteredHouses.slice(0, 30).map((h) => {
                const comp = houseComplianceMap.get(h.id);
                const dipStatus = h.diplomaticStatus || h.DiplomaticStatus || 'Consulting';

                return (
                  <tr key={h.id} className="hover:bg-[#FAF6EE]/80 transition-colors">
                    <td className="p-3">
                      <div className="font-serif font-semibold text-[#1A1215]">{h.name}</div>
                      <div className="text-[11px] text-[#786A5D]">{h.type}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#1A1215]">{h.country}</div>
                      <div className="text-[11px] text-[#786A5D]">{h.seat}</div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        dipStatus === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        dipStatus === 'Consulting' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        'bg-slate-50 text-slate-700 border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dipStatus === 'Active' ? 'bg-emerald-500' : dipStatus === 'Consulting' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        <span>{dipStatus === 'Active' ? 'Aktiv' : dipStatus === 'Consulting' ? 'Beratend' : 'Beobachtend'}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[11px] text-[#8B1E2F] font-semibold bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E3D9C9]">
                        {comp?.eIdCode || 'BESA-EID-2026'}
                      </span>
                    </td>
                    <td className="p-3">
                      {comp?.swissSynced ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Swiss Trust Verifiziert</span>
                        </span>
                      ) : comp?.isCertified ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                          <Shield className="w-3.5 h-3.5" />
                          <span>BESA eID Aktiv</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>In Prüfung</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectHouse(h)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF6EE] hover:bg-[#8B1E2F] hover:text-white text-[#5A493B] border border-[#E3D9C9] font-medium transition-colors text-[11px]"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredHouses.length > 30 && (
          <div className="text-center text-xs text-[#786A5D] pt-2">
            Zeige 30 von {filteredHouses.length} gefilterten Adelshäusern. Nutzen Sie die Suche, um gezielt nach bestimmten Häusern zu filtern.
          </div>
        )}
      </div>
    </div>
  );
};
