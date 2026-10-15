/**
 * Tax engine for 2026 (pure functions, tested in tests/engine.test.ts).
 * Federal figures: src/data/params-2026.json (Rev. Proc. 2025-32, Form 1040-ES 2026, Pub 15, SSA).
 * State figures: src/data/states.json (built by scripts/build-states.py from research/states/*.json).
 * Nothing here reads the date or the URL: first render = build defaults (RECETTE §17.5).
 */
import P from '../../data/params-2026.json';

export type Filing = 'single' | 'mfj' | 'hoh' | 'mfs';
export const FILINGS: Array<{ value: Filing; label: string }> = [
  { value: 'single', label: 'Single' }, { value: 'mfj', label: 'Married, joint' }, { value: 'hoh', label: 'Head of household' }, { value: 'mfs', label: 'Married, separate' },
];
const r2 = (x: number) => Math.round(x * 100) / 100;
const pos = (x: number) => (x > 0 ? x : 0);

/* ── Federal income tax ─────────────────────────────────────────────────────── */
export type Brackets = Array<[number, number]>;
/** Tax from a bracket table [[lower bound, marginal rate]…]. */
export function bracketTax(income: number, b: Brackets): number {
  let t = 0;
  for (let i = 0; i < b.length; i++) {
    const lo = b[i][0], hi = i + 1 < b.length ? b[i + 1][0] : Infinity;
    if (income <= lo) break;
    t += (Math.min(income, hi) - lo) * b[i][1];
  }
  return r2(t);
}
export const marginalRate = (income: number, b: Brackets) => { let r = b[0][1]; for (const [lo, rate] of b) if (income > lo) r = rate; return r; };
export const federalTax = (taxable: number, f: Filing) => bracketTax(pos(taxable), P.brackets[f] as Brackets);
export const federalMarginal = (taxable: number, f: Filing) => marginalRate(pos(taxable), P.brackets[f] as Brackets);
export const standardDeduction = (f: Filing) => P.standardDeduction[f];

/* ── Self-employment tax (Schedule SE, 1040-ES worksheet) ───────────────────── */
export interface SeResult { netEarnings: number; ssBase: number; ss: number; medicare: number; total: number; half: number; additionalMedicare: number; owes: boolean }
/**
 * Schedule SE: 92.35% of net profit; 12.4% up to the wage base minus W-2 wages already taxed for Social Security;
 * 2.9% on all of it; nothing if net earnings are under $400. Additional Medicare Tax (Form 8959) is separate:
 * 0.9% on wages + SE earnings above the filing-status threshold, the threshold first reduced by wages.
 */
export function seTax(profit: number, f: Filing = 'single', w2Wages = 0, year: '2025' | '2026' | '2027' = '2026'): SeResult {
  const ne = r2(pos(profit) * P.se.factor);
  if (ne < P.se.minimumNet) return { netEarnings: ne, ssBase: 0, ss: 0, medicare: 0, total: 0, half: 0, additionalMedicare: 0, owes: false };
  const base = P.se.wageBase[year];
  const ssBase = Math.min(ne, pos(base - w2Wages));
  const ss = r2(ssBase * P.se.ssRate);
  const medicare = r2(ne * P.se.medicareRate);
  const total = r2(ss + medicare);
  const thr = P.additionalMedicare.threshold[f];
  const amWages = pos(w2Wages - thr);
  const amSe = pos(ne - pos(thr - w2Wages));
  return { netEarnings: ne, ssBase, ss, medicare, total, half: r2(total * P.se.deductibleShare), additionalMedicare: r2((amWages + amSe) * P.additionalMedicare.rate), owes: true };
}

/* ── QBI deduction (section 199A) ──────────────────────────────────────────── */
export interface QbiInput { qbi: number; taxableBeforeQbi: number; filing: Filing; sstb?: boolean; w2Paid?: number; ubia?: number; netCapitalGain?: number }
export interface QbiResult { deduction: number; tentative: number; limitedByIncome: boolean; phase: 'below' | 'phase-in' | 'above'; minimumApplied: boolean; wageLimit: number }
/**
 * 20% of QBI, capped at 20% of taxable income before QBI (minus net capital gain). Above the 2026 threshold, the
 * W-2 wage / UBIA limit phases in over $75,000 ($150,000 joint) and an SSTB phases out over the same range.
 * New for 2026 (OBBBA §70105): a $400 minimum deduction when QBI from active businesses is at least $1,000.
 */
