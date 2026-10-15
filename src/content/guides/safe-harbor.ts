import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.estimated;
const cur = K.rate(E.currentYearShare), prev = K.rate(E.priorYearShare), high = K.rate(E.priorYearShareHigh);
type F = 'single' | 'mfj' | 'hoh' | 'mfs';
const cases: Array<[string, number, number, number, F]> = [
  ['Steady single filer', 10000, 70000, 12000, 'single'],
  ['Income falling', 24000, 140000, 18000, 'single'],
  ['Growing, over the AGI line', 22000, 165000, 30000, 'single'],
  ['Joint return, strong year', 30000, 200000, 45000, 'mfj'],
  ['Married filing separately', 15000, 90000, 20000, 'mfs'],
];
const res = cases.map(([, t, a, e, f]) => K.est({ expectedTax: e, priorTax: t, priorAgi: a, withholding: 0, filing: f }));
const rows = cases.map(([n, t, a, e], i) => {
  const r = res[i];
  return [n, K.usd(t), K.usd(a), K.usd(e), K.usd(e * E.currentYearShare), K.usd(t * (r.high ? E.priorYearShareHigh : E.priorYearShare)), `<strong>${K.usd(r.required)}</strong>`, r.rule];
});
const g = res[2];
const gap = cases[2][3] - g.required;
const first = K.est({ expectedTax: 9000, priorTax: 0, priorAgi: 0, withholding: 0, filing: 'single' });

