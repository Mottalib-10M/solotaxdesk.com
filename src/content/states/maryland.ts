import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('maryland');
const b = s.income.brackets?.single ?? [];
const lo = b[0]?.[1] ?? 0;
const hi = b[b.length - 1]?.[1] ?? 0;
const mid = b.find(([from]) => from === 3000)?.[1] ?? 0;
const md = 'https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/instructions/2025/resident-booklet.pdf';

export default defineState({
  slug: 'maryland',
  title: `Maryland LLC Annual Report 2026: ${K.usd(s.llc.annual ?? 0)} Fee and County Tax`,
  description: `Maryland 2026: a ${K.usd(s.llc.annual ?? 0)} LLC annual report due April 15, state rates from ${K.rate(lo)} to ${K.rate(hi)}, a county income tax on the same income and the elective 8.25% PTE tax.`,
  intro: 'Maryland is cheap to form an LLC in and costly to keep one, and every resident pays a county income tax on top of the state rate.',
  resume: `Maryland charges only ${K.usd(s.llc.formation ?? 0)} to file Articles of Organization, then ${K.usd(s.llc.annual ?? 0)} every year for the annual report due April 15, so an LLC costs ${K.usd(s.cost5)} over five years, nearly all of it in reports. The state income tax runs from ${K.rate(lo)} to ${K.rate(hi)}, but most of a freelancer's income falls in the ${K.rate(mid)} band: on ${K.usd(75000)} of profit, a single filer owes ${K.usd(s.ex75.stateTax)} in state tax and ${K.usd(s.ex75.total)} in all with federal income tax and self-employment tax. That total leaves out the county layer. Every Maryland resident also pays a county or Baltimore City income tax on the same taxable income, between 2.25% and 3.30% for 2026, which adds roughly as much again as the state tax. Maryland follows the S election and puts no entity tax on S corporations; at ${K.usd(120000)} of profit the model shows ${K.usd(s.cmp.savings)} of saving.`,
  body: (h) => `<p>The ${K.usd(s.llc.annual ?? 0)} annual report is the figure that sets Maryland apart. The State Department of Assessments and Taxation collects it each April 15 together with the personal property return, under Corporations and Associations Article 1-203 (${h.ext('https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gca&section=1-203&enactments=false', 'Md. Code, Corps. & Ass\'ns 1-203')}). Formation costs a third of that. Over a decade the fees add up to ${K.usd(K.llcCost(s, 10))}, a sum a freelancer working alone as a sole proprietor would not pay at all.</p>
${h.mini('stateLlc', { s: 'maryland' })}
<h2>Two income taxes on one return</h2>
<p>A Maryland resident files one return but pays two taxes. The state brackets start at ${K.rate(lo)} and reach ${K.rate(mid)} above $3,000 of taxable income; two top brackets added in 2025 apply ${K.rate(b[b.length - 2]?.[1] ?? 0)} and ${K.rate(hi)} above $500,000 and $1,000,000 for a single filer (${h.ext('https://www.marylandcomptroller.gov/content/dam/mdcomp/md/state-payroll/memos/2026/2026-maryland-state-and-local-withholding-information.pdf', 'Comptroller, 2026 withholding memo')}). The county tax is charged on the same Maryland taxable net income. For 2026 it ranges from 2.25% in Worcester County to 3.30% in Dorchester and Kent, with Montgomery, Prince George's and Baltimore City at 3.20%, and Anne Arundel and Frederick using graduated scales (${h.ext(md, 'Comptroller, resident booklet and local rates')}). The calculator at the top shows the state tax only; at a 3.20% county rate, the local tax on a mid-sized freelance profit is in the same range as the state amount.</p>
<h2>An 8.25% pass-through entity tax</h2>
<p>Partnerships and S corporations that elect to pay at the entity level owe 8.25% of the members' share: the top state rate of 6.50% plus 2.25% standing in for the lowest local rate (${h.ext('https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/forms/2026/510-511d.pdf', 'Maryland Form 510/511D 2026')}). The members then claim a credit. The election is aimed at owners above the federal SALT limit, and its value depends on their county. Without it, an S corporation is a plain pass-through in Maryland, and at ${K.usd(120000)} of profit with a ${K.usd(50000)} salary the comparison with a default LLC comes out ${K.usd(s.cmp.savings)} in favor of the election after ${K.usd(2000)} of costs. The ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} lets you change the salary.</p>
<h3>Estimated payments cover the county tax too</h3>
<p>Quarterly payments are required when your income is expected to produce more than $500 of tax beyond Maryland withholding, and the amount covers state and local tax together. The fourth payment can be skipped by filing and paying the full return by January 31, 2027 (${h.ext(md, 'Maryland resident instructions')}). The ${h.a('quarterly-estimated-taxes', 'quarterly tax guide')} has the federal rules, which are separate.</p>`,
  faqs: [
    { q: 'Why does a Maryland LLC cost so much each year?', a: `Because the annual report filed with SDAT by April 15 carries a ${K.usd(s.llc.annual ?? 0)} fee, set by Corporations and Associations Article 1-203, even though formation costs only ${K.usd(s.llc.formation ?? 0)}. There is no separate franchise or minimum tax, but the report alone makes five years of fees reach ${K.usd(s.cost5)}.` },
    { q: 'Do self-employed Maryland residents pay county income tax on business profit?', a: 'Yes. Every resident pays the local income tax of their county or Baltimore City on Maryland taxable net income, which includes self-employment profit. For tax year 2026 the rates run from 2.25% to 3.30%, and Anne Arundel and Frederick counties use graduated scales. Nonresidents with Maryland income pay a special 2.25% tax instead.' },
    { q: 'What is the Maryland pass-through entity tax rate for 2026?', a: 'An electing partnership or S corporation pays 8.25% on its members\' share of income: the top individual rate of 6.50% plus 2.25% for the local tax, as shown on the 2026 Form 510/511D. Members receive a credit for the tax paid. Entities that do not elect withhold tax for nonresident members instead.' },
  ],
  related: ['local-business-taxes', 'llc-cost', 'llc-vs-s-corp', 'state:virginia', 'state:district-of-columbia'],
});
