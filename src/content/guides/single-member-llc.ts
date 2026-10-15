import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const levels = [60000, 100000, 200000];
const rows = levels.map((p) => ({ p, s: K.se(p) }));
const ex = K.solo({ profit: 100000, filing: 'single' });
const exSe = rows[1].s;

export default defineGuide({
  id: 'single-member-llc',
  group: 'structure',
  order: 13,
  slug: 'single-member-llc',
  nav: 'Single-member LLC',
  card: 'Disregarded entity: Schedule C, SE tax, EIN and W-9 for a one-owner LLC',
  title: 'Single Member LLC 2026: Taxes, EIN, W-9 and Schedule C',
  description: `Single member LLC taxes in 2026: a disregarded entity on Schedule C, with ${K.usd(exSe.total)} of SE tax on ${K.usd(100000)} of profit. When you need an EIN and what goes on a W-9.`,
  h1: 'Single-member LLC: how a one-owner LLC is taxed in 2026',
  intro: 'For income tax the IRS looks through a one-owner LLC to the person who owns it. Enter your profit and state to see what that person owes.',
  resume: `A single-member LLC is a "disregarded entity": unless it elects to be taxed as a corporation, the IRS treats its income as the owner's own, reported on Schedule C of Form 1040 (or Schedule E or F for rental or farm activity). It files no federal income tax return of its own. The owner pays self-employment tax on the profit in the same manner as a sole proprietor: on ${K.usd(100000)} of profit in 2026, that is ${K.usd(exSe.total)}, half of it deductible, plus income tax at the owner's brackets, ${K.usd(ex.incomeTax)} for a single filer with no other income. The LLC is still a separate entity for employment taxes and certain excise taxes, so it needs its own EIN once it has employees. Without employees or excise taxes, an EIN is optional, and on a Form W-9 the owner gives their own SSN or EIN, not the LLC's. The owner is not an employee of the LLC and takes draws, not a salary.`,
  tool: 'llc-tax',
  body: (h) => `<p>The phrase "disregarded entity" sounds like the LLC does not count. It counts in state law, where it owns property, signs contracts and protects its owner from its debts. It is ignored only for federal income tax, and only by default: the ${h.src('smllc', 'IRS page on single-member LLCs')} explains that a one-member LLC that does not elect corporate treatment has its activities reflected on its owner's return. For an individual owner in business, that means Schedule C, the same form a sole proprietor uses, from gross receipts down to net profit, as computed here.</p>
${h.mini('schedC')}
<h2>Where the income goes</h2>
<p>The IRS names three schedules for an individual owner: Schedule C for a trade or business, Schedule E for rental real estate and other supplemental income, and Schedule F for farming. A one-member LLC that holds a rental property reports on Schedule E; one that sells design services reports on Schedule C. When the owner is a corporation or a partnership rather than a person, the LLC appears on that owner's return as a division.</p>
<p>Because the LLC and its owner are one taxpayer, money moved between them is not income or expense. Transferring profit from the LLC's account to your personal account is a draw, not a deductible salary, and the tax is computed on the net profit whether you withdraw it or leave it in the business. The same logic applies to money you put in: paying a business expense from your personal card is still a business expense of the LLC, deductible on Schedule C, although a separate account makes the records far easier to defend and helps keep the LLC's liability shield intact under state law.</p>
<h2>Self-employment tax on the owner</h2>
<p>An individual who owns a single-member LLC running a trade or business owes self-employment tax in the same manner as a sole proprietor. Schedule SE applies it to ${K.dec(P.se.factor * 100, 2)}% of net profit: ${K.rate(P.se.ssRate)} for Social Security up to the ${K.usd(P.se.wageBase['2026'])} wage base of 2026, ${K.rate(P.se.medicareRate)} for Medicare without a cap, and nothing at all below ${K.usd(P.se.minimumNet)} of net earnings (${h.src('i1040sse', 'Schedule SE instructions')}).</p>
${h.table(['Net profit', 'Taxed amount', 'Social Security part', 'Medicare part', 'SE tax', 'Deductible half'], rows.map(({ p, s }) => [K.usd(p), K.usd(s.netEarnings), K.usd(s.ss), K.usd(s.medicare), K.usd(s.total), K.usd(s.half)]), 'Self-employment tax, 2026, no W-2 wages from another job.', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The Social Security part stops growing once the taxed amount reaches the wage base, which is why the tax on ${K.usd(200000)} is less than twice the tax on ${K.usd(100000)}. Wages from another job count toward the same base first. The ${h.a('self-employment-tax-rate', 'self-employment tax page')} covers the details.</p>
<h2>EIN or Social Security number</h2>
<p>A one-member LLC needs its own employer identification number in two situations: it has employees, or it must file certain excise tax returns. For wages paid after January 1, 2009, the IRS requires the LLC to use its own name and EIN to report and pay employment taxes, even though it is disregarded for income tax. Without employees or excise taxes, the LLC does not need an EIN and uses its owner's name and taxpayer number for federal tax. It can still get one if a bank requires it to open an account or a state requires it, which is common.</p>
<h3>What goes on a Form W-9</h3>
<p>Clients who pay you will ask for a Form W-9 so they can send a ${h.a('1099-forms', '1099')}. The IRS is specific: for a disregarded LLC owned by an individual, the W-9 shows the owner's Social Security number or EIN, not the LLC's EIN, because the income belongs on the owner's return. Giving the LLC's EIN creates a mismatch between the 1099 and the Schedule C. The client's threshold for sending a 1099-NEC is checked below.</p>
${h.mini('necCheck')}
<h2>Spouses, community property and a second member</h2>
<p>When a spouse becomes co-owner, the LLC normally has two members and becomes a partnership that files Form 1065. The IRS adds that an LLC owned by a married couple in a state without community property should file as a partnership, and that it cannot use the qualified joint venture election, which is reserved for businesses not organized as state-law entities. In community property states the rule is softer: under Rev. Proc. 2002-69, a couple who own the LLC as community property can treat it either as a disregarded entity or as a partnership, and a later change of position is treated as a conversion. The ${h.a('llc-taxes', 'LLC taxes guide')} covers what a two-member LLC files.</p>
<h2>When a single-member LLC stops being disregarded</h2>
<p>The default ends when the LLC elects corporate treatment. The usual reason for a one-owner business is the S election on Form 2553, which turns the owner into an employee paid through payroll and the remaining profit into K-1 income without self-employment tax; the ${h.a('llc-taxed-as-s-corp', 'S election guide')} explains the filing. From that point the LLC files Form 1120-S, the W-9 shows the LLC's EIN, and Schedule C is no longer used for this business.</p>`,
  faqs: [
    { q: 'Does a single-member LLC need an EIN?', a: 'Only if it has employees or must file certain excise tax returns, according to the IRS. Without them, the LLC uses its owner\'s name and taxpayer number for federal tax. It may still obtain an EIN when a bank asks for one to open a business account or when state law requires it, which many owners do anyway.' },
    { q: 'Which tax ID goes on a W-9 for a single-member LLC?', a: 'The owner\'s, not the LLC\'s. For a disregarded LLC owned by an individual, the IRS says the W-9 should show the owner\'s Social Security number or EIN, because the income is reported on the owner\'s return. The LLC\'s own EIN is for payroll and excise taxes, and for the W-9 only once the LLC has elected corporate treatment.' },
    { q: 'Can I pay myself a salary from a single-member LLC?', a: 'Not as a W-2 employee while the LLC is disregarded: the owner and the business are one taxpayer, so money you take out is a draw and is not deductible. Tax is due on the full net profit through Schedule C and Schedule SE. A real salary through payroll requires electing S or C corporation status first.' },
    { q: 'What happens to my single-member LLC if my spouse joins it?', a: 'It usually becomes a two-member LLC taxed as a partnership, filing Form 1065 with a K-1 for each spouse. In a community property state, spouses who own it as community property may keep treating it as disregarded under Rev. Proc. 2002-69. A married couple\'s LLC cannot elect qualified joint venture treatment, the IRS notes.' },
    { q: 'Does a single-member LLC file its own federal tax return?', a: `Not for income tax, unless it elects to be taxed as a corporation. Its income and expenses go on the owner's Form 1040, usually on Schedule C, due ${K.day('2027-04-15')} for 2026. If the LLC has employees, it does file payroll returns such as Form 941 in its own name and with its own EIN.` },
  ],
  related: ['llc-taxes', 'sole-proprietorship-vs-llc', 'llc-taxed-as-s-corp', 'schedule-c', 'self-employment-tax-rate', '1099-forms'],
  sources: ['smllc', 'llc', 'i1040sse', 'i1040sc', 'p334', 'rp_2025_32'],
});
