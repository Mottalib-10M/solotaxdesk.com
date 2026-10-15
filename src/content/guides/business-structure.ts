import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const PROFIT = 100000;
const I1065 = 'https://www.irs.gov/pub/irs-pdf/i1065.pdf';
const I1120 = 'https://www.irs.gov/pub/irs-pdf/i1120.pdf';
const solo = K.solo({ profit: PROFIT, filing: 'single' });
const partner = K.solo({ profit: PROFIT / 2, filing: 'single' });
const sc = K.scorp({ profit: PROFIT, salary: PROFIT * 0.45, filing: 'single', adminCost: 2000 });
const cc = K.ccorp({ profit: PROFIT, salary: PROFIT * 0.45, filing: 'single', payout: 1 });
const corp = K.rate(P.corporate.rate);
const d = { m15: K.day('2027-03-15'), a15: K.day('2027-04-15') };

export default defineGuide({
  id: 'business-structure',
  group: 'structure',
  order: 10,
  slug: 'business-structure',
  nav: 'Business structures',
  card: 'Sole proprietorship, partnership, LLC, S corp, C corp: forms and taxes',
  title: 'Business Structure 2026: Entity Types, Tax Forms, Due Dates',
  description: `Business structure types in 2026: sole proprietorship, partnership, LLC, S corp, C corp, with each federal return, due date and the tax on ${K.usd(PROFIT)} of profit.`,
  h1: 'Business structures: the five types of business ownership and their taxes',
  intro: 'Five structures cover almost every small business in the United States. Each one sets which federal return you file and how the profit is taxed.',
  resume: `The IRS lists five common business structures: sole proprietorship, partnership, LLC, S corporation and C corporation. The first two exist as soon as you do business, alone or with others; an LLC or a corporation is created by a filing with the state. Each structure decides the federal return. A sole proprietor or one-member LLC reports profit on Schedule C of Form 1040, due ${d.a15} for 2026, and pays self-employment tax. A partnership or LLC with several members files Form 1065 by ${d.m15} and gives each partner a K-1. An S corporation files Form 1120-S by ${d.m15}, puts working owners on payroll and passes the rest of the profit through. A C corporation files Form 1120 by ${d.a15} and pays ${corp} itself. On ${K.usd(PROFIT)} of profit, a single owner pays ${K.usd(solo.total)} of federal tax as a sole proprietor, ${K.usd(sc.total)} as an S corp with a ${K.usd(PROFIT * 0.45)} salary and ${K.usd(cc.total)} as a C corp paying everything out.`,
  tool: 'compare',
  body: (h) => `<p>The choice of structure is partly a legal question and partly a tax question, and the ${h.src('structures', 'IRS page on business structures')} says so in nearly those words: legal and tax considerations both enter into it, and the form of the business determines which income tax return it files. A person who starts invoicing clients without registering anything is already a sole proprietor, the default for one owner. Everything else is a step away from that default, so it helps to know what the default costs first.</p>
${h.mini('total1099', { p: PROFIT })}
<h2>The five structures in brief</h2>
<h3>Sole proprietorship</h3>
<p>One person owns the business and is the business. There is no separate entity and no state filing to create it, though a trade name, a license or a sales tax permit may still be required locally. Profit goes on Schedule C, and self-employment tax of ${K.rate(P.se.ssRate + P.se.medicareRate)} applies to ${K.dec(P.se.factor * 100, 2)}% of it. The owner is personally liable for the debts of the business.</p>
<h3>Partnership</h3>
<p>Two or more people who carry on a business together and share its profits are partners, whether or not they signed an agreement (${h.src('partnerships', 'IRS, partnerships')}). A general partnership needs no state filing either. The partnership files an information return but pays no income tax; each partner reports a share. General partners pay self-employment tax on their share and are personally liable. Limited partnerships and limited liability partnerships are variants registered with the state, compared on the ${h.a('llc-vs-partnership', 'LLC vs partnership page')}.</p>
<h3>Limited liability company</h3>
<p>An LLC is formed under a state statute and protects its members from the company's debts. For federal tax it has no category of its own: the IRS treats it as a disregarded entity with one member, a partnership with two or more, or a corporation if it elects (${h.src('llc', 'IRS, LLC')}). With one member and no election, its taxes are the same as a sole proprietor's, a point developed in ${h.a('sole-proprietorship-vs-llc', 'sole proprietorship vs LLC')}.</p>
<h3>S corporation</h3>
<p>Not a separate entity type but a tax status that a corporation or an LLC elects on Form 2553. Profit passes through to the owners, who must be paid a reasonable salary through payroll if they work in the business. Only distributions above that salary escape payroll tax. Eligibility is limited to ${P.scorp.maxShareholders} shareholders, one class of stock and eligible owners.</p>
<h3>C corporation</h3>
<p>The default tax status of a corporation. It pays ${corp} on its profit, and dividends are taxed again when paid out (${h.src('corporation', 'IRS, forming a corporation')}). Any number and type of shareholders, several classes of stock. Losses stay inside the company. It is the usual vehicle for a business that plans to raise money from investors or keep most of its profit to grow, and the least common choice for a solo freelancer, who would pay the corporate tax and then the dividend tax on the same income.</p>
<h2>Federal forms and taxes by structure</h2>
${h.table(['Structure', 'Federal return', 'Due for 2026 (calendar year)', 'Taxes on the owner\'s share', `Tax on ${K.usd(PROFIT)}`], [
  ['Sole proprietorship', 'Schedule C and SE on Form 1040', d.a15, 'Income tax + self-employment tax', K.usd(solo.total)],
  ['Single-member LLC (default)', 'Schedule C and SE on Form 1040', d.a15, 'Income tax + self-employment tax', K.usd(solo.total)],
  ['Partnership or multi-member LLC', 'Form 1065, K-1 to each partner', d.m15, 'Income tax + self-employment tax for general partners', `${K.usd(partner.total)} each (two equal partners)`],
  ['S corporation', 'Form 1120-S, K-1, payroll forms', d.m15, 'Payroll tax on salary, income tax on all', K.usd(sc.total)],
  ['C corporation', 'Form 1120, payroll forms', d.a15, 'Corporate tax, then payroll and dividend tax', K.usd(cc.total)],
], `Single filers, no state tax, 2026 rules. S and C corp: salary at 45% of profit; S corp with ${K.usd(2000)} of payroll and filing costs; C corp pays all profit out.`, ['l', 'l', 'l', 'l', 'r'])}
<p>The due dates come from the IRS instructions: the 15th day of the 4th month after the year ends for Form 1040 (${h.src('p334', 'Publication 334')}) and for Form 1120 (${h.ext(I1120, 'Instructions for Form 1120')}), and the 15th day of the 3rd month for Form 1065 (${h.ext(I1065, 'Instructions for Form 1065')}) and Form 1120-S. Pass-through returns come first because their owners need the K-1 to file their own. When a date falls on a weekend or a legal holiday, the next business day counts.</p>
<h2>What the comparison table does not show</h2>
<p>The partnership figure is per partner on half the profit, so it is not directly comparable with the one-owner rows; two partners together pay ${K.usd(partner.total * 2)} on the same ${K.usd(PROFIT)}, ${partner.total * 2 < solo.total ? 'less than' : 'more than'} a single owner, because each half of the profit starts again at the bottom of its owner's brackets. Payroll costs are left out for the C corp. State taxes are left out for all, and they can change the order: some states charge LLCs or S corporations an annual tax that the sole proprietor never pays. The calculator above includes the state and compares the four one-owner options at once.</p>
${h.mini('doubleTax')}
<h2>Changing structure later</h2>
<p>Most owners do not pick a structure for life. A sole proprietor can form an LLC at any time and keep the same federal tax treatment. An LLC can elect S status once profit justifies payroll, by filing Form 2553 within ${P.scorp.electionMonths} months and ${P.scorp.electionDays} days of the start of the year; the ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} shows when. A classification election on Form 8832 generally cannot take effect more than 75 days before it is filed or more than 12 months after. Moving from a corporation back to an LLC, on the other hand, is a reorganization with possible tax costs, which deserves a CPA's review before it happens. The ${h.a('c-corporation', 'C corporation guide')} covers the case where investors make a corporation the only practical choice.</p>`,
  faqs: [
    { q: 'What are the main types of business ownership in the US?', a: 'The IRS lists five: the sole proprietorship (one owner, no entity), the partnership (two or more owners sharing profits), the limited liability company (a state-law entity taxed as a sole proprietorship, partnership or corporation), the S corporation (a tax status that passes profit through) and the C corporation (a separate taxpayer paying the corporate rate).' },
    { q: 'Which business structure pays the least tax?', a: `None in every case. On ${K.usd(PROFIT)} of profit, a single owner without state tax pays ${K.usd(solo.total)} as a sole proprietor or default LLC, ${K.usd(sc.total)} as an S corp with a 45% salary and ${K.usd(2000)} of costs, and ${K.usd(cc.total)} as a C corp paying out everything in 2026. Profit level, salary and state change the order.` },
    { q: 'Can I change my business structure later?', a: 'Yes, and many owners do. A sole proprietor can form an LLC without changing federal tax, and an LLC can elect S corporation or C corporation status with Form 2553 or Form 8832. A Form 8832 election generally cannot take effect more than 75 days before or 12 months after it is filed (IRS). Leaving a corporation is more complex.' },
    { q: 'Is an S corp a business structure or a tax status?', a: 'A tax status. In state law the business remains a corporation or an LLC; the S status only changes how the IRS taxes its profit, which then passes to the owners instead of being taxed at the corporate rate. That is why the same LLC can be taxed as a sole proprietorship one year and as an S corporation the next.' },
    { q: 'Do I need to register a partnership with the state?', a: 'Not for a general partnership: under federal tax law, two or more people who carry on a business and share its profits are partners whether or not they have a formal agreement, and the partnership must file Form 1065. Limited partnerships, limited liability partnerships and LLCs exist only once registered under the state law that creates them.' },
  ],
  related: ['llc-vs-corporation', 'sole-proprietorship-vs-llc', 'llc-vs-partnership', 'llc-vs-s-corp', 'c-corporation'],
  sources: ['structures', 'llc', 'partnerships', 'corporation', 's_corps', 'p334'],
});
