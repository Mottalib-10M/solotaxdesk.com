import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const H = P.homeOffice;
const gross = 90000, other = 14000, miles = 6000, sq = 150;
const car = K.mileage(miles / 2, miles / 2);
const home = K.homeOffice(sq, 0, 0).simplified;
const net = gross - other - car - home;
const se = K.se(net);
const fed = K.solo({ profit: net, filing: 'single' });
const keyLines: Array<[string, string]> = [
  ['Line 1', 'Gross receipts, including everything shown on Forms 1099-NEC and 1099-K'],
  ['Line 7', 'Gross income, after returns, cost of goods sold and other business income'],
  ['Line 9', 'Car and truck: standard mileage rate or the business share of actual costs'],
  ['Line 13', 'Depreciation and section 179 expense, from Form 4562'],
  ['Line 23', 'Business taxes and licenses (never federal income or SE tax)'],
  ['Lines 24a, 24b', 'Travel away from your tax home; business meals at 50%'],
  ['Line 30', 'Business use of your home: Form 8829 or the simplified method'],
  ['Line 31', 'Net profit or loss, carried to Schedule 1 and Schedule SE'],
];

export default defineGuide({
  id: 'schedule-c',
  group: 'tax',
  order: 14,
  slug: 'schedule-c',
  nav: 'Schedule C',
  card: 'Who files it, the main lines and what lands on line 31',
  title: 'Schedule C 2026: Lines, Expenses and the Line 31 Profit',
  description: `Schedule C for 2026: who files it, the income and expense lines, mileage at ${K.dec(P.mileage.h1 * 100, 1)} then ${K.dec(P.mileage.h2 * 100, 0)} cents, the $${H.simplifiedRate} home office method and the net profit on line 31.`,
  h1: 'Schedule C: the profit or loss form for sole proprietors in 2026',
  intro: 'Schedule C is where a one-person business shows the IRS what came in, what went out and what was left; every other self-employment figure starts from its bottom line.',
  resume: `Schedule C (Form 1040), Profit or Loss From Business, is filed by sole proprietors, independent contractors and single-member LLCs that have not elected corporate tax treatment. Part I adds up gross receipts, including amounts reported to you on Forms 1099-NEC and 1099-K; Part II lists expenses by category; line 31 shows the net profit or loss. That figure goes to Schedule 1 for income tax and to Schedule SE for self-employment tax, so each deductible dollar lowers both. For 2026 the car line uses ${K.dec(P.mileage.h1 * 100, 1)} cents a business mile through June 30 and ${K.dec(P.mileage.h2 * 100, 0)} cents from July 1, and the simplified home office line allows $${H.simplifiedRate} a square foot up to ${H.simplifiedMaxSqft} square feet. A freelancer with ${K.usd(gross)} of receipts, ${K.usd(other)} of other expenses, ${K.num(miles)} business miles and a ${sq} square foot office ends with ${K.usd(net)} on line 31 and owes ${K.usd(se.total)} of SE tax on it. A hobby is not a business and does not belong on this form.`,
  tool: 'schedule-c',
  body: (h) => `<p>The calculator takes gross receipts, cost of goods sold, your other expenses, the miles you drove for work and the size of a home office, and returns the line 31 profit with the self-employment tax it triggers. Mileage is split evenly between the two halves of 2026 because the IRS raised the rate on July 1 (${h.src('mileage', 'IRS standard mileage rates')}). The home office uses the simplified method; the regular method has its own ${h.a('home-office-deduction', 'home office calculator')}.</p>
${h.mini('miles')}
<h2>Who files Schedule C</h2>
<p>The form is for a business you run as a sole proprietor: an activity whose main purpose is income or profit, carried on with continuity and regularity (${h.src('i1040sc', 'Schedule C instructions')}). Freelancers, gig workers, consultants and shop owners without a company all use it. A single-member LLC files it too, because the IRS disregards the LLC for income tax unless it elects to be taxed as a corporation. Statutory employees report their W-2 wages and expenses on it as well.</p>
<h3>Spouses and partnerships</h3>
<p>Two spouses who own and run a business together are partners by default and file Form 1065 instead. They can avoid that by electing qualified joint venture status, in which each spouse files a Schedule C for a share of the business, or, in a community property state, by treating the business they wholly own as a sole proprietorship. A business held through an LLC cannot make the joint venture election.</p>
<h3>A hobby is not a business</h3>
<p>Sporadic activity, a pastime, or something done mainly for recreation does not qualify. Income from it goes on Schedule 1 as other income, and expenses from an activity not engaged in for profit cannot create a loss that offsets your other income (${h.src('p334', 'Publication 334')}). The test is your purpose and how you conduct the activity, not whether it happens to make money one year.</p>
<h2>The header and Part I</h2>
<p>Before the numbers, the top of the form asks for your business activity code, your accounting method on line F and whether you materially participated on line G. Most freelancers use the cash method: income counts when it is received or made available to you, and expenses when paid. Accrual is required for inventory purchases and sales unless you qualify as a small business taxpayer. Changing method later generally needs Form 3115.</p>
<p>Line 1 is gross receipts. It should include everything clients paid, and if the totals on your 1099-NEC forms exceed what you report, attach a statement explaining the difference. Income without a form is still income. Sellers subtract cost of goods sold, figured in Part III, to reach gross income on line 7.</p>
${h.table(['Line', 'What it holds'], keyLines, 'Lines of Schedule C that most freelancers use', ['l', 'l'])}
<h2>Part II, the expense lines</h2>
<p>Expenses go in named categories: advertising, car and truck, contract labor, depreciation, insurance, legal and professional fees, office expense, rent, supplies, taxes and licenses, travel, meals and utilities. Anything that fits none of them is listed in Part V and totaled on line 27b. A few rules catch people out. Business meals are deductible at ${h.src("i1040sc", "50%")}. Line 23 takes state and local business taxes and licenses, but never your federal income tax or SE tax. Health insurance for yourself is not a Schedule C expense; it goes on Schedule 1, line 17, which the ${h.a('self-employed-health-insurance', 'health insurance deduction page')} covers.</p>
<h3>Line 9, the car</h3>
<p>You choose between actual costs and the standard mileage rate. With the rate, multiply business miles by ${K.dec(P.mileage.h1 * 100, 1)} cents for January to June and ${K.dec(P.mileage.h2 * 100, 0)} cents for July to December, then add parking and tolls; depreciation and lease payments are not deducted separately. You can use the rate on an owned car only if you used it in the first year the car was in service. Vehicle details go in Part IV unless Form 4562 is required anyway.</p>
<h3>Line 30, the home office</h3>
<p>The home office deduction comes after the other expenses, because it can be limited by the profit they leave. You can use Form 8829 with actual costs, or the simplified method: $${H.simplifiedRate} times the square feet used regularly and exclusively for business, up to ${H.simplifiedMaxSqft}. You pick the method each year.</p>
<h3>Records behind the numbers</h3>
<p>Schedule C itself asks for totals, not receipts, but every line needs support if the IRS asks. Keep invoices and bank deposits for line 1, receipts and statements for each expense, a mileage log with dates, destinations and purpose for line 9, and the measurements of the office for line 30. Line I asks whether you made payments that required you to file Forms 1099, which matters if you paid subcontractors.</p>
<h2>Line 31 and where it goes</h2>
<p>Line 31 is gross income minus all expenses. A profit flows to Schedule 1, line 3, for income tax, and to Schedule SE, line 2, for self-employment tax. In the example above, ${K.usd(gross)} of receipts less ${K.usd(other)} of expenses, ${K.usd(car)} of mileage and ${K.usd(home)} for the office gives ${K.usd(net)}. That profit carries ${K.usd(se.total)} of SE tax and, for a single filer with no other income, ${K.usd(fed.incomeTax)} of federal income tax after a QBI deduction of ${K.usd(fed.qbi.deduction)}. A loss may be limited by the at-risk, passive activity and excess business loss rules before it reaches line 31. The ${h.a('schedule-se', 'Schedule SE guide')} picks up from here.</p>`,
  faqs: [
    { q: 'Who has to file a Schedule C?', a: 'Anyone who ran a business as a sole proprietor during the year, including independent contractors, gig workers and single-member LLCs that did not elect corporate treatment. The activity must aim at profit and be carried on with continuity and regularity. Statutory employees also use it. A hobby or a sporadic activity is reported elsewhere, on Schedule 1.' },
    { q: 'Can I file Schedule C if I did not receive a 1099?', a: `Yes, and you must report the income anyway. Line 1 covers all gross receipts, with or without a form. Clients send Form 1099-NEC only when they paid you ${K.usd(P.infoReturns.necThreshold)} or more in 2026, so many smaller jobs never produce one. Keep your own invoices and deposit records as proof of what you earned.` },
    { q: 'What expenses can I deduct on Schedule C?', a: `Ordinary and necessary business costs: supplies, software, advertising, contract labor, insurance, rent, business taxes and licenses, travel, half of business meals, car use at ${K.dec(P.mileage.h1 * 100, 1)} or ${K.dec(P.mileage.h2 * 100, 0)} cents a mile in 2026, and a home office. Federal income tax, SE tax and your own health premiums are not Schedule C expenses.` },
    { q: 'What happens if Schedule C shows a loss?', a: 'The loss reduces your other income on Form 1040, after the at-risk rules, the passive activity rules and the excess business loss limit on Form 461 are applied. Any part disallowed by that last limit becomes a net operating loss carried forward. A loss also means no SE tax for that business, though other businesses are combined on Schedule SE.' },
    { q: 'Does a single-member LLC file Schedule C or Form 1065?', a: 'Schedule C. A domestic LLC with one owner is disregarded for federal income tax, so its income and expenses go on the owner\'s Schedule C, unless it elected to be taxed as a corporation on Form 8832 or as an S corporation on Form 2553. An LLC with two or more members files Form 1065 by default.' },
  ],
  related: ['schedule-se', 'home-office-deduction', 'mileage-deduction', 'self-employed-tax-deductions', 'single-member-llc'],
  sources: ['i1040sc', 'p334', 'mileage', 'home_office', 'smllc'],
});
