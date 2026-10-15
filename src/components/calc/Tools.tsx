/**
 * The calculators of the site. Every figure comes from the engine (lib/engine/tax.ts), which reads
 * params-2026.json and states-engine.json. First render = build defaults; shared links are read after mount
 * (RECETTE §17.5); the address changes only after a user action (url-state.ts, §18.1).
 */
import { useEffect, useState, type ReactNode } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows, ShareRow } from './parts';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import * as E from '../../lib/engine/tax';
import P from '../../data/params-2026.json';
import SE from '../../data/states-engine.json';

type EngineState = E.StateTax & { local: Array<{ slug: string; name: string; rate: number }> };
const STATES = SE as unknown as EngineState[];
const stateOf = (slug: string) => STATES.find((s) => s.slug === slug) ?? STATES[0];
const STATE_OPTS = STATES.map((s) => ({ value: s.slug, label: s.name }));
const usd = (x: number) => `${x < 0 ? '-' : ''}$${Math.round(Math.abs(x)).toLocaleString('en-US')}`;
const pc = (x: number, d = 1) => `${(Math.round(x * 1000 * 10 ** (d - 1)) / (10 ** (d - 1) * 10)).toLocaleString('en-US', { maximumFractionDigits: d })}%`;
const FIL = E.FILINGS.map((f) => ({ value: f.value, label: f.label }));
const longDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
declare const __BUILD_DAY__: string;

function useShared(apply: (u: URLSearchParams) => void) { useEffect(() => { const u = readParams(window.location.search); if ([...u.keys()].length) apply(u); }, []); }
const Form = ({ children }: { children: ReactNode }) => <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{children}</form>;
const Frame = ({ children }: { children: ReactNode }) => <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5"><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">{children}</div></div>;
const More = ({ children }: { children: ReactNode }) => <details className="sm:col-span-2"><summary className="cursor-pointer text-sm font-medium text-accent-700">More inputs</summary><div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">{children}</div></details>;
const Filing = ({ id, value, onChange }: { id: string; value: E.Filing; onChange: (v: E.Filing) => void }) => <SelectField id={id} label="Filing status" value={value} onChange={(v) => onChange(v as E.Filing)} options={FIL} />;
const StatePick = ({ id, value, onChange, label = 'State where you live' }: { id: string; value: string; onChange: (v: string) => void; label?: string }) => <SelectField id={id} label={label} value={value} onChange={onChange} options={STATE_OPTS} />;
const asFiling = (x: string): E.Filing => (['single', 'mfj', 'hoh', 'mfs'].includes(x) ? x as E.Filing : 'single');
const stateNote = (s: E.StateTax) => (s.income.type === 'none' ? `${s.name} has no tax on wages or business income.` : s.income.verified ? `${s.name} ${s.income.year} rates.` : `${s.name}: state rates not verified, state tax left out.`);
const stateUsed = (s: EngineState): EngineState | undefined => (s.income.verified || s.income.type === 'none' ? s : { ...s, income: { ...s.income, type: 'none' } });
type P0 = { methodHref?: string; defState?: string; lockState?: boolean; hrefs?: Record<string, string> };

/* ── Full 1099 picture (home, 1099 calculator, state pages) ───────────────────── */
export function TotalTool({ methodHref, defState = 'california', lockState = false, hrefs = {} }: P0) {
  const [profit, setProfit] = useState(85000);
  const [fil, setFil] = useState<E.Filing>('single');
  const [st, setSt] = useState(defState);
  const [w2, setW2] = useState(0);
  const [loc, setLoc] = useState('none');
  const [health, setHealth] = useState(0);
  const [ret, setRet] = useState(0);
  const [kids, setKids] = useState(0);
  useShared((u) => { setProfit(num(u, 'p', 85000)); setFil(asFiling(str(u, 'f', 'single'))); if (!lockState) setSt(str(u, 's', defState)); setW2(num(u, 'w', 0)); setLoc(str(u, 'l', 'none')); setHealth(num(u, 'h', 0)); setRet(num(u, 'r', 0)); setKids(num(u, 'k', 0)); });
  useEffect(() => updateURL({ p: profit, f: fil, s: lockState ? undefined : st, w: w2 || undefined, l: loc === 'none' ? undefined : loc, h: health || undefined, r: ret || undefined, k: kids || undefined }), [profit, fil, st, w2, loc, health, ret, kids]);
  const s = stateOf(st);
  const local = s.local.find((l) => l.slug === loc);
  const r = E.solo({ profit, filing: fil, state: stateUsed(s), w2Wages: w2, localRate: local?.rate ?? 0, healthPremiums: health, retirement: ret, children: kids });
  const c = E.compareScorp({ profit, salary: Math.round(profit * 0.4), filing: fil, state: stateUsed(s), spouseWages: w2, adminCost: 2000 });
  const locOpts = [{ value: 'none', label: s.local.length ? 'None / elsewhere in the state' : 'No local income tax modeled' }, ...s.local.map((l) => ({ value: l.slug, label: l.name }))];
  return (
    <Frame>
      <Form>
        <NumberField id="t-p" label="Net profit for 2026 (1099 income minus expenses)" value={profit} onChange={setProfit} unit="$" max={50000000} help="Schedule C line 31, or your best estimate" className="sm:col-span-2" />
        <Filing id="t-f" value={fil} onChange={setFil} />
        {lockState ? <SelectField id="t-l" label={`City or county tax in ${s.name}`} value={loc} onChange={setLoc} options={locOpts} /> : <StatePick id="t-s" value={st} onChange={(v) => { setSt(v); setLoc('none'); }} />}
        <NumberField id="t-w" label="W-2 wages from a job, if any" value={w2} onChange={setW2} unit="$" max={50000000} />
        {!lockState && <SelectField id="t-l" label="City or county tax" value={loc} onChange={setLoc} options={locOpts} />}
        <More>
          <NumberField id="t-h" label="Health insurance premiums you pay" value={health} onChange={setHealth} unit="$" max={1000000} help="Self-employed health insurance deduction" />
          <NumberField id="t-r" label="SEP or solo 401(k) contributions" value={ret} onChange={setRet} unit="$" max={100000} />
          <NumberField id="t-k" label="Children under 17" value={kids} onChange={setKids} max={20} help={`Child tax credit $${P.childTaxCredit.toLocaleString('en-US')} each`} />
        </More>
      </Form>
      <ResultCard label="Total tax on this income in 2026" value={usd(r.total)} sub={<>Put aside <strong>{pc(r.setAside)}</strong> of each payment · {usd(r.quarterly)} per quarter</>}>
        <Rows rows={[
          ['Self-employment tax (15.3%)', usd(r.se.total), r.se.total],
          ['Federal income tax', usd(r.incomeTax), r.incomeTax],
          ...(r.se.additionalMedicare ? [['Additional Medicare Tax (0.9%)', usd(r.se.additionalMedicare), r.se.additionalMedicare] as [string, string, number]] : []),
          [`${s.name} income tax`, usd(r.stateTax), r.stateTax],
          ...(local ? [[local.name, usd(r.localTax), r.localTax] as [string, string, number]] : []),
          ['QBI deduction used', usd(r.qbi.deduction)],
          ['Effective rate on all income', pc(r.effective)],
        ]} />
        <p className="mt-3 text-sm text-navy-700">{c.savings > 0 ? <>With an S corp election and a {usd(c.scorp.salary)} salary, about <strong>{usd(c.savings)}</strong> less tax{hrefs.scorp ? <> (<a className="underline" href={hrefs.scorp}>check it</a>)</> : null}.</> : <>At this profit an S corp election would not save tax after $2,000 of payroll costs.</>}</p>
        <ShareRow methodHref={methodHref} note={stateNote(s)} />
      </ResultCard>
    </Frame>
  );
}

