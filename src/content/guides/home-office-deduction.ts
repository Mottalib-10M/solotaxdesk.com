import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const H = P.homeOffice;
const maxSimple = H.simplifiedRate * H.simplifiedMaxSqft;
const cases: Array<[number, number, number]> = [[100, 1200, 24000], [200, 1500, 30000], [300, 2000, 36000], [450, 2400, 42000]];
const rows = cases.map(([o, home, costs]) => {
  const r = K.homeOffice(o, home, costs);
  return [`${o} of ${K.num(home)} sq ft`, K.usd(costs), K.usd(r.simplified), K.usd(r.regular), r.best === 'regular' ? 'Regular' : 'Simplified'];
});
const ex = K.homeOffice(200, 1500, 30000);
const base = K.solo({ profit: 80000, filing: 'single' });
const afterReg = K.solo({ profit: 80000 - ex.regular, filing: 'single' });
const afterSim = K.solo({ profit: 80000 - ex.simplified, filing: 'single' });

export default defineGuide({
  id: 'home-office-deduction',
  group: 'tax',
  order: 16,
  slug: 'home-office-deduction',
  nav: 'Home office deduction',
  card: 'Exclusive use, the $5 method and Form 8829 compared',
  title: 'Home Office Deduction 2026: Simplified $5 vs Form 8829',
  description: `Home office deduction for 2026: the exclusive and regular use tests, the simplified $${H.simplifiedRate} a square foot capped at ${K.usd(maxSimple)}, Form 8829 and depreciation recapture.`,
  h1: 'Home office deduction for the self-employed in 2026',
  intro: 'A room you work in can lower both your income tax and your self-employment tax, provided it passes the tests and you pick the better of two methods.',
  resume: `Self-employed people can deduct the business part of their home when a specific area is used exclusively and regularly as the principal place of business, or to meet clients, with exceptions for inventory storage and daycare. There are two ways to compute it. The simplified method multiplies the office area by $${H.simplifiedRate}, with at most ${H.simplifiedMaxSqft} square feet, so the deduction tops out at ${K.usd(maxSimple)}; it needs no expense records and no depreciation. The regular method, on Form 8829, takes the office's share of rent or mortgage interest, utilities, insurance and repairs, plus depreciation if you own. For a ${K.num(200)} square foot office in a ${K.num(1500)} square foot home with ${K.usd(30000)} of yearly costs, the simplified method gives ${K.usd(ex.simplified)} and the regular method ${K.usd(ex.regular)}. Either way the amount goes on Schedule C, line 30, reduces SE tax as well as income tax, and cannot exceed the profit the business earns from that home office.`,
  tool: 'home-office',
  body: (h) => `<p>Enter the office area, the size of the whole home, what the home costs you in a year and your profit before the deduction. The calculator figures both methods, keeps the larger, and estimates the federal tax it saves for a single filer. The regular figure leaves out depreciation, which raises the deduction for owners but comes back as taxable gain when the home is sold, as explained below.</p>
${h.mini('dedValue')}
<h2>The tests the space has to pass</h2>
<p>Under ${h.src('p587', 'Publication 587')}, part of a home qualifies when it is used exclusively and regularly as your principal place of business, or exclusively and regularly to meet or deal with clients, patients or customers. A detached structure such as a studio in the garden qualifies when used in connection with the business. Storage of inventory or product samples and a home daycare qualify under softer rules.</p>
<h3>Exclusive means nothing else happens there</h3>
<p>The area must serve the business only. It can be a room or a clearly identifiable part of one, and it does not need a wall around it, but a corner that also serves as the family's television space fails. The two exceptions are inventory storage, when your home is the only fixed location of a retail or wholesale business, and daycare. Everything else that mixes personal use is out.</p>
<h3>Regular, and for a real business</h3>
<p>Occasional or incidental use is not enough; the IRS weighs the facts. The use must also be for a trade or business. Managing your own investments from a spare room is not a business, however often you do it. Whether you are in business at all, rather than working as someone's employee, is the question taken up on the ${h.a('1099-vs-w2', '1099 vs W-2 page')}.</p>
<h3>Principal place of business</h3>
<p>A home office can be your principal place of business even if you do client work elsewhere, when you use it for administrative or management tasks and have no other fixed location where you do much of that work. Think of a plumber who invoices, orders parts and keeps the books at home while doing the repairs at customers' addresses. Once it qualifies, trips from home to clients become deductible business travel rather than commuting.</p>
<h2>Simplified method or Form 8829</h2>
${h.table(['Office', 'Home costs per year', 'Simplified', 'Regular, before depreciation', 'Larger'], rows, `Both methods for 2026; simplified capped at ${H.simplifiedMaxSqft} sq ft`, ['l', 'r', 'r', 'r', 'l'])}
<p>The simplified method suits renters with cheap housing, small offices and anyone who wants no paperwork: $${H.simplifiedRate} times the area, up to ${H.simplifiedMaxSqft} square feet (${h.src('home_office', 'IRS simplified option')}). Mortgage interest and property taxes then stay where they would have been, on Schedule A if you itemize. You cannot carry forward a disallowed amount into a simplified year, and only one home can use the method in a year. You choose each year on a timely original return; switching back and forth is allowed.</p>
<p>The regular method splits real costs by the business percentage, usually the office's floor area over the home's. Rent, utilities, insurance, repairs and, for owners, mortgage interest, property taxes and depreciation all count. In the example of ${K.num(200)} square feet out of ${K.num(1500)}, the share is ${K.rate(ex.share)}, and ${K.usd(30000)} of costs becomes ${K.usd(ex.regular)}. For a single filer with ${K.usd(80000)} of profit, that cuts federal income and SE tax by ${K.usd(base.federalTotal - afterReg.federalTotal)}, against ${K.usd(base.federalTotal - afterSim.federalTotal)} with the simplified method. If you start partway through the year, only the months of business use count.</p>
<h2>The gross income limit</h2>
<p>The deduction cannot create a loss. Under the regular method, the business income earned from the home pays first for the business part of expenses you could deduct anyway, such as mortgage interest and taxes, then for business costs unrelated to the home, and only what is left absorbs utilities, insurance and repairs, with depreciation last. The excess carries over to the next year in which you use actual expenses. The simplified method applies the same ceiling in its own way: the deduction is the smaller of the square-foot amount and the income from the home office minus business expenses unrelated to the home.</p>
<h2>Depreciation and selling the home</h2>
<p>Owners using Form 8829 depreciate the office part of the house, excluding land, as nonresidential real property over ${h.src('p587', '39 years')} on a straight line. The catch comes at sale. The gain exclusion on a main home does not cover the part of the gain equal to depreciation allowed or allowable after ${h.src('p587', 'May 6, 1997')}, and the basis must be reduced by depreciation you could have taken even if you skipped it. A simplified year counts as zero depreciation. An office inside the home does not otherwise require splitting the sale into two properties; a separate structure can.</p>
<h2>Where it goes on the return</h2>
<p>The deduction lands on ${h.a('schedule-c', 'Schedule C')}, line 30, after all other expenses, so it lowers the profit that feeds both ${h.a('schedule-se', 'Schedule SE')} and income tax. With Form 8829, the amount on its line 36 is what you carry over. Other home-related costs that are purely business, like a dedicated phone line or office supplies, are ordinary expenses and are deductible with either method; the ${h.a('self-employed-tax-deductions', 'deductions guide')} lists them.</p>`,
  faqs: [
    { q: 'Can I take the home office deduction if I rent my apartment?', a: `Yes. Renters use the office's share of rent, renter's insurance and utilities on Form 8829, or the simplified $${H.simplifiedRate} a square foot. Depreciation and its recapture concern owners only, which makes the regular method simpler for tenants. The space still has to be used regularly and only for the business.` },
    { q: 'Does a desk in the corner of my bedroom count as a home office?', a: 'It can, if that part of the room is a separately identifiable area used only for work and on a regular basis. It does not need a partition. If the same desk also serves for personal browsing, homework or guests, the exclusive use test fails, and the IRS gives no partial credit for mixed use outside storage and daycare.' },
    { q: 'What is the most I can deduct with the simplified home office method?', a: `${K.usd(maxSimple)} a year: $${H.simplifiedRate} times at most ${H.simplifiedMaxSqft} square feet. If the business earns less from the home than that after its other expenses, the deduction is cut to that income. Larger offices or expensive homes usually do better with Form 8829.` },
    { q: 'Do I pay tax on home office depreciation when I sell my house?', a: 'Often yes. Depreciation allowed or allowable on the office after May 6, 1997 cannot be excluded from the gain on selling a main home, according to Publication 587. The basis is reduced even for depreciation you did not claim. Years under the simplified method count as zero depreciation, so they add nothing to recapture.' },
    { q: 'Can I switch between the simplified and regular methods each year?', a: 'Yes. You choose the method each tax year on a timely filed original return, and the change is not a change in accounting method. If you return to Form 8829 after a simplified year, depreciation uses the optional MACRS tables. A carryover from a regular year waits until the next regular year.' },
  ],
  related: ['schedule-c', 'self-employed-tax-deductions', 'mileage-deduction', '1099-tax-calculator'],
  sources: ['p587', 'home_office', 'home_office_main', 'i1040sc'],
});
