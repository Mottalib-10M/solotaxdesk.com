/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md):
 *  - a topic page with its calculator: `src/content/guides/<id>.ts` (GuideDef), route /en/<slug>/;
 *  - a state page: `src/content/states/<state-slug>.ts` (StateDef), route /en/<state-slug>/;
 *  - a city or county tax page: `src/content/local/<state-slug>--<place-slug>.ts` (LocalDef), route /en/<state-slug>/<place-slug>/.
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

export interface Helpers extends Kit {
  /** Internal link by page id ("llc-vs-s-corp", "state:texas", "local:new-york/new-york-city", "method"). Unknown id = failed test. */
  a: (id: string, text: string) => string;
  /** Table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source of params-2026.json (key), with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL that was read. */
  ext: (url: string, text: string) => string;
  /** Ruled note. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator, rendered as an island: `${h.mini('kind', arg)}`. */
  mini: (kind: string, arg?: unknown) => string;
}

export type Group = 'tax' | 'quarterly' | 'structure' | 'llc';
export type ToolKind =
  | 'total' | 'se' | 'quarterly' | 'safe-harbor' | 'penalty' | 'schedule-c' | 'qbi' | 'home-office' | 'deductions'
  | 'w2-vs-1099' | 'set-aside' | 'health' | 'retirement' | 'mileage' | 'nec'
  | 'scorp' | 'scorp-tax' | 'breakeven' | 'compare' | 'ccorp' | 'llc-cost' | 'salary' | 'election' | 'llc-tax' | 'state-compare' | 'local';

export interface GuideDef {
  id: string; group: Group; order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  /** Menu label and card line. */
  nav: string; card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string; intro: string;
  /** ONE paragraph of 120 words or more: the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  tool: ToolKind;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const defineGuide = (p: GuideDef): GuideDef => p;

export interface StateDef {
  /** = file name = state slug ("new-york"). */
  slug: string;
  title: string; description: string; intro: string; resume: string;
  body: (h: Helpers) => string;
  faqs: FAQ[];
  related: string[];
}
export const defineState = (s: StateDef): StateDef => s;

export interface LocalDef {
  /** "new-york". */ state: string;
  /** "new-york-city": key of the local tax in states.json (local[].slug). */ place: string;
  /** Menu label: "New York City". */ name: string;
  title: string; description: string; h1: string; intro: string; resume: string;
  body: (h: Helpers) => string;
  faqs: FAQ[];
  related: string[];
}
export const defineLocal = (c: LocalDef): LocalDef => c;