export function qbiDeduction(i: QbiInput): QbiResult {
  const Q = P.qbi, thr = Q.threshold[i.filing], end = Q.phaseInEnd[i.filing];
  const ti = pos(i.taxableBeforeQbi), qbi = i.qbi;
  const incomeCap = Q.rate * pos(ti - (i.netCapitalGain ?? 0));
  const w2 = i.w2Paid ?? 0, ubia = i.ubia ?? 0;
  const wageLimit = Math.max(Q.wageLimitRate * w2, Q.wageUbiaWageRate * w2 + Q.ubiaRate * ubia);
  if (qbi <= 0) return { deduction: 0, tentative: 0, limitedByIncome: false, phase: ti <= thr ? 'below' : ti >= end ? 'above' : 'phase-in', minimumApplied: false, wageLimit };
  let tentative: number; let phase: QbiResult['phase']; let qualifying = qbi;
  if (ti <= thr) { tentative = Q.rate * qbi; phase = 'below'; }
  else {
    const frac = Math.min(1, (ti - thr) / (end - thr));
    phase = frac >= 1 ? 'above' : 'phase-in';
    // SSTB: only the applicable percentage of QBI, wages and UBIA counts.
    const keep = i.sstb ? 1 - frac : 1;
    const q = qbi * keep, wl = wageLimit * keep; qualifying = q;
    const full = Q.rate * q;
    if (frac >= 1) tentative = Math.min(full, wl);
    else tentative = full > wl ? full - (full - wl) * frac : full;
  }
  let deduction = Math.min(tentative, incomeCap);
  const limitedByIncome = incomeCap < tentative;
  let minimumApplied = false;
  // An SSTB above the range is no longer a qualified business: no minimum (199A(i), d(2)).
  if (qualifying >= Q.minimumQbi && deduction < Q.minimumDeduction) { deduction = Q.minimumDeduction; minimumApplied = true; }
  return { deduction: r2(pos(deduction)), tentative: r2(tentative), limitedByIncome, phase, minimumApplied, wageLimit: r2(wageLimit) };
}

/* ── State data types ───────────────────────────────────────────────────────── */
export interface StateTax {
  name: string; slug: string; abbr: string;
  income: { type: 'none' | 'flat' | 'graduated' | 'interest_dividends_only'; flat: number | null; brackets: { single: Brackets; mfj: Brackets } | null; std: { single: number; mfj: number } | null; exemption: { single: number; mfj: number; credit: boolean } | null; start: 'agi' | 'federal_taxable'; year: number; verified: boolean };
  llc: { formation: number | null; annual: number | null; frequency: 'annual' | 'biennial' | 'none' | null; minTax: number; minTaxName: string | null; firstYearExtra: number };
  scorp: { recognized: 'yes' | 'no' | 'partial'; rate: number; minimum: number; fixed: number; name: string | null; replacesLlcMin?: boolean };
  suta: { wageBase: number | null; rate: number | null };
}
const bucket = (f: Filing): 'single' | 'mfj' => (f === 'mfj' ? 'mfj' : 'single');

/** State income tax on a resident's income. `agi` and `fedTaxable` come from the federal computation. */
export function stateIncomeTax(s: StateTax | undefined, agi: number, fedTaxable: number, f: Filing): number {
  if (!s) return 0;
  const inc = s.income;
  if (inc.type === 'none' || inc.type === 'interest_dividends_only') return 0;
  const b = bucket(f);
  let base = inc.start === 'federal_taxable' ? pos(fedTaxable) : pos(agi - (inc.std?.[b] ?? 0) - (inc.exemption && !inc.exemption.credit ? inc.exemption[b] : 0));
  let tax = inc.type === 'flat' ? base * (inc.flat ?? 0) : bracketTax(base, inc.brackets?.[b] ?? [[0, 0]]);
  if (inc.exemption?.credit) tax -= inc.exemption[b];
  return r2(pos(tax));
}
export const stateMarginal = (s: StateTax | undefined, agi: number, fedTaxable: number, f: Filing) => {
  if (!s || s.income.type === 'none' || s.income.type === 'interest_dividends_only') return 0;
  return r2((stateIncomeTax(s, agi + 1000, fedTaxable + 1000, f) - stateIncomeTax(s, agi, fedTaxable, f)) / 1000);
};
/** Yearly cost of keeping an LLC: annual report fee spread over its cycle + minimum/franchise tax. */
export const llcYearly = (s: StateTax) => r2((s.llc.annual ?? 0) / (s.llc.frequency === 'biennial' ? 2 : 1) * (s.llc.frequency === 'none' ? 0 : 1) + s.llc.minTax);
/** Cost of an LLC over N years: formation + yearly costs (first-year extras included). */
export const llcCost = (s: StateTax, years = 1) => r2((s.llc.formation ?? 0) + s.llc.firstYearExtra + llcYearly(s) * years);

