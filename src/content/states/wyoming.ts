import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('wyoming');
const twenty = K.llcCost(s, 20);
const big = K.solo({ profit: 200000, filing: 'single', state: s });

export default defineState({
  slug: 'wyoming',
  title: `Wyoming LLC Cost 2026: ${K.usd(s.llc.annual)} License Tax, No Income Tax`,
  description: `Wyoming 2026: an LLC costs ${K.usd(s.llc.formation)} to form and a ${K.usd(s.llc.annual)} minimum license tax each year; no state income tax, so a freelancer there pays only the federal taxes.`,
  intro: `Wyoming's yearly charge on an LLC is a license tax measured on assets in the state, and for a typical one-person business it never rises above the ${K.usd(s.llc.annual)} minimum.`,
  resume: `Wyoming has no personal or corporate income tax, so self-employment profit is taxed only by the IRS: about ${K.usd(s.ex75.total)} of federal income tax and self-employment tax on ${K.usd(75000)} for a single filer, or ${K.usd(s.ex75.quarterly)} per quarterly payment. An LLC costs ${K.usd(s.llc.formation)} to form with the Secretary of State. Each year after, it files an annual report and pays a license tax equal to the greater of ${K.usd(s.llc.annual)} or two-tenths of a mill per dollar of assets located and employed in Wyoming, so the minimum applies until those assets pass $300,000. A one-person consulting LLC therefore pays ${K.usd(s.cost5)} over five years and ${K.usd(twenty)} over twenty. With no state return, the S election only changes federal and payroll taxes; at ${K.usd(120000)} of profit and a ${K.usd(50000)} salary it saves about ${K.usd(s.cmp.savings)} after ${K.usd(2000)} of payroll costs. Wyoming's unemployment wage base is high, which adds a little to the payroll side.`,
  body: (h) => `<p>The Wyoming annual report doubles as a tax return for one small tax. The Secretary of State's ${h.ext('https://sos.wyo.gov/Business/Docs/BusinessFees.pdf', 'fee schedule')} sets the license tax at ${K.usd(s.llc.annual)} or $0.0002 per dollar of the company's assets located and employed in Wyoming, whichever is greater. A company with $1,210,000 of Wyoming assets would pay $242. A freelancer whose assets are a laptop and a bank balance pays the minimum and nothing more. Since the measure is assets rather than revenue or profit, a busy year with high billings leaves the charge unchanged, which sets it apart from the gross receipts taxes of Washington or the margin tax of Texas.</p>
<h2>When the report is due</h2>
<p>The report and license tax are due ${s.llcDetail.due.replace(' (formed Jan 15 -> due Jan 1 each year)', '')}. An LLC formed on March 20 files by March 1 of each later year, before its anniversary date rather than after it, which catches out owners used to other states. The ${h.ext('https://sos.wyo.gov/faqs.aspx?root=BUS', 'business FAQ')} of the Secretary of State answers the common questions about filing it.</p>
${h.mini('llcFees', { s: 'wyoming' })}
<h2>Why people outside Wyoming form LLCs here</h2>
<p>Low fees and the absence of an income tax draw LLC owners from other states. For someone who lives and works elsewhere, the Wyoming LLC usually has to register as a foreign LLC in the home state too, paying that state's fees and taxes on top, and the profit stays taxable where the work is done. The saving is real only for people who actually live in Wyoming. The ${h.a('llc-cost', 'LLC cost by state')} page lines up both sets of fees, and ${h.a('state:south-dakota', 'South Dakota')} is the closest comparison on cost.</p>
<h2>Federal tax is the whole bill</h2>
<p>With no state income tax, a single filer with ${K.usd(200000)} of profit pays about ${K.usd(big.total)} in all, of which ${K.usd(big.se.total)} is self-employment tax. At that level the Social Security part stops at the ${K.usd(K.P.se.wageBase['2026'])} wage base, which is why the saving from an S corporation grows more slowly at high profits. The ${h.a('how-much-to-set-aside', 'set-aside guide')} turns these totals into a percentage for each payment.</p>
<h3>Payroll in an S corporation</h3>
<p>An S corporation owner on salary pays Wyoming unemployment insurance. The ${h.ext('https://dws.wyo.gov/dws-division/unemployment-insurance/wyui/unemployment-taxable-wage-base/', 'Department of Workforce Services')} sets the taxable wage base at $33,800 for 2026, higher than in most states, and $34,900 for 2027. New employers get a rate based on their industry, so the calculator does not add it; the ${h.a('llc-vs-s-corp', 'LLC vs S corp comparison')} shows the federal payroll costs, which matter far more.</p>`,
  faqs: [
    { q: 'What is the Wyoming LLC annual license tax?', a: `It is the greater of ${K.usd(s.llc.annual)} or $0.0002 per dollar of the LLC's assets located and employed in Wyoming, paid with the annual report. The minimum applies until those assets exceed $300,000, so most small LLCs pay ${K.usd(s.llc.annual)} a year. The report is due by the first day of the LLC's anniversary month.` },
    { q: 'Does Wyoming tax self-employment income?', a: `No. Wyoming has no individual or corporate income tax, so there is no state return and no state estimated payment. Self-employment profit is taxed only at the federal level: on ${K.usd(75000)} of profit, a single filer owes about ${K.usd(s.ex75.total)} of federal income tax and self-employment tax in 2026.` },
    { q: 'Is a Wyoming LLC worth it for someone living in another state?', a: 'Usually not for tax reasons. Income is taxed by the state where you live and do the work, and an LLC operating there must normally register as a foreign LLC and pay that state\'s fees too. The Wyoming fees then come on top. A CPA or attorney in your home state can confirm the rules that apply to you.' },
  ],
  related: ['llc-cost', 'how-much-to-set-aside', 'llc-vs-s-corp', 'state:south-dakota', 'state:montana'],
});
