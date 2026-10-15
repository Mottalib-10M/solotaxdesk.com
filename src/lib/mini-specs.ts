/** Mini-simulators of the pages (RECETTE §9.3): one subject, one calculation, the site engine only. */
import type { MiniSpec } from './mini-types';
import * as E from './engine/tax';
import P from '../data/params-2026.json';
import SE from '../data/states-engine.json';

type EngineState = E.StateTax & { local: Array<{ slug: string; name: string; rate: number }> };
const STATES = SE as unknown as EngineState[];
const stateOf = (slug: string) => STATES.find((s) => s.slug === slug) ?? STATES[0];
const used = (s: EngineState): EngineState => (s.income.verified || s.income.type === 'none' ? s : { ...s, income: { ...s.income, type: 'none' } });
const usd = (x: number) => `${x < 0 ? '-' : ''}$${Math.round(Math.abs(x)).toLocaleString('en-US')}`;
const pc = (x: number, d = 1) => `${(Math.round(x * 100 * 10 ** d) / 10 ** d).toLocaleString('en-US')}%`;
const FIL = [{ value: '0', label: 'Single' }, { value: '1', label: 'Married, joint' }];
const fil = (v: number): E.Filing => (v ? 'mfj' : 'single');
type Arg = Record<string, number | string> | undefined;