/* ── SE tax only ─────────────────────────────────────────────────────────── */
export function SeTool({ methodHref }: P0) {
  const [profit, setProfit] = useState(70000);
  const [w2, setW2] = useState(0);
  const [fil, setFil] = useState<E.Filing>('single');
  const [year, setYear] = useState<'2026' | '2027'>('2026');
  useShared((u) => { setProfit(num(u, 'p', 70000)); setW2(num(u, 'w', 0)); setFil(asFiling(str(u, 'f', 'single'))); setYear(str(u, 'y', '2026') === '2027' ? '2027' : '2026'); });
  useEffect(() => updateURL({ p: profit, w: w2 || undefined, f: fil, y: year }), [profit, w2, fil, year]);
  const r = E.seTax(profit, fil, w2, year);
  return (
    <Frame>
      <Form>
        <NumberField id="se-p" label="Net profit from self-employment" value={profit} onChange={setProfit} unit="$" max={50000000} help="Schedule C line 31 (all businesses together)" className="sm:col-span-2" />
        <NumberField id="se-w" label="W-2 wages taxed for Social Security" value={w2} onChange={setW2} unit="$" max={50000000} />
        <Filing id="se-f" value={fil} onChange={setFil} />
        <Choice id="se-y" label="Tax year" value={year} onChange={setYear} options={[{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }]} />
      </Form>
      <ResultCard label={`Self-employment tax for ${year}`} value={usd(r.total + r.additionalMedicare)} sub={r.owes ? <>Half of the 15.3% part, <strong>{usd(r.half)}</strong>, comes off your income</> : 'Under $400 of net earnings: no SE tax'}>
        <Rows rows={[
          ['Net earnings (92.35% of profit)', usd(r.netEarnings)],
          [`Social Security 12.4% on ${usd(r.ssBase)}`, usd(r.ss), r.ss],
          ['Medicare 2.9% on all of it', usd(r.medicare), r.medicare],
          ['Additional Medicare 0.9%', usd(r.additionalMedicare), r.additionalMedicare],
          ['Social Security wage base', usd(P.se.wageBase[year])],
        ]} />
        <ShareRow methodHref={methodHref} note={year === '2027' ? 'SSA announced the 2027 wage base on October 14, 2026.' : 'Schedule SE and Form 1040-ES 2026.'} />
      </ResultCard>
    </Frame>
  );
}

/* ── Quarterly estimated taxes ─────────────────────────────────────────────── */
export function QuarterlyTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(90000);
  const [fil, setFil] = useState<E.Filing>('single');
  const [st, setSt] = useState(defState);
  const [prior, setPrior] = useState(14000);
  const [priorAgi, setPriorAgi] = useState(80000);
  const [wh, setWh] = useState(0);
  useShared((u) => { setProfit(num(u, 'p', 90000)); setFil(asFiling(str(u, 'f', 'single'))); setSt(str(u, 's', defState)); setPrior(num(u, 'py', 14000)); setPriorAgi(num(u, 'pa', 80000)); setWh(num(u, 'wh', 0)); });
  useEffect(() => updateURL({ p: profit, f: fil, s: st, py: prior, pa: priorAgi, wh: wh || undefined }), [profit, fil, st, prior, priorAgi, wh]);
  const s = stateOf(st);
  const fed = E.solo({ profit, filing: fil });
  const r = E.estimated({ expectedTax: fed.federalTotal, priorTax: prior, priorAgi, withholding: wh, filing: fil });
  const stateYear = E.solo({ profit, filing: fil, state: stateUsed(s) }).stateTax;
  return (
    <Frame>
      <Form>
        <NumberField id="q-p" label="Expected net profit for 2026" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <Filing id="q-f" value={fil} onChange={setFil} />
        <StatePick id="q-s" value={st} onChange={setSt} />
        <NumberField id="q-py" label="Total tax on your 2025 return" value={prior} onChange={setPrior} unit="$" max={50000000} help="Form 1040, line 24" />
        <NumberField id="q-pa" label="AGI on your 2025 return" value={priorAgi} onChange={setPriorAgi} unit="$" max={50000000} help="Form 1040, line 11" />
        <More><NumberField id="q-wh" label="Federal tax withheld in 2026 (W-2)" value={wh} onChange={setWh} unit="$" max={50000000} /></More>
      </Form>
      <ResultCard label="Federal payment due each quarter" value={usd(r.perQuarter)} sub={r.mustPay ? <>Safe harbor used: <strong>{r.rule}</strong> ({usd(r.required)} for the year)</> : 'Under the $1,000 rule: no estimated payment required'}>
        <Rows rows={[
          ...P.estimated.dueDates.map((d, i) => [`Payment ${i + 1}, due ${longDate(d)}`, usd(r.perQuarter)] as [string, string]),
          ['Expected 2026 federal tax (income + SE)', usd(fed.federalTotal)],
          [`${s.name} income tax for the year`, usd(stateYear)],
        ]} />
        <ShareRow methodHref={methodHref} note="Form 1040-ES 2026; state estimates follow state rules." />
      </ResultCard>
    </Frame>
  );
}

/* ── Safe harbor ─────────────────────────────────────────────────────────── */
export function SafeHarborTool({ methodHref }: P0) {
  const [prior, setPrior] = useState(22000);
  const [priorAgi, setPriorAgi] = useState(165000);
  const [expected, setExpected] = useState(30000);
  const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setPrior(num(u, 'py', 22000)); setPriorAgi(num(u, 'pa', 165000)); setExpected(num(u, 'e', 30000)); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ py: prior, pa: priorAgi, e: expected, f: fil }), [prior, priorAgi, expected, fil]);
  const r = E.estimated({ expectedTax: expected, priorTax: prior, priorAgi, withholding: 0, filing: fil });
  const high = r.high;
  return (
    <Frame>
      <Form>
        <NumberField id="sh-py" label="Total tax on your 2025 return" value={prior} onChange={setPrior} unit="$" max={50000000} />
        <NumberField id="sh-pa" label="2025 adjusted gross income" value={priorAgi} onChange={setPriorAgi} unit="$" max={50000000} />
        <NumberField id="sh-e" label="Tax you expect for 2026" value={expected} onChange={setExpected} unit="$" max={50000000} />
        <Filing id="sh-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label="Smallest 2026 total that avoids the penalty" value={usd(r.required)} sub={<>{high ? '110%' : '100%'} of last year&apos;s tax: {usd(prior * (high ? 1.1 : 1))} · 90% of this year: {usd(expected * 0.9)}</>}>
        <Rows rows={[
          ['Rule that applies', r.rule],
          ['Per quarter', usd(r.required / 4)],
          ['Left to pay in April 2027 if income holds', usd(Math.max(0, expected - r.required))],
          ['High-income test (2025 AGI)', high ? `over ${usd(P.estimated.highAgi[fil])}` : `${usd(P.estimated.highAgi[fil])} or less`],
        ]} />
        <ShareRow methodHref={methodHref} note="Form 1040-ES 2026, General Rule and Higher income taxpayers." />
      </ResultCard>
    </Frame>
  );
}

