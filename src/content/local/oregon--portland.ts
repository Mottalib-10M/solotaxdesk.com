import { defineLocal } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const or = K.st('oregon');
const find = (slug: string) => { const l = or.local.find((x) => x.slug === slug); if (!l) throw new Error(slug); return l; };
const blt = find('city-of-portland-business-license-tax-blt');
const bit = find('multnomah-county-business-income-tax-mcbit');
const shs = find('metro-portland-region-parts-of-clackamas-multnomah-washingto');
const pfa = find('multnomah-county-preschool-for-all-pfa-personal-income-tax');
const trimet = find('trimet-district-portland-area-trimet-transit-self-employment');
/** Read on portland.gov, 2026-10-15 (research/states/oregon.json). */
const PERSONAL = 'https://www.portland.gov/revenue/personal-tax';

export default defineLocal({
  state: 'oregon',
  place: 'portland',
  tax: 'city-of-portland-business-license-tax-blt',
  name: 'Portland',
  title: 'Portland Business License Tax 2026: BLT, MCBIT and Metro',
  description: `Portland Business License Tax 2026: ${blt.rateText} of net business income, exempt under $75,000 of gross receipts, plus Multnomah County's ${bit.rateText} and Metro and PFA taxes.`,
  h1: 'Portland business taxes for the self-employed in 2026',
  intro: 'A Portland freelancer can owe five local taxes on top of Oregon\'s income tax; most of them start only above a threshold.',
  resume: `Portland has one of the thickest layers of local tax on self-employment income in this survey, but thresholds keep the smallest businesses out of most of them. The City of Portland's Business License Tax (BLT) is ${blt.rateText} of net business income, and for tax years beginning in 2026 a business whose gross receipts from all activity are under $75,000 is exempt ($50,000 before 2026, $100,000 from 2027). Multnomah County's Business Income Tax adds ${bit.rateText}, with an exemption under $100,000 of gross receipts. Both let the owner deduct compensation for their own work, up to 75% of net business income within a yearly cap. On the personal side, the Metro Supportive Housing Services tax is ${shs.rateText} of income above $128,000 for a single filer in 2026, and Multnomah County's Preschool for All tax starts at ${pfa.rateText} above $125,000. TriMet also taxes self-employment earnings in its district. The calculator above shows federal and Oregon tax; these local layers are explained below.`,
  body: (h) => `<p>Portland's Revenue Division administers both business taxes, which is why freelancers often think of them as one tax (${h.ext(blt.url, 'Portland Revenue Division, business tax')}). They are two: the city's BLT at ${blt.rateText} and the county's MCBIT at ${bit.rateText}, each applied to net business income, each with its own gross receipts exemption. A sole proprietor or a single-member LLC files at the owner's level.</p>
${h.mini('stateQuick', { s: 'oregon', p: 90000 })}
<h2>The exemptions that matter for a one-person business</h2>
<p>The BLT exemption looks at gross receipts from all business activity everywhere, not only in Portland. It rises in steps: under $50,000 before 2026, under $75,000 for tax years beginning in 2026, and under $100,000 from 2027. The county exempts businesses with gross receipts under $100,000. A freelance designer billing $80,000 in 2026 would therefore be above the city threshold and below the county one.</p>
<p>Once inside, the owner's compensation deduction does much of the work. Both taxes allow a deduction for the owner's work of up to 75% of net business income, subject to a per-owner dollar cap that the city sets each tax year. With the full 75% available, the tax applies to a quarter of the profit, which turns the headline rates into a far smaller share of what the business earns.</p>
<h2>The personal taxes on higher incomes</h2>
<p>Two regional taxes look at the person rather than the business, and they start at incomes most freelancers do not reach. The Metro Supportive Housing Services personal income tax is ${shs.rateText} of Metro taxable income above $128,000 for single filers and $205,000 for joint filers in 2026, thresholds that are now indexed to inflation. Sole proprietors and disregarded LLCs pay this personal tax instead of Metro's business version, which only reaches businesses with more than $5,000,000 of receipts (${h.ext(PERSONAL, 'Portland Revenue Division, personal tax')}).</p>
<p>The Multnomah County Preschool for All tax is ${pfa.rateText} above $125,000 for single filers or $200,000 for joint filers, with an additional 1.5% above $250,000 or $400,000. Its thresholds are not indexed, and a scheduled 0.8% increase is now set for 2028.</p>
<h3>TriMet and the Arts Tax</h3>
<p>Self-employment earnings from business carried on inside the TriMet district are subject to the TriMet transit tax, filed with the Oregon Department of Revenue on Form OR-TM; the current rate is posted by TriMet (${h.ext(trimet.url, 'TriMet tax information')}). Portland residents also owe the city's flat per-person Arts Tax, whose amount is set by the city.</p>
<p>One state tax is often mistaken for a corporate-only charge: Oregon's Corporate Activity Tax reaches every type of business, LLCs and sole proprietors included, but only above $1 million of Oregon commercial activity, so it leaves almost every freelancer untouched (${h.ext('https://www.oregon.gov/dor/programs/businesses/Pages/corporate-activity-tax.aspx', 'Oregon DOR, CAT')}).</p>
<p>The state layer, Oregon's graduated income tax, is on the ${h.a('state:oregon', 'Oregon page')}. How Portland compares with other cities that tax business profit is in the ${h.a('local-business-taxes', 'local business taxes guide')}, and the ${h.a('how-much-to-set-aside', 'set-aside calculator')} helps budget the quarterly payments.</p>`,
  faqs: [
    { q: 'Does a Portland freelancer under $75,000 of gross receipts owe the BLT in 2026?', a: `No. For tax years beginning in 2026, a business whose gross receipts from all business activity are under $75,000 is exempt from the City of Portland Business License Tax. The line was $50,000 before 2026 and rises to $100,000 from 2027. Above it, the tax is ${blt.rateText} of net business income after the owner's compensation deduction.` },
    { q: 'Do Portland sole proprietors pay the Metro SHS business tax?', a: `No. Sole proprietors and disregarded entities are exempt from the Metro Supportive Housing Services business income tax, which only applies above $5,000,000 of gross receipts. They pay the SHS personal income tax instead, at ${shs.rateText} of Metro taxable income above $128,000 for single filers or $205,000 for joint filers in 2026.` },
    { q: 'When does the Preschool for All tax apply to Portland residents?', a: `When Multnomah County taxable income exceeds $125,000 for a single filer or $200,000 for joint filers. The rate is ${pfa.rateText} above those amounts, plus another 1.5% above $250,000 or $400,000. The thresholds are not adjusted for inflation, and a 0.8% rate increase is scheduled for 2028 rather than 2026.` },
  ],
  related: ['local-business-taxes', 'state:oregon', 'how-much-to-set-aside', 'state-income-tax'],
});
