import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.estimated;
const D = E.dueDates;
const wd = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
const gap = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const skip = E.fileByToSkipQ4;
const pub505Day = '2027-01-31';
const rows = D.map((d, i) => [`Installment ${i + 1}`, E.periods[i], K.day(d), wd(d)]);
const farmFile = '2027-03-01';

export default defineGuide({
  id: 'estimated-tax-due-dates',
  group: 'quarterly',
  order: 2,
  slug: 'estimated-tax-due-dates',
  nav: 'Estimated tax due dates',
  card: 'The four 2026 deadlines, the months each one covers, and the exceptions',
  title: 'Estimated Tax Due Dates 2026: The Four Deadlines and Periods',
  description: `Estimated tax due dates for 2026: ${K.day(D[0])}, ${K.day(D[1])}, ${K.day(D[2])} and ${K.day(D[3])}, the months each covers and the early-filing exception.`,
  h1: 'Estimated tax due dates for 2026, period by period',
  intro: 'The IRS calendar for estimated tax is not split into equal quarters. Here are the four 2026 deadlines, what each one pays for, and the cases where a date moves.',
  resume: `The four estimated tax due dates for 2026 are ${K.day(D[0])}, ${K.day(D[1])}, ${K.day(D[2])} and ${K.day(D[3])}. They do not match calendar quarters: the first covers ${E.periods[0]}, the second only ${E.periods[1]}, the third ${E.periods[2]} and the last ${E.periods[3]}, which is why the June deadline arrives just ${gap(D[0], D[1])} days after the April one. A payment due on a Saturday, Sunday or legal holiday is on time the next business day, and a mailed payment counts on its U.S. postmark date. You may skip the January installment entirely if you file the 2026 return by ${K.day(skip)} and pay the full balance with it. Farmers and fishermen who earn at least two-thirds of gross income from that work have a single date, ${K.day(D[3])}, or none if they file and pay by ${K.day(farmFile)}. Fiscal-year filers count from the start of their own year instead.`,
  tool: 'quarterly',
  body: (h) => `<p>Most people call them quarterly payments, yet the windows behind them run three, two, three and four months long. The IRS divides 2026 into four payment periods in ${h.src('p505', 'Publication 505')}, and each one has its own deadline. Paying late for one period is judged on its own, which is why a generous January check does not cure a missed June installment. Looking at what each deadline is meant to cover makes the uneven spacing easier to plan around.</p>
${h.mini('lateQuarter')}
<h2>The 2026 calendar at a glance</h2>
${h.table(['Payment', 'Income earned', 'Due', 'Weekday'], rows, 'Payment periods and due dates for tax year 2026 (Pub 505, Form 1040-ES)', ['l', 'l', 'l', 'l'])}
<p>None of the four 2026 dates lands on a weekend, so no deadline shifts this year. The short spring window is the one that catches people out. Income from ${E.periods[1]} is due ${K.day(D[1])}, only ${gap(D[0], D[1])} days after the first installment, while the last window stretches over ${E.periods[3]} and leaves ${gap(D[2], D[3])} days before its deadline. A freelancer who budgets a fixed amount every three months will feel the squeeze in June and have room to spare in the fall.</p>
<h3>Weekends, holidays and the postmark</h3>
<p>When a due date falls on a Saturday, Sunday or legal holiday, a payment made on the next day that is none of those is on time; Pub 509 lists the holidays. A check sent by mail is treated as paid on the date of the U.S. postmark. The 2026 editions of Form 1040-ES and Pub 505 add a warning here: under a recent clarification of Postal Service rules, the postmark is the date the item is processed at a facility, which may be later than the day you dropped it in a mailbox. Paying electronically sidesteps the question.</p>
<h2>Skipping the January installment</h2>
<p>The fourth payment is optional for anyone who files the full 2026 return early. ${h.src('f1040es', 'Form 1040-ES')} says you do not have to make the ${K.day(D[3])} payment if you file by ${K.day(skip)} and pay the entire balance due with the return. Pub 505 words the same rule with January 31, 2027, which is a ${wd(pub505Day)}, so the next business day applies.</p>
<p>The exception covers only the last period. Pub 505 gives the example of someone who paid nothing during 2026 and filed with full payment on January 26, 2027: the fourth installment counts as paid on time, but a penalty can still apply to the first three, figured up to the day of filing. Filing early is realistic for a sole proprietor with simple books and all 1099 forms in hand; it is rarely possible for anyone waiting on a K-1.</p>
<h2>Starting partway through the year</h2>
<p>You do not owe anything until you have income that will carry tax. Table 2-1 of Pub 505 sets the first deadline by the period in which that income first shows up, and the remaining installments follow the normal calendar.</p>
<ul>
<li>Income before April 1: first payment ${K.day(D[0])}, then the other three dates.</li>
<li>Income first earned ${E.periods[1]}: start ${K.day(D[1])}, then ${K.day(D[2])} and ${K.day(D[3])}.</li>
<li>Income first earned ${E.periods[2]}: start ${K.day(D[2])}, finish ${K.day(D[3])}.</li>
<li>Income first earned after August 31: a single payment on ${K.day(D[3])}.</li>
</ul>
<p>Someone who opens a business in July therefore has two installments for 2026, not four. Form 1040-ES adds that if a large change after March 31 forces you to begin paying, the annualized income installment method is the way to size the payments; the ${h.a('quarterly-estimated-taxes', 'estimated taxes guide')} covers how that method works.</p>
<h2>Farmers and fishermen</h2>
<p>If at least two-thirds of your gross income for 2025 or 2026 comes from farming or fishing, the first three deadlines do not apply. You have one due date, ${K.day(D[3])}, for the whole year's estimated tax. Better still, filing the 2026 Form 1040 by ${K.day(farmFile)} and paying everything due at that time removes the need for any estimated payment. The same group is also held to a lower current-year percentage and is excluded from the higher-income rule, both explained on the ${h.a('safe-harbor', 'safe harbor page')}. A fiscal-year farmer either pays all estimated tax by the 15th day after the year ends or files and pays by the first day of the third month after it.</p>
<h2>Fiscal-year taxpayers</h2>
<p>A tax year that ends on any day other than December 31 moves every deadline. The installments are due on the 15th day of the 4th, 6th and 9th months of the fiscal year and on the 15th day of the first month of the next one. The early-filing exception works the same way: file and pay everything by the last day of the first month after the year ends and the final installment is not needed.</p>
<h2>Putting the dates in your own calendar</h2>
<p>Paying through IRS Direct Pay or EFTPS lets you schedule each installment ahead, so the money leaves on the deadline even if you are traveling. States that tax income set their own estimated-tax rules and dates; check your state revenue department's page or the ${h.a('state-income-tax', 'state income tax comparison')}. When a payment slips, the cost is an interest-like charge for each day it stays unpaid, computed on the ${h.a('underpayment-penalty', 'underpayment penalty page')}.</p>`,
  faqs: [
    { q: 'Why is the second estimated tax payment due in June and not July?', a: `Because the second payment period is only two months long: ${E.periods[1]}. Its deadline, ${K.day(D[1])}, falls ${gap(D[0], D[1])} days after the April one. The IRS periods in Pub 505 are three, two, three and four months, so the installments are not evenly spaced across the year.` },
    { q: 'What happens if an estimated tax deadline falls on a weekend?', a: 'Under the Saturday, Sunday, holiday rule in Pub 505, the payment is on time if made on the next day that is not a weekend day or legal holiday. None of the four 2026 deadlines needs that rule, but it matters for fiscal-year filers and for later years.' },
    { q: 'Can I skip the January 15 estimated payment?', a: `Yes, if you file your 2026 return by ${K.day(skip)} and pay the full balance due with it, as Form 1040-ES states. This removes only the fourth installment. Any shortfall on the April, June or September payments can still carry a penalty, counted up to the day you file.` },
    { q: 'I started freelancing in August. When is my first estimated payment due?', a: `Income first earned between ${E.periods[2]} leads to a first installment on ${K.day(D[2])}, followed by the last one on ${K.day(D[3])}, according to Table 2-1 of Pub 505. If your first taxable income arrives after August 31, the single due date is ${K.day(D[3])}.` },
    { q: 'Do farmers have to make quarterly estimated payments?', a: `Not if at least two-thirds of gross income for 2025 or 2026 comes from farming or fishing. They pay once, by ${K.day(D[3])}, or skip estimated tax altogether by filing the 2026 return and paying everything due by ${K.day(farmFile)}, under Form 1040-ES.` },
  ],
  related: ['quarterly-estimated-taxes', 'underpayment-penalty', 'safe-harbor', 'state-income-tax'],
  sources: ['p505', 'f1040es', 'estimated'],
});
