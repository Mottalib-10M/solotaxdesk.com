import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('wisconsin');
const b = s.income.brackets!.single;
const m = s.income.brackets!.mfj;
const high = K.solo({ profit: 160000, filing: 'single', state: s });

export default defineState({
  slug: 'wisconsin',
  title: 'Wisconsin LLC and Freelance Taxes 2026: Rates, Fees, PTET',
  description: `Wisconsin 2026 for the self-employed: four brackets from ${K.rate(b[0][1])} to ${K.rate(b[3][1])}, a standard deduction that fades out, a ${K.usd(s.llc.annual)} LLC report and a 7.9% entity tax option.`,
  intro: `Wisconsin's standard deduction shrinks as income grows and disappears entirely at higher profits, which shapes the tax on a growing business.`,
  resume: `Wisconsin taxes 2026 income in four brackets: ${K.rate(b[0][1])}, ${K.rate(b[1][1])}, ${K.rate(b[2][1])} and ${K.rate(b[3][1])}, the last one starting at ${K.usd(b[3][0])} for a single filer and ${K.usd(m[3][0])} for a joint return. The standard deduction starts at ${K.usd(s.income.std!.single)} single and ${K.usd(s.income.std!.mfj)} joint but phases out completely as income rises. A single freelancer with ${K.usd(75000)} of profit owes about ${K.usd(s.ex75.stateTax)} to Wisconsin and ${K.usd(s.ex75.total)} in total with federal income tax and self-employment tax. Estimated payments are required once you expect to owe at least $500. An LLC costs ${K.usd(s.llc.formation)} to form online and ${K.usd(s.llc.annual)} for each annual report, with no franchise or minimum tax. Wisconsin follows the S election and also lets S corporations and partnerships pay tax at the entity level at 7.9%. At ${K.usd(120000)} of profit and a ${K.usd(50000)} salary the election saves about ${K.usd(s.cmp.savings)}, after ${K.usd(s.cmp.scorp.suta)} of state unemployment tax.`,
  body: (h) => `<p>Most states give everyone the same standard deduction. Wisconsin uses a sliding one: the full ${K.usd(s.income.std!.single)} for a single filer at low income, reduced step by step as income rises, and gone at $136,453 single or $159,690 joint according to the ${h.ext('https://www.revenue.wi.gov/TaxForms2026/2026-Form1-ES-inst.pdf', '2026 Form 1-ES instructions')}. Inside that range each extra dollar of profit costs the bracket rate plus a slice of lost deduction. A single filer on ${K.usd(160000)} of profit, past the phase-out, owes about ${K.usd(high.stateTax)} to the state.</p>
<h2>The 2026 brackets</h2>
<p>The ${K.rate(b[1][1])} bracket was widened for 2026 and now reaches ${K.usd(b[2][0])} for single filers and ${K.usd(m[2][0])} for couples, which lowers the bill for middle incomes. Above that, ${K.rate(b[2][1])} applies up to ${K.usd(b[3][0])}, a wide band where most full-time freelancers sit. Joint brackets are wider than single ones, but not twice as wide, so two earning spouses can pay a little more together than apart. The ${h.a('state-income-tax', 'state income tax comparison')} places Wisconsin against Minnesota and Illinois.</p>
${h.mini('stateQuick', { s: 'wisconsin', p: 70000 })}
<h3>Estimated tax, charged as interest</h3>
<p>You need to pay estimates when you expect to owe at least $500 after withholding and credits. The safe harbor is 90% of the 2026 tax or 100% of the 2025 tax, and an underpayment is charged as interest on Schedule U, on the four federal dates. The ${h.a('quarterly-estimated-taxes', 'quarterly estimated taxes')} guide covers the federal payments made alongside.</p>
<h2>A low-maintenance LLC</h2>
<p>The Department of Financial Institutions charges ${K.usd(s.llc.formation)} for articles filed online and $170 on paper, per its ${h.ext('https://dfi.wi.gov/Pages/BusinessServices/BusinessEntities/Fees.aspx', 'fee page')}. The ${K.usd(s.llc.annual)} annual report is due ${s.llcDetail.due}. Wisconsin has no franchise tax or minimum tax on LLCs, so the state cost over five years is ${K.usd(s.cost5)}. A student entrepreneur can form an LLC with no filing fee using Form 502SE.</p>
<h2>Running payroll and the entity-level tax</h2>
<p>An S corporation paying its owner a salary registers with the Department of Workforce Development; a new employer outside construction pays ${K.rate(s.suta.rate)} on the first ${K.usd(s.suta.wageBase)} of wages. Wisconsin also offers an election for tax-option (S) corporations and partnerships to pay tax at 7.9% of Wisconsin net income at the entity level, explained on the ${h.ext('https://www.revenue.wi.gov/Pages/FAQS/ise-scorp-determinc.aspx', 'Department of Revenue FAQ')}. More than half of the shareholders must consent, and losses no longer pass through to owners. Because the 7.9% exceeds the top individual rate of ${K.rate(b[3][1])}, the attraction is the federal deduction for the entity's tax, a calculation best run with a CPA. The ${h.a('llc-vs-s-corp', 'LLC vs S corp page')} handles the payroll side.</p>`,
  faqs: [
    { q: 'At what income does the Wisconsin standard deduction disappear?', a: `For 2026 the standard deduction starts at ${K.usd(s.income.std!.single)} for a single filer and ${K.usd(s.income.std!.mfj)} for a joint return, then phases out and reaches zero at $136,453 single or $159,690 married filing jointly, according to the 2026 Form 1-ES instructions from the Wisconsin Department of Revenue.` },
    { q: 'How much does a Wisconsin LLC cost to form and keep?', a: `Articles of organization cost ${K.usd(s.llc.formation)} online or $170 on paper, and the annual report costs ${K.usd(s.llc.annual)} when filed online. It is due by the end of the calendar quarter of the LLC's anniversary. There is no franchise tax, so five years of state fees total ${K.usd(s.cost5)}.` },
    { q: 'What is the Wisconsin entity-level tax for S corporations?', a: 'It is an election that lets a tax-option (S) corporation or a partnership pay Wisconsin tax itself at 7.9% of Wisconsin net income instead of passing the income to its owners. It requires the consent of shareholders holding more than half of the shares, and losses do not pass through while it applies.' },
  ],
  related: ['state-income-tax', 'llc-vs-s-corp', 'quarterly-estimated-taxes', 'state:minnesota', 'state:illinois'],
});
