import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const SE = K.rate(P.se.ssRate + P.se.medicareRate);
const ex = K.solo({ profit: 85000, filing: 'single' });
const exJ = K.solo({ profit: 85000, filing: 'mfj' });
const hundred = K.solo({ profit: 100000, filing: 'single' });
const kid = K.solo({ profit: 85000, filing: 'mfj', children: 2 });
const rows = [40000, 85000, 120000, 180000].map((p) => {
  const r = K.solo({ profit: p, filing: 'single' });
  return [K.usd(p), K.usd(r.se.total), K.usd(r.qbi.deduction), K.usd(r.incomeTax), K.usd(r.federalTotal), K.rate(r.federalTotal / p)];
});
const d = P.estimated.dueDates;

export default defineGuide({
  id: '1099-tax-calculator',
  group: 'tax',
  order: 11,
  slug: '1099-tax-calculator',
  nav: '1099 tax calculator',
  card: 'Federal, self-employment and state tax on contractor income',
  title: '1099 Tax Calculator 2026: Federal, SE and State Tax Owed',
  description: `1099 tax calculator for 2026: ${SE} self-employment tax, income tax after the QBI deduction, state and city tax on contractor pay, plus what to set aside.`,
  h1: '1099 tax calculator: everything you owe on contractor income in 2026',
  intro: 'Type the profit your 1099 work leaves after expenses, pick a state and a filing status, and the whole 2026 bill appears line by line.',
  resume: `Income reported on a 1099 carries two federal taxes, not one. Self-employment tax of ${SE} applies to ${K.dec(P.se.factor * 100, 2)}% of net profit (the Social Security part stops at ${K.usd(P.se.wageBase['2026'])} in 2026), and ordinary income tax applies to what is left after half of that SE tax, the ${K.usd(P.standardDeduction.single)} standard deduction for a single filer and the ${K.rate(P.qbi.rate)} qualified business income deduction. A single contractor with ${K.usd(85000)} of profit and no other income owes ${K.usd(ex.se.total)} of SE tax and ${K.usd(ex.incomeTax)} of income tax, ${K.usd(ex.federalTotal)} in all, or ${K.rate(ex.federalTotal / 85000)} of the profit. Married filing jointly, the same profit costs ${K.usd(exJ.federalTotal)}, because the wider brackets lower the income tax while SE tax does not move. State income tax and any city tax come on top, and the calculator adds them for the state you choose. Nobody withholds any of this, so the total is paid through four estimated payments, the first due ${K.day(d[0])}.`,
  tool: 'total',
  body: (h) => `<p>The calculator starts from net profit: what clients paid you, whether or not a Form 1099-NEC or 1099-K arrived, minus the business expenses you can deduct. That is the figure on line 31 of ${h.src('i1040sc', 'Schedule C')}, and it feeds both of the federal taxes a contractor pays. Enter W-2 wages if you also hold a job, because they change both the Social Security cap and the bracket your 1099 income lands in. Health premiums, retirement contributions and children are in the extra fields.</p>
${h.mini('seQuick')}
<h2>Three layers on one profit</h2>
<p>Think of the bill as three layers stacked on the same dollars. The first is self-employment tax, Social Security and Medicare for people who have no employer to pay half. The second is federal income tax, the same brackets employees use. The third is whatever your state and, in some places, your city charge on income. The calculator shows each layer on its own line so you can see which one drives your total.</p>
<h3>SE tax: the layer with no brackets</h3>
<p>Self-employment tax is flat. Take ${K.dec(P.se.factor * 100, 2)}% of the profit, then apply ${K.rate(P.se.ssRate)} for Social Security on the part up to ${K.usd(P.se.wageBase['2026'])} and ${K.rate(P.se.medicareRate)} for Medicare on all of it. It starts with the first dollar once net earnings reach ${K.usd(P.se.minimumNet)}, with no standard deduction and no lower rate for small amounts. That is why a contractor earning modest sums often pays more SE tax than income tax. The ${h.a('self-employment-tax-rate', 'self-employment tax rate page')} explains the cap and the ${K.rate(P.additionalMedicare.rate)} surtax above ${K.usd(P.additionalMedicare.threshold.single)}.</p>
<h3>Income tax: after three subtractions</h3>
<p>Before any bracket applies, three amounts come off. Half of the SE tax is an adjustment on Schedule 1, which lowers adjusted gross income. The standard deduction is ${K.usd(P.standardDeduction.single)} single and ${K.usd(P.standardDeduction.mfj)} joint for 2026. Then the qualified business income deduction removes up to ${K.rate(P.qbi.rate)} of the business income, within limits explained on the ${h.a('qbi-deduction', 'QBI deduction page')}. What remains goes through the 2026 brackets from ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}.</p>
${h.table(['Net profit', 'SE tax', 'QBI deduction', 'Income tax', 'Federal total', 'Share of profit'], rows, 'Single filer, 2026, no other income, no state tax', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Read the last column with care. The share rises with profit, but slowly, because SE tax is a fixed percentage while income tax climbs through the brackets. Past the Social Security cap the SE layer thins out and income tax takes over as the main cost.</p>
<h2>A single contractor at ${K.usd(85000)}</h2>
<p>Here is the full chain for ${K.usd(85000)} of profit. Net earnings for SE purposes are ${K.usd(ex.se.netEarnings)}, and the tax on them is ${K.usd(ex.se.total)}. Half of that, ${K.usd(ex.se.half)}, comes off income, which leaves adjusted gross income of ${K.usd(ex.agi)}. After the standard deduction and a QBI deduction of ${K.usd(ex.qbi.deduction)}, taxable income is ${K.usd(ex.taxable)} and income tax is ${K.usd(ex.incomeTax)}. The top dollar is taxed at ${K.rate(ex.marginal)}, but the average rate on the whole profit is far lower.</p>
<p>Two children change the picture for a married couple: with the ${K.usd(P.childTaxCredit)} child tax credit for each, the same ${K.usd(85000)} profit filed jointly leaves ${K.usd(kid.incomeTax)} of income tax. The credit does not touch SE tax, which stays at ${K.usd(kid.se.total)}.</p>
<h2>Where the state comes in</h2>
<p>States start from your federal figures and apply their own rules: some tax nothing, some charge one flat rate, others use brackets with their own deductions. A handful of cities and counties tax earnings or business profit as well. Choose your state in the calculator and the line appears with its source; the ${h.a('state-income-tax', 'state income tax comparison')} puts every state side by side. Where the state figures have not been verified yet, the calculator shows nothing for the state rather than guess.</p>
<h2>When there is also a paycheck</h2>
<p>Enter your salary in the W-2 field and two things change. The salary fills the standard deduction and the lower brackets first, so the 1099 profit is taxed at your top rate, which raises the share you need to keep. At the same time, wages already taxed for Social Security use part of the ${K.usd(P.se.wageBase['2026'])} base, which trims the SE tax on the side income. The result card then shows the tax this side income adds to the tax you would owe on the salary alone, which is the figure to set aside. If your employer withholds generously, you may not need estimated payments at all: a new Form W-4 can cover the side profit instead.</p>
<h2>What the result does not cover</h2>
<p>The tool models one business, the standard deduction and the child tax credit. It does not see itemized deductions, capital gains, a spouse's business, education credits, or losses carried from earlier years. It assumes the profit you type is final, so deductions you have not recorded yet will lower the real figure. For a precise return, the result is a starting point to check with a CPA or enrolled agent, not a filing.</p>
${h.mini('invoice')}
<h2>Paying the bill during the year</h2>
<p>Clients do not withhold tax from contractor pay, so the IRS expects you to send it in four installments. For 2026 they are due ${K.day(d[0])}, ${K.day(d[1])}, ${K.day(d[2])} and ${K.day(d[3])} (${h.src('f1040es', 'Form 1040-ES 2026')}). You must pay estimated tax when you expect to owe at least ${K.usd(P.estimated.minimumOwed)} after withholding. The calculator gives a per-quarter figure, and the ${h.a('quarterly-estimated-taxes', 'quarterly tax calculator')} shows how to pay less early in the year by basing the payments on last year's tax instead.</p>`,
  faqs: [
    { q: 'How do you calculate taxes on 1099 income?', a: `Start from profit, not from the amounts on your 1099 forms: income minus deductible expenses. Apply ${SE} to ${K.dec(P.se.factor * 100, 2)}% of that profit for SE tax. Then subtract half the SE tax, the standard deduction and the QBI deduction, and run what is left through the 2026 brackets. Add your state tax on top.` },
    { q: 'Is 1099 income taxed more heavily than W-2 pay?', a: `The income tax brackets are identical. The difference is Social Security and Medicare: an employee pays half and the employer pays the other half, while a contractor pays both, ${SE} in total. Half of it is deductible, and the QBI deduction offsets part of the gap, but on the same gross amount a contractor usually pays more.` },
    { q: 'What is the tax on $100,000 of 1099 income?', a: `For a single filer with ${K.usd(100000)} of profit and no other income in 2026, SE tax is ${K.usd(hundred.se.total)} and federal income tax is ${K.usd(hundred.incomeTax)}, a federal total of ${K.usd(hundred.federalTotal)}. That is ${K.rate(hundred.federalTotal / 100000)} of the profit before any state tax. Gross receipts of ${K.usd(100000)} with expenses would cost less.` },
    { q: 'Does the 1099 calculator include state and city tax?', a: 'Yes, when the state data has been verified against the state revenue agency: pick the state and, where one exists, the city or county tax. A state whose figures are still being checked shows no state tax, and the note under the result says so. Federal and SE figures always come from the 2026 IRS documents.' },
    { q: 'How can a contractor lower the tax on 1099 income?', a: `Every legitimate business expense lowers both SE tax and income tax, so record mileage, a home office and equipment. Health premiums and SEP or solo 401(k) contributions cut income tax. Once profit is high enough to pay for a payroll, an S corp election can also cut SE tax; compare the two with real numbers before you decide.` },
  ],
  related: ['self-employment-tax-rate', 'how-much-to-set-aside', 'quarterly-estimated-taxes', 'qbi-deduction', 'llc-vs-s-corp'],
  sources: ['f1040es', 'rp_2025_32', 'i1040sc', 'i1040sse', 'ssa_2027'],
});
