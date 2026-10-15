import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
/** Read in the Instructions for Form 1120-S (2025), "Late filing of return" and "Failure to furnish information timely". */
const LATE_PER_MONTH = 255, LATE_MIN = 525, K1_FAIL = 340;
const due2026 = '2027-03-15';
const r = K.scorp({ profit: 150000, salary: 65000, filing: 'single' });
const late = (owners: number, months: number) => LATE_PER_MONTH * owners * Math.min(months, 12);

export default defineGuide({
  id: 'form-1120-s',
  group: 'structure',
  order: 6,
  slug: 'form-1120-s',
  nav: 'Form 1120-S',
  card: 'The S corp return: due date, K-1s, payroll forms and penalties',
  title: 'Form 1120-S 2026: S Corp Filing, Due Date and Penalties',
  description: `Form 1120-S for tax year 2026 is due ${K.day(due2026)}. What the S corp return reports, the K-1 for each owner, payroll forms and the ${K.usd(LATE_PER_MONTH)} monthly late penalty.`,
  h1: 'Form 1120-S: filing the S corp return for 2026',
  intro: 'The S corporation files its own return even though it rarely owes tax. Enter the profit and salary to see what the K-1 will carry to your Form 1040.',
  resume: `Form 1120-S is the yearly income tax return of an S corporation, including an LLC that elected S status. It is due by the 15th day of the 3rd month after the tax year ends, so ${K.day(due2026)} for calendar year 2026, and Form 7004 extends the time to file but not to pay. The return reports the company's income and deductions, including the owner's salary, and splits what is left among the shareholders on Schedule K-1; each owner reports that share on Schedule E of Form 1040 whether or not the cash was paid out. Filing late costs ${K.usd(LATE_PER_MONTH)} per shareholder for each month or part of a month, up to 12 months, even when no tax is due, and a return more than 60 days late has a minimum penalty. For ${K.usd(150000)} of profit and a ${K.usd(65000)} salary, the K-1 shows about ${K.usd(r.k1)} of ordinary business income. Payroll adds Forms 941, 940 and W-2.`,
  tool: 'scorp-tax',
  body: (h) => `<p>Form 1120-S works like a funnel. Gross receipts go in at the top, then the company subtracts its costs: the owner's salary, the employer half of payroll taxes, rent, software and every other ordinary business expense. What remains is ordinary business income, which the corporation does not pay tax on in most cases. Instead, Schedule K adds up every item that passes to the owners and Schedule K-1 gives each one a share. The quick check below shows how the same profit and salary compare with staying a default LLC.</p>
${h.mini('scorpQuick', { p: 150000, w: 65000 })}
<h2>Who must file, and when</h2>
<p>According to the ${h.src('i1120s', 'Instructions for Form 1120-S')}, a corporation or other entity files this return if it elected S status on Form 2553, the IRS accepted the election and the election is still in effect. There is no exemption for a quiet year: a company that earned nothing still files once the status is active. It does not file 1120-S for any year before the election takes effect.</p>
<p>The return is due by the 15th day of the 3rd month after the end of the tax year. For returns covering 2025, the instructions give March 16, 2026, because March 15 fell on a Sunday; for calendar year 2026 the date is ${K.day(due2026)}. That is one month before the personal return, on purpose: the owners need their K-1 to file. An extension is requested on Form 7004 by the regular due date. Interest still runs on any tax paid late.</p>
<p>S corporations that file 10 or more returns of any type during the calendar year, counting payroll returns and information returns, must file 1120-S electronically. A one-owner company with four Forms 941, a Form 940, W-2s and a few 1099s can reach that count faster than expected.</p>
<h2>Schedule K and the K-1</h2>
<p>Schedule K is the summary of every shareholder's share of income, deductions and credits, and every S corporation completes it. Schedule K-1 shows one shareholder's share. A copy of each K-1 is attached to the return and another goes to the shareholder, no later than the day the 1120-S is due. Items that need separate treatment on a personal return, such as charitable contributions, section 179 expense or interest income, are listed apart from ordinary business income.</p>
<p>Two rules surprise new owners. Income passes through whether or not it was distributed: a K-1 that shows ${K.usd(r.k1)} is taxable even if the money stayed in the business account. And S corporation income is not self-employment income, as the instructions state, so no Schedule SE applies to it; payroll taxes on the salary take that role. The owner reports the K-1 on Schedule E of Form 1040 and pays income tax at personal rates, usually through ${h.a('quarterly-estimated-taxes', 'quarterly estimated payments')}.</p>
<h3>From profit to K-1 in one example</h3>
${h.table(['Line', 'Amount'], [
  ['Profit before the owner\'s salary', K.usd(150000)],
  ['Officer salary (deducted)', K.usd(r.salary)],
  ['Employer Social Security and Medicare (deducted)', K.usd(r.employerFica)],
  ['Federal unemployment tax (deducted)', K.usd(r.futa)],
  ['Ordinary business income on the K-1', K.usd(r.k1)],
  ['QBI deduction on the owner\'s return', K.usd(r.qbi.deduction)],
], 'One shareholder, single filer, no state tax, 2026 rules.', ['l', 'r'])}
<h2>Payroll forms that come with the return</h2>
<p>An S corporation with a working owner is an employer, so the income tax return is only part of the paperwork. ${h.src('p15', 'Publication 15')} sets the calendar:</p>
<ul>
<li><strong>Form 941</strong>, the quarterly payroll return, by April 30, July 31, October 31 and January 31, reporting withheld income tax and both halves of Social Security and Medicare.</li>
<li><strong>Form 940</strong>, the yearly federal unemployment return, by January 31. FUTA is ${K.rate(P.payroll.futaNet)} of the first ${K.usd(P.payroll.futaWageBase)} of each employee's pay after the state credit, deposited quarterly only once it exceeds ${K.usd(500)}.</li>
<li><strong>Form W-2</strong> to the owner and Copy A with Form W-3 to the Social Security Administration, both by January 31.</li>
</ul>
<p>Deposits of withheld and payroll taxes follow a monthly or semiweekly schedule set by the size of past payroll. Missing them is a separate penalty from anything on the 1120-S.</p>
<h2>Penalties for filing late</h2>
<p>The late filing penalty is based on the number of owners, not on the tax. For a return with no tax due, it is ${K.usd(LATE_PER_MONTH)} for each month or part of a month the return is late, for up to 12 months, multiplied by the number of persons who were shareholders at any time during the year. When tax is due, 5% of the unpaid tax per month, up to 25%, is added, and a return due in 2026 that is more than 60 days late has a minimum penalty of the smaller of the tax due or ${K.usd(LATE_MIN)}. Each K-1 not given to a shareholder on time, or given with missing or wrong information, can draw a separate ${K.usd(K1_FAIL)} penalty. Reasonable cause can remove a penalty, but it has to be shown.</p>
${h.table(['Months late', 'One owner', 'Two owners', 'Three owners'], [1, 3, 6, 12].map((m) => [String(m), K.usd(late(1, m)), K.usd(late(2, m)), K.usd(late(3, m))]), `Late filing penalty with no tax due: ${K.usd(LATE_PER_MONTH)} per shareholder per month, 12 months at most (Instructions for Form 1120-S).`, ['l', 'r', 'r', 'r'])}
<p>Filing on time costs less than any line of that table, even with an extension. For the S election itself and its own deadline, see the ${h.a('llc-taxed-as-s-corp', 'Form 2553 guide')}; for the owner's pay that feeds line 7 of the return, see ${h.a('reasonable-salary', 'reasonable salary')}; the ${h.a('s-corp', 'S corp overview')} covers eligibility.</p>`,
  faqs: [
    { q: 'When is Form 1120-S due for the 2026 tax year?', a: `For an S corporation on the calendar year, ${K.day(due2026)}: the 15th day of the 3rd month after the year ends. A fiscal-year company counts from the end of its own year. Form 7004, filed by that date, extends the time to file, but tax owed and interest are still due on the original date.` },
    { q: 'What is the penalty for filing Form 1120-S late?', a: `${K.usd(LATE_PER_MONTH)} for each month or part of a month, up to 12 months, multiplied by the number of shareholders, even if no tax is due. A one-owner company that files four months late owes ${K.usd(late(1, 4))}. If tax is due, a percentage of it is added, and missing or late K-1s carry their own penalty (Instructions for Form 1120-S).` },
    { q: 'Does an S corp with no income still file Form 1120-S?', a: 'Yes. The return is required for every year in which the S election is in effect once the IRS has accepted it, whatever the result. A year with no activity still produces a return, usually short, and the late filing penalty per shareholder applies to it just as it would to a profitable year.' },
    { q: 'Where does S corp income go on my personal tax return?', a: 'On Schedule E of Form 1040, using the figures on the Schedule K-1 the corporation gives you. Ordinary business income is taxed at your own brackets and may qualify for the QBI deduction. It is not self-employment income, so no Schedule SE is filed for it; your salary is on a W-2 like any other job.' },
    { q: 'Which payroll forms does a one-person S corp file?', a: 'Form 941 each quarter for withheld income tax and Social Security and Medicare, Form 940 once a year for federal unemployment tax, and a W-2 for the owner with Form W-3 to the Social Security Administration by January 31. Most states add their own withholding and unemployment returns (Publication 15).' },
  ],
  related: ['s-corp', 'llc-taxed-as-s-corp', 'reasonable-salary', 'quarterly-estimated-taxes', 'estimated-tax-due-dates'],
  sources: ['i1120s', 'p15', 's_corps', 'f1040es', 'rp_2025_32'],
});
