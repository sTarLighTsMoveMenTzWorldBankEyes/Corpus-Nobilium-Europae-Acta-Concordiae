/**
 * Verification script for URLs in the European Noble Houses directory.
 * Can be run with: npx tsx scripts/verify-urls.ts
 */

import { allHouses } from '../src/data';

interface UrlCheckResult {
  houseId: string;
  houseName: string;
  urlType: string;
  url: string;
  status: number | string;
  ok: boolean;
}

export async function verifyUrls(sampleSize?: number): Promise<void> {
  const housesToCheck = sampleSize ? allHouses.slice(0, sampleSize) : allHouses;
  console.log(`Starting URL verification for ${housesToCheck.length} houses...`);

  const results: UrlCheckResult[] = [];
  let totalUrls = 0;

  for (const house of housesToCheck) {
    const urlsToCheck: Array<{ type: string; url?: string }> = [
      { type: 'official', url: house.urls.official },
      { type: 'archive', url: house.urls.archive },
      { type: 'museum', url: house.urls.museum },
      { type: 'foundation', url: house.urls.foundation },
      { type: 'encyclopedia', url: house.urls.encyclopedia }
    ];

    for (const { type, url } of urlsToCheck) {
      if (!url) continue;
      totalUrls++;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Corpus-Nobilium-Verifier/1.0'
          }
        });
        clearTimeout(timeout);

        results.push({
          houseId: house.id,
          houseName: house.name,
          urlType: type,
          url,
          status: response.status,
          ok: response.status >= 200 && response.status < 400
        });
      } catch (err: any) {
        results.push({
          houseId: house.id,
          houseName: house.name,
          urlType: type,
          url,
          status: err?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
          ok: false
        });
      }
    }
  }

  const successful = results.filter((r) => r.ok).length;
  console.log(`\nVerification Summary:`);
  console.log(`Total URLs checked: ${totalUrls}`);
  console.log(`Successful (Status 200/300): ${successful}`);
  console.log(`Errors/Timeouts: ${totalUrls - successful}`);
}

// If invoked directly via CLI
if (process.argv[1]?.endsWith('verify-urls.ts')) {
  verifyUrls(10).then(() => {
    console.log('Sample verification completed.');
  });
}
