import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const all = K.states.map((s) => K.st(s.slug));
const rows = all.flatMap((s) => s.local.map((l) => ({ ...l, st: s })));
/** Rates the fact sheets flag as not re-read for 2026 (research/states/*.json > uncertain): shown as a link only. */
const UNCONFIRMED = new Set([
  'cincinnati-municipal-income-tax', 'akron-municipal-income-tax',
  'trimet-district-portland-area-trimet-transit-self-employment', 'lane-transit-district-eugene-springfield-ltd-transit-self-em',
  'district-of-columbia-unincorporated-business-franchise-tax', 'charleston-city-b-o-tax-service-all-other-businesses',
]);
const L = (state: string, slug: string) => {
  const l = K.st(state).local.find((x) => x.slug === slug);
  if (!l) throw new Error(`local tax ${slug} missing in ${state}`);
  return l;
};
const rate = (state: string, slug: string) => L(state, slug).rateText;
const cols = L('ohio', 'columbus-municipal-income-tax-wages-and-net-profits');
const det = L('michigan', 'detroit-city-of-detroit-income-tax-administered-by-michigan-');
const kc = L('missouri', 'kansas-city-earnings-tax-profits-tax-on-net-profits-form-rd-');
const npt = L('pennsylvania', 'philadelphia-net-profits-tax-npt');
const pgh = L('pennsylvania', 'pittsburgh-earned-income-tax-city-1-school-district-of-pitts');
const lex = L('kentucky', 'lexington-fayette-urban-county-government-occupational-licen');
const md = rows.filter((r) => r.st.slug === 'maryland' && /County|Baltimore City/.test(r.place) && /^[\d.]+%$/.test(r.rateText)).map((r) => parseFloat(r.rateText)).sort((a, b) => a - b);
const profitTaxes = rows.filter((r) => r.rate !== null && r.selfEmployed);
const ex = K.solo({ profit: 75000, filing: 'single', state: K.st('michigan'), localRate: det.rate as number });

