import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('west-virginia');
const b = s.income.brackets!.single;
const top = b[b.length - 1];
const small = K.solo({ profit: 35000, filing: 'single', state: s });

export default defineState({
  slug: 'west-virginia',
  title: `West Virginia 1099 Tax 2026: ${K.rate(top[1])} Top Rate, ${K.usd(s.llc.annual)} LLC Report`,
  description: `West Virginia 2026: income tax from ${K.rate(b[0][1])} to ${K.rate(top[1])} after another cut, no standard deduction, a ${K.usd(s.llc.annual)} LLC report and city B&O taxes charged on gross receipts.`,
  intro: `West Virginia cut its income tax again for 2026, yet it still gives no standard deduction, only a ${K.usd(s.income.exemption!.single)} personal exemption.`,
  resume: `West Virginia's 2026 income tax runs from ${K.rate(b[0][1])} to ${K.rate(top[1])} in five brackets, the top one starting at ${K.usd(top[0])}, after another rate cut passed in 2026. There is no standard deduction: the only allowance is a personal exemption of ${K.usd(s.income.exemption!.single)}, or ${K.usd(s.income.exemption!.mfj)} for a couple, and the brackets are the same for single and joint returns. A single freelancer with ${K.usd(75000)} of profit owes about ${K.usd(s.ex75.stateTax)} to the state and ${K.usd(s.ex75.total)} in all with federal income tax and self-employment tax. An LLC costs ${K.usd(s.llc.formation)} to form and ${K.usd(s.llc.annual)} for each annual report, with no franchise tax, and from July 2026 a long-standing LLC can switch to a report every two years. Many cities add a business and occupation tax on gross receipts. West Virginia follows the S election; at ${K.usd(120000)} of profit and a ${K.usd(50000)} salary it saves about ${K.usd(s.cmp.savings)}, after ${K.usd(s.cmp.scorp.suta)} of state unemployment tax.`,
  body: (h) => `<p>The state has been lowering its income tax in steps, and the 2026 schedule in ${h.ext('https://code.wvlegislature.gov/11-21-4j/', 'W. Va. Code § 11-21-4j')} takes the top rate to ${K.rate(top[1])}, from 4.82% in 2025. What did not change is the base. West Virginia starts from federal adjusted gross income and subtracts only a personal exemption of ${K.usd(s.income.exemption!.single)} per person (${h.ext('https://code.wvlegislature.gov/11-21-16/', '§ 11-21-16')}). A freelancer earning a modest profit therefore pays from nearly the first dollar: on ${K.usd(35000)} of profit, the state takes about ${K.usd(small.stateTax)}.</p>
${h.mini('setAside', { s: 'west-virginia' })}
<h2>Brackets that ignore marriage</h2>
<p>The thresholds at ${K.usd(b[1][0])}, ${K.usd(b[2][0])}, ${K.usd(b[3][0])} and ${K.usd(top[0])} are identical for a single person and a married couple. Two spouses who each run a business and file jointly reach the top bracket on combined income, where they would stay lower filing alone. Married filing separately exists, but it changes other parts of the federal return, so it deserves a CPA's look before choosing. The ${h.a('state-income-tax', 'state income tax comparison')} shows West Virginia beside its neighbors.</p>
<h2>LLC upkeep and the new biennial option</h2>
<p>An LLC is organized for ${K.usd(s.llc.formation)} under ${h.ext('https://code.wvlegislature.gov/59-1-2/', '§ 59-1-2')} and files its annual report ${s.llcDetail.due}, for ${K.usd(s.llc.annual)}. From July 1, 2026, ${h.ext('https://code.wvlegislature.gov/31B-2-211/', '§ 31B-2-211')} lets an LLC with five years of timely reports elect a biennial report at $50, the same cost spread over two years with half the filings. There is no franchise tax on LLCs. Five years of state fees come to ${K.usd(s.cost5)}.</p>
<h3>Municipal B&O on gross receipts</h3>
<p>The cost that surprises newcomers is local. Cities may levy a business and occupation tax on gross income, authorized by ${h.ext('https://code.wvlegislature.gov/8-13-5/', 'W. Va. Code § 8-13-5')}, and many do, including Charleston. It is charged on receipts, not profit, at rates each city sets by category of business, and it requires a city registration. A freelancer working from home inside city limits should ask the city finance office before the first invoice. The ${h.a('local-business-taxes', 'local business taxes')} page explains these receipts taxes.</p>
<h2>Payroll and the entity-level election</h2>
<p>An LLC taxed as an S corporation registers for unemployment insurance: new employers pay ${K.rate(s.suta.rate)} on the first ${K.usd(s.suta.wageBase)} of each employee's wages. Partnerships and S corporations can also elect West Virginia's pass-through entity tax at the top individual rate, ${K.rate(top[1])} for 2026, under ${h.ext('https://code.wvlegislature.gov/11-21-3A/', '§ 11-21-3a')}; the election is annual and irrevocable, and disregarded entities cannot make it. The ${h.a('llc-vs-s-corp', 'LLC vs S corp comparison')} counts the unemployment tax when you select the state.</p>`,
  faqs: [
    { q: 'Does West Virginia have a standard deduction in 2026?', a: `No. West Virginia taxes federal adjusted gross income less a personal exemption of ${K.usd(s.income.exemption!.single)} per person, ${K.usd(s.income.exemption!.mfj)} for a married couple filing jointly. The rates then run from ${K.rate(b[0][1])} to ${K.rate(top[1])}, with the same brackets for every filing status.` },
    { q: 'What does a West Virginia LLC pay each year?', a: `An annual report fee of ${K.usd(s.llc.annual)}, filed between January 1 and July 1 each year after formation. There is no franchise or minimum tax. From July 1, 2026, an LLC that has filed five years of reports on time can elect a ${K.usd(50)} biennial report instead.` },
    { q: 'Do West Virginia cities tax freelancers on gross receipts?', a: 'Many do. State law lets municipalities levy a business and occupation tax on gross income, and cities such as Charleston use it, with rates set by business category. It applies to receipts, before expenses, and comes with a city registration. Check with the finance office of the city where you work.' },
  ],
  related: ['state-income-tax', 'local-business-taxes', 'llc-cost', 'state:virginia', 'state:ohio'],
});
