/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES, STATE_PAGES, LOCAL_PAGES, stateId, localId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, label } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Free calculators for US self-employed people, tax year 2026: self-employment tax (15.3% on 92.35% of profit, Social Security wage base $184,500 in 2026 and $192,300 in 2027), federal income tax with the 2026 brackets and standard deduction of Rev. Proc. 2025-32, QBI deduction (thresholds $201,750 / $403,500, new $400 minimum), quarterly estimated taxes (Form 1040-ES 2026, safe harbor 100% / 110%), and the choice of business structure (sole proprietorship, LLC, S corp, C corp) with payroll taxes and state entity taxes. One page per state with LLC filing and annual fees, franchise or minimum taxes, 2026 income tax brackets and local taxes on business income, each figure linked to the agency page it was read on. No email asked. Independent site published by Radif Partners, not affiliated with the IRS. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## States', ...STATE_PAGES.map((s) => `- [${label(stateId(s.slug))}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`), '',
    '## City and county taxes', ...LOCAL_PAGES.map((c) => `- [${label(localId(c.state, c.place))}](${SITE_URL}${route(localId(c.state, c.place), 'en')}): ${c.intro}`), '',
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
