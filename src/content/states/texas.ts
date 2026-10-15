import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('texas');
const ca = K.st('california');

export default defineState({
  slug: 'texas',
  title: `Texas LLC Cost 2026: ${K.usd(s.llc.formation)} Filing, Franchise Tax Report`,
  description: `Texas 2026: an LLC costs ${K.usd(s.llc.formation)} to form, files a franchise tax information report each May, and owes margin tax only above $2.65 million of yearly revenue.`,
  intro: `Texas has no personal income tax, and most small LLCs owe no franchise tax either, but every one of them still files with the Comptroller each May.`,
  resume: `Forming an LLC in Texas costs ${K.usd(s.llc.formation)} with the Secretary of State, and there is no annual report fee after that. The yearly obligation is with the Comptroller instead: every LLC, single-member ones included, is a taxable entity for the franchise (margin) tax. For reports due in 2026 and 2027, a business with annualized total revenue at or below $2,650,000 owes no tax and files only a Public Information Report or Ownership Information Report by May 15, at no cost. A sole proprietor without an LLC files nothing at all. Texas has no state income tax, so a single filer with ${K.usd(75000)} of profit pays only federal income tax and self-employment tax, about ${K.usd(s.ex75.total)}, or ${K.usd(s.ex75.quarterly)} per quarterly payment. An S corporation is treated like an LLC for franchise tax, so the S election is a purely federal matter here; at ${K.usd(120000)} of profit and a ${K.usd(50000)} salary it saves about ${K.usd(s.cmp.savings)}.`,
  body: (h) => `<p>Texas replaced an income tax on businesses with a tax on their margin, and it reaches entities the IRS barely notices. The Comptroller's ${h.ext('https://comptroller.texas.gov/taxes/publications/98-806.php', 'franchise tax overview')} counts single-member LLCs as taxable entities, while a sole proprietorship is outside the tax. For a freelancer under the threshold the difference is paperwork, not money, but it is a deadline every year.</p>
<h2>The May 15 report and the $2.65 million line</h2>
<p>The ${h.ext('https://comptroller.texas.gov/taxes/franchise/', 'Comptroller')} sets the no-tax-due threshold at $2,650,000 of annualized total revenue for reports due in 2026 and 2027, up from $2,470,000. Above it, the rate is 0.375% for retail and wholesale and 0.75% for other businesses, applied to the taxable margin, with an EZ computation at 0.331% of apportioned revenue for companies under $20 million. Few self-employed people get close. Since report year 2024 the separate No Tax Due Report has been retired, as the ${h.ext('https://comptroller.texas.gov/taxes/franchise/ntd-rpt-updates-2024.php', '2024 reporting update')} explains: an LLC under the threshold files only the Public Information Report (Form 05-102), or the Ownership Information Report for some entity types, by May 15. It is a yearly deadline worth writing into the calendar next to the ${h.a('estimated-tax-due-dates', 'federal estimated tax dates')}.</p>
<h3>Veteran-owned businesses</h3>
<p>The same Comptroller update notes that a qualifying new veteran-owned business files no franchise tax report and no information report during its first five years.</p>
<h2>What moving to Texas changes</h2>
<p>People ask about Texas because of what it does not tax. The gap is the state income tax you would pay elsewhere, and it grows with profit. Compare with California, where the LLC also owes ${K.usd(ca.llc.minTax)} a year:</p>
${h.mini('stateGap', { a: 'california', b: 'texas' })}
<p>Federal tax does not move with you. On ${K.usd(120000)} of profit, a single filer in Texas still owes about ${K.usd(s.ex120.total)} in federal income tax and self-employment tax. The ${h.a('state-income-tax', 'state income tax comparison')} lines up every state for the same profit. Residency follows where you live and work: an LLC formed in Texas by someone living in another state does not escape that state's tax.</p>
<h2>The S corporation in Texas</h2>
<p>An S corporation is a taxable entity for franchise tax on the same terms as an LLC, with the same threshold and rates, and there is no personal income tax for the election to reduce. The decision therefore turns on federal payroll tax alone, plus the cost of Texas unemployment tax on the owner salary, which the Texas Workforce Commission sets for each employer. The ${h.a('llc-vs-s-corp', 'LLC vs S corp page')} shows the federal side line by line.</p>`,
  faqs: [
    { q: 'Does a Texas LLC pay franchise tax if it earns little?', a: 'No tax is due when annualized total revenue is at or below $2,650,000 for reports due in 2026 and 2027. The LLC still files a Public Information Report or Ownership Information Report with the Comptroller by May 15 each year. That report is free, and the separate No Tax Due Report no longer exists since report year 2024.' },
    { q: 'How much does it cost to form an LLC in Texas in 2026?', a: `The certificate of formation (Form 205) costs ${K.usd(s.llc.formation)} with the Texas Secretary of State. There is no state annual report fee afterward and no franchise tax below the revenue threshold, so the state cost over five years stays at ${K.usd(s.cost5)} for a small LLC. Professional LLCs file Form 206 instead.` },
    { q: 'Is a Texas sole proprietor subject to the franchise tax?', a: `No. A sole proprietorship is not a taxable entity for the Texas franchise tax, while a single-member LLC is. A freelancer working under their own name files no franchise tax report and no information report, and pays only federal taxes: about ${K.usd(s.ex75.total)} on ${K.usd(75000)} of profit for a single filer in 2026.` },
  ],
  related: ['llc-cost', 'state-income-tax', 'llc-vs-s-corp', 'state:california', 'state:oklahoma'],
});
