import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const I = P.infoReturns;
const BW = K.rate(0.24);
const small = 1800;
const seSmall = K.se(small);
const mix = [[1500, 'no'], [2000, 'yes'], [6500, 'yes']] as const;
const rows = mix.map(([amt, form]) => {
  const r = K.se(amt);
  return [K.usd(amt), form, K.usd(r.total), K.usd(amt)];
});
const threeClients = 1500 * 3;
const three = K.se(threeClients);

export default defineGuide({
  id: '1099-forms',
  group: 'tax',
  order: 20,
  slug: '1099-forms',
  nav: '1099 forms',
  card: 'The $2,000 1099-NEC rule, 1099-K thresholds and the W-9',
  title: '1099 Form 2026: NEC Threshold, 1099-K and the W-9 Explained',
  description: `1099 forms for contractors in 2026: 1099-NEC at ${K.usd(I.necThreshold)} paid, 1099-K over ${K.usd(I.kThresholdAmount)} and ${I.kThresholdCount} payments, the W-9, backup withholding and income taxed without a form.`,
  h1: '1099 forms for independent contractors in 2026',
  intro: 'Which forms a client or a payment app must send you, what changed for payments made in 2026, and why the absence of a form changes nothing about the tax.',
  resume: `An independent contractor usually meets two information returns. Form 1099-NEC reports nonemployee compensation: for payments made after 2025, a business must file one when it pays you ${K.usd(I.necThreshold)} or more for services in the year, up from the old ${K.usd(600)} rule, under Rev. Proc. 2025-32 and the 2025 law known as the OBBBA. Form 1099-K comes from payment platforms, and only when your payments through one platform exceed ${K.usd(I.kThresholdAmount)} and number more than ${I.kThresholdCount} in the calendar year. Before paying, a client may ask you for Form W-9 with your taxpayer identification number; without it, the client may have to withhold ${BW} as backup withholding, and the threshold for that rule moved to ${K.usd(I.necThreshold)} as well. None of these thresholds decides what is taxable. Every dollar of business income goes on Schedule C, line 1, whether or not a form arrives: a client who paid you ${K.usd(small)} sends nothing, yet it still carries ${K.usd(seSmall.total)} of self-employment tax.`,
  tool: 'nec',
  body: (h) => `<p>The checker above answers a narrow question: given what one client paid you in 2026, and what flowed through one payment app, which forms should reach you early next year? It also shows the self-employment tax on that client's payments, as a reminder that the form is only a report. The tax comes from your own records.</p>
${h.mini('invoice')}
<h2>Form 1099-NEC</h2>
<p>NEC stands for nonemployee compensation. Box 1 shows what a business paid you for services during the year as someone who is not its employee. For years the trigger was ${K.usd(600)}. For payments made after December 31, 2025, the base threshold under section 6041(a) is ${K.usd(I.necThreshold)} (${h.src('rp_2025_32', 'Rev. Proc. 2025-32, section 2.15')}), and it will be indexed for inflation after 2026 (${h.src('p15', 'Publication 15')}). A client who paid you ${K.usd(1500)} in 2026 owes you no form; one who paid ${K.usd(2000)} does.</p>
<h3>New boxes for tips and overtime</h3>
<p>The 2026 form also carries qualified tips in box 1b and the tipped occupation code in box 1c, plus qualified overtime in box 1d, for the new deductions claimed on Schedule 1-A (${h.src('f1040es', 'Form 1040-ES 2026')}). Most contractors will see those boxes empty.</p>
<h2>Form 1099-K</h2>
<p>A payment app, marketplace or other third party settlement organization reports the gross amount it settled for you on Form 1099-K. It must file only when, for the calendar year, the total exceeds ${K.usd(I.kThresholdAmount)} and the number of transactions exceeds ${I.kThresholdCount} (${h.src('i1099k', 'Form 1099-K instructions')}). Both conditions must be met. The amount is gross: it includes the platform's fees and any refunds, so it rarely equals your profit; your own records of fees and refunds explain the gap.</p>
${h.table(['Paid by one client in 2026', '1099-NEC required', 'SE tax on it', 'Taxable on your return'], rows, `What the ${K.usd(I.necThreshold)} rule changes, and what it does not`, ['l', 'l', 'r', 'r'])}
<h2>Form W-9 and backup withholding</h2>
<p>A business that has to report your payments needs your Social Security number or employer identification number, and it asks for it on Form W-9. If you do not provide a correct number, it must generally withhold ${BW} of the payments and send it to the IRS as backup withholding (${h.src('p15', 'Publication 15')}). For payments made in 2026, the threshold for backup withholding on these reportable payments rose from ${K.usd(600)} to ${K.usd(I.necThreshold)}, the same as the reporting threshold. Backup withholding is not lost: it shows on the 1099 and counts as tax paid on your return. Filling in the W-9 promptly avoids the cash flow hit.</p>
<h2>No form, same tax</h2>
<p>The thresholds tell businesses when to report. They do not tell you when to pay. The ${h.src('i1040sc', 'Schedule C instructions')} ask you to report all business income from all sources on line 1, and to attach an explanation if the 1099-NEC amounts are larger than what you report. Three clients paying ${K.usd(1500)} each produce no forms at all, yet ${K.usd(threeClients)} of profit carries ${K.usd(three.total)} of SE tax. Income received by check, cash, bank transfer or through a platform under its threshold is treated the same way.</p>
${h.mini('schedC')}
<h3>When the form is wrong</h3>
<p>A form can show the wrong amount, the wrong year or a payment that was never yours. Ask the payer for a corrected form. If none comes, report what you actually received and keep the evidence; the instructions allow a statement explaining the difference.</p>
<h2>Reconciling the forms with your books</h2>
<p>Treat the 1099s you receive as a cross-check, not as the source of your income figure. Under the cash method most freelancers use, income counts in the year it is actually or constructively received, meaning credited to your account or made available to you without restriction (${h.src('i1040sc', 'Schedule C instructions')}). A client's form may follow its own payment dates. Platforms report gross settlements, before their fees and your refunds. And amounts paid by clients below the threshold appear on no form at all. A simple ledger with the date, client and amount of every deposit lets you add up line 1 in minutes and explain any gap if the IRS matches a form against your return.</p>
<h2>When you are the one paying</h2>
<p>Freelancers who hire subcontractors are payers too. If your business pays a contractor ${K.usd(I.necThreshold)} or more for services in 2026, you file a 1099-NEC for them, after collecting their W-9. Schedule C asks on line I whether you made payments that required Forms 1099. A business filing ten or more information returns in total must file them electronically (${h.src('i1040sc', 'Schedule C instructions')}).</p>
<h2>What to do with the forms you receive</h2>
<p>Match each 1099 against your records, add every receipt to Schedule C, line 1, and deduct your costs; the result feeds the ${h.a('schedule-c', 'Schedule C calculator')} and from there the ${h.a('1099-tax-calculator', '1099 tax calculator')}. The forms arrive after the year ends, but the tax is due as you earn, through ${h.a('quarterly-estimated-taxes', 'quarterly estimated payments')}. Whether you should be on a 1099 at all is a question of control, covered in ${h.a('1099-vs-w2', '1099 vs W-2')}.</p>`,
  faqs: [
    { q: `Do I have to pay taxes on 1099 income under ${K.usd(I.necThreshold)}?`, a: `Yes. The ${K.usd(I.necThreshold)} figure only decides whether a client files Form 1099-NEC for payments made in 2026. All business income is taxable, with or without a form. Once your net earnings for the year reach ${K.usd(P.se.minimumNet)}, self-employment tax applies too, and income tax follows the usual rules.` },
    { q: 'What is the 1099-NEC threshold for 2026?', a: `${K.usd(I.necThreshold)} paid to one person for services during the year, for payments made after December 31, 2025, according to Rev. Proc. 2025-32 section 2.15. It replaced the ${K.usd(600)} threshold that applied before and will be adjusted for inflation after 2026.` },
    { q: 'When does a payment app send a 1099-K?', a: `When, for the calendar year, the gross payments it settled for you exceed ${K.usd(I.kThresholdAmount)} and the number of transactions exceeds ${I.kThresholdCount}, according to the Form 1099-K instructions. Both tests must be met. Below that, no form, but the business income is still reportable on Schedule C.` },
    { q: 'Why does a client want a W-9 from me?', a: `To get your taxpayer identification number for the 1099 it may have to file. If you do not give a correct number, the client generally has to withhold ${BW} of reportable payments as backup withholding. That amount is credited to you on your return, but it delays the cash until you file.` },
    { q: 'Is a contractor the same as a 1099 contractor?', a: 'In everyday use, yes: "1099 contractor" means an independent contractor whose clients report payments on Form 1099-NEC. What makes you a contractor is the relationship, not the form. A worker the client controls like an employee should receive a W-2 even if a 1099 was issued, and a contractor paid under the threshold gets no form at all.' },
  ],
  related: ['1099-tax-calculator', '1099-vs-w2', 'schedule-c', 'quarterly-estimated-taxes', 'how-much-to-set-aside'],
  sources: ['rp_2025_32', 'i1099k', 'p15', 'i1040sc', 'f1040es', 'p334'],
});
