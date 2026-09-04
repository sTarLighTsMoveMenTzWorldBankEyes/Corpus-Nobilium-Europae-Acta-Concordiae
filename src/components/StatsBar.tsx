import React from 'react';
import { Region } from '../types';
import { regionsList, DirectoryStats } from '../data';

interface StatsBarProps {
  stats: DirectoryStats;
  selectedRegion: Region | 'ALL';
  onSelectRegion: (region: Region | 'ALL') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, selectedRegion, onSelectRegion }) => {
  return (
    <div className="bg-[#F4EFE6] border-b border-[#E3D9C9] py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-semibold text-[#54483B] uppercase tracking-wider text-[11px]">
          Großregionen filtern:
        </span>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            id="region-filter-all"
            onClick={() => onSelectRegion('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedRegion === 'ALL'
                ? 'bg-[#1A1215] text-[#FAF6EE] shadow-sm'
                : 'bg-[#EAE2D3] hover:bg-[#DDD3C2] text-[#42362C]'
            }`}
          >
            Alle Regionen ({stats.total})
          </button>

          {regionsList.map((reg) => {
            const count = stats.byRegion[reg] || 0;
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                id={`region-filter-${reg.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                onClick={() => onSelectRegion(isSelected ? 'ALL' : reg)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#6D1B28] text-white shadow-sm'
                    : 'bg-[#EAE2D3] hover:bg-[#DDD3C2] text-[#42362C]'
                }`}
              >
                <span>{reg}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#50131D] text-white' : 'bg-[#DDD2C0] text-[#55473B]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
