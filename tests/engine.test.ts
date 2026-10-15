/** Engine tests: every expected value below is worked out by hand from the IRS 2026 tables (Form 1040-ES 2026,
 *  Rev. Proc. 2025-32), not from the engine. */
import { describe, expect, it } from 'vitest';
import * as E from '../src/lib/engine/tax';
import P from '../src/data/params-2026.json';

const NONE: E.StateTax = { name: 'Texas', slug: 'texas', abbr: 'TX', income: { type: 'none', flat: null, brackets: null, std: null, exemption: null, start: 'agi', year: 2026, verified: true }, llc: { formation: 300, annual: 0, frequency: 'annual', minTax: 0, minTaxName: null, firstYearExtra: 0 }, scorp: { recognized: 'yes', rate: 0, minimum: 0, fixed: 0, name: null }, suta: { wageBase: 9000, rate: 0.027 } };
const FLAT: E.StateTax = { ...NONE, name: 'Flatland', slug: 'flatland', abbr: 'FL', income: { type: 'flat', flat: 0.05, brackets: null, std: { single: 5000, mfj: 10000 }, exemption: null, start: 'agi', year: 2026, verified: true } };
const CA_LIKE: E.StateTax = { ...NONE, llc: { formation: 70, annual: 20, frequency: 'biennial', minTax: 800, minTaxName: 'Annual LLC tax', firstYearExtra: 0 }, scorp: { recognized: 'yes', rate: 0.015, minimum: 800, fixed: 0, name: 'S corporation franchise tax' } };

describe('2026 federal brackets (Form 1040-ES 2026 schedules)', () => {
  it('single: tax at each bracket edge', () => {
    expect(E.federalTax(12400, 'single')).toBe(1240);
    expect(E.federalTax(50400, 'single')).toBe(5800);
    expect(E.federalTax(105700, 'single')).toBe(17966);
    expect(E.federalTax(201775, 'single')).toBe(41024);
    expect(E.federalTax(256225, 'single')).toBe(58448);
    expect(E.federalTax(640600, 'single')).toBe(192979.25);
  });
  it('joint, head of household, separate', () => {
    expect(E.federalTax(100800, 'mfj')).toBe(11600);
    expect(E.federalTax(768700, 'mfj')).toBe(206583.5);
    expect(E.federalTax(67450, 'hoh')).toBe(7740);
    expect(E.federalTax(640600, 'hoh')).toBe(191171);
    expect(E.federalTax(384350, 'mfs')).toBe(103291.75);
  });
  it('standard deduction 2026', () => {
    expect(E.standardDeduction('single')).toBe(16100);
    expect(E.standardDeduction('mfj')).toBe(32200);
    expect(E.standardDeduction('hoh')).toBe(24150);
  });
});

describe('self-employment tax (Schedule SE)', () => {
  it('$100,000 of profit', () => {
    const r = E.seTax(100000);
    expect(r.netEarnings).toBe(92350);
    expect(r.ss).toBe(11451.4);
    expect(r.medicare).toBe(2678.15);
    expect(r.total).toBe(14129.55);
    expect(r.half).toBeCloseTo(7064.78, 1);
    expect(r.additionalMedicare).toBe(0);
  });
  it('Social Security stops at $184,500; Additional Medicare above $200,000 single', () => {
    const r = E.seTax(250000);
    expect(r.ssBase).toBe(184500);
    expect(r.ss).toBe(22878);
    expect(r.medicare).toBe(6695.38);
    expect(r.additionalMedicare).toBe(277.88);
  });
  it('W-2 wages use up the wage base first', () => {
    const r = E.seTax(100000, 'single', 150000);
    expect(r.ssBase).toBe(34500);
    expect(r.ss).toBe(4278);
  });
  it('nothing under $400 of net earnings', () => {
    expect(E.seTax(433).owes).toBe(false);
    expect(E.seTax(434).owes).toBe(true);
  });
  it('2027 wage base announced by SSA', () => { expect(E.seTax(300000, 'single', 0, '2027').ssBase).toBe(192300); });
});

