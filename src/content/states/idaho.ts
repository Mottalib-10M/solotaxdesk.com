import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const s = K.st('idaho');
const sos = 'https://sos.idaho.gov/business-forms/';
const tax = 'https://tax.idaho.gov/';

export default defineState({
  slug: 'idaho',
  title: `Idaho LLC Filing Fee 2026: ${K.usd(s.llc.formation!)} Online, Taxes to Check`,
  description: `Idaho in 2026: an LLC costs ${K.usd(s.llc.formation!)} to form online through SOSBiz and $20 more on paper; federal tax on ${K.usd(75000)} of profit is ${K.usd(s.ex75.total)} before any Idaho tax.`,
  intro: 'For Idaho this page reports what could be confirmed at the source, the LLC filing fee, and sends you to the agencies for everything that could not.',
  resume: `Forming an Idaho LLC costs ${K.usd(s.llc.formation!)} when the Certificate of Organization is filed online through SOSBiz, and $120 on paper because of a $20 manual processing fee. That is the one state figure this page confirms. When the figures were gathered, the servers of the Idaho State Tax Commission, the Legislature and the Department of Labor did not answer, so the 2026 income tax schedule, the treatment of S corporations, the estimated tax rules and the unemployment tax rate could not be read on an official page. The calculator therefore leaves Idaho income tax and state unemployment tax out, and its result is the federal part of the bill: about ${K.usd(s.ex75.total)} on ${K.usd(75000)} of profit for a single filer, of which ${K.usd(s.ex75.se.total)} is self-employment tax. With ${K.usd(120000)} of profit and a ${K.usd(50000)} salary, the S election saves about ${K.usd(s.cmp.savings)} a year on federal payroll tax alone. Add the Idaho tax from the commission's own forms.`,
  body: (h) => `<p>Idaho is the one state on this site where most of the official sources could not be reached. Rather than fill the gaps with figures copied from secondary websites, the page shows what the Secretary of State publishes and marks the rest as not verified. The at-a-glance table above follows the same rule, and the result of the calculator should be read as a federal figure until the Idaho line is added by hand.</p>
${h.mini('llcFees', { s: 'idaho' })}
<h2>Filing the Certificate of Organization</h2>
<p>The Secretary of State charges a base fee of ${K.usd(s.llc.formation!)} for the Certificate of Organization of a limited liability company. A paper filing adds a $20 manual processing fee, so mailing the form costs $120 (${h.ext(sos, 'Idaho Secretary of State, business forms')}). Online filing goes through SOSBiz, the office's business portal. Over five years, the only state LLC cost this page can total is that one-time fee, ${K.usd(s.cost5)}; the annual report is listed on the same forms page, but its fee and due date were not stated there, so check them with the Secretary of State before your first anniversary.</p>
<h2>Idaho income tax: what to check</h2>
<p>An Idaho resident who earns self-employment income reports it on the Idaho individual return, which takes federal adjusted gross income as its starting point. The 2026 rate, the deduction that applies before it and any change made by the 2026 legislative session could not be confirmed, so this page states none of them. The ${h.ext(tax, 'Idaho State Tax Commission')} publishes the current rate, the Form 40 instructions and the estimated payment rules. Until you have them, the safest way to read the calculator is as a floor: the federal amount it shows, plus whatever Idaho's own schedule adds.</p>
<h3>Quarterly payments</h3>
<p>The federal side does not depend on Idaho. Once you expect to owe ${K.usd(K.P.estimated.minimumOwed)} or more in federal tax for the year, four payments are due, on the dates in the ${h.a('estimated-tax-due-dates', 'estimated tax due dates')} page. Whether Idaho asks for its own installments, and from what amount, is set out by the Tax Commission.</p>
<h2>An S corporation in Idaho</h2>
<p>The federal comparison holds wherever you live. The S election moves the profit above a reasonable salary out of self-employment tax, and in exchange the company runs payroll and files Form 1120-S. The federal saving in the ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} is therefore reliable for Idaho. What it cannot yet add is Idaho unemployment tax on the owner's salary, set by the Idaho Department of Labor, or any Idaho election to tax pass-through income at the entity level. The ${h.a('reasonable-salary', 'reasonable salary guide')} explains how the salary figure drives the result.</p>`,
  faqs: [
    { q: 'How much does it cost to form an LLC in Idaho?', a: `${K.usd(s.llc.formation!)} when the Certificate of Organization is filed online through SOSBiz, the Secretary of State's portal. A paper filing costs $120, because the office adds a $20 manual processing fee. That base fee is the only Idaho LLC charge confirmed on an official page for this site; the annual report's terms are published by the Secretary of State.` },
    { q: 'Why does the calculator show no Idaho income tax?', a: 'Because the 2026 Idaho rate schedule could not be read on an official page when the figures were gathered: the State Tax Commission\'s servers did not respond. The calculator does not use rates from unofficial sources, so for Idaho it shows federal income tax and self-employment tax only. Add the Idaho tax from the Tax Commission\'s 2026 Form 40 instructions.' },
    { q: 'Is the federal S corp saving the same for an Idaho LLC?', a: `Yes, the federal part is identical in every state: with ${K.usd(120000)} of profit and a ${K.usd(50000)} salary, a single filer saves about ${K.usd(s.cmp.savings)} of federal tax a year after ${K.usd(2000)} of payroll and filing costs. Idaho unemployment tax on the salary and any state treatment of the S corporation are not included and would reduce that figure.` },
  ],
  related: ['llc-vs-s-corp', 'estimated-tax-due-dates', 'reasonable-salary', 'state:arizona', 'state:colorado'],
});
