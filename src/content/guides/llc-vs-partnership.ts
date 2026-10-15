import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const I1065 = 'https://www.irs.gov/pub/irs-pdf/i1065.pdf';
/** Read in the Instructions for Form 1065 (2025), "Late Filing of Return". */
const LATE_1065 = 255;
const SHARE = 80000, GP = 30000;
const general = K.se(SHARE);
const limitedGp = K.se(GP);
const due = K.day('2027-03-15');

export default defineGuide({
  id: 'llc-vs-partnership',
  group: 'structure',
  order: 14,
  slug: 'llc-vs-partnership',
  nav: 'LLC vs partnership',
  card: 'General, limited and LLP partnerships against the LLC: liability and SE tax',
  title: 'LLC vs Partnership 2026: LLP, LP and Self-Employment Tax',
  description: `LLC vs partnership in 2026: general, limited and LLP partners against LLC members, who is liable, Form 1065 due ${due}, SE tax on a ${K.usd(SHARE)} share.`,
  h1: 'LLC vs partnership: liability and taxes for co-owners in 2026',
  intro: 'A two-member LLC and a partnership file the same federal return; they differ in who is liable and, sometimes, in who owes self-employment tax.',
  resume: `For federal income tax, an LLC with two or more members and a partnership are the same thing: unless the LLC elects corporate treatment, both file Form 1065, due ${due} for calendar year 2026, pay no income tax themselves and send each owner a Schedule K-1. The differences are legal. In a general partnership, every partner is personally liable for the partnership's debts. A limited partnership has at least one general partner with that liability and one or more limited partners whose liability stops at what they contributed. In a limited liability partnership, a partner is generally not liable for the firm's debts or for another partner's acts. In an LLC, no member is personally liable for its debts. Self-employment tax follows the role: a general partner with an ${K.usd(SHARE)} share owes ${K.usd(general.total)} in 2026, while a limited partner pays it only on guaranteed payments for services, ${K.usd(limitedGp.total)} on ${K.usd(GP)} of them.`,
  tool: 'llc-tax',
  body: (h) => `<p>A partnership in tax law is wider than most people think. The ${h.ext(I1065, 'Instructions for Form 1065')} define it as the relationship between two or more persons who join to carry on a business, each contributing money, property, labor or skill and expecting to share profits and losses, whether or not they signed an agreement. Two freelancers who split the income of a shared client list may already be one. A general partner's share is self-employment income, and half of that tax is deductible, as estimated below.</p>
${h.mini('seHalf')}
<h2>Four forms of shared ownership</h2>
<p>The same instructions define each variant. The definitions are federal, but the entities themselves are created under state law, and the details of liability come from the state statute.</p>
<h3>General partnership</h3>
<p>Composed only of general partners, each personally liable for the partnership's debts. No state filing is needed to form one. It is the default when people go into business together without creating an entity.</p>
<h3>Limited partnership (LP)</h3>
<p>Formed under a state limited partnership law, with at least one general partner and one or more limited partners. A limited partner's liability for the partnership's debts is limited to the money or property contributed or promised. The general partner runs the business and carries the unlimited liability.</p>
<h3>Limited liability partnership (LLP)</h3>
<p>Formed under a state limited liability partnership law. Generally, a partner in an LLP is not personally liable for the LLP's debts, nor for the acts or omissions of another partner solely by reason of being a partner. Who may register as an LLP, and on what conditions, is set by each state's statute, so read it before choosing this form.</p>
<h3>Limited liability company (LLC)</h3>
<p>Formed by filing articles of organization. Unlike a partnership, none of the members is personally liable for its debts. With two or more members and no election, the IRS classifies it as a partnership (${h.src('llc', 'IRS, LLC')}), so its tax filings are those of a partnership.</p>
<h2>The same federal return for all four</h2>
<p>Every domestic partnership files Form 1065 unless it had no income and no deductible expenses, and LLCs classified as partnerships have the same filing requirements. The return is due by the 15th day of the 3rd month after the tax year, ${due} for calendar 2026. It reports the income, and each partner receives a Schedule K-1 with their share, to be reported on Schedule E of Form 1040 whether or not it was distributed. The ${h.src('partnerships', 'IRS partnerships page')} adds that partners are not employees and should not receive a W-2. Filing late costs ${K.usd(LATE_1065)} per partner for each month or part of a month, for up to 12 months, even if the partnership owes nothing.</p>
<h2>Self-employment tax: where the forms differ</h2>
<p>The real tax difference between these structures sits on Schedule SE. According to the ${h.src('i1040sse', 'Schedule SE instructions')}, a general partner includes the net earnings from self-employment shown in box 14, code A, of the K-1. A limited partner includes only guaranteed payments for services actually rendered to or on behalf of the partnership. Whether someone counts as a limited partner for this purpose depends on section 1402(a)(13) of the Code, not on the label.</p>
${h.table(['Partner', 'Income from the partnership', 'Subject to SE tax', 'SE tax 2026'], [
  ['General partner', `${K.usd(SHARE)} share of profit`, K.usd(SHARE), K.usd(general.total)],
  ['Limited partner, no services', `${K.usd(SHARE)} share of profit`, K.usd(0), K.usd(0)],
  ['Limited partner, paid for services', `${K.usd(GP)} guaranteed payments + share`, K.usd(GP), K.usd(limitedGp.total)],
], `Simplified: SE tax on ${K.dec(P.se.factor * 100, 2)}% of the amount, no W-2 wages elsewhere. Income tax applies to every line.`, ['l', 'l', 'r', 'r'])}
<p>For LLC members, the answer is less settled. The Form 1065 instructions note that some members of LLCs classified as partnerships may be treated as limited partners for certain purposes, but whether a member escapes self-employment tax on a share of profit depends on that member's role and on how section 1402(a)(13) applies to them. A member who works in the business should expect self-employment tax on the share; a passive investor member should ask a CPA. The calculator above treats each active member like a general partner.</p>
<h2>Spouses running a business together</h2>
<p>A married couple who jointly own and operate an unincorporated business and share its profits are partners and must file Form 1065, unless they qualify as a qualified joint venture: both spouses materially participate, they are the only owners and they file a joint return. A QJV lets each spouse report on their own Schedule C and still earn Social Security credit. The election is not available to an LLC, because it is a state-law entity, as the ${h.a('single-member-llc', 'single-member LLC guide')} explains.</p>
${h.mini('total1099', { p: SHARE })}
<h2>Choosing between them</h2>
<p>For two or more people starting a business, the LLC usually gives every owner the protection that only limited partners and LLP partners get in a partnership, with the same tax filing. A general partnership costs nothing to form but leaves each partner answerable for the others' business debts. An LP fits when some owners invest and others manage. An LLP suits partners who want to keep the partnership form while limiting their exposure to each other's acts, where state law allows it. The ${h.a('llc-taxes', 'LLC taxes guide')} shows what each member pays on a given profit, the ${h.a('business-structure', 'business structure overview')} adds the corporate options, and the ${h.a('schedule-se', 'Schedule SE guide')} details the self-employment computation.</p>`,
  faqs: [
    { q: 'Is an LLC with two owners a partnership?', a: 'For federal income tax, yes, by default. The IRS classifies a domestic LLC with at least two members as a partnership unless it files Form 8832 or Form 2553 to be taxed as a corporation. It then files Form 1065 and gives each member a K-1. Under state law it remains an LLC, and its members keep their limited liability.' },
    { q: 'What is the difference between an LLP and an LLC?', a: 'Both limit liability, under different state statutes. In an LLP a partner is generally not liable for the firm\'s debts or another partner\'s acts solely by being a partner; in an LLC, no member is personally liable for its debts. Both file Form 1065 by default when they have two or more owners, and each state\'s statute sets who may form an LLP.' },
    { q: 'Do limited partners pay self-employment tax?', a: 'Only on guaranteed payments for services they actually render to the partnership, according to the Schedule SE instructions. Their share of the profit is not self-employment income. Whether someone is a limited partner for this rule depends on section 1402(a)(13), so an LLC member who works in the business should not assume the exception applies.' },
    { q: 'When is a partnership’s Form 1065 due for 2026?', a: `By ${due} for a calendar-year partnership or multi-member LLC: the 15th day of the 3rd month after the year ends. Form 7004 extends the time to file. A late return costs ${K.usd(LATE_1065)} per partner for each month or part of a month, up to 12 months, even when the partnership owes no tax (Instructions for Form 1065).` },
    { q: 'Can a married couple run a business without filing Form 1065?', a: 'Yes, if they qualify as a qualified joint venture: they are the only owners, both materially participate and they file a joint return. Each spouse then reports a share on their own Schedule C. The election is not open to a business organized as an LLC, and in community property states other options exist (Publication 334).' },
  ],
  related: ['llc-taxes', 'single-member-llc', 'business-structure', 'llc-vs-corporation', 'schedule-se'],
  sources: ['partnerships', 'llc', 'i1040sse', 'p334', 'smllc'],
});