/* ── Full picture for a self-employed person (sole proprietor or single-member LLC) ── */
export interface SoloInput {
  profit: number; filing: Filing; w2Wages?: number; otherIncome?: number; state?: StateTax; localRate?: number;
  healthPremiums?: number; retirement?: number; sstb?: boolean; children?: number; year?: '2026' | '2027';
  /** Yearly state fees and minimum taxes of an LLC (0 for a sole proprietor without LLC). */ llcFees?: number;
}
export interface SoloResult {
  se: SeResult; llcFees: number; agi: number; deduction: number; qbi: QbiResult; taxable: number; incomeTax: number; credits: number; federalTotal: number;
  stateTax: number; localTax: number; total: number; effective: number; marginal: number; setAside: number; quarterly: number; takeHome: number;
}
export function solo(i: SoloInput, _inner = false): SoloResult {
  const f = i.filing, w2 = i.w2Wages ?? 0, other = i.otherIncome ?? 0;
  const llcFees = i.llcFees ?? 0;
  const se = seTax(pos(i.profit - llcFees), f, w2, i.year ?? '2026');
  const net = pos(i.profit - llcFees);
  const healthMax = pos(net - se.half - (i.retirement ?? 0));
  const health = Math.min(i.healthPremiums ?? 0, healthMax);
  const agi = r2(pos(net + w2 + other - se.half - health - (i.retirement ?? 0)));
  const deduction = standardDeduction(f);
  const before = pos(agi - deduction);
  const qbiAmount = pos(net - se.half - health - (i.retirement ?? 0));
  const qbi = qbiDeduction({ qbi: qbiAmount, taxableBeforeQbi: before, filing: f, sstb: i.sstb });
  const taxable = r2(pos(before - qbi.deduction));
  const gross = federalTax(taxable, f);
  const credits = Math.min(gross, (i.children ?? 0) * P.childTaxCredit);
  const incomeTax = r2(gross - credits);
  const federalTotal = r2(incomeTax + se.total + se.additionalMedicare);
  const stateTax = stateIncomeTax(i.state, agi, taxable, f);
  const localTax = r2(net * (i.localRate ?? 0));
  const total = r2(federalTotal + stateTax + localTax + llcFees);
  const income = pos(i.profit) + w2 + other;
  // Share of the business profit to put aside: the tax the profit adds on top of the tax on the other income.
  const without = !_inner && w2 + other > 0 ? solo({ ...i, profit: 0 }, true).total : 0;
  const setAside = i.profit > 0 ? r2(pos(total - without) / i.profit) : 0;
  return {
    se, llcFees, agi, deduction, qbi, taxable, incomeTax, credits, federalTotal, stateTax, localTax, total,
    effective: income > 0 ? r2(total / income * 10000) / 10000 : 0,
    marginal: federalMarginal(taxable, f), setAside, quarterly: r2(pos(total - without) / 4), takeHome: r2(income - total),
  };
}

