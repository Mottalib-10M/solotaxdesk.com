import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const I1065 = 'https://www.irs.gov/pub/irs-pdf/i1065.pdf';
const levels = [40000, 75000, 120000];
const rows = levels.map((p) => ({ p, r: K.solo({ profit: p, filing: 'single' }) }));
const r75 = rows[1].r;
const se = K.rate(P.se.ssRate + P.se.medicareRate);

export default defineGuide({
  id: 'sole-proprietorship-vs-llc',
  group: 'structure',
  order: 11,
  slug: 'sole-proprietorship-vs-llc',
  nav: 'Sole proprietorship vs LLC',
  card: 'Same federal tax by default; the difference is liability and state cost',
  title: 'Sole Proprietorship vs LLC 2026: Taxes, Liability and Cost',
  description: `Sole proprietorship vs LLC in 2026: the same federal tax by default (${K.usd(r75.total)} on ${K.usd(75000)}, single), so it comes down to liability, state fees, S status.`,
  h1: 'Sole proprietorship vs LLC: what really changes in 2026',
  intro: 'Forming a one-member LLC does not change your federal tax bill. Pick your state to see what the LLC itself costs to create and keep.',
  resume: `A one-member LLC pays exactly the same federal tax as a sole proprietorship unless it elects otherwise: the IRS disregards it, so its profit goes on Schedule C of your Form 1040 and carries self-employment tax of ${se} on ${K.dec(P.se.factor * 100, 2)}% of profit, then income tax at your brackets. On ${K.usd(75000)} of profit, a single filer without state income tax owes ${K.usd(r75.se.total)} of self-employment tax and ${K.usd(r75.incomeTax)} of income tax in 2026 in both cases. What the LLC adds is legal: a separate entity whose members are not personally liable for its debts, where a sole proprietor answers for them with personal assets. What it costs is a state filing fee, a yearly or biennial report in most states and, in some, a minimum or franchise tax. It also opens a door the sole proprietorship does not have: an LLC can elect S corporation status on Form 2553, which an unincorporated sole proprietor cannot do.`,
  tool: 'llc-cost',
  body: (h) => `<p>Many people form an LLC expecting a tax break and are surprised when their first return looks identical. That is by design. The ${h.src('smllc', 'IRS page on single-member LLCs')} says an LLC with one member is treated as an entity disregarded as separate from its owner for income tax, unless it elects to be treated as a corporation, and that its individual owner pays self-employment tax in the same manner as a sole proprietor. Here is that tax on a given profit, for either form.</p>
${h.mini('seQuick')}
<h2>The federal tax is the same</h2>
<p>Whether you work under your own name or through "Your Name Design LLC," the computation does not change. Net profit from Schedule C goes to Schedule SE, which taxes ${K.dec(P.se.factor * 100, 2)}% of it at ${se} up to the ${K.usd(P.se.wageBase['2026'])} Social Security wage base and at ${K.rate(P.se.medicareRate)} above. Half of that tax is deducted from income, the QBI deduction takes up to ${K.rate(P.qbi.rate)} of qualified business income off what is taxed, and the rest is taxed at the 2026 brackets.</p>
${h.table(['Profit', 'Self-employment tax', 'QBI deduction', 'Federal income tax', 'Total, either form'], rows.map(({ p, r }) => [K.usd(p), K.usd(r.se.total), K.usd(r.qbi.deduction), K.usd(r.incomeTax), K.usd(r.federalTotal)]), 'Single filer, no other income, 2026 rules. State fees of the LLC not included.', ['r', 'r', 'r', 'r', 'r'])}
<p>The deductions are the same too: home office, mileage, equipment, health insurance premiums and retirement contributions follow the same rules on Schedule C whether the business is an LLC or not. So do the ${h.a('quarterly-estimated-taxes', 'quarterly estimated payments')}: the LLC does not withhold anything for you, and the four 2026 installments fall on the same dates for both forms, starting ${K.day(P.estimated.dueDates[0])}.</p>
<h2>Is an LLC a sole proprietorship?</h2>
<p>For income tax, the one-member LLC behaves like one, and even the form it uses is titled "Profit or Loss From Business (Sole Proprietorship)." In law it is not. The LLC is an entity created by a state filing, with its own name, its own bank account and its own contracts. The IRS also stops ignoring it in two areas: for employment taxes and certain excise taxes, a one-member LLC is a separate entity and must use its own name and employer identification number. If you hire an employee through the LLC, the payroll is the LLC's, not yours personally. The ${h.a('single-member-llc', 'single-member LLC guide')} covers the EIN and W-9 questions.</p>
<h2>Liability: the reason to form one</h2>
<p>A sole proprietor and the business are one person, so the business's debts are personal debts. The ${h.ext(I1065, 'Instructions for Form 1065')} define the LLC by contrast with a partnership: none of the members of an LLC are personally liable for its debts. That protection covers the company's obligations, such as a supplier's invoice or a lease signed in the LLC's name. It is limited by state law and by how you run the company, and it does not replace insurance for your own professional work. Keeping the LLC's money separate from yours and signing contracts in its name is the minimum. For a precise answer in your state, ask a lawyer.</p>
<h2>What the LLC costs at the state level</h2>
<p>A sole proprietorship has no formation cost in most places, though a local license or a trade name registration may apply. An LLC pays a filing fee to the secretary of state, then an annual or biennial report fee in most states, and a few states charge a minimum or franchise tax every year regardless of profit. Those amounts differ widely from one state to another and change over time, which is why the calculator above reads them from the state data and shows only the figures verified on each agency's site. The ${h.a('llc-cost', 'LLC cost by state page')} ranks them, and the state pages give the details. Paid registered agent services, lawyers and formation companies are extra and not included in those figures.</p>
${h.mini('sideGig')}
<h2>Should you form an LLC?</h2>
<p>The question is not about federal tax. It comes down to three things:</p>
<ul>
<li><strong>Exposure.</strong> A business that signs leases, holds inventory, hires or works on clients' property has more to protect than a writer invoicing a few clients.</li>
<li><strong>The yearly cost in your state.</strong> Where the LLC costs little to keep, the protection is cheap; where a minimum tax applies every year, a small side business may not justify it.</li>
<li><strong>Plans for the S election.</strong> Only a corporation or an entity eligible to be taxed as one can file Form 2553, according to the ${h.src('i2553', 'Form 2553 instructions')}. A sole proprietor who wants S status must first form an LLC or a corporation. Once profit reaches the level where the ${h.a('llc-vs-s-corp', 'S election pays off')}, the LLC is the usual vehicle.</li>
</ul>
<p>Nothing in the tax code forces the choice early. A sole proprietor can form an LLC later without changing how the IRS taxes the profit, though contracts, bank accounts and licenses then move to the new entity. If you are unsure, start by computing the yearly state cost for your state above, then weigh it against what you have at stake.</p>`,
  faqs: [
    { q: 'Do I pay more tax with an LLC than as a sole proprietor?', a: `Not in federal tax. A one-member LLC that makes no election is disregarded by the IRS, so its profit goes on Schedule C with the same self-employment and income tax: ${K.usd(r75.federalTotal)} on ${K.usd(75000)} of profit for a single filer in 2026. The extra cost is at the state level: filing fees, annual reports and, in some states, a minimum tax.` },
    { q: 'Is an LLC a sole proprietorship for tax purposes?', a: 'For federal income tax, a one-member LLC without an election is treated as a disregarded entity, and an individual owner reports it like a sole proprietorship on Schedule C. It remains a separate entity for employment taxes and certain excise taxes, and in state law it is always a separate company with its own liability shield.' },
    { q: 'Can a sole proprietor elect S corp status without forming an LLC?', a: 'No. Form 2553 can only be filed by a domestic corporation or a domestic entity eligible to be taxed as a corporation, such as an LLC. A sole proprietorship is not an entity, so the owner must first form an LLC or a corporation under state law, then file the S election for it (Instructions for Form 2553).' },
    { q: 'Does an LLC protect my personal assets from business debts?', a: 'In the ordinary case, yes: the Instructions for Form 1065 describe an LLC as an entity whose members are not personally liable for its debts. The protection comes from state law and has limits, and it generally does not cover your own professional errors, which is what insurance is for. A lawyer in your state can say how far it goes for your business.' },
    { q: 'Should I form an LLC for a small side business?', a: 'Only if the protection is worth the yearly state cost. The LLC changes nothing in your federal tax on the side profit, which is reported on Schedule C either way. A side business with little exposure in a state with high annual fees may be fine as a sole proprietorship; one that signs contracts or hires may not.' },
  ],
  related: ['single-member-llc', 'llc-cost', 'llc-taxes', 'llc-vs-s-corp', 'business-structure', 'schedule-c'],
  sources: ['smllc', 'llc', 'i2553', 'i1040sse', 'i1040sc', 'rp_2025_32'],
});
