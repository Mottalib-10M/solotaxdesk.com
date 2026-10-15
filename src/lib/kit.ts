/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                         params-2026.json (brackets, SE tax, QBI, estimated tax, mileage, retirement…)
 *   K.st('california')          a state of states.json (+ yearly LLC cost, cost over 5 years, examples)
 *   K.solo({...}), K.scorp({...}), K.compare({...}), K.ccorp({...}), K.se(x), K.qbi({...}), K.fed(x, f)…  the engine
 *   K.usd, K.cents, K.num, K.pct, K.day   formats
 */
import P from '../data/params-2026.json';
import { STATES, bySlug, type StateFull } from './data';
import { usd, cents, num, pct, day } from './fmt';
import { formatDecimal } from './format';
import * as E from './engine/tax';

/** A state with a few computed examples, for prose. */
function st(slug: string) {
  const s = bySlug(slug);
  const ex75 = E.solo({ profit: 75000, filing: 'single', state: s });
  const ex120 = E.solo({ profit: 120000, filing: 'single', state: s });
  const cmp = E.compareScorp({ profit: 120000, salary: 50000, filing: 'single', state: s, adminCost: 2000, llcFees: E.llcYearly(s) });
  return { ...s, yearly: E.llcYearly(s), cost5: E.llcCost(s, 5), first: E.llcCost(s, 1), ex75, ex120, cmp,
    stateOn75: ex75.stateTax, stateOn120: ex120.stateTax };
}
const pick = (f: (s: StateFull) => boolean) => STATES.filter(f);

export const KIT = {
  P, states: STATES, st, pick,
  solo: E.solo, scorp: E.scorp, compare: E.compareScorp, ccorp: E.ccorp, se: E.seTax, qbi: E.qbiDeduction, fed: E.federalTax, marginal: E.federalMarginal,
  est: E.estimated, penalty: E.penalty, homeOffice: E.homeOffice, mileage: E.mileage, retirement: E.retirementMax, contractor: E.contractorRate,
  breakEven: E.breakEven, election: E.electionDeadline, llcYearly: E.llcYearly, llcCost: E.llcCost, stateTax: E.stateIncomeTax,
  usd, cents, num, pct, day, dec: formatDecimal,
  /** "15.3 %" from 0.153, "12 %" from 0.12: only the decimals that exist (up to 3). */
  rate: (x: number) => { const v = Math.round(x * 100000) / 1000; const d = Number.isInteger(v) ? 0 : Number.isInteger(v * 10) ? 1 : Number.isInteger(v * 100) ? 2 : 3; return pct(x, d); },
};
export type Kit = typeof KIT;