describe('QBI deduction', () => {
  it('20% of QBI, capped at 20% of taxable income', () => {
    const r = E.qbiDeduction({ qbi: 80000, taxableBeforeQbi: 70000, filing: 'single' });
    expect(r.deduction).toBe(14000);
    expect(r.limitedByIncome).toBe(true);
  });
  it('$400 minimum with $1,000 of QBI (new in 2026)', () => {
    expect(E.qbiDeduction({ qbi: 1500, taxableBeforeQbi: 100000, filing: 'single' }).deduction).toBe(400);
    expect(E.qbiDeduction({ qbi: 999, taxableBeforeQbi: 100000, filing: 'single' }).deduction).toBeCloseTo(199.8, 2);
  });
  it('SSTB fully phased out above $276,750 single', () => {
    expect(E.qbiDeduction({ qbi: 300000, taxableBeforeQbi: 300000, filing: 'single', sstb: true }).deduction).toBe(0);
  });
  it('non-SSTB without wages above the range: only the $400 minimum', () => {
    expect(E.qbiDeduction({ qbi: 300000, taxableBeforeQbi: 600000, filing: 'mfj', w2Paid: 0 }).deduction).toBe(400);
  });
  it('wage limit applies above the range', () => {
    expect(E.qbiDeduction({ qbi: 300000, taxableBeforeQbi: 600000, filing: 'mfj', w2Paid: 80000 }).deduction).toBe(40000);
  });
  it('halfway through the phase-in, the excess over the wage limit is cut by half', () => {
    // single, taxable 239,250 = threshold + 37,500 (50%); QBI 100,000 → 20,000; wage limit 50% × 10,000 = 5,000.
    expect(E.qbiDeduction({ qbi: 100000, taxableBeforeQbi: 239250, filing: 'single', w2Paid: 10000 }).deduction).toBe(12500);
  });
});

describe('full picture of a sole proprietor', () => {
  it('$80,000 profit, single, no state tax', () => {
    const r = E.solo({ profit: 80000, filing: 'single', state: NONE });
    const se = E.seTax(80000);
    expect(r.se.total).toBe(se.total);
    expect(r.agi).toBeCloseTo(80000 - se.half, 2);
    const before = r.agi - 16100;
    expect(r.qbi.deduction).toBeCloseTo(Math.min(0.2 * (80000 - se.half), 0.2 * before), 2);
    expect(r.incomeTax).toBe(E.federalTax(r.taxable, 'single'));
    expect(r.stateTax).toBe(0);
    expect(r.total).toBeCloseTo(r.incomeTax + se.total, 2);
  });
  it('flat state tax on AGI minus its own deduction', () => {
    const r = E.solo({ profit: 80000, filing: 'single', state: FLAT });
    expect(r.stateTax).toBeCloseTo((r.agi - 5000) * 0.05, 1);
  });
  it('set-aside share excludes the tax on a salary', () => {
    const a = E.solo({ profit: 50000, filing: 'single', w2Wages: 60000 });
    expect(a.setAside).toBeGreaterThan(0.2);
    expect(a.setAside).toBeLessThan(0.5);
  });
});

describe('S corporation', () => {
  it('payroll taxes on a $60,000 salary', () => {
    const r = E.scorp({ profit: 150000, salary: 60000, filing: 'single', state: NONE });
    expect(r.employerFica).toBe(4590);
    expect(r.employeeFica).toBe(4590);
    expect(r.futa).toBe(42);
    expect(r.suta).toBe(243);
    expect(r.k1).toBe(150000 - 60000 - 4590 - 42 - 243);
  });
  it('saves money at $150,000 with a $60,000 salary and $2,000 of admin costs', () => {
    const c = E.compareScorp({ profit: 150000, salary: 60000, filing: 'single', state: NONE, adminCost: 2000 });
    expect(c.savings).toBeGreaterThan(3000);
  });
  it('costs money at $30,000 of profit', () => {
    expect(E.compareScorp({ profit: 30000, salary: 20000, filing: 'single', state: NONE, adminCost: 2000 }).savings).toBeLessThan(0);
  });
  it('a state S corp tax (1.5%, $800 minimum) is charged', () => {
    const r = E.scorp({ profit: 150000, salary: 60000, filing: 'single', state: CA_LIKE });
    expect(r.entityTax).toBeCloseTo(Math.max(800, (150000 - 60000 - 4590 - 42 - 243) * 0.015), 1);
  });
  it('break-even profit exists for a 40% salary', () => {
    const b = E.breakEven(0.4, { filing: 'single', state: NONE, adminCost: 2000 });
    expect(b).not.toBeNull();
    expect(b!).toBeGreaterThan(20000);
    expect(b!).toBeLessThan(120000);
  });
});

