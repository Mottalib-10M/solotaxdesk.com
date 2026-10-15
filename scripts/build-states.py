#!/usr/bin/env python3
"""Builds src/data/states.json (pages) and src/data/states-engine.json (calculators) from the fact sheets
research/states/<slug>.json, each written from official state pages read on 2026-10-15 (see their "sources").

Rules (CONTRIBUTING-PAGES.md, "nothing uncertain"):
- an income tax is used only when the sheet gives 2026 figures (year_of_figures 2026) and the state is not listed
  in UNVERIFIED_INCOME; otherwise the pages show "n/a" and the calculators leave the state tax out;
- a fee is used only when it is a number in the sheet and the state is not listed in UNVERIFIED_FEES;
- the engine fields that need a reading of the sheet (yearly minimum tax of an LLC, tax on S corporations,
  flat local rates) are set by hand in OVERRIDES below, each with the reason.
Usage: python3 scripts/build-states.py"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, 'research', 'states')
LIST = json.load(open(os.path.join(ROOT, 'scripts', 'state-list.json')))

# Figures seen only in search excerpts because the official site blocked reading: not published.
# (each entry: the reason is in research/states/<slug>.json > "uncertain")
UNVERIFIED_INCOME = {
    'arizona',      # 2026 standard deduction not readable (azdor.gov blocked): tax on AGI would be overstated
    'arkansas',     # above $94,700 a different table applies; bracket list alone overstates
    'missouri',     # brackets read from a federal payroll office copy, top-rate cut not confirmed on DOR
    'ohio',         # HB 96 single 2.75% rate read only through a search extract; DOR worksheet still shows 2025
    'utah',         # taxpayer credit phase-out amounts for 2026 not read (site blocked)
    'new-mexico',   # 2026 brackets not readable
    'kansas',       # automatic rate-cut trigger for 2026 not checked (ksrevenue.gov unreachable)
}
UNVERIFIED_FEES = {
    'illinois', 'nevada', 'new-hampshire', 'tennessee', 'utah', 'ohio',   # fee pages blocked, figures only in search extracts
    'alaska',       # $250 (forms page, search index) conflicts with $150 in 3 AAC 16.065
}
UNVERIFIED_SUTA = {'texas', 'utah', 'arizona', 'nevada', 'new-jersey', 'new-hampshire', 'south-carolina', 'virginia', 'massachusetts', 'tennessee', 'nebraska', 'georgia', 'delaware', 'district-of-columbia'}

# Hand-set engine fields. minTax: yearly tax or fee every small LLC owes whatever its profit (on top of the annual
# report); firstYearExtra: one-time state fee beyond the filing fee; scorp: tax on an S corporation itself
# (rate on its net income, minimum, fixed), replacesLlcMin: the S corp minimum replaces the LLC minimum tax.
# local: {slug: rate} flat rates on net profit that the calculator may apply.
OVERRIDES = {
    'california': {'minTax': 800, 'minTaxName': 'Annual LLC tax (FTB 3522)',
                   'scorp': {'rate': 0.015, 'minimum': 800, 'name': 'S corporation franchise tax (1.5%, $800 minimum)', 'replacesLlcMin': True}},
    'delaware': {'minTax': 400, 'minTaxName': 'Annual LLC tax (HB 400, from 2026)'},
    'new-york': {'minTax': 25, 'minTaxName': 'LLC filing fee, Form IT-204-LL (single-member)', 'firstYearExtra': 50,
                 'scorp': {'fixed': 25, 'name': 'Fixed dollar minimum tax, CT-3-S (receipts up to $100,000)', 'replacesLlcMin': True}},
    'rhode-island': {'minTax': 400, 'minTaxName': 'Annual $400 fee (R.I. Gen. Laws 44-11-2(e))',
                     'scorp': {'fixed': 400, 'name': 'Business corporation minimum tax', 'replacesLlcMin': True}},
    'vermont': {'scorp': {'fixed': 250, 'name': 'Minimum business entity tax (BI-471)'}},
    'new-jersey': {'scorp': {'fixed': 375, 'name': 'Corporation Business Tax minimum, receipts under $100,000'}},
    'massachusetts': {'scorp': {'fixed': 456, 'name': 'Corporate excise minimum for S corporations'}},
    'oregon': {'scorp': {'fixed': 150, 'name': 'S corporation minimum excise tax'}, 'localKeys': {'trimet': 0.008237, 'lane transit': 0.008}},
    'north-carolina': {'scorp': {'fixed': 200, 'name': 'Franchise tax minimum for S corporations'}},
    'illinois': {'scorp': {'rate': 0.015, 'name': 'Personal property replacement income tax (1.5%)'}},
    'mississippi': {'scorp': {'fixed': 25, 'name': 'Franchise tax minimum for S corporations'}},
    'south-carolina': {'scorp': {'fixed': 25, 'name': 'Corporate license fee minimum'}},
    'new-mexico': {'scorp': {'fixed': 50, 'name': 'Corporate franchise tax'}},
    # Connecticut's personal exemption disappears at $45,000 single / $72,000 joint: not applied (overstates low incomes only).
    'connecticut': {'income': {'exemption': None}},
    'georgia': {'annualNull': True},     # $50 annual registration fee only in a 2014 page
    'hawaii': {'annualNull': True},      # $12.50 and $15 both published
    'nebraska': {'annualNull': True},    # biennial fee read only through a search extract
    # Flat local rates on net profit that the calculator applies (resident, no exemption modeled beyond what is noted).
    'pennsylvania': {'localKeys': {'philadelphia net profits': 0.03735, 'pittsburgh earned': 0.03}},
    'ohio': {'localKeys': {'columbus': 0.025, 'cleveland': 0.025, 'toledo': 0.025, 'dayton': 0.025, 'cincinnati': 0.018, 'akron': 0.025}},
    'missouri': {'localKeys': {'kansas city': 0.01, 'st. louis (city) earnings': 0.01}},
    'michigan': {'localKeys': {'detroit': 0.024, 'grand rapids': 0.015, 'highland park': 0.02}},
    'kentucky': {'minTax': 175, 'minTaxName': 'Limited Liability Entity Tax minimum (LLET)',
                 'scorp': {'fixed': 175, 'name': 'Limited Liability Entity Tax minimum (LLET)', 'replacesLlcMin': True},
                 'income': {'std': {'single': 3360, 'mfj': 3360}},   # joint amount not verified: one deduction only, never more
                 'localKeys': {'lexington': 0.0225}},
}

def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def num(x):
    return x if isinstance(x, (int, float)) and not isinstance(x, bool) else None

def srcs(block):
    out = []
    for s in (block or {}).get('sources') or []:
        if s.get('url'):
            out.append({'id': s.get('id', 0), 'url': s['url'], 'title': s.get('title') or s['url'], 'quote': s.get('quote')})
    return out

def br(lst):
    return [[float(a), float(b)] for a, b in (lst or [])] if lst else None

def build(meta):
    slug = meta['slug']
    path = os.path.join(RES, f'{slug}.json')
    d = json.load(open(path)) if os.path.exists(path) else {}
    o = OVERRIDES.get(slug, {})
    llc = d.get('llc') or {}
    ar = llc.get('annual_report') or {}
    inc = d.get('income_tax_2026') or {}
    sc = d.get('s_corp') or {}
    un = d.get('unemployment_2026') or {}
    est = d.get('estimated_tax') or {}
    typ = inc.get('type') or 'none'
    year = inc.get('year_of_figures') or 2026
    std = inc.get('standard_deduction') or None
    if std and (num(std.get('single')) is None or num(std.get('mfj')) is None): std = None
    pe = inc.get('personal_exemption') or {}
    ex = {'single': num(pe.get('single')) or 0, 'mfj': num(pe.get('mfj')) or 0, 'credit': bool(pe.get('is_credit'))} if (num(pe.get('single')) or num(pe.get('mfj'))) else None
    b = inc.get('brackets') or {}
    brackets = {'single': br(b.get('single')), 'mfj': br(b.get('mfj'))} if b.get('single') and b.get('mfj') else None
    start = 'federal_taxable' if 'federal taxable' in (inc.get('starting_point') or '').lower() else 'agi'
    verified = typ in ('none', 'interest_dividends_only') or (year == 2026 and slug not in UNVERIFIED_INCOME and (
        (typ == 'flat' and num(inc.get('flat_rate')) is not None) or (typ == 'graduated' and brackets is not None)))
    income = {'type': typ, 'flat': num(inc.get('flat_rate')), 'brackets': brackets, 'std': std, 'exemption': ex, 'start': start, 'year': year, 'verified': bool(verified)}
    income.update(o.get('income', {}))
    fees_ok = slug not in UNVERIFIED_FEES
    freq = ar.get('frequency') or ('none' if ar.get('fee') in (0, None) and ar.get('name') is None else None)
    llc_e = {
        'formation': num(llc.get('formation_fee')) if fees_ok else None,
        'annual': (num(ar.get('fee')) if fees_ok and not o.get('annualNull') else None),
        'frequency': freq if freq in ('annual', 'biennial', 'none') else ('annual' if num(ar.get('fee')) else 'none'),
        'minTax': o.get('minTax', 0), 'minTaxName': o.get('minTaxName'), 'firstYearExtra': o.get('firstYearExtra', 0),
    }
    if llc_e['annual'] == 0 and llc_e['frequency'] != 'none': llc_e['frequency'] = 'none' if not ar.get('name') else llc_e['frequency']
    scorp = {'recognized': sc.get('recognized') or 'yes', 'rate': 0, 'minimum': 0, 'fixed': 0, 'name': None}
    scorp.update(o.get('scorp', {}))
    suta = {'wageBase': num(un.get('taxable_wage_base')), 'rate': num(un.get('new_employer_rate'))}
    if slug in UNVERIFIED_SUTA or suta['wageBase'] is None or suta['rate'] is None: suta = {'wageBase': None, 'rate': None}
    local = []
    lrates = o.get('local', {})
    for l in d.get('local_taxes') or []:
        place = l.get('place') or ''; name = l.get('name') or ''
        ls = slugify(f"{place} {name}")[:60]
        rate = lrates.get(ls)
        key = f"{place} {name}".lower()
        for k, v in o.get('localKeys', {}).items():
            if key.startswith(k):
                rate = v
        rt = l.get('rate')
        rate_text = o.get('localText', {}).get(ls) or (f"{round(rt * 100, 4):g}%" if num(rt) is not None else 'varies')
        local.append({'slug': ls, 'place': place, 'name': name, 'rate': rate, 'rateText': rate_text, 'applies': l.get('applies') or '',
                      'threshold': l.get('threshold_or_exemption') or '', 'url': l.get('source_url') or '', 'quote': l.get('quote'),
                      'selfEmployed': rate is not None})
    full = {
        'name': meta['name'], 'slug': slug, 'abbr': meta['abbr'], 'income': income, 'llc': llc_e, 'scorp': scorp, 'suta': suta,
        'llcDetail': {'formationDoc': llc.get('formation_doc'), 'annualName': ar.get('name'), 'due': ar.get('due'),
                      'notes': [x for x in [llc.get('formation_notes')] if x] + [f"{t.get('name')}: {t.get('notes') or ''}".strip() for t in llc.get('state_tax_on_llc') or []],
                      'sources': srcs(llc)},
        'incomeDetail': {'surtaxes': inc.get('surtaxes'), 'notes': [], 'sources': srcs(inc)},
        'scorpDetail': {'taxes': [{'name': t.get('name') or '', 'text': t.get('notes') or '', 'url': None} for t in sc.get('entity_level_taxes') or []],
                        'pte': ((sc.get('pte_elective_tax') or {}).get('rate_note') if (sc.get('pte_elective_tax') or {}).get('available') else None), 'sources': srcs(sc)},
        'estimated': {'rule': est.get('required_if'), 'dates': est.get('due_dates_2026') or [], 'notes': est.get('notes'), 'url': est.get('source_url')},
        'sutaDetail': {'notes': un.get('notes'), 'url': un.get('source_url')},
        'local': local, 'notable': d.get('notable') or [], 'uncertain': d.get('uncertain') or [],
    }
    return full

def main():
    out = [build(m) for m in LIST]
    json.dump(out, open(os.path.join(ROOT, 'src', 'data', 'states.json'), 'w'), indent=1, ensure_ascii=False)
    keep = ['name', 'slug', 'abbr', 'income', 'llc', 'scorp', 'suta']
    eng = [{**{k: s[k] for k in keep}, 'local': [{'slug': l['slug'], 'name': f"{l['place']} {l['name']}".strip(), 'rate': l['rate']} for l in s['local'] if l['rate'] is not None]} for s in out]
    json.dump(eng, open(os.path.join(ROOT, 'src', 'data', 'states-engine.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
    missing = [m['slug'] for m in LIST if not os.path.exists(os.path.join(RES, f"{m['slug']}.json"))]
    print(f"{len(out)} states, {sum(s['income']['verified'] for s in out)} with a verified 2026 income rule, "
          f"{sum(s['llc']['formation'] is not None for s in out)} with LLC fees; missing sheets: {missing or 'none'}")

if __name__ == '__main__':
    main()
