import { defineLocal } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ny = K.st('new-york');
const find = (slug: string) => { const l = ny.local.find((x) => x.slug === slug); if (!l) throw new Error(slug); return l; };
const ubt = find('new-york-city-unincorporated-business-tax-ubt');
const pit = find('new-york-city-nyc-resident-personal-income-tax');
const mct = find('metropolitan-commuter-transportation-district-nyc-dutchess-n');
/** Read on nyc.gov and tax.ny.gov, 2026-10-15 (research/states/new-york.json). */
const GCT = 'https://www.nyc.gov/site/finance/business/business-general-corporation-tax-gct.page';

export default defineLocal({
  state: 'new-york',
  place: 'new-york-city',
  tax: 'new-york-city-unincorporated-business-tax-ubt',
  name: 'New York City',
  title: 'NYC Unincorporated Business Tax 2026: Rate, Exemption',
  description: `NYC Unincorporated Business Tax 2026: ${ubt.rateText} of business income, a $5,000 exemption, a return above $95,000 of gross income and a credit for small amounts.`,
  h1: 'NYC Unincorporated Business Tax in 2026: who pays and how much',
  intro: 'A freelancer or single-member LLC working in New York City pays a city business tax on top of state and city income tax.',
  resume: `New York City taxes the business income of sole proprietors, partnerships and LLCs that are not corporations at ${ubt.rateText} through its Unincorporated Business Tax (UBT), on the share of income allocated to the city. Three rules keep most small freelancers out of it. A return is required only when total business gross income exceeds $95,000. A $5,000 exemption comes off net income before the rate applies. And a credit erases a tax of $3,400 or less entirely, shrinks one between $3,400 and $5,400, and disappears at $5,400. City residents also get a partial credit for UBT against their NYC personal income tax, which runs from 3.078% to ${pit.rateText} for 2026. Above $150,000 of self-employment earnings allocated to the city, the ${mct.rateText} MCTMT is added. The calculator above shows federal and ${ny.name} State tax on your profit; the three city charges are explained below.`,
  body: (h) => `<p>The UBT is how New York City taxes people who work for themselves. It applies to individuals and unincorporated entities, single-member LLCs included, that carry on a trade, business or profession wholly or partly in the city (${h.ext(ubt.url, 'NYC Department of Finance, UBT')}). An S corporation is outside it, because the city taxes S corporations under a different tax. For a freelancer, that means three city layers can stack: the UBT on the business, the resident income tax on the person, and the MCTMT on high self-employment earnings.</p>
${h.mini('stateQuick', { s: 'new-york', p: 90000 })}
<h2>From gross income to the UBT bill</h2>
<p>Start with gross income, not profit. If total business gross income is $95,000 or less, no UBT return is required at all. Above that, the city taxes net business income allocated to New York City, less a $5,000 exemption, at ${ubt.rateText}. The business tax credit then does most of the work for small practices: a UBT liability of $3,400 or less is fully credited, so nothing is paid; between $3,400 and $5,400 the credit shrinks as the tax grows; at $5,400 or more there is no credit. Before other adjustments, a ${ubt.rateText} tax of $3,400 corresponds to about $90,000 of net business income, counting the $5,000 exemption, which is roughly where a solo consultant starts paying something.</p>
<p>A freelancer can therefore have to file without owing anything: gross receipts of $120,000 with $40,000 of expenses leave a net income whose tax falls under the full-credit line. Filing still matters, because the return is what claims the credit.</p>
<h2>The resident income tax and the commuter tax</h2>
<p>Living in the city adds a personal income tax computed with the New York State return, on the same taxable income. Its four rates run from 3.078% to ${pit.rateText}, with single-filer brackets starting at $12,000, $25,000 and $50,000 for 2026 (${h.ext(pit.url, 'New York instructions IT-2105')}). City residents who paid UBT get a partial credit against this tax, so the two do not stack in full. Nonresidents who only work in the city do not pay it.</p>
<p>The Metropolitan Commuter Transportation Mobility Tax reaches self-employed people in New York City at ${mct.rateText} of net earnings from self-employment allocated to the city, but only when those earnings exceed $150,000. Below that line, nothing is due. The surrounding counties of the commuter district have a lower zone rate.</p>
<h2>When the S election changes the city tax</h2>
<p>New York City does not recognize the federal S election. An LLC that elects S corporation status leaves the UBT but becomes subject to the city's General Corporation Tax, at 8.85% of net income or a fixed minimum based on receipts (${h.ext(GCT, 'NYC Department of Finance, GCT')}). The owner's salary is then taxed as wages, and the city personal income tax still applies to residents. That is one reason the ${h.a('llc-vs-s-corp', 'LLC vs S corp comparison')} often comes out differently in New York City than in the rest of the state.</p>
<p>The LLC itself also pays the state fees shown on the ${h.a('state:new-york', 'New York page')}, including the newspaper publication that New York requires within 120 days of formation. Other local taxes in the country are compared in the ${h.a('local-business-taxes', 'local business taxes guide')}.</p>`,
  faqs: [
    { q: 'Does a single-member LLC in New York City pay the UBT?', a: `Yes, if it carries on business in the city and is not taxed as a corporation. The UBT applies to individuals and unincorporated entities, single-member LLCs included, at ${ubt.rateText} of allocated net income after a $5,000 exemption. An LLC that has elected S corporation status pays the General Corporation Tax instead.` },
    { q: 'When does a New York City freelancer have to file a UBT return?', a: 'Only when total business gross income for the year exceeds $95,000. Gross income is the starting point, before expenses, so a freelancer with modest profit can still cross the line. Filing is how the business tax credit is claimed, which can reduce the tax to zero when the liability is $3,400 or less.' },
    { q: 'How does the New York City UBT credit work for small businesses?', a: 'A UBT liability of $3,400 or less is fully credited, so nothing is owed. Between $3,400 and $5,400 the credit is partial and falls as the tax rises. At $5,400 or more there is no credit. Residents of the city also get a partial credit for UBT against their city personal income tax.' },
    { q: 'Does the MCTMT apply to New York City self-employed people?', a: `Only above $150,000 of net earnings from self-employment allocated to the city, figured per individual. Above that line the rate in New York City is ${mct.rateText} of those earnings, filed with the New York State return. Self-employed people below the threshold owe nothing under this tax.` },
  ],
  related: ['local-business-taxes', 'state:new-york', 'llc-vs-s-corp', 'state-income-tax'],
});
