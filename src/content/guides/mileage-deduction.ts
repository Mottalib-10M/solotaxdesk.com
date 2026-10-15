import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const M = K.P.mileage;
const c = (x: number) => K.dec(Math.round(x * 1000) / 10, 1);
const h1 = c(M.h1), h2 = c(M.h2), y25 = c(M.y2025), charity = c(M.charity);
const from = K.day(M.h2From);
const profit = 70000;
const fedAt = (p: number) => K.solo({ profit: p, filing: 'single' }).federalTotal;
const totals = [5000, 10000, 15000, 20000, 25000];
const rows = totals.map((t) => {
  const d = K.mileage(t / 2, t / 2);
  return [K.num(t), K.usd(t / 2 * M.h1), K.usd(t / 2 * M.h2), K.usd(d), K.usd(fedAt(profit) - fedAt(profit - d))];
});
const tenK = K.mileage(5000, 5000);
const tenK25 = 10000 * M.y2025;

export default defineGuide({
  id: 'mileage-deduction',
  group: 'tax',
  order: 31,
  slug: 'mileage-deduction',
  nav: 'Mileage deduction',
  card: 'Business miles into dollars at the two 2026 IRS rates',
  title: `Mileage Deduction 2026: ${h1} and ${h2} Cents a Mile Explained`,
  description: `Mileage deduction for 2026: ${h1} cents a business mile to June 30, ${h2} cents from ${from}, standard rate or actual costs, records and commuting rules.`,
  h1: 'The 2026 mileage deduction for the self-employed',
  intro: 'The IRS changed its business mileage rate halfway through 2026. Enter your miles before and after July 1 to get the deduction and the tax it saves.',
  resume: `The standard mileage rate for business driving in 2026 is ${h1} cents a mile from January 1 to June 30 and ${h2} cents a mile from ${from}, after the IRS raised it mid-year. A self-employed person multiplies business miles in each half by the matching rate, adds business parking fees and tolls, and enters the total on line 9 of Schedule C. Ten thousand business miles split evenly across the year give a deduction of ${K.usd(tenK)}, against ${K.usd(tenK25)} at the 2025 rate of ${y25} cents. The deduction lowers both income tax and self-employment tax. The alternative is the actual-expense method: the business share of gas, insurance, repairs, depreciation and the rest, worked out from the ratio of business miles to total miles. For a car you own, the standard rate must be chosen in the first year the car is used in the business. Driving between home and a regular workplace is commuting and never counts.`,
  tool: 'mileage',
  body: (h) => `<p>A car used for work is one of the larger deductions a freelancer or contractor can claim, and the standard mileage rate makes it the simplest. The ${h.src('mileage', 'IRS standard mileage rates page')} lists two business rates for 2026: ${h1} cents for January through June, announced in IR-2025-128, and ${h2} cents for July through December, announced in IR-2026-29. With two rates, a log that records the date of each trip matters more than usual: the same mile is worth more in August than in May.</p>
${h.mini('dedValue')}
<h2>From the log to line 9 of Schedule C</h2>
<p>The ${h.src('i1040sc', 'Schedule C instructions')} describe the arithmetic: multiply business miles by the rate, add parking fees and tolls, and enter the result on line 9, car and truck expenses. With the standard rate you do not deduct depreciation, lease payments or operating costs separately; they are built into the rate. Interest on a car loan is the exception that Pub 334 keeps open, since it may be deductible even with the standard rate. For 2026 that means two multiplications, one for each half of the year.</p>
<p>One detail is new on the personal side of the return. Form 1040-ES describes a deduction for interest on a loan for a vehicle bought after 2024 for personal use, up to ${K.usd(10000)} and limited above certain incomes. The Schedule C instructions warn that interest already claimed that way for the personal-use share cannot be claimed again on Schedule C. A car used both ways therefore needs its loan interest divided between the business share and the personal share, with each part reported in one place only.</p>
${h.table(['Business miles in 2026', `Half at ${h1}¢`, `Half at ${h2}¢`, 'Deduction', `Federal and SE tax saved at ${K.usd(profit)} profit`], rows, 'Miles split evenly between the two halves; single filer, no state tax (calculator engine, IRS 2026 rates)', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column is the value of the deduction in tax, not in cash: it lowers profit, so it lowers self-employment tax as well as income tax. Charity driving, at ${charity} cents, and medical driving use different rates and are personal deductions, not business ones.</p>
<h2>Standard rate or actual expenses</h2>
<p>${h.src('p334', 'Publication 334')} allows two methods for a car, van, pickup or panel truck. Actual expenses mean the business share of what the vehicle really costs: depreciation or lease payments, gas, oil, tires, repairs, insurance, registration, licenses, garage rent, parking and tolls. The business share comes from mileage. In the publication's own example, a florist who drove 16,000 of 20,000 miles for deliveries deducts 80% of the van's operating costs. If you qualify for both, Pub 334 suggests figuring the deduction both ways and keeping the larger one.</p>
<h3>Locking in the choice</h3>
<p>The timing rules are strict. For a car you own, the standard rate has to be chosen in the first year the car is available for business use; in later years you may switch between the two methods. For a leased car, choosing the standard rate commits you for the whole lease, renewals included. And the standard rate is not available at all if you operate five or more cars at the same time, claimed depreciation other than straight line, claimed a section 179 deduction or the special depreciation allowance on the car, or claimed actual expenses on a leased car. Only the standard rate in year one keeps both doors open later.</p>
<h2>Which trips count</h2>
<p>Pub 334 is blunt: driving between your home and your main or regular workplace is a personal commuting expense, whatever the distance. Parking at that regular workplace is commuting too. Trips from the workplace to clients, suppliers or job sites are business. The rule changes for someone whose home office is the principal place of business: Pub 334's example of a graphic designer working from home lets the round trip to a client count in full. The ${h.a('home-office-deduction', 'home office guide')} covers what makes a home the principal place of business.</p>
<p>The Schedule C instructions add that travel to a temporary work location is business travel, rather than commuting, when you have at least one regular work location away from home, or when the temporary site is outside the metropolitan area where you live and normally work. A temporary location is generally one expected to last a year or less.</p>
<h2>Records the IRS expects</h2>
<p>Whoever claims car expenses must fill in Part IV of Schedule C, or Form 4562 if the car is being depreciated, which asks for business miles, commuting miles and other miles for the year. The instructions point to Pub 463 for the specific recordkeeping rules on vehicles and allow electronic records that meet the standards in Pub 583. A log kept as you go, with the date and the business miles of each trip, is what supports those totals, and with two rates in 2026 the dates are what show which rate applies to which mile.</p>
<h2>Where it fits in the rest of your return</h2>
<p>Mileage is one line among many business expenses; the ${h.a('self-employed-tax-deductions', 'deductions guide')} lists the others and the ${h.a('schedule-c', 'Schedule C calculator')} adds them up. Because the deduction cuts self-employment tax as well, it also lowers what you need to send in ${h.a('quarterly-estimated-taxes', 'quarterly estimated payments')}.</p>`,
  faqs: [
    { q: 'What is the IRS mileage rate for business in the second half of 2026?', a: `${h2} cents per mile from ${from} through December 31, 2026, announced in IR-2026-29. Miles driven from January 1 to June 30 use ${h1} cents. A self-employed person applies each rate to the business miles driven in its own period and adds the two results on Schedule C.` },
    { q: 'Can I deduct the drive from my house to my office?', a: 'Not if the office is your main or regular workplace: Pub 334 treats that drive as personal commuting, and parking there is commuting too. If a qualifying home office is your principal place of business, trips from home to clients or job sites are deductible business travel.' },
    { q: 'Can I switch from actual expenses to the standard mileage rate?', a: 'For a car you own, only if you used the standard rate in the first year the car was available for business. Pub 334 lets you move between methods in later years after that first choice. A leased car that started on the standard rate must stay on it for the whole lease.' },
    { q: 'Are tolls and parking included in the standard mileage rate?', a: `No. Business parking fees and tolls are deducted on top of the ${h1} or ${h2} cents per mile, according to Pub 334 and the Schedule C instructions. Parking at your regular place of work is the exception: it counts as a commuting cost and is not deductible.` },
  ],
  related: ['self-employed-tax-deductions', 'schedule-c', 'home-office-deduction', 'quarterly-estimated-taxes', '1099-tax-calculator'],
  sources: ['mileage', 'p334', 'i1040sc'],
});
