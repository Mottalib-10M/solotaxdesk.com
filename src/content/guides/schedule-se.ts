import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const SE = K.rate(P.se.ssRate + P.se.medicareRate);
const F = `${K.dec(P.se.factor * 100, 2)}%`;
const wb = P.se.wageBase['2026'];
const r = K.se(70000);
const w = K.se(70000, 'single', 140000);
const tiny = K.se(430);
const lines: Array<[string, string, string, string]> = [
  ['Line 2', 'Net profit from Schedule C, line 31', K.usd(70000), K.usd(70000)],
  ['Line 4a', `${F} of line 3`, K.usd(r.netEarnings), K.usd(w.netEarnings)],
  ['Line 8a', 'W-2 wages already taxed for Social Security', K.usd(0), K.usd(140000)],
  ['Social Security part', `${K.rate(P.se.ssRate)} of the earnings left under ${K.usd(wb)}`, K.usd(r.ss), K.usd(w.ss)],
  ['Medicare part', `${K.rate(P.se.medicareRate)} of line 4a`, K.usd(r.medicare), K.usd(w.medicare)],
  ['SE tax', 'to Schedule 2, line 4', K.usd(r.total), K.usd(w.total)],
  ['Deduction', 'half of the SE tax, to Schedule 1, line 15', K.usd(r.half), K.usd(w.half)],
];

