import { Stock } from './types';

export const INITIAL_BALANCE = 10000;

export const INITIAL_STOCKS: Stock[] = [
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 0, change: 0, changePercent: 0, category: 'Tech' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 0, change: 0, changePercent: 0, category: 'Retail' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 0, change: 0, changePercent: 0, category: 'Auto' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 0, change: 0, changePercent: 0, category: 'Tech' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 0, change: 0, changePercent: 0, category: 'Tech' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 0, change: 0, changePercent: 0, category: 'Finance' },
  { symbol: 'KO', name: 'Coca-Cola', price: 0, change: 0, changePercent: 0, category: 'Consumer' },
];

export const MOCK_TIPS = [
  "Pay yourself first: set aside savings before spending on discretionary items.",
  "The 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Compound interest is the eighth wonder of the world. Start investing early.",
  "Diversification reduces risk. Don't put all your eggs in one basket.",
  "An emergency fund should cover 3-6 months of living expenses.",
];
