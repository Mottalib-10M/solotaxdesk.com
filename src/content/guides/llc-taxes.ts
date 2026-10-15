import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const I1065 = 'https://www.irs.gov/pub/irs-pdf/i1065.pdf';
/** Read in the Instructions for Form 1065 (2025), "Late Filing of Return". */
const LATE_1065 = 255;
const PROFIT = 90000;
const one = K.solo({ profit: PROFIT, filing: 'single' });
const each = K.solo({ profit: PROFIT / 2, filing: 'single' });
const due1065 = K.day('2027-03-15'), due1040 = K.day('2027-04-15');
const q = P.estimated.dueDates.map((d) => K.day(d));

export default defineGuide({
  id: 'llc-taxes',
  group: 'structure',
  order: 12,
  slug: 'llc-taxes',
  nav: 'LLC taxes',
  card: 'How an LLC is taxed, which forms it files and when they are due',
  title: 'LLC Taxes 2026: Filing Forms, Due Dates and Tax Calculator',
  description: `LLC taxes for 2026: no federal tax on the LLC by default, Schedule C or Form 1065 (due ${due1065}), SE tax on the profit, state fees. ${K.usd(one.total)} on ${K.usd(PROFIT)}.`,
  h1: 'LLC taxes in 2026: how an LLC is taxed and what it files',
  intro: 'By default an LLC pays no federal income tax itself: its members do. Enter the profit, the number of members and the state to see the bill.',
  resume: `An LLC is not a tax category of its own. The IRS taxes a one-member LLC as a disregarded entity, so the owner reports the profit on Schedule C of Form 1040, due ${due1040} for 2026, and an LLC with two or more members as a partnership, which files Form 1065 by ${due1065} and gives each member a Schedule K-1. In both cases the LLC pays no federal income tax: each member pays income tax on their share and, as an active owner, self-employment tax of ${K.rate(P.se.ssRate + P.se.medicareRate)} on ${K.dec(P.se.factor * 100, 2)}% of it. On ${K.usd(PROFIT)} of profit, a single owner without state income tax owes ${K.usd(one.se.total)} of self-employment tax and ${K.usd(one.incomeTax)} of income tax; two equal members owe ${K.usd(each.federalTotal)} each. Members pay through four estimated payments, the first on ${q[0]}. The state adds its own fees and, in some states, a minimum or franchise tax. An LLC can instead elect to be taxed as an S or C corporation.`,
  tool: 'llc-tax',
  body: (h) => `<p>The ${h.src('llc', 'IRS page on limited liability companies')} sets out the rule in two sentences. A domestic LLC with at least two members is classified as a partnership for federal income tax unless it files Form 8832 and elects to be treated as a corporation. An LLC with only one member is disregarded as separate from its owner, unless it makes the same election. Everything else about LLC taxes follows from which of these boxes the company falls in. For an owner with no other income, the estimated payment that results can be checked here.</p>
${h.mini('quarter')}
<h2>Which return the LLC files</h2>
${h.table(['LLC and tax status', 'Return', 'Due for calendar 2026', 'Who pays the tax'], [
  ['One member, default', 'Schedule C (and Schedule SE) on the owner\'s Form 1040', due1040, 'The owner'],
  ['Two or more members, default', 'Form 1065, Schedule K-1 to each member', due1065, 'Each member, on Form 1040'],
  ['Elected S corporation (Form 2553)', 'Form 1120-S, K-1s, payroll returns', due1065, 'The members, on salary and K-1'],
  ['Elected C corporation (Form 8832)', 'Form 1120, payroll returns', due1040, 'The LLC at the corporate rate, then members on dividends'],
], 'Federal returns by classification. A due date on a weekend or holiday moves to the next business day.', ['l', 'l', 'l', 'l'])}
<p>The partnership return comes a month before the personal one because the members need their K-1 to file. The ${h.ext(I1065, 'Instructions for Form 1065')} set it at the 15th day of the 3rd month after the tax year, March 15 for a calendar-year partnership, and Form 7004 extends the time to file. Missing it costs ${K.usd(LATE_1065)} for each month or part of a month, up to 12 months, multiplied by the number of persons who were partners during the year, even when the partnership owes nothing. A two-member LLC that files three months late owes ${K.usd(LATE_1065 * 2 * 3)}.</p>
<p>Two other filings can apply whatever the classification. An LLC that pays employees files the payroll returns in its own name and with its own employer identification number, even when it is disregarded for income tax, because the IRS treats it as a separate entity for employment taxes. And an LLC that wants to leave its default classification files Form 8832, whose election generally cannot take effect more than 75 days before the filing date or more than 12 months after it. Choosing S corporation status goes through Form 2553 instead, with its own deadline of ${P.scorp.electionMonths} months and ${P.scorp.electionDays} days from the start of the tax year.</p>
<h2>The taxes the members pay</h2>
<h3>Self-employment tax</h3>
<p>The profit of a default LLC is self-employment income for a member who runs the business, whether or not it is withdrawn. It is taxed at ${K.rate(P.se.ssRate)} for Social Security up to ${K.usd(P.se.wageBase['2026'])} of net earnings in 2026 and at ${K.rate(P.se.medicareRate)} for Medicare on all of it, after the ${K.dec(P.se.factor * 100, 2)}% adjustment. Half of the tax is deducted from income. For a one-member LLC this is the line that surprises people most, and it is where an S election can help once profit is high enough.</p>
<h3>Income tax and the QBI deduction</h3>
<p>The member's share is added to their other income and taxed at the 2026 brackets. Before that, most LLC owners take the qualified business income deduction, up to ${K.rate(P.qbi.rate)} of the business profit after the half-SE-tax and other related deductions, in full below ${K.usd(P.qbi.threshold.single)} of taxable income for a single filer or ${K.usd(P.qbi.threshold.mfj)} joint. On ${K.usd(PROFIT)} of profit the single owner's deduction is ${K.usd(one.qbi.deduction)}. The ${h.a('qbi-deduction', 'QBI deduction guide')} covers the limits above those thresholds.</p>
<h3>When the tax is paid</h3>
<p>No one withholds tax from LLC profit, so members pay during the year through ${h.a('quarterly-estimated-taxes', 'quarterly estimated taxes')} on Form 1040-ES. For 2026 the dates are ${q[0]}, ${q[1]}, ${q[2]} and ${q[3]} (${h.src('f1040es', 'Form 1040-ES 2026')}). Paying ${K.rate(P.estimated.priorYearShare)} of last year's tax, or ${K.rate(P.estimated.priorYearShareHigh)} when last year's AGI exceeded ${K.usd(P.estimated.highAgi.single)}, protects against the underpayment penalty.</p>
<h2>One member or two: the same profit</h2>
<p>Splitting the same ${K.usd(PROFIT)} between two equal members does not change the LLC's own result, but each member's tax is computed separately on ${K.usd(PROFIT / 2)}.</p>
${h.table(['', 'One member', 'Each of two members'], [
  ['Share of profit', K.usd(PROFIT), K.usd(PROFIT / 2)],
  ['Self-employment tax', K.usd(one.se.total), K.usd(each.se.total)],
  ['QBI deduction', K.usd(one.qbi.deduction), K.usd(each.qbi.deduction)],
  ['Federal income tax', K.usd(one.incomeTax), K.usd(each.incomeTax)],
  ['Federal total', K.usd(one.federalTotal), K.usd(each.federalTotal)],
], 'Single filers with no other income, no state tax, 2026 rules.', ['l', 'r', 'r'])}
<h2>Tax benefits of an LLC, without the myths</h2>
<p>The LLC does not create deductions that a sole proprietor lacks: business expenses, the home office and mileage work the same way on Schedule C. Its tax benefits are structural. Profit is taxed once, on the members' returns, rather than at the corporate rate and again as dividends. A loss passes through to the owners and can offset other income, within the usual limits. The members can split profits as their agreement provides. And the LLC can change its tax status later: elect S corporation status to put the owners on payroll and take the rest as distributions (the ${h.a('llc-taxed-as-s-corp', 'S election guide')} explains how), or elect C corporation status if it will keep its profit.</p>
${h.mini('qbiQuick')}
<h2>State taxes and fees</h2>
<p>States add their own layer. Most charge an annual or biennial report fee; some charge a minimum or franchise tax every year, even at a loss; a few tax LLCs on gross receipts or margin. The member's share is also subject to the state's personal income tax where there is one. These amounts vary too much to summarize in one figure, so the calculator above reads them from the state data and shows only figures verified on the state agency's site. The ${h.a('llc-cost', 'LLC cost by state page')} totals them over several years, and the ${h.a('single-member-llc', 'single-member LLC guide')} covers the EIN and W-9 questions for one-owner companies.</p>`,
  faqs: [
    { q: 'Does an LLC pay taxes itself?', a: 'Not federal income tax, in its default classification. A one-member LLC is disregarded and its owner reports the profit on Schedule C; a multi-member LLC files Form 1065 as a partnership but pays no tax, and each member reports a share. The LLC may still owe payroll taxes if it has employees, and state fees or entity taxes where they apply.' },
    { q: 'When are LLC taxes due for 2026?', a: `For a calendar year: a multi-member LLC files Form 1065 by ${due1065}; a one-member LLC is part of the owner's Form 1040, due ${due1040}. Members also pay estimated tax on ${q[0]}, ${q[1]}, ${q[2]} and ${q[3]}. An LLC taxed as an S corporation files Form 1120-S by ${due1065}.` },
    { q: 'What tax benefits does an LLC really have?', a: 'It does not add deductions a sole proprietor lacks, and its profit carries the same self-employment tax. Its advantages are one level of tax instead of two, losses that pass through to the owners, flexible profit splits between members, and the option to elect S or C corporation status later when the numbers favor it.' },
    { q: 'How is a two-member LLC taxed?', a: `As a partnership, unless it elects otherwise. It files Form 1065 and gives each member a K-1; each member reports the share on Form 1040 with self-employment tax if active in the business. Two equal members of an LLC that earns ${K.usd(PROFIT)} owe about ${K.usd(each.federalTotal)} of federal tax each in 2026, as single filers with no other income.` },
    { q: 'What is the penalty if a multi-member LLC files Form 1065 late?', a: `${K.usd(LATE_1065)} for each month or part of a month the return is late, up to 12 months, multiplied by the number of members during the year, even if the LLC owes no tax (Instructions for Form 1065). Two members and three months late come to ${K.usd(LATE_1065 * 6)}. Reasonable cause can remove it, and a Form 7004 extension filed on time moves the deadline.` },
  ],
  related: ['single-member-llc', 'llc-vs-partnership', 'quarterly-estimated-taxes', 'llc-cost', 'llc-taxed-as-s-corp', 'qbi-deduction'],
  sources: ['llc', 'smllc', 'partnerships', 'f1040es', 'i1040sse', 'i8995', 'rp_2025_32'],
});