/* ── Underpayment penalty ───────────────────────────────────────────────── */
export function PenaltyTool({ methodHref }: P0) {
  const [req, setReq] = useState(4000);
  const [p1, setP1] = useState(4000); const [p2, setP2] = useState(0); const [p3, setP3] = useState(2000); const [p4, setP4] = useState(4000);
  useShared((u) => { setReq(num(u, 'q', 4000)); setP1(num(u, 'a', 4000)); setP2(num(u, 'b', 0)); setP3(num(u, 'c', 2000)); setP4(num(u, 'd', 4000)); });
  useEffect(() => updateURL({ q: req, a: p1, b: p2, c: p3, d: p4 }), [req, p1, p2, p3, p4]);
  const r = E.penaltyFromPayments(req, [p1, p2, p3, p4]);
  const short = r.shortfall;
  return (
    <Frame>
      <Form>
        <NumberField id="pe-q" label="Required payment per quarter" value={req} onChange={setReq} unit="$" max={50000000} help="A quarter of your safe harbor amount" className="sm:col-span-2" />
        <NumberField id="pe-a" label="Paid by April 15, 2026" value={p1} onChange={setP1} unit="$" max={50000000} />
        <NumberField id="pe-b" label="Paid by June 15, 2026" value={p2} onChange={setP2} unit="$" max={50000000} />
        <NumberField id="pe-c" label="Paid by September 15, 2026" value={p3} onChange={setP3} unit="$" max={50000000} />
        <NumberField id="pe-d" label="Paid by January 15, 2027" value={p4} onChange={setP4} unit="$" max={50000000} />
      </Form>
      <ResultCard label="Estimated penalty if the rest is paid April 15, 2027" value={usd(r.total)} sub="Interest-like charge at the IRS underpayment rate, quarter by quarter">
        <Rows rows={short.map((x, i) => [`Short on payment ${i + 1}`, `${usd(x)} → ${usd(r.parts[i])}`] as [string, string])} />
        <ShareRow methodHref={methodHref} note="Rates 7%, 6%, 7%, 7% in 2026; 7% assumed for 2027 until published." />
      </ResultCard>
    </Frame>
  );
}

/* ── Schedule C ─────────────────────────────────────────────────────────── */
export function ScheduleCTool({ methodHref }: P0) {
  const [gross, setGross] = useState(110000);
  const [cogs, setCogs] = useState(0);
  const [exp, setExp] = useState(18000);
  const [miles, setMiles] = useState(4000);
  const [office, setOffice] = useState(150);
  useShared((u) => { setGross(num(u, 'g', 110000)); setCogs(num(u, 'c', 0)); setExp(num(u, 'e', 18000)); setMiles(num(u, 'm', 4000)); setOffice(num(u, 'o', 150)); });
  useEffect(() => updateURL({ g: gross, c: cogs || undefined, e: exp, m: miles || undefined, o: office || undefined }), [gross, cogs, exp, miles, office]);
  const car = E.mileage(miles / 2, miles / 2);
  const home = E.homeOffice(office, 0, 0).simplified;
  const net = Math.max(0, gross - cogs - exp - car - home);
  const se = E.seTax(net);
  return (
    <Frame>
      <Form>
        <NumberField id="sc-g" label="Gross receipts (line 1)" value={gross} onChange={setGross} unit="$" max={50000000} help="All 1099-NEC, 1099-K and cash income" className="sm:col-span-2" />
        <NumberField id="sc-c" label="Cost of goods sold (line 4)" value={cogs} onChange={setCogs} unit="$" max={50000000} />
        <NumberField id="sc-e" label="Other expenses (lines 8 to 27)" value={exp} onChange={setExp} unit="$" max={50000000} />
        <NumberField id="sc-m" label="Business miles driven in 2026" value={miles} onChange={setMiles} unit="mi" max={500000} help="Half before July 1 (72.5¢), half after (76¢)" />
        <NumberField id="sc-o" label="Home office, square feet" value={office} onChange={setOffice} unit="sq ft" max={5000} help="Simplified method, $5 per sq ft, 300 max" />
      </Form>
      <ResultCard label="Net profit, Schedule C line 31" value={usd(net)} sub={<>Self-employment tax on it: <strong>{usd(se.total)}</strong></>}>
        <Rows rows={[
          ['Gross income', usd(gross - cogs)],
          ['Expenses you entered', usd(-exp)],
          ['Car, standard mileage rate', usd(-car)],
          ['Home office, simplified', usd(-home)],
          ['Half of SE tax, deducted on Schedule 1', usd(se.half)],
        ]} />
        <ShareRow methodHref={methodHref} note="Schedule C instructions; mileage rates IR-2025-128 and IR-2026-29." />
      </ResultCard>
    </Frame>
  );
}

/* ── QBI ─────────────────────────────────────────────────────────────────── */
export function QbiTool({ methodHref }: P0) {
  const [qbi, setQbi] = useState(120000);
  const [ti, setTi] = useState(110000);
  const [fil, setFil] = useState<E.Filing>('single');
  const [sstb, setSstb] = useState<'no' | 'yes'>('no');
  const [w2, setW2] = useState(0);
  useShared((u) => { setQbi(num(u, 'q', 120000)); setTi(num(u, 't', 110000)); setFil(asFiling(str(u, 'f', 'single'))); setSstb(str(u, 'ss', 'no') === 'yes' ? 'yes' : 'no'); setW2(num(u, 'w', 0)); });
  useEffect(() => updateURL({ q: qbi, t: ti, f: fil, ss: sstb, w: w2 || undefined }), [qbi, ti, fil, sstb, w2]);
  const r = E.qbiDeduction({ qbi, taxableBeforeQbi: ti, filing: fil, sstb: sstb === 'yes', w2Paid: w2 });
  const saved = E.federalTax(ti, fil) - E.federalTax(ti - r.deduction, fil);
  const phase = r.phase === 'below' ? `Below the ${usd(P.qbi.threshold[fil])} threshold: no wage limit` : r.phase === 'phase-in' ? `In the phase-in range (${usd(P.qbi.threshold[fil])} to ${usd(P.qbi.phaseInEnd[fil])})` : `Above ${usd(P.qbi.phaseInEnd[fil])}: full wage limit${sstb === 'yes' ? ', no deduction for a service business' : ''}`;
  return (
    <Frame>
      <Form>
        <NumberField id="qb-q" label="Qualified business income" value={qbi} onChange={setQbi} unit="$" max={50000000} help="Profit minus half SE tax, SE health and retirement deductions" className="sm:col-span-2" />
        <NumberField id="qb-t" label="Taxable income before the QBI deduction" value={ti} onChange={setTi} unit="$" max={50000000} help="AGI minus the standard or itemized deduction" />
        <Filing id="qb-f" value={fil} onChange={setFil} />
        <Choice id="qb-s" label="Specified service business?" value={sstb} onChange={setSstb} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes (law, health, consulting…)' }]} />
        <NumberField id="qb-w" label="W-2 wages the business paid" value={w2} onChange={setW2} unit="$" max={50000000} />
      </Form>
      <ResultCard label="QBI deduction for 2026" value={usd(r.deduction)} sub={<>Federal income tax saved: <strong>{usd(saved)}</strong></>}>
        <Rows rows={[
          ['20% of QBI', usd(qbi * P.qbi.rate)],
          ['Cap: 20% of taxable income', usd(Math.max(0, ti) * P.qbi.rate)],
          ['Where you are', phase],
          ...(r.minimumApplied ? [['$400 minimum (new in 2026)', 'applied'] as [string, string]] : []),
        ]} />
        <ShareRow methodHref={methodHref} note="Rev. Proc. 2025-32 §4.26; Form 8995 instructions." />
      </ResultCard>
    </Frame>
  );
}

