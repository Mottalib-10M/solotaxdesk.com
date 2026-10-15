import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const CG = P.capitalGains;
const corp = K.rate(P.corporate.rate);
const I1120 = 'https://www.irs.gov/pub/irs-pdf/i1120.pdf';
const due = '2027-04-15';
const payouts = [0, 0.5, 1];
const ex = payouts.map((d) => ({ d, r: K.ccorp({ profit: 300000, salary: 100000, filing: 'single', payout: d }) }));
const full = ex[2].r;
const statuses: Array<['single' | 'mfj' | 'hoh' | 'mfs', string]> = [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household'], ['mfs', 'Married filing separately']];

export default defineGuide({
  id: 'c-corporation',
  group: 'structure',
  order: 8,
  slug: 'c-corporation',
  nav: 'C corporation',
  card: 'The 21% tax, dividends at 0/15/20% and the 2026 thresholds',
  title: 'C Corporation 2026: Corporate Tax, Dividends and Form 1120',
  description: `C corporation taxes in 2026: ${corp} on corporate profit, qualified dividends taxed at 0% up to ${K.usd(CG.zeroMax.single)} single, then 15% or 20%, plus NIIT. Form 1120 due dates.`,
  h1: 'C corporation: how a C corp and its owners are taxed in 2026',
  intro: 'A C corp is the default status of every corporation. Enter profit, salary and payout share to see the corporate tax, the dividend tax and what stays inside.',
  resume: `A C corporation is taxed as its own person. It files Form 1120 and pays a flat ${corp} federal tax on its profit after expenses, including the salaries it pays its owners. When it pays a dividend, the shareholder pays tax again: qualified dividends are taxed at 0% while taxable income stays under ${K.usd(CG.zeroMax.single)} for a single filer or ${K.usd(CG.zeroMax.mfj)} for a joint return in 2026, at 15% up to ${K.usd(CG.fifteenMax.single)} single or ${K.usd(CG.fifteenMax.mfj)} joint, and at 20% above. The ${K.rate(P.niit.rate)} net investment income tax applies on top once modified AGI passes ${K.usd(P.niit.threshold.single)} single or ${K.usd(P.niit.threshold.mfj)} joint. On ${K.usd(300000)} of profit and a ${K.usd(100000)} salary, a single owner who takes everything out pays ${K.usd(full.corpTax)} of corporate tax and ${K.usd(full.dividendTax + full.niit)} on the dividend. Founders choose this form mainly for investors, since it has no limit on the number or type of shareholders.`,
  tool: 'ccorp',
  body: (h) => `<p>Money leaves a C corporation for its owner in two ways, and each is taxed differently. A salary is a business expense for the corporation: it lowers corporate profit, and the owner pays income tax and payroll taxes on it like any employee, with the corporation paying the employer half of Social Security and Medicare. A dividend is paid from profit that has already been taxed, the corporation cannot deduct it, and the owner pays the dividend tax on it. The payroll side of that choice can be estimated here.</p>
${h.mini('payrollCost')}
<h2>The corporate tax</h2>
<p>The federal tax on a C corporation's taxable income is a single rate of ${corp}, set by ${h.src('usc_11', 'section 11 of the Internal Revenue Code')}. There are no brackets: the first dollar of profit and the millionth are taxed alike. The corporation computes its taxable income much as a sole proprietor would, with the same kinds of business deductions, and can also take some deductions reserved to corporations (${h.src('corporation', 'IRS, forming a corporation')}). State corporate income or franchise taxes come on top in most states and are not in the figures on this page. The calculator lets you enter a state corporate rate if you have looked it up for your state; it is applied to the profit after salary, before the federal tax.</p>
<h3>When Form 1120 is due</h3>
<p>The ${h.ext(I1120, 'Instructions for Form 1120')} set the due date at the 15th day of the 4th month after the end of the tax year, which is ${K.day(due)} for a corporation on the 2026 calendar year. A corporation with a fiscal year ending June 30 files a month earlier, by the 15th day of the 3rd month. The employment returns are the same as for any employer: Form 941 every quarter, Form 940 each year and W-2s for the employees, owners included.</p>
<h2>How dividends are taxed in 2026</h2>
<p>Qualified dividends from a domestic C corporation are taxed at the same rates as long-term capital gains, stacked on top of the shareholder's other taxable income. The thresholds for 2026 come from ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}:</p>
${h.table(['Filing status', '0% rate up to', '15% rate up to', '20% rate above'], statuses.map(([f, l]) => [l, K.usd(CG.zeroMax[f]), K.usd(CG.fifteenMax[f]), K.usd(CG.fifteenMax[f])]), 'Taxable income thresholds for qualified dividends and long-term capital gains, tax year 2026.', ['l', 'r', 'r', 'r'])}
<p>An owner who takes a salary first will usually have used the 0% band with wages, so the dividend lands mostly in the 15% band. Dividends that do not meet the holding period or other conditions are taxed as ordinary income instead.</p>
<h3>The net investment income tax</h3>
<p>Dividends are investment income, so they can owe a further ${K.rate(P.niit.rate)} under ${h.src('usc_1411', 'section 1411')}. The tax applies to the smaller of the net investment income or the part of modified AGI above ${K.usd(P.niit.threshold.single)} for a single filer or head of household, ${K.usd(P.niit.threshold.mfj)} for a joint return and ${K.usd(P.niit.threshold.mfs)} for married filing separately. These thresholds are written into the statute itself rather than published each year with the brackets.</p>
<h2>One profit, three payout choices</h2>
<p>The table follows ${K.usd(300000)} of profit before a ${K.usd(100000)} salary, for a single owner in a state without income tax. Only the share of after-tax profit paid as a dividend changes.</p>
${h.table(['Paid as dividends', 'Corporate tax', 'Dividend tax and NIIT', 'Total tax, payroll included', 'Left in the company'], ex.map(({ d, r }) => [K.rate(d), K.usd(r.corpTax), K.usd(r.dividendTax + r.niit), K.usd(r.total), K.usd(r.retained)]), 'Federal taxes only, 2026 rules.', ['l', 'r', 'r', 'r', 'r'])}
<p>The corporate tax stays at ${K.usd(full.corpTax)} whatever the payout. The second layer grows with each dollar distributed, from nothing when the profit stays inside to ${K.usd(full.dividendTax + full.niit)} when all of it is paid out. A C corp owner controls the timing of that second tax, which is the feature the structure offers in exchange for paying it at all. Profit left in the company is not lost to the owner: it raises the value of the shares, and the tax on it comes due when it is distributed or when the shares are sold.</p>
<h2>Why founders still choose a C corp</h2>
<p>For a one-person service business that lives on its profit, a C corp is rarely the cheapest option, and the ${h.a('c-corp-vs-s-corp', 'C corp vs S corp comparison')} shows the gap. Founders pick it for other reasons:</p>
<ul>
<li><strong>Investors.</strong> There is no cap on the number of shareholders, and shareholders can be companies, funds organized as partnerships or foreign persons, none of whom may own S corp stock.</li>
<li><strong>Several classes of stock.</strong> Preferred shares with a liquidation priority, the usual instrument in a funding round, are allowed.</li>
<li><strong>Reinvestment.</strong> Profit kept to fund growth pays ${corp} rather than the owners' personal rates, which can be higher.</li>
<li><strong>A planned sale of the shares.</strong> Investors and buyers are used to the structure, and some tax rules for stock sales apply only to C corporation shares; their conditions are strict and need professional advice.</li>
</ul>
<p>Losses are the main drawback for a young company. They stay inside the corporation and the shareholders cannot deduct them, whereas an LLC or S corp passes a first-year loss to the owners' returns. A founder who expects early losses and no outside investors for a while can start as an LLC and convert later, a path the ${h.a('llc-vs-corporation', 'LLC vs corporation guide')} discusses. The ${h.a('business-structure', 'business structure overview')} places the C corp among the other choices.</p>`,
  faqs: [
    { q: 'What is the corporate tax rate in 2026?', a: `A flat ${corp} of a C corporation's taxable income, with no brackets, under section 11 of the Internal Revenue Code. It applies only to C corporations; an S corporation, an LLC or a partnership passes its profit to the owners instead. Most states add their own corporate income or franchise tax, which is not included in the ${corp}.` },
    { q: 'How are C corp dividends taxed in 2026?', a: `Qualified dividends are taxed at 0% while your taxable income is below ${K.usd(CG.zeroMax.single)} single or ${K.usd(CG.zeroMax.mfj)} joint, at 15% up to ${K.usd(CG.fifteenMax.single)} single or ${K.usd(CG.fifteenMax.mfj)} joint, and at 20% above (Rev. Proc. 2025-32). The ${K.rate(P.niit.rate)} net investment income tax may be added for high incomes.` },
    { q: 'When is a C corporation’s Form 1120 due?', a: `By the 15th day of the 4th month after its tax year ends, so ${K.day(due)} for calendar year 2026. A corporation whose fiscal year ends on June 30 files by the 15th day of the 3rd month instead. If the date falls on a weekend or legal holiday, the next business day counts (Instructions for Form 1120).` },
    { q: 'Can a C corp deduct the dividends it pays?', a: 'No. Dividends are paid out of profit that has already been taxed at the corporate level, and the corporation gets no deduction for them, which is what creates the double tax. Salaries, bonuses and other reasonable pay for work actually performed are deductible, which is why the split between salary and dividends matters for owner-employees.' },
    { q: 'Can a C corporation have investors that are other companies?', a: 'Yes. A C corporation can have any number of shareholders of any kind: individuals, other corporations, partnerships such as venture funds, trusts and foreign persons. An S corporation cannot: its shareholders are limited to eligible individuals, estates and certain trusts and exempt organizations, never a partnership, a corporation or a nonresident alien.' },
  ],
  related: ['c-corp-vs-s-corp', 'llc-vs-corporation', 'business-structure', 's-corp', 'reasonable-salary'],
  sources: ['usc_11', 'usc_1411', 'rp_2025_32', 'corporation', 'p15'],
});
