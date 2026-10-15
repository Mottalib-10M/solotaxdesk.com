import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const R = P.retirement;
const worth = (p: number) => {
  const a = K.solo({ profit: p, filing: 'single' }), b = K.solo({ profit: p - 1000, filing: 'single' });
  return { se: a.se.total - b.se.total, inc: a.incomeTax - b.incomeTax, all: a.total - b.total };
};
const rows = [30000, 60000, 90000, 150000, 250000].map((p) => {
  const w = worth(p);
  return [K.usd(p), K.usd(w.se), K.usd(w.inc), K.usd(w.all), K.usd(1000 - w.all)];
});
const w60 = worth(60000);
const plain = K.solo({ profit: 90000, filing: 'single' });
const hp = K.solo({ profit: 90000, filing: 'single', healthPremiums: 6000 });
const ret = K.retirement(90000, 40);
const rp = K.solo({ profit: 90000, filing: 'single', retirement: ret.sep });
const mi = K.mileage(4000, 4000);

export default defineGuide({
  id: 'self-employed-tax-deductions',
  group: 'tax',
  order: 17,
  slug: 'self-employed-tax-deductions',
  nav: 'Self-employed deductions',
  card: 'The main write-offs and what each dollar really saves',
  title: 'Self Employed Tax Deductions 2026: List and Real Savings',
  description: `Self-employed tax deductions for 2026: business expenses, half of SE tax, health premiums, SEP, solo 401(k), mileage, home office, section 179 to ${K.usd(P.section179.limit)}.`,
  h1: 'Self-employed tax deductions for 2026, and what each one is worth',
  intro: 'A deduction is worth your tax rate on it, not its face value; for the self-employed, where it is claimed decides whether it also cuts SE tax.',
  resume: `Self-employed people deduct in two places, and the difference matters. Business expenses on Schedule C, such as supplies, software, advertising, insurance, travel, half of business meals, car use at ${K.dec(P.mileage.h1 * 100, 1)} cents a mile through June 2026 and ${K.dec(P.mileage.h2 * 100, 0)} cents after, a home office and equipment (with section 179 expensing up to ${K.usd(P.section179.limit)} in 2026), lower profit, so they cut both self-employment tax and income tax. Deductions on Schedule 1, which are half of SE tax, health insurance premiums and contributions to a SEP IRA or solo 401(k) (up to ${K.usd(R.dcLimit)} in total for 2026), lower income tax only. For a single filer with ${K.usd(60000)} of profit, a ${K.usd(1000)} business expense saves ${K.usd(w60.all)} of federal tax: ${K.usd(w60.se)} of SE tax and ${K.usd(w60.inc)} of income tax, so it really costs ${K.usd(1000 - w60.all)}. Spending money only to get a deduction always leaves you poorer.`,
  tool: 'deductions',
  body: (h) => `<p>The calculator answers one question: if I spend this amount on the business and deduct it, how much less tax do I pay? Enter profit before the expense, the expense, your filing status and state. It reruns the whole return twice and shows the difference for SE tax, federal income tax and state tax. The QBI deduction shrinks slightly with each expense, and the result includes that effect.</p>
${h.mini('sepQuick')}
<h2>Two kinds of deduction</h2>
<p>Everything you claim on ${h.a('schedule-c', 'Schedule C')} comes off profit before Schedule SE sees it. A dollar there saves about ${K.rate(P.se.factor * (P.se.ssRate + P.se.medicareRate))} in SE tax below the Social Security cap, plus income tax at your bracket. Deductions on Schedule 1 come after the business is done: they lower adjusted gross income but leave SE tax alone. The table shows what one ${K.usd(1000)} business expense is worth at different profits.</p>
${h.table(['Net profit', 'SE tax saved', 'Income tax saved', 'Total saved', `Real cost of ${K.usd(1000)}`], rows, `A ${K.usd(1000)} Schedule C expense, single filer, 2026, federal only`, ['l', 'r', 'r', 'r', 'r'])}
<p>Two things stand out. The saving never reaches the expense, and it is lumpy: a profit crossing a bracket or the Social Security base changes the value of the next dollar. That is why buying equipment in December to cut the bill rarely makes sense unless you needed it anyway.</p>
<h2>Business expenses on Schedule C</h2>
<p>The IRS standard is an ordinary and necessary cost of your trade. For most freelancers the list is familiar: software subscriptions, a phone and internet line in proportion to business use, advertising, a website, professional fees, contract labor, business insurance, rent for an office, supplies, and state or local licenses. Business meals are deductible at half (${h.src('i1040sc', 'Schedule C instructions')}). Travel counts when you are away from your tax home overnight.</p>
<h3>The car</h3>
<p>Either keep actual costs and multiply by the business share, or use the standard rate: ${K.dec(P.mileage.h1 * 100, 1)} cents a mile from January to June 2026 and ${K.dec(P.mileage.h2 * 100, 0)} cents from July (${h.src('mileage', 'IRS mileage rates')}). ${K.num(8000)} business miles split evenly come to ${K.usd(mi)}, plus parking and tolls. The ${h.a('mileage-deduction', 'mileage deduction page')} explains the log you need to keep.</p>
<h3>Home office and equipment</h3>
<p>A room used only and regularly for the business can be deducted at $${P.homeOffice.simplifiedRate} a square foot up to ${P.homeOffice.simplifiedMaxSqft} square feet, or by its share of real costs on Form 8829; the ${h.a('home-office-deduction', 'home office guide')} compares both. Computers, cameras and furniture are capital assets, but section 179 lets you expense them in the year you start using them, up to ${K.usd(P.section179.limit)} for 2026, reduced once total purchases pass ${K.usd(P.section179.phaseOut)} (${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}). Few freelancers come anywhere near those limits.</p>
${h.mini('homeQuick')}
<h2>Deductions on Schedule 1</h2>
<h3>Half of self-employment tax</h3>
<p>Automatic once you file Schedule SE: half of the tax goes to Schedule 1, line 15. On ${K.usd(90000)} of profit that is ${K.usd(plain.se.half)}. You do nothing for it, but it explains why your adjusted gross income is lower than your profit.</p>
<h3>Health insurance</h3>
<p>Premiums for medical, dental and qualified long-term care insurance for you, your spouse and dependents go on Schedule 1, line 17, for months when you were not eligible for an employer's subsidized plan (${h.ext('https://www.irs.gov/instructions/i7206', 'Form 7206 instructions')}). With ${K.usd(90000)} of profit, ${K.usd(6000)} of premiums lowers federal income tax by ${K.usd(plain.incomeTax - hp.incomeTax)}; SE tax does not move. See the ${h.a('self-employed-health-insurance', 'health insurance deduction')} for the limits.</p>
<h3>Retirement contributions</h3>
<p>A SEP IRA or a solo 401(k) takes contributions that are deducted on Schedule 1, line 16. For a self-employed person the employer contribution is ${K.rate(R.selfEmployedEffectiveRate)} of net earnings after half of SE tax (${h.src('p560', 'Publication 560')}); a solo 401(k) adds an employee deferral of up to ${K.usd(R.electiveDeferral)}, with ${K.usd(R.catchUp50)} more from age 50 and ${K.usd(R.catchUp60to63)} at ages 60 to 63, all within ${K.usd(R.dcLimit)} for 2026 (${h.src('n_2025_67', 'Notice 2025-67')}). At ${K.usd(90000)} of profit the SEP maximum is ${K.usd(ret.sep)}, which cuts federal tax by ${K.usd(plain.total - rp.total)} this year; the money is taxed when withdrawn.</p>
<h2>Paying other people</h2>
<p>Money paid to subcontractors, assistants or designers is deductible as contract labor on Schedule C. It comes with a paperwork duty: for payments made after 2025, a business that pays someone ${K.usd(P.infoReturns.necThreshold)} or more for services in a year files a Form 1099-NEC, and it should collect a Form W-9 first so it has the payee's taxpayer identification number (${h.src('p15', 'Publication 15')}). Without one, backup withholding at ${K.rate(0.24)} may apply. Hiring employees is a different matter, with payroll taxes of your own; the employer share of those taxes is deductible as a business expense too.</p>
<h2>What is not deductible</h2>
<p>Federal income tax and SE tax are not business expenses, even though half of the latter is an adjustment. Personal spending does not become deductible because it touches the business now and then; when an item serves both, such as a phone or a car, only the business share counts, and you need records showing the split. Premiums on a life insurance policy that benefits you are not deductible either (${h.src('p334', 'Publication 334')}). The QBI deduction is separate from all of this: it is figured after the others and is covered on its own page.</p>`,
  faqs: [
    { q: 'What can I write off as self-employed?', a: `Ordinary and necessary costs of the business on Schedule C, like supplies, software, insurance, advertising, travel, half of meals, car use at the 2026 mileage rates and a home office. On Schedule 1: half of SE tax, health premiums, and SEP or solo 401(k) contributions up to ${K.usd(R.dcLimit)} in total.` },
    { q: `How much does a ${K.usd(1000)} business expense actually save?`, a: `It depends on profit and state. For a single filer with ${K.usd(60000)} of profit, ${K.usd(w60.all)} of federal tax: ${K.usd(w60.se)} of SE tax and ${K.usd(w60.inc)} of income tax. The expense still costs ${K.usd(1000 - w60.all)} out of pocket. State income tax, if any, adds a little more savings.` },
    { q: 'Do deductions lower self-employment tax?', a: 'Only business expenses on Schedule C, because they reduce the net profit that Schedule SE starts from. Half of SE tax, health insurance premiums and retirement contributions are adjustments on Schedule 1: they reduce income tax but leave SE tax unchanged. The standard deduction and the QBI deduction also lower income tax only.' },
    { q: 'What is the section 179 limit for 2026?', a: `${K.usd(P.section179.limit)}, reduced dollar for dollar once the cost of section 179 property placed in service in 2026 exceeds ${K.usd(P.section179.phaseOut)}, according to Rev. Proc. 2025-32. It lets you deduct equipment, computers and furniture in the year you start using them instead of depreciating them over several years.` },
    { q: 'Can I deduct expenses if I use the standard deduction?', a: 'Yes. Business expenses on Schedule C and adjustments on Schedule 1 are separate from the choice between the standard deduction and itemizing. You keep them all and still take the standard deduction. Itemized deductions are personal items such as mortgage interest, state taxes and charity, not business costs.' },
  ],
  related: ['schedule-c', 'home-office-deduction', 'mileage-deduction', 'self-employed-health-insurance', 'sep-ira-vs-solo-401k', 'qbi-deduction'],
  sources: ['i1040sc', 'p334', 'p560', 'n_2025_67', 'rp_2025_32', 'mileage'],
});
