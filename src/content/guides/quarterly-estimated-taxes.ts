import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const E = P.estimated;
const ex = K.solo({ profit: 90000, filing: 'single' });
const exEst = K.est({ expectedTax: ex.federalTotal, priorTax: 14000, priorAgi: 80000, withholding: 0, filing: 'single' });
const cur = K.rate(E.currentYearShare), prev = K.rate(E.priorYearShare), high = K.rate(E.priorYearShareHigh);
const profits = [40000, 60000, 90000, 120000, 180000];
const rows = profits.map((p) => {
  const s = K.solo({ profit: p, filing: 'single' });
  return [K.usd(p), K.usd(s.se.total), K.usd(s.incomeTax), K.usd(s.federalTotal), K.usd(s.federalTotal * E.currentYearShare / 4)];
});

export default defineGuide({
  id: 'quarterly-estimated-taxes',
  group: 'quarterly',
  order: 1,
  slug: 'quarterly-estimated-taxes',
  nav: 'Quarterly estimated taxes',
  card: 'Who has to pay during the year, how much, and how to send it',
  title: 'Quarterly Estimated Taxes 2026: Who Pays and How Much',
  description: `Quarterly estimated taxes for 2026: the ${K.usd(E.minimumOwed)} test, the ${cur} and ${prev} rules, a payment per quarter for your profit and every way to pay the IRS. Free.`,
  h1: 'Quarterly estimated taxes for 2026: the amount and the way to pay',
  intro: 'No employer withholds tax from freelance income, so the IRS expects you to send it yourself during the year. Enter your expected profit and last year\'s tax to get one figure per quarter.',
  resume: `You owe quarterly estimated taxes for 2026 when two things are true: you expect to owe at least ${K.usd(E.minimumOwed)} after withholding and refundable credits, and what is withheld will fall short of the smaller of ${cur} of your 2026 tax or ${prev} of the tax on your 2025 return. If your 2025 adjusted gross income passed ${K.usd(E.highAgi.single)} (${K.usd(E.highAgi.mfs)} married filing separately), the second figure becomes ${high}. Estimated tax covers both income tax and self-employment tax, the ${K.rate(P.se.ssRate + P.se.medicareRate)} Social Security and Medicare charge on ${K.rate(P.se.factor)} of profit. A single freelancer with ${K.usd(90000)} of profit and no other income owes about ${K.usd(ex.se.total)} of self-employment tax and ${K.usd(ex.incomeTax)} of income tax, ${K.usd(ex.federalTotal)} in all. If that person paid ${K.usd(14000)} for 2025, the cheaper route is ${exEst.rule}, so ${K.usd(exEst.perQuarter)} per installment is enough to avoid a penalty. Payments go through your IRS Online Account, IRS Direct Pay, EFTPS, a card, or a check with a 1040-ES voucher.`,
  tool: 'quarterly',
  body: (h) => `<p>Estimated tax is the pay-as-you-go system for income that nobody withholds from: freelance invoices, gig work, rent, interest. ${h.src('p505', 'Publication 505')} spells out that the same payments cover income tax and self-employment tax, so a sole proprietor or single-member LLC owner sends one combined amount, not two. The calculator above starts from your expected profit, works out the federal tax the 2026 return will show, then compares it with last year's tax to pick the smallest amount that keeps you clear of a penalty.</p>
${h.mini('invoice')}
<h2>The ${K.usd(E.minimumOwed)} test and the two percentages</h2>
<p>Form 1040-ES sets two conditions, and both must apply before payments become mandatory. First, the balance you expect to owe with the return, after subtracting withholding and refundable credits, has to reach ${K.usd(E.minimumOwed)}. Second, your withholding and refundable credits must come in below the smaller of ${cur} of the tax on your 2026 return and ${prev} of the tax on your 2025 return, a return that has to cover a full twelve months. A side gig that leaves you owing ${K.usd(E.minimumOwed - 200)} at filing time does not trigger anything; a full-time practice almost always does.</p>
<p>Higher earners use ${high} instead of ${prev} for the prior-year comparison once 2025 AGI went above ${K.usd(E.highAgi.single)}, or ${K.usd(E.highAgi.mfs)} for a married person filing separately in 2026 (${h.src('f1040es', 'Form 1040-ES, Special Rules')}). The full set of thresholds, and why the prior-year anchor is usually the safer choice for a growing business, is on the ${h.a('safe-harbor', 'safe harbor page')}.</p>
<h3>Who escapes the whole system</h3>
<p>A U.S. citizen or resident alien for all of 2025 who had no tax liability for that full year does not have to pay estimated tax for 2026. The IRS counts a total tax of zero, or no filing requirement at all, as no liability. Someone who left a salaried job in 2025 and had everything withheld does not fall in this group: their 2025 return showed tax, so the normal rules apply in the first freelance year.</p>
<h2>Working out the number for 2026</h2>
<p>The official route is the Estimated Tax Worksheet in Form 1040-ES. You project adjusted gross income, take off the standard deduction (${K.usd(P.standardDeduction.single)} for a single filer, ${K.usd(P.standardDeduction.mfj)} for a joint return) or your itemized total, apply the 2026 brackets from ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}, then add self-employment tax on ${K.rate(P.se.factor)} of net profit. Half of that self-employment tax is subtracted when you figure AGI, which the worksheet handles on its own line. The qualified business income deduction, worth up to ${K.rate(P.qbi.rate)} of business profit under the income threshold, lowers the income tax part but never the self-employment part.</p>
${h.table(['Net profit', 'SE tax', 'Income tax', 'Federal total', `${cur} rule, per quarter`], rows, 'Single filer, standard deduction, no other income, 2026 federal figures from the calculator engine', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column divides ${cur} of the projected bill by four. That is the current-year route. It saves cash when 2026 is shaping up worse than 2025, but it depends on a projection you cannot check until December. Look at the share of the total that is self-employment tax at low profits: at ${K.usd(40000)} it is the larger part of the bill, which surprises people who expected the standard deduction to wipe out most of their tax. The ${h.a('self-employment-tax-rate', 'self-employment tax page')} explains the ${K.rate(P.se.factor)} base and the Social Security cap of ${K.usd(P.se.wageBase['2026'])}.</p>
<h3>Starting from last year instead</h3>
<p>The other route needs no forecast at all: take line 24 of the 2025 Form 1040, multiply by ${prev} or ${high}, subtract expected withholding, and divide by four. You may owe more in spring 2027 if 2026 turns out bigger, but no penalty applies on that difference. Many freelancers use this for the first three installments, then check the January payment against actual numbers.</p>
<h2>Ways to send the money</h2>
<p>Form 1040-ES lists the channels, and the electronic ones give you a confirmation the same day.</p>
<ul>
<li><strong>IRS Online Account.</strong> Pay estimated tax directly and see five years of payment history in one place.</li>
<li><strong>IRS Direct Pay.</strong> A transfer from a checking or savings account with no fee and no enrollment.</li>
<li><strong>EFTPS.</strong> The Treasury's Electronic Federal Tax Payment System, online or by phone, free but only once you have enrolled.</li>
<li><strong>Debit card, credit card or digital wallet.</strong> Accepted through processors listed on IRS.gov/Payments; each one charges a fee.</li>
<li><strong>Check or money order.</strong> Payable to "United States Treasury", with "2026 Form 1040-ES" and your SSN written on it, mailed with the voucher for that due date to the address for your state.</li>
</ul>
<p>Two other options are easy to forget. A refund on the 2025 return can be credited to 2026 estimated tax; filed on time, it counts as paid on ${K.day(E.dueDates[0])} (${h.src('p505', 'Pub 505, Credit an Overpayment')}). And you can make more than four payments, monthly for instance, as long as the total paid by each deadline reaches what was due for that period. Payments must be in U.S. dollars; the IRS does not accept digital assets.</p>
<h2>Uneven income: the annualized method</h2>
<p>Equal installments assume the money arrives evenly. A wedding photographer who earns most of the year between June and September, or a consultant who lands one large contract in the fall, can lower the early payments with the annualized income installment method in chapter 2 of Pub 505. You estimate income and deductions up to the end of each period, annualize them on Worksheet 2-9, and pay the result for that period. The catch: whoever uses it must attach Form 2210 with Schedule AI to the 2026 return, even when no penalty is owed. The ${h.a('underpayment-penalty', 'penalty guide')} shows what happens when an early installment comes in short.</p>
<h3>Changing course halfway</h3>
<p>If a big invoice or a lost client changes the picture, refigure the year with Worksheet 2-12 of Pub 505. The required total by the next deadline is ${K.rate(0.5)} of the amended estimate if that deadline is in June, ${K.rate(0.75)} if it is in September and ${K.rate(1)} in January, minus what you already paid. The dates themselves, and the rule that lets you skip the January installment, are on the ${h.a('estimated-tax-due-dates', 'due dates page')}. State income tax runs on a separate track with its own forms; the calculator shows the state's yearly amount next to the federal installments.</p>`,
  faqs: [
    { q: 'Do I have to pay quarterly taxes on a small side business?', a: `Only if the balance you would owe at filing time reaches ${K.usd(E.minimumOwed)} after withholding and refundable credits. Someone with a salary can often stay under it by asking the employer to withhold more on a new Form W-4, which Form 1040-ES suggests as an alternative to separate payments.` },
    { q: 'Is it better to pay estimated tax by EFTPS or IRS Direct Pay?', a: 'Both are free transfers from a bank account. Direct Pay needs no sign-up and works for one payment at a time. EFTPS needs enrollment before the first use but lets you schedule payments ahead and pay by phone. The IRS Online Account also accepts estimated payments and shows the history of what you sent.' },
    { q: 'Can I make one estimated payment for the whole year instead of four?', a: `Yes. Form 1040-ES lets you pay the full year by the first due date, ${K.day(E.dueDates[0])}. You can also pay more often than four times. What matters for the penalty is that the cumulative amount paid by each deadline is at least what was required by that deadline.` },
    { q: 'Do quarterly estimated taxes include self-employment tax?', a: `Yes. One payment covers income tax and self-employment tax together, as Pub 505 explains. For a single filer with ${K.usd(90000)} of profit, self-employment tax is about ${K.usd(ex.se.total)} of a ${K.usd(ex.federalTotal)} federal total, so leaving it out would cut the installments by well over half.` },
    { q: 'What if my income is much higher in the second half of the year?', a: 'The annualized income installment method in Pub 505 lets the required payment follow the income: smaller amounts for the quiet periods, larger ones later. You must then file Form 2210 with Schedule AI along with the 2026 return, even if no penalty is due, so keep monthly profit figures.' },
  ],
  related: ['estimated-tax-due-dates', 'safe-harbor', 'underpayment-penalty', 'how-much-to-set-aside', 'self-employment-tax-rate'],
  sources: ['f1040es', 'p505', 'estimated', 'rp_2025_32'],
});