/* ── S corporation (LLC or corporation with the S election) ─────────────────── */
export interface ScorpInput {
  profit: number; salary: number; filing: Filing; state?: StateTax; otherIncome?: number; spouseWages?: number;
  /** Payroll service and extra return preparation per year, entered by the visitor. */ adminCost?: number; localRate?: number; sstb?: boolean;
  /** Yearly state fees and minimum taxes of the LLC (annual report, franchise tax), paid either way. */ llcFees?: number;
}
export interface ScorpResult {
  salary: number; employerFica: number; employeeFica: number; futa: number; suta: number; payrollTaxes: number; admin: number; entityTax: number;
  llcFees: number; k1: number; agi: number; qbi: QbiResult; taxable: number; incomeTax: number; stateTax: number; localTax: number; additionalMedicare: number; total: number; takeHome: number;
}
const fica = (wages: number) => {
  const ss = Math.min(wages, P.se.wageBase['2026']) * P.payroll.ssEmployer;
  const med = wages * P.payroll.medicareEmployer;
  return r2(ss + med);
};
export function scorp(i: ScorpInput): ScorpResult {
  const f = i.filing, other = i.otherIncome ?? 0, sp = i.spouseWages ?? 0;
  const salary = Math.min(pos(i.salary), pos(i.profit));
  const employerFica = fica(salary), employeeFica = fica(salary);
  const futa = r2(Math.min(salary, P.payroll.futaWageBase) * P.payroll.futaNet);
  const suta = r2(Math.min(salary, i.state?.suta.wageBase ?? 0) * (i.state?.suta.rate ?? 0));
  const admin = i.adminCost ?? 0;
  const ordinary = pos(i.profit - salary - employerFica - futa - suta - admin);
  const st = i.state?.scorp;
  const entityTax = st && (st.rate || st.minimum || st.fixed) ? r2(Math.max(st.minimum, ordinary * st.rate) + st.fixed) : 0;
  // Where the S corp tax replaces the LLC's own minimum tax (California $800), the LLC minimum is not paid twice.
  const llcFees = Math.max(0, (i.llcFees ?? 0) - (st?.replacesLlcMin ? i.state!.llc.minTax : 0));
  const k1 = r2(pos(ordinary - entityTax - llcFees));
  const agi = r2(salary + k1 + other + sp);
  const before = pos(agi - standardDeduction(f));
  const qbi = qbiDeduction({ qbi: k1, taxableBeforeQbi: before, filing: f, sstb: i.sstb, w2Paid: salary });
  const taxable = r2(pos(before - qbi.deduction));
  const incomeTax = federalTax(taxable, f);
  const stateTax = stateIncomeTax(i.state, agi, taxable, f);
  const localTax = r2(salary * (i.localRate ?? 0));
  const thr = P.additionalMedicare.threshold[f];
  const additionalMedicare = r2(pos(salary + sp - thr) * P.additionalMedicare.rate);
  const total = r2(employerFica + employeeFica + futa + suta + admin + entityTax + llcFees + incomeTax + stateTax + localTax + additionalMedicare);
  return { llcFees, salary, employerFica, employeeFica, futa, suta, payrollTaxes: r2(employerFica + employeeFica + futa + suta), admin, entityTax, k1, agi, qbi, taxable, incomeTax, stateTax, localTax, additionalMedicare, total, takeHome: r2(i.profit + other + sp - total) };
}
/** Sole proprietor / default LLC against the S election for the same profit. */
export function compareScorp(i: ScorpInput) {
  const s = solo({ profit: i.profit, filing: i.filing, w2Wages: i.spouseWages, otherIncome: i.otherIncome, state: i.state, localRate: i.localRate, sstb: i.sstb, llcFees: i.llcFees });
  const c = scorp(i);
  return { solo: s, scorp: c, savings: r2(s.total - c.total) };
}
/** Smallest profit (step $1,000) at which the S election saves money, salary = share × profit. */
export function breakEven(share: number, base: Omit<ScorpInput, 'profit' | 'salary'>, maxProfit = 400000): number | null {
  for (let p = 10000; p <= maxProfit; p += 1000) if (compareScorp({ ...base, profit: p, salary: p * share }).savings > 0) return p;
  return null;
}

