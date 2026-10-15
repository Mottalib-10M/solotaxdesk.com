import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const I7206 = 'https://www.irs.gov/instructions/i7206';
const profit = 70000, prem = 7200;
const a = K.solo({ profit, filing: 'single' });
const b = K.solo({ profit, filing: 'single', healthPremiums: prem });
const rows = [3000, 6000, 9000, 12000].map((h) => {
  const x = K.solo({ profit: 55000, filing: 'single', healthPremiums: h });
  const y = K.solo({ profit: 55000, filing: 'single' });
  return [K.usd(h), K.usd(y.incomeTax - x.incomeTax), K.usd(y.qbi.deduction - x.qbi.deduction), K.usd(0), K.usd(h - (y.incomeTax - x.incomeTax))];
});
const low = 9000;
const lowSe = K.se(low);
const lowCap = Math.max(0, low - lowSe.half);
const ret = 10000;
const capRet = Math.max(0, 40000 - K.se(40000).half - ret);

export default defineGuide({
  id: 'self-employed-health-insurance',
  group: 'tax',
  order: 21,
  slug: 'self-employed-health-insurance',
  nav: 'Health insurance deduction',
  card: 'Deducting your premiums: limits, employer plans and the 2026 credit changes',
  title: 'Self-Employed Health Insurance Deduction 2026: Limits',
  description: `Self-employed health insurance deduction 2026: premiums on Schedule 1, capped by profit, barred in employer-plan months, no cut to the ${K.rate(P.se.ssRate + P.se.medicareRate)} SE tax rate.`,
  h1: 'Self-employed health insurance deduction in 2026',
  intro: 'Premiums you pay for yourself and your family come off your income without itemizing, but only within the profit of the business and only for some months.',
  resume: `Self-employed people with a net profit can deduct the medical, dental and qualified long-term care insurance premiums they pay for themselves, a spouse and dependents on Schedule 1 (Form 1040), line 17, without itemizing. The deduction cannot exceed the net earnings of the business under which the plan is established; the calculator measures that as profit minus the deductible half of self-employment tax and any SEP or solo 401(k) contribution. It is not available for any month in which you, or your spouse through their job, could join an employer's subsidized health plan, even if you declined it. The deduction lowers income tax only: SE tax is computed on the full profit. For a single filer with ${K.usd(profit)} of profit, ${K.usd(prem)} of premiums cuts federal income tax by ${K.usd(a.incomeTax - b.incomeTax)}. From 2026, marketplace buyers with household income above 400% of the federal poverty line no longer get the premium tax credit, and excess advance credit must be repaid in full, which makes this deduction more valuable to them.`,
  tool: 'health',
  body: (h) => `<p>Enter your profit, the premiums you paid during the year, your filing status and state. The calculator applies the cap, then compares two complete returns, with and without the deduction, so the saving includes the small loss of QBI deduction that comes with it. The self-employment tax line stays at zero on purpose.</p>
${h.mini('sepQuick')}
<h2>Who can take it</h2>
<p>Under the ${h.ext(I7206, 'Form 7206 instructions')}, the deduction is open to sole proprietors with a net profit on Schedule C or Schedule F, partners with self-employment earnings on their K-1, and shareholders owning more than 2% of an S corporation whose premiums were included in their W-2 wages. The plan has to be established, or treated as established, under the business. Voluntary Medicare premiums can qualify too, when they buy coverage in your name similar to private health insurance.</p>
<h3>What premiums count</h3>
<p>Medical and dental insurance and qualified long-term care insurance for you and your family are covered (${h.src('p334', 'Publication 334')}). Counting long-term care premiums requires Form 7206 rather than the simple worksheet in the Form 1040 instructions. The amounts go on Schedule 1, line 17, not on Schedule C: the ${h.src('i1040sc', 'Schedule C instructions')} send them there explicitly.</p>
<h2>The limits</h2>
<h3>Profit</h3>
<p>The deduction cannot be larger than the earnings of the business that sponsors the plan. With ${K.usd(low)} of profit, half of SE tax is ${K.usd(lowSe.half)}, so the most you could deduct is about ${K.usd(lowCap)}, whatever the premiums. A retirement contribution lowers the ceiling further: at ${K.usd(40000)} of profit with a ${K.usd(ret)} SEP contribution, the room left for premiums is ${K.usd(capRet)}. A loss year gives no deduction from that business at all. When you have more than one business subject to SE tax, Form 7206 is mandatory.</p>
<h3>Months with an employer plan</h3>
<p>You cannot take the deduction for any month in which you were eligible to participate in a subsidized health plan of an employer, including your spouse's employer, or the employer of a dependent or of a child under 27. Eligibility is what counts, not enrollment, so a spouse's job that offers family coverage you turned down blocks those months. The test is month by month, which matters when a job starts or ends mid-year.</p>
${h.table(['Premiums', 'Income tax saved', 'QBI deduction lost', 'SE tax saved', 'Net cost of the premiums'], rows, `Single filer, ${K.usd(55000)} of profit, 2026, federal only`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Why it does not cut SE tax</h2>
<p>The deduction is an adjustment to income, taken after the business result is final. Schedule SE starts from the Schedule C profit, and the instructions say you cannot subtract this deduction when figuring net earnings from the business under which the plan is established. Half of SE tax is deductible in the same section of Schedule 1, but premiums do not reduce the ${K.rate(P.se.ssRate + P.se.medicareRate)} itself. The deduction does reduce qualified business income, so the ${h.a('qbi-deduction', 'QBI deduction')} falls by ${K.rate(P.qbi.rate)} of the premiums, which the table shows.</p>
${h.mini('seHalf')}
<h2>The premium tax credit in 2026</h2>
<p>Many self-employed people buy coverage on the Health Insurance Marketplace and receive advance payments of the premium tax credit. Two changes apply from 2026 (${h.src('f1040es', 'Form 1040-ES 2026')}). If household income is more than 400% of the federal poverty line, you are no longer eligible for the credit. And there is no longer any limit on what you repay when advance payments were too high, even for households under 400%. For a freelancer whose income jumps during the year, a too-low estimate at enrollment can now mean a large balance due in April, so report income changes to the Marketplace promptly.</p>
<p>When you claim the credit and the self-employed health insurance deduction together, each one depends on the other, because the deduction changes your income and the credit changes the premiums you paid. The IRS points to Form 8962 and Publication 974 for that computation; the calculator here does not model it.</p>
<h2>Worksheet or Form 7206</h2>
<p>Most sole proprietors figure the deduction on the worksheet in the Form 1040 instructions. Form 7206 becomes mandatory in three cases listed in ${h.src('p334', 'Publication 334')}: you have more than one source of income subject to SE tax, you file Form 2555 for foreign earned income, or you include qualified long-term care premiums. Keep the premium statements from your insurer with the rest of the year's records. If you used an optional method on Schedule SE, the Schedule SE instructions note that it can be used to figure this deduction as well.</p>
<h2>S corporation owners</h2>
<p>An owner holding more than 2% of an S corporation follows a different path: the company pays the premiums for the owner, spouse, dependents and children under 27, reports them on the owner's W-2, and the owner may then take this deduction on Schedule 1, line 17 (${h.src('i1120s', 'Form 1120-S instructions')}). Skipping the W-2 step loses the deduction, which is one of the details to settle before an ${h.a('llc-vs-s-corp', 'S corp election')}. The ${h.a('self-employed-tax-deductions', 'deductions overview')} and the ${h.a('1099-tax-calculator', '1099 tax calculator')} put the deduction in context with the rest of the return.</p>`,
  faqs: [
    { q: 'Can I deduct health insurance premiums if I am self-employed?', a: `Yes, on Schedule 1, line 17, without itemizing, for medical, dental and qualified long-term care coverage for you, your spouse and dependents. You need a net profit, the deduction cannot exceed the business's earnings, and it is barred for months when you could join an employer's subsidized plan. For ${K.usd(profit)} of profit, ${K.usd(prem)} of premiums saves ${K.usd(a.incomeTax - b.incomeTax)} of federal income tax.` },
    { q: 'Does the self-employed health insurance deduction reduce self-employment tax?', a: 'No. It lowers adjusted gross income and therefore income tax, but Schedule SE is computed from the full business profit, and the Form 7206 instructions say the deduction cannot be subtracted when figuring net earnings from self-employment. It also slightly reduces the QBI deduction, since QBI is figured after it.' },
    { q: 'Can I take the deduction if my spouse has employer coverage?', a: 'Not for the months when you were eligible to join a subsidized plan through your spouse\'s employer, even if you chose not to enroll. The rule is applied month by month, so months before the spouse\'s plan was available, or after it ended, can still qualify if you paid your own premiums.' },
    { q: 'What changed for the premium tax credit in 2026?', a: 'According to the 2026 Form 1040-ES, households above 400% of the federal poverty line are no longer eligible for the credit, and excess advance payments must be repaid in full, with no cap, at any income. Self-employed Marketplace buyers should update their income estimate during the year to avoid a large repayment.' },
  ],
  related: ['self-employed-tax-deductions', 'qbi-deduction', '1099-tax-calculator', 'sep-ira-vs-solo-401k', 'llc-vs-s-corp'],
  sources: ['p334', 'f1040es', 'i1040sc', 'i1120s', 'i8995'],
});