export default defineGuide({
  id: 'local-business-taxes',
  group: 'llc',
  order: 3,
  slug: 'local-business-taxes',
  nav: 'Local business taxes',
  card: 'City and county taxes on self-employment income, with their sources',
  title: 'Local Business Taxes 2026: City and County Taxes on Profit',
  description: `Local business taxes in 2026: city income, net profits, gross receipts and county taxes on self-employed profit, ${det.rateText} in Detroit, ${npt.rateText} in Philadelphia.`,
  h1: 'Local business taxes on self-employment income in 2026',
  intro: 'Some cities and counties tax a freelancer\'s profit a second time, after the state. Choose a place and a profit to see the local share and the full bill.',
  resume: `A self-employed person in most of the United States pays only federal and state tax on business profit, but in cities, counties and school districts of a handful of states a local tax comes on top, and it can cost as much as the state's. The common form is a flat tax on net profit: ${cols.rateText} in Columbus and the other large Ohio cities, ${det.rateText} for Detroit residents, ${kc.rateText} in Kansas City and St. Louis, ${npt.rateText} under Philadelphia's Net Profits Tax, ${pgh.rateText} in Pittsburgh, ${lex.rateText} in Lexington. A second family taxes gross receipts before any expense, as in Seattle, Virginia localities and Philadelphia's BIRT. A third rides on the state return: Maryland's county income taxes run from ${md[0]}% to ${md[md.length - 1]}% of the same taxable income. On ${K.usd(75000)} of profit, a Detroit resident owes ${K.usd(ex.localTax)} to the city. The table below lists every local tax read on an official page in October 2026, with its source.`,
  tool: 'local',
  body: (h) => `<p>Local taxes on business income are easy to miss because neither the IRS nor most state calculators show them. They are set by a city, a county, a school district or a transit district, collected by that body or by the state on its behalf, and filed on a separate return or a separate line. Maryland is the clearest example of the stacking: the county income tax is computed on the same taxable income as the state tax and paid with the state return, so a freelancer there carries two percentages on one profit.</p>
${h.mini('stateQuick', { s: 'maryland', p: 75000 })}
<h2>Taxes on net profit: the city takes a share of Schedule C</h2>
<p>The largest group taxes the net profit of a business, the same figure that goes on Schedule C, at a flat rate with no brackets. Ohio cities are the densest network: Columbus taxes residents at ${cols.rateText} on all income and gives them credit for tax paid to the city where they work, up to that rate (${h.ext(cols.url, 'Columbus Income Tax Division')}). Michigan cities levy a similar tax, with Detroit at ${det.rateText} for residents and a lower rate for nonresidents, after a ${'$'}600 exemption per person (${h.ext(det.url, 'Michigan Treasury, Detroit withholding')}). Kansas City's earnings tax of ${kc.rateText} reaches residents' net profits wherever the business is carried on, and sole proprietors file it on Form RD-108 (${h.ext(kc.url, 'Kansas City Finance')}).</p>
<p>Pennsylvania builds the tax into its whole map. Outside Philadelphia, municipalities and school districts share a local earned income tax that is usually capped at a combined ${rate('pennsylvania', 'pennsylvania-all-municipalities-and-school-districts-outside')} and applies to a sole proprietor's net profits; home rule cities such as Pittsburgh go above it. Philadelphia runs its own system, with the Net Profits Tax at ${npt.rateText} for residents in tax year 2026 and a return required even at a loss (${h.ext(npt.url, 'City of Philadelphia')}). Kentucky cities and counties call theirs an occupational license tax: Lexington-Fayette charges ${lex.rateText} on compensation and business net profits earned in the county (${h.ext(lex.url, 'Lexington Division of Revenue')}).</p>
<h3>Taxes on unincorporated business</h3>
<p>New York City and Portland tax business income through a separate business tax rather than an income tax. The NYC Unincorporated Business Tax is ${rate('new-york', 'new-york-city-unincorporated-business-tax-ubt')} of business income allocated to the city, with a filing threshold and a credit that removes the tax for small earners (${h.ext(L('new-york', 'new-york-city-unincorporated-business-tax-ubt').url, 'NYC Department of Finance')}). Portland's Business License Tax and Multnomah County's Business Income Tax both apply to net business income, each with a gross receipts exemption and a deduction for the owner's own work.</p>
<h2>Taxes on gross receipts: charged before expenses</h2>
<p>A gross receipts tax is figured on sales, not profit, so a low-margin business pays it even in a year with no profit. Seattle's business license tax works that way, though from 2026 no tax is due under ${'$'}2 million of Seattle taxable revenue; a return is still required (${h.ext(L('washington', 'seattle-business-license-tax-city-b-o-service-other-business').url, 'Seattle Finance')}). Virginia localities levy a BPOL license tax on gross receipts, with no tax below ${'$'}100,000 of receipts in localities of more than 50,000 people (${h.ext(L('virginia', 'virginia-counties-cities-and-towns-varies-bpol-business-lice').url, 'Code of Virginia 58.1-3706')}). Philadelphia's Business Income and Receipts Tax combines both bases, ${rate('pennsylvania', 'philadelphia-business-income-and-receipts-tax-birt')} of taxable net income plus a mills charge on gross receipts, and since tax year 2025 the former ${'$'}100,000 receipts exemption no longer applies (${h.ext(L('pennsylvania', 'philadelphia-business-income-and-receipts-tax-birt').url, 'Philadelphia tax rate history')}). West Virginia municipalities and San Francisco have their own versions; Hawaii's four counties add a surcharge to the state general excise tax.</p>
<h2>County taxes that ride on the state return</h2>
<p>In three states the local layer is calculated from the state return rather than from the business. Maryland's counties and Baltimore City set a percentage of Maryland taxable income, from ${md[0]}% to ${md[md.length - 1]}% at a single rate, with Anne Arundel and Frederick using brackets (${h.ext(L('maryland', 'baltimore-city-county-income-tax-local-income-tax').url, 'Comptroller of Maryland instructions')}). All 92 Indiana counties levy a local income tax at their own rate, listed in the Department of Revenue's county rate table (${h.ext(L('indiana', 'all-92-indiana-counties-county-local-income-tax-lit').url, 'Indiana DOR')}). Most Iowa school districts add a surtax expressed as a percentage of the state tax, not of income (${h.ext(L('iowa', 'iowa-school-districts-most-districts-school-district-income-').url, 'Iowa Department of Revenue')}).</p>
<h2>Flat amounts per person</h2>
<p>A few places charge a fixed sum instead of a rate. Pennsylvania's Local Services Tax is limited to ${'$'}52 per person per year, with an exemption below ${'$'}12,000 of earnings where the tax exceeds ${'$'}10 (${h.ext(L('pennsylvania', 'pennsylvania-statewide-where-levied-local-services-tax-lst').url, 'Pennsylvania DCED')}). Under Denver's Occupational Privilege Tax, every business with activity in the city owes at least ${'$'}4 a month, and the ${'$'}500 earnings test that spares low-paid employees does not apply to owners or partners (${h.ext(L('colorado', 'denver-occupational-privilege-tax-opt').url, 'Denver tax guide')}).</p>
<h2>Every local tax read so far</h2>
<p>Rates as published by the city, county or state that administers each tax. Where the fact sheet flags a rate that was not re-read for 2026, the cell sends you to the source instead. ${profitTaxes.length} of these taxes apply a known rate to self-employment profit and can be selected in the calculator above.</p>
${h.table(['Place', 'State', 'Tax', 'Rate', 'Source'], rows.map((r) => [r.place, h.a(`state:${r.st.slug}`, r.st.name), r.name, UNCONFIRMED.has(r.slug) ? 'not reconfirmed for 2026' : r.rateText, r.url ? h.ext(r.url, 'official page') : 'no official list read']), 'City, county and district taxes on business or personal income, 2026', ['l', 'l', 'l', 'r', 'l'])}
<h2>Residence, workplace and entity type</h2>
<p>Most city income taxes follow two rules at once: residents pay on all their income, and nonresidents pay on what they earn inside the city, often at a lower rate. A freelancer who lives in one taxing city and works in another usually gets a credit at home for the tax paid at work, up to the home rate. The legal form of the business also changes the bill. An LLC taxed as an S corporation avoids the NYC Unincorporated Business Tax but pays the city's General Corporation Tax (${h.ext('https://www.nyc.gov/site/finance/business/business-general-corporation-tax-gct.page', 'NYC Finance, GCT')}); in Ohio, most cities tax the net profit of an S corporation or LLC at the entity level (${h.ext(L('ohio', 'cleveland-municipal-income-tax-cca').url, 'Central Collection Agency, Cleveland')}); and the salary an S corporation pays its owner falls under wage taxes such as Philadelphia's. The city pages, starting with ${h.a('local:new-york/new-york-city', 'New York City')} and ${h.a('local:pennsylvania/philadelphia', 'Philadelphia')}, give the detail, and the ${h.a('state-income-tax', 'state income tax comparison')} covers the layer underneath.</p>`,
  faqs: [
    { q: 'Which cities tax self-employment income in 2026?', a: `Among those read on official pages: the large Ohio cities such as Columbus (${cols.rateText}), Detroit and other Michigan cities, Kansas City and St. Louis (${kc.rateText}), Philadelphia, Pittsburgh and almost every Pennsylvania municipality, Lexington and other Kentucky localities, New York City through its UBT, and Portland with Multnomah County. Each has its own filing rules and exemptions.` },
    { q: 'What is the difference between a net profits tax and a gross receipts tax?', a: 'A net profits tax applies to what is left after business expenses, the same profit that goes on Schedule C, so a year with no profit means no tax. A gross receipts tax applies to sales before expenses, so it is due even in a loss year. Seattle and Virginia localities use gross receipts; Philadelphia\'s BIRT taxes both.' },
    { q: 'Do Maryland county income taxes apply to self-employed people?', a: `Yes. Every Maryland county and Baltimore City applies its rate to the same Maryland taxable income as the state tax, business profit included, and it is paid with the state return and its estimates. Single rates range from ${md[0]}% to ${md[md.length - 1]}%, and Anne Arundel and Frederick use brackets.` },
    { q: 'Does working from home inside a taxing city make my profit taxable there?', a: `In most cities that tax income, yes, because residents are taxed on all their income wherever the clients are. Columbus, Detroit and Kansas City all tax residents' net profits. A nonresident is usually taxed only on business carried on inside the city, often at a lower rate, and may get a credit from the home city.` },
    { q: 'Is the local tax included in the state income tax calculator?', a: 'No. The state comparison covers state income tax and LLC fees only. The calculator on this page adds one local tax at a time, applied at its flat rate to net profit, for places whose rate could be confirmed. Exemptions, credits and gross receipts taxes are explained on each city page rather than computed.' },
  ],
  related: ['state-income-tax', 'llc-cost', 'local:new-york/new-york-city', 'local:pennsylvania/philadelphia', 'local:ohio/columbus', 'state:maryland'],
  sources: ['i1040sc', 'se_tax', 'estimated'],
});
