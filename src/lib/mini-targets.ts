/** Where the button of each mini-simulator leads: the page with the full calculator of the subject. */
import { ROUTES, route } from '../i18n/routes';
const T: Record<string, string> = {
  seQuick: 'self-employment-tax-rate', seWage: 'self-employment-tax-rate', seHalf: 'schedule-se', se2027: 'self-employment-tax-rate',
  total1099: '1099-tax-calculator', sideGig: 'how-much-to-set-aside', setAside: 'how-much-to-set-aside', invoice: 'how-much-to-set-aside',
  quarter: 'quarterly-estimated-taxes', safe110: 'safe-harbor', lateQuarter: 'underpayment-penalty', q4skip: 'estimated-tax-due-dates',
  qbiQuick: 'qbi-deduction', qbiMin: 'qbi-deduction', qbiSstb: 'qbi-deduction',
  homeQuick: 'home-office-deduction', miles: 'mileage-deduction', dedValue: 'self-employed-tax-deductions', healthQuick: 'self-employed-health-insurance',
  sepQuick: 'sep-ira-vs-solo-401k', hourly: '1099-vs-w2', necCheck: '1099-forms', schedC: 'schedule-c',
  scorpQuick: 'llc-vs-s-corp', scorpSalary: 'reasonable-salary', breakEvenQuick: 's-corp-tax-savings-calculator', payrollCost: 's-corp',
  ccorpQuick: 'c-corp-vs-s-corp', doubleTax: 'c-corp-vs-s-corp', fourWay: 'llc-vs-corporation', llcFees: 'llc-cost', llcYears: 'llc-cost',
  deadline2553: 'llc-taxed-as-s-corp', llcSplit: 'llc-vs-partnership', stateGap: 'state-income-tax', localQuick: 'local-business-taxes',
  stateQuick: 'state-income-tax', stateScorp: 'llc-vs-s-corp', stateLlc: 'llc-cost',
};
export const miniHref = (kind: string, fallback: string) => { const id = T[kind]; return id && ROUTES.some((r) => r.id === id) ? route(id, 'en') : fallback; };
