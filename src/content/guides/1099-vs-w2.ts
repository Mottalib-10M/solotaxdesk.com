import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const PR = P.payroll;
const EE = K.rate(PR.ssEmployee + PR.medicareEmployee);
const SE = K.rate(P.se.ssRate + P.se.medicareRate);
const hours = 1600, benefits = 9000;
const rows = [60000, 90000, 120000].map((s) => {
  const c = K.contractor(s, benefits, hours);
  return [K.usd(s), K.usd(c.employerFica), K.usd(benefits), K.usd(c.needed), `${K.cents(c.hourly)}/h`, `${K.cents(s / 2080)}/h`];
});
const salary = 90000, rate = 65;
const w = K.solo({ profit: 0, filing: 'single', w2Wages: salary });
const eeFica = Math.min(salary, P.se.wageBase['2026']) * PR.ssEmployee + salary * PR.medicareEmployee;
const wNet = salary - w.total - eeFica;
const gross = rate * hours;
const c = K.solo({ profit: gross, filing: 'single' });
const cNet = gross - c.total;
const need = K.contractor(salary, benefits, hours);

export default defineGuide({
  id: '1099-vs-w2',
  group: 'tax',
  order: 18,
  slug: '1099-vs-w2',
  nav: '1099 vs W-2',
  card: 'Contractor or employee: the tests, the taxes and the rate to ask',
  title: '1099 vs W2 2026: Taxes, IRS Control Tests and Pay Needed',
  description: `1099 vs W-2 in 2026: the IRS control tests, ${SE} SE tax against ${EE} withheld from pay, lost benefits and the hourly rate needed to match a salary.`,
  h1: '1099 vs W-2: contractor or employee, and what each costs you in 2026',
  intro: 'The form you receive is a consequence, not a choice: the work relationship decides it, and the tax bill follows.',
  resume: `A W-2 employee has ${EE} of Social Security and Medicare withheld from pay while the employer pays the same again, plus income tax withheld through Form W-4. A 1099 contractor pays both halves as self-employment tax, ${SE} on ${K.dec(P.se.factor * 100, 2)}% of profit, sends estimated payments four times a year and gets no paid leave, health plan or retirement match, but deducts business expenses and may claim the QBI deduction. Which one you are is not up to the paperwork: the IRS looks at whether the business has the right to control what you do and how you do it, through behavioral control, financial control and the type of relationship. To match a ${K.usd(salary)} salary with ${K.usd(benefits)} of benefits over ${K.num(hours)} billable hours, a contract must bring in ${K.usd(need.needed)}, about ${K.cents(need.hourly)} an hour, because the employer half of payroll tax, ${K.usd(need.employerFica)}, moves to you. The calculator compares the two take-home amounts for your state.`,
  tool: 'w2-vs-1099',
  body: (h) => `<p>Enter the salary you are offered or leaving, what the job's benefits are worth to you, the hourly rate of the contract and the hours you can realistically bill. The top figure is the rate at which the contract only matches the job; below it, you lose money by switching. The second line compares take-home pay after federal, SE and state tax, for a single filer with no business expenses on the contract side.</p>
${h.mini('payrollCost')}
<h2>"1099 employee" is a contradiction</h2>
<p>People say it all the time, but the two labels exclude each other. An employee receives a Form W-2 and has taxes withheld. A contractor runs a business, receives a Form 1099-NEC from clients who paid ${K.usd(P.infoReturns.necThreshold)} or more in 2026, and handles their own taxes. What matters is the substance: if an employer-employee relationship exists, it does not matter what the contract calls it or how the pay is measured (${h.src('p15', 'Publication 15')}).</p>
<h2>How the IRS draws the line</h2>
<p>Under the common-law rules, a worker is an employee when the business has the right to control what will be done and how it will be done, even if it never exercises that right in practice. The IRS groups the evidence into three categories (${h.src('contractor', 'IRS, independent contractor or employee')}).</p>
<h3>Behavioral control</h3>
<p>Does the business direct how you work: hours, methods, tools, training, the order of tasks? Instructions about results are compatible with contracting; instructions about the details of the job point to employment.</p>
<h3>Financial control</h3>
<p>Who carries the business side? A contractor typically invests in their own equipment, has unreimbursed expenses, can make or lose money, serves other clients and is paid by the job. A steady hourly wage with expenses reimbursed looks like a job.</p>
<h3>Type of relationship</h3>
<p>Written contracts help, but benefits such as a pension, insurance or vacation pay, an open-ended relationship, and work that is a key part of the company's regular business all lean toward employee status. When the answer is unclear, either the business or the worker can file Form SS-8 and ask the IRS to decide; the IRS warns this takes at least six months. A business that treats an employee as a contractor without a reasonable basis can be held liable for the employment taxes.</p>
<h2>The taxes on each side</h2>
<p>As an employee, you pay ${K.rate(PR.ssEmployee)} Social Security on wages up to ${K.usd(P.se.wageBase['2026'])} and ${K.rate(PR.medicareEmployee)} Medicare, and the employer matches both and also pays federal unemployment tax on the first ${K.usd(PR.futaWageBase)}. Income tax comes out of each paycheck. As a contractor, you pay ${SE} yourself, deduct half of it, and send ${h.a('quarterly-estimated-taxes', 'quarterly estimated payments')} because no one withholds anything. In exchange you deduct business expenses and may get the ${K.rate(P.qbi.rate)} QBI deduction, which wages never qualify for.</p>
${h.table(['Salary', 'Employer FICA you take on', 'Benefits', 'Contract income needed', `Hourly at ${K.num(hours)} h`, `Salary per hour at ${K.num(2080)} h`], rows, `What a 1099 contract must bring in to equal a W-2 job, 2026, ${K.usd(benefits)} of benefits`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The hours column is where most estimates go wrong. A salaried year is often quoted at ${K.num(2080)} hours, 40 a week for 52 weeks, but a contractor also spends time finding work, invoicing and on unpaid holidays. At ${K.num(hours)} billable hours, the break-even rate is far above the salary divided by ${K.num(2080)}.</p>
${h.mini('seQuick')}
<h2>Take-home on the same work</h2>
<p>A single person in a state without income tax, earning ${K.usd(salary)} on a W-2, keeps ${K.usd(wNet)} after federal income tax and the employee share of FICA, plus whatever the benefits are worth. Billing ${K.usd(rate)} an hour for ${K.num(hours)} hours brings in ${K.usd(gross)}; after ${K.usd(c.se.total)} of SE tax and ${K.usd(c.incomeTax)} of income tax, ${K.usd(cNet)} remains, before any health insurance or retirement savings. The ${h.a('1099-tax-calculator', '1099 tax calculator')} gives the detail for your state, and ${h.a('self-employed-tax-deductions', 'business deductions')} can narrow the gap.</p>
<h2>Statutory employees and the QBI catch</h2>
<p>A few workers sit in between. Some drivers who deliver food or laundry for a company, full-time life insurance agents working mainly for one insurer, certain home workers using the company's materials and full-time traveling salespeople can be employees by statute for Social Security and Medicare even when they are not under the common-law rules. Their W-2 has the statutory employee box checked, and they report income and expenses on Schedule C without paying SE tax on it. Leaving a job and returning as a contractor raises a different issue: if you keep providing substantially the same services to your former employer, the IRS presumes for three years that you are still an employee for the QBI deduction, a presumption you can rebut with contracts and similar evidence (${h.src('i8995', 'Form 8995 instructions')}).</p>
<h2>Being both at once</h2>
<p>Many people hold a job and freelance on the side. The wages on the W-2 use up the Social Security base first, so a high salary reduces the SE tax on the side income. The side profit, on the other hand, lands in your top bracket. You can cover the tax on it by raising withholding at the job with a new Form W-4 instead of making estimated payments (${h.src('f1040es', 'Form 1040-ES')}).</p>`,
  faqs: [
    { q: 'What does it mean to be a 1099 employee?', a: `The phrase is loose talk for an independent contractor paid on Form 1099-NEC. Legally you cannot be both: an employee gets a W-2 with taxes withheld, while a contractor runs a business, pays ${SE} self-employment tax and makes estimated payments. If the client controls how and when you work, you may in fact be an employee.` },
    { q: 'Is it better to be paid on a 1099 or a W-2?', a: `Only if the rate makes up for what you lose. A contractor pays the employer's share of FICA, ${K.rate(PR.ssEmployer + PR.medicareEmployer)} of pay, plus benefits and unpaid time. To match a ${K.usd(salary)} salary with ${K.usd(benefits)} of benefits at ${K.num(hours)} billable hours, the contract needs about ${K.cents(need.hourly)} an hour.` },
    { q: 'How much more should I charge as a contractor than my salary?', a: `Start from the salary, add the employer half of Social Security and Medicare and the value of benefits, then divide by hours you can really bill. For ${K.usd(60000)} with ${K.usd(benefits)} of benefits at ${K.num(hours)} hours, that is ${K.cents(K.contractor(60000, benefits, hours).hourly)} an hour, before business costs.` },
    { q: 'Who decides whether I am a contractor or an employee?', a: 'The facts of the relationship, under common-law rules the IRS groups into behavioral control, financial control and type of relationship. The label in a contract does not settle it. Either the worker or the business can file Form SS-8 for an official determination, which the IRS says takes at least six months.' },
    { q: 'Can my employer switch me from W-2 to 1099 for the same job?', a: 'Not by relabeling alone. If the company still controls what you do and how you do it, you remain an employee for tax purposes, whatever the paperwork says. A business that treats an employee as a contractor without a reasonable basis can be held liable for the employment taxes it should have withheld and paid.' },
  ],
  related: ['1099-tax-calculator', '1099-forms', 'self-employment-tax-rate', 'how-much-to-set-aside', 'quarterly-estimated-taxes'],
  sources: ['contractor', 'p15', 'f1040es', 'i1040sse', 'rp_2025_32'],
});