/* ── Home office ─────────────────────────────────────────────────────────── */
export function HomeOfficeTool({ methodHref }: P0) {
  const [sq, setSq] = useState(200); const [home, setHome] = useState(1500); const [costs, setCosts] = useState(30000); const [profit, setProfit] = useState(80000);
  useShared((u) => { setSq(num(u, 'o', 200)); setHome(num(u, 'h', 1500)); setCosts(num(u, 'c', 30000)); setProfit(num(u, 'p', 80000)); });
  useEffect(() => updateURL({ o: sq, h: home, c: costs, p: profit }), [sq, home, costs, profit]);
  const r = E.homeOffice(sq, home, costs);
  const best = Math.max(r.simplified, r.regular);
  const saved = E.solo({ profit, filing: 'single' }).federalTotal - E.solo({ profit: profit - Math.min(best, profit), filing: 'single' }).federalTotal;
  return (
    <Frame>
      <Form>
        <NumberField id="ho-o" label="Office area used only for work" value={sq} onChange={setSq} unit="sq ft" max={20000} />
        <NumberField id="ho-h" label="Whole home area" value={home} onChange={setHome} unit="sq ft" max={100000} />
        <NumberField id="ho-c" label="Yearly home costs" value={costs} onChange={setCosts} unit="$" max={5000000} help="Rent or mortgage interest, utilities, insurance, repairs" />
        <NumberField id="ho-p" label="Net profit before the deduction" value={profit} onChange={setProfit} unit="$" max={50000000} />
      </Form>
      <ResultCard label="Best home office deduction" value={usd(best)} sub={<>{r.best === 'regular' ? 'Regular method (Form 8829)' : 'Simplified method'} · federal tax saved about <strong>{usd(saved)}</strong> (single filer)</>}>
        <Rows rows={[
          [`Simplified: $${P.homeOffice.simplifiedRate} × ${Math.min(sq, P.homeOffice.simplifiedMaxSqft)} sq ft`, usd(r.simplified), r.simplified],
          [`Regular: ${pc(r.share)} of home costs`, usd(r.regular), r.regular],
        ]} />
        <ShareRow methodHref={methodHref} note="Regular method shown before depreciation, which adds to it but is recaptured on sale." />
      </ResultCard>
    </Frame>
  );
}

/* ── Value of a deduction ───────────────────────────────────────────────── */
export function DeductionsTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(75000); const [ded, setDed] = useState(5000); const [fil, setFil] = useState<E.Filing>('single'); const [st, setSt] = useState(defState);
  useShared((u) => { setProfit(num(u, 'p', 75000)); setDed(num(u, 'd', 5000)); setFil(asFiling(str(u, 'f', 'single'))); setSt(str(u, 's', defState)); });
  useEffect(() => updateURL({ p: profit, d: ded, f: fil, s: st }), [profit, ded, fil, st]);
  const s = stateUsed(stateOf(st));
  const a = E.solo({ profit, filing: fil, state: s }), b = E.solo({ profit: Math.max(0, profit - ded), filing: fil, state: s });
  const saved = a.total - b.total;
  return (
    <Frame>
      <Form>
        <NumberField id="de-p" label="Net profit before this expense" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <NumberField id="de-d" label="Business expense you deduct" value={ded} onChange={setDed} unit="$" max={50000000} />
        <Filing id="de-f" value={fil} onChange={setFil} />
        <StatePick id="de-s" value={st} onChange={setSt} />
      </Form>
      <ResultCard label="Tax saved by the deduction" value={usd(saved)} sub={<>Each $100 of expense really costs you <strong>{usd(100 - (ded > 0 ? saved / ded * 100 : 0))}</strong></>}>
        <Rows rows={[
          ['Self-employment tax saved', usd(a.se.total - b.se.total), a.se.total - b.se.total],
          ['Federal income tax saved', usd(a.incomeTax - b.incomeTax), a.incomeTax - b.incomeTax],
          ['State income tax saved', usd(a.stateTax - b.stateTax), a.stateTax - b.stateTax],
        ]} />
        <ShareRow methodHref={methodHref} note="The QBI deduction shrinks a little with each expense: included." />
      </ResultCard>
    </Frame>
  );
}

/* ── W-2 against 1099 ───────────────────────────────────────────────────── */
export function W2vs1099Tool({ methodHref, defState = 'california' }: P0) {
  const [salary, setSalary] = useState(90000); const [rate, setRate] = useState(65); const [hours, setHours] = useState(1600); const [ben, setBen] = useState(9000); const [st, setSt] = useState(defState);
  useShared((u) => { setSalary(num(u, 'w', 90000)); setRate(num(u, 'r', 65)); setHours(num(u, 'h', 1600)); setBen(num(u, 'b', 9000)); setSt(str(u, 's', defState)); });
  useEffect(() => updateURL({ w: salary, r: rate, h: hours, b: ben, s: st }), [salary, rate, hours, ben, st]);
  const s = stateUsed(stateOf(st));
  const w = E.solo({ profit: 0, filing: 'single', w2Wages: salary, state: s });
  const employeeFica = Math.min(salary, P.se.wageBase['2026']) * 0.062 + salary * 0.0145;
  const wNet = salary - w.total - employeeFica + ben;
  const gross1099 = rate * hours;
  const c = E.solo({ profit: gross1099, filing: 'single', state: s });
  const cNet = gross1099 - c.total;
  const need = E.contractorRate(salary, ben, hours);
  return (
    <Frame>
      <Form>
        <NumberField id="wv-w" label="W-2 salary offered" value={salary} onChange={setSalary} unit="$" max={10000000} />
        <NumberField id="wv-b" label="Value of the job's benefits per year" value={ben} onChange={setBen} unit="$" max={1000000} help="Employer health premium, 401(k) match, paid leave" />
        <NumberField id="wv-r" label="1099 rate per hour" value={rate} onChange={setRate} unit="$" max={10000} />
        <NumberField id="wv-h" label="Billable hours per year as a contractor" value={hours} onChange={setHours} unit="h" max={4000} help="2,080 is 40 hours × 52 weeks, with no time off" />
        <StatePick id="wv-s" value={st} onChange={setSt} />
      </Form>
      <ResultCard label="Rate the 1099 contract needs to match the job" value={`${usd(need.hourly)}/h`} sub={<>Your {usd(rate)}/h contract leaves <strong>{usd(cNet - wNet)}</strong> {cNet >= wNet ? 'more' : 'less'} than the W-2 job</>}>
        <Rows rows={[
          ['W-2: take-home + benefits', usd(wNet)],
          ['1099: take-home (single filer)', usd(cNet)],
          ['Employer half of FICA you now pay', usd(need.employerFica)],
          ['1099 gross at your hours', usd(gross1099)],
        ]} />
        <ShareRow methodHref={methodHref} note="Single filer, no expenses deducted on the 1099 side." />
      </ResultCard>
    </Frame>
  );
}