const SPECS: Record<string, (arg: Arg) => MiniSpec> = {
  seQuick: () => ({ title: 'Your 2026 self-employment tax in one line', cta: 'Full SE tax calculator', inputs: [
    { id: 'p', label: 'Net profit', def: 60000, unit: '$', max: 50000000 }],
    run: (v) => { const r = E.seTax(v.p); return { head: ['Self-employment tax', usd(r.total)], rows: [['Taxed amount (92.35%)', usd(r.netEarnings)], ['Deductible half', usd(r.half)], ['Share of profit', pc(v.p ? r.total / v.p : 0)]] }; } }),
  seWage: () => ({ title: 'A job and a side business: who uses the wage base first', cta: 'Full SE tax calculator', inputs: [
    { id: 'w', label: 'W-2 wages', def: 150000, unit: '$', max: 50000000 }, { id: 'p', label: 'Side-business profit', def: 60000, unit: '$', max: 50000000 }],
    run: (v) => { const a = E.seTax(v.p, 'single', v.w), b = E.seTax(v.p); return { head: ['SE tax on the side profit', usd(a.total)], rows: [['Without the job it would be', usd(b.total)], ['Room left under $184,500', usd(Math.max(0, P.se.wageBase['2026'] - v.w))]] }; } }),
  seHalf: () => ({ title: 'What the half-SE-tax deduction is worth', cta: 'Schedule SE explained', inputs: [
    { id: 'p', label: 'Net profit', def: 90000, unit: '$', max: 50000000 }, { id: 'f', label: 'Filing status', def: 0, options: FIL }],
    run: (v) => { const r = E.seTax(v.p); const ti = Math.max(0, v.p - E.standardDeduction(fil(v.f))); const saved = E.federalTax(ti, fil(v.f)) - E.federalTax(Math.max(0, ti - r.half), fil(v.f)); return { head: ['Income tax saved by the deduction', usd(saved)], rows: [['Deduction (half of SE tax)', usd(r.half)], ['SE tax itself', usd(r.total)]], note: 'QBI left out of this quick check.' }; } }),
  se2027: () => ({ title: 'Above the cap: 2026 against 2027', cta: 'Full SE tax calculator', inputs: [
    { id: 'p', label: 'Net profit', def: 230000, unit: '$', max: 50000000 }],
    run: (v) => { const a = E.seTax(v.p, 'single', 0, '2026'), b = E.seTax(v.p, 'single', 0, '2027'); return { head: ['Extra Social Security tax in 2027', usd(b.ss - a.ss)], rows: [['2026 wage base', usd(P.se.wageBase['2026'])], ['2027 wage base (SSA)', usd(P.se.wageBase['2027'])]] }; } }),
  total1099: (arg) => ({ title: 'All your 2026 taxes on 1099 income', cta: '1099 tax calculator', inputs: [
    { id: 'p', label: 'Net profit', def: Number(arg?.p ?? 75000), unit: '$', max: 50000000 }, { id: 'f', label: 'Filing status', def: 0, options: FIL }],
    run: (v) => { const r = E.solo({ profit: v.p, filing: fil(v.f) }); return { head: ['Federal total (income + SE tax)', usd(r.federalTotal)], rows: [['SE tax', usd(r.se.total)], ['Income tax', usd(r.incomeTax)], ['QBI deduction', usd(r.qbi.deduction)]], note: 'State tax: choose your state in the full calculator.' }; } }),
  sideGig: () => ({ title: 'A side gig on top of a salary', cta: 'Set-aside calculator', inputs: [
    { id: 'w', label: 'Salary', def: 70000, unit: '$', max: 50000000 }, { id: 'p', label: 'Side profit', def: 15000, unit: '$', max: 50000000 }],
    run: (v) => { const r = E.solo({ profit: v.p, filing: 'single', w2Wages: v.w }); return { head: ['Put aside from the side income', pc(r.setAside)], rows: [['Tax it adds', usd(r.setAside * v.p)], ['Marginal federal bracket', pc(r.marginal, 0)]] }; } }),
  setAside: (arg) => ({ title: 'Your set-aside rate by state', cta: 'Set-aside calculator', inputs: [
    { id: 'p', label: 'Net profit', def: 65000, unit: '$', max: 50000000 }],
    run: (v) => { const s = used(stateOf(String(arg?.s ?? 'texas'))); const r = E.solo({ profit: v.p, filing: 'single', state: s }); return { head: [`Set aside in ${s.name}`, pc(r.setAside)], rows: [['Per quarter', usd(r.quarterly)], [`${s.name} income tax`, usd(r.stateTax)]] }; } }),
  invoice: () => ({ title: 'One invoice, how much is yours', cta: 'Set-aside calculator', inputs: [
    { id: 'i', label: 'Invoice paid', def: 5000, unit: '$', max: 10000000 }, { id: 'p', label: 'Expected profit for the year', def: 80000, unit: '$', max: 50000000 }],
    run: (v) => { const r = E.solo({ profit: v.p, filing: 'single' }); const keep = v.i * (1 - r.setAside); return { head: ['Yours to spend', usd(keep)], rows: [['To the tax account', usd(v.i - keep)], ['Federal set-aside rate', pc(r.setAside)]], note: 'Single filer, no state tax.' }; } }),
  quarter: () => ({ title: 'This year’s quarterly payment, the quick way', cta: 'Quarterly tax calculator', inputs: [
    { id: 't', label: 'Total tax on your 2025 return', def: 12000, unit: '$', max: 50000000 }, { id: 'a', label: '2025 AGI', def: 90000, unit: '$', max: 50000000 }],
    run: (v) => { const share = v.a > P.estimated.highAgi.single ? P.estimated.priorYearShareHigh : 1; return { head: ['Each quarter', usd(v.t * share / 4)], rows: [['Rule', share > 1 ? '110% of 2025 tax' : '100% of 2025 tax'], ['Year total', usd(v.t * share)]] }; } }),
  safe110: () => ({ title: 'Above $150,000 of AGI: the 110% rule', cta: 'Safe harbor calculator', inputs: [
    { id: 't', label: 'Total tax on your 2025 return', def: 40000, unit: '$', max: 50000000 }],
    run: (v) => ({ head: ['110% safe harbor for 2026', usd(v.t * 1.1)], rows: [['Per quarter', usd(v.t * 1.1 / 4)], ['Extra over 100%', usd(v.t * 0.1)]] }) }),
  lateQuarter: () => ({ title: 'One missed payment: the cost', cta: 'Penalty calculator', inputs: [
    { id: 'a', label: 'Amount missed in June', def: 3000, unit: '$', max: 50000000 }],
    run: (v) => { const r = E.penalty([0, v.a, 0, 0]); return { head: ['Penalty if paid April 15, 2027', usd(r.total)], rows: [['Days late', String(E.daysBetween('2026-06-15', '2027-04-15'))], ['Rate (2026)', '6% to 7% a year']] }; } }),
  q4skip: () => ({ title: 'Skip the January payment by filing early', cta: 'Due dates 2026', inputs: [
    { id: 'q', label: 'Your fourth payment', def: 3500, unit: '$', max: 50000000 }],
    run: (v) => ({ head: ['File and pay all by', 'February 1, 2027'], rows: [['Otherwise due', 'January 15, 2027'], ['Amount to pay with the return', usd(v.q)]] }) }),
  qbiQuick: () => ({ title: 'Your QBI deduction under the threshold', cta: 'QBI calculator', inputs: [
    { id: 'p', label: 'Net profit', def: 90000, unit: '$', max: 50000000 }, { id: 'f', label: 'Filing status', def: 0, options: FIL }],
    run: (v) => { const r = E.solo({ profit: v.p, filing: fil(v.f) }); return { head: ['QBI deduction', usd(r.qbi.deduction)], rows: [['Income tax saved', usd(E.federalTax(r.taxable + r.qbi.deduction, fil(v.f)) - E.federalTax(r.taxable, fil(v.f)))], ['Limited by taxable income', r.qbi.limitedByIncome ? 'yes' : 'no']] }; } }),
  qbiMin: () => ({ title: 'The new $400 minimum', cta: 'QBI calculator', inputs: [
    { id: 'q', label: 'Qualified business income', def: 1500, unit: '$', max: 100000 }],
    run: (v) => { const r = E.qbiDeduction({ qbi: v.q, taxableBeforeQbi: 80000, filing: 'single' }); return { head: ['Deduction', usd(r.deduction)], rows: [['20% of QBI', usd(v.q * 0.2)], ['Minimum applied', r.minimumApplied ? 'yes' : 'no']], note: 'Material participation required; $1,000 of QBI at least.' }; } }),
  qbiSstb: () => ({ title: 'Service business above the threshold', cta: 'QBI calculator', inputs: [
    { id: 't', label: 'Taxable income before QBI', def: 240000, unit: '$', max: 50000000 }],
    run: (v) => { const q = 200000; const r = E.qbiDeduction({ qbi: q, taxableBeforeQbi: v.t, filing: 'single', sstb: true }); return { head: ['Deduction left (single, $200,000 QBI)', usd(r.deduction)], rows: [['Below the threshold it would be', usd(Math.min(q, v.t) * 0.2)], ['Phase-out range', `${usd(P.qbi.threshold.single)} to ${usd(P.qbi.phaseInEnd.single)}`]] }; } }),
  homeQuick: () => ({ title: 'Simplified method: square feet × $5', cta: 'Home office calculator', inputs: [
    { id: 's', label: 'Office square feet', def: 180, unit: 'sq ft', max: 10000 }],
    run: (v) => { const d = E.homeOffice(v.s, 0, 0).simplified; return { head: ['Deduction', usd(d)], rows: [['Counted area (300 max)', `${Math.min(v.s, 300)} sq ft`], ['SE tax saved alone', usd(d * 0.9235 * 0.153)]] }; } }),
  miles: () => ({ title: 'Miles into dollars, 2026', cta: 'Mileage calculator', inputs: [
    { id: 'm', label: 'Business miles in the year', def: 8000, unit: 'mi', max: 500000 }],
    run: (v) => ({ head: ['Deduction (half each period)', usd(E.mileage(v.m / 2, v.m / 2))], rows: [['All before July 1', usd(v.m * P.mileage.h1)], ['All after July 1', usd(v.m * P.mileage.h2)]] }) }),
  dedValue: () => ({ title: 'What a $1,000 expense really costs', cta: 'Deduction value calculator', inputs: [
    { id: 'p', label: 'Net profit', def: 80000, unit: '$', max: 50000000 }],
    run: (v) => { const a = E.solo({ profit: v.p, filing: 'single' }), b = E.solo({ profit: Math.max(0, v.p - 1000), filing: 'single' }); return { head: ['Federal and SE tax saved', usd(a.total - b.total)], rows: [['Net cost of the expense', usd(1000 - (a.total - b.total))]], note: 'Single filer, before state tax.' }; } }),
  healthQuick: () => ({ title: 'Premiums you deduct as self-employed', cta: 'Health insurance deduction', inputs: [
    { id: 'h', label: 'Yearly premiums', def: 6000, unit: '$', max: 1000000 }, { id: 'p', label: 'Net profit', def: 55000, unit: '$', max: 50000000 }],
    run: (v) => { const a = E.solo({ profit: v.p, filing: 'single' }), b = E.solo({ profit: v.p, filing: 'single', healthPremiums: v.h }); return { head: ['Federal income tax saved', usd(a.incomeTax - b.incomeTax)], rows: [['SE tax saved', '$0'], ['Deduction cap', usd(Math.max(0, v.p - a.se.half))]] }; } }),
  sepQuick: () => ({ title: 'SEP IRA ceiling at your profit', cta: 'SEP or solo 401(k)', inputs: [
    { id: 'p', label: 'Net profit', def: 120000, unit: '$', max: 50000000 }],
    run: (v) => { const r = E.retirementMax(v.p); return { head: ['SEP IRA maximum', usd(r.sep)], rows: [['Solo 401(k) maximum', usd(r.solo401k)], ['2026 overall cap', usd(P.retirement.dcLimit)]] }; } }),
  hourly: () => ({ title: 'Salary into a contractor rate', cta: '1099 vs W-2 calculator', inputs: [
    { id: 'w', label: 'W-2 salary', def: 80000, unit: '$', max: 10000000 }, { id: 'h', label: 'Billable hours a year', def: 1500, unit: 'h', max: 4000 }],
    run: (v) => { const r = E.contractorRate(v.w, 0, v.h); return { head: ['Break-even hourly rate', `${usd(r.hourly)}/h`], rows: [['Employer FICA you take on', usd(r.employerFica)], ['Salary per 2,080 hours', `${usd(v.w / 2080)}/h`]], note: 'Benefits not counted here.' }; } }),
  necCheck: () => ({ title: 'Will this client send a 1099-NEC?', cta: '1099 forms', inputs: [
    { id: 'c', label: 'Paid by the client in 2026', def: 1500, unit: '$', max: 50000000 }],
    run: (v) => ({ head: ['1099-NEC required', v.c >= P.infoReturns.necThreshold ? 'yes' : 'no'], rows: [['Threshold for 2026 payments', usd(P.infoReturns.necThreshold)], ['Taxable anyway', usd(v.c)]] }) }),
  schedC: () => ({ title: 'From receipts to line 31', cta: 'Schedule C calculator', inputs: [
    { id: 'g', label: 'Gross receipts', def: 70000, unit: '$', max: 50000000 }, { id: 'e', label: 'Expenses', def: 12000, unit: '$', max: 50000000 }],
    run: (v) => { const n = Math.max(0, v.g - v.e); return { head: ['Net profit (line 31)', usd(n)], rows: [['SE tax on it', usd(E.seTax(n).total)], ['Expense ratio', pc(v.g ? v.e / v.g : 0)]] }; } }),
  scorpQuick: (arg) => ({ title: 'LLC or S corp at your profit', cta: 'LLC vs S corp calculator', inputs: [
    { id: 'p', label: 'Profit before salary', def: Number(arg?.p ?? 110000), unit: '$', max: 50000000 }, { id: 'w', label: 'Salary', def: Number(arg?.w ?? 50000), unit: '$', max: 50000000 }],
    run: (v) => { const s = arg?.s ? used(stateOf(String(arg.s))) : undefined; const c = E.compareScorp({ profit: v.p, salary: v.w, filing: 'single', state: s, adminCost: 2000, llcFees: s ? E.llcYearly(s) : 0 }); return { head: [c.savings >= 0 ? 'S corp saves' : 'S corp costs', usd(Math.abs(c.savings))], rows: [['LLC taxed by default', usd(c.solo.total)], ['S corp, $2,000 payroll costs', usd(c.scorp.total)]], note: s ? `${s.name}, single filer.` : 'Single filer, no state tax.' }; } }),
  scorpSalary: () => ({ title: 'Raise the salary, lose some of the saving', cta: 'Reasonable salary calculator', inputs: [
    { id: 'w', label: 'Salary', def: 60000, unit: '$', max: 50000000 }],
    run: (v) => { const p = 150000; const a = E.compareScorp({ profit: p, salary: v.w, filing: 'single' }).savings, b = E.compareScorp({ profit: p, salary: v.w + 10000, filing: 'single' }).savings; return { head: ['Saving at this salary ($150,000 profit)', usd(a)], rows: [['With $10,000 more salary', usd(b)], ['Cost of the extra $10,000', usd(a - b)]] }; } }),
  breakEvenQuick: () => ({ title: 'Where the S corp starts to pay', cta: 'S corp savings calculator', inputs: [
    { id: 'a', label: 'Yearly payroll and filing costs', def: 2000, unit: '$', max: 100000 }],
    run: (v) => { const be = E.breakEven(0.4, { filing: 'single', adminCost: v.a }); return { head: ['Break-even profit (salary 40%)', be ? usd(be) : 'above $400,000'], rows: [['Costs entered', usd(v.a)]], note: 'Single filer, no state tax.' }; } }),
  payrollCost: () => ({ title: 'Payroll taxes on your own salary', cta: 'S corp tax calculator', inputs: [
    { id: 'w', label: 'Salary', def: 60000, unit: '$', max: 50000000 }],
    run: (v) => { const r = E.scorp({ profit: v.w, salary: v.w, filing: 'single' }); return { head: ['Employer + employee FICA', usd(r.employerFica + r.employeeFica)], rows: [['FUTA (0.6% of $7,000)', usd(r.futa)], ['Same as 15.3% of salary', usd(v.w * 0.153)]] }; } }),
  ccorpQuick: () => ({ title: 'The 21% rate, then the dividend', cta: 'C corp vs S corp', inputs: [
    { id: 'p', label: 'Corporate profit after salary', def: 100000, unit: '$', max: 50000000 }],
    run: (v) => { const corp = v.p * P.corporate.rate; return { head: ['Corporate tax', usd(corp)], rows: [['Left to pay out', usd(v.p - corp)], ['15% on that dividend', usd((v.p - corp) * 0.15)], ['Combined', pc((corp + (v.p - corp) * 0.15) / Math.max(1, v.p))]] }; } }),
  doubleTax: () => ({ title: 'Paid out or kept: the second layer', cta: 'C corp vs S corp', inputs: [
    { id: 'd', label: 'Share paid as dividends', def: 50, unit: '%', max: 100 }],
    run: (v) => { const r = E.ccorp({ profit: 200000, salary: 80000, filing: 'single', payout: v.d / 100 }); return { head: ['Total tax ($200,000 profit, $80,000 salary)', usd(r.total)], rows: [['Kept in the company', usd(r.retained)], ['Dividend tax + NIIT', usd(r.dividendTax + r.niit)]] }; } }),
  fourWay: () => ({ title: 'Four structures, one profit', cta: 'Structure comparison', inputs: [
    { id: 'p', label: 'Profit', def: 120000, unit: '$', max: 50000000 }],
    run: (v) => { const sp = E.solo({ profit: v.p, filing: 'single' }).total; const sc = E.scorp({ profit: v.p, salary: v.p * 0.45, filing: 'single', adminCost: 2000 }).total; const cc = E.ccorp({ profit: v.p, salary: v.p * 0.45, filing: 'single', payout: 1 }).total; return { head: ['Lowest', sc < sp && sc < cc ? 'S corp' : cc < sp ? 'C corp' : 'Sole prop / LLC'], rows: [['Sole prop or LLC', usd(sp)], ['S corp (45% salary)', usd(sc)], ['C corp, all paid out', usd(cc)]], note: 'Federal only, single filer.' }; } }),
  llcFees: (arg) => ({ title: 'State fees over the years', cta: 'LLC cost by state', inputs: [
    { id: 'y', label: 'Years', def: 5, max: 50 }],
    run: (v) => { const s = stateOf(String(arg?.s ?? 'california')); return { head: [`${s.name} LLC, ${v.y} years`, s.llc.formation === null ? 'n/a' : usd(E.llcCost(s, v.y))], rows: [['Formation', s.llc.formation === null ? 'n/a' : usd(s.llc.formation)], ['Per year after', usd(E.llcYearly(s))]] }; } }),
  llcYears: () => ({ title: 'Cheapest and dearest states', cta: 'LLC cost by state', inputs: [
    { id: 'y', label: 'Years', def: 3, max: 50 }],
    run: (v) => { const k = STATES.filter((s) => s.llc.formation !== null).map((s) => [s.name, E.llcCost(s, v.y)] as [string, number]).sort((a, b) => a[1] - b[1]); return { head: ['Spread between states', k.length ? usd(k[k.length - 1][1] - k[0][1]) : 'n/a'], rows: k.length ? [[`Cheapest: ${k[0][0]}`, usd(k[0][1])], [`Dearest: ${k[k.length - 1][0]}`, usd(k[k.length - 1][1])]] : [] }; } }),
  deadline2553: () => ({ title: 'Form 2553 deadline from a start month', cta: 'S election guide', inputs: [
    { id: 'm', label: 'First month of S status', def: 1, options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((l, i) => ({ value: String(i + 1), label: `${l} 1, 2027` })) }],
    run: (v) => { const d = E.electionDeadline(`2027-${String(v.m).padStart(2, '0')}-01`); return { head: ['File by', new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })], rows: [['Rule', '2 months and 15 days']] }; } }),
  llcSplit: () => ({ title: 'Two members, one profit', cta: 'LLC taxes calculator', inputs: [
    { id: 'p', label: 'LLC profit', def: 160000, unit: '$', max: 50000000 }],
    run: (v) => { const one = E.solo({ profit: v.p / 2, filing: 'single' }); return { head: ['Federal tax for each member', usd(one.federalTotal)], rows: [['SE tax each', usd(one.se.total)], ['Return of the LLC', 'Form 1065, K-1 to each']] }; } }),
  stateGap: (arg) => ({ title: 'The same profit in another state', cta: 'State income tax compared', inputs: [
    { id: 'p', label: 'Net profit', def: 100000, unit: '$', max: 50000000 }],
    run: (v) => { const a = used(stateOf(String(arg?.a ?? 'california'))), b = used(stateOf(String(arg?.b ?? 'texas'))); const ra = E.solo({ profit: v.p, filing: 'single', state: a }).stateTax, rb = E.solo({ profit: v.p, filing: 'single', state: b }).stateTax; return { head: [`${a.name} minus ${b.name}`, usd(ra - rb)], rows: [[a.name, usd(ra)], [b.name, usd(rb)]] }; } }),
  stateQuick: (arg) => ({ title: 'State income tax on a freelance profit', cta: 'State income tax compared', inputs: [
    { id: 'p', label: 'Net profit', def: Number(arg?.p ?? 80000), unit: '$', max: 50000000 }, { id: 'f', label: 'Filing status', def: 0, options: FIL }],
    run: (v) => { const s = used(stateOf(String(arg?.s ?? 'california'))); const r = E.solo({ profit: v.p, filing: fil(v.f), state: s }); return { head: [`${s.name} income tax`, usd(r.stateTax)], rows: [['State share of profit', pc(v.p ? r.stateTax / v.p : 0)], ['Total with federal', usd(r.total)]] }; } }),
  localQuick: (arg) => ({ title: 'Local tax on business profit', cta: 'Local business taxes', inputs: [
    { id: 'p', label: 'Net profit', def: 80000, unit: '$', max: 50000000 }],
    run: (v) => { const all = STATES.flatMap((s) => s.local); const l = all.find((x) => x.slug === arg?.l) ?? all[0]; return { head: [l ? l.name : 'Local tax', l ? usd(v.p * l.rate) : 'n/a'], rows: [['Rate', l ? pc(l.rate, 3) : 'n/a']] }; } }),
  stateScorp: (arg) => ({ title: 'S corp or LLC in this state', cta: 'LLC vs S corp calculator', inputs: [
    { id: 'p', label: 'Profit before salary', def: 120000, unit: '$', max: 50000000 }],
    run: (v) => { const s = used(stateOf(String(arg?.s ?? 'california'))); const c = E.compareScorp({ profit: v.p, salary: v.p * 0.42, filing: 'single', state: s, adminCost: 2000, llcFees: E.llcYearly(s) }); return { head: [c.savings >= 0 ? 'S corp saves' : 'S corp costs', usd(Math.abs(c.savings))], rows: [['Salary used (42%)', usd(v.p * 0.42)], [`${s.name} entity tax`, usd(c.scorp.entityTax)]] }; } }),
  stateLlc: (arg) => ({ title: 'LLC state cost over time', cta: 'LLC cost by state', inputs: [
    { id: 'y', label: 'Years', def: 10, max: 50 }],
    run: (v) => { const s = stateOf(String(arg?.s ?? 'california')); return { head: [`${s.name}, ${v.y} years`, s.llc.formation === null ? 'n/a' : usd(E.llcCost(s, v.y))], rows: [['Yearly after formation', usd(E.llcYearly(s))]] }; } }),
};
export function getSpec(kind: string, _lang = 'en', arg?: string): MiniSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown mini ${kind}`);
  return f(arg ? JSON.parse(arg) : undefined);
}
export const MINI_KINDS = Object.keys(SPECS);
