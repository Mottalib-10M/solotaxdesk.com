import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/** Official pages read on 2026-10-15 (research/states/*.json). */
const FTB_LLC = 'https://www.ftb.ca.gov/file/business/types/limited-liability-company/index.html';
const DE_TAX = 'https://corp.delaware.gov/alt-entitytaxinstructions/';
const KY_LLET = 'https://revenue.ky.gov/Business/Corporation-Income-and-Limited-Liability-Entity-Tax/Pages/default.aspx';
const TX_FRANCHISE = 'https://comptroller.texas.gov/taxes/franchise/';
const NY_FORM = 'https://dos.ny.gov/forming-limited-liability-company-new-york';
const NY_IT204LL = 'https://www.tax.ny.gov/pdf/current_forms/it/it204lli.pdf';
const AK_LICENSE = 'https://www.commerce.alaska.gov/web/portals/5/pub/BusinessLicenseStatutes.pdf';
const WA_LICENSE = 'https://dor.wa.gov/open-business/apply-business-license';

const all = K.states.map((s) => K.st(s.slug));
type S = (typeof all)[number];
const money = (x: number) => (Number.isInteger(x) ? K.usd(x) : K.cents(x));
/** Every recurring fee known: the 5-year total can be computed. */
const complete = (s: S) => s.llc.formation !== null && (s.llc.annual !== null || s.llc.frequency === 'none');
const full = all.filter(complete).sort((a, b) => K.llcCost(a, 5) - K.llcCost(b, 5));
const cheap = full[0], dear = full[full.length - 1];
const formed = all.filter((s) => s.llc.formation !== null).sort((a, b) => (a.llc.formation as number) - (b.llc.formation as number));
const lowForm = formed[0], highForm = formed[formed.length - 1];
const noReport = all.filter((s) => s.llc.frequency === 'none');
const biennial = all.filter((s) => s.llc.frequency === 'biennial');
const missing = all.filter((s) => !complete(s));
const withTax = all.filter((s) => s.llc.minTax > 0);
const yearlyKnown = full.map((s) => s.yearly).sort((a, b) => a - b);
const ca = K.st('california'), de = K.st('delaware'), ri = K.st('rhode-island'), ma = K.st('massachusetts'), ky = K.st('kentucky'), ny = K.st('new-york'), tx = K.st('texas');
const names = (l: S[]) => l.map((s) => s.name).join(', ');

const row = (a: (id: string, text: string) => string, s: S) => [
  a(`state:${s.slug}`, s.name),
  s.llc.formation === null ? 'n/a' : money(s.llc.formation),
  s.llc.frequency === 'none' ? 'none' : s.llc.annual === null ? 'n/a' : `${money(s.llc.annual)} (${s.llc.frequency})`,
  s.llc.minTax > 0 ? money(s.llc.minTax) : 'none',
  complete(s) ? money(K.llcCost(s, 5)) : 'n/a',
];

