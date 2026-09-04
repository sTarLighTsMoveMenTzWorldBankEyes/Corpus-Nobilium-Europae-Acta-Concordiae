import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Globe, 
  Archive, 
  Landmark, 
  Mail, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Sparkles
} from 'lucide-react';
import { House, DiplomaticStatus, DIPLOMATIC_STATUS_MAP } from '../types';
import { BesaEidBadge } from './BesaEidBadge';
import { EngagementSparkline } from './EngagementSparkline';

interface HouseTableProps {
  data: House[];
  onSelectHouse: (house: House) => void;
  onContactHouse?: (house: House) => void;
  isDiplomacyMode?: boolean;
}

const columnHelper = createColumnHelper<House>();

export const HouseTable: React.FC<HouseTableProps> = ({ data, onSelectHouse, onContactHouse, isDiplomacyMode }) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false }
  ]);
  const [pageSize, setPageSize] = useState<number>(25);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-semibold text-left text-xs uppercase tracking-wider text-[#382E25]"
          >
            <span>Haus & Dynastie</span>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-[#A39281]" />
            )}
          </button>
        ),
        cell: (info) => {
          const house = info.row.original;
          return (
            <div className="py-1 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div 
                  onClick={() => onSelectHouse(house)}
                  className="font-serif font-bold text-base text-[#1A1215] hover:text-[#8B1E2F] cursor-pointer transition-colors leading-snug"
                >
                  {house.name}
                </div>
                {house.altNames && house.altNames.length > 0 && (
                  <div className="text-xs text-[#7A6B5C] italic font-serif truncate max-w-xs mt-0.5">
                    {house.altNames[0]}
                  </div>
                )}
              </div>
              <BesaEidBadge
                house={house}
                size="sm"
                variant="card-stamp"
              />
            </div>
          );
        }
      }),

      columnHelper.accessor('country', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-semibold text-left text-xs uppercase tracking-wider text-[#382E25]"
          >
            <span>Land & Region</span>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-[#A39281]" />
            )}
          </button>
        ),
        cell: (info) => {
          const house = info.row.original;
          return (
            <div className="text-xs space-y-0.5">
              <span className="font-semibold text-[#251E18] block">{house.country}</span>
              <span className="text-[11px] text-[#7A6B5C] block truncate max-w-[140px]">{house.region}</span>
            </div>
          );
        }
      }),

      columnHelper.accessor('seat', {
        header: 'Stammsitz / Residenz',
        cell: (info) => (
          <div className="text-xs text-[#3D332A] max-w-[220px] leading-relaxed line-clamp-2">
            {info.getValue()}
          </div>
        )
      }),

      columnHelper.accessor('type', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-semibold text-left text-xs uppercase tracking-wider text-[#382E25]"
          >
            <span>Rangstufe</span>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-[#A39281]" />
            )}
          </button>
        ),
        cell: (info) => (
          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#F4EFE6] text-[#6A1D2A] border border-[#E5D7C3] whitespace-nowrap">
            {info.getValue()}
          </span>
        )
      }),

      columnHelper.accessor((row) => row.DiplomaticStatus || row.diplomaticStatus || 'Consulting', {
        id: 'diplomaticStatus',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-semibold text-left text-xs uppercase tracking-wider text-[#382E25]"
            title="Sortieren nach diplomatischem Status im Acta Concordiae Masterplan"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Acta Status</span>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-[#8B1E2F]" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-[#A39281]" />
            )}
          </button>
        ),
        cell: (info) => {
          const status = info.getValue() as DiplomaticStatus;
          const config = DIPLOMATIC_STATUS_MAP[status] || DIPLOMATIC_STATUS_MAP.Consulting;
          return (
            <span 
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.badgeClass} whitespace-nowrap shadow-2xs`}
              title={`${config.labelDe} (${config.labelEn}) - ${config.shortDesc}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
              <span>{config.labelEn}</span>
            </span>
          );
        }
      }),

      columnHelper.display({
        id: 'trend',
        header: '5-Jahres-Trend',
        cell: (info) => {
          const house = info.row.original as House;
          const status = house.DiplomaticStatus || house.diplomaticStatus || 'Consulting';
          return (
            <EngagementSparkline
              houseId={house.id}
              houseName={house.name}
              status={status}
              width={90}
              height={24}
            />
          );
        }
      }),

      columnHelper.accessor('period', {
        header: 'Epoche',
        cell: (info) => (
          <div className="text-xs text-[#4F4236] max-w-[150px] truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        )
      }),

      columnHelper.accessor('institution', {
        header: 'Institution / Stiftung',
        cell: (info) => (
          <div className="text-xs text-[#524438] max-w-[180px] truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        )
      }),

      columnHelper.display({
        id: 'links',
        header: 'Quellen',
        cell: (info) => {
          const house = info.row.original;
          return (
            <div className="flex items-center gap-1">
              {house.urls.official && (
                <a
                  href={house.urls.official}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-[#5D4E3F] hover:text-[#8B1E2F] hover:bg-[#F2ECE1] transition-colors"
                  title="Offizielle Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {house.urls.archive && (
                <a
                  href={house.urls.archive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-[#5D4E3F] hover:text-[#8B1E2F] hover:bg-[#F2ECE1] transition-colors"
                  title="Archiv / Quellenbestand"
                >
                  <Archive className="w-4 h-4" />
                </a>
              )}
              {house.urls.museum && (
                <a
                  href={house.urls.museum}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-[#5D4E3F] hover:text-[#8B1E2F] hover:bg-[#F2ECE1] transition-colors"
                  title="Museum / Schloss"
                >
                  <Landmark className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        }
      }),

      columnHelper.accessor('email', {
        header: 'Kontakt',
        cell: (info) => {
          const email = info.getValue();
          return (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 text-xs text-[#6A1D2A] hover:text-[#420E17] max-w-[140px] truncate font-mono"
              title={email}
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{email}</span>
            </a>
          );
        }
      }),

      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => {
          const house = info.row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                id={`table-contact-btn-${house.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onContactHouse) {
                    onContactHouse(house);
                  } else {
                    window.location.href = `mailto:${house.email}`;
                  }
                }}
                className="p-1.5 rounded hover:bg-[#8B1E2F]/15 text-[#8B1E2F] hover:text-[#6D1623] transition-colors cursor-pointer"
                title={`E-Mail verfassen an: ${house.name} (${house.email})`}
              >
                <Mail className="w-3.5 h-3.5" />
              </button>

              <button
                id={`table-view-btn-${house.id}`}
                onClick={() => onSelectHouse(house)}
                className="p-1.5 rounded hover:bg-[#EFEAE0] text-[#7A6957] hover:text-[#1A1215] transition-colors cursor-pointer"
                title="Vollständiges Verzeichnisblatt öffnen"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        }
      })
    ],
    [onSelectHouse, onContactHouse]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 25
      }
    }
  });

  return (
    <div className="bg-white border border-[#E3D9C9] rounded-xl shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[#FAF7F2] border-b border-[#E3D9C9]">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3 px-4 text-xs font-semibold text-[#544639]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#EFEAE0]">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const house = row.original as House;
                const isNotActive = isDiplomacyMode && (house.DiplomaticStatus || house.diplomaticStatus) !== 'Active';
                return (
                  <tr
                    key={row.id}
                    className={`transition-all group ${
                      isNotActive
                        ? 'opacity-35 grayscale hover:opacity-100'
                        : isDiplomacyMode
                        ? 'bg-emerald-50/20 ring-1 ring-emerald-500/30'
                        : 'hover:bg-[#FDFBF7]'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-sm text-[#7A6B5C]">
                  Keine Adelshäuser für diese Such- und Filterkriterien gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 bg-[#FAF7F2] border-t border-[#E3D9C9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C4D3F]">
        <div className="flex items-center gap-2">
          <span>Zeige</span>
          <select
            id="page-size-select"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPageSize(val);
              table.setPageSize(val);
            }}
            className="px-2 py-1 bg-white border border-[#D5C7B2] rounded text-xs text-[#2A221B] focus:outline-none"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={data.length}>Alle ({data.length})</option>
          </select>
          <span>Einträge pro Seite</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Seite <strong>{table.getState().pagination.pageIndex + 1}</strong> von{' '}
            <strong>{table.getPageCount() || 1}</strong> ({data.length} Häuser)
          </span>

          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded bg-white border border-[#D5C7B2] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F2ECE1] transition-colors"
              title="Erste Seite"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded bg-white border border-[#D5C7B2] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F2ECE1] transition-colors"
              title="Vorherige Seite"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded bg-white border border-[#D5C7B2] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F2ECE1] transition-colors"
              title="Nächste Seite"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded bg-white border border-[#D5C7B2] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F2ECE1] transition-colors"
              title="Letzte Seite"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
