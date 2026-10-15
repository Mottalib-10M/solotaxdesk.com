import { defineLocal } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const mo = K.st('missouri');
const find = (slug: string) => { const l = mo.local.find((x) => x.slug === slug); if (!l) throw new Error(slug); return l; };
const kc = find('kansas-city-earnings-tax-profits-tax-on-net-profits-form-rd-');
const stl = find('st-louis-city-earnings-tax-individual-e-1-business-e-234');
const pay = find('st-louis-city-payroll-expense-tax-form-p-10');
const PROFIT = 75000;
const r = K.solo({ profit: PROFIT, filing: 'single', localRate: kc.rate as number });

export default defineLocal({
  state: 'missouri',
  place: 'kansas-city',
  tax: 'kansas-city-earnings-tax-profits-tax-on-net-profits-form-rd-',
  name: 'Kansas City',
  title: 'Kansas City Earnings Tax 2026: 1% on Self-Employed Profit',
  description: `Kansas City earnings tax in 2026: ${kc.rateText} of net profits for sole proprietors and LLCs on Form RD-108, residents on all earnings, plus the St. Louis earnings tax.`,
  h1: 'Kansas City earnings tax on self-employment profit in 2026',
  intro: 'Missouri\'s two largest cities each take one percent of what a freelancer earns, and both reach net business profit.',
  resume: `Kansas City, Missouri, levies an earnings tax of ${kc.rateText} that applies to net business profit as well as wages. Residents owe it on all their earnings and net profits, wherever the work is done; nonresidents owe it on earnings and profits from work or business carried on inside the city. Sole proprietors, partnerships and corporations report the profit side on Form RD-108, and the city states no exemption threshold. On ${K.usd(PROFIT)} of net profit, the tax comes to ${K.usd(r.localTax)}. St. Louis runs a parallel system: a ${stl.rateText} earnings tax on residents, on nonresidents working in the city and on businesses located there, filed on Form E-1 by individuals and E-234 by businesses, plus a ${pay.rateText} payroll expense tax paid by employers. Missouri's own 2026 rate schedule could not be confirmed on an official page, so the calculator above shows federal tax and the city tax and leaves the state line out.`,
  body: (h) => `<p>The city's Finance Department describes Form RD-108 as the return a sole proprietor, partnership or corporation uses to file and pay the ${kc.rateText} earnings tax due on net profits (${h.ext(kc.url, 'Kansas City Finance, tax forms')}). For a freelancer, that means the Schedule C profit is taxed by the city as well as by the IRS and the state, at a flat rate with no brackets.</p>
${h.mini('localQuick', { l: kc.slug })}
<h2>Who is inside the Kansas City tax</h2>
<p>Residence decides most cases. A resident of Kansas City, Missouri, owes the tax on all earnings and net profits, including work for clients in Kansas or elsewhere. A nonresident owes it on earnings and net profits from work performed or business carried on within the city limits. The city sits on both sides of the state line, but the earnings tax belongs to the Missouri city only; Kansas City, Kansas, is a separate government.</p>
<p>Because the rate is flat and applies to net profit, the arithmetic is short: ${kc.rateText} of the profit apportioned to the city. A web developer living in Kansas City with ${K.usd(PROFIT)} of profit pays ${K.usd(r.localTax)} to the city, against ${K.usd(r.se.total)} of federal self-employment tax on the same income.</p>
<h2>St. Louis: the same rate, a second tax for employers</h2>
<p>The City of St. Louis taxes earnings at ${stl.rateText} too. Residents pay it regardless of where they work, nonresidents pay it on work done in the city, and every business located in the city, self-employed people and sole proprietors included, pays it on business earnings unless exempted by law (${h.ext(stl.url, 'St. Louis Collector of Revenue')}). Individuals file Form E-1, businesses Form E-234.</p>
<p>St. Louis adds a payroll expense tax of ${pay.rateText}, paid by the employer on compensation for work done in the city (${h.ext(pay.url, 'St. Louis payroll expense tax')}). A sole proprietor with no employees never meets it. An LLC taxed as an S corporation that pays its owner a salary does: the company owes ${pay.rateText} on that salary, and the owner still owes the earnings tax on it.</p>
<h2>What Missouri itself charges</h2>
<p>At the state level, Missouri is one of the cheapest places to form an LLC: ${K.usd(mo.llc.formation as number)} to file and no annual report, as the ${h.a('llc-cost', 'LLC cost table')} shows. The state income tax is a graduated schedule, but its 2026 brackets could only be read from a reproduction of the Department of Revenue's withholding formula, not from the department itself, so this site treats them as unconfirmed. One change is firmly in the statute: since 2025, Missouri exempts individuals' capital gains entirely (${h.ext('https://revisor.mo.gov/main/OneSection.aspx?section=143.121', 'RSMo 143.121')}), which helps a freelancer who sells investments but leaves business profit fully taxable. The ${h.a('state:missouri', 'Missouri page')} links the Department of Revenue. Other cities that tax business profit, from Detroit to Philadelphia, are compared in the ${h.a('local-business-taxes', 'local business taxes guide')}.</p>`,
  faqs: [
    { q: 'Do Kansas City residents owe the earnings tax on business done outside the city?', a: `Yes. Residents of Kansas City, Missouri, owe the ${kc.rateText} earnings tax on all their earnings and net profits, wherever the work is performed. Nonresidents owe it only on earnings and profits from work or business carried on inside the city. Kansas City, Kansas, is a separate city and does not levy this tax.` },
    { q: 'Which form does a Kansas City sole proprietor file for the earnings tax?', a: `Form RD-108. The Kansas City Finance Department describes it as the return used by a sole proprietor, partnership or corporation to file and pay the ${kc.rateText} earnings tax on net profits. Earnings from a job are taxed separately, usually through the employer, and the two can both apply to the same person.` },
    { q: 'Does St. Louis tax self-employment income like Kansas City?', a: `Yes. The City of St. Louis levies a ${stl.rateText} earnings tax on residents, on nonresidents working in the city and on businesses located there, self-employed people included. Individuals file Form E-1 and businesses Form E-234. Employers also pay a separate ${pay.rateText} payroll expense tax on wages for work in the city.` },
  ],
  related: ['local-business-taxes', 'state:missouri', 'llc-cost', 'state-income-tax'],
});