/* ── C corporation ──────────────────────────────────────────────────────────── */
export interface CcorpInput { profit: number; salary: number; filing: Filing; payout: number; stateCorpRate?: number; state?: StateTax; otherIncome?: number }
export function ccorp(i: CcorpInput) {
  const f = i.filing, other = i.otherIncome ?? 0;
  const salary = Math.min(pos(i.salary), pos(i.profit));
  const employerFica = fica(salary), employeeFica = fica(salary);
  const futa = r2(Math.min(salary, P.payroll.futaWageBase) * P.payroll.futaNet);
  const suta = r2(Math.min(salary, i.state?.suta.wageBase ?? 0) * (i.state?.suta.rate ?? 0));
  const corpIncome = pos(i.profit - salary - employerFica - futa - suta);
  const stateCorp = r2(corpIncome * (i.stateCorpRate ?? 0));
  const corpTax = r2((corpIncome - stateCorp) * P.corporate.rate);
  const afterTax = pos(corpIncome - stateCorp - corpTax);
  const dividend = r2(afterTax * Math.min(1, Math.max(0, i.payout)));
  const ordinaryAgi = salary + other;
  const agi = ordinaryAgi + dividend;
  const sd = standardDeduction(f);
  const taxableOrdinary = pos(ordinaryAgi - sd);
  const taxable = pos(agi - sd);
  const ordinaryTax = federalTax(taxableOrdinary, f);
  // Qualified dividends stacked on top of ordinary income (0% / 15% / 20%).
  const qd = taxable - taxableOrdinary;
  const z = P.capitalGains.zeroMax[f], ft = P.capitalGains.fifteenMax[f];
  const at0 = pos(Math.min(taxable, z) - taxableOrdinary);
  const at15 = pos(Math.min(taxable, ft) - Math.max(taxableOrdinary, z));
  const at20 = pos(qd - at0 - at15);
  const dividendTax = r2(at15 * 0.15 + at20 * 0.2);
  const niit = r2(Math.min(dividend, pos(agi - P.niit.threshold[f])) * P.niit.rate);
  const stateTax = stateIncomeTax(i.state, agi, taxable, f);
  const total = r2(employerFica + employeeFica + futa + suta + stateCorp + corpTax + ordinaryTax + dividendTax + niit + stateTax);
  return { salary, payrollTaxes: r2(employerFica + employeeFica + futa + suta), corpIncome: r2(corpIncome), stateCorp, corpTax, retained: r2(afterTax - dividend), dividend, ordinaryTax, dividendTax, niit, stateTax, total, takeHome: r2(salary + other + dividend - employeeFica - ordinaryTax - dividendTax - niit - stateTax) };
}

/* ── Estimated taxes (Form 1040-ES, Pub 505) ────────────────────────────────── */
export interface EstInput { expectedTax: number; priorTax: number; priorAgi: number; withholding: number; filing: Filing; priorFullYear?: boolean }
export function estimated(i: EstInput) {
  const E = P.estimated;
  const high = i.priorAgi > E.highAgi[i.filing];
  const priorShare = high ? E.priorYearShareHigh : E.priorYearShare;
  const current = r2(i.expectedTax * E.currentYearShare);
  const prior = i.priorFullYear === false ? Infinity : r2(i.priorTax * priorShare);
  const required = Math.min(current, prior);
  const due = r2(pos(required - i.withholding));
  const owedAfter = r2(i.expectedTax - i.withholding);
  const mustPay = owedAfter >= E.minimumOwed && due > 0 && !(i.priorFullYear !== false && i.priorTax === 0);
  return { required, rule: (prior <= current ? (high ? '110% of last year' : '100% of last year') : '90% of this year') as string, high, perQuarter: mustPay ? r2(due / 4) : 0, annual: mustPay ? due : 0, mustPay, dates: E.dueDates };
}
/** Days between two ISO dates (UTC). */
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const RATE_TABLE: Array<[string, number]> = [['2026-01-01', P.estimated.underpaymentRate['2026Q1']], ['2026-04-01', P.estimated.underpaymentRate['2026Q2']], ['2026-07-01', P.estimated.underpaymentRate['2026Q3']], ['2026-10-01', P.estimated.underpaymentRate['2026Q4']], ['2027-01-01', P.estimated.rateAssumedAfter]];
/**
 * Form 2210 regular method, simplified: each missed installment accrues the underpayment rate of each quarter
 * (simple interest, 365-day year) from its due date until paid, at the latest April 15, 2027.
 * The rate after December 31, 2026 is not published yet: the last known rate is used (labeled on the page).
 */
