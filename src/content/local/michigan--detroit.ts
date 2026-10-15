import { defineLocal } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const mi = K.st('michigan');
const find = (slug: string) => { const l = mi.local.find((x) => x.slug === slug); if (!l) throw new Error(slug); return l; };
const det = find('detroit-city-of-detroit-income-tax-administered-by-michigan-');
const gr = find('grand-rapids-city-income-tax');
const uni = find('albion-battle-creek-benton-harbor-big-rapids-east-lansing-fl');
const PROFIT = 75000, EXEMPTION = 600;
const rate = det.rate as number;
const r = K.solo({ profit: PROFIT, filing: 'single', state: mi, localRate: rate });
const cityTax = (PROFIT - EXEMPTION) * rate;
/** Read on michigan.gov, 2026-10-15 (research/states/michigan.json). */
const MI_RATE = 'https://www.michigan.gov/treasury/news/2026/04/15/state-individual-income-tax-rate-for-2026-tax-year-determined';
const LLC_FORM = 'https://www.michigan.gov/lara/-/media/Project/Websites/lara/cscl/NonImages_new/Corps/forms/llc/700-0725.pdf';

export default defineLocal({
  state: 'michigan',
  place: 'detroit',
  tax: 'detroit-city-of-detroit-income-tax-administered-by-michigan-',
  name: 'Detroit',
  title: 'Detroit City Income Tax 2026: Resident and Nonresident Rates',
  description: `Detroit city income tax in 2026: ${det.rateText} for residents on all income, self-employment profit included, 1.2% for nonresidents and $600 off for each exemption.`,
  h1: 'Detroit city income tax for the self-employed in 2026',
  intro: 'Detroit taxes the business profit of its residents as income, and the Michigan Treasury, not the city, collects it.',
  resume: `Detroit residents pay a city income tax of ${det.rateText} on all their income in 2026, net profit from self-employment included, and nonresidents pay 1.2% on income earned in Detroit. Each personal exemption takes $600 off the taxable amount. The tax is administered by the Michigan Department of Treasury rather than the city, so freelancers deal with the same agency for both returns. On ${K.usd(PROFIT)} of profit, a single Detroit resident owes about ${K.usd(cityTax)} to the city after one exemption, on top of Michigan's flat ${K.rate(mi.income.flat as number)}, which stays unchanged for 2026. Corporations pay a separate Detroit corporate income tax, so a business taxed as a corporation files that version instead. Detroit is one of 24 Michigan cities with an income tax: Grand Rapids charges ${gr.rateText} to residents, and about twenty smaller cities, from Lansing to Flint, apply the rates of the Uniform City Income Tax Ordinance.`,
  body: (h) => `<p>The Michigan Treasury's 2026 withholding guide for the city sets the rates in one line: ${det.rateText} for residents, multiply by ${K.dec(rate, 3)}, and 1.2% for nonresidents (${h.ext(det.url, 'Michigan Treasury, Detroit income tax 2026')}). For an employee the employer withholds it. A self-employed resident has no employer, so the tax on Schedule C profit is settled with the annual city return.</p>
${h.mini('localQuick', { l: det.slug })}
<h2>What the 2.4% reaches</h2>
<p>Residence settles almost everything. A Detroit resident is taxed on all income, including business profit from clients in the suburbs or out of state. A nonresident is taxed at half the resident rate, and only on income earned in Detroit, which for a freelancer means the share of profit from work done inside the city. Each personal exemption is worth $600 of income, so it lowers the tax by ${K.cents(EXEMPTION * rate)}, a small amount next to the ${K.usd(PROFIT * rate)} that ${det.rateText} of ${K.usd(PROFIT)} produces.</p>
<p>The total bill shows how the city layer compares with the others. On ${K.usd(PROFIT)} of profit, a single filer pays ${K.usd(r.se.total)} of federal self-employment tax, ${K.usd(r.incomeTax)} of federal income tax and ${K.usd(r.stateTax)} of Michigan income tax, before the Detroit tax is added.</p>
<h2>The state rate and the cost of an LLC</h2>
<p>Michigan's individual rate remains ${K.rate(mi.income.flat as number)} for the 2026 tax year: the automatic cut that follows strong state revenue was not triggered (${h.ext(MI_RATE, 'Michigan Treasury, 2026 rate')}). The state personal exemption, on the other hand, grows to ${K.usd(mi.income.exemption?.single ?? 0)} per person for 2026, nearly ten times the city's, and the calculator above subtracts it before applying the state rate. The two exemptions are separate: claiming one on the state return does not change the $600 amount on the Detroit return. Forming a Michigan LLC costs ${K.usd(mi.llc.formation as number)} (${h.ext(LLC_FORM, 'LARA articles of organization')}), and its annual statement ${K.usd(mi.llc.annual as number)}, due each February 15. A single-member LLC pays the city tax exactly like a sole proprietor, since its profit is the owner's.</p>
<h2>Other Michigan cities with an income tax</h2>
<p>Grand Rapids taxes residents at ${gr.rateText} and nonresidents at half that, on income that includes business net profits (${h.ext(gr.url, 'City of Grand Rapids income tax')}). The same Grand Rapids page lists the other cities and their rates. A long group of cities applies the rates of the Uniform City Income Tax Ordinance: ${uni.place}. Their per-exemption amounts differ, from $600 in most of them to more in a few. Saginaw also taxes income, though its current rate could not be confirmed on an official page.</p>
<p>A freelancer who lives in one of these cities and works in another files in both. The ${h.a('state:michigan', 'Michigan page')} covers the state rules, and the ${h.a('local-business-taxes', 'local business taxes guide')} compares Detroit with cities in Ohio, Pennsylvania and Missouri.</p>`,
  faqs: [
    { q: 'Do Detroit residents pay city tax on freelance income from clients outside Detroit?', a: `Yes. Detroit taxes residents at ${det.rateText} on all their income, including net profit from self-employment, wherever the clients are located. Each personal exemption takes $600 off the taxable amount. Nonresidents are treated differently: they pay only on income earned in Detroit, at half the resident rate.` },
    { q: 'What is the Detroit income tax rate for nonresidents working in the city?', a: `1.2% in 2026, half the ${det.rateText} resident rate, according to the Michigan Treasury's withholding guide for the City of Detroit. A self-employed nonresident applies it to the share of business profit earned from work done inside Detroit, not to income from work elsewhere.` },
    { q: 'Which other Michigan cities tax self-employment profit?', a: `Michigan has 24 cities with an income tax. Grand Rapids charges ${gr.rateText} to residents and half that to nonresidents. Highland Park and about twenty other cities, including Lansing, East Lansing, Flint, Jackson, Pontiac and Muskegon, apply the Uniform City Income Tax Ordinance. Each taxes residents' business net profit along with wages.` },
  ],
  related: ['local-business-taxes', 'state:michigan', 'state-income-tax', 'how-much-to-set-aside'],
});
