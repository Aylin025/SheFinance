import { Stock, UserState, Transaction, MarketNews } from '../types';

export const getPortfolio = async (): Promise<UserState> => {
  const res = await fetch('/api/portfolio');
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
};

export const submitTrade = async (transaction: Transaction): Promise<UserState> => {
  const res = await fetch('/api/trade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symbol: transaction.symbol,
      type: transaction.type,
      quantity: transaction.quantity
    })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Trade failed');
  }
  return res.json();
};

export const getMarket = async (): Promise<Stock[]> => {
  const res = await fetch('/api/market');
  if (!res.ok) throw new Error('Failed to fetch market data');
  return res.json();
};

export const getMarketHistory = async (symbol: string) => {
  const res = await fetch(`/api/market/history/${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch market history');
  return res.json();
};

export const getMarketNews = async (symbol: string): Promise<string> => {
  const res = await fetch(`/api/market/news/${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch market news');
  const data = await res.json();
  return data.news;
};
