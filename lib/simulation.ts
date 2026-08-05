export interface Pillar {
  id: string;
  name: string;
  weight: number;
  tipLow: string;
  tipHigh: string;
  description: string;
}

export interface ScoreBand {
  min: number;
  max: number;
  grade: string;
  status: string;
  color: string;
  description: string;
}

export const PILLARS: Pillar[] = [
  {
    id: 'income',
    name: 'Income Stability',
    weight: 10,
    tipLow: 'diversify income sources and build a track record of consistency.',
    tipHigh: 'a dependable, well-diversified income base',
    description: 'Employment type, income consistency, growth, number of sources, industry stability.'
  },
  {
    id: 'cashflow',
    name: 'Cash Flow',
    weight: 15,
    tipLow: 'trim discretionary expenses and raise the savings rate.',
    tipHigh: 'healthy disposable income after obligations',
    description: 'Monthly income, expenses, disposable income, savings rate, EMI ratio.'
  },
  {
    id: 'debt',
    name: 'Debt Health',
    weight: 15,
    tipLow: 'prioritise repaying high-interest unsecured debt first.',
    tipHigh: 'a well-managed debt-to-income ratio',
    description: 'Secured & unsecured loans, debt-to-income, EMI burden, good debt vs bad debt.'
  },
  {
    id: 'credit',
    name: 'Credit Health',
    weight: 15,
    tipLow: 'bring utilisation down and clear overdue payments.',
    tipHigh: 'a clean, well-aged credit profile',
    description: 'Credit score, payment history, defaults, utilisation, account age, enquiries.'
  },
  {
    id: 'savings',
    name: 'Savings',
    weight: 10,
    tipLow: 'automate a fixed monthly transfer, even a small one.',
    tipHigh: 'a consistent, disciplined savings habit',
    description: 'Monthly savings habit, consistency, liquid assets, reserve creation.'
  },
  {
    id: 'emergency',
    name: 'Emergency Fund',
    weight: 10,
    tipLow: 'below the 6-month threshold — highest-leverage fix available.',
    tipHigh: 'a full emergency runway of 6+ months',
    description: 'Months of expenses survivable without income. Six months or more is healthy.'
  },
  {
    id: 'insurance',
    name: 'Insurance',
    weight: 10,
    tipLow: 'health and term cover are under-adequate — a structural risk.',
    tipHigh: 'adequate health, life and critical-illness cover',
    description: 'Adequacy of health, life, term, accident and critical-illness cover.'
  },
  {
    id: 'investments',
    name: 'Investments',
    weight: 5,
    tipLow: 'spread holdings across more than one asset class.',
    tipHigh: 'well-diversified holdings across asset classes',
    description: 'Diversification across mutual funds, stocks, EPF, PPF, NPS, gold, real estate.'
  },
  {
    id: 'retirement',
    name: 'Retirement',
    weight: 5,
    tipLow: 'contributions are behind pace for the target retirement age.',
    tipHigh: 'contributions on pace for the target age',
    description: 'Readiness from current corpus, monthly investment, age, goals, inflation.'
  },
  {
    id: 'behaviour',
    name: 'Financial Behaviour',
    weight: 5,
    tipLow: 'set a recurring monthly budget review.',
    tipHigh: 'strong budgeting and review discipline',
    description: 'Budgeting, bill discipline, expense tracking, goal setting, periodic reviews.'
  }
];

export const DEFAULT_PILLAR_VALUES: Record<string, number> = {
  income: 82,
  cashflow: 78,
  debt: 75,
  credit: 85,
  savings: 74,
  emergency: 45,
  insurance: 50,
  investments: 80,
  retirement: 65,
  behaviour: 76
};

export const SCORE_BANDS: ScoreBand[] = [
  { min: 900, max: 1000, grade: 'A+', status: 'Wealth Ready', color: 'var(--teal)', description: 'Compounding phase. Advanced tax, estate and legacy tools unlock.' },
  { min: 800, max: 899, grade: 'A', status: 'Healthy', color: 'var(--teal)', description: 'On track across every pillar. Focus shifts to optimisation and growth.' },
  { min: 700, max: 799, grade: 'B', status: 'Stable', color: 'var(--saffron)', description: 'Fundamentals in place. Automate savings and tighten protection gaps.' },
  { min: 600, max: 699, grade: 'C', status: 'Needs Attention', color: 'var(--saffron)', description: 'One or two pillars are dragging the score down — usually debt or reserves.' },
  { min: 500, max: 599, grade: 'D', status: 'Vulnerable', color: 'var(--coral)', description: 'Structural risk. Debt triage and protection cover come first.' },
  { min: 0, max: 499, grade: 'E', status: 'Distress', color: 'var(--coral)', description: 'Immediate coaching recommended before any growth-side moves.' }
];

export function getBandForScore(score: number): ScoreBand {
  return SCORE_BANDS.find(b => score >= b.min && score <= b.max) || SCORE_BANDS[SCORE_BANDS.length - 1];
}

export function calculateScoreResults(values: Record<string, number>, actualAge: number = 30) {
  let weightedSum = 0;
  PILLARS.forEach(p => {
    weightedSum += (values[p.id] || 0) * p.weight;
  });
  
  const score = Math.round((weightedSum / 100) * 10);
  const band = getBandForScore(score);

  const riskPillars = ['debt', 'emergency', 'insurance'];
  const riskRaw = 100 - (riskPillars.reduce((s, id) => s + (values[id] || 0), 0) / riskPillars.length);
  let riskLabel: 'Low' | 'Moderate' | 'High';
  if (riskRaw < 30) riskLabel = 'Low';
  else if (riskRaw < 55) riskLabel = 'Moderate';
  else riskLabel = 'High';

  const fintAge = Math.round(actualAge * (score / 700));

  const sorted = [...PILLARS].sort((a, b) => (values[a.id] || 0) - (values[b.id] || 0));
  const risks = sorted.slice(0, 2);
  const strengths = sorted.slice(-2).reverse();

  const headroom = risks.reduce((s, p) => s + (100 - (values[p.id] || 0)), 0);
  const forecast = Math.min(1000, score + Math.round(headroom * 0.18));

  const diagnosisHtml = `At <b>${score}</b>, this profile sits in the <b>${band.grade} — ${band.status}</b> band. ` +
    `Weakest: <b>${risks[0].name}</b> (${risks[0].tipLow}) and <b>${risks[1].name}</b> (${risks[1].tipLow}). ` +
    `Strongest: <b>${strengths[0].name}</b> and <b>${strengths[1].name}</b>, offering ${strengths[0].tipHigh}.`;

  return {
    score,
    band,
    riskLabel,
    fintAge,
    forecast,
    risks,
    strengths,
    diagnosisHtml
  };
}
