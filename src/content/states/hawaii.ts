import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('hawaii');
const b = s.income.brackets!.single;
const outline = 'https://files.hawaii.gov/tax/news/pubs/25outline.pdf';
const ann = 'https://files.hawaii.gov/tax/news/announce/ann24-03.pdf';
const getOn75 = 75000 * 0.045;

export default defineState({
  slug: 'hawaii',
  title: 'Hawaii General Excise Tax 2026 for Freelancers and LLCs',
  description: `Hawaii 2026: freelancers owe 4% general excise tax plus a 0.5% county surcharge on gross receipts, then income tax from ${K.rate(b[0][1])} to ${K.rate(b[b.length - 1][1])} on their net profit.`,
  intro: 'Hawaii taxes a freelancer twice over: once on what clients pay, through the general excise tax, and again on the profit, through one of the steepest income tax schedules in the country.',
  resume: `A self-employed person in Hawaii pays general excise tax of 4% on gross receipts, professional services included, plus a 0.5% county surcharge in all four counties, and then income tax on the profit. The excise tax is on revenue, not profit: ${K.usd(75000)} of fees carries ${K.usd(getOn75)} of it before any expense is deducted. Income tax rates run from ${K.rate(b[0][1])} on the first ${K.usd(b[1][0])} to ${K.rate(b[b.length - 1][1])} above ${K.usd(b[b.length - 1][0])} for a single filer, after a standard deduction raised to ${K.usd(s.income.std!.single)} for 2026. On ${K.usd(75000)} of profit that is about ${K.usd(s.ex75.stateTax)} of Hawaii income tax and ${K.usd(s.ex75.total)} in all, excise tax not included. An LLC costs ${K.usd(s.llc.formation!)} to form. Hawaii follows the S election, but the excise tax applies to an S corporation like any business. With ${K.usd(120000)} of profit and a ${K.usd(50000)} salary, the election saves about ${K.usd(s.cmp.savings)} a year.`,
  body: (h) => `<p>Hawaii reaches almost every service a freelancer sells with a tax on gross receipts. Its general excise tax is charged to the business, not the customer, at 4% of gross income, with a 0.5% rate on wholesale activities; a one-time $20 license is needed to report it (${h.ext(outline, 'Outline of the Hawaii tax system')}). Each of the four counties adds a 0.5% surcharge on income taxed at 4%, in force through December 31, 2030 (${h.ext('https://tax.hawaii.gov/geninfo/countysurcharge/', 'DOTAX, county surcharge')}). The calculator on this page covers income and self-employment tax only, so the excise tax comes on top of its total.</p>
<h2>A schedule that climbs quickly</h2>
<p>Hawaii's twelve brackets start at ${K.rate(b[0][1])} and reach ${K.rate(b[6][1])} by ${K.usd(b[6][0])} of taxable income for a single filer, a level most full-time freelancers pass. The 2026 standard deduction of ${K.usd(s.income.std!.single)} single and ${K.usd(s.income.std!.mfj)} joint is close to double the earlier amount; Act 46 of 2024 kept the 2025 brackets for 2026 and widens them again in 2027 and 2029 (${h.ext(ann, 'DOTAX Announcement 2024-03')}).</p>
${h.mini('stateQuick', { s: 'hawaii', p: 75000 })}
<p>Estimated income tax payments are filed with Form N-200V. Hawaii's due dates do not fall on the 15th as federal ones do, so check them in the department's own calendar rather than copying the dates in the ${h.a('quarterly-estimated-taxes', 'federal estimated tax guide')}. The ${h.a('how-much-to-set-aside', 'set-aside guide')} helps turn both taxes into a share of each payment received.</p>
<h2>S corporation owners</h2>
<p>The S election does not touch the excise tax: the corporation reports its gross receipts and pays it exactly as an LLC would. What changes is payroll. Unemployment insurance for 2026 is on schedule C, with a new employer rate of ${K.rate(s.suta.rate!)} on wages up to ${K.usd(s.suta.wageBase!)}, a far higher wage base than most states use, plus a 0.01% employment and training assessment (${h.ext('https://labor.hawaii.gov/ui/tax-rate-schedule-and-weekly-benefit-amount/', 'Hawaii DLIR, 2026 rate schedule')}). On a ${K.usd(50000)} owner salary that is ${K.usd(s.cmp.scorp.suta)}, which is why the ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} shows a smaller saving here than in Florida or Alaska.</p>
<p>Partnerships and S corporations can elect to pay Hawaii income tax at the entity level; for taxable years beginning after December 31, 2023 the elective rate is 9%, with no separate rate for capital gains (${h.ext(outline, 'DOTAX outline, PTE tax')}).</p>
<h3>The LLC paperwork</h3>
<p>Articles of Organization (Form LLC-1) cost $50 plus a $1 State Archives fee, ${K.usd(s.llc.formation!)} in all, with $25 more for expedited review (${h.ext('https://cca.hawaii.gov/breg/registration/dllc/fees/', 'DCCA business registration fees')}). The annual report is due during the calendar quarter in which the LLC was registered. Two official pages show different amounts for it, so this page leaves it out of the totals.</p>`,
  faqs: [
    { q: 'Do Hawaii freelancers pay general excise tax on services?', a: `Yes. Hawaii's general excise tax applies to gross income from professional and personal services as well as sales, at 4%, plus a 0.5% county surcharge in every county. It is due on revenue before expenses, so ${K.usd(75000)} of fees carries ${K.usd(getOn75)} of excise tax. A one-time $20 license is needed, and the tax is separate from income tax.` },
    { q: 'What is the Hawaii standard deduction for 2026?', a: `${K.usd(s.income.std!.single)} for a single filer and ${K.usd(s.income.std!.mfj)} for a joint return, close to double the earlier amounts, under Act 46 of 2024. The same law kept the 2025 brackets for 2026 and widens them in 2027 and again in 2029. Rates still run from ${K.rate(b[0][1])} to ${K.rate(b[b.length - 1][1])}.` },
    { q: 'Does the S election change the Hawaii excise tax?', a: 'No. The general excise tax is charged on the gross receipts of the business, whatever its legal form or federal tax election. An S corporation reports and pays it like a sole proprietor or an LLC. The election only affects income tax and payroll, where Hawaii adds unemployment insurance on a high wage base.' },
  ],
  related: ['how-much-to-set-aside', 'llc-vs-s-corp', 'state-income-tax', 'state:california', 'state:alaska'],
});
