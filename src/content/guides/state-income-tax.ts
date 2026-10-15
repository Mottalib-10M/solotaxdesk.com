import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/** Official pages read on 2026-10-15 (research/states/*.json). */
const PA_PIT = 'https://www.pa.gov/agencies/revenue/resources/tax-types-and-information/personal-income-tax';
const MI_RATE = 'https://www.michigan.gov/treasury/news/2026/04/15/state-individual-income-tax-rate-for-2026-tax-year-determined';
const NY_IT2105 = 'https://www.tax.ny.gov/pdf/current_forms/it/it2105i.pdf';
const OR_PTE = 'https://www.oregon.gov/dor/programs/businesses/Pages/pass-through-entity-elective-tax.aspx';
const WA_BO = 'https://dor.wa.gov/taxes-rates/business-occupation-tax/business-occupation-tax-classifications';
const TX_FRANCHISE = 'https://comptroller.texas.gov/taxes/franchise/';
const NV_COMMERCE = 'https://tax.nv.gov/tax-types/commerce-tax/';

const PROFIT = 75000;
const all = K.states.map((s) => K.st(s.slug));
type S = (typeof all)[number];
const fed = K.solo({ profit: PROFIT, filing: 'single' });
const none = all.filter((s) => s.income.type === 'none');
const known = all.filter((s) => s.income.verified && s.income.type !== 'none');
const unverified = all.filter((s) => !s.income.verified && s.income.type !== 'none');
const flat = known.filter((s) => s.income.type === 'flat' && s.income.flat !== null).sort((a, b) => (a.income.flat as number) - (b.income.flat as number));
const top = (s: S) => { const b = s.income.brackets?.single; return b && b.length ? b[b.length - 1][1] : 0; };
const grad = known.filter((s) => s.income.type === 'graduated').sort((a, b) => top(b) - top(a));
const by75 = [...known].sort((a, b) => a.ex75.stateTax - b.ex75.stateTax);
const low = by75[0], high = by75[by75.length - 1];
const nm = (s: S) => (s.slug === 'district-of-columbia' ? 'the District of Columbia' : s.name);
const names = (l: S[]) => l.map((s) => s.name).join(', ');
const share = (x: number) => K.pct(x / PROFIT, 1);
const il = K.st('illinois'), sc = K.st('south-carolina'), pa = K.st('pennsylvania'), mi = K.st('michigan');

const system = (s: S) => s.income.type === 'none' ? 'No income tax' : !s.income.verified ? 'not verified' : s.income.type === 'flat' && s.income.flat !== null ? `Flat ${K.rate(s.income.flat)}` : `Graduated, top ${K.rate(top(s))}`;
const ok = (s: S) => s.income.type === 'none' || s.income.verified;