/* ── How much to set aside ──────────────────────────────────────────────── */
export function SetAsideTool({ methodHref, defState = 'california' }: P0) {
  const [inc, setInc] = useState(60000); const [exp, setExp] = useState(6000); const [w2, setW2] = useState(0); const [fil, setFil] = useState<E.Filing>('single'); const [st, setSt] = useState(defState);
  useShared((u) => { setInc(num(u, 'i', 60000)); setExp(num(u, 'e', 6000)); setW2(num(u, 'w', 0)); setFil(asFiling(str(u, 'f', 'single'))); setSt(str(u, 's', defState)); });
  useEffect(() => updateURL({ i: inc, e: exp, w: w2 || undefined, f: fil, s: st }), [inc, exp, w2, fil, st]);
  const r = E.solo({ profit: Math.max(0, inc - exp), filing: fil, w2Wages: w2, state: stateUsed(stateOf(st)) });
  const shareOfGross = inc > 0 ? r.setAside * Math.max(0, inc - exp) / inc : 0;
  return (
    <Frame>
      <Form>
        <NumberField id="sa-i" label="1099 income you expect in 2026" value={inc} onChange={setInc} unit="$" max={50000000} className="sm:col-span-2" />
        <NumberField id="sa-e" label="Business expenses" value={exp} onChange={setExp} unit="$" max={50000000} />
        <NumberField id="sa-w" label="W-2 salary from a job" value={w2} onChange={setW2} unit="$" max={50000000} />
        <Filing id="sa-f" value={fil} onChange={setFil} />
        <StatePick id="sa-s" value={st} onChange={setSt} />
      </Form>
      <ResultCard label="Set aside from each payment you receive" value={pc(shareOfGross)} sub={<>{usd(shareOfGross * 1000)} from every $1,000 invoice</>}>
        <Rows rows={[
          ['Tax this side income adds', usd(r.setAside * Math.max(0, inc - exp))],
          ['Per month', usd(r.setAside * Math.max(0, inc - exp) / 12)],
          ['Of which SE tax', usd(r.se.total)],
          ['Marginal federal bracket', pc(r.marginal, 0)],
        ]} />
        <ShareRow methodHref={methodHref} note="Federal, SE and state tax; local taxes not included." />
      </ResultCard>
    </Frame>
  );
}

/* ── Self-employed health insurance ─────────────────────────────────────── */
export function HealthTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(70000); const [prem, setPrem] = useState(7200); const [fil, setFil] = useState<E.Filing>('single'); const [st, setSt] = useState(defState);
  useShared((u) => { setProfit(num(u, 'p', 70000)); setPrem(num(u, 'h', 7200)); setFil(asFiling(str(u, 'f', 'single'))); setSt(str(u, 's', defState)); });
  useEffect(() => updateURL({ p: profit, h: prem, f: fil, s: st }), [profit, prem, fil, st]);
  const s = stateUsed(stateOf(st));
  const a = E.solo({ profit, filing: fil, state: s }), b = E.solo({ profit, filing: fil, state: s, healthPremiums: prem });
  const allowed = Math.min(prem, Math.max(0, profit - a.se.half));
  return (
    <Frame>
      <Form>
        <NumberField id="hi-p" label="Net profit" value={profit} onChange={setProfit} unit="$" max={50000000} />
        <NumberField id="hi-h" label="Health, dental and long-term care premiums" value={prem} onChange={setPrem} unit="$" max={1000000} help="For you, your spouse and dependents, not subsidized" />
        <Filing id="hi-f" value={fil} onChange={setFil} />
        <StatePick id="hi-s" value={st} onChange={setSt} />
      </Form>
      <ResultCard label="Income tax saved by the deduction" value={usd(a.total - b.total)} sub={<>Deduction allowed: <strong>{usd(allowed)}</strong> (capped at profit minus half SE tax)</>}>
        <Rows rows={[
          ['Federal income tax', usd(a.incomeTax - b.incomeTax), a.incomeTax - b.incomeTax],
          ['State income tax', usd(a.stateTax - b.stateTax), a.stateTax - b.stateTax],
          ['Self-employment tax', usd(0)],
        ]} />
        <ShareRow methodHref={methodHref} note="Schedule 1 line 17; it does not reduce SE tax." />
      </ResultCard>
    </Frame>
  );
}

/* ── SEP or solo 401(k) ─────────────────────────────────────────────────── */
export function RetirementTool({ methodHref }: P0) {
  const [profit, setProfit] = useState(100000); const [age, setAge] = useState(45);
  useShared((u) => { setProfit(num(u, 'p', 100000)); setAge(num(u, 'a', 45)); });
  useEffect(() => updateURL({ p: profit, a: age }), [profit, age]);
  const r = E.retirementMax(profit, age);
  const saved = E.solo({ profit, filing: 'single' }).total - E.solo({ profit, filing: 'single', retirement: r.solo401k }).total;
  return (
    <Frame>
      <Form>
        <NumberField id="re-p" label="Net profit from self-employment" value={profit} onChange={setProfit} unit="$" max={50000000} />
        <NumberField id="re-a" label="Your age at the end of 2026" value={age} onChange={setAge} max={100} />
      </Form>
      <ResultCard label="Most you can put in a solo 401(k) for 2026" value={usd(r.solo401k)} sub={<>A SEP IRA tops out at <strong>{usd(r.sep)}</strong> at this profit</>}>
        <Rows rows={[
          ['Employee deferral', usd(r.deferral), r.deferral],
          ['Employer share (20% of net earnings)', usd(r.employer), r.employer],
          ...(r.catchUp ? [[`Catch-up at ${age}`, usd(r.catchUp), r.catchUp] as [string, string, number]] : []),
          ['Federal tax saved at the solo 401(k) maximum', usd(saved)],
        ]} />
        <ShareRow methodHref={methodHref} note="Notice 2025-67 limits; Pub 560 rate for the self-employed." />
      </ResultCard>
    </Frame>
  );
}

/* ── Mileage ───────────────────────────────────────────────────────────── */
export function MileageTool({ methodHref }: P0) {
  const [m1, setM1] = useState(3000); const [m2, setM2] = useState(3000); const [profit, setProfit] = useState(70000);
  useShared((u) => { setM1(num(u, 'a', 3000)); setM2(num(u, 'b', 3000)); setProfit(num(u, 'p', 70000)); });
  useEffect(() => updateURL({ a: m1, b: m2, p: profit }), [m1, m2, profit]);
  const d = E.mileage(m1, m2);
  const saved = E.solo({ profit, filing: 'single' }).federalTotal - E.solo({ profit: Math.max(0, profit - d), filing: 'single' }).federalTotal;
  return (
    <Frame>
      <Form>
        <NumberField id="mi-a" label="Business miles, January to June 2026" value={m1} onChange={setM1} unit="mi" max={500000} />
        <NumberField id="mi-b" label="Business miles, July to December 2026" value={m2} onChange={setM2} unit="mi" max={500000} />
        <NumberField id="mi-p" label="Net profit before the car deduction" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
      </Form>
      <ResultCard label="Standard mileage deduction for 2026" value={usd(d)} sub={<>Federal and SE tax saved: <strong>{usd(saved)}</strong> (single filer)</>}>
        <Rows rows={[[`${m1.toLocaleString('en-US')} mi × 72.5¢`, usd(m1 * P.mileage.h1)], [`${m2.toLocaleString('en-US')} mi × 76¢`, usd(m2 * P.mileage.h2)]]} />
        <ShareRow methodHref={methodHref} note="IRS raised the rate on July 1, 2026 (IR-2026-29)." />
      </ResultCard>
    </Frame>
  );
}

