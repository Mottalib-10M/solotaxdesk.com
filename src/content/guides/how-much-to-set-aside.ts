import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const E = P.estimated;
const profits = [20000, 40000, 60000, 85000, 120000, 180000, 250000];
const rows = profits.map((p) => {
  const s = K.solo({ profit: p, filing: 'single' }), m = K.solo({ profit: p, filing: 'mfj' });
  return [K.usd(p), K.rate(s.setAside), K.usd(s.quarterly), K.rate(m.setAside), K.usd(m.quarterly)];
});
const side = 15000;
const gig = [0, 50000, 100000, 180000].map((wage) => {
  const r = K.solo({ profit: side, filing: 'single', w2Wages: wage });
  return [K.usd(wage), K.rate(r.setAside), K.usd(r.setAside * side), K.rate(r.marginal)];
});
const s60 = K.solo({ profit: 60000, filing: 'single' });
const s120 = K.solo({ profit: 120000, filing: 'single' });
const g70 = K.solo({ profit: side, filing: 'single', w2Wages: 70000 });
const alone = K.solo({ profit: side, filing: 'single' });
const d = E.dueDates;
const inv = K.solo({ profit: 80000, filing: 'single' });

export default defineGuide({
  id: 'how-much-to-set-aside',
  group: 'tax',
  order: 19,
  slug: 'how-much-to-set-aside',
  nav: 'How much to set aside',
  card: 'The share of each payment to keep for taxes, by profit level',
  title: 'Set Aside for Taxes 2026: How Much to Keep From 1099 Pay',
  description: `How much to set aside for taxes when self-employed in 2026: about ${K.rate(s60.setAside)} of ${K.usd(60000)} of profit, ${K.rate(s120.setAside)} at ${K.usd(120000)}, more with a state tax or a salary on top.`,
  h1: 'How much to set aside for taxes as a self-employed person in 2026',
  intro: 'A percentage you can apply to every payment as it arrives, so the April bill and the quarterly payments are already sitting in an account.',
  resume: `For federal tax alone, a single self-employed person with no other income should keep about ${K.rate(K.solo({ profit: 20000, filing: 'single' }).setAside)} of profit at ${K.usd(20000)}, ${K.rate(s60.setAside)} at ${K.usd(60000)}, ${K.rate(s120.setAside)} at ${K.usd(120000)} and ${K.rate(K.solo({ profit: 250000, filing: 'single' }).setAside)} at ${K.usd(250000)} for 2026. Those rates include self-employment tax of ${K.rate(P.se.ssRate + P.se.medicareRate)} on ${K.dec(P.se.factor * 100, 2)}% of profit and income tax after the standard deduction, half of SE tax and the QBI deduction. A state income tax comes on top. A side business stacked on a salary needs a higher share, because the salary has already used the low brackets: ${K.usd(side)} of side profit next to a ${K.usd(70000)} salary calls for ${K.rate(g70.setAside)}, against ${K.rate(alone.setAside)} if it were your only income. The rates apply to profit; if you set aside from gross invoices, use a lower percentage that reflects your expense ratio. The calculator converts your situation into a share per invoice and an amount per month.`,
  tool: 'set-aside',
  body: (h) => `<p>Enter the 1099 income you expect this year, the business expenses that come off it, any W-2 salary and your state. The result is the share of each payment received that should go to a tax account, the amount per month, and how much of it is self-employment tax. Because it applies to gross receipts, it already accounts for your expenses.</p>
${h.mini('quarter')}
<h2>The rate by profit level</h2>
<p>The table uses the site's engine to compute the whole 2026 federal bill at several profit levels and divides it by the profit. It is a marginal-free average: what you need in total, spread over every dollar earned. Married couples filing jointly need less because the brackets and the standard deduction are twice as wide, while self-employment tax does not change.</p>
${h.table(['Net profit', 'Single: set aside', 'Single: per quarter', 'Joint: set aside', 'Joint: per quarter'], rows, 'Federal income tax and SE tax as a share of profit, 2026, no other income, no state tax', ['l', 'r', 'r', 'r', 'r'])}
<p>The share climbs quickly at first, because self-employment tax starts with the first dollar while income tax waits for the standard deduction to be used up. It then flattens: above the Social Security base of ${K.usd(P.se.wageBase['2026'])}, the ${K.rate(P.se.ssRate)} part stops, which offsets the higher brackets. If your income varies a lot, use the rate for the profit you expect for the full year, not the rate for the month you are in.</p>
<h2>Adding your state</h2>
<p>States without an income tax add nothing to these rates. Elsewhere, add roughly the state's effective rate on your profit; flat-tax states are easy to estimate, graduated ones depend on income. Several cities and counties tax earnings too. The calculator adds your state's tax once it has been checked against the state revenue agency, and the ${h.a('state-income-tax', 'state income tax comparison')} shows the differences. A state also usually wants its own estimated payments.</p>
<h2>A side gig on top of a salary</h2>
<p>When you already have a job, the side profit is taxed at the top of your income, not the bottom. The standard deduction and the low brackets are used up by the salary, so each side dollar meets your marginal rate plus SE tax. In the other direction, a high salary reduces the Social Security part of SE tax, because wages count first toward the base.</p>
${h.table(['Salary', 'Set aside from the side profit', 'Tax added by the side profit', 'Marginal federal bracket'], gig, `${K.usd(side)} of side-business profit, single filer, 2026`, ['l', 'r', 'r', 'r'])}
<p>Two ways exist to cover it. You can set the money aside and send estimated payments, or you can ask your employer to withhold more with a new Form W-4 (${h.src('f1040es', 'Form 1040-ES 2026')}). For the penalty computation, a quarter of the year's withholding is generally considered paid on each due date, even if the extra withholding starts late in the year (${h.src('p505', 'Publication 505')}). Withholding is often simpler for a steady side income.</p>
${h.mini('total1099')}
<h2>From set-aside to quarterly payments</h2>
<p>Money in a separate account is only half the job. You owe estimated payments if you expect to owe at least ${K.usd(E.minimumOwed)} after withholding, due ${K.day(d[0])}, ${K.day(d[1])}, ${K.day(d[2])} and ${K.day(d[3])}. You avoid the underpayment penalty by paying the smaller of ${K.rate(E.currentYearShare)} of this year's tax or ${K.rate(E.priorYearShare)} of last year's, ${K.rate(E.priorYearShareHigh)} if last year's adjusted gross income was above ${K.usd(E.highAgi.single)} (${h.src('p505', 'Publication 505')}). That gives a choice: send last year's figure in four equal parts and keep the rest of your set-aside until April, or pay as you earn. The ${h.a('quarterly-estimated-taxes', 'quarterly tax calculator')} and the ${h.a('safe-harbor', 'safe harbor page')} work out both.</p>
<h2>Turning the rate into a habit</h2>
<p>The easiest system is a transfer each time a client pays. Suppose you expect ${K.usd(80000)} of profit this year as a single filer: the federal rate is ${K.rate(inv.setAside)}, so a ${K.usd(5000)} payment sends ${K.usd(5000 * inv.setAside)} to the tax account and leaves ${K.usd(5000 * (1 - inv.setAside))} to spend. If that ${K.usd(5000)} is gross and your expenses run at a fifth of receipts, the share of the invoice is lower, since part of it pays for those costs. Monthly transfers of a fixed amount work too, as long as you adjust them when income moves.</p>
<h3>Seasonal or lumpy income</h3>
<p>A business that earns most of its money in a few months does not have to pay four equal installments. The annualized income installment method in ${h.src('p505', 'Publication 505')} figures each payment from income earned up to the end of that period, so a quiet first half means smaller early payments. Using it requires Form 2210 with your return. Your set-aside rate stays the same; only the timing of the transfers to the IRS changes.</p>
<h2>When to revise the rate</h2>
<p>Recheck after each quarter. A large contract, a new expense such as equipment, a move to another state, marriage, or a salary that starts or stops all change the right percentage. A rate set too high costs nothing but cash flow, and the surplus simply rolls into next year's account; a rate set too low leaves a bill and possibly a penalty. If profit approaches the level where an ${h.a('llc-vs-s-corp', 'S corp election')} could pay, that is also the moment to compare.</p>`,
  faqs: [
    { q: 'What percentage should I set aside for taxes on a side hustle?', a: `More than a full-time freelancer at the same profit, because your salary already fills the low brackets. With ${K.usd(side)} of side profit and a ${K.usd(70000)} salary, a single filer needs about ${K.rate(g70.setAside)} for federal tax in 2026, against ${K.rate(alone.setAside)} with no job. Add your state rate on top.` },
    { q: 'Should I set aside taxes from gross income or from profit?', a: 'The rates on this page apply to profit, income after business expenses. If you prefer to move a share of every invoice as it arrives, use a lower percentage that reflects your expenses: the calculator does this when you enter both income and expenses, and gives the share of each payment received.' },
    { q: `Is ${K.rate(0.3)} enough to save for self-employment taxes?`, a: `Often yes for federal tax. For a single filer with no other income, the 2026 federal share stays below ${K.rate(K.solo({ profit: 250000, filing: 'single' }).setAside)} even at ${K.usd(250000)} of profit. It may fall short with a high state tax, or with a salary that pushes the side profit into the ${K.rate(P.brackets.single[3][1])} bracket or higher.` },
    { q: 'Where should I keep the money I set aside for taxes?', a: 'In an account separate from the one you spend from, so the balance never looks like income. Pay each quarterly estimate from it and leave the remainder for the April balance. The IRS does not regulate this; what matters is that the cash is available on each due date.' },
  ],
  related: ['quarterly-estimated-taxes', '1099-tax-calculator', 'safe-harbor', 'self-employment-tax-rate', 'state-income-tax'],
  sources: ['f1040es', 'p505', 'rp_2025_32', 'ssa_2027'],
});
