/** State data (src/data/states.json, built by scripts/build-states.py from research/states/*.json, every figure
 *  with its official source URL and date of reading). */
import RAW from '../data/states.json';
import type { StateTax } from './engine/tax';

export interface Source { id: number; url: string; title: string; quote?: string }
export interface LocalTax { slug: string; place: string; name: string; rate: number | null; rateText: string; applies: string; threshold: string; url: string; quote?: string; selfEmployed: boolean }
export interface StateFull extends StateTax {
  llcDetail: { formationDoc: string | null; annualName: string | null; due: string | null; notes: string[]; sources: Source[] };
  incomeDetail: { surtaxes: string | null; notes: string[]; sources: Source[] };
  scorpDetail: { taxes: Array<{ name: string; text: string; url: string | null }>; pte: string | null; sources: Source[] };
  estimated: { rule: string | null; dates: string[]; notes: string | null; url: string | null };
  sutaDetail: { notes: string | null; url: string | null };
  local: LocalTax[];
  notable: string[];
  uncertain: string[];
}
export const STATES = RAW as unknown as StateFull[];
export function bySlug(slug: string): StateFull {
  const s = STATES.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown state ${slug}`);
  return s;
}
export const byAbbr = (abbr: string) => STATES.find((x) => x.abbr === abbr);