/* ── 1099-NEC / 1099-K thresholds ──────────────────────────────────────── */
export function NecTool({ methodHref }: P0) {
  const [client, setClient] = useState(1800); const [kAmt, setKAmt] = useState(15000); const [kN, setKN] = useState(120);
  useShared((u) => { setClient(num(u, 'c', 1800)); setKAmt(num(u, 'k', 15000)); setKN(num(u, 'n', 120)); });
  useEffect(() => updateURL({ c: client, k: kAmt, n: kN }), [client, kAmt, kN]);
  const nec = client >= P.infoReturns.necThreshold;
  const k = kAmt > P.infoReturns.kThresholdAmount && kN > P.infoReturns.kThresholdCount;
  return (
    <Frame>
      <Form>
        <NumberField id="ne-c" label="Paid to you by one business client in 2026" value={client} onChange={setClient} unit="$" max={50000000} />
        <NumberField id="ne-k" label="Payments through one app or platform" value={kAmt} onChange={setKAmt} unit="$" max={50000000} />
        <NumberField id="ne-n" label="Number of those platform payments" value={kN} onChange={setKN} max={1000000} />
      </Form>
      <ResultCard label="Forms you should receive for 2026" value={nec && k ? '1099-NEC and 1099-K' : nec ? '1099-NEC' : k ? '1099-K' : 'None required'} sub="Every dollar is taxable either way, with or without a form">
        <Rows rows={[
          ['1099-NEC threshold (payments after 2025)', `${usd(P.infoReturns.necThreshold)} or more`],
          ['1099-K threshold', `over ${usd(P.infoReturns.kThresholdAmount)} and over ${P.infoReturns.kThresholdCount} payments`],
          ['SE tax on this client alone', usd(E.seTax(client).total)],
        ]} />
        <ShareRow methodHref={methodHref} note="Rev. Proc. 2025-32 §2.15; Form 1099-K instructions (Rev. December 2026)." />
      </ResultCard>
    </Frame>
  );
}

/* ── LLC (default) against the S election ───────────────────────────────── */
export function ScorpTool({ methodHref, defState = 'california', lockState = false }: P0) {
  const [profit, setProfit] = useState(120000); const [salary, setSalary] = useState(55000); const [st, setSt] = useState(defState); const [fil, setFil] = useState<E.Filing>('single'); const [admin, setAdmin] = useState(2000);
  useShared((u) => { setProfit(num(u, 'p', 120000)); setSalary(num(u, 'w', 55000)); if (!lockState) setSt(str(u, 's', defState)); setFil(asFiling(str(u, 'f', 'single'))); setAdmin(num(u, 'a', 2000)); });
  useEffect(() => updateURL({ p: profit, w: salary, s: lockState ? undefined : st, f: fil, a: admin }), [profit, salary, st, fil, admin]);
  const s = stateUsed(stateOf(st))!;
  const fees = E.llcYearly(s);
  const c = E.compareScorp({ profit, salary, filing: fil, state: s, adminCost: admin, llcFees: fees });
  return (
    <Frame>
      <Form>
        <NumberField id="sc-p" label="Business profit before your salary" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <NumberField id="sc-w" label="Salary you would pay yourself" value={salary} onChange={setSalary} unit="$" max={50000000} help="Must be reasonable for the work (IRS)" />
        <NumberField id="sc-a" label="Payroll service and extra tax return, per year" value={admin} onChange={setAdmin} unit="$" max={100000} help="Your quotes; $2,000 is only a placeholder" />
        {!lockState && <StatePick id="sc-s" value={st} onChange={setSt} />}
        <Filing id="sc-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label={c.savings >= 0 ? 'S corp election saves per year' : 'S corp election costs per year'} value={usd(Math.abs(c.savings))} sub={<>LLC taxed by default: {usd(c.solo.total)} · as an S corp: {usd(c.scorp.total)}</>}>
        <Rows rows={[
          ['SE tax as an LLC', usd(c.solo.se.total + c.solo.se.additionalMedicare)],
          ['Payroll taxes on the salary (both halves, FUTA, state)', usd(c.scorp.payrollTaxes + c.scorp.additionalMedicare)],
          ['Federal income tax: LLC / S corp', `${usd(c.solo.incomeTax)} / ${usd(c.scorp.incomeTax)}`],
          [`${s.name} income tax: LLC / S corp`, `${usd(c.solo.stateTax)} / ${usd(c.scorp.stateTax)}`],
          ...(c.scorp.entityTax ? [[`${s.name} tax on the S corp itself`, usd(c.scorp.entityTax)] as [string, string]] : []),
          ['Payroll and filing costs', usd(admin)],
          ['QBI deduction: LLC / S corp', `${usd(c.solo.qbi.deduction)} / ${usd(c.scorp.qbi.deduction)}`],
        ]} />
        <ShareRow methodHref={methodHref} note={`${s.name} LLC fees (${usd(fees)} a year) are paid either way.`} />
      </ResultCard>
    </Frame>
  );
}

/* ── An S corp owner's taxes ────────────────────────────────────────────── */
export function ScorpTaxTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(150000); const [salary, setSalary] = useState(65000); const [st, setSt] = useState(defState); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setProfit(num(u, 'p', 150000)); setSalary(num(u, 'w', 65000)); setSt(str(u, 's', defState)); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ p: profit, w: salary, s: st, f: fil }), [profit, salary, st, fil]);
  const s = stateUsed(stateOf(st));
  const r = E.scorp({ profit, salary, filing: fil, state: s });
  return (
    <Frame>
      <Form>
        <NumberField id="st-p" label="S corp profit before your salary" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <NumberField id="st-w" label="Your W-2 salary" value={salary} onChange={setSalary} unit="$" max={50000000} />
        <StatePick id="st-s" value={st} onChange={setSt} />
        <Filing id="st-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label="All taxes on the S corp's profit in 2026" value={usd(r.total)} sub={<>K-1 profit passed to your return: <strong>{usd(r.k1)}</strong> (Form 1120-S)</>}>
        <Rows rows={[
          ['Social Security and Medicare, both halves', usd(r.employerFica + r.employeeFica), r.employerFica + r.employeeFica],
          ['FUTA and state unemployment', usd(r.futa + r.suta), r.futa + r.suta],
          ['Federal income tax (salary + K-1)', usd(r.incomeTax), r.incomeTax],
          [`${s.name} income tax`, usd(r.stateTax), r.stateTax],
          ...(r.entityTax ? [[`${s.name} tax on the corporation`, usd(r.entityTax), r.entityTax] as [string, string, number]] : []),
          ['QBI deduction on the K-1 income', usd(r.qbi.deduction)],
        ]} />
        <ShareRow methodHref={methodHref} note="Payroll service and return preparation not included." />
      </ResultCard>
    </Frame>
  );
}

/* ── Break-even profit ─────────────────────────────────────────────────── */
export function BreakevenTool({ methodHref, defState = 'california' }: P0) {
  const [share, setShare] = useState(40); const [st, setSt] = useState(defState); const [admin, setAdmin] = useState(2000); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setShare(num(u, 'r', 40)); setSt(str(u, 's', defState)); setAdmin(num(u, 'a', 2000)); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ r: share, s: st, a: admin, f: fil }), [share, st, admin, fil]);
  const s = stateUsed(stateOf(st));
  const base = { filing: fil, state: s, adminCost: admin, llcFees: E.llcYearly(s!) };
  const be = E.breakEven(share / 100, base);
  const pts = [60000, 100000, 150000, 250000].map((p) => [p, E.compareScorp({ ...base, profit: p, salary: p * share / 100 }).savings]);
  return (
    <Frame>
      <Form>
        <NumberField id="be-r" label="Salary as a share of profit" value={share} onChange={setShare} unit="%" max={100} help="Reasonable pay for your role decides it" />
        <NumberField id="be-a" label="Yearly payroll and filing costs" value={admin} onChange={setAdmin} unit="$" max={100000} />
        <StatePick id="be-s" value={st} onChange={setSt} />
        <Filing id="be-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label="Profit where the S corp starts to pay off" value={be ? usd(be) : 'not below $400,000'} sub={`Salary at ${share}% of profit, ${s!.name}`}>
        <Rows rows={pts.map(([p, v]) => [`Profit ${usd(p)}`, `${v >= 0 ? 'saves' : 'costs'} ${usd(Math.abs(v))}`] as [string, string])} />
        <ShareRow methodHref={methodHref} />
      </ResultCard>
    </Frame>
  );
}

