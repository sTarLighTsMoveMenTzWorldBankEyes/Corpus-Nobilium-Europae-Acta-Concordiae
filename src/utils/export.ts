import { House } from '../types';

export function exportToCsv(houses: House[], filename: string = 'Europaeische_Adelshaeuser_Verzeichnis.csv') {
  const headers = [
    'ID',
    'Haus / Dynastie',
    'Alternative Namen',
    'Großregion',
    'Heutiges Land',
    'Historischer Hauptsitz / Residenz',
    'Typus / Rang',
    'Status',
    'Epoche / Dynastische Periode',
    'Offizielle Institution / Trägerstiftung',
    'Offizielle Website',
    'Archiv / Quelle',
    'Museum / Sammlungsstätte',
    'Stiftung / Register',
    'Enzyklopädie / Historischer Eintrag',
    'Öffentliche Kontaktadresse / Register-E-Mail',
    'Wappenmotiv / Heraldische Beschreibung',
    'Historische Bedeutung / Kurzbeschreibung',
    'Verifizierungsstand'
  ];

  const escapeCsv = (str: string | undefined) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = houses.map((h) => [
    escapeCsv(h.id),
    escapeCsv(h.name),
    escapeCsv(h.altNames?.join('; ')),
    escapeCsv(h.region),
    escapeCsv(h.country),
    escapeCsv(h.seat),
    escapeCsv(h.type),
    escapeCsv(h.status),
    escapeCsv(h.period),
    escapeCsv(h.institution),
    escapeCsv(h.urls.official),
    escapeCsv(h.urls.archive),
    escapeCsv(h.urls.museum),
    escapeCsv(h.urls.foundation),
    escapeCsv(h.urls.encyclopedia),
    escapeCsv(h.email),
    escapeCsv(h.crestMotif),
    escapeCsv(h.description),
    escapeCsv(h.verifiedAt)
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJson(houses: House[], filename: string = 'Europaeische_Adelshaeuser_Verzeichnis.json') {
  const jsonContent = JSON.stringify(houses, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
