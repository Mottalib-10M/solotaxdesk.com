import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const jan = K.election('2027-01-01');
const starts = ['2026-11-01', '2027-01-01', '2027-02-01', '2027-03-01', '2027-04-01', '2027-07-01'];
const months = P.scorp.electionMonths, days = P.scorp.electionDays;
const be = K.breakEven(0.4, { filing: 'single', adminCost: 2000 });

export default defineGuide({
  id: 'llc-taxed-as-s-corp',
  group: 'structure',
  order: 5,
  slug: 'llc-taxed-as-s-corp',
  nav: 'LLC taxed as S corp',
  card: 'Form 2553: the deadline, the signatures and late election relief',
  title: 'LLC Taxed as S Corp 2026: Form 2553 Deadline and Steps',
  description: `LLC taxed as an S corp: file Form 2553 within ${months} months and ${days} days of the tax year (${K.day(jan)} for 2027). Signatures, late relief and what changes in 2026.`,
  h1: 'LLC taxed as an S corp: how to file the S election on Form 2553',
  intro: 'An LLC keeps its legal form and asks the IRS for S status on one form. Pick the first day the status should apply to get the last day to file.',
  resume: `An LLC becomes an S corporation for federal tax by filing Form 2553, Election by a Small Business Corporation. It does not need to file Form 8832 first: an eligible entity that makes a timely S election is treated as having chosen to be a corporation from the same date. The deadline is ${months} months and ${days} days after the start of the tax year the election should cover, which is ${K.day(jan)} for a calendar year 2027; it can also be filed at any time during the year before. The form must be signed by an authorized officer or member, and every owner signs a consent. A late election can still be accepted under Rev. Proc. 2013-30 if the LLC had reasonable cause and files within 3 years and 75 days of the intended date. After acceptance, the LLC runs payroll for working owners, files Form 1120-S instead of Schedule C or Form 1065, and sends each owner a K-1.`,
  tool: 'election',
  body: (h) => `<p>The S election changes how the IRS taxes an LLC, not what the LLC is. The state still sees the same company with the same members, operating agreement and annual report. What changes is the federal return: the profit stops flowing through Schedule C (one member) or a partnership return (two or more) and starts flowing through Form 1120-S, with the working owners on payroll. The election is only worth filing if the numbers work for your profit and salary, which the quick check below estimates.</p>
${h.mini('scorpQuick', { p: 120000, w: 50000 })}
<h2>No Form 8832 needed</h2>
<p>An LLC is not a corporation by default, and only a corporation can be an S corporation, so it might seem that two forms are needed: Form 8832 to be classified as a corporation, then Form 2553. The ${h.src('i2553', 'Form 2553 instructions')} remove that step: an entity eligible to elect to be treated as a corporation that meets the S corporation tests is treated as a corporation as of the effective date of the S election and does not need to file Form 8832. One form does both.</p>
<p>The LLC must pass the same tests as any S corporation: a domestic entity, ${P.scorp.maxShareholders} owners at most, only individuals, estates and certain trusts or exempt organizations as members, no nonresident alien member, and economic rights that are identical for every unit. That last test deserves a careful reading of the operating agreement: the instructions treat a company as having one class of stock when all outstanding shares confer identical rights to distribution and liquidation proceeds, so terms that pay one member differently are worth reviewing with a professional before filing. The ${h.a('s-corp', 'S corp guide')} goes through each test.</p>
<h2>The deadline: ${months} months and ${days} days</h2>
<p>Form 2553 is due no more than ${months} months and ${days} days after the beginning of the tax year in which the election should take effect, or at any time during the preceding tax year. The instructions count the two months from the day the year begins to the day before the matching day two calendar months later, then add 15 days. For an existing LLC on a calendar year, that gives ${K.day(jan)} for S status from January 1, 2027. For a new LLC, the tax year starts on the earliest of the day it first had members, first had assets or began doing business, and an election filed before that day is not valid.</p>
${h.table(['S status should start on', 'Last day to file Form 2553'], starts.map((d) => [K.day(d), K.day(K.election(d))]), `${months} months and ${days} days after the start date (Instructions for Form 2553).`, ['l', 'r'])}
<p>A deadline that falls on a weekend is not covered by the table; file early rather than count on the next business day. An election that arrives after the deadline, with no relief requested, generally takes effect for the following tax year instead.</p>
<h2>Who signs, and where it goes</h2>
<p>The form must be signed and dated by an officer authorized to sign, such as the president, treasurer or a tax officer; for an LLC, the member or manager with that authority. An unsigned Form 2553 is not considered timely filed. Separately, each owner consents in column K or on an attached consent statement. If the election is filed before the effective date, only those who own the LLC on the day of filing consent. If it is filed on or after that date, everyone who was an owner at any time from the effective date to the filing day must consent, including someone who has since left. Spouses with community property interests both consent.</p>
<p>The original, not a photocopy, is mailed or faxed to the IRS service center for the state where the business is located, as listed in the instructions. The IRS should send a determination within about 60 days. If nothing arrives within 2 months, the instructions say to follow up, and the proof that counts is a certified mail receipt, a stamped copy or the IRS acceptance letter.</p>
<h2>Missed the deadline: Rev. Proc. 2013-30</h2>
<p>Late filing is common, and the IRS has a simplified path for it. An LLC can ask for relief when it intended to be an S corporation from the date entered on line E, failed only because the form was late, had reasonable cause and acted diligently once it found the mistake, and files within 3 years and 75 days of that date. It explains the reasonable cause on line I or in a statement, and every person who was an owner during the gap states that they reported their income consistently with S status. The top of the form must read "FILED PURSUANT TO REV. PROC. 2013-30." Outside those conditions, relief generally requires a private letter ruling and a user fee.</p>
<h2>What changes once the election is accepted</h2>
<ul>
<li><strong>Payroll.</strong> Members who work in the business become employees and must receive a reasonable salary with withholding, quarterly Forms 941, a yearly Form 940 and W-2s (${h.src('p15', 'Publication 15')}). The ${h.a('reasonable-salary', 'reasonable salary guide')} explains how to set it.</li>
<li><strong>The return.</strong> Form 1120-S replaces Schedule C or Form 1065, and each member receives a K-1. Its due date is earlier than the personal return; see the ${h.a('form-1120-s', 'Form 1120-S guide')}.</li>
<li><strong>Self-employment tax.</strong> It no longer applies to the LLC's profit; payroll taxes apply to the salary instead.</li>
<li><strong>The state.</strong> Most states follow the federal status, but some tax S corporations at the entity level and a few do not recognize the election, so check your state page.</li>
</ul>
<p>The status then stays in place until it is revoked or terminated. After that, the IRS generally must consent before the same business elects again within five tax years. With a salary at 40% of profit and ${K.usd(2000)} of yearly costs, the election starts to save money from about ${be ? K.usd(be) : 'a high profit'} of profit for a single filer; the ${h.a('llc-vs-s-corp', 'LLC vs S corp calculator')} tests your own figures before you file.</p>`,
  faqs: [
    { q: 'What is the deadline to file Form 2553 for 2027?', a: `For an LLC on a calendar year that wants S status from January 1, 2027, the last day is ${K.day(jan)}: ${months} months and ${days} days after the start of the tax year. The form can also be filed at any time during 2026. A new LLC counts from the first day it had members, assets or business activity.` },
    { q: 'Does an LLC need Form 8832 before filing Form 2553?', a: 'No. The Instructions for Form 2553 state that an entity eligible to elect to be treated as a corporation, which meets the S corporation tests and files a timely Form 2553, is treated as a corporation from the effective date of the S election. It does not need to file Form 8832, Entity Classification Election, as a separate step.' },
    { q: 'Who has to sign Form 2553 for an LLC?', a: 'Two kinds of signature are needed. An officer, member or manager authorized to sign for the LLC signs and dates the form itself, and an unsigned form is not timely. Each owner also signs a consent in column K or on an attached statement, including former owners when the form is filed after the effective date.' },
    { q: 'What if I missed the Form 2553 deadline?', a: 'You can usually still get the status for the intended year. Under Rev. Proc. 2013-30, the LLC files Form 2553 within 3 years and 75 days of the intended effective date, explains its reasonable cause, writes "FILED PURSUANT TO REV. PROC. 2013-30" at the top and gets consistent-reporting statements from every owner. Otherwise the election applies from the next year.' },
    { q: 'How long does the IRS take to accept an S election?', a: 'The Instructions for Form 2553 say a determination should generally arrive within 60 days of filing. If you have heard nothing within 2 months of the date you mailed or faxed it, call the IRS. Keep proof of filing, such as a certified mail receipt or a copy with an IRS received stamp, in the company records.' },
    { q: 'Can an LLC drop its S corp status and elect again later?', a: 'It can revoke the election with the consent of owners holding more than 50% of the shares (Instructions for Form 1120-S), but it cannot simply switch back and forth. Once the status ends by revocation or termination, the IRS generally must consent to a new S election for any tax year before the fifth tax year after the one in which it ended.' },
  ],
  related: ['llc-vs-s-corp', 's-corp', 'form-1120-s', 'reasonable-salary', 'single-member-llc'],
  sources: ['i2553', 'f2553', 's_corps', 'p15', 'i1120s'],
});