/* ── Four structures side by side ───────────────────────────────────────── */
export function CompareTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(140000); const [salary, setSalary] = useState(60000); const [st, setSt] = useState(defState); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setProfit(num(u, 'p', 140000)); setSalary(num(u, 'w', 60000)); setSt(str(u, 's', defState)); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ p: profit, w: salary, s: st, f: fil }), [profit, salary, st, fil]);
  const s = stateUsed(stateOf(st))!;
  const fees = E.llcYearly(s);
  const sp = E.solo({ profit, filing: fil, state: s });
  const llc = E.solo({ profit, filing: fil, state: s, llcFees: fees });
  const sc = E.scorp({ profit, salary, filing: fil, state: s, adminCost: 2000, llcFees: fees });
  const cc = E.ccorp({ profit, salary, filing: fil, payout: 1, state: s });
  const all: Array<[string, number]> = [['Sole proprietorship', sp.total], [`LLC (${s.name} fees included)`, llc.total], ['S corp (+$2,000 payroll costs)', sc.total], ['C corp, all profit paid out', cc.total]];
  const best = all.reduce((a, b) => (b[1] < a[1] ? b : a));
  return (
    <Frame>
      <Form>
        <NumberField id="cp-p" label="Business profit before any owner salary" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <NumberField id="cp-w" label="Salary in an S or C corp" value={salary} onChange={setSalary} unit="$" max={50000000} />
        <StatePick id="cp-s" value={st} onChange={setSt} />
        <Filing id="cp-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label="Lowest total tax for this profit" value={best[0]} sub={<>{usd(best[1])} of tax in 2026</>}>
        <Rows rows={all.map(([l, v]) => [l, usd(v), v] as [string, string, number])} />
        <ShareRow methodHref={methodHref} note="C corp: state corporate tax not included." />
      </ResultCard>
    </Frame>
  );
}

/* ── C corp against S corp ─────────────────────────────────────────────── */
export function CcorpTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(250000); const [salary, setSalary] = useState(90000); const [payout, setPayout] = useState(50); const [corp, setCorp] = useState(0); const [st, setSt] = useState(defState); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setProfit(num(u, 'p', 250000)); setSalary(num(u, 'w', 90000)); setPayout(num(u, 'd', 50)); setCorp(num(u, 'c', 0)); setSt(str(u, 's', defState)); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ p: profit, w: salary, d: payout, c: corp || undefined, s: st, f: fil }), [profit, salary, payout, corp, st, fil]);
  const s = stateUsed(stateOf(st));
  const c = E.ccorp({ profit, salary, filing: fil, payout: payout / 100, stateCorpRate: corp / 100, state: s });
  const sc = E.scorp({ profit, salary, filing: fil, state: s });
  return (
    <Frame>
      <Form>
        <NumberField id="cc-p" label="Profit before your salary" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <NumberField id="cc-w" label="Your salary" value={salary} onChange={setSalary} unit="$" max={50000000} />
        <NumberField id="cc-d" label="Share of after-tax profit paid as dividends" value={payout} onChange={setPayout} unit="%" max={100} />
        <StatePick id="cc-s" value={st} onChange={setSt} />
        <NumberField id="cc-c" label="State corporate income tax rate" value={corp} onChange={setCorp} unit="%" max={20} decimals={2} help="Look it up for your state; 0 by default" />
      </Form>
      <ResultCard label="Tax this year as a C corp" value={usd(c.total)} sub={<>Same profit as an S corp: {usd(sc.total)} · {usd(c.retained)} left inside the company</>}>
        <Rows rows={[
          ['Corporate income tax (21%)', usd(c.corpTax), c.corpTax],
          ['Payroll taxes on the salary', usd(c.payrollTaxes), c.payrollTaxes],
          ['Income tax on the salary', usd(c.ordinaryTax), c.ordinaryTax],
          ['Tax on dividends (0/15/20%) and NIIT', usd(c.dividendTax + c.niit), c.dividendTax + c.niit],
          [`${s!.name} personal income tax`, usd(c.stateTax), c.stateTax],
        ]} />
        <ShareRow methodHref={methodHref} note="Retained profit is taxed again when paid out later." />
      </ResultCard>
    </Frame>
  );
}

/* ── LLC cost by state ─────────────────────────────────────────────────── */
export function LlcCostTool({ methodHref, defState = 'california', lockState = false }: P0) {
  const [st, setSt] = useState(defState); const [years, setYears] = useState(5);
  useShared((u) => { if (!lockState) setSt(str(u, 's', defState)); setYears(num(u, 'y', 5)); });
  useEffect(() => updateURL({ s: lockState ? undefined : st, y: years }), [st, years]);
  const s = stateOf(st);
  const known = STATES.filter((x) => x.llc.formation !== null);
  const costs = known.map((x) => [x.name, E.llcCost(x, years)] as [string, number]).sort((a, b) => a[1] - b[1]);
  const total = E.llcCost(s, years);
  return (
    <Frame>
      <Form>
        {!lockState && <StatePick id="lc-s" value={st} onChange={setSt} label="State where the LLC is formed" />}
        <NumberField id="lc-y" label="Years you keep the LLC" value={years} onChange={setYears} unit="yrs" max={50} />
      </Form>
      <ResultCard label={`State cost of an LLC in ${s.name}, ${years} year${years === 1 ? '' : 's'}`} value={s.llc.formation === null ? 'not verified' : usd(total)} sub={<>Formation {s.llc.formation === null ? 'n/a' : usd(s.llc.formation)} · then {usd(E.llcYearly(s))} a year</>}>
        <Rows rows={[
          ['Filing fee to form', s.llc.formation === null ? 'n/a' : usd(s.llc.formation)],
          [`Annual report (${s.llc.frequency ?? 'n/a'})`, s.llc.annual === null ? 'n/a' : usd(s.llc.annual)],
          ...(s.llc.minTax ? [[s.llc.minTaxName ?? 'Minimum tax', `${usd(s.llc.minTax)} a year`] as [string, string]] : []),
          ...(s.llc.firstYearExtra ? [['One-time extra (publication, etc.)', usd(s.llc.firstYearExtra)] as [string, string]] : []),
          ...(costs.length ? [[`Cheapest: ${costs[0][0]}`, usd(costs[0][1])] as [string, string], [`Most expensive: ${costs[costs.length - 1][0]}`, usd(costs[costs.length - 1][1])] as [string, string]] : []),
        ]} />
        <ShareRow methodHref={methodHref} note="State fees only: no registered agent, lawyer or service fees." />
      </ResultCard>
    </Frame>
  );
}

/* ── Reasonable salary ─────────────────────────────────────────────────── */
export function SalaryTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(160000); const [salary, setSalary] = useState(70000); const [st, setSt] = useState(defState); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setProfit(num(u, 'p', 160000)); setSalary(num(u, 'w', 70000)); setSt(str(u, 's', defState)); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ p: profit, w: salary, s: st, f: fil }), [profit, salary, st, fil]);
  const s = stateUsed(stateOf(st));
  const at = (w: number) => E.compareScorp({ profit, salary: w, filing: fil, state: s, adminCost: 0 }).savings;
  const steps = [0.3, 0.45, 0.6, 0.75].map((x) => Math.round(profit * x / 1000) * 1000);
  return (
    <Frame>
      <Form>
        <NumberField id="rs-p" label="Profit before your salary" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <NumberField id="rs-w" label="Salary you are considering" value={salary} onChange={setSalary} unit="$" max={50000000} help="What would you pay someone else for this work?" />
        <StatePick id="rs-s" value={st} onChange={setSt} />
        <Filing id="rs-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label="Tax saved against an LLC, before payroll costs" value={usd(at(salary))} sub="Each extra $10,000 of salary gives back part of the saving">
        <Rows rows={steps.map((w) => [`Salary ${usd(w)}`, usd(at(w))] as [string, string])} />
        <ShareRow methodHref={methodHref} note="A salary too low for the work can be recharacterized by the IRS." />
      </ResultCard>
    </Frame>
  );
}

