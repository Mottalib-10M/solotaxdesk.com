import { route, type Locale } from './routes';
import { GUIDES, guideById, statePageById, localPageById, STATE_PAGES, stateId } from '../lib/pages';
import { bySlug } from '../lib/data';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Self-employment tax 2026', method: 'How we calculate', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'tax', label: '1099 and SE tax' },
  { id: 'quarterly', label: 'Quarterly taxes' },
  { id: 'structure', label: 'LLC, S corp, C corp' },
  { id: 'llc', label: 'LLC costs and states' },
];
export const label = (id: string, _lang?: Locale) => {
  if (CORE[id]) return CORE[id];
  const g = guideById(id); if (g) return g.nav;
  const s = statePageById(id); if (s) return `${bySlug(s.slug).name} self-employed taxes`;
  const c = localPageById(id); if (c) return `${c.name} business taxes`;
  return id;
};
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length);
}
// Methode : liee en bas de page, hors du menu du haut pour qu'il tienne sur une ligne.
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Every state page from the footer: each is one click from any page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => STATE_PAGES.map((s) => ({ href: route(stateId(s.slug), lang), label: bySlug(s.slug).name }));
