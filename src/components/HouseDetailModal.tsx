import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Mail, 
  Copy, 
  Check, 
  Landmark, 
  Shield, 
  ShieldCheck,
  Calendar, 
  MapPin, 
  BookOpen, 
  FileText, 
  Building2, 
  Globe, 
  Archive,
  Sparkles
} from 'lucide-react';
import { House, DiplomaticStatus, DIPLOMATIC_STATUS_MAP } from '../types';
import { HeraldicShield } from './HeraldicShield';
import { BesaEidBadge } from './BesaEidBadge';

interface HouseDetailModalProps {
  house: House | null;
  onClose: () => void;
  onOpenDispatcherForHouse?: (house: House) => void;
}

export const HouseDetailModal: React.FC<HouseDetailModalProps> = ({ 
  house, 
  onClose,
  onOpenDispatcherForHouse
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!house) return null;

  const diplomaticStatus: DiplomaticStatus = 
    house.DiplomaticStatus || house.diplomaticStatus || 'Consulting';
  const statusConfig = DIPLOMATIC_STATUS_MAP[diplomaticStatus] || DIPLOMATIC_STATUS_MAP.Consulting;

  const handleCopyEmail = (emailText: string) => {
    navigator.clipboard.writeText(emailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#FAF8F3] border border-[#D5C7B2] rounded-xl shadow-2xl overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#1A1215] text-[#FAF6EE] p-5 sm:p-6 border-b border-[#3D282E] relative">
          {/* Gold hairline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#D4C8B8] hover:text-white hover:bg-[#342025] transition-colors"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-[#341B21] text-[#E5C170] border border-[#C5A059]/30">
              {house.type}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#291F22] text-[#BDB0A0]">
              {house.country} • {house.region}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#291F22] text-[#CBBFA6]">
              {house.status}
            </span>
            {/* Diplomatic Status Badge in Header */}
            <span 
              id={`modal-diplomatic-status-badge-${house.id}`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold border shadow-2xs ${
                diplomaticStatus === 'Active'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : diplomaticStatus === 'Consulting'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  : 'bg-stone-900 text-stone-300 border-stone-600/40'
              }`}
              title={`Diplomatischer Status: ${statusConfig.labelEn} (${statusConfig.labelDe})`}
            >
              <Sparkles className="w-3 h-3 text-[#E5C170]" />
              <span>Diplomatic Status: {statusConfig.labelEn}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6EE] tracking-tight">
            {house.name}
          </h2>

          {house.altNames && house.altNames.length > 0 && (
            <p className="text-xs sm:text-sm text-[#C2B5A3] mt-1 italic font-serif">
              Historische Bezeichnungen: {house.altNames.join(' • ')}
            </p>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-[#382E25]">
          {/* Acta Concordiae Masterplan Engagement Block */}
          <div 
            id={`concordia-status-block-${house.id}`}
            className="space-y-3 bg-gradient-to-br from-[#FAF5EC] to-[#F3EADA] p-4 sm:p-5 rounded-xl border border-[#D8C7AF] shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#544538] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8B1E2F]" />
                <span>Acta Concordiae Masterplan • Diplomatischer Status</span>
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeClass} shadow-2xs`}>
                <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
                <span>{statusConfig.labelEn} ({statusConfig.labelDe})</span>
              </span>
            </div>

            <div className="text-xs text-[#42362A] leading-relaxed bg-white/90 backdrop-blur-xs p-3.5 rounded-lg border border-[#E3D4BE] space-y-1.5">
              <div className="font-semibold text-[#1A1215] flex items-center gap-1.5">
                <span>Engagement-Ebene:</span>
                <span className="text-[#8B1E2F]">{statusConfig.shortDesc}</span>
              </div>
              <p className="text-[#5A4B3E] leading-relaxed">
                {statusConfig.roleDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] text-[#7A6B5C]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Registriert im diplomatischen Friedensregister der europäischen Häuser</span>
              </div>
              <span className="font-serif italic text-[#8B1E2F]">Concordia parvae res crescunt</span>
            </div>
          </div>

          {/* Heraldry and Coat of Arms Feature Box */}
          <div className="bg-[#FAF7F0] border border-[#DFCDB7] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 shadow-2xs">
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <HeraldicShield
                motif={house.crestMotif}
                houseName={house.name}
                diplomaticStatus={diplomaticStatus}
                size="lg"
                showStatusBorder={true}
              />
              <span className="text-[10px] font-mono text-[#8C7A69] uppercase">
                {diplomaticStatus}
              </span>
            </div>

            <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#8B1E2F] font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Wappenmotiv & Blasonierung</span>
              </div>
              <p className="text-sm font-serif italic text-[#1A1215] leading-relaxed">
                "{house.crestMotif}"
              </p>
              <p className="text-xs text-[#6B5A4B] leading-relaxed">
                Historische Wappenführung des Hauses {house.name} mit traditionellen Feldern, Schildteilungen und heraldischen Schildfiguren.
              </p>
            </div>

            {/* BESA eID Seal Display */}
            <div className="shrink-0 flex flex-col items-center gap-1 bg-[#1A0E13] p-3 rounded-xl border border-[#E5C170]/40">
              <BesaEidBadge
                house={house}
                size="md"
                variant="seal"
              />
              <span className="text-[9px] font-mono text-[#E5C170] font-semibold uppercase">
                BESA eID Validiert
              </span>
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F2ECE1] p-4 rounded-lg border border-[#E0D5C3]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#8B1E2F] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#7A6B5C] font-semibold">
                  Hauptresidenz & Stammsitz
                </div>
                <div className="font-medium text-[#1A1215] mt-0.5">{house.seat}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#8B1E2F] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#7A6B5C] font-semibold">
                  Dynastische Periode / Epoche
                </div>
                <div className="font-medium text-[#1A1215] mt-0.5">{house.period}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#8B1E2F] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#7A6B5C] font-semibold">
                  Trägerstiftung & Institution
                </div>
                <div className="font-medium text-[#1A1215] mt-0.5">{house.institution}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-[#8B1E2F] shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#7A6B5C] font-semibold">
                  Region & Territorium
                </div>
                <div className="font-medium text-[#1A1215] mt-0.5">{house.region} ({house.country})</div>
              </div>
            </div>
          </div>

          {/* Description / Historical significance */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#544538] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8B1E2F]" />
              <span>Historische Bedeutung & Dynastische Rolle</span>
            </h3>
            <p className="text-[#362D24] leading-relaxed font-sans bg-white p-4 rounded-lg border border-[#E3D9C9]">
              {house.description}
            </p>
          </div>

          {/* Verified Web Links & Archives */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#544538] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#8B1E2F]" />
              <span>Verifizierte Primärquellen & Webpräsenzen</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {house.urls.official && (
                <a
                  href={house.urls.official}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-white border border-[#DCD0BE] hover:border-[#8B1E2F] hover:bg-[#FDFCF9] text-[#221B17] transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Globe className="w-3.5 h-3.5 text-[#8B1E2F]" />
                    <span>Offizielle Webpräsenz</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8B7A6A] group-hover:text-[#8B1E2F] transition-colors" />
                </a>
              )}

              {house.urls.archive && (
                <a
                  href={house.urls.archive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-white border border-[#DCD0BE] hover:border-[#8B1E2F] hover:bg-[#FDFCF9] text-[#221B17] transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Archive className="w-3.5 h-3.5 text-[#8B1E2F]" />
                    <span>Hausarchiv & Quellenbestand</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8B7A6A] group-hover:text-[#8B1E2F] transition-colors" />
                </a>
              )}

              {house.urls.museum && (
                <a
                  href={house.urls.museum}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-white border border-[#DCD0BE] hover:border-[#8B1E2F] hover:bg-[#FDFCF9] text-[#221B17] transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Landmark className="w-3.5 h-3.5 text-[#8B1E2F]" />
                    <span>Museum / Sammlungsstätte</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8B7A6A] group-hover:text-[#8B1E2F] transition-colors" />
                </a>
              )}

              {house.urls.foundation && (
                <a
                  href={house.urls.foundation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-white border border-[#DCD0BE] hover:border-[#8B1E2F] hover:bg-[#FDFCF9] text-[#221B17] transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Building2 className="w-3.5 h-3.5 text-[#8B1E2F]" />
                    <span>Stiftung / Kulturfonds</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8B7A6A] group-hover:text-[#8B1E2F] transition-colors" />
                </a>
              )}

              {house.urls.encyclopedia && (
                <a
                  href={house.urls.encyclopedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-white border border-[#DCD0BE] hover:border-[#8B1E2F] hover:bg-[#FDFCF9] text-[#221B17] transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-[#8B1E2F]" />
                    <span>Enzyklopädie & Historiographie</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8B7A6A] group-hover:text-[#8B1E2F] transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Official Administrative Contact / Register E-Mail */}
          <div className="space-y-3 bg-[#F4EFE6] p-4 rounded-xl border border-[#DDD2C0]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#544538] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8B1E2F]" />
                <span>Verifizierte Kanzlei- & Archivadresse (True Evidence)</span>
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Echtheits-Nachweis bestätigt</span>
              </span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-white border border-[#D5C7B2] rounded-lg text-xs font-mono text-[#8B1E2F] font-semibold select-all overflow-x-auto shadow-2xs">
                {house.email}
              </code>
              
              <button
                id="copy-email-btn"
                onClick={() => handleCopyEmail(house.email)}
                className="px-3 py-2 bg-white hover:bg-[#FAF8F3] border border-[#D5C7B2] text-[#4F4135] rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="E-Mail-Adresse kopieren"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Kopiert' : 'Kopieren'}</span>
              </button>

              <a
                href={`mailto:${house.email}`}
                className="px-3 py-2 bg-[#8B1E2F] hover:bg-[#6D1623] text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                title="E-Mail-Programm direkt öffnen"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Schreiben</span>
              </a>

              {onOpenDispatcherForHouse && (
                <button
                  id="open-dispatcher-for-house-btn"
                  onClick={() => onOpenDispatcherForHouse(house)}
                  className="px-3 py-2 bg-[#1A1215] hover:bg-[#2F1D22] text-[#E5C170] border border-[#C5A059]/40 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  title="Im diplomatischen Rundschreiben-Dispatcher öffnen"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E5C170]" />
                  <span>In Dispatcher laden</span>
                </button>
              )}
            </div>

            <div className="text-[11px] text-[#786A5C] leading-normal pt-1 flex flex-col gap-1">
              <div>
                <strong>True Evidence Register:</strong> Verwaltet durch <span className="text-[#1A1215] font-medium">{house.institution}</span> (Residenzsitz: {house.seat}, {house.country}).
              </div>
              <div className="text-[10.5px] text-[#8C7D6E]">
                Ausschließlich verifizierte, amtliche Archiv- und Schlossverwaltungsadressen. Keine privaten Kontaktdaten natürlicher Personen.
              </div>
            </div>
          </div>

          {/* Source and Verification Stand */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#7A6B5C] border-t border-[#E3D9C9]">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#8B1E2F]" />
              <span>Quellennachweis: <strong>{house.source}</strong></span>
            </div>
            <div>
              <span>Stand der Verifikation: <strong>{house.verifiedAt}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#EFEAE0] px-5 py-3 border-t border-[#D5C7B2] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1215] hover:bg-[#2F1D22] text-[#FAF6EE] rounded-md text-xs font-medium transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