/* ── Form 2553 deadline ────────────────────────────────────────────────── */
export function ElectionTool({ methodHref }: P0) {
  const [start, setStart] = useState('2027-01-01');
  useShared((u) => { setStart(str(u, 'd', '2027-01-01')); });
  useEffect(() => updateURL({ d: start }), [start]);
  const opts = ['2026-11-01', '2026-12-01', '2027-01-01', '2027-02-01', '2027-03-01', '2027-04-01', '2027-07-01'].map((d) => ({ value: d, label: longDate(d) }));
  const dl = E.electionDeadline(start);
  const late = E.electionDeadline('2027-01-01');
  return (
    <Frame>
      <Form>
        <SelectField id="el-d" label="First day the S status should apply" value={start} onChange={setStart} options={opts} help="Jan. 1 for an existing LLC; for a new one, the day it starts business, gets assets or members" className="sm:col-span-2" />
      </Form>
      <ResultCard label="Last day to file Form 2553" value={longDate(dl)} sub="2 months and 15 days after the start of the tax year">
        <Rows rows={[
          ['For calendar year 2027', longDate(late)],
          ['Shareholders who must sign', 'all of them'],
          ['Missed it?', 'late election relief (Rev. Proc. 2013-30)'],
        ]} />
        <ShareRow methodHref={methodHref} note="Instructions for Form 2553." />
      </ResultCard>
    </Frame>
  );
}

/* ── LLC taxes ─────────────────────────────────────────────────────────── */
export function LlcTaxTool({ methodHref, defState = 'california' }: P0) {
  const [profit, setProfit] = useState(90000); const [members, setMembers] = useState<'1' | '2'>('1'); const [st, setSt] = useState(defState); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setProfit(num(u, 'p', 90000)); setMembers(str(u, 'm', '1') === '2' ? '2' : '1'); setSt(str(u, 's', defState)); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ p: profit, m: members, s: st, f: fil }), [profit, members, st, fil]);
  const s = stateUsed(stateOf(st))!;
  const fees = E.llcYearly(s);
  const share = members === '2' ? profit / 2 : profit;
  const r = E.solo({ profit: share, filing: fil, state: s, llcFees: members === '2' ? fees / 2 : fees });
  return (
    <Frame>
      <Form>
        <NumberField id="lt-p" label="LLC profit for 2026" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <Choice id="lt-m" label="Members" value={members} onChange={setMembers} options={[{ value: '1', label: 'One' }, { value: '2', label: 'Two, 50/50' }]} />
        <StatePick id="lt-s" value={st} onChange={setSt} />
        <Filing id="lt-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label={members === '2' ? 'Tax for each member' : 'Tax on the LLC profit'} value={usd(r.total)} sub={members === '2' ? 'Form 1065 for the LLC, a K-1 to each member' : 'No LLC return: Schedule C on your Form 1040'}>
        <Rows rows={[
          ['Self-employment tax', usd(r.se.total), r.se.total],
          ['Federal income tax', usd(r.incomeTax), r.incomeTax],
          [`${s.name} income tax`, usd(r.stateTax), r.stateTax],
          [`${s.name} LLC fees and minimum tax`, usd(r.llcFees), r.llcFees],
        ]} />
        <ShareRow methodHref={methodHref} note="Default classification: no federal tax on the LLC itself." />
      </ResultCard>
    </Frame>
  );
}

/* ── Two states compared ───────────────────────────────────────────────── */
export function StateCompareTool({ methodHref }: P0) {
  const [profit, setProfit] = useState(100000); const [a, setA] = useState('california'); const [b, setB] = useState('texas'); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setProfit(num(u, 'p', 100000)); setA(str(u, 'a', 'california')); setB(str(u, 'b', 'texas')); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ p: profit, a, b, f: fil }), [profit, a, b, fil]);
  const A = stateUsed(stateOf(a))!, B = stateUsed(stateOf(b))!;
  const ra = E.solo({ profit, filing: fil, state: A, llcFees: E.llcYearly(A) }), rb = E.solo({ profit, filing: fil, state: B, llcFees: E.llcYearly(B) });
  return (
    <Frame>
      <Form>
        <NumberField id="sx-p" label="Net profit" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        <StatePick id="sx-a" value={a} onChange={setA} label="First state" />
        <StatePick id="sx-b" value={b} onChange={setB} label="Second state" />
        <Filing id="sx-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label={`Difference per year, ${A.name} against ${B.name}`} value={usd(ra.total - rb.total)} sub="Income tax and LLC fees; federal tax is the same">
        <Rows rows={[
          [`${A.name} income tax`, usd(ra.stateTax), ra.stateTax], [`${A.name} LLC yearly cost`, usd(ra.llcFees), ra.llcFees],
          [`${B.name} income tax`, usd(rb.stateTax), rb.stateTax], [`${B.name} LLC yearly cost`, usd(rb.llcFees), rb.llcFees],
        ]} />
        <ShareRow methodHref={methodHref} note="Residents only; local taxes on the city pages." />
      </ResultCard>
    </Frame>
  );
}

/* ── A local tax ───────────────────────────────────────────────────────── */
export function LocalTool({ methodHref, defState = 'new-york', place }: P0 & { place?: string }) {
  const s = stateOf(defState);
  const all = STATES.flatMap((x) => x.local.map((l) => ({ ...l, st: x.slug, stName: x.name })));
  const [loc, setLoc] = useState(place ?? all[0]?.slug ?? '');
  const [profit, setProfit] = useState(90000); const [fil, setFil] = useState<E.Filing>('single');
  useShared((u) => { setProfit(num(u, 'p', 90000)); if (!place) setLoc(str(u, 'l', all[0]?.slug ?? '')); setFil(asFiling(str(u, 'f', 'single'))); });
  useEffect(() => updateURL({ p: profit, l: place ? undefined : loc, f: fil }), [profit, loc, fil]);
  const L = all.find((x) => x.slug === loc) ?? all[0];
  const st = stateUsed(stateOf(L?.st ?? s.slug))!;
  const r = E.solo({ profit, filing: fil, state: st, localRate: L?.rate ?? 0 });
  return (
    <Frame>
      <Form>
        <NumberField id="lo-p" label="Net profit of the business" value={profit} onChange={setProfit} unit="$" max={50000000} className="sm:col-span-2" />
        {!place && <SelectField id="lo-l" label="City or county" value={loc} onChange={setLoc} options={all.map((x) => ({ value: x.slug, label: `${x.name} (${x.stName})` }))} />}
        <Filing id="lo-f" value={fil} onChange={setFil} />
      </Form>
      <ResultCard label={L ? `${L.name}, 2026` : 'Local tax'} value={usd(r.localTax)} sub={<>Total with federal and {st.name} tax: <strong>{usd(r.total)}</strong></>}>
        <Rows rows={[
          ['Local rate applied to net profit', L ? pc(L.rate, 3) : 'n/a'],
          ['Self-employment tax', usd(r.se.total)],
          ['Federal income tax', usd(r.incomeTax)],
          [`${st.name} income tax`, usd(r.stateTax)],
        ]} />
        <ShareRow methodHref={methodHref} note="Flat rate on net profit; exemptions and credits on the page." />
      </ResultCard>
    </Frame>
  );
}
