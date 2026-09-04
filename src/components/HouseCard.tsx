import React from 'react';
import { Landmark, MapPin, Globe, Mail, Eye, Shield, Sparkles } from 'lucide-react';
import { House, DiplomaticStatus, DIPLOMATIC_STATUS_MAP } from '../types';
import { HeraldicShield } from './HeraldicShield';
import { BesaEidBadge } from './BesaEidBadge';
import { EngagementSparkline } from './EngagementSparkline';

interface HouseCardProps {
  house: House;
  onSelect: (house: House) => void;
  onContact?: (house: House) => void;
  isDiplomacyMode?: boolean;
}

export const HouseCard: React.FC<HouseCardProps> = ({ house, onSelect, onContact, isDiplomacyMode }) => {
  const diplomaticStatus: DiplomaticStatus = 
    house.DiplomaticStatus || house.diplomaticStatus || 'Consulting';
  const statusConfig = DIPLOMATIC_STATUS_MAP[diplomaticStatus] || DIPLOMATIC_STATUS_MAP.Consulting;
  const isNotActive = isDiplomacyMode && diplomaticStatus !== 'Active';

  return (
    <div 
      id={`house-card-${house.id}`}
      className={`bg-white border rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between group ${
        isNotActive
          ? 'opacity-35 grayscale hover:opacity-100 border-[#E3D9C9]'
          : isDiplomacyMode
          ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 bg-emerald-50/10 shadow-md'
          : 'border-[#E3D9C9] hover:border-[#8B1E2F]/60 hover:shadow-md'
      }`}
    >
      <div className="space-y-3">
        {/* Top Badges & BESA eID Seal */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#F5EFEB] text-[#8B1E2F] border border-[#8B1E2F]/20">
              {house.type}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F0EBE1] text-[#55473B]">
              {house.country}
            </span>
          </div>

          <BesaEidBadge 
            house={house}
            variant="card-stamp"
            size="sm"
          />
        </div>

        {/* Diplomatic Status (Acta Concordiae Masterplan) */}
        <div 
          id={`diplomatic-status-badge-${house.id}`}
          className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${statusConfig.badgeClass}`}
          title={`Acta Concordiae Friedensengagement: ${statusConfig.labelDe} (${statusConfig.labelEn}) - ${statusConfig.roleDescription}`}
        >
          <div className="flex items-center gap-1.5 font-medium text-[11px]">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span className="tracking-tight text-[#4A3B2C]">Acta Concordiae:</span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-semibold text-[11px]">
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
            <span>{statusConfig.labelEn}</span>
          </div>
        </div>

        {/* 5-Year Engagement Sparkline Trend */}
        <div className="flex items-center justify-between text-xs bg-[#FAF7F2] px-2.5 py-1.5 rounded-lg border border-[#EFE5D8]">
          <span className="text-[11px] text-[#6C5D50] font-medium">5-Jahre Trend ('22-'26):</span>
          <EngagementSparkline
            houseId={house.id}
            houseName={house.name}
            status={diplomaticStatus}
            width={100}
            height={24}
          />
        </div>

        {/* House Name & Subtitle */}
        <div>
          <h3 
            onClick={() => onSelect(house)}
            className="text-lg font-serif font-bold text-[#1A1215] group-hover:text-[#8B1E2F] transition-colors cursor-pointer leading-snug"
          >
            {house.name}
          </h3>
          {house.altNames && house.altNames.length > 0 && (
            <p className="text-xs text-[#7A6B5C] italic font-serif line-clamp-1 mt-0.5">
              {house.altNames[0]}
            </p>
          )}
        </div>

        {/* Seat / Residenz */}
        <div className="flex items-start gap-2 text-xs text-[#4A3E33]">
          <MapPin className="w-3.5 h-3.5 text-[#8B1E2F] shrink-0 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed">{house.seat}</span>
        </div>

        {/* Heraldic motif snippet with visual Shield */}
        <div className="flex items-center gap-3 text-xs text-[#6B5D4E] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EDE4D6]">
          <div className="shrink-0">
            <HeraldicShield
              motif={house.crestMotif}
              houseName={house.name}
              diplomaticStatus={diplomaticStatus}
              size="sm"
            />
          </div>
          <span className="line-clamp-2 italic text-[11px] leading-relaxed text-[#42352B]">
            "{house.crestMotif}"
          </span>
        </div>

        {/* Institution */}
        <div className="flex items-center gap-1.5 text-xs text-[#7A6B5C]">
          <Landmark className="w-3.5 h-3.5 text-[#A39281] shrink-0" />
          <span className="truncate">{house.institution}</span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-[#EFE8DC] flex items-center justify-between gap-2 text-xs">
        <button
          id={`view-details-btn-${house.id}`}
          onClick={() => onSelect(house)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF6EE] hover:bg-[#F0EAE0] text-[#1A1215] border border-[#D5C7B2] font-medium transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#8B1E2F]" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-1.5">
          {house.email && (
            <button
              id={`contact-house-btn-${house.id}`}
              onClick={() => onContact ? onContact(house) : (window.location.href = `mailto:${house.email}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#8B1E2F]/10 hover:bg-[#8B1E2F] text-[#8B1E2F] hover:text-white font-medium text-[11px] transition-colors cursor-pointer"
              title={`E-Mail verfassen an ${house.name} (${house.email})`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Anschreiben</span>
            </button>
          )}

          {house.urls.official && (
            <a
              href={house.urls.official}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-[#6E5E4E] hover:text-[#8B1E2F] hover:bg-[#F5EFEB] transition-colors"
              title="Offizielle Website öffnen"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
