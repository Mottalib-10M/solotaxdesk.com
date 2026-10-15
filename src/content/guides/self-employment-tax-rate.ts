import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const SE = K.rate(P.se.ssRate + P.se.medicareRate);
const SS = K.rate(P.se.ssRate);
const MED = K.rate(P.se.medicareRate);
const AMT = K.rate(P.additionalMedicare.rate);
const F = `${K.dec(P.se.factor * 100, 2)}%`;
const wb = P.se.wageBase;
const capProfit = wb['2026'] / P.se.factor;
const at60 = K.se(60000);
const job = K.se(60000, 'single', 150000);
const big = K.se(250000);
const big27 = K.se(250000, 'single', 0, '2027');
const top = K.se(300000);
const rows = [20000, 50000, 90000, 150000, 200000, 300000].map((p) => {
  const r = K.se(p);
  return [K.usd(p), K.usd(r.ss), K.usd(r.medicare), K.usd(r.total), K.rate(r.total / p)];
});

export default defineGuide({
  id: 'self-employment-tax-rate',
  group: 'tax',
  order: 12,
  slug: 'self-employment-tax-rate',
  nav: 'Self-employment tax rate',
  card: `The ${SE} rate, the 2026 wage cap and the Medicare surtax`,
  title: 'Self Employment Tax Rate 2026: Wage Cap and Medicare Surtax',
  description: `Self-employment tax rate for 2026: ${SE} on ${F} of profit, Social Security capped at ${K.usd(wb['2026'])} (${K.usd(wb['2027'])} in 2027), plus the 2026 Medicare surtax rules.`,
  h1: `Self-employment tax rate for 2026: what the ${SE} really costs`,
  intro: 'The headline rate is simple; the base it applies to, the cap and the interaction with a paycheck are where the estimate goes wrong.',
  resume: `The self-employment tax rate is ${SE}: ${SS} for Social Security and ${MED} for Medicare, the employer and employee shares of payroll tax paid by one person. It does not apply to the whole profit. You first multiply net profit by ${F}, and the ${SS} part stops once wages and net earnings together reach ${K.usd(wb['2026'])} in 2026, a cap the Social Security Administration has set at ${K.usd(wb['2027'])} for 2027. Medicare has no cap, and above ${K.usd(P.additionalMedicare.threshold.single)} of combined earnings for a single filer (${K.usd(P.additionalMedicare.threshold.mfj)} joint) an Additional Medicare Tax of ${AMT} is added. On ${K.usd(60000)} of profit the SE tax is ${K.usd(at60.total)}, an effective ${K.rate(at60.total / 60000)} of the profit. Half of the ${SE} tax, ${K.usd(at60.half)} here, is subtracted from income for income tax purposes. Below ${K.usd(P.se.minimumNet)} of net earnings nothing is due.`,
  tool: 'se',
  body: (h) => `<p>Enter the net profit of all your businesses combined, the W-2 wages that already carried Social Security tax, and the year. The result splits the tax into its Social Security and Medicare parts, adds the Additional Medicare Tax when it applies, and shows the half you deduct. Switching the year to 2027 applies the higher wage base announced by the ${h.src('ssa_2027', 'Social Security Administration')}.</p>
${h.mini('seHalf')}
<h2>Why ${SE} and not ${K.rate(P.payroll.ssEmployee + P.payroll.medicareEmployee)}</h2>
<p>An employee sees ${K.rate(P.payroll.ssEmployee + P.payroll.medicareEmployee)} withheld from each paycheck and rarely notices that the employer pays the same amount again. Self-employed people are both sides of that arrangement, so they pay ${SS} for Social Security and ${MED} for Medicare. The money funds the same benefits: the SSA uses Schedule SE to credit your earnings record, and the tax applies at any age, even if you already draw Social Security or Medicare (${h.src('i1040sse', 'Schedule SE instructions')}).</p>
<h3>The ${F} step</h3>
<p>The rate is not applied to profit directly. Net earnings from self-employment are ${F} of profit, which mirrors the fact that an employer's half of payroll tax is not part of an employee's wage. So the effective rate on profit is a little lower than the headline: ${K.rate(P.se.factor * (P.se.ssRate + P.se.medicareRate))} as long as you stay below the cap. The deduction of half the tax then works on the income tax side, not on SE tax itself.</p>
${h.table(['Net profit', `Social Security ${SS}`, `Medicare ${MED}`, 'SE tax', 'Share of profit'], rows, 'Self-employment tax in 2026, single filer, no wages, Additional Medicare Tax not included', ['l', 'r', 'r', 'r', 'r'])}
<h2>The Social Security wage base</h2>
<p>The ${SS} part applies only to the first ${K.usd(wb['2026'])} of combined wages and net earnings in 2026. With no job, you hit that cap at about ${K.usd(capProfit)} of profit. Beyond it, each extra dollar of profit carries only Medicare, which is why the share in the table falls at the top. In 2027 the cap rises to ${K.usd(wb['2027'])}: on ${K.usd(250000)} of profit, SE tax goes from ${K.usd(big.total)} for 2026 to ${K.usd(big27.total)} for 2027, all of it in the Social Security part.</p>
<h3>With a job on the side, wages go first</h3>
<p>Wages taxed for Social Security use up the base before self-employment does. A single filer earning ${K.usd(150000)} in salary and ${K.usd(60000)} from a side business has only ${K.usd(wb['2026'] - 150000)} of room left, so Social Security applies to ${K.usd(job.ssBase)} of net earnings instead of ${K.usd(at60.netEarnings)}. The SE tax drops to ${K.usd(job.total)}, against ${K.usd(at60.total)} without the job. Once wages alone reach the base, no ${SS} is due on any self-employment income, but the ${MED} Medicare part still is (${h.src('p334', 'Publication 334')}).</p>
<h2>The Additional Medicare Tax</h2>
<p>A separate ${AMT} applies to earnings above ${K.usd(P.additionalMedicare.threshold.single)} single or head of household, ${K.usd(P.additionalMedicare.threshold.mfj)} married filing jointly and ${K.usd(P.additionalMedicare.threshold.mfs)} married filing separately. Wages and self-employment income are added to test the threshold, and a self-employment loss is ignored. These thresholds are not indexed for inflation, so more people reach them each year (${h.src('i8959', 'Form 8959 instructions')}). On ${K.usd(300000)} of profit a single filer owes ${K.usd(top.additionalMedicare)} of it on top of ${K.usd(top.total)} of SE tax. It is figured on Form 8959, and no half of it is deductible.</p>
<h2>Where the deduction for half fits</h2>
<p>Half of the ${SE} tax goes on Schedule 1 as an adjustment to income. It reduces income tax, at your marginal rate, but it never reduces SE tax itself. A person in the ${K.rate(P.brackets.single[2][1])} bracket gets back ${K.rate(P.brackets.single[2][1])} of that half; the rest of the self-employment tax is a real cost. The ${h.a('schedule-se', 'Schedule SE guide')} walks through the lines where each of these amounts appears, and the ${h.a('1099-tax-calculator', '1099 tax calculator')} combines SE tax with income and state tax.</p>
${h.mini('sideGig')}
<h2>Several businesses and married couples</h2>
<p>The base is per person, not per business. Someone with a consulting practice and an online shop adds the two net profits, and a loss in one reduces the other, before a single SE tax is computed. Spouses are treated separately even on a joint return: each one with self-employment income figures their own tax against their own ${K.usd(P.se.wageBase['2026'])} cap, so a couple can pay Social Security tax on far more than that amount in total. The Additional Medicare Tax is the exception, since its threshold for a joint return looks at both spouses' combined earnings.</p>
<h2>Paying it during the year</h2>
<p>SE tax is not billed separately. It sits inside your estimated tax, on line 9 of the 2026 worksheet in ${h.src('f1040es', 'Form 1040-ES')}, which also tells you to use only ${F} of profit when estimating it. Missing it in the quarterly payments is the usual reason new freelancers face an underpayment penalty, since income tax alone can look small in the first year.</p>
<h2>When SE tax is not owed</h2>
<p>Below ${K.usd(P.se.minimumNet)} of net earnings for the year, no SE tax is due. Some income never enters the base: rental income from real estate held outside a dealer business, dividends and interest that are not part of the trade, and gains on property that is not inventory. Notary fees go on Schedule C but are exempt from SE tax. The owner of an S corporation pays payroll tax on salary instead, which is the reason for the ${h.a('llc-vs-s-corp', 'S corp comparison')}.</p>`,
  faqs: [
    { q: 'Why is self-employment tax so high compared with what employees pay?', a: `Because you pay both halves. An employee has ${K.rate(P.payroll.ssEmployee + P.payroll.medicareEmployee)} withheld and the employer adds the same again out of sight. As a self-employed worker you pay the full ${SE} on ${F} of profit. Half of it is then deducted from income, which softens the income tax but not the SE tax itself.` },
    { q: 'What is the Social Security wage base for 2027?', a: `${K.usd(wb['2027'])}, up from ${K.usd(wb['2026'])} in 2026, according to the Social Security Administration's 2027 fact sheet. It caps the ${SS} Social Security part of SE tax on combined wages and net earnings. Medicare's ${MED} applies with no cap, and the IRS uses the new base on the 2027 Schedule SE and estimated tax worksheet.` },
    { q: 'Do I stop paying self-employment tax after the wage base?', a: `Only the Social Security part stops. Above ${K.usd(wb['2026'])} of combined wages and net earnings in 2026, the ${SS} no longer applies, but ${MED} for Medicare continues on every dollar, plus ${AMT} once earnings pass ${K.usd(P.additionalMedicare.threshold.single)} single or ${K.usd(P.additionalMedicare.threshold.mfj)} joint (Form 8959).` },
    { q: 'Does self-employment tax apply once I am retired and on Social Security?', a: `Yes. The Schedule SE instructions say the tax applies no matter how old you are and even if you already receive Social Security or Medicare benefits. Net earnings of ${K.usd(P.se.minimumNet)} or more from consulting or any other business in retirement carry the full ${SE}, and the SSA credits them to your earnings record.` },
    { q: 'Is the self-employment tax rate the same in every state?', a: `Yes. SE tax is federal, so the ${SE} rate, the ${F} base and the ${K.usd(wb['2026'])} cap are identical in all states. What changes from state to state is income tax, and a few states and cities tax self-employment profit separately. The state pages list those local rules with their sources.` },
  ],
  related: ['schedule-se', '1099-tax-calculator', 'how-much-to-set-aside', 'llc-vs-s-corp', '1099-vs-w2'],
  sources: ['i1040sse', 'ssa_2027', 'i8959', 'p334', 'f1040es', 'se_tax'],
});
