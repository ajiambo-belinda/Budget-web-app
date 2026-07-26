export const CURRENCIES = ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'UGS', 'TZS'];

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh ',
  NGN: '₦',
  UGS: 'USH',
  TZS: 'TSH',
};

export function fmt(amount, currency = 'USD') {
  const symbol = SYMBOLS[currency] || `${currency} `;
  return `${symbol}${Number(amount || 0).toFixed(2)}`;
}

export const EXPENSE_CATS = [
  'Food',
  'Transport',
  'Rent',
  'Entertainment',
  'Utilities',
  'Emergency',
  'School Fees',
  'Other',
];

export const INCOME_CATS = ['Salary', 'Freelance', 'Gift', 'Other'];

export const SAVINGS_CATS = ['Emergency Fund', 'General Savings', 'Goal-based', 'Other'];

export const INVESTMENT_CATS = ['Stocks', 'Bonds', 'Retirement', 'Real Estate', 'Crypto', 'Other'];

export const TYPE_CATS = {
  expense: EXPENSE_CATS,
  income: INCOME_CATS,
  savings: SAVINGS_CATS,
  investment: INVESTMENT_CATS,
};

export const CATEGORY_COLORS = {
  Food: ' var(--color-gold)',
  Transport: '#7CA6C4',
  Rent: '#9B7BC4',
  Entertainment: '#C46B9B',
  Utilities: ' var(--color-good)',
  Emergency: '#E76B5B',
  'School Fees': '#B98BD9',
  Salary: ' var(--color-good)',
  Freelance: '#7CA6C4',
  Gift: '#9B7BC4',
  'Emergency Fund': 'var(--color-accent)',
  'General Savings': '#6BA5E7',
  'Goal-based': '#4FB8A8',
  Stocks: 'var(--color-investment)',
  Bonds: '#A78BE0',
  Retirement: '#8B6FD6',
  'Real Estate': '#C08FE8',
  Crypto: '#E8A5D8',
  Other: ' var(--color-text-muted)',
};