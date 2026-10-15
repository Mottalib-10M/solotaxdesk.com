import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.estimated;
const D = E.dueDates;
const R = E.underpaymentRate;
const payDay = '2027-04-15';
const days = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const miss = 3000;
const one = [0, 1, 2, 3].map((k) => K.penalty([0, 1, 2, 3].map((j) => (j === k ? miss : 0))).total);
const even = K.penalty([2000, 2000, 2000, 2000]);
const rateRows = [
  ['January 1 to March 31, 2026', K.rate(R['2026Q1']), 'Published'],
  ['April 1 to June 30, 2026', K.rate(R['2026Q2']), 'Published'],
  ['July 1 to September 30, 2026', K.rate(R['2026Q3']), 'Published'],
  ['October 1 to December 31, 2026', K.rate(R['2026Q4']), 'Published'],
  ['From January 1, 2027', K.rate(E.rateAssumedAfter), 'Not yet published: last known rate assumed'],
];
const exRows = D.map((d, k) => [`Installment ${k + 1}, due ${K.day(d)}`, K.usd(miss), K.num(days(d, payDay)), K.usd(one[k])]);

export default defineGuide({
  id: 'underpayment-penalty',
  group: 'quarterly',
  order: 4,
  slug: 'underpayment-penalty',
  nav: 'Underpayment penalty',
  card: 'What a short or late estimated payment costs, quarter by quarter',
  title: 'Underpayment Penalty 2026: Form 2210, Rates and Waivers',
  description: `Underpayment penalty for 2026 estimated tax: Form 2210, the IRS rates of ${K.rate(R['2026Q1'])} and ${K.rate(R['2026Q2'])} by quarter, the waivers and the annualized method. Calculator, free.`,
  h1: 'The 2026 estimated tax underpayment penalty, figured by quarter',
  intro: 'The penalty for paying estimated tax late works like interest on each missed installment. Enter what you owed and what you paid on each date to see the charge.',
  resume: `The underpayment penalty is an interest-like charge on each estimated tax installment that was paid late or short, counted day by day from its due date until it is paid. It is figured on Form 2210, separately for each of the four periods, at the IRS underpayment rate: ${K.rate(R['2026Q1'])} for the first quarter of 2026, ${K.rate(R['2026Q2'])} for the second, ${K.rate(R['2026Q3'])} for the third and ${K.rate(R['2026Q4'])} for the fourth. The rate for January to March 2027 is not published yet, so the calculator applies the last known rate, ${K.rate(E.rateAssumedAfter)}, to that stretch. Missing ${K.usd(miss)} on the ${K.day(D[0])} installment and paying it on ${K.day(payDay)} costs about ${K.usd(one[0])}; the same shortfall on the ${K.day(D[3])} installment costs about ${K.usd(one[3])}. No penalty applies if you owe less than ${K.usd(E.minimumOwed)} or met a safe harbor. The IRS may waive it after a casualty or disaster, or for someone who retired after 62 or became disabled.`,
  tool: 'penalty',
  body: (h) => `<p>Despite its name, this penalty behaves like interest. ${h.src('f1040es', 'Form 1040-ES')} describes it as a charge imposed on each underpayment for the number of days it remains unpaid. That has two practical effects. A payment made late still stops the meter on the day it arrives, so catching up in October is far cheaper than waiting for the return. And the charge can apply even when the return ends up showing a refund, because what counts is how much was in by each deadline, not the year's total (${h.src('p505', 'Pub 505, chapter 2')}).</p>
${h.mini('safe110')}
<h2>When the penalty applies at all</h2>
<p>Two tests come first. If the balance due with the return, after withholding and refundable credits, is under ${K.usd(E.minimumOwed)}, there is no penalty. If your payments reached the safe harbor, the smaller of ${K.rate(E.currentYearShare)} of the 2026 tax or ${K.rate(E.priorYearShare)} of the 2025 tax (${K.rate(E.priorYearShareHigh)} above ${K.usd(E.highAgi.single)} of 2025 AGI), in the right amounts by the right dates, there is none either. The ${h.a('safe-harbor', 'safe harbor page')} works through those thresholds. Only when both tests fail does Form 2210 come into play.</p>
<h2>How Form 2210 prices a missed installment</h2>
<p>The form starts from the required annual payment and splits it into four required installments, one quarter each under the regular method. For each period it compares what was required with what you paid by that due date. Any shortfall accrues the underpayment rate for every day it stays open, and the rate itself can change from one calendar quarter to the next. The IRS sets it each quarter and publishes it on its ${h.src('interest', 'quarterly interest rates page')}.</p>
${h.table(['Days counted in', 'Underpayment rate', 'Status'], rateRows, 'IRS underpayment rate for individuals, read 2026-10-15', ['l', 'r', 'l'])}
<p>The rate for the first quarter of 2027 matters because a fourth-installment shortfall, and every earlier one still open, keeps accruing until the return is filed. As of the date this page was checked, the IRS had not announced it. The calculator therefore uses ${K.rate(E.rateAssumedAfter)} for days after December 31, 2026, and the figure will be replaced once the IRS publishes the actual rate.</p>
<h3>What ${K.usd(miss)} costs, depending on which installment</h3>
${h.table(['Shortfall on', 'Amount', `Days to ${K.day(payDay)}`, 'Penalty'], exRows, 'One installment short, the rest paid on time; shortfall paid with the return (calculator engine, 365-day year)', ['l', 'r', 'r', 'r'])}
<p>The earlier the miss, the higher the cost, simply because the shortfall stays open longer. Being ${K.usd(2000)} short on all four installments and paying the whole ${K.usd(8000)} with the return costs about ${K.usd(even.total)}. Set against the tax itself, the charge is modest, but it buys nothing and is easy to avoid with the safe harbor.</p>
<h3>Payments that come in late</h3>
<p>The calculator above works from what you actually sent on each date. A later payment covers the oldest unpaid installment first, which stops the clock on that shortfall from the day you paid. So a ${K.day(D[2])} payment large enough to catch up on June ends the June penalty in September, and only the remainder rolls forward.</p>
<h3>Refiguring after a good month</h3>
<p>Pub 505 flags a trap for people who raise their payments partway through the year. If you started with equal installments and then increase the later ones because income jumped, the earlier periods can still show an underpayment, since each one is measured against a quarter of the final required amount. The publication points to Schedule AI as the way to avoid or reduce that charge: income that only arrived in the summer does not need to have been paid for in April. Keeping month-by-month profit figures makes the schedule possible to complete.</p>
<h2>Waivers the IRS can grant</h2>
<p>${h.src('tc306', 'IRS Topic 306')} lists two cases in which the penalty may be waived:</p>
<ul>
<li>the payment was missed because of a casualty, a disaster or another unusual circumstance, and charging the penalty would be inequitable;</li>
<li>you retired after reaching age 62, or became disabled, during the tax year or the year before, and the underpayment came from reasonable cause rather than willful neglect.</li>
</ul>
<p>A waiver is requested with Form 2210, following its instructions. Form 1040-ES also notes a narrow waiver tied to an election under section 1062 for the sale of qualified farmland to a qualified farmer.</p>
<h2>The annualized method as a defense</h2>
<p>A business whose income piles up late in the year can look underpaid under equal installments when it was not. Schedule AI of Form 2210, the annualized income installment method, recomputes each required installment from the income actually earned through the end of each period. A landscaper whose income arrives between May and October can see the April installment shrink or disappear. Anyone using the method must file Form 2210 with Schedule AI, even when the result is no penalty at all. The ${h.a('quarterly-estimated-taxes', 'quarterly tax guide')} explains how to size payments with it during the year.</p>
<h2>Letting the IRS do the math</h2>
<p>Pub 505 notes that the IRS can generally figure the penalty for you and send a bill, so filling in Form 2210 is not mandatory in the simple case. It becomes worth doing when you claim a waiver, use the annualized method, or paid unevenly and want each payment credited on its real date. The calculator gives a close estimate for planning; the IRS computation on the notice is the one that counts. To avoid the question next year, size the installments on the ${h.a('estimated-tax-due-dates', 'due dates calendar')}.</p>`,
  faqs: [
    { q: 'How much is the IRS penalty for missing one quarterly payment?', a: `It depends on the amount and how long it stays unpaid. At the 2026 rates of ${K.rate(R['2026Q1'])} and ${K.rate(R['2026Q2'])} a year, ${K.usd(miss)} missed on the ${K.day(D[1])} installment and paid with the return on ${K.day(payDay)} costs about ${K.usd(one[1])}. Paying sooner cuts it, since the charge runs by the day.` },
    { q: 'Can I get an underpayment penalty if I am getting a refund?', a: 'Yes. Pub 505 warns that a penalty may apply even if you are due a refund when you file. The penalty looks at how much was paid by each due date, so a big January payment or withholding late in the year does not erase a shortfall from April or June.' },
    { q: 'Is the estimated tax penalty waived for retirees?', a: `It can be, under IRS Topic 306: if you retired after age 62 or became disabled in the tax year or the year before, and the underpayment was due to reasonable cause and not willful neglect. You request the waiver through Form 2210, as its instructions describe.` },
    { q: 'What interest rate will the IRS use for the penalty in early 2027?', a: `The IRS had not published the January to March 2027 underpayment rate when this page was checked. The calculator applies the last known rate, ${K.rate(E.rateAssumedAfter)}, to days after December 31, 2026. The IRS posts each new rate on its quarterly interest rates page, and the calculator will switch to it.` },
    { q: 'Do I have to fill out Form 2210 myself?', a: 'Not always. The IRS can generally figure the penalty and bill you. You need Form 2210 when you request a waiver, when you use the annualized income installment method with Schedule AI, or when your payments were uneven and you want each one counted on the date it was made.' },
  ],
  related: ['safe-harbor', 'quarterly-estimated-taxes', 'estimated-tax-due-dates', 'how-much-to-set-aside'],
  sources: ['tc306', 'interest', 'p505', 'f1040es'],
});