export default defineGuide({
  id: 'safe-harbor',
  group: 'quarterly',
  order: 3,
  slug: 'safe-harbor',
  nav: 'Safe harbor rules',
  card: 'The smallest total that protects you from the estimated tax penalty',
  title: `Safe Harbor 2026: ${cur}, ${prev} and ${high} Estimated Tax Rules`,
  description: `Safe harbor for 2026 estimated tax: pay ${cur} of this year, ${prev} of last year or ${high} above ${K.usd(E.highAgi.single)} of AGI and no penalty applies. Worked cases, free.`,
  h1: 'Safe harbor rules for 2026 estimated tax',
  intro: 'A safe harbor is a payment level the IRS accepts as enough, whatever your final bill. Enter last year\'s tax and AGI and this year\'s estimate to see which one costs you least.',
  resume: `The estimated tax safe harbor for 2026 is the smaller of two amounts: ${cur} of the tax your 2026 return will show, or ${prev} of the tax on your 2025 return. When 2025 adjusted gross income was above ${K.usd(E.highAgi.single)}, or above ${K.usd(E.highAgi.mfs)} for someone filing separately in 2026, the prior-year figure rises to ${high}. Pay at least that amount on time, in four equal parts or as the annualized method allows, and the IRS charges no underpayment penalty, even if you owe a large balance in April. A single filer whose 2025 tax was ${K.usd(cases[2][1])} on ${K.usd(cases[2][2])} of AGI and who now expects ${K.usd(cases[2][3])} is covered by ${K.usd(g.required)}, or ${K.usd(g.perQuarter)} per installment, and settles the remaining ${K.usd(gap)} with the return. Two groups fall outside: people with no 2025 tax liability over a full year, who owe no estimated tax at all, and farmers and fishermen, who use a lower current-year share.`,
  tool: 'safe-harbor',
  body: (h) => `<p>The phrase does not appear on any IRS form, but practitioners use it for the "General Rule" in ${h.src('f1040es', 'Form 1040-ES')}: you avoid the penalty if withholding and timely estimated payments reach the smaller of ${cur} of this year's tax or ${prev} of last year's. Because the second figure is already printed on a return you filed, it is the one most self-employed people rely on. It turns an unknowable number, what 2026 will bring, into a fixed target you can split into installments in January.</p>
${h.mini('quarter')}
<h2>Three percentages, two anchors</h2>
<h3>${cur} of the current year</h3>
<p>This route needs a forecast. It is the cheaper one when 2026 income drops: a designer who lost a major client can pay ${cur} of a smaller bill instead of ${prev} of last year's larger one. The risk is that you guess low. If December brings a large invoice, the ${cur} target moves with it, and earlier installments sized on the old forecast can turn out short.</p>
<h3>${prev} of last year</h3>
<p>Line 24 of the 2025 Form 1040, the total tax, less a few items listed in Pub 505, refundable credits among them, is the base. The 2025 return must cover all twelve months. Pay that amount across the four 2026 deadlines and no penalty applies, whatever the 2026 return finally shows. This is the anchor for growing businesses.</p>
<h3>${high} above the AGI line</h3>
<p>If 2025 AGI exceeded ${K.usd(E.highAgi.single)}, the same rule asks for ${high} of last year's tax. The line is ${K.usd(E.highAgi.mfj)} for a joint return too, not double; only married filing separately in 2026 gets a lower line, ${K.usd(E.highAgi.mfs)}. The test reads AGI, line 11 of the return, not taxable income, so a high earner with large itemized deductions is still caught. Farmers and fishermen with two-thirds of gross income from that work are excluded from the ${high} rule (${h.src('p505', 'Pub 505, Higher income taxpayers')}).</p>
<h2>Worked cases for 2026</h2>
${h.table(['Situation', '2025 tax', '2025 AGI', '2026 tax expected', `${cur} of 2026`, `${prev} or ${high} of 2025`, 'Safe harbor', 'Rule used'], rows, 'No withholding; the safe harbor is the smaller of the two columns before it (calculator engine, Form 1040-ES rules)', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'l'])}
<p>The falling-income case is the only one where the current-year route wins: ${cur} of ${K.usd(cases[1][3])} is less than last year's ${K.usd(cases[1][1])}. In every growing case, the prior-year anchor is lower, and the difference is paid with the return, without penalty. The separate filer at ${K.usd(cases[4][2])} of AGI would sit well under the line on a joint return but crosses ${K.usd(E.highAgi.mfs)}, so the ${high} rule applies.</p>
<h2>What the safe harbor does not do</h2>
<p>It shields you from the penalty, not from the tax. The growing single filer in the table still owes ${K.usd(gap)} when filing, and that money should sit in a separate account by then; the ${h.a('how-much-to-set-aside', 'set-aside calculator')} turns that into a share of each payment you receive. The protection also depends on timing. Paying the full ${K.usd(g.required)} in December does not satisfy the April, June and September installments, because the penalty is figured separately for each period. Each installment needs its share by its own deadline, and the ${h.a('underpayment-penalty', 'penalty page')} shows how Form 2210 prices a late one.</p>
<p>The rule applies to the federal return only. Each state that taxes income sets its own estimated tax rules, so check the state revenue department before assuming the federal percentages carry over.</p>
<h3>Withholding counts toward the target</h3>
<p>The test in Form 1040-ES looks at withholding and refundable credits together with estimated payments. A freelancer who also holds a salaried job, or whose spouse does on a joint return, can cover part or all of the safe harbor through the paycheck by filing a new Form W-4 that asks the employer to take out more. The ${h.a('quarterly-estimated-taxes', 'quarterly calculator')} subtracts any 2026 federal withholding you enter before dividing the rest into installments. For a couple where one spouse is on payroll and the other invoices clients, a larger W-4 withholding is a simple way to stay inside the rule.</p>
<h2>First-year and no-liability exception</h2>
<p>You owe no estimated tax for 2026 at all if you were a U.S. citizen or resident alien for all of 2025 and had no tax liability for that full twelve-month year: a total tax of zero, or no requirement to file. In the calculator, a 2025 tax of ${K.usd(0)} returns ${first.mustPay ? 'a required payment' : 'no required payment'}, whatever you expect for 2026. A new freelancer who had a salary in 2025, with tax withheld, does not qualify, since that return showed tax. That person can still anchor on the 2025 tax, a number known from the first day of the year.</p>
<h3>When last year was not a full year</h3>
<p>The prior-year route requires a 2025 return covering twelve months. A 2025 return for a shorter period cannot serve as the anchor, so only ${cur} of the current year remains. The calculator offers both figures side by side so you can see which one applies.</p>
<h2>Using the result</h2>
<p>Once you have the target, divide it by four for the regular installments, or follow the annualized method if income is seasonal. Subtract any 2025 refund you applied to 2026 and any federal withholding from a spouse's or your own wages. The ${h.a('quarterly-estimated-taxes', 'quarterly payment guide')} lists the ways to pay, and ${h.src('tc306', 'IRS Topic 306')} confirms the same thresholds from the penalty side.</p>`,
  faqs: [
    { q: `Is the ${K.usd(E.highAgi.single)} AGI line doubled for a joint return?`, a: `No. It stays at ${K.usd(E.highAgi.mfj)} of 2025 AGI. The line is the same for single and joint filers under Form 1040-ES; only married filing separately in 2026 uses ${K.usd(E.highAgi.mfs)}. Above the line, the prior-year safe harbor becomes ${high} of the 2025 tax instead of ${prev}.` },
    { q: `If I pay ${prev} of last year's tax, can I still owe money in April?`, a: `Yes. The safe harbor removes the underpayment penalty, not the tax. If 2026 profit grew, the return will show more tax than you paid, and the difference is due by the filing deadline. In the growing case on this page, ${K.usd(gap)} is left to pay with the return.` },
    { q: `Which AGI decides whether I use ${prev} or ${high}?`, a: `The AGI on your 2025 return, line 11 of Form 1040, compared with ${K.usd(E.highAgi.single)} (${K.usd(E.highAgi.mfs)} if your 2026 filing status is married filing separately). Your expected 2026 income plays no part in this test, according to the higher income taxpayer rule in Form 1040-ES.` },
    { q: 'I had no tax liability last year. Do I need to pay estimated tax this year?', a: 'No, provided you were a U.S. citizen or resident alien for all of 2025 and the 2025 tax year covered twelve months. The IRS treats a total tax of zero, or no filing requirement, as no liability. Your 2026 tax is still due in full when you file the return.' },
    { q: `Is paying ${cur} of this year's tax a good safe harbor for a growing business?`, a: `It is the riskier choice. The ${cur} target rises with every new contract, so installments sized on an early forecast may fall short. The ${prev} or ${high} prior-year figure is fixed from the start, which is why it suits a business whose profit is climbing.` },
  ],
  related: ['quarterly-estimated-taxes', 'underpayment-penalty', 'estimated-tax-due-dates', 'how-much-to-set-aside'],
  sources: ['f1040es', 'p505', 'tc306'],
});
