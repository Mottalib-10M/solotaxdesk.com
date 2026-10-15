import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const r = K.scorp({ profit: 150000, salary: 65000, filing: 'single' });
const fica = K.rate(P.payroll.ssEmployer + P.payroll.medicareEmployer);
const low = K.rate(P.brackets.single[0][1]);
const top = K.rate(P.brackets.single[6][1]);
const max = P.scorp.maxShareholders;

export default defineGuide({
  id: 's-corp',
  group: 'structure',
  order: 2,
  slug: 's-corp',
  nav: 'S corp basics',
  card: 'Who can elect, how the profit is taxed, what the owner files',
  title: 'S Corp 2026: Eligibility, Tax Treatment and Owner Pay',
  description: `S corp rules for 2026: up to ${max} shareholders, one class of stock, no entity rate, payroll on your salary and a K-1 for the rest. See the tax on your profit.`,
  h1: 'S corp in 2026: what subchapter S is and how its owners are taxed',
  intro: 'Subchapter S is a federal tax status, not a kind of company you register with your state. Enter the profit and the salary to see every tax an S corp owner pays.',
  resume: `An S corporation is a corporation, or an LLC, that has filed Form 2553 so that its profit is taxed on the owners' personal returns instead of at the corporate level. To qualify it must be domestic, have no more than ${max} shareholders, only individuals, estates and certain trusts or exempt organizations as owners, no nonresident alien shareholder, and a single class of stock. There is no "S corp tax rate": the profit reaches each owner on a Schedule K-1 and is taxed at the ordinary 2026 brackets, from ${low} to ${top}. An owner who works in the business is an employee and must be paid a reasonable salary through payroll, with ${fica} withheld and ${fica} paid by the company. On ${K.usd(150000)} of profit with a ${K.usd(65000)} salary, a single owner without state tax pays ${K.usd(r.payrollTaxes)} of payroll taxes and ${K.usd(r.incomeTax)} of federal income tax, ${K.usd(r.total)} in all, with ${K.usd(r.k1)} passed through on the K-1.`,
  tool: 'scorp-tax',
  body: (h) => `<p>The name comes from Subchapter S of Chapter 1 of the Internal Revenue Code, the part that lets a small business corporation pass its income, losses, deductions and credits through to its shareholders. Nothing changes in the state registry: a corporation stays a corporation and an LLC stays an LLC. The change happens only on the federal return, once the IRS accepts ${h.src('f2553', 'Form 2553')}. Most one-owner businesses that look at it compare it with the default LLC first, so the quick check below runs that comparison.</p>
${h.mini('scorpQuick', { p: 150000, w: 65000 })}
<h2>The eligibility tests, one by one</h2>
<p>The ${h.src('i2553', 'Form 2553 instructions')} list the conditions the business must meet on the day the status starts and every day after. Breaking one later ends the status.</p>
<ul>
<li><strong>Domestic.</strong> A corporation, or another entity that could elect to be taxed as a corporation (an LLC), organized in the United States.</li>
<li><strong>${max} shareholders at most.</strong> A married couple and their estates count as one, and so can all members of a family as defined in section 1361(c)(1)(B).</li>
<li><strong>Allowed owners only.</strong> Individuals, estates, certain trusts and some exempt organizations. A partnership, a corporation or a nonresident alien cannot hold shares.</li>
<li><strong>One class of stock.</strong> Every share must carry identical rights to distributions and to liquidation proceeds. Different voting rights are allowed.</li>
<li><strong>Not an ineligible company.</strong> Banks using the reserve method for bad debts, insurance companies taxed under subchapter L and domestic international sales corporations are excluded.</li>
</ul>
<p>Every shareholder must also consent to the election in writing. A freelancer with an LLC of one member passes these tests easily; a startup that wants preferred stock for investors does not, which is one reason funded companies stay C corporations (see ${h.a('c-corp-vs-s-corp', 'C corp vs S corp')}).</p>
<h2>Why there is no S corp tax rate</h2>
<p>People search for an S corp rate because a C corporation has one, a flat ${K.rate(P.corporate.rate)}. An S corporation generally pays no federal income tax at all. The ${h.src('s_corps', 'IRS page on S corporations')} puts it plainly: shareholders report the flow-through of income and losses on their own returns and are taxed at their individual rates, which avoids double taxation. The corporation itself can still owe tax in narrow cases, on certain built-in gains and on excess passive income when it carries earnings from years as a C corporation. A freelancer who started as an LLC will rarely meet either.</p>
<p>So the rate on S corp profit is your own marginal bracket. A single owner whose taxable income lands between ${K.usd(P.brackets.single[3][0])} and ${K.usd(P.brackets.single[4][0])} pays ${K.rate(P.brackets.single[3][1])} on the last dollar of K-1 income, before any state tax. The profit is taxed in the year the company earns it, whether or not you take it out of the bank account.</p>
<h2>How the owner is paid</h2>
<p>An S corp owner has two kinds of income from the company. The first is a salary. Publication 15 states that corporate officers who work in an incorporated business are employees, so the salary goes through payroll: income tax withholding, Social Security and Medicare at ${K.rate(P.payroll.ssEmployer)} and ${K.rate(P.payroll.medicareEmployer)} on each side, and federal unemployment tax at ${K.rate(P.payroll.futaNet)} on the first ${K.usd(P.payroll.futaWageBase)} (${h.src('p15', 'IRS Publication 15')}). The second is the rest of the profit, which reaches you on the K-1 and can be paid out as distributions free of payroll and self-employment tax.</p>
<p>That split is the whole appeal, and the IRS limits it: the company must pay reasonable compensation for the owner's services before it makes non-wage distributions (${h.src('reasonable_comp', 'IRS, S corporation compensation')}). The ${h.a('reasonable-salary', 'reasonable salary page')} covers the factors the IRS weighs.</p>
<h3>One owner, ${K.usd(150000)} of profit</h3>
${h.table(['Line', 'Amount'], [
  ['Salary paid through payroll', K.usd(r.salary)],
  ['Social Security and Medicare, company half', K.usd(r.employerFica)],
  ['Social Security and Medicare, withheld half', K.usd(r.employeeFica)],
  ['Federal unemployment tax', K.usd(r.futa)],
  ['Profit passed through on the K-1', K.usd(r.k1)],
  ['QBI deduction on the K-1 profit', K.usd(r.qbi.deduction)],
  ['Federal income tax on salary and K-1', K.usd(r.incomeTax)],
  ['Total federal tax', K.usd(r.total)],
], 'Single filer, no state tax, 2026 rules; payroll service costs left out.', ['l', 'r'])}
<p>The QBI line matters. The ${K.rate(P.qbi.rate)} qualified business income deduction applies to the K-1 profit but not to the salary, so a higher salary shrinks it. Here it is ${K.usd(r.qbi.deduction)}, computed on ${K.usd(r.k1)} of pass-through income.</p>
<h2>The forms an S corp files every year</h2>
<p>The company files Form 1120-S, an information return that shows the profit and gives each owner a K-1 with a share of it. The owner reports that share on Schedule E of Form 1040 and usually pays estimated tax on it with Form 1040-ES, because no withholding covers the K-1 income. On the payroll side come Form 941 every quarter, Form 940 once a year for unemployment tax and a W-2 for the owner. The ${h.a('form-1120-s', 'Form 1120-S guide')} has the due dates and the penalties for missing them, and an LLC that wants the status can follow the ${h.a('llc-taxed-as-s-corp', 'S election steps')}.</p>
<h2>Health insurance and retirement for an owner above 2%</h2>
<p>An owner holding more than 2% of the shares is treated differently from other employees on benefits. Health premiums the company pays for that owner go in box 1 of the W-2 as wages, but not in the Social Security and Medicare boxes, and the owner can then take the self-employed health insurance deduction on the personal return. If the owner buys the policy personally and the company never pays or reimburses it, that deduction is lost. Retirement contributions follow the salary, not the K-1: the company can add up to ${K.rate(P.retirement.employerRate)} of W-2 pay to a plan, inside the ${K.usd(P.retirement.dcLimit)} overall cap for 2026 (${h.src('p560', 'IRS Publication 560')}).</p>`,
  faqs: [
    { q: 'How many shareholders can an S corp have?', a: `No more than ${max}. A married couple and their estates count as one shareholder, and all members of a family can be treated as one as well. Every owner must be an individual, an estate, an eligible trust or certain exempt organizations, never a partnership, a corporation or a nonresident alien (Instructions for Form 2553).` },
    { q: 'Does an S corporation pay federal income tax itself?', a: 'Generally no. Its profit passes to the shareholders on Schedules K-1 and is taxed on their Forms 1040 at their own brackets. The company can owe tax only in narrow cases, such as built-in gains or excess passive income carried over from years when it was a C corporation, which rarely concern a business that began as an LLC.' },
    { q: 'Is subchapter S a separate kind of company I register with my state?', a: 'No. You form a corporation or an LLC under state law, then ask the IRS for S status on Form 2553. Subchapter S only changes the federal tax treatment. Most states follow it, a few tax S corporations at the entity level or ignore the status, and each state page here says which applies.' },
    { q: 'How is an S corp owner’s salary taxed in 2026?', a: `Like any employee's wages: federal and state income tax withheld, plus Social Security at ${K.rate(P.payroll.ssEmployee)} up to ${K.usd(P.se.wageBase['2026'])} and Medicare at ${K.rate(P.payroll.medicareEmployee)}, matched by the company. Federal unemployment tax adds ${K.rate(P.payroll.futaNet)} on the first ${K.usd(P.payroll.futaWageBase)}. The company deducts its half and the salary as business expenses (Publication 15).` },
    { q: 'Can an S corp owner skip estimated tax payments?', a: `Only if withholding on the salary covers the year. Tax on the K-1 profit is not withheld, so most owners either pay estimated tax on the four 2026 dates, the first on ${K.day(P.estimated.dueDates[0])}, or raise the income tax withheld from their own paychecks, which Publication 505 treats as paid in four equal parts through the year.` },
  ],
  related: ['llc-vs-s-corp', 'form-1120-s', 'reasonable-salary', 'llc-taxed-as-s-corp', 'c-corp-vs-s-corp'],
  sources: ['s_corps', 'i2553', 'i1120s', 'p15', 'reasonable_comp', 'p560', 'rp_2025_32'],
});
