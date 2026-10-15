import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const SHARE = 0.4;
const profits = [100000, 200000, 400000];
const rows = profits.map((p) => ({
  p,
  s: K.scorp({ profit: p, salary: p * SHARE, filing: 'single' }),
  all: K.ccorp({ profit: p, salary: p * SHARE, filing: 'single', payout: 1 }),
  none: K.ccorp({ profit: p, salary: p * SHARE, filing: 'single', payout: 0 }),
}));
const [r1, r2, r4] = rows;
const corp = K.rate(P.corporate.rate);
const keptWins = rows.filter((x) => x.none.total < x.s.total);

export default defineGuide({
  id: 'c-corp-vs-s-corp',
  group: 'structure',
  order: 7,
  slug: 'c-corp-vs-s-corp',
  nav: 'C corp vs S corp',
  card: 'One tax or two: the 2026 totals at three profit levels',
  title: 'C Corp vs S Corp 2026: Double Tax, Retained Profit, Owners',
  description: `C corp vs S corp in 2026: a flat ${corp} corporate tax plus dividend tax, or one layer of personal tax. Totals from ${K.usd(100000)} to ${K.usd(400000)}, ownership rules.`,
  h1: 'C corp vs S corp: the difference in tax and ownership for 2026',
  intro: 'Both are corporations under state law; only the federal tax treatment differs. Enter profit, salary and the share paid out to compare the two.',
  resume: `The difference between an S corporation and a C corporation is how many times the profit is taxed. An S corp pays no federal income tax itself: its profit passes to the owners and is taxed once, at their personal rates. A C corp pays a flat ${corp} on its profit, and the dividends it pays later are taxed again on the owner's return at 0%, 15% or 20%, plus the ${K.rate(P.niit.rate)} net investment income tax for high incomes. With a salary at 40% of profit, a single owner pays ${K.usd(r1.s.total)} as an S corp on ${K.usd(100000)} of profit against ${K.usd(r1.all.total)} as a C corp paying everything out; at ${K.usd(200000)}, ${K.usd(r2.s.total)} against ${K.usd(r2.all.total)}. A C corp that keeps its profit pays less this year, and at ${K.usd(400000)} less than the S corp, but the second tax only waits for the payout. An S corp is also limited to ${P.scorp.maxShareholders} eligible shareholders and one class of stock.`,
  tool: 'ccorp',
  body: (h) => `<p>In a state's corporate registry, a C corp and an S corp look the same: articles of incorporation, a board, shareholders and stock. The letters refer to subchapters of the Internal Revenue Code. Subchapter C is the default for every corporation; subchapter S is a status the corporation asks for. That means the question "C corp or S corp" is really "should this corporation file Form 2553?", and the answer depends on profit, on what happens to it after the year ends and on who owns the shares. The quick tool below lines up all four structures at one profit.</p>
${h.mini('fourWay')}
<h2>One layer of tax or two</h2>
<p>A C corporation is a separate taxpayer. It files Form 1120 and pays ${corp} on its taxable income under ${h.src('usc_11', 'section 11 of the Code')}, with no brackets. The ${h.src('corporation', 'IRS page on forming a corporation')} spells out the consequence: the profit is taxed to the corporation when earned and taxed again to the shareholders when distributed as dividends, the corporation gets no deduction for the dividends it pays, and shareholders cannot deduct the corporation's losses.</p>
<p>An S corporation removes the first layer. Its income, losses and credits flow to the shareholders on K-1s and are taxed only on their personal returns, at rates from ${K.rate(P.brackets.single[0][1])} to ${K.rate(P.brackets.single[6][1])}. A loss can offset other income, within the owner's basis in the stock and debt. In both structures, an owner who works in the business takes a salary through payroll, and that salary is deducted by the company before either tax is computed.</p>
<h2>The totals at three profit levels</h2>
<p>The table holds the owner's salary at 40% of profit, for a single filer in a state without income tax. "Paid out" means the C corp distributes all of its after-tax profit as qualified dividends; "kept" means it distributes nothing this year.</p>
${h.table(['Profit', 'S corp, total tax', 'C corp, all paid out', 'C corp, all kept', 'Kept inside the C corp'], rows.map(({ p, s, all, none }) => [K.usd(p), K.usd(s.total), K.usd(all.total), K.usd(none.total), K.usd(none.retained)]), 'Federal income tax, payroll taxes, dividend tax and NIIT, 2026 rules; payroll and filing costs left out.', ['r', 'r', 'r', 'r', 'r'])}
<p>When the C corp pays everything out, the S corp wins at each level: ${K.usd(r1.all.total - r1.s.total)} less tax at ${K.usd(100000)}, ${K.usd(r2.all.total - r2.s.total)} at ${K.usd(200000)} and ${K.usd(r4.all.total - r4.s.total)} at ${K.usd(400000)}. When the C corp keeps everything, its bill for the year ${keptWins.length ? `drops below the S corp's at ${keptWins.map((x) => K.usd(x.p)).join(' and ')}` : 'still stays above the S corp\'s'}, because a flat ${corp} on the kept profit is less than the ${K.rate(K.marginal(r4.s.taxable, 'single'))} bracket the S corp owner reaches there. At lower profits the owner's own brackets are below ${corp}, and the S corp stays cheaper even against a C corp that pays nothing out. That high-profit gap is the argument for a C corp in a business that reinvests.</p>
<h3>Retained earnings are a deferral, not an exemption</h3>
<p>Profit kept inside a C corporation has paid only the corporate tax. When it is paid out later, as a dividend or on the sale of the shares, the second layer arrives, at the rates that apply then. A C corp therefore pays off when the money stays in the business for years and funds growth: hiring, equipment, inventory, a product. A consultant who needs the profit to live on gets the double tax every year, and the S corp or a default LLC is almost always cheaper. Planning to leave large balances in the company for years is a point to review with a CPA.</p>
<h2>Who can own shares</h2>
<p>The ownership rules often decide the question before the tax does. According to the ${h.src('i2553', 'Form 2553 instructions')}, an S corporation can have no more than ${P.scorp.maxShareholders} shareholders, all of them individuals, estates, certain trusts or exempt organizations, none of them a nonresident alien, and only one class of stock. A C corporation has none of these limits. A venture fund organized as a partnership, a parent company, a foreign founder or investors who want preferred shares with a priority on liquidation all require a C corp. Founders who plan to raise outside equity therefore often start as a C corp, while a business owned by one or two working people has little use for that flexibility. The ${h.a('c-corporation', 'C corporation guide')} goes through dividends, NIIT and the return in detail.</p>
<h2>Switching later</h2>
<p>A C corporation can become an S corporation by filing Form 2553, if it meets the tests on the effective date. It then carries some history with it: built-in gains on assets it held as a C corp, and passive income when it still has earnings and profits from those years, can be taxed at the corporate level. Going the other way, an S corporation that revokes or loses its status becomes a C corp and generally needs IRS consent to elect again within five years. The order matters, and changing twice is costly.</p>
<p>For a business owned by the people who work in it and paying them most of its profit, the comparison usually favors the S corp; the open question is then whether the S corp beats a plain LLC, which the ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} answers. The four structures side by side are on the ${h.a('llc-vs-corporation', 'LLC vs corporation page')}, and the ${h.a('reasonable-salary', 'reasonable salary guide')} explains the salary both corporations must pay a working owner.</p>`,
  faqs: [
    { q: 'Is a C corp or an S corp better for a small business in 2026?', a: `For a business that pays its profit to the owners who work in it, the S corp usually costs less, because the profit is taxed once. With a 40% salary on ${K.usd(200000)} of profit, a single owner pays ${K.usd(r2.s.total)} as an S corp and ${K.usd(r2.all.total)} as a C corp paying everything out. A C corp fits when profit stays in the business or investors need it.` },
    { q: 'Can an S corp have preferred stock?', a: 'No. An S corporation may have only one class of stock: every outstanding share must carry identical rights to distributions and liquidation proceeds. Differences in voting rights are allowed, so voting and nonvoting common shares are possible. Preferred shares with a dividend or liquidation priority create a second class and end the S status (Instructions for Form 2553).' },
    { q: 'Can a C corporation switch to an S corporation?', a: `Yes, by filing Form 2553 within ${P.scorp.electionMonths} months and ${P.scorp.electionDays} days of the start of the tax year, or during the year before, if it passes all the tests on that date. The corporation may then owe tax on built-in gains from assets held as a C corp and on excess passive income while it has earnings from those years.` },
    { q: 'Why does a C corp pay less tax when it keeps its profit?', a: `Because only the corporate tax of ${corp} applies to profit that stays inside, which is lower than the top personal brackets of an S corp owner. The second tax, on dividends, is postponed until the money is paid out or the shares are sold. It is a deferral, and a business that needs the cash every year gets little from it.` },
    { q: 'Do C corp owners pay self-employment tax?', a: `No. A C corporation owner who works in the business is an employee and pays Social Security and Medicare through payroll on the salary, with the company paying the matching half. Dividends carry no payroll or self-employment tax but are taxed as investment income, and they may also owe the ${K.rate(P.niit.rate)} net investment income tax above the thresholds.` },
  ],
  related: ['c-corporation', 's-corp', 'llc-vs-corporation', 'llc-vs-s-corp', 'business-structure'],
  sources: ['usc_11', 'usc_1411', 'corporation', 'i2553', 's_corps', 'rp_2025_32'],
});
