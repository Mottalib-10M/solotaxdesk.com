import { defineLocal } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ky = K.st('kentucky');
const find = (slug: string) => { const l = ky.local.find((x) => x.slug === slug); if (!l) throw new Error(slug); return l; };
const lex = find('lexington-fayette-urban-county-government-occupational-licen');
const lou = find('louisville-metro-jefferson-county-occupational-license-tax-o');
const PROFIT = 75000;
const r = K.solo({ profit: PROFIT, filing: 'single', state: ky, localRate: lex.rate as number });
/** Read on revenue.ky.gov and sos.ky.gov, 2026-10-15 (research/states/kentucky.json). */
const LLET = 'https://revenue.ky.gov/Business/Corporation-Income-and-Limited-Liability-Entity-Tax/Pages/default.aspx';
const KY_WH = 'https://revenue.ky.gov/Business/Pages/Employer-Payroll-Withholding.aspx';

export default defineLocal({
  state: 'kentucky',
  place: 'lexington',
  tax: 'lexington-fayette-urban-county-government-occupational-licen',
  name: 'Lexington',
  title: 'Lexington Occupational License Fee 2026: 2.25% on Net Profit',
  description: `Lexington occupational license fee in 2026: ${lex.rateText} on compensation and business net profits earned in Fayette County, plus Kentucky's ${K.rate(ky.income.flat as number)} rate and LLC taxes.`,
  h1: 'Lexington occupational license fee on self-employment profit, 2026',
  intro: 'Kentucky lets its cities and counties tax earnings where the work is done, and Lexington-Fayette applies one rate to wages and business profit.',
  resume: `The Lexington-Fayette Urban County Government charges an occupational license fee of ${lex.rateText} on individual compensation and on business net profits earned in Lexington-Fayette County. Despite the name, it works like a flat income tax on the work done in the county: a freelancer with ${K.usd(PROFIT)} of net profit from work there owes about ${K.usd(r.localTax)}. A school board tax may apply to some items, but its scope could not be confirmed on an official page. At the state level, Kentucky taxes income at a flat ${K.rate(ky.income.flat as number)} for 2026, which comes to ${K.usd(r.stateTax)} on the same profit for a single filer. A Kentucky LLC adds a ${K.usd(ky.llc.annual as number)} annual report and the ${K.usd(ky.llc.minTax)} minimum Limited Liability Entity Tax, which applies even to single-member LLCs. Louisville Metro levies its own occupational license tax on wages and net profits, but its rate could not be read on an official page and is not given here.`,
  body: (h) => `<p>Kentucky is unusual in how its local governments raise money. Instead of a city income tax tied to residence, many cities and counties levy an occupational license tax on the wages and business profits earned within their borders. Lexington and Fayette County merged into a single government, so one charge covers the whole county: ${lex.rateText} on individual compensation and net profits (${h.ext(lex.url, 'LFUCG Division of Revenue')}).</p>
${h.mini('localQuick', { l: lex.slug })}
<h2>Where the work is done, not where you live</h2>
<p>The fee follows the place of work. A freelancer who lives in a neighboring county and works for Lexington clients from an office in the city owes it on the profit earned there; a Lexington resident who works entirely elsewhere may owe the local tax of that other place instead. The base is net profit, so expenses on Schedule C reduce it, and the rate is flat: ${lex.rateText} of the first dollar as of the last. The school board tax that can apply on some items is not included in the calculator above, because its scope was not confirmed.</p>
<p>Put the three layers together for a single filer with ${K.usd(PROFIT)} of profit earned in Lexington: ${K.usd(r.federalTotal)} of federal income and self-employment tax, ${K.usd(r.stateTax)} to Kentucky and ${K.usd(r.localTax)} to LFUCG, or ${K.usd(r.total)} in all. The local fee is the smallest of the three, and it has no standard deduction or personal exemption of its own.</p>
<h2>The state rate cut and the LLC entity tax</h2>
<p>Kentucky's individual rate is ${K.rate(ky.income.flat as number)} for 2026, the rate the Department of Revenue uses in its 2026 withholding guidance (${h.ext(KY_WH, 'Kentucky DOR, withholding')}). It is flat, applies to the same Schedule C profit, and is owed on top of the Lexington fee; the two are filed with different agencies.</p>
<p>The LLC brings its own state charge. Every Kentucky LLC, a single-member one included, owes the Limited Liability Entity Tax each year, at a minimum of ${K.usd(ky.llc.minTax)} when Kentucky gross receipts or gross profits are $3 million or less (${h.ext(LLET, 'Kentucky DOR, LLET')}). Add the ${K.usd(ky.llc.annual as number)} annual report to the Secretary of State and the ${K.usd(ky.llc.formation as number)} filing fee, and a Lexington LLC costs ${K.usd(K.llcCost(ky, 5))} over five years in state charges alone, more than a sole proprietorship that pays neither. The ${h.a('llc-cost', 'LLC cost comparison')} puts that figure next to the other states.</p>
<h2>Louisville and the rest of Kentucky</h2>
<p>Louisville Metro (Jefferson County) levies an occupational license tax on net profits and wages that combines the Metro government, the school board and the transit authority, TARC. Its rates are posted by the ${h.ext(lou.url, 'Louisville Metro Revenue Commission')}, which could not be read for this page, so no rate is given here. Many other Kentucky cities and counties levy similar taxes, at rates each sets for itself; no official statewide list was read. The ${h.a('state:kentucky', 'Kentucky page')} covers the state rules, and the ${h.a('local-business-taxes', 'local business taxes guide')} compares Lexington with cities in other states.</p>`,
  faqs: [
    { q: 'Who pays the Lexington occupational license fee?', a: `Anyone earning compensation or business net profits in Lexington-Fayette County, at ${lex.rateText}. A self-employed person pays it on the net profit of work done in the county, after business expenses. It is charged by the Lexington-Fayette Urban County Government, separately from the Kentucky income tax, which also applies to the same profit.` },
    { q: 'Does a Lexington single-member LLC owe the Kentucky LLET?', a: `Yes. Kentucky's Limited Liability Entity Tax applies to single-member LLCs too, at a minimum of ${K.usd(ky.llc.minTax)} a year when Kentucky gross receipts or gross profits are $3 million or less. It is owed in addition to the ${K.usd(ky.llc.annual as number)} annual report and to the Lexington occupational license fee on the owner's profit.` },
    { q: 'Is the Louisville occupational tax rate the same as Lexington\'s?', a: `Not necessarily, and this site could not confirm it. Louisville Metro combines Metro, school board and TARC components in its occupational license tax, while Lexington charges ${lex.rateText}. The Louisville Metro Revenue Commission publishes the current rates for residents and nonresidents; check them there before budgeting.` },
  ],
  related: ['local-business-taxes', 'state:kentucky', 'llc-cost', 'state-income-tax'],
});
