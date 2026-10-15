import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('new-jersey');
const b = s.income.brackets!.single;
const top = b[b.length - 1];
const es = 'https://www.nj.gov/treasury/taxation/pdf/current/1040esi.pdf';
const cbt = 'https://www.nj.gov/treasury/taxation/pdf/current/cbt/cbt100sins.pdf';
const p40 = K.solo({ profit: 40000, filing: 'single', state: s });
const j150 = K.solo({ profit: 150000, filing: 'mfj', state: s });

export default defineState({
  slug: 'new-jersey',
  title: 'New Jersey LLC Cost 2026: Fees, S Corp Minimum, Tax Rates',
  description: `New Jersey 2026 for 1099 earners and LLCs: ${K.usd(s.llc.formation!)} to form, ${K.usd(s.llc.annual!)} a year, a ${K.usd(s.scorp.fixed)} minimum tax on S corporations, and income tax rates from ${K.rate(b[0][1])} up to ${K.rate(top[1])}.`,
  intro: 'New Jersey charges S corporations a minimum tax that LLCs never pay, and its income tax has no standard deduction at all.',
  resume: `A New Jersey LLC costs ${K.usd(s.llc.formation!)} to form with the Division of Revenue and Enterprise Services and ${K.usd(s.llc.annual!)} for each annual report, with no franchise tax and no newspaper publication. Profit is taxed on the owner's New Jersey return at rates from ${K.rate(b[0][1])} to ${K.rate(top[1])}, with only a ${K.usd(s.income.exemption!.single)} personal exemption and no standard deduction. On ${K.usd(75000)} of profit, a single filer owes about ${K.usd(s.ex75.stateTax)} to New Jersey and ${K.usd(s.ex75.total)} in total with federal income tax and self-employment tax; at ${K.usd(120000)}, the state share is ${K.usd(s.ex120.stateTax)}. Electing S corporation status adds the Corporation Business Tax minimum, ${K.usd(s.scorp.fixed)} a year for New Jersey receipts under ${K.usd(100000)} and more above that. Even with it, a ${K.usd(50000)} salary on ${K.usd(120000)} of profit saves about ${K.usd(s.cmp.savings)} a year in the calculator, after ${K.usd(2000)} of payroll costs.`,
  body: (h) => `<p>Most states let an S corporation pass its income through without charging the company anything. New Jersey does pass the income through, but it still bills the corporation a minimum Corporation Business Tax scaled to New Jersey gross receipts: ${K.usd(s.scorp.fixed)} below ${K.usd(100000)}, then $562, $750, $1,125 and $1,500 as receipts climb past one million, according to the CBT-100S instructions (${h.ext(cbt, '2025 CBT-100S instructions')}). An LLC taxed by default never sees this bill. Since 2022, a federal S corporation no longer needs a separate New Jersey election to be treated as one, though each shareholder must consent to New Jersey jurisdiction.</p>
${h.mini('stateQuick', { s: 'new-jersey', p: 90000 })}
<h2>No standard deduction, brackets that do not move</h2>
<p>The New Jersey return starts from gross income and allows a ${K.usd(s.income.exemption!.single)} exemption per person, not a standard deduction, and the brackets are not indexed to inflation, so the same dollar thresholds apply year after year (${h.ext(es, '2026 NJ-1040-ES instructions')}). Federal deductions such as QBI do not carry over. The effect is visible at modest incomes: a single freelancer clearing ${K.usd(40000)} pays about ${K.usd(p40.stateTax)} to Trenton. The single schedule climbs quickly to ${K.rate(b[4][1])} above ${K.usd(b[4][0])}, while married couples get wider brackets in the middle; a couple with ${K.usd(150000)} of profit pays about ${K.usd(j150.stateTax)}. The top ${K.rate(top[1])} rate applies above ${K.usd(top[0])} of taxable income.</p>
<p>Estimated payments are required when you expect to owe more than $400 of New Jersey tax after withholding, on the federal dates, and underpaid amounts carry interest at prime plus 3% (${h.ext(es, 'NJ-1040-ES instructions')}). The ${h.a('quarterly-estimated-taxes', 'quarterly estimated tax guide')} explains the federal half.</p>
<h2>What the yearly LLC bill includes</h2>
<p>Formation is the ${K.usd(s.llc.formation!)} public records filing, listed on the current fee schedule of the Division of Revenue (${h.ext('https://www.nj.gov/treasury/revenue/fees.shtml', 'NJ DORES, fees')}); older guides still quote a higher amount. After that, the ${K.usd(s.llc.annual!)} annual report keeps the company in good standing, for a five-year state cost of ${K.usd(s.cost5)}. Multi-member LLCs taxed as partnerships may owe an extra filing fee per owner, which was not verified today and is not in the calculator. The ${h.a('llc-cost', 'LLC cost comparison')} ranks New Jersey against its neighbors.</p>
<h3>The pass-through business alternative income tax</h3>
<p>New Jersey also lets partnerships and S corporations elect to pay an entity-level tax, the BAIT, which owners then credit on their personal returns; it is mainly a way around the federal cap on state and local tax deductions. Its rates were not read on an official page today, so the calculator ignores it. For the federal side of the S decision, see the ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} and the ${h.a('state:new-york', 'New York page')} for a neighbor that treats S corporations very differently.</p>`,
  faqs: [
    { q: 'How much does an LLC cost per year in New Jersey?', a: `${K.usd(s.llc.annual!)} a year for the annual report, after a ${K.usd(s.llc.formation!)} formation filing, for ${K.usd(s.cost5)} over five years. New Jersey charges no franchise or minimum tax on an LLC taxed as a sole proprietorship or partnership and requires no newspaper notice. Registered agent services and any per-partner filing fee are extra.` },
    { q: 'Does a New Jersey S corporation pay a minimum tax?', a: `Yes. A New Jersey S corporation pays the Corporation Business Tax minimum based on its New Jersey gross receipts: ${K.usd(s.scorp.fixed)} under ${K.usd(100000)}, rising in steps to $1,500 at one million dollars or more. The profit itself is still taxed on the owners' returns. The calculator includes the ${K.usd(s.scorp.fixed)} minimum in its S corp total.` },
    { q: 'Is there a standard deduction on the New Jersey income tax return?', a: `No. New Jersey allows a personal exemption of ${K.usd(s.income.exemption!.single)} per person instead, and its brackets are not adjusted for inflation. That is why a single freelancer with ${K.usd(40000)} of profit already owes about ${K.usd(p40.stateTax)} to the state for 2026, while the same profit costs nothing in states with large standard deductions.` },
  ],
  related: ['state:new-york', 'state:pennsylvania', 'state:delaware', 'llc-vs-s-corp', 'llc-cost'],
});
