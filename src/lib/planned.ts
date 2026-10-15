/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "every planned page has its file" test fails until each has its file. */
import { STATES } from './data';
export const PLANNED_GUIDES = [
  '1099-tax-calculator', 'self-employment-tax-rate', 'schedule-se', 'schedule-c', 'qbi-deduction', 'home-office-deduction', 'self-employed-tax-deductions',
  '1099-vs-w2', 'how-much-to-set-aside', '1099-forms', 'self-employed-health-insurance', 'sep-ira-vs-solo-401k', 'mileage-deduction',
  'quarterly-estimated-taxes', 'estimated-tax-due-dates', 'safe-harbor', 'underpayment-penalty',
  'llc-vs-s-corp', 's-corp', 's-corp-tax-savings-calculator', 'reasonable-salary', 'llc-taxed-as-s-corp', 'form-1120-s', 'c-corp-vs-s-corp', 'c-corporation',
  'llc-vs-corporation', 'business-structure', 'sole-proprietorship-vs-llc', 'llc-taxes', 'single-member-llc', 'llc-vs-partnership',
  'llc-cost', 'state-income-tax', 'local-business-taxes',
];
export const PLANNED_LOCAL: Record<string, string[]> = {
  'new-york': ['new-york-city'], pennsylvania: ['philadelphia'], oregon: ['portland'], ohio: ['columbus'], missouri: ['kansas-city'], michigan: ['detroit'], kentucky: ['lexington'],
};
export const PLANNED_IDS = new Set<string>([
  ...PLANNED_GUIDES, ...STATES.map((s) => `state:${s.slug}`),
  ...Object.entries(PLANNED_LOCAL).flatMap(([s, cs]) => cs.map((c) => `local:${s}/${c}`)),
]);