export default defineGuide({
  id: 'schedule-se',
  group: 'tax',
  order: 13,
  slug: 'schedule-se',
  nav: 'Schedule SE',
  card: 'The self-employment tax form, line by line',
  title: 'Schedule SE 2026: Line by Line, Who Files and Half Deduction',
  description: `Schedule SE for 2026, line by line: who files at ${K.usd(P.se.minimumNet)} of net earnings, the ${F} step, wages on line 8a, the ${K.usd(wb)} cap and the half you get to deduct.`,
  h1: 'Schedule SE: filling in the self-employment tax form for 2026',
  intro: 'Schedule SE turns the bottom line of your business into Social Security and Medicare tax; here is what each part of it does with your numbers.',
  resume: `Schedule SE is the page of Form 1040 that computes self-employment tax. You file it when net earnings on line 4c reach ${K.usd(P.se.minimumNet)}, or when you had church employee income above a small separate threshold. Line 2 takes the net profit from Schedule C, line 31, line 4a multiplies it by ${F}, and the tax is ${K.rate(P.se.ssRate)} for Social Security on the part of net earnings under ${K.usd(wb)} for 2026 plus ${K.rate(P.se.medicareRate)} for Medicare on all of it. W-2 wages that already carried Social Security tax go on line 8a and shrink the room under the cap. With ${K.usd(70000)} of profit and no job, the form ends at ${K.usd(r.total)} of SE tax, carried to Schedule 2, and a deduction of ${K.usd(r.half)} that goes to Schedule 1, line 15. Spouses with their own business income each file a separate Schedule SE; one person with several businesses combines them on a single form.`,
  tool: 'se',
  body: (h) => `<p>The calculator above follows Schedule SE in order: profit in, net earnings at ${F}, Social Security up to the base, Medicare on everything, then the half that comes off your income. Enter the profit from all your businesses together and any W-2 wages, and each line of the form shows on the result card. The figures below use the line numbers of the current form as described in the ${h.src('i1040sse', 'IRS instructions for Schedule SE')}.</p>
${h.mini('schedC')}
<h2>Who has to file it</h2>
<p>The trigger is net earnings, not gross receipts. If line 4c, which is your profit after the ${F} step, comes to ${K.usd(P.se.minimumNet)} or more, the form is required. A business that billed a lot but ended with a loss does not file it, unless you choose an optional method described below. Two exceptions stand apart. Church employees whose employer opted out of Social Security owe the tax on wages of ${h.src('i1040sse', '$108.28 or more')}, reported on line 5a. Ministers and members of certain religious sects who received IRS approval of Form 4361 or Form 4029 may not need to file it at all.</p>
<h3>Several businesses, one form</h3>
<p>If you run two activities, a design studio and a weekend photography business for instance, their profits and losses are added on one Schedule SE. A loss in one reduces the earnings from the other. Married couples filing jointly are the opposite case: each spouse with self-employment income files a separate Schedule SE, because each has their own Social Security record.</p>
<h2>Part I, line by line</h2>
<p>Lines 1a and 1b concern farm income and conservation payments. Most contractors start at line 2, where the net profit from ${h.src('i1040sc', 'Schedule C, line 31')} goes; partners enter the amount from box 14, code A of their K-1. Line 3 adds these together. Line 4a multiplies line 3 by ${F}, the step that treats you like an employee whose employer's half is not part of pay. If that result is under ${K.usd(P.se.minimumNet)}, you stop.</p>
${h.table(['Line', 'What goes there', 'No job', `With ${K.usd(140000)} of wages`], lines, `Schedule SE for ${K.usd(70000)} of Schedule C profit, 2026 figures`, ['l', 'l', 'r', 'r'])}
<p>The wage column shows why line 8a matters. A job paying ${K.usd(140000)} leaves only ${K.usd(wb - 140000)} of room under the ${K.usd(wb)} base, so the Social Security part falls to ${K.usd(w.ss)} while Medicare stays at ${K.usd(w.medicare)}. Leaving wages off line 8a overstates the tax. Statutory employees, whose W-2 has box 13 checked, report their Schedule C profit for income tax but leave it off Schedule SE, because Social Security was already withheld.</p>
<h3>The deduction at the bottom</h3>
<p>Part I ends with half of the tax. That amount moves to Schedule 1, line 15, where it lowers adjusted gross income whether or not you itemize. It does not lower the SE tax itself and does not change line 4a. In the example, ${K.usd(r.half)} comes off income, which at the ${K.rate(P.brackets.single[1][1])} bracket saves about ${K.usd(r.half * P.brackets.single[1][1])} of income tax. The ${h.a('self-employment-tax-rate', 'self-employment tax rate page')} explains why the rate stands at ${SE}.</p>
<h2>The Additional Medicare Tax is not on this form</h2>
<p>Schedule SE stops at the regular ${K.rate(P.se.medicareRate)} Medicare tax. When the earnings on line 6, added to wages, pass ${K.usd(P.additionalMedicare.threshold.single)} single, ${K.usd(P.additionalMedicare.threshold.mfj)} joint or ${K.usd(P.additionalMedicare.threshold.mfs)} separate, the extra ${K.rate(P.additionalMedicare.rate)} is computed on Form 8959. Your wages reduce the threshold that applies to self-employment income (${h.src('i8959', 'Form 8959 instructions')}).</p>
<h2>Part II: the optional methods</h2>
<p>Part II exists for people with a loss or a very small profit who want Social Security credit anyway, or whose earned income credit, additional child tax credit or child care credit would rise with higher earnings. Under the nonfarm optional method you may report two-thirds of gross nonfarm income as net earnings, within a yearly dollar cap printed in the instructions. You must be regularly self-employed, meaning actual net earnings of ${K.usd(P.se.minimumNet)} or more in two of the three prior years, and the method can be used for five years in a lifetime. It can increase your SE tax, and you may switch back later on an amended return. Farmers have a parallel farm optional method.</p>
<h2>Errors that change the result</h2>
<p>Three slips come up again and again. The first is entering gross receipts instead of the Schedule C net profit on line 2, which taxes your expenses. The second is forgetting line 8a when a job already paid Social Security tax, so the form charges ${K.rate(P.se.ssRate)} twice on the same slice of the base. The third is filing one Schedule SE for a couple when both spouses had business income, which merges two earnings records and can put the combined amount over the cap. Software usually catches the first one; the other two depend on what you type.</p>
<h2>What does not belong on Schedule SE</h2>
<p>Several kinds of income stay off the form: rent from real estate when you are not a dealer, dividends and interest unrelated to the business, gains on selling property that is not inventory, and notary fees. If notary work is your only self-employment, you do not file the form. The net profit itself is built on ${h.a('schedule-c', 'Schedule C')}, so every deduction you claim there lowers line 2 here. The full yearly bill, with income tax, is in the ${h.a('1099-tax-calculator', '1099 tax calculator')}.</p>`,
  faqs: [
    { q: `Do I need to file Schedule SE if I made less than ${K.usd(P.se.minimumNet)}?`, a: `No, if your net earnings, which are ${F} of net profit, stay under ${K.usd(P.se.minimumNet)}. A profit of ${K.usd(430)} gives net earnings of ${K.usd(tiny.netEarnings)}, so no form and no SE tax. You may still choose to file it under an optional method to earn Social Security credit. Income tax rules are separate and can still apply.` },
    { q: 'Where does the Schedule SE deduction go on Form 1040?', a: `Half of the SE tax goes to Schedule 1 (Form 1040), line 15, as an adjustment to income. It lowers adjusted gross income without itemizing. The full SE tax itself goes to Schedule 2, line 4. For ${K.usd(70000)} of profit and no wages, the tax is ${K.usd(r.total)} and the deduction ${K.usd(r.half)}.` },
    { q: 'Do my spouse and I file one Schedule SE or two?', a: 'Two, when both of you have self-employment income, even on a joint return: each spouse files a separate Schedule SE because each has an individual Social Security record. If only one spouse runs the business, only that spouse files it. A couple running a business together may elect qualified joint venture status, and each then reports a share.' },
    { q: 'What W-2 wages go on line 8a of Schedule SE?', a: `Wages and tips from your W-2 forms on which Social Security tax was already withheld during the year. They use up the ${K.usd(wb)} base first, so only the remaining room is taxed at ${K.rate(P.se.ssRate)}. With ${K.usd(140000)} of wages and ${K.usd(70000)} of profit, SE tax falls to ${K.usd(w.total)}.` },
  ],
  related: ['self-employment-tax-rate', 'schedule-c', '1099-tax-calculator', 'self-employed-tax-deductions'],
  sources: ['i1040sse', 'i1040sc', 'i8959', 'p334', 'f1040es'],
});