export default defineGuide({
  id: 'state-income-tax',
  group: 'llc',
  order: 2,
  slug: 'state-income-tax',
  nav: 'State income tax',
  card: 'What each state takes from a freelance profit, compared side by side',
  title: 'State Income Tax for Self-Employed 2026: All 50 States',
  description: `State income tax on self-employed profit in 2026: no tax in ${none.length} states, flat or graduated rates elsewhere, up to ${K.usd(high.ex75.stateTax)} on ${K.usd(PROFIT)}. Compare any two states.`,
  h1: 'State income tax for the self-employed in 2026, state by state',
  intro: 'Federal tax is the same everywhere; the state share is not. Pick two states and a profit to see the yearly difference, LLC fees included.',
  resume: `On ${K.usd(PROFIT)} of self-employment profit, a single filer pays between ${K.usd(0)} and ${K.usd(high.ex75.stateTax)} of state income tax in 2026, depending on the state, on top of ${K.usd(fed.total)} of federal income and self-employment tax that does not change with the address. No tax on wages and business income applies in ${none.length} states: ${names(none)}. Among the states whose 2026 schedule could be confirmed, ${flat.length} apply one flat rate, from ${K.rate(flat[0].income.flat as number)} in ${flat[0].name} to ${K.rate(flat[flat.length - 1].income.flat as number)} in ${flat[flat.length - 1].name}, and ${grad.length} use brackets, with a top rate as high as ${K.rate(top(grad[0]))} in ${grad[0].name}. Where a tax applies, the lowest bill at this profit is ${K.usd(low.ex75.stateTax)} in ${low.name} and the highest ${K.usd(high.ex75.stateTax)} in ${high.name}. States start from the federal figures, so the deduction for half of self-employment tax lowers the state bill too. The 2026 schedule of ${unverified.length} states could not be verified and shows as n/a.`,
  tool: 'state-compare',
  body: (h) => `<p>A state does not tax self-employment income in a special way. The profit from Schedule C flows into federal adjusted gross income, after the deduction for half of self-employment tax described in the ${h.src('se_tax', 'IRS self-employment tax page')}, and most states take that figure, or federal taxable income, as their starting point. From there each state applies its own standard deduction or exemption and its own rates. Since no employer withholds anything, the state share has to be paid in quarterly estimates like the federal one, and it changes how much of each invoice should be put aside.</p>
${h.mini('setAside', { s: 'oregon' })}
<h2>The ${none.length} states without a wage income tax</h2>
<p>${names(none)} do not tax wages or business profit of individuals. That makes the comparison above look simple, but several of them tax the business by another route. Texas applies a franchise tax to LLCs, though an entity at or below the no-tax-due revenue threshold owes nothing (${h.ext(TX_FRANCHISE, 'Texas Comptroller')}). Washington's business and occupation tax is levied on gross receipts with no deduction for expenses; service income is taxed at ${K.rate(0.015)} when prior-year gross receipts were under $1,000,000, and a small business credit cancels the tax for low earners (${h.ext(WA_BO, 'Washington DOR, B&O classifications')}). Tennessee reaches LLCs at the entity level through its franchise and excise taxes, and Nevada has a Commerce Tax for businesses above $4,000,000 of Nevada gross revenue (${h.ext(NV_COMMERCE, 'Nevada Department of Taxation')}). The state pages give the detail for each.</p>
<h2>One rate for everyone: the flat-tax states</h2>
<p>A flat tax applies one percentage to income above any deduction, so the share of profit taken rises only a little with income, through the deduction becoming smaller in relative terms. The confirmed 2026 flat rates are: ${flat.map((s) => `${s.name} ${K.rate(s.income.flat as number)}`).join(', ')}.</p>
<p>The rate alone does not tell the whole story. Pennsylvania taxes at ${K.rate(pa.income.flat as number)} but allows no standard deduction or personal exemption, and a business loss cannot offset wages or other classes of income (${h.ext(PA_PIT, 'Pennsylvania Department of Revenue')}). Michigan stays at ${K.rate(mi.income.flat as number)} for 2026 because the automatic rate cut was not triggered (${h.ext(MI_RATE, 'Michigan Treasury')}). Flat is not the same as cheap: on ${K.usd(PROFIT)}, Illinois at ${K.rate(il.income.flat as number)} takes ${K.usd(il.ex75.stateTax)}, while South Carolina, with brackets, takes ${K.usd(sc.ex75.stateTax)}.</p>
<h2>Brackets: the middle slices matter more than the top rate</h2>
<p>A graduated schedule taxes each slice of income at its own rate. The highest confirmed top rates for 2026 are ${grad.slice(0, 4).map((s) => `${K.rate(top(s))} in ${nm(s)}`).join(', ')}, but a freelancer earning ${K.usd(PROFIT)} rarely reaches them. What decides the bill at ordinary incomes is the rate on the middle slices and the size of the standard deduction. New York cut its five lowest bracket rates for 2026 (${h.ext(NY_IT2105, 'New York instructions IT-2105')}), which lowers the tax of every resident a little, whatever the income.</p>
<h3>States whose 2026 schedule is not shown</h3>
<p>For ${names(unverified)}, the 2026 brackets or rate could not be confirmed on an official page on the day of reading, because the page was blocked, still showed 2025 figures or conflicted with a newer law. The calculator leaves their state tax out rather than guess, and the table shows n/a. Each state page links the revenue department where the schedule is posted.</p>
<h2>The tax on ${K.usd(PROFIT)} of profit, state by state</h2>
<p>Single filer, no other income, 2026 rules, state standard deduction and exemptions applied; local income taxes are not included.</p>
${h.table(['State', 'System for 2026', `Tax on ${K.usd(PROFIT)}`, 'Share of profit'], all.map((s) => [h.a(`state:${s.slug}`, s.name), system(s), ok(s) ? K.usd(s.ex75.stateTax) : 'n/a', ok(s) ? share(s.ex75.stateTax) : 'n/a']), `State income tax on ${K.usd(PROFIT)} of self-employment profit, single filer, 2026`, ['l', 'l', 'r', 'r'])}
<h2>Working across state lines</h2>
<p>Residents are taxed by their home state on all their income, wherever the clients are. A state where you physically work as a nonresident can tax the income earned there, and the home state then usually gives a credit for that tax so the same dollar is not taxed twice in full. Moving during the year means a part-year return in each state, each taxing the months of residence.</p>
<p>An LLC that elects S corporation status can, in many states, pay state tax at the entity level through a pass-through entity tax, which turns a personal state tax limited by the federal SALT cap into a business deduction. Oregon, for one, has extended its elective tax through tax year 2027 (${h.ext(OR_PTE, 'Oregon DOR, PTE-E')}). Whether it saves anything depends on your federal itemized deductions, a question for a CPA.</p>
<h2>Cities and counties on top</h2>
<p>A state total is not always the full local bill. Maryland counties, Ohio and Michigan cities, Pennsylvania municipalities and school districts, New York City, Kansas City, Philadelphia and parts of Oregon tax income or business profit again. The ${h.a('local-business-taxes', 'local business taxes guide')} lists those read so far, and the ${h.a('llc-cost', 'LLC cost table')} adds what the state charges to keep the LLC itself.</p>`,
  faqs: [
    { q: 'Which states have no income tax for the self-employed in 2026?', a: `${names(none)}. None of them tax wages or business profit of individuals. Some still tax businesses in other ways: Washington's business and occupation tax applies to gross receipts, and Texas has a franchise tax that most small LLCs owe nothing under. Federal income and self-employment tax apply everywhere.` },
    { q: 'How much state income tax is due on $75,000 of freelance profit?', a: `For a single filer in 2026, from ${K.usd(0)} in the ${none.length} states without income tax to ${K.usd(high.ex75.stateTax)} in ${high.name}, among states with a confirmed schedule. The lowest non-zero bill is ${K.usd(low.ex75.stateTax)} in ${low.name}. The figures include the state standard deduction and the deduction for half of self-employment tax.` },
    { q: 'Does a state tax the half of self-employment tax I deduct?', a: 'Usually not. Most states start from federal adjusted gross income or federal taxable income, and the deduction for half of self-employment tax has already reduced both. The self-employment tax itself is a federal tax; no state adds its own version, though some cities and transit districts tax net profit separately.' },
    { q: 'Is a flat state income tax always lower than a graduated one?', a: `No. On ${K.usd(PROFIT)} of profit, Illinois's flat ${K.rate(il.income.flat as number)} takes ${K.usd(il.ex75.stateTax)}, while South Carolina's brackets take ${K.usd(sc.ex75.stateTax)}. The size of the standard deduction and the rates on the lower slices matter as much as whether the schedule is flat. Compare your own two states with the calculator above.` },
    { q: 'Do I file in two states if I move during 2026?', a: 'Generally yes. You file a part-year resident return in each state, and each taxes the income received while you lived there, plus any income sourced to it while you were a nonresident. A credit for tax paid to the other state usually prevents taxing the same income twice. The rules differ by state, so check both revenue departments.' },
  ],
  related: ['llc-cost', 'local-business-taxes', 'how-much-to-set-aside', 'quarterly-estimated-taxes', 'state:california', 'state:texas'],
  sources: ['se_tax', 'estimated', 'rp_2025_32'],
});
