import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('minnesota');
const b = s.income.brackets?.single ?? [];
const jb = s.income.brackets?.mfj ?? [];
const top = b[b.length - 1] ?? [0, 0];
const third = b[2] ?? [0, 0];
const at200 = K.solo({ profit: 200000, filing: 'single', state: s });
const m120 = K.solo({ profit: 120000, filing: 'mfj', state: s });

export default defineState({
  slug: 'minnesota',
  title: 'Minnesota Tax Brackets 2026: Self-Employed and LLC Rules',
  description: `Minnesota 2026: four brackets up to ${K.rate(top[1])}, a free LLC annual renewal, a 9.85% elective PTE tax and the state tax on $75,000 of self-employed profit (${K.usd(s.ex75.stateTax)}).`,
  intro: 'Minnesota has one of the highest top income tax rates in the country, and its brackets bite early for a single freelancer.',
  resume: `Minnesota taxes 2026 income in four brackets, from ${K.rate(b[0]?.[1] ?? 0)} to ${K.rate(top[1])}, after a ${K.usd(s.income.std?.single ?? 0)} standard deduction for a single filer. The ${K.rate(third[1])} rate starts at ${K.usd(third[0])} of taxable income and the top rate at ${K.usd(top[0])}. On ${K.usd(75000)} of self-employment profit, a single filer owes ${K.usd(s.ex75.stateTax)} to Minnesota and ${K.usd(s.ex75.total)} with federal income tax and self-employment tax; on ${K.usd(200000)}, the state share climbs to ${K.usd(at200.stateTax)}. Keeping an LLC costs nothing each year, since the annual renewal is free, though missing it leads to administrative dissolution. Minnesota follows the S election without an entity income tax for a small company, but larger S corporations and partnerships owe a minimum fee based on their Minnesota property, payroll and sales. At ${K.usd(120000)} of profit, the model shows ${K.usd(s.cmp.savings)} of S corp saving after ${K.usd(2000)} of payroll costs.`,
  body: (h) => `<p>Few states push a single filer into a rate near 8% as early as Minnesota does. The Department of Revenue's 2026 schedule puts the ${K.rate(third[1])} bracket at ${K.usd(third[0])} of taxable income and the ${K.rate(top[1])} bracket at ${K.usd(top[0])}, while a married couple filing jointly reaches those rates at ${K.usd(jb[2]?.[0] ?? 0)} and ${K.usd(jb[3]?.[0] ?? 0)} (${h.ext('https://www.revenue.state.mn.us/press-release/2025-12-16/minnesota-income-tax-brackets-standard-deduction-and-dependent-exemption', 'Minnesota Department of Revenue, 2026 brackets')}). For a self-employed person with a good year, the jump shows up in the quarterly payments as much as in the April bill.</p>
${h.mini('stateQuick', { s: 'minnesota', p: 90000 })}
<h2>Single and married at the same profit</h2>
<p>The joint brackets are wider than the single ones, so marriage changes the Minnesota result more than in a flat-tax state. With ${K.usd(120000)} of profit, a single filer owes ${K.usd(s.ex120.stateTax)} and a couple with no other income ${K.usd(m120.stateTax)}. Half of self-employment tax and any SEP or solo 401(k) contribution reduce federal AGI, which is the starting point of the Minnesota calculation, so a retirement contribution saves at the state's marginal rate as well; the ${h.a('sep-ira-vs-solo-401k', 'SEP IRA vs solo 401(k) page')} shows the ceilings.</p>
<h2>An LLC with a free renewal</h2>
<p>Minnesota charges a filing fee for Articles of Organization, and then nothing for the annual renewal, which must still be filed every calendar year by December 31 (${h.ext('https://www.sos.mn.gov/media/1687/businessentityfees.pdf', 'Minnesota Secretary of State fee schedule')}). The fee schedule we could read dates from 2017 and the current online fee could not be confirmed, so we do not quote the formation amount; the statute sets the base fee (${h.ext('https://www.revisor.mn.gov/statutes/cite/322C.0201', 'Minn. Stat. 322C.0201')}). An LLC that skips its renewal is administratively dissolved, which can cost far more than any fee. Because nothing is due each year, the long-run cost of a Minnesota LLC is the formation fee alone, a sharp contrast with neighbors that charge every year. The income tax result is the same with or without the LLC, since a one-owner LLC is disregarded and its profit is taxed on the owner's return.</p>
<h3>Minimum fee and the PTE tax</h3>
<p>S corporations and partnerships, multi-member LLCs included, pay a minimum fee once the total of their Minnesota property, payroll and sales passes a threshold, in tiers set by Minn. Stat. 290.0922 (${h.ext('https://www.revenue.state.mn.us/sites/default/files/2026-07/m8-inst-25.pdf', 'Form M8 instructions')}). A one-person consultancy normally stays below it. The same instructions describe the elective pass-through entity tax, computed at 9.85% on the entity's income, with a credit for the owners. The ${h.a('llc-taxed-as-s-corp', 'S election guide')} covers the federal side.</p>
<p>Estimated payments are needed when tax after credits is expected to be $500 or more (${h.ext('https://www.revisor.mn.gov/statutes/cite/289A.25', 'Minn. Stat. 289A.25')}), on the federal schedule.</p>`,
  faqs: [
    { q: 'At what income does the top Minnesota tax rate start in 2026?', a: `At ${K.usd(top[0])} of Minnesota taxable income for a single filer and ${K.usd(jb[3]?.[0] ?? 0)} for a married couple filing jointly, where the ${K.rate(top[1])} rate applies to the income above that point. The ${K.rate(third[1])} bracket starts much lower, at ${K.usd(third[0])} single, according to the Department of Revenue's 2026 announcement.` },
    { q: 'Is there an annual fee to keep a Minnesota LLC?', a: 'No fee, but a filing. Minnesota LLCs must submit an annual renewal to the Secretary of State each calendar year, and it is free. An LLC that misses it is administratively dissolved and must reinstate. Multi-member LLCs taxed as partnerships may also owe the minimum fee once their Minnesota property, payroll and sales pass the threshold.' },
    { q: 'How much Minnesota tax is due on $200,000 of freelance profit?', a: `${K.usd(at200.stateTax)} for a single filer with no other income, after the ${K.usd(s.income.std?.single ?? 0)} standard deduction and half of self-employment tax come off. Part of that income falls in the ${K.rate(top[1])} bracket. Federal income tax and self-employment tax are added on top, for ${K.usd(at200.total)} in all.` },
  ],
  related: ['state-income-tax', 'sep-ira-vs-solo-401k', 'llc-taxed-as-s-corp', 'state:wisconsin', 'state:iowa'],
});
