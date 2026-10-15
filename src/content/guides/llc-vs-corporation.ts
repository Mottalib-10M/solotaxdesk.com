import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const SHARE = 0.45, ADMIN = 2000;
const profits = [80000, 140000, 250000];
const rows = profits.map((p) => ({
  p,
  llc: K.solo({ profit: p, filing: 'single' }).total,
  s: K.scorp({ profit: p, salary: p * SHARE, filing: 'single', adminCost: ADMIN }).total,
  cOut: K.ccorp({ profit: p, salary: p * SHARE, filing: 'single', payout: 1 }).total,
  cKept: K.ccorp({ profit: p, salary: p * SHARE, filing: 'single', payout: 0 }).total,
}));
const mid = rows[1];
const corp = K.rate(P.corporate.rate);
const lowest = (x: typeof mid) => ([['the default LLC', x.llc], ['the LLC or corporation taxed as an S corp', x.s], ['the C corp paying everything out', x.cOut]] as Array<[string, number]>).reduce((a, b) => (b[1] < a[1] ? b : a))[0];

export default defineGuide({
  id: 'llc-vs-corporation',
  group: 'structure',
  order: 9,
  slug: 'llc-vs-corporation',
  nav: 'LLC vs corporation',
  card: 'Legal form against tax status, and the four tax results side by side',
  title: 'LLC vs Corporation 2026: Legal and Tax Differences Compared',
  description: `LLC vs corporation in 2026: owners, paperwork and liability, then the tax on ${K.usd(140000)} of profit as an LLC, an S corp and a C corp at ${corp}. Calculator by state.`,
  h1: 'LLC vs corporation: the legal and tax differences in 2026',
  intro: 'An LLC and a corporation are both state-law entities with limited liability, but the IRS taxes them differently by default. Compare all four tax outcomes on one profit.',
  resume: `An LLC and a corporation both shield their owners from the business's debts, but they are built differently and taxed differently by default. An LLC has members and an operating agreement, no limit on the number or type of owners, and pass-through taxation: one member files Schedule C, two or more file a partnership return. A corporation has shareholders, stock, directors and officers, and is a C corporation taxed at ${corp} unless it elects S status. The line between them is not fixed for tax purposes: an LLC can elect to be taxed as a C corp on Form 8832 or as an S corp on Form 2553. For a single owner with ${K.usd(140000)} of profit, a salary at 45% of profit where one applies and no state tax, federal tax is ${K.usd(mid.llc)} as a default LLC, ${K.usd(mid.s)} as an S corp with ${K.usd(ADMIN)} of costs and ${K.usd(mid.cOut)} as a C corp paying out all its profit.`,
  tool: 'compare',
  body: (h) => `<p>"Limited liability corporation" is a common slip: the LLC is a limited liability company, a separate kind of entity from a corporation, created by its own state statute. Both protect personal assets from the debts of the business in the ordinary case, and both are registered with the state, but the similarities stop there. The tax default is the biggest gap, and the quick check below shows what the ${corp} corporate rate followed by a dividend means on a given profit.</p>
${h.mini('ccorpQuick')}
<h2>How the two entities are built</h2>
<p>An LLC is formed by filing articles of organization. Its owners are members, and the ${h.src('llc', 'IRS page on LLCs')} notes that most states do not restrict who they can be: individuals, corporations, other LLCs and foreign entities are allowed, and there is no maximum number. A single owner is enough. Management is set by an operating agreement, which can split profits in almost any way the members agree on. A few kinds of business, such as banks and insurance companies, generally cannot be LLCs.</p>
<p>A corporation is formed by filing articles of incorporation. Its owners are shareholders who exchange money or property for stock, as the ${h.src('corporation', 'IRS page on forming a corporation')} describes. State law then expects a structure: directors elected by the shareholders, officers appointed by the directors, bylaws, and usually meetings and minutes. Ownership is easy to transfer and divide through shares, which is why outside investors are used to corporations.</p>
<h3>What each one costs to keep</h3>
<p>Both pay a state filing fee to form and, in most states, a yearly or biennial report fee; some states add a franchise or minimum tax that can differ between LLCs and corporations. The state pages list the figures that were verified on the agency's site, and the ${h.a('llc-cost', 'LLC cost calculator')} adds them up over several years.</p>
<h2>How the IRS taxes each one by default</h2>
<ul>
<li><strong>LLC with one member:</strong> disregarded. The profit goes on the owner's Schedule C and carries self-employment tax, as for a sole proprietor.</li>
<li><strong>LLC with two or more members:</strong> a partnership. It files Form 1065 and sends each member a K-1; members pay tax on their share.</li>
<li><strong>Corporation:</strong> a C corporation. It files Form 1120 and pays ${corp}, and dividends are taxed again on the shareholders' returns.</li>
</ul>
<p>Each default can be changed. An LLC can file Form 8832 to be classified as a corporation, or Form 2553 to be taxed as an S corporation without filing Form 8832 first. A corporation can file Form 2553 to become an S corporation if it meets the tests: ${P.scorp.maxShareholders} shareholders at most, one class of stock, only eligible owners (${h.src('i2553', 'Instructions for Form 2553')}). A corporation cannot become an LLC for tax purposes; that would take a change of legal form under state law.</p>
<h2>Four tax outcomes on the same profit</h2>
<p>Because an LLC can choose its tax status, comparing "LLC vs corporation" really means comparing four tax treatments. The table uses a single owner, no state tax, a salary at 45% of profit for both kinds of corporation, and ${K.usd(ADMIN)} of yearly payroll and filing costs for the S corp only.</p>
${h.table(['Profit', 'Default LLC', 'S corp', 'C corp, all paid out', 'C corp, all kept'], rows.map((x) => [K.usd(x.p), K.usd(x.llc), K.usd(x.s), K.usd(x.cOut), K.usd(x.cKept)]), 'Federal income, self-employment, payroll, corporate and dividend taxes, 2026 rules.', ['r', 'r', 'r', 'r', 'r'])}
<p>At ${K.usd(80000)}, the lowest bill among the three that pay out their profit belongs to ${lowest(rows[0])}; at ${K.usd(140000)} and ${K.usd(250000)}, to ${lowest(rows[1])} and ${lowest(rows[2])}. The C corp that keeps its profit looks competitive in the last column, but that tax is postponed rather than saved, as the ${h.a('c-corporation', 'C corporation guide')} explains. Payroll costs for the C corp and state taxes for every option are left out here; the calculator above adds your state.</p>
${h.mini('scorpQuick', { p: 140000, w: 63000 })}
<h2>Which differences matter in practice</h2>
<p>For a freelancer or a small business owned by the people who work in it, the LLC is usually the simpler starting point: fewer formalities, pass-through taxation, and the option to elect S status later when profit justifies payroll. The ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} shows when that point comes. A corporation makes more sense from the start when the business will issue shares to investors, give stock to employees, or keep most of its profit to grow, and when the founders want the governance and share structure that buyers and funds expect.</p>
<p>Liability does not decide the question in most cases, since both forms offer it on the same terms in ordinary business debts. Its limits come from state law and from how the business is actually run, and they are the same kind of question for both forms; a lawyer in your state is the right person for that part. For the full map of choices, including partnerships and the plain sole proprietorship, see the ${h.a('business-structure', 'business structure guide')}.</p>`,
  faqs: [
    { q: 'Is a limited liability company the same as a limited liability corporation?', a: '"Limited liability corporation" is a common misnomer. The entity is a limited liability company, formed under a state LLC statute by filing articles of organization, and it is not a corporation. It can, however, choose to be taxed as one by filing Form 8832 for C corporation treatment or Form 2553 for S corporation treatment with the IRS.' },
    { q: 'Can an LLC be taxed as a C corporation?', a: `Yes. An LLC can file Form 8832, Entity Classification Election, to be classified as a corporation. It then files Form 1120, pays the ${corp} corporate tax and its distributions to members are taxed as dividends. The election generally cannot take effect more than 75 days before it is filed or more than 12 months after (IRS, LLC page).` },
    { q: 'Does an LLC or a corporation pay less tax at $140,000 of profit?', a: `It depends on the tax status, not the legal form. For a single owner with no state tax, the default LLC pays ${K.usd(mid.llc)}, an S corp with a ${K.usd(140000 * SHARE)} salary and ${K.usd(ADMIN)} of costs ${K.usd(mid.s)}, and a C corp paying out all profit ${K.usd(mid.cOut)} in 2026. An LLC can take either corporate status by election.` },
    { q: 'Do LLC members own shares like corporate shareholders?', a: 'Not in the same form. LLC members hold membership interests whose rights to profits, losses and votes are set by the operating agreement, and the split can differ from capital contributed. Corporate shareholders hold stock with the rights attached to each class. An LLC taxed as an S corp must keep economic rights identical across members, like a single class of stock.' },
  ],
  related: ['business-structure', 'llc-vs-s-corp', 'c-corporation', 'c-corp-vs-s-corp', 'sole-proprietorship-vs-llc', 'llc-cost'],
  sources: ['llc', 'corporation', 'structures', 'i2553', 'usc_11', 'rp_2025_32'],
});
