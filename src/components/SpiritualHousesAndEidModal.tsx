import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Sparkles, 
  Globe, 
  Award, 
  CheckCircle, 
  ExternalLink, 
  Mail, 
  Flame, 
  Sun, 
  Moon, 
  Heart, 
  Lock, 
  Cpu, 
  KeyRound,
  FileCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { SPIRITUAL_HOUSES } from '../data/spiritual-houses';
import { SpiritualHouse, WorldTradition } from '../types';
import { BesaEidBadge } from './BesaEidBadge';

interface SpiritualHousesAndEidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComposeToEmail?: (email: string, name: string) => void;
}

export const SpiritualHousesAndEidModal: React.FC<SpiritualHousesAndEidModalProps> = ({
  isOpen,
  onClose,
  onComposeToEmail
}) => {
  const [selectedTradition, setSelectedTradition] = useState<WorldTradition | 'ALL'>('ALL');
  const [selectedEidStandard, setSelectedEidStandard] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHouse, setSelectedHouse] = useState<SpiritualHouse | null>(SPIRITUAL_HOUSES[0]);

  if (!isOpen) return null;

  const filteredHouses = SPIRITUAL_HOUSES.filter(h => {
    if (selectedTradition !== 'ALL' && h.tradition !== selectedTradition) return false;
    if (selectedEidStandard !== 'ALL' && h.eidPactStandard !== selectedEidStandard) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.spiritualSeat.toLowerCase().includes(q) ||
        h.peaceMission.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTraditionBadge = (tradition: WorldTradition) => {
    switch (tradition) {
      case 'CHRISTIANITY':
        return { label: '✝️ Christentum', color: 'bg-blue-900/80 text-blue-200 border-blue-500/40' };
      case 'ISLAM':
        return { label: '☪️ Islam / Sufi-Bektaschi', color: 'bg-emerald-900/80 text-emerald-200 border-emerald-500/40' };
      case 'HINDUISM':
        return { label: '🕉️ Hinduismus / Vedanta', color: 'bg-amber-900/80 text-amber-200 border-amber-500/40' };
      case 'BUDDHISM':
        return { label: '☸️ Buddhismus / Ahimsa', color: 'bg-yellow-900/80 text-yellow-200 border-yellow-500/40' };
      case 'JUDAISM':
        return { label: '✡️ Judentum / SchUM', color: 'bg-indigo-900/80 text-indigo-200 border-indigo-500/40' };
      case 'INTERFAITH_PEACE':
        return { label: '🕊️ Interreligiöse Friedensbrücke', color: 'bg-purple-900/80 text-purple-200 border-purple-500/40' };
      default:
        return { label: 'Spirituelles Haus', color: 'bg-stone-800 text-stone-200 border-stone-600' };
    }
  };

  const getEidBadge = (standard: SpiritualHouse['eidPactStandard']) => {
    switch (standard) {
      case 'BESA_EID':
        return { label: 'BESA eID (Albanisches Ehren-Pakt-Zertifikat)', badge: '🇦🇱 BESA-EID-2026', color: 'bg-rose-950 text-rose-300 border-rose-500/50' };
      case 'SWISS_EID':
        return { label: 'Schweizer Trust eID (Eidgenössische Konföderation)', badge: '🇨🇭 CHE-TRUST-EID', color: 'bg-red-950 text-red-300 border-red-500/50' };
      case 'GERMAN_EIDAS':
        return { label: 'German eIDAS / BSI TR-03110 Standard', badge: '🇩🇪 DEU-TR-03110', color: 'bg-amber-950 text-amber-300 border-amber-500/50' };
      default:
        return { label: 'Internationaler eID Peace Accord', badge: '🌐 GLOBAL-EID-PAX', color: 'bg-blue-950 text-blue-300 border-blue-500/50' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#120B0E] border-2 border-[#E5C170]/60 rounded-3xl shadow-[0_0_50px_rgba(229,193,112,0.3)] text-[#FAF6EE] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glowing Decorative Header Banner */}
        <div className="relative bg-gradient-to-r from-[#2A0E18] via-[#1E1116] to-[#341822] border-b border-[#E5C170]/30 p-6 sm:p-8 overflow-hidden shrink-0">
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#E5C170 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#E5C170]">
                {/* Gold Pixel Bell SVG Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1724] border border-[#E5C170]/50 shadow-sm">
                  <svg className="w-4 h-4 text-[#E5C170] animate-bounce" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.34 2 9 3.34 9 5v1.08C6.67 7.03 5 9.32 5 12v5l-2 2v1h18v-1l-2-2v-5c0-2.68-1.67-4.97-4-5.92V5c0-1.66-1.34-3-3-3zm0 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/>
                  </svg>
                  <span>Spirituelle Friedenshäuser & Welt-eID Pakt</span>
                </div>
                <span>•</span>
                <span className="text-emerald-400">BESA eID & Swiss Trust eID zertifiziert</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF6EE] tracking-tight flex items-center gap-3">
                <span>Interreligiöse Friedensdiplomatie & Digitale Souveränität</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#D8CCA9] max-w-3xl leading-relaxed">
                Integration der geistlichen Residenzen (Christentum, Islam, Hinduismus, Buddhismus, Judentum) 
                gemäß den höchsten staatlichen eID-Sicherheitsstandards von Albanien (BESA Ehrenkodex), Schweiz und Deutschland.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#2E141E] hover:bg-[#471E2E] text-[#E5C170] border border-[#E5C170]/40 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Spiritual Squirrel Avatar & Treasure Chest Banner Widget */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#1A0E13]/80 border border-[#E5C170]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BesaEidBadge
                size="md"
                variant="seal"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#E5C170] flex items-center gap-2">
                  <span>Wächter-Avatar: Friedens-Eichhörnchen mit Schatzkiste & Osterei</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-500/30">Bremer Stadtmusikanten Ästhetik</span>
                </div>
                <p className="text-[11px] text-[#C2B5A3]">
                  BESA eID Vertrauenssiegel mit goldener Eichel, Horn, Schatzkiste und eIDAS-Treemap-Sicherheitsarchitektur.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/60 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>BESA eID Verified</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-red-950 border border-red-500/60 text-[11px] font-bold text-red-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Swiss Trust Scheme</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-[#180E12] border-b border-[#3D252E] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Tradition selector */}
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-semibold uppercase tracking-wider text-[11px]">Tradition:</span>
            <select
              value={selectedTradition}
              onChange={(e) => setSelectedTradition(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-[#25131B] border border-[#E5C170]/40 text-[#FAF6EE] text-xs font-medium focus:ring-1 focus:ring-[#E5C170]"
            >
              <option value="ALL">🌟 Alle Welttraditionen</option>
              <option value="CHRISTIANITY">✝️ Christentum</option>
              <option value="ISLAM">☪️ Islam / Bektaschi</option>
              <option value="HINDUISM">🕉️ Hinduismus / Vedanta</option>
              <option value="BUDDHISM">☸️ Buddhismus / Ahimsa</option>
              <option value="JUDAISM">✡️ Judentum / SchUM</option>
              <option value="INTERFAITH_PEACE">🕊️ Interreligiöse Friedensbrücke</option>
            </select>
          </div>

          {/* eID Standard selector */}
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-semibold uppercase tracking-wider text-[11px]">eID-Pakt:</span>
            <select
              value={selectedEidStandard}
              onChange={(e) => setSelectedEidStandard(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#25131B] border border-[#E5C170]/40 text-[#FAF6EE] text-xs font-medium focus:ring-1 focus:ring-[#E5C170]"
            >
              <option value="ALL">🛡️ Alle eID-Standards</option>
              <option value="BESA_EID">🇦🇱 BESA eID (Albanien)</option>
              <option value="SWISS_EID">🇨🇭 Schweizer Trust eID</option>
              <option value="GERMAN_EIDAS">🇩🇪 German eIDAS TR-03110</option>
              <option value="GLOBAL_EID">🌐 Global Peace Accord</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Spirituelle Häuser durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#25131B] border border-[#E5C170]/40 text-xs placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-[#E5C170]"
            />
          </div>
        </div>

        {/* Modal Body: Split view (List on Left, Detail Dossier on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-[#3D252E]">
          
          {/* Left Column: House Cards List */}
          <div className="lg:col-span-5 p-4 space-y-3 overflow-y-auto max-h-[550px]">
            <div className="flex items-center justify-between text-xs text-[#C5A059] font-semibold pb-1">
              <span>Gefundene Residenzen: {filteredHouses.length}</span>
              <span>Klick für Beglaubigungs-Akte</span>
            </div>

            {filteredHouses.map((house) => {
              const isSelected = selectedHouse?.id === house.id;
              const traditionInfo = getTraditionBadge(house.tradition);
              const eidInfo = getEidBadge(house.eidPactStandard);

              return (
                <div
                  key={house.id}
                  onClick={() => setSelectedHouse(house)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#381622] to-[#251018] border-[#E5C170] shadow-[0_0_20px_rgba(229,193,112,0.25)] ring-1 ring-[#E5C170]'
                      : 'bg-[#1C0F14] border-[#3D252E] hover:border-[#E5C170]/60 hover:bg-[#2A151F]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${traditionInfo.color}`}>
                      {traditionInfo.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${eidInfo.color}`}>
                      {eidInfo.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#FAF6EE] line-clamp-1">
                    {house.name}
                  </h3>

                  <div className="text-[11px] text-[#C5A059] mt-0.5">
                    📍 {house.city}, {house.country}
                  </div>

                  <p className="text-[11px] text-[#B8AA98] mt-1.5 line-clamp-2 leading-relaxed">
                    {house.peaceMission}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Full Official Accreditation Dossier */}
          {selectedHouse ? (
            <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto max-h-[550px] bg-gradient-to-b from-[#180E13] to-[#120B0E]">
              
              {/* Header Box of Dossier */}
              <div className="space-y-2 border-b border-[#3D252E] pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getTraditionBadge(selectedHouse.tradition).color}`}>
                    {getTraditionBadge(selectedHouse.tradition).label}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getEidBadge(selectedHouse.eidPactStandard).color}`}>
                    {getEidBadge(selectedHouse.eidPactStandard).label}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#FAF6EE]">
                  {selectedHouse.name}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#D8CCA9]">
                  <span>🏛️ <strong>Sitz:</strong> {selectedHouse.spiritualSeat}</span>
                  <span>📍 <strong>Ort:</strong> {selectedHouse.city}, {selectedHouse.country}</span>
                  <span>⏳ <strong>Gründung:</strong> {selectedHouse.founded}</span>
                </div>
              </div>

              {/* Peace Mission & Holy Significance */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#26131C] border border-[#E5C170]/30 space-y-1.5">
                  <div className="text-xs font-bold text-[#E5C170] uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#E5C170]" />
                    <span>Friedensauftrag & Völkerversöhnung</span>
                  </div>
                  <p className="text-xs text-[#FAF6EE] leading-relaxed">
                    {selectedHouse.peaceMission}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1D1016] border border-[#3D252E] space-y-1.5">
                  <div className="text-xs font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Historische & Spirituelle Bedeutung</span>
                  </div>
                  <p className="text-xs text-[#C5B8A5] leading-relaxed">
                    {selectedHouse.holySignificance}
                  </p>
                </div>

                {/* E-ID Government Standards Card */}
                <div className="p-4 rounded-xl bg-[#1A1813] border border-amber-600/40 space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Staatliche eID-Zertifizierung & Pakt-Beglaubigung</span>
                    </span>
                    <span className="font-mono">{selectedHouse.eidCertificationId}</span>
                  </div>
                  <p className="text-[11px] text-amber-100/80 leading-relaxed">
                    Eingetragen im dezentralen eID-Register unter Einhaltung der BESA-Treueverfassung und des Schweizer/Deutschen Trust-Sicherheitsstandards. 
                    Rechtssichere Beglaubigung im diplomatischen Korpus der <em>Acta Concordiae</em>.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {selectedHouse.officialUrl && (
                  <a
                    href={selectedHouse.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5C170] hover:bg-[#F2D48C] text-[#120B0E] font-bold text-xs transition-colors shadow-md"
                  >
                    <span>Offizielles Portal öffnen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {selectedHouse.contactEmail && onComposeToEmail && (
                  <button
                    onClick={() => {
                      onComposeToEmail(selectedHouse.contactEmail, selectedHouse.name);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F1521] hover:bg-[#451C2F] text-[#FAF6EE] border border-[#E5C170]/40 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E5C170]" />
                    <span>Friedensbrief an {selectedHouse.contactEmail}</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="lg:col-span-7 p-12 text-center text-stone-500">
              Bitte wählen Sie ein spirituelles Haus aus der linken Liste.
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-[#140C0F] border-t border-[#3D252E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A796E] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Aktiver eID-Pakt: 10 globale & europäische Friedenssitze harmonisiert</span>
          </div>
          <span>BESA eID • Schweizerische Eidgenossenschaft • eIDAS DEU-TR03110</span>
        </div>

      </div>
    </div>
  );
};
