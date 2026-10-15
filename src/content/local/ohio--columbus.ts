import { defineLocal } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const oh = K.st('ohio');
const find = (slug: string) => { const l = oh.local.find((x) => x.slug === slug); if (!l) throw new Error(slug); return l; };
const cbus = find('columbus-municipal-income-tax-wages-and-net-profits');
const cle = find('cleveland-municipal-income-tax-cca');
const tol = find('toledo-municipal-income-tax');
const day = find('dayton-municipal-income-tax');
const cin = find('cincinnati-municipal-income-tax');
const akr = find('akron-municipal-income-tax');
const PROFIT = 75000;
const r = K.solo({ profit: PROFIT, filing: 'single', localRate: cbus.rate as number });
/** Read on tax.ohio.gov, 2026-10-15 (research/states/ohio.json). */
const CAT = 'https://tax.ohio.gov/static/commercial_activities/information_releases/CAT_2023-01_info_release.pdf';

export default defineLocal({
  state: 'ohio',
  place: 'columbus',
  tax: 'columbus-municipal-income-tax-wages-and-net-profits',
  name: 'Columbus',
  title: 'Columbus Income Tax 2026: 2.5% on Self-Employment Profit',
  description: `Columbus income tax in 2026: ${cbus.rateText} on residents' wages and business net profits, a credit for tax paid elsewhere, and how Cleveland, Toledo and Dayton compare.`,
  h1: 'Columbus city income tax on self-employment income, 2026',
  intro: 'In Ohio the city, not only the state, taxes a freelancer\'s net profit, and Columbus charges the rate most large Ohio cities use.',
  resume: `Columbus taxes its residents at ${cbus.rateText} on all their income, wages and business net profits alike, wherever the money is earned. Nonresidents pay on the income they earn in Columbus, and a business pays on the share of its net profit apportioned to the city. Residents who already paid tax to the city where they work get a 100% credit for it, up to ${cbus.rateText}, so a resident never pays the full rate twice. On ${K.usd(PROFIT)} of net profit, the Columbus tax is ${K.usd(r.localTax)}, before any credit. The other large Ohio cities sit close by: Cleveland, Toledo and Dayton also charge ${cle.rateText}, while Cincinnati and Akron set their own rates on their websites. Ohio's own 2026 income tax schedule could not be confirmed on an official page, so the calculator above shows federal tax and the city tax, and leaves the state line out until the schedule is verified.`,
  body: (h) => `<p>Ohio is one of the few states where the city income tax is the norm rather than the exception, and it treats business profit the same way as wages. A self-employed resident of Columbus reports Schedule C net profit to the city's Income Tax Division and pays ${cbus.rateText} on it, along with any wages or other taxable income (${h.ext(cbus.url, 'City of Columbus Income Tax Division')}).</p>
${h.mini('localQuick', { l: cbus.slug })}
<h2>Residents, nonresidents and the credit</h2>
<p>The Columbus tax has two reaches. Residents are taxed on all their income, including profit from clients in other cities or states. Nonresidents are taxed only on what they earn in Columbus, and a business that operates in several cities apportions its net profit among them. For a resident who works in another taxing city, Columbus gives a credit of 100% of the tax paid there, up to ${cbus.rateText}. A freelancer who lives in Columbus and rents a studio in a neighboring city with the same rate therefore pays the full tax once, split between the two.</p>
<h2>How the other big Ohio cities compare</h2>
<p>Cleveland's tax, collected by the Central Collection Agency, is ${cle.rateText} with a 100% resident credit up to the same limit (${h.ext(cle.url, 'CCA tax rates')}). Toledo has applied ${tol.rateText} since 2021 (${h.ext(tol.url, 'City of Toledo')}). Dayton's ${day.rateText} combines a 2.25% base with a 0.25% increase in force from 2025 to the end of 2032 (${h.ext(day.url, 'City of Dayton')}). Cincinnati and Akron also tax wages and Schedule C profit; their current rates are posted by the ${h.ext(cin.url, 'Cincinnati income tax office')} and the ${h.ext(akr.url, 'Akron finance department')}.</p>
<p>When a business is organized as an S corporation or an LLC taxed as one, most Ohio cities tax its net profit at the entity level, and the owner's salary as wages. The profit does not disappear from the city's reach with the S election, unlike the federal self-employment tax.</p>
<h2>The state layer and the LLC</h2>
<p>Ohio's legislature reshaped its income tax brackets for 2026, and the official worksheet and the amended statute did not agree on the day of reading. The ${h.a('state:ohio', 'Ohio page')} explains what is known; until the schedule is confirmed, the calculators on this site leave the Ohio line at zero rather than guess. On the LLC side, Ohio asks no annual report and has no franchise tax on LLCs. Its Commercial Activity Tax applies only to businesses with Ohio taxable gross receipts above $6 million for 2025 and later (${h.ext(CAT, 'Ohio Department of Taxation')}), so a freelancer's state cost after formation is close to nothing.</p>
<p>The city tax is due on top of federal self-employment and income tax of ${K.usd(r.federalTotal)} on the same ${K.usd(PROFIT)}, single filer. The ${h.a('quarterly-estimated-taxes', 'quarterly estimated tax guide')} covers the federal payments; the city's own filing and payment dates are posted by its Income Tax Division.</p>`,
  faqs: [
    { q: 'Do Columbus residents pay city tax on self-employment income earned outside Columbus?', a: `Yes. Columbus taxes residents at ${cbus.rateText} on all their income, including business net profit from work done elsewhere. If another city has already taxed part of that income, the resident gets a credit of 100% of that tax, up to ${cbus.rateText}, so the total local rate on the same dollar does not exceed the Columbus rate.` },
    { q: 'What credit does Columbus give for tax paid to another Ohio city?', a: `A full credit, up to ${cbus.rateText}. A Columbus resident who pays city income tax where they work deducts that amount from the Columbus tax on the same income. If the other city's rate is lower, Columbus collects the difference; if it is equal, nothing more is owed to Columbus on that income.` },
    { q: 'Is the Columbus income tax rate the same as Cleveland\'s?', a: `Yes, for 2026 both are ${cbus.rateText}, and both give residents a full credit up to that rate for tax paid to another city. Toledo and Dayton also charge ${tol.rateText}. Cincinnati and Akron set their own rates, which their city websites publish. Every rate applies to wages and to business net profit alike.` },
  ],
  related: ['local-business-taxes', 'state:ohio', 'quarterly-estimated-taxes', 'state-income-tax'],
});
