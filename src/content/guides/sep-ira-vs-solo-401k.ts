import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const R = P.retirement;
const profits = [30000, 50000, 80000, 120000, 200000, 300000, 450000];
const rows = profits.map((p) => {
  const a = K.retirement(p, 40), b = K.retirement(p, 55), c = K.retirement(p, 61);
  return [K.usd(p), K.usd(a.sep), K.usd(a.solo401k), K.usd(b.solo401k), K.usd(c.solo401k)];
});
const m = K.retirement(120000, 45);
const base = K.solo({ profit: 120000, filing: 'single' });
const withSolo = K.solo({ profit: 120000, filing: 'single', retirement: m.solo401k });
const withSep = K.solo({ profit: 120000, filing: 'single', retirement: m.sep });
const low = K.retirement(50000, 45);
const ne = 120000 - base.se.half;

export default defineGuide({
  id: 'sep-ira-vs-solo-401k',
  group: 'tax',
  order: 30,
  slug: 'sep-ira-vs-solo-401k',
  nav: 'SEP IRA vs solo 401(k)',
  card: 'How much each self-employed retirement plan lets you shelter in 2026',
  title: 'SEP IRA vs Solo 401(k) 2026: Self-Employed Retirement Limits',
  description: `SEP IRA vs solo 401(k) in 2026: ${K.usd(R.electiveDeferral)} of deferrals, a ${K.usd(R.dcLimit)} cap, catch-ups at 50 and 60 to 63, the maximum at your own profit and the tax it saves you.`,
  h1: 'SEP IRA or solo 401(k): what a self-employed person can put away in 2026',
  intro: 'Both plans let a one-person business shelter part of its profit from income tax. They do not let you shelter the same amount. Enter your profit and age for both maxima.',
  resume: `For self-employed retirement savings in 2026, a solo 401(k) allows more than a SEP IRA at almost every profit level below the cap. Both share an overall ceiling of ${K.usd(R.dcLimit)} per person under Notice 2025-67, and both allow an employer-style contribution worth ${K.rate(R.selfEmployedEffectiveRate)} of net earnings from self-employment for an owner, the Pub 560 equivalent of the ${K.rate(R.employerRate)} rate employees get. Only the 401(k) adds an employee deferral of up to ${K.usd(R.electiveDeferral)}, plus a catch-up of ${K.usd(R.catchUp50)} from age 50 or ${K.usd(R.catchUp60to63)} at ages 60 to 63. At ${K.usd(120000)} of profit, a SEP tops out at ${K.usd(m.sep)} while a solo 401(k) reaches ${K.usd(m.solo401k)} for someone under 50; maxing the 401(k) cuts that single filer's federal tax by about ${K.usd(base.total - withSolo.total)}. The SEP is simpler and can be opened as late as the return's extended due date; the solo 401(k) has more paperwork and a Form 5500-EZ once assets reach ${K.usd(250000)}.`,
  tool: 'retirement',
  body: (h) => `<p>For anyone who works alone, the two plans the IRS describes in ${h.src('p560', 'Publication 560')} are the SEP, a simplified employee pension funded through an IRA, and the one-participant 401(k), also called a solo 401(k). Both are funded with business money that comes off your taxable income. The difference is in how many layers of contribution each allows, and that is what decides the maximum. Everything starts from net earnings from self-employment: the profit on Schedule C minus the deductible half of self-employment tax, and minus the contribution itself.</p>
${h.mini('seHalf')}
<h2>Why the self-employed rate is ${K.rate(R.selfEmployedEffectiveRate)}, not ${K.rate(R.employerRate)}</h2>
<p>An employer can put up to ${K.rate(R.employerRate)} of an employee's pay into a SEP or a profit-sharing plan. For your own account the math is circular, because the contribution reduces the very earnings it is measured on. Pub 560 solves this with a rate table: a plan rate of ${K.rate(R.employerRate)} becomes a reduced rate of ${K.rate(R.selfEmployedEffectiveRate)} of net earnings for the owner, and a plan rate of 10% becomes 9.0909%, as the publication's own example shows. With ${K.usd(120000)} of profit, half of self-employment tax is ${K.usd(base.se.half)}, net earnings before the contribution are ${K.usd(ne)}, and ${K.rate(R.selfEmployedEffectiveRate)} of that is ${K.usd(m.employer)}. That figure is the whole SEP maximum and only the second layer of a solo 401(k).</p>
<h2>The 2026 limits from Notice 2025-67</h2>
<ul>
<li>Employee elective deferral to a 401(k): ${K.usd(R.electiveDeferral)}.</li>
<li>Catch-up for those 50 or older at the end of the year: ${K.usd(R.catchUp50)}; for those turning 60, 61, 62 or 63 in 2026: ${K.usd(R.catchUp60to63)} instead.</li>
<li>Overall cap on contributions to defined contribution plans, catch-ups excluded: ${K.usd(R.dcLimit)}.</li>
<li>Compensation that can be taken into account: ${K.usd(R.compensationLimit)}.</li>
<li>Traditional or Roth IRA, for comparison: ${K.usd(R.ira)}.</li>
</ul>
<p>Every figure above comes from ${h.src('n_2025_67', 'Notice 2025-67')}. The deferral limit is personal, not per plan: Pub 560 states that it applies to all salary reduction contributions and elective deferrals together, so a freelancer who also defers through an employer's 401(k) shares the same ${K.usd(R.electiveDeferral)} between the two plans.</p>
<h2>Maximum contribution by profit and age</h2>
${h.table(['Net profit', 'SEP IRA', 'Solo 401(k), under 50', 'Solo 401(k), age 50 to 59', 'Solo 401(k), age 60 to 63'], rows, 'Sole proprietor, 2026 limits, one plan only (calculator engine: Notice 2025-67, Pub 560 rate)', ['l', 'r', 'r', 'r', 'r'])}
<p>Three patterns stand out. At modest profits the gap is wide: at ${K.usd(50000)}, the SEP stops at ${K.usd(low.sep)} while a solo 401(k) reaches ${K.usd(low.solo401k)}, because the employee deferral alone can absorb most of what the business earns. At the bottom of the table the catch-up columns stop helping, since a contribution can never exceed net earnings. And at the top, both plans converge on the ${K.usd(R.dcLimit)} cap; only the catch-up keeps the 401(k) ahead there, because catch-ups sit outside the overall limit.</p>
<h3>What the contribution saves</h3>
<p>The deduction lowers income tax, not self-employment tax: Pub 560 has sole proprietors deduct contributions for themselves on line 16 of Schedule 1, after Schedule C, so the profit that Schedule SE starts from does not change. For a single filer at ${K.usd(120000)} with no state tax, the SEP maximum reduces the federal bill by about ${K.usd(base.total - withSep.total)}, and the solo 401(k) maximum by about ${K.usd(base.total - withSolo.total)}. The money is taxed later, when withdrawn, unless a Roth option is used. Lower taxable income also shrinks the ${h.a('qbi-deduction', 'QBI deduction')} a little, which the calculator takes into account.</p>
<h2>Deadlines and paperwork</h2>
<p>A SEP can be set up for a year as late as the due date of that year's income tax return, extensions included, and contributions are deductible if made by that same date. That makes it the one plan you can still open for 2026 after the year has ended. Pub 560 mentions Form 5305-SEP, the IRS model agreement, as one way to set it up, and the account itself is held at a bank, insurer or other qualified financial institution.</p>
<p>The solo 401(k) is a qualified plan with a written plan document. Pub 560 says deductible contributions for a year can be made up to the due date of the return plus extensions. On set-up, it states that the plan must be adopted by the last day of the tax year for contributions to be deductible for that year, and that a sole proprietor whose new 401(k) is adopted after year-end, as its only participant, must pay elective deferrals into the plan before the unextended filing deadline for them to count for that first plan year. Read that paragraph of Pub 560 with the plan provider before relying on a late start. Once plan assets reach ${K.usd(250000)} at the end of a year, the ${h.src('solo401k', 'IRS one-participant 401(k) page')} says a Form 5500-EZ is generally required.</p>
<h2>Choosing between them</h2>
<p>The solo 401(k) wins on the maximum below the cap, and it is the only one of the two with catch-ups for people 50 and over. The SEP wins on simplicity and on timing, and it does not reduce what you can put in your own IRA: Pub 560 confirms that employer contributions to a SEP IRA leave the IRA limit untouched. Hiring an employee changes both answers, since each plan then has to cover eligible staff, so the comparison here holds for a business with no employees other than the owner and, in some cases, a spouse. Retirement savings also interact with ${h.a('self-employed-health-insurance', 'health insurance premiums')} and with an ${h.a('s-corp', 'S corp salary')}, where the base becomes the wages you pay yourself rather than the profit; a CPA can weigh those together for your numbers.</p>`,
  faqs: [
    { q: 'How much can a self-employed person put in a solo 401(k) in 2026?', a: `Up to ${K.usd(R.electiveDeferral)} as an employee deferral plus ${K.rate(R.selfEmployedEffectiveRate)} of net earnings as the employer share, together capped at ${K.usd(R.dcLimit)} under Notice 2025-67. Catch-ups of ${K.usd(R.catchUp50)} at 50 or older, or ${K.usd(R.catchUp60to63)} at 60 to 63, come on top. At ${K.usd(120000)} of profit and under 50, the total is ${K.usd(m.solo401k)}.` },
    { q: 'Why can I only contribute 20% to my own SEP IRA when employees get 25%?', a: `Because your contribution reduces the net earnings it is based on. Pub 560 converts a ${K.rate(R.employerRate)} plan rate into a ${K.rate(R.selfEmployedEffectiveRate)} rate applied to net earnings, which are profit minus half of self-employment tax. The result is the same dollar amount an employee would get at ${K.rate(R.employerRate)} of pay.` },
    { q: 'Can I still open a SEP IRA for 2026 after December 31?', a: 'Yes. Publication 560 allows a SEP to be set up for a year as late as the due date of that year\'s return, including extensions, and contributions made by that date are deductible for the year. A solo 401(k) follows stricter set-up rules described in the same publication.' },
    { q: 'Does a solo 401(k) contribution lower self-employment tax?', a: 'No. Contributions for yourself are deducted on Schedule 1 of Form 1040, not on Schedule C, so the profit used for self-employment tax stays the same. They reduce adjusted gross income and therefore income tax, and the money is taxed when withdrawn unless it went into a Roth account.' },
    { q: 'If I have a 401(k) at my day job, can I also have a solo 401(k) for my side business?', a: `Yes, but the ${K.usd(R.electiveDeferral)} employee deferral limit for 2026 is shared across both plans, according to Pub 560. The employer-style share of ${K.rate(R.selfEmployedEffectiveRate)} of net earnings in the solo plan is not part of that shared limit, so the side business can still contribute it.` },
  ],
  related: ['self-employed-tax-deductions', 'qbi-deduction', 'self-employed-health-insurance', 's-corp', '1099-tax-calculator'],
  sources: ['n_2025_67', 'p560', 'solo401k'],
});
