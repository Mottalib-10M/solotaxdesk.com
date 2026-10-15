import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const PROFIT = 160000;
const cmp = (w: number) => K.compare({ profit: PROFIT, salary: w, filing: 'single', adminCost: 0 });
const levels = [40000, 55000, 70000, 85000, 100000, 115000];
const rows = levels.map((w) => ({ w, c: cmp(w) }));
const s70 = cmp(70000), s80 = cmp(80000), s40 = cmp(40000), s100 = cmp(100000);
const step = s70.savings - s80.savings;
const zero = levels.find((w) => cmp(w).savings <= 0);
const er = P.retirement.employerRate;

export default defineGuide({
  id: 'reasonable-salary',
  group: 'structure',
  order: 4,
  slug: 'reasonable-salary',
  nav: 'Reasonable salary',
  card: 'What the IRS expects you to pay yourself, and what each level costs',
  title: 'Reasonable Salary S Corp 2026: IRS Factors and Tax Cost',
  description: `Reasonable salary for an S corp owner in 2026: the factors the IRS weighs, and what each extra ${K.usd(10000)} of pay costs in tax (${K.usd(step)} at ${K.usd(PROFIT)} of profit).`,
  h1: 'Reasonable salary for an S corp owner in 2026',
  intro: 'The IRS does not publish a percentage. It asks what your work would cost the company if someone else did it. The calculator shows what each salary level does to the saving.',
  resume: `An S corporation must pay a shareholder who works in the business reasonable compensation before it pays any distribution, and the IRS can reclassify distributions as wages when the salary is too low. No rule of thumb is official: the IRS looks at where the company's receipts come from (the owner's own work, other employees, or capital and equipment) and at factors such as training, duties, hours, what comparable businesses pay and the company's dividend history. The salary drives the tax result. On ${K.usd(PROFIT)} of profit, a single owner without state tax saves ${K.usd(s40.savings)} against a default LLC with a ${K.usd(40000)} salary, ${K.usd(s70.savings)} at ${K.usd(70000)} and ${K.usd(s100.savings)} at ${K.usd(100000)}, before payroll costs; each extra ${K.usd(10000)} of salary around ${K.usd(70000)} gives back about ${K.usd(step)}. A higher salary also lowers the QBI deduction but raises how much the company can put into a retirement plan for you.`,
  tool: 'salary',
  body: (h) => `<p>The word "reasonable" is not defined by a number anywhere in the Code. What the IRS has published is a position: on its ${h.src('reasonable_comp', 'S corporation compensation page')}, it states that an S corporation must pay reasonable compensation to a shareholder-employee for services before non-wage distributions can be made, and that it has the authority to treat distributions as wages subject to employment taxes. The same page adds a ceiling that is easy to miss: reasonable compensation never exceeds what the shareholder actually received, directly or indirectly. A company that paid you nothing in a loss year does not owe a phantom salary. The payroll tax on a given salary is shown here.</p>
${h.mini('payrollCost')}
<h2>How the IRS looks at the source of the money</h2>
<p>The IRS frames the question around gross receipts. A company's revenue comes from three places: the services of the shareholder, the services of employees who are not shareholders, and capital and equipment. Payments to the owner that trace back to the second and third sources can fairly be distributions. Payments that trace back to the owner's own work should be wages. Management counts as work too: an owner who supervises the people producing the revenue is doing a job the company would otherwise pay someone for.</p>
<p>This is why a solo consultant has less room than the owner of a shop with five technicians. When nearly every dollar billed comes from your own hours, a salary far below what the market pays for those hours is hard to defend.</p>
<h3>The factors the IRS lists</h3>
<ul>
<li>Training and experience.</li>
<li>Duties and responsibilities.</li>
<li>Time and effort devoted to the business.</li>
<li>Dividend history.</li>
<li>Payments to non-shareholder employees.</li>
<li>Timing and manner of paying bonuses to key people.</li>
<li>What comparable businesses pay for similar services.</li>
<li>Compensation agreements, and the use of a formula to determine pay.</li>
</ul>
<p>The courts have backed the IRS when it reclassified payments. The same page lists the decisions it relies on, among them <em>Joly v. Commissioner</em> on the authority to reclassify and <em>David E. Watson, PC v. United States</em> (8th Cir. 2012) on reasonable pay for services performed. None of them sets a formula either; each turns on the facts of the business.</p>
<h2>What each salary level costs in tax</h2>
<p>The table keeps profit at ${K.usd(PROFIT)} and moves only the salary. Savings are measured against the same business taxed as a default LLC, before any payroll service or filing cost, for a single filer without state income tax.</p>
${h.table(['Salary', 'Payroll taxes, both halves', 'QBI deduction', 'Saving against the LLC', `Employer plan room (${K.rate(er)})`], rows.map(({ w, c }) => [K.usd(w), K.usd(c.scorp.payrollTaxes), K.usd(c.scorp.qbi.deduction), K.usd(c.savings), K.usd(w * er)]), `Profit ${K.usd(PROFIT)}, single filer, 2026 rules, no state tax, no payroll costs.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The saving falls steadily, by about ${K.usd(step)} for each ${K.usd(10000)} of salary in the middle of the range, and ${zero ? `turns negative at a ${K.usd(zero)} salary` : 'stays positive across these levels'}. Payroll tax rises by ${K.rate(P.payroll.ssEmployer + P.payroll.medicareEmployer + P.payroll.ssEmployee + P.payroll.medicareEmployee)} of each added dollar below the Social Security wage base, partly offset by the income tax deduction the company gets for its half.</p>
<h2>The salary and the QBI deduction</h2>
<p>The ${h.src('i8995', 'Form 8995 instructions')} list amounts received as reasonable compensation from an S corporation among the items that are not qualified business income, so every dollar of salary is a dollar taken out of the base for the ${K.rate(P.qbi.rate)} deduction. In the table the deduction falls from ${K.usd(s40.scorp.qbi.deduction)} at a ${K.usd(40000)} salary to ${K.usd(s100.scorp.qbi.deduction)} at ${K.usd(100000)}. Above ${K.usd(P.qbi.threshold.single)} of taxable income for a single filer, the logic reverses in part: the deduction becomes limited by the W-2 wages the business pays, ${K.rate(P.qbi.wageLimitRate)} of them in the basic test, and the owner's own salary is part of those wages. A high earner with a very low salary can lose more QBI deduction than the payroll tax saved. The ${h.a('qbi-deduction', 'QBI deduction guide')} covers the thresholds.</p>
<h2>The salary and your retirement plan</h2>
<p>In an S corp, retirement contributions are based on W-2 wages, not on the K-1 profit. The company can contribute up to ${K.rate(er)} of your salary as the employer, and a 401(k) also lets you defer up to ${K.usd(P.retirement.electiveDeferral)} of the salary itself in 2026 (${h.src('n_2025_67', 'IRS Notice 2025-67')}). A ${K.usd(40000)} salary limits the employer part to ${K.usd(40000 * er)}. Someone who plans to put a large share of profit away each year may choose a higher salary than tax alone would suggest. The ${h.a('sep-ira-vs-solo-401k', 'SEP vs solo 401(k) page')} compares the plans.</p>
<h2>Building a salary you can defend</h2>
<p>Start from the market: what would the company pay an employee to do your job, for your hours? Salary surveys for your occupation and region, job postings, and what you were paid as an employee before going independent are all evidence. Write the reasoning down each year and keep it with the payroll records, updating it when your role, your hours or the business itself changes. Then check the tax effect in the calculator, and compare the result with the default LLC on the ${h.a('llc-vs-s-corp', 'LLC vs S corp page')}. If the defensible salary leaves only a small saving, the election may not be worth its costs.</p>
${h.mini('breakEvenQuick')}`,
  faqs: [
    { q: 'Is there a safe percentage of profit for an S corp salary?', a: 'No. The IRS has never published one, and figures such as 60/40 that circulate online have no official basis. The IRS weighs the owner\'s training, duties, hours, what comparable businesses pay for the same work and where the company\'s receipts come from. A salary close to what you would pay an employee for your role is the defensible starting point.' },
    { q: 'Can an S corp owner take no salary at all?', a: 'Only when the owner performs no meaningful services, or when the company pays out nothing. The IRS says reasonable compensation must be paid before non-wage distributions to a shareholder-employee, and that it never exceeds what the shareholder actually received. An owner who works in the business and takes distributions with no salary invites reclassification of those distributions as wages.' },
    { q: 'What happens if the IRS says my S corp salary is too low?', a: 'It can reclassify part of your distributions as wages. The company then owes the employer and employee shares of Social Security and Medicare on that amount, plus federal unemployment tax, with interest and possibly penalties for the payroll returns that were wrong. Courts have upheld this, in decisions the IRS lists on its S corporation compensation page.' },
    { q: 'Does a higher S corp salary increase my retirement contributions?', a: `Yes. In an S corp the employer contribution is a percentage of W-2 wages, up to ${K.rate(er)}, and the K-1 profit does not count. Your own 401(k) deferral of up to ${K.usd(P.retirement.electiveDeferral)} in 2026 also comes out of the salary. A low salary keeps payroll tax down but caps what the plan can receive.` },
    { q: 'Is health insurance part of an S corp owner’s reasonable salary?', a: 'It is added to wages for income tax. Premiums the company pays for an owner with more than 2% of the shares go in box 1 of the W-2 but not in the Social Security and Medicare boxes, so they raise taxable wages without adding payroll tax. The owner then deducts them on the personal return, if the other conditions are met.' },
  ],
  related: ['llc-vs-s-corp', 's-corp-tax-savings-calculator', 's-corp', 'qbi-deduction', 'sep-ira-vs-solo-401k'],
  sources: ['reasonable_comp', 'i8995', 'n_2025_67', 'p15', 'rp_2025_32'],
});
