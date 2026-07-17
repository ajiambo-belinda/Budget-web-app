export const CURRENCIES = ['USD', 'EUR', 'GBP', 'KES', 'NGN'];

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh ',
  NGN: '₦',
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
  'Savings',
  'Emergency',
  'School Fees',
  'Other',
];

export const INCOME_CATS = ['Salary', 'Freelance', 'Gift', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#D4A24E',
  Transport: '#7CA6C4',
  Rent: '#9B7BC4',
  Entertainment: '#C46B9B',
  Utilities: '#5CA88F',
  Savings: '#6BA5E7',
  Emergency: '#E76B5B',
  'School Fees': '#B98BD9',
  Salary: '#5CA88F',
  Freelance: '#7CA6C4',
  Gift: '#9B7BC4',
  Other: '#8FA895',
};