export default defineGuide({
  id: 'llc-cost',
  group: 'llc',
  order: 1,
  slug: 'llc-cost',
  nav: 'LLC cost by state',
  card: 'Filing fee, annual fees and 5-year state cost in every state',
  title: 'LLC Cost by State 2026: Filing Fees, Annual Fees, Taxes',
  description: `LLC cost by state in 2026: filing fee, annual report, minimum tax and 5-year total for all 50 states and DC, from ${K.usd(K.llcCost(cheap, 5))} in ${cheap.name}. Official fee pages.`,
  h1: 'LLC cost by state in 2026: filing fees, annual fees and taxes',
  intro: 'What a state charges to create an LLC and to keep it alive each year, from the official fee schedules, with the total over the years you choose.',
  resume: `Over its first five years, an LLC costs between ${K.usd(K.llcCost(cheap, 5))} (${cheap.name}) and ${K.usd(K.llcCost(dear, 5))} (${dear.name}) in state fees, among the states whose fees could all be confirmed. The filing fee to form it runs from ${K.usd(lowForm.llc.formation as number)} in ${lowForm.name} to ${K.usd(highForm.llc.formation as number)} in ${highForm.name}, but the recurring charges decide the total: a report fee every year or every two years in most states, and a fixed yearly tax in a few. California adds an ${K.usd(ca.llc.minTax)} annual tax to every LLC, Delaware and Rhode Island ${K.usd(de.llc.minTax)} each, and Massachusetts asks ${K.usd(ma.llc.annual as number)} for each annual report. No periodic report at all is required in ${noReport.length} states. The table below covers all 50 states and the District of Columbia, each fee read on an official page in October 2026, with "n/a" where a fee could not be confirmed. Registered agent services, New York newspaper publication, local licenses and professional fees are not included.`,
  tool: 'llc-cost',
  body: (h) => `<p>The calculator and the table count four things the state itself charges: the filing fee for the articles or certificate of formation, the fee for the annual or biennial report (spread over two years when it is biennial), any fixed yearly tax or fee that every LLC owes regardless of profit, and one-time extras the state requires after formation, such as the ${money(ny.llc.firstYearExtra)} Certificate of Publication in New York. Income tax is not part of it. An LLC with one owner is a disregarded entity for federal purposes (${h.src('smllc', 'IRS, single-member LLCs')}), so its profit lands on the owner's own return, and the state taxes that profit as personal income. The picture changes when the LLC elects S corporation status: California, for example, taxes S corporations at ${K.rate(ca.scorp.rate)} of net income with an ${K.usd(ca.scorp.minimum)} minimum.</p>
${h.mini('stateScorp', { s: 'california' })}
<h2>The 51 fee schedules side by side</h2>
<p>Sorted by state name. The last column adds the filing fee, the one-time extras and five years of recurring charges. A state whose filing or report fee could not be confirmed on its own website shows "n/a" instead of a figure copied from a commercial site.</p>
${h.table(['State', 'Filing fee', 'Report fee (cycle)', 'Fixed yearly tax', '5-year state cost'], all.map((s) => row(h.a, s)), 'LLC state fees, 2026, single-member LLC with no employees', ['l', 'r', 'r', 'r', 'r'])}
<p>Among the ${full.length} states with a complete schedule, the yearly cost after formation goes from ${K.usd(yearlyKnown[0])} to ${K.usd(yearlyKnown[yearlyKnown.length - 1])}. Across all 51, the report comes every second year in ${biennial.length} (${names(biennial)}), which halves the yearly figure but not the obligation: the date still has to be tracked, and each state page gives its own deadline.</p>
<h2>When the yearly charge is a tax, not a report fee</h2>
<p>A fixed amount unrelated to any report appears in ${withTax.length} states: ${names(withTax)}. California is the heavy one. The Franchise Tax Board collects the ${K.usd(ca.llc.minTax)} annual LLC tax from every LLC doing business or organized there, single-member ones included, every year until the LLC is cancelled; the first-year exemption covered only tax years 2021 to 2023 (${h.ext(FTB_LLC, 'FTB, limited liability company')}). Once California income reaches $250,000, a separate LLC fee based on gross receipts starts at $900, which the table leaves out because it depends on sales.</p>
<p>Delaware asks for no annual report from an LLC but raised its flat annual tax from $300 to ${K.usd(de.llc.minTax)} starting with 2026, payable by June 1 of the following year (${h.ext(DE_TAX, 'Delaware Division of Corporations')}). Rhode Island charges ${K.usd(ri.llc.minTax)} a year on top of a ${K.usd(ri.llc.annual as number)} report. Kentucky collects a ${K.usd(ky.llc.minTax)} minimum Limited Liability Entity Tax from LLCs with gross receipts or gross profits of $3 million or less, in addition to a ${K.usd(ky.llc.annual as number)} annual report (${h.ext(KY_LLET, 'Kentucky Department of Revenue')}). New York has a separate filing fee on Form IT-204-LL for an LLC with New York income; its amounts are in the ${h.ext(NY_IT204LL, 'IT-204-LL instructions')}.</p>
<h3>Texas: a franchise tax most small LLCs never pay</h3>
<p>Texas shows no yearly charge in the table, and that is accurate for most freelancers. Its franchise tax applies to LLCs, but for reports due in 2026 and 2027 an entity with annualized revenue at or below $2,650,000 owes nothing (${h.ext(TX_FRANCHISE, 'Texas Comptroller, franchise tax')}). It still files a Public Information Report every May, free of charge. The ${K.usd(tx.llc.formation as number)} formation fee is the only state cost a small Texas LLC pays.</p>
<h2>What the state total leaves out</h2>
<p>Every state requires a registered agent with a physical address in the state to receive legal papers. Owners who live there can usually name themselves; anyone forming elsewhere pays an agent, and that yearly fee, set by private providers, is not in the table. Neither are expedited processing, certified copies, name reservations or the card fees some online portals add.</p>
<p>New York is the outlier on publication. Within 120 days of formation, a New York LLC must publish a notice in two newspapers for six consecutive weeks and then file the Certificate of Publication; until it does, it loses its authority to do business (${h.ext(NY_FORM, 'New York Department of State')}). The filing fee is counted above, the newspaper bills are not, because they vary by county.</p>
<p>Licenses are a third layer. Alaska requires a state business license of $50 a year from every business, LLCs included (${h.ext(AK_LICENSE, 'Alaska business license statute')}). Washington requires a separate business license from its Department of Revenue once gross income reaches $12,000 a year (${h.ext(WA_LICENSE, 'Washington DOR')}). Cities and counties add their own licenses and, in some places, a tax on business profit; the ${h.a('local-business-taxes', 'local business taxes guide')} lists the ones read so far.</p>
<h2>Forming in a cheap state while working from an expensive one</h2>
<p>An LLC pays the fees of the state where it is formed and of every state where it registers to do business. A consultant living in California who forms in ${cheap.name} still has to register the LLC as a foreign LLC in California and pay the ${K.usd(ca.llc.minTax)} tax there, so the out-of-state formation adds a second set of fees rather than replacing the first. The state where the work is done and the owner lives is almost always the one that counts, both for fees and for ${h.a('state-income-tax', 'state income tax')}.</p>
<p>Some states appear as "n/a" because their fee pages blocked automated reading on the day of the survey or showed conflicting amounts: ${names(missing)}. Their state pages link the agency where the current fee is posted. For what the LLC owes in federal tax once it exists, see ${h.a('llc-taxes', 'LLC taxes')}; for the S election and its payroll, ${h.a('llc-vs-s-corp', 'LLC vs S corp')}.</p>`,
  faqs: [
    { q: 'How much does it cost to start an LLC in 2026?', a: `The state filing fee ranges from ${K.usd(lowForm.llc.formation as number)} in ${lowForm.name} to ${K.usd(highForm.llc.formation as number)} in ${highForm.name}, among the states whose fee could be confirmed on an official page. Add a registered agent if you form outside your home state, publication costs in New York, and any city license. Most states then charge a report fee every year or two.` },
    { q: 'Which state has the cheapest LLC over five years?', a: `Among states with every fee confirmed, ${cheap.name} comes out lowest at ${K.usd(K.llcCost(cheap, 5))} over five years, and ${dear.name} highest at ${K.usd(K.llcCost(dear, 5))}. Forming in a cheap state does not help if you live and work elsewhere: your home state will require a foreign registration and its own yearly fees.` },
    { q: 'Do I pay the $800 California LLC tax in the first year?', a: `Yes. The exemption for the first taxable year applied only to tax years 2021 through 2023, according to the Franchise Tax Board. An LLC organized or doing business in California owes the ${K.usd(ca.llc.minTax)} annual tax every year until it is cancelled, single-member LLCs included, plus a gross receipts fee once California income reaches $250,000.` },
    { q: 'Are registered agent fees part of LLC state fees?', a: 'No. The state requires an agent with a physical address in the state, but it does not charge for one. If you live in the state you can usually act as your own agent at no cost. Commercial agents set their own yearly prices, which is why the table on this page leaves them out.' },
    { q: 'What does an LLC cost each year after formation?', a: `Between ${K.usd(yearlyKnown[0])} and ${K.usd(yearlyKnown[yearlyKnown.length - 1])} a year in state charges, among the ${full.length} states with a complete fee schedule. Most of that range comes from report fees; the top end is driven by fixed taxes such as California's ${K.usd(ca.llc.minTax)} and Massachusetts's ${K.usd(ma.llc.annual as number)} annual report.` },
  ],
  related: ['llc-taxes', 'single-member-llc', 'llc-vs-s-corp', 'state-income-tax', 'local-business-taxes', 'state:california'],
  sources: ['llc', 'smllc', 'structures'],
});
