import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const Q = P.qbi;
const R = K.rate(Q.rate);
const ex = K.solo({ profit: 90000, filing: 'single' });
const saved = K.fed(ex.taxable + ex.qbi.deduction, 'single') - K.fed(ex.taxable, 'single');
const lab: Record<string, string> = { single: 'Single', mfj: 'Married filing jointly', hoh: 'Head of household', mfs: 'Married filing separately' };
const thr = (['single', 'mfj', 'hoh', 'mfs'] as const).map((f) => [lab[f], K.usd(Q.threshold[f]), K.usd(Q.phaseInEnd[f])]);
const rows = [60000, 120000, 230000, 260000, 320000].map((p) => {
  const a = K.solo({ profit: p, filing: 'single' }), b = K.solo({ profit: p, filing: 'single', sstb: true });
  const before = a.taxable + a.qbi.deduction;
  return [K.usd(p), K.usd(before), K.usd(a.qbi.deduction), K.usd(b.qbi.deduction)];
});
const hi = K.solo({ profit: 260000, filing: 'single', sstb: true });
const small = K.qbi({ qbi: 1500, taxableBeforeQbi: 60000, filing: 'single' });

export default defineGuide({
  id: 'qbi-deduction',
  group: 'tax',
  order: 15,
  slug: 'qbi-deduction',
  nav: 'QBI deduction',
  card: `The ${R} deduction, its 2026 thresholds and the service business rule`,
  title: `QBI Deduction 2026: ${R} Rule, Thresholds and SSTB Limits`,
  description: `QBI deduction for 2026: ${R} of business income, the ${K.usd(Q.threshold.single)} and ${K.usd(Q.threshold.mfj)} thresholds, phase-in ranges, service businesses and the new $${Q.minimumDeduction} minimum rule.`,
  h1: 'QBI deduction in 2026: the qualified business income deduction explained',
  intro: 'Section 199A lets owners of pass-through businesses deduct a fifth of their business income; the limits only bite at higher incomes, and 2026 changed several of them.',
  resume: `The qualified business income (QBI) deduction lets a sole proprietor, an LLC owner or an S corp shareholder deduct up to ${R} of the business's qualified income, and it is now permanent. It is capped at ${R} of taxable income before the deduction, minus net capital gain. Below ${K.usd(Q.threshold.single)} of taxable income for a single filer and ${K.usd(Q.threshold.mfj)} for a joint return in 2026, nothing else limits it. Above those figures, a wage and property limit phases in over ${K.usd(Q.phaseInEnd.single - Q.threshold.single)} (${K.usd(Q.phaseInEnd.mfj - Q.threshold.mfj)} joint), and a specified service business such as law, health, consulting or accounting loses the deduction over the same range. New for 2026, anyone with at least ${K.usd(Q.minimumQbi)} of QBI from an active business gets at least ${K.usd(Q.minimumDeduction)}. A single freelancer with ${K.usd(90000)} of profit deducts ${K.usd(ex.qbi.deduction)} and saves ${K.usd(saved)} of federal income tax. The deduction does not reduce self-employment tax.`,
  tool: 'qbi',
  body: (h) => `<p>The calculator needs two numbers that are easy to confuse. Qualified business income is the profit after the deductible half of SE tax, self-employed health insurance and retirement contributions tied to the business. Taxable income before the deduction is your whole return: adjusted gross income minus the standard or itemized deduction. The deduction is the smaller of ${R} of the first and ${R} of the second, then the limits below. Tick the service business box if your field is on the IRS list.</p>
${h.mini('total1099')}
<h2>What counts as qualified business income</h2>
<p>QBI is the net income of a trade or business conducted in the United States: a Schedule C profit, an S corporation's K-1 income, a partner's share of partnership income. Several items are left out even when the business earns them. Wages are not QBI, and neither is the reasonable compensation an S corporation pays its owner or a partner's guaranteed payments. Capital gains, dividends and interest not allocable to the business are excluded as well (${h.src('i8995', 'Form 8995 instructions')}). The deductible part of SE tax, the self-employed health insurance deduction and retirement contributions reduce QBI, which is why the QBI figure in the calculator sits below your Schedule C profit.</p>
<h3>Below the line, not in the business</h3>
<p>The deduction is taken on Form 1040 after adjusted gross income, so it lowers income tax only. It does not reduce self-employment tax, it does not change AGI-based limits elsewhere on the return, and it is available whether you itemize or take the standard deduction.</p>
<h2>The 2026 thresholds</h2>
<p>For most freelancers the rest of this page never applies: under the threshold, the deduction is simply ${R} of QBI, capped by taxable income. The thresholds and the end of the phase-in range for 2026 come from ${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}. The 2026 Form 1040-ES notes that the phase-in range grew to ${K.usd(Q.phaseInEnd.mfj - Q.threshold.mfj)} for joint filers and ${K.usd(Q.phaseInEnd.single - Q.threshold.single)} for everyone else (${h.src('f1040es', 'Form 1040-ES 2026')}).</p>
${h.table(['Filing status', 'Threshold', 'Phase-in ends'], thr, 'Taxable income before the QBI deduction, 2026', ['l', 'r', 'r'])}
<h2>Above the threshold: the wage limit</h2>
<p>Once taxable income passes the threshold, the deduction for each business cannot exceed the greater of ${K.rate(Q.wageLimitRate)} of the W-2 wages the business paid, or ${K.rate(Q.wageUbiaWageRate)} of those wages plus ${K.rate(Q.ubiaRate)} of the unadjusted basis of its qualified property. A solo consultant with no employees and no equipment has a limit of zero. Inside the phase-in range, only part of the excess over the limit is lost; past the end of the range, the limit applies in full. This is where an S corporation owner's own salary helps, since it counts as W-2 wages paid by the business, and where the ${h.a('llc-vs-s-corp', 'LLC vs S corp comparison')} gets interesting.</p>
${h.mini('scorpQuick')}
<h3>Specified service businesses</h3>
<p>The IRS list of specified service trades or businesses (SSTB) covers health, law, accounting, actuarial science, performing arts, consulting, athletics, financial services, brokerage, investing and investment management, trading, and any business whose principal asset is the reputation or skill of its owners or employees, such as fees for endorsements or appearances. Below the threshold an SSTB qualifies like any other business. Within the range, only a shrinking percentage of its income, wages and property counts. Above the range it gets nothing.</p>
${h.table(['Net profit', 'Taxable income before QBI', 'Other business', 'Service business'], rows, 'QBI deduction for a single filer with no employees, 2026', ['l', 'r', 'r', 'r'])}
<p>The last rows show the cliff. At ${K.usd(260000)} of profit, a consultant's deduction has fallen to ${K.usd(hi.qbi.deduction)}, while a business with no wages loses it through the wage limit instead.</p>
<h2>The ${K.usd(Q.minimumDeduction)} floor, new in 2026</h2>
<p>From 2026, a taxpayer with at least ${K.usd(Q.minimumQbi)} of QBI from active trades or businesses in which they materially participate can claim at least ${K.usd(Q.minimumDeduction)}. It mostly helps people with small side businesses: ${K.usd(1500)} of QBI would give ${K.usd(1500 * Q.rate)} under the ${R} rule, and the floor raises it to ${K.usd(small.deduction)}. Both amounts will be indexed for inflation after 2026.</p>
<h2>Rentals, several businesses and former employees</h2>
<p>Rental real estate can count as a trade or business for this deduction if it meets the section 162 standard, and Rev. Proc. 2019-38 offers a safe harbor for rental enterprises that do not. Owners of several businesses may aggregate them into one, which pools wages and property for the limit, provided the same group owns at least half of each, none is a service business and they share at least two listed links such as facilities or customers. One trap targets people who leave a job and come back as contractors: if you keep providing substantially the same services to your former employer, the IRS presumes for three years that you are still an employee for QBI purposes, and you have to rebut it with contracts or similar records.</p>
<h2>Form 8995 or Form 8995-A</h2>
<p>Form 8995 is the simplified computation. You use it when you have QBI and your taxable income before the deduction is at or below the threshold for your filing status, and you are not a patron of an agricultural or horticultural cooperative. Everyone else uses Form 8995-A, with Schedule A for a service business in the phase-in range and Schedule B to aggregate several businesses. The ${h.a('1099-tax-calculator', '1099 tax calculator')} applies the deduction automatically, and the ${h.a('self-employed-tax-deductions', 'deductions guide')} shows how each business expense trims QBI a little as it trims profit.</p>`,
  faqs: [
    { q: 'Who qualifies for the QBI deduction?', a: `Individuals with income from a pass-through business: sole proprietors, single-member LLC owners, partners and S corporation shareholders, plus some trusts and estates. C corporations and employees' wages do not qualify. Material participation is not required for the ${R} deduction itself, but the new ${K.usd(Q.minimumDeduction)} minimum needs ${K.usd(Q.minimumQbi)} of QBI from active businesses.` },
    { q: 'Does the QBI deduction reduce self-employment tax?', a: 'No. It is subtracted after adjusted gross income, on Form 1040, so it lowers income tax only. Self-employment tax is computed on Schedule SE from the full net profit, before any QBI deduction. That is one reason a freelancer can owe more SE tax than income tax at moderate profits.' },
    { q: 'Is consulting a specified service business for QBI?', a: `Yes, consulting is on the IRS list, with health, law, accounting, financial services and several others. It matters only above ${K.usd(Q.threshold.single)} of taxable income single or ${K.usd(Q.threshold.mfj)} joint in 2026. Below that, a consultant gets the full ${R} like any other business owner.` },
    { q: 'Should I use Form 8995 or Form 8995-A?', a: `Form 8995 when your taxable income before the QBI deduction is at or under the threshold, ${K.usd(Q.threshold.single)} single or ${K.usd(Q.threshold.mfj)} joint for 2026, and you are not a patron of a specified cooperative. Above the threshold, or to aggregate businesses, you need Form 8995-A and its schedules.` },
    { q: 'Is the QBI deduction going away after 2025?', a: 'No. The 2025 law known as the OBBBA made the deduction permanent for qualified active trades or businesses, according to Publication 334 and the 2026 Form 1040-ES. The same law widened the phase-in ranges and added the minimum deduction that starts in 2026.' },
  ],
  related: ['1099-tax-calculator', 'llc-vs-s-corp', 'self-employed-tax-deductions', 'reasonable-salary', 'schedule-c'],
  sources: ['i8995', 'rp_2025_32', 'f1040es', 'p334', 'qbi_news'],
});