describe('C corporation', () => {
  it('21% on profit after salary, dividends taxed again', () => {
    const r = E.ccorp({ profit: 200000, salary: 80000, filing: 'single', payout: 1, state: NONE });
    expect(r.corpTax).toBeCloseTo(r.corpIncome * 0.21, 1);
    expect(r.dividend).toBeCloseTo(r.corpIncome * 0.79, 1);
    expect(r.dividendTax).toBeGreaterThan(0);
  });
  it('dividends inside the 0% band are not taxed', () => {
    const r = E.ccorp({ profit: 40000, salary: 16100, filing: 'single', payout: 1, state: NONE });
    expect(r.dividendTax).toBe(0);
  });
});

describe('estimated tax (Form 1040-ES 2026)', () => {
  it('110% of last year when last year’s AGI was over $150,000', () => {
    const r = E.estimated({ expectedTax: 20000, priorTax: 15000, priorAgi: 160000, withholding: 0, filing: 'single' });
    expect(r.required).toBe(16500);
    expect(r.perQuarter).toBe(4125);
    expect(r.rule).toBe('110% of last year');
  });
  it('90% of this year when lower', () => {
    const r = E.estimated({ expectedTax: 10000, priorTax: 30000, priorAgi: 90000, withholding: 0, filing: 'single' });
    expect(r.required).toBe(9000);
  });
  it('no payment under $1,000 owed', () => {
    expect(E.estimated({ expectedTax: 900, priorTax: 2000, priorAgi: 40000, withholding: 0, filing: 'single' }).mustPay).toBe(false);
  });
  it('due dates', () => { expect(P.estimated.dueDates).toEqual(['2026-04-15', '2026-06-15', '2026-09-15', '2027-01-15']); });
});

describe('penalty, Form 2210 regular method', () => {
  it('$1,000 missed on April 15, 2026, paid April 15, 2027', () => {
    // 77 days at 6% + 92 at 7% + 92 at 7% + 104 at 7% (rate after 2026 assumed)
    const expected = 1000 * (0.06 * 77 + 0.07 * 92 + 0.07 * 92 + 0.07 * 104) / 365;
    expect(E.penalty([1000, 0, 0, 0]).total).toBeCloseTo(expected, 2);
  });
  it('a later payment covers the oldest gap first and stops its clock', () => {
    // 1,000 due each quarter; nothing in April, 2,000 in June: the April gap runs 61 days at 6%.
    const r = E.penaltyFromPayments(1000, [0, 2000, 1000, 1000]);
    expect(r.total).toBeCloseTo(1000 * 0.06 * 61 / 365, 2);
    expect(r.shortfall[0]).toBe(1000);
  });
});

describe('small calculators', () => {
  it('home office: $5 per square foot, 300 maximum', () => {
    expect(E.homeOffice(400, 2000, 20000).simplified).toBe(1500);
    expect(E.homeOffice(200, 2000, 20000).regular).toBe(2000);
  });
  it('mileage 2026: 72.5 then 76 cents', () => { expect(E.mileage(1000, 1000)).toBe(1485); });
  it('Form 2553: March 15 for a calendar year', () => {
    expect(E.electionDeadline('2027-01-01')).toBe('2027-03-15');
    expect(E.electionDeadline('2026-11-10')).toBe('2027-01-24');
  });
  it('SEP: 20% of net earnings after half SE tax, capped at $72,000', () => {
    const se = E.seTax(100000);
    expect(E.retirementMax(100000).sep).toBeCloseTo((100000 - se.half) * 0.2, 1);
    expect(E.retirementMax(1000000).sep).toBe(72000);
  });
  it('solo 401(k) adds the $24,500 deferral', () => {
    const r = E.retirementMax(100000, 40);
    expect(r.solo401k).toBeCloseTo(24500 + r.employer, 1);
  });
  it('LLC cost: formation plus yearly cost', () => {
    expect(E.llcYearly(CA_LIKE)).toBe(810);
    expect(E.llcCost(CA_LIKE, 3)).toBe(70 + 810 * 3);
  });
});