function accrue(amount: number, from: string, to: string) {
  let p = 0;
  for (let j = 0; j < RATE_TABLE.length; j++) {
    const s = RATE_TABLE[j][0], e = j + 1 < RATE_TABLE.length ? RATE_TABLE[j + 1][0] : '2099-01-01';
    const a = from > s ? from : s, b = to < e ? to : e;
    const d = daysBetween(a, b); if (d > 0) p += amount * RATE_TABLE[j][1] * d / 365;
  }
  return p;
}
export function penalty(shortfall: number[], paidOn = '2027-04-15') {
  const dates = P.estimated.dueDates;
  const parts = [0, 1, 2, 3].map((k) => r2(accrue(pos(shortfall[k] ?? 0), dates[k], paidOn)));
  return { total: r2(parts.reduce((a, b) => a + b, 0)), parts };
}
/**
 * Same, from what was actually paid on each due date: a payment first covers the oldest unpaid
 * installment (Form 2210 instructions), which stops the penalty on that part from the payment date.
 */
export function penaltyFromPayments(required: number, paid: number[], finalOn = '2027-04-15') {
  const dates = P.estimated.dueDates;
  const open: Array<{ k: number; amt: number }> = []; const parts = [0, 0, 0, 0]; const shortfall = [0, 0, 0, 0];
  for (let k = 0; k < 4; k++) {
    open.push({ k, amt: pos(required) });
    let cash = pos(paid[k] ?? 0);
    for (const o of open) { if (!cash) break; const x = Math.min(cash, o.amt); if (x > 0 && o.k < k) parts[o.k] += accrue(x, dates[o.k], dates[k]); o.amt -= x; cash -= x; }
    shortfall[k] = Math.max(0, required - pos(paid[k] ?? 0));
  }
  for (const o of open) if (o.amt > 0) parts[o.k] += accrue(o.amt, dates[o.k], finalOn);
  return { total: r2(parts.reduce((a, b) => a + b, 0)), parts: parts.map(r2), shortfall: shortfall.map(r2) };
}

/* ── Small calculators ──────────────────────────────────────────────────────── */
export function homeOffice(sqft: number, homeSqft: number, homeCosts: number) {
  const H = P.homeOffice;
  const simplified = Math.min(pos(sqft), H.simplifiedMaxSqft) * H.simplifiedRate;
  const share = homeSqft > 0 ? Math.min(1, pos(sqft) / homeSqft) : 0;
  const regular = r2(pos(homeCosts) * share);
  return { simplified, regular, share, best: regular > simplified ? 'regular' : 'simplified' as 'regular' | 'simplified' };
}
export const mileage = (milesH1: number, milesH2: number) => r2(pos(milesH1) * P.mileage.h1 + pos(milesH2) * P.mileage.h2);

export function retirementMax(profit: number, age = 40) {
  const R = P.retirement;
  const se = seTax(profit);
  const comp = Math.min(pos(profit - se.half), R.compensationLimit);
  const employer = r2(comp * R.selfEmployedEffectiveRate);
  const sep = Math.min(employer, R.dcLimit);
  const catchUp = age >= 60 && age <= 63 ? R.catchUp60to63 : age >= 50 ? R.catchUp50 : 0;
  const deferral = Math.min(R.electiveDeferral, comp);
  const solo401k = r2(Math.min(deferral + employer, R.dcLimit, comp) + Math.min(catchUp, pos(comp - deferral - employer)));
  return { sep: r2(sep), solo401k, employer, deferral, catchUp };
}

/** What a 1099 contract must pay to match a W-2 job (salary + employer FICA + benefits − time off). */
export function contractorRate(salary: number, benefits: number, billableHours: number) {
  const employerFica = fica(salary);
  const needed = r2(salary + employerFica + pos(benefits));
  return { employerFica, needed, hourly: billableHours > 0 ? r2(needed / billableHours) : 0 };
}

/** Form 2553 deadline: 2 months and 15 days after the start of the tax year the election should apply to. */
export function electionDeadline(startIso: string): string {
  const d = new Date(`${startIso}T00:00:00Z`);
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + P.scorp.electionMonths, d.getUTCDate() + P.scorp.electionDays - 1));
  return target.toISOString().slice(0, 10);
}
