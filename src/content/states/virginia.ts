import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('virginia');
const b = s.income.brackets!.single;
const top = b[b.length - 1];
const joint = K.solo({ profit: 130000, filing: 'mfj', state: s });
const bpol = s.local[0];

export default defineState({
  slug: 'virginia',
  title: `Virginia Self-Employed Taxes 2026: ${K.rate(top[1])} Rate, BPOL, LLC`,
  description: `Virginia 2026: income tax tops out at ${K.rate(top[1])} above ${K.usd(top[0])}, estimates start at $1,000 owed with a May 1 first due date, and an LLC pays ${K.usd(s.llc.annual)} a year to the SCC.`,
  intro: `Virginia reaches its top income tax rate at only ${K.usd(top[0])} of taxable income, so nearly every full-time freelancer pays it on most of their profit.`,
  resume: `Virginia's income tax has four brackets with very low thresholds: ${K.rate(b[0][1])}, ${K.rate(b[1][1])}, ${K.rate(b[2][1])}, then ${K.rate(top[1])} on taxable income above ${K.usd(top[0])}, the same thresholds for single and joint returns. After a ${K.usd(s.income.std!.single)} standard deduction and a ${K.usd(s.income.exemption!.single)} personal exemption, a single freelancer with ${K.usd(75000)} of profit owes about ${K.usd(s.ex75.stateTax)} to Virginia and ${K.usd(s.ex75.total)} in all with federal income tax and self-employment tax. Two 2026 changes affect cash flow: estimated payments are now required only when you expect to owe more than $1,000, up from $150, and the first installment is due May 1. An LLC costs ${K.usd(s.llc.formation)} to form and ${K.usd(s.llc.annual)} a year in registration fees, with no franchise tax. Many cities and counties add a BPOL license tax on gross receipts. Virginia follows the S election, which saves about ${K.usd(s.cmp.savings)} at ${K.usd(120000)} of profit and a ${K.usd(50000)} salary.`,
  body: (h) => `<p>Two dates on the Virginia calendar differ from the federal one. The ${h.ext('https://www.tax.virginia.gov/sites/default/files/taxforms/individual-income-tax/2026/760es-2026.pdf', '2026 Form 760ES')} puts the first estimated payment on May 1, two weeks after the IRS, and lifts the threshold for paying estimates at all to more than $1,000 of expected tax after withholding and credits. A part-time freelancer who used to send small vouchers may no longer need to. The other three installments land on June 15, September 15 and January 15, as on the ${h.a('estimated-tax-due-dates', 'federal calendar')}.</p>
<h2>A top rate that starts early</h2>
<p>The ${K.rate(top[1])} rate applies from ${K.usd(top[0])} of taxable income, a threshold that does not follow inflation in the 2026 schedule. In practice Virginia works almost like a flat tax for anyone with a real business: the lower brackets save a fixed amount, and everything above is taxed at the top rate. Married couples get no wider brackets either; a couple filing jointly on ${K.usd(130000)} of profit owes about ${K.usd(joint.stateTax)}. The standard deduction stays at ${K.usd(s.income.std!.single)} single for 2026 and rises to $9,200 in 2027 under ${h.ext('https://law.lis.virginia.gov/vacode/title58.1/chapter3/section58.1-322.03/', 'Va. Code § 58.1-322.03')}.</p>
${h.mini('stateQuick', { s: 'virginia', p: 90000 })}
<h2>BPOL: the license tax counted on receipts</h2>
<p>Virginia lets its counties, cities and towns levy a Business, Professional and Occupational License tax on gross receipts, not profit. Each locality sets its own rate within limits; state law caps the rate for financial, real estate and professional services at ${bpol.rateText}, with lower ceilings for other trades. Under ${h.ext('https://law.lis.virginia.gov/vacode/title58.1/chapter37/section58.1-3706/', 'Va. Code § 58.1-3706')}, larger localities tax freelancers' receipts only above $100,000. Check with the commissioner of the revenue where you work: a home-based consultant still needs the local license. The ${h.a('local-business-taxes', 'local business taxes')} page explains how these receipts taxes differ from income taxes.</p>
<h2>LLCs and S corporations</h2>
<p>A Virginia LLC is organized with the State Corporation Commission for ${K.usd(s.llc.formation)}, then pays an annual registration fee of ${K.usd(s.llc.annual)} by ${s.llcDetail.due}. There is no franchise tax and no separate report form, per ${h.ext('https://law.lis.virginia.gov/vacode/title13.1/chapter12/section13.1-1062/', 'Va. Code § 13.1-1062')}. Five years of fees come to ${K.usd(s.cost5)}.</p>
<h3>The pass-through entity tax</h3>
<p>Partnerships and S corporations can elect each year, on a timely Form 502, to pay Virginia tax at ${K.rate(top[1])} on their Virginia taxable income, as ${h.ext('https://law.lis.virginia.gov/vacode/title58.1/chapter3/section58.1-390.3/', 'Va. Code § 58.1-390.3')} allows; the text in force carries no end date. The owners then claim a credit on their own returns. A sole proprietor or single-member LLC cannot elect. The S election itself is followed by Virginia, and the ${h.a('llc-vs-s-corp', 'LLC vs S corp page')} shows how payroll costs eat into the saving.</p>`,
  faqs: [
    { q: 'When is the first Virginia estimated tax payment due in 2026?', a: 'May 1, 2026, not April 15. The remaining installments are due June 15 and September 15, 2026, and January 15, 2027. From 2026 you must pay estimates only if you expect your Virginia tax after withholding and credits to exceed $1,000; the old threshold was $150.' },
    { q: 'What is the BPOL tax for freelancers in Virginia?', a: `It is a local license tax on gross receipts, levied by many Virginia counties, cities and towns. Rates and thresholds depend on the locality and the kind of business; the state ceiling for professional services is ${bpol.rateText} of receipts. Larger localities exempt receipts up to $100,000. You register with the local commissioner of the revenue.` },
    { q: 'Does a Virginia LLC pay franchise tax?', a: `No. A Virginia LLC pays ${K.usd(s.llc.formation)} to file its articles of organization with the State Corporation Commission and then an annual registration fee of ${K.usd(s.llc.annual)}, due by the end of its anniversary month. There is no franchise tax, minimum tax or newspaper publication requirement.` },
  ],
  related: ['estimated-tax-due-dates', 'local-business-taxes', 'llc-vs-s-corp', 'state:maryland', 'state:north-carolina'],
});
