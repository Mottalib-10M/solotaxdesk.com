import { defineLocal } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const pa = K.st('pennsylvania');
const find = (slug: string) => { const l = pa.local.find((x) => x.slug === slug); if (!l) throw new Error(slug); return l; };
const npt = find('philadelphia-net-profits-tax-npt');
const birt = find('philadelphia-business-income-and-receipts-tax-birt');
const wage = find('philadelphia-wage-tax-earnings-tax');
const eit = find('pennsylvania-all-municipalities-and-school-districts-outside');
/** Tax year 2026 figures read on phila.gov, 2026-10-15 (research/states/pennsylvania.json): BIRT 5.65% of taxable
 *  net income plus 1.395 mills on gross receipts; NPT nonresident rate 3.425%; 60% of the BIRT net income portion
 *  is credited against NPT. */
const BIRT_NET = 0.0565, BIRT_MILLS = 1.395 / 1000, CREDIT = 0.6, NONRES = 0.03425;
const PROFIT = 75000, RECEIPTS = 120000;
const nptGross = PROFIT * (npt.rate as number);
const birtNet = PROFIT * BIRT_NET, birtGross = RECEIPTS * BIRT_MILLS;
const nptDue = Math.max(0, nptGross - CREDIT * birtNet);
const total = birtNet + birtGross + nptDue;

export default defineLocal({
  state: 'pennsylvania',
  place: 'philadelphia',
  tax: 'philadelphia-net-profits-tax-npt',
  name: 'Philadelphia',
  title: 'Philadelphia Net Profits Tax 2026: NPT and BIRT Rates',
  description: `Philadelphia Net Profits Tax 2026: ${npt.rateText} for residents, plus the BIRT at ${birt.rateText} of net income and a charge on receipts, now with no $100,000 exemption.`,
  h1: 'Philadelphia Net Profits Tax and BIRT for the self-employed, 2026',
  intro: 'Philadelphia taxes a freelancer\'s profit twice, once as business income and once as earnings, with a credit linking the two.',
  resume: `A self-employed Philadelphian owes two city taxes on the same business. The Net Profits Tax (NPT) takes ${npt.rateText} of net profit for residents in tax year 2026 (${K.dec(NONRES * 100, 3)}% for nonresidents on business done in the city), with no minimum: a return is due even at a loss. The Business Income and Receipts Tax (BIRT) applies to every business operating in the city, sole proprietors and LLCs included, at ${birt.rateText} of taxable net income plus 1.395 mills on gross receipts, and since tax year 2025 the old $100,000 receipts exemption no longer applies. A credit equal to 60% of the BIRT net income portion is subtracted from the NPT, so the two do not add up in full. On ${K.usd(PROFIT)} of profit and ${K.usd(RECEIPTS)} of receipts, this page's simplified example comes to about ${K.usd(total)} of city tax, on top of Pennsylvania's flat ${K.rate(pa.income.flat as number)}.`,
  body: (h) => `<p>Most Pennsylvania freelancers pay a local earned income tax of about ${eit.rateText} to their municipality and school district. Philadelphia replaces it with its own, larger system. The Net Profits Tax is the earnings side: residents pay ${npt.rateText} on all their business net profits, even from business conducted outside the city, and nonresidents pay ${K.dec(NONRES * 100, 3)}% on business conducted in Philadelphia (${h.ext(npt.url, 'City of Philadelphia, 2026 rates')}). The calculator above applies the resident rate to the profit you enter.</p>
${h.mini('localQuick', { l: npt.slug })}
<h2>BIRT, the business side</h2>
<p>The Business Income and Receipts Tax is owed by every business doing business in the city, a one-person consultancy as much as a company. For tax year 2026 it has two parts: ${birt.rateText} of taxable net income and 1.395 mills, or $1.395 per $1,000, of gross receipts (${h.ext(birt.url, 'Philadelphia tax rate history')}). Through tax year 2024, businesses with receipts of $100,000 or less were exempt; that exemption no longer applies from tax year 2025, after a legal challenge, so small freelancers now file and pay. The rates are scheduled to fall every year, down to no receipts portion and 2.80% of net income from 2038.</p>
<h2>How the credit links the two taxes</h2>
<p>Paying both taxes in full would tax the same profit twice. Philadelphia softens it with a credit against the NPT equal to 60% of the BIRT net income portion paid. A simplified example with ${K.usd(PROFIT)} of profit and ${K.usd(RECEIPTS)} of receipts, assuming BIRT taxable income equals the Schedule C profit:</p>
<ul>
<li>BIRT on net income: ${K.cents(birtNet)}</li>
<li>BIRT on gross receipts: ${K.cents(birtGross)}</li>
<li>NPT before credit: ${K.cents(nptGross)}</li>
<li>Credit, 60% of the BIRT net income portion: ${K.cents(CREDIT * birtNet)}</li>
<li>NPT after credit: ${K.cents(nptDue)}</li>
</ul>
<p>The total city bill is about ${K.usd(total)}, or ${K.pct(total / PROFIT, 1)} of profit. BIRT has its own deductions and apportionment rules, so the real figure on the return can differ; the Department of Revenue's forms give the exact computation.</p>
<h2>Timing of the 2026 returns</h2>
<p>Both taxes for tax year 2026 are filed in 2027, and the BIRT return is due by April 15, 2027, the same day as the federal return. Compared with tax year 2025, both rates moved down slightly, so a freelancer who set money aside at last year's rates has a small cushion: the resident NPT rate went from 3.74% to ${npt.rateText}, and the BIRT net income rate from 5.71% to ${birt.rateText}.</p>
<h2>If the business becomes an S corporation</h2>
<p>The S election moves the owner's pay into the Wage Tax. From July 1, 2026 to June 30, 2027, it withholds ${wage.rateText} from the wages of residents and ${K.dec(NONRES * 100, 3)}% from nonresidents working in the city (${h.ext(wage.url, 'Philadelphia Wage Tax')}). The corporation still files BIRT. Whether that mix costs less than the NPT route depends on the salary, which the ${h.a('reasonable-salary', 'reasonable salary calculator')} helps estimate.</p>
<p>State tax comes on top of all this, at a flat rate with no standard deduction, as the ${h.a('state:pennsylvania', 'Pennsylvania page')} explains. Pittsburgh, the other large city with its own rates, is listed in the ${h.a('local-business-taxes', 'local business taxes table')}.</p>`,
  faqs: [
    { q: 'Do Philadelphia freelancers pay both BIRT and the Net Profits Tax?', a: `Yes. BIRT taxes the business at ${birt.rateText} of taxable net income plus 1.395 mills on gross receipts, and the NPT taxes the owner's net profits at ${npt.rateText} for residents in 2026. A credit equal to 60% of the BIRT net income portion is taken against the NPT, so the combined bill is lower than the two rates added.` },
    { q: 'Is there still a $100,000 BIRT exemption in Philadelphia?', a: 'No. The exemption for businesses with $100,000 or less of gross receipts no longer applies from tax year 2025, following a legal challenge, according to the City of Philadelphia. A freelancer with small receipts now owes BIRT on all of them, both the gross receipts portion and the net income portion, and files the return.' },
    { q: 'Must I file a Philadelphia Net Profits Tax return if my business lost money?', a: 'Yes. The Net Profits Tax has no filing threshold, and the city requires a return even when the business shows a loss. Residents report all their business net profits, including from business carried on outside Philadelphia; nonresidents report only what was conducted in the city, at the lower nonresident rate.' },
  ],
  related: ['local-business-taxes', 'state:pennsylvania', 'reasonable-salary', 'state-income-tax'],
});
