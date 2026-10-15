import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const ADMIN = 2000;
const at = (p: number, share = 0.4, adminCost = ADMIN, filing: 'single' | 'mfj' = 'single') => K.compare({ profit: p, salary: p * share, filing, adminCost });
const profits = [50000, 75000, 100000, 150000, 200000, 300000];
const rows = profits.map((p) => ({ p, c: at(p) }));
const be = (share: number, adminCost: number, filing: 'single' | 'mfj' = 'single') => K.breakEven(share, { filing, adminCost });
const show = (b: number | null) => (b === null ? `above ${K.usd(400000)}` : b <= 10000 ? `${K.usd(10000)} or less` : K.usd(b));
const be40 = be(0.4, ADMIN);
const be60 = be(0.6, ADMIN);
const be40hi = be(0.4, 4000);
const be60hi = be(0.6, 4000);
const be60hiJoint = be(0.6, 4000, 'mfj');
const c100 = at(100000);
const c200 = at(200000);
const c300 = at(300000);
const fica = K.rate(P.se.ssRate + P.se.medicareRate);

export default defineGuide({
  id: 's-corp-tax-savings-calculator',
  group: 'structure',
  order: 3,
  slug: 's-corp-tax-savings-calculator',
  nav: 'S corp savings calculator',
  card: 'The profit where the election starts to pay, and what it saves above it',
  title: 'S Corp Tax Savings Calculator 2026: Break-Even Profit',
  description: `S corp tax savings calculator for 2026: the profit where the election starts to pay (${show(be40)} at a 40% salary and ${K.usd(ADMIN)} of costs) and the saving above it.`,
  h1: 'S corp tax savings calculator: the 2026 break-even profit',
  intro: 'Give the salary as a share of profit and your yearly payroll and filing costs; the calculator finds the first profit at which the S election beats the default LLC.',
  resume: `The S election saves money once the payroll tax it avoids on distributions is larger than everything it adds: the cost of running payroll, a second tax return, a smaller QBI deduction and any state tax on S corporations. For a single filer with no state income tax, a salary set at 40% of profit and ${K.usd(ADMIN)} a year of payroll and filing costs, that break-even point is ${show(be40)} of profit in 2026. Raise the salary to 60% of profit and it moves to ${show(be60)}; double the costs to ${K.usd(4000)} with the 60% salary and it climbs to ${show(be60hi)}. Above the break-even point the saving grows with profit: ${K.usd(c100.savings)} a year at ${K.usd(100000)}, ${K.usd(c200.savings)} at ${K.usd(200000)} and ${K.usd(c300.savings)} at ${K.usd(300000)}, still with a 40% salary. Those are federal figures under the 2026 rules; a state that taxes S corporations or a salary the IRS would reject changes them.`,
  tool: 'breakeven',
  body: (h) => `<p>Every S corp savings figure rests on one choice: the salary. Payroll tax applies to it, so each dollar moved from distributions to salary takes back part of the saving. The calculator above therefore asks for the salary as a share of profit rather than as a fixed amount, and then scans profits from ${K.usd(10000)} to ${K.usd(400000)} in steps of ${K.usd(1000)} until the S corp total falls below the total of the same business taxed as a default LLC. The quick tool below shows what one more ${K.usd(10000)} of salary costs at a given level.</p>
${h.mini('scorpSalary')}
<h2>What the election saves at six profit levels</h2>
<p>The table holds the salary at 40% of profit and the yearly costs at ${K.usd(ADMIN)}, for a single filer living in a state without income tax. "Default LLC" means a sole proprietor or a single-member LLC filing Schedule C; "S corp" means the same business after the election, with payroll on the salary and the rest passed through on a K-1.</p>
${h.table(['Profit', 'Salary (40%)', 'Default LLC, total tax', 'S corp, total tax and costs', 'Yearly saving'], rows.map(({ p, c }) => [K.usd(p), K.usd(p * 0.4), K.usd(c.solo.total), K.usd(c.scorp.total), K.usd(c.savings)]), `Federal income tax, self-employment or payroll taxes and ${K.usd(ADMIN)} of costs, 2026 rules.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The saving does not rise in a straight line. Between ${K.usd(100000)} and ${K.usd(200000)} it roughly doubles, then it jumps again at ${K.usd(300000)}. Two effects meet there. At high profit the default LLC owner pays the ${K.rate(P.additionalMedicare.rate)} Additional Medicare Tax on self-employment earnings above ${K.usd(P.additionalMedicare.threshold.single)}, which the S corp owner avoids on distributions. And the QBI deduction of the default LLC starts to be limited by the wage rule above ${K.usd(P.qbi.threshold.single)} of taxable income, a limit the S corp meets more easily because it pays W-2 wages.</p>
<h2>Three inputs that move the break-even point</h2>
<h3>The salary share</h3>
<p>A higher salary means fewer dollars escape payroll tax, so the business needs more profit before the election pays for its costs. The grid below shows how far the point moves. The IRS sets no percentage; the salary must match what the owner's work is worth, which the ${h.a('reasonable-salary', 'reasonable salary guide')} looks at in detail.</p>
${h.table(['Salary share', `Costs ${K.usd(0)}`, `Costs ${K.usd(ADMIN)}`, `Costs ${K.usd(4000)}`], [0.3, 0.4, 0.5, 0.6].map((s) => [K.rate(s), show(be(s, 0)), show(be(s, ADMIN)), show(be(s, 4000))]), 'Break-even profit, single filer, no state tax, 2026.', ['l', 'r', 'r', 'r'])}
<h3>Fixed costs</h3>
<p>With no costs at all, the election would save money at almost any profit, because the payroll side never costs more than the self-employment tax it replaces. Costs are what create a threshold. A payroll service, the extra time or fee for Form 1120-S and the state's unemployment insurance account all count. With a 40% salary, going from ${K.usd(ADMIN)} to ${K.usd(4000)} a year pushes the break-even point from ${show(be40)} to ${show(be40hi)}. Enter your real quotes rather than the placeholder, and count only what the election adds: an accounting subscription you would keep as a sole proprietor does not belong in the figure.</p>
<h3>Filing status and state</h3>
<p>Married couples filing jointly have wider brackets and a higher QBI threshold, so the income tax side of the comparison shifts. At a 60% salary and ${K.usd(4000)} of costs, the break-even point is ${show(be60hi)} for a single filer and ${show(be60hiJoint)} for a joint return. The state changes more: where an S corporation pays its own franchise or minimum tax, or where the election is not recognized, the saving can shrink to nothing. Pick your state in the calculator and read its page for the rule that applies.</p>
<h2>Why the saving is smaller than ${fica} of the distributions</h2>
<p>A quick estimate multiplies the distributions by ${fica} and calls it the saving. It overstates the result for three reasons. Self-employment tax applies to ${K.dec(P.se.factor * 100, 2)}% of profit, not all of it. Half of it is deductible, so removing it also removes a deduction and raises income tax a little. And the QBI deduction falls, because the salary is not qualified business income: at ${K.usd(100000)} of profit and a 40% salary it drops from ${K.usd(c100.solo.qbi.deduction)} to ${K.usd(c100.scorp.qbi.deduction)}. Above the ${K.usd(P.se.wageBase['2026'])} Social Security wage base only the Medicare part of the tax is left to avoid, which flattens the curve.</p>
${h.mini('payrollCost')}
<h2>What the calculator cannot price</h2>
<p>Some costs have no fixed number. Late payroll deposits carry penalties, and an S corp owner who stops paying attention to payroll for a quarter can lose a year of savings. Retirement plans change too: in an S corp the employer contribution is a share of W-2 salary, so a low salary can mean a smaller plan than a sole proprietor would get on the same profit. Health insurance for an owner with more than 2% of the shares must be run through the company to stay deductible. None of this is in the totals above. For the full line-by-line comparison at your own figures, use the ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')}, and if the numbers point to yes, the ${h.a('llc-taxed-as-s-corp', 'Form 2553 guide')} has the deadline.</p>
<p>A practical reading: below the break-even profit, stay as you are. Just above it, the saving is a few hundred dollars and easily lost to one mistake. The election starts to look sound when the calculator shows a saving of several thousand dollars at a salary you would be comfortable defending, which is the point to involve a CPA or enrolled agent.</p>`,
  faqs: [
    { q: 'Why does an S corp savings calculator show a loss at low profits?', a: `Because the fixed costs of the election come first. Payroll processing, the Form 1120-S return and state accounts cost money every year, while the payroll tax avoided is small when profit is small. With a 40% salary and ${K.usd(ADMIN)} of yearly costs, a single filer without state tax only comes out ahead from about ${show(be40)} of profit in 2026.` },
    { q: 'How much does an S corp save at $100,000 of profit?', a: `About ${K.usd(c100.savings)} a year in federal tax for a single filer with no state income tax, a ${K.usd(40000)} salary and ${K.usd(ADMIN)} of payroll and filing costs, under the 2026 rules. A higher salary, higher costs or a state tax on S corporations reduces it. The calculator recomputes it for your own salary and state.` },
    { q: 'Does filing jointly change the S corp break-even point?', a: `It can. A joint return has wider brackets and a higher QBI threshold, which changes the income tax side. With a 60% salary and ${K.usd(4000)} of yearly costs, the break-even profit is ${show(be60hi)} single and ${show(be60hiJoint)} joint in 2026. Choose your filing status in the calculator to see your case.` },
    { q: 'What costs should I enter in an S corp savings calculator?', a: 'Everything the election adds and the LLC would not pay: a payroll service or the time to run payroll yourself, preparation of Form 1120-S, state unemployment insurance setup, and any state fee or tax aimed at S corporations. Leave out costs you pay either way, such as bookkeeping for the business or the LLC annual report.' },
    { q: 'Is the S corp saving bigger above the Social Security wage base?', a: `It grows more slowly. Above ${K.usd(P.se.wageBase['2026'])} of net earnings in 2026 the ${K.rate(P.se.ssRate)} Social Security part of self-employment tax stops, so distributions above that level only avoid the ${K.rate(P.se.medicareRate)} Medicare part and, past ${K.usd(P.additionalMedicare.threshold.single)} single, the ${K.rate(P.additionalMedicare.rate)} Additional Medicare Tax.` },
  ],
  related: ['llc-vs-s-corp', 'reasonable-salary', 'llc-taxed-as-s-corp', 's-corp', 'qbi-deduction'],
  sources: ['rp_2025_32', 'ssa_2027', 'p15', 'i8995', 'i8959', 'reasonable_comp'],
});
