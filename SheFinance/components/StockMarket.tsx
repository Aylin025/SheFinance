import React, { useState, useEffect } from 'react';
import { Stock, UserState, Transaction, StockHistoryPoint } from '../types';
import { INITIAL_STOCKS } from '../constants';
import { StockChart } from './StockChart';
import { Button } from './Button';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { getMarket, getMarketHistory, submitTrade } from '../services/api';

interface StockMarketProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

export const StockMarket: React.FC<StockMarketProps> = ({ userState, setUserState }) => {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>(INITIAL_STOCKS[0].symbol);
  const [history, setHistory] = useState<Record<string, StockHistoryPoint[]>>({});
  
  // Trade state
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');

  const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0];
  const userHolding = userState.portfolio[selectedStockSymbol]?.quantity || 0;
  const portfolioItem = userState.portfolio[selectedStockSymbol];
  const quantity = portfolioItem?.quantity || 0;
  const avgCost = portfolioItem?.avgCost || 0;
  const profitLoss = quantity > 0 ? (selectedStock.price - avgCost) * quantity : 0;

  // Poll for market prices
  useEffect(() => {
    getMarket().then(setStocks).catch(console.error);

    const interval = setInterval(() => {
      getMarket().then(setStocks).catch(console.error);
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  // Fetch history for selected stock
  useEffect(() => {
    getMarketHistory(selectedStockSymbol)
      .then(data => {
        setHistory(prev => ({ ...prev, [selectedStockSymbol]: data }));
      })
      .catch(console.error);
  }, [selectedStockSymbol]);


  const handleTrade = async () => {
    const qty = parseInt(tradeAmount);
    if (isNaN(qty) || qty <= 0) return;

    try {
      const updatedState = await submitTrade({
        id: Date.now().toString(),
        symbol: selectedStock.symbol,
        type: tradeType,
        quantity: qty,
        price: selectedStock.price,
        date: new Date()
      });
      setUserState(updatedState);
      setTradeAmount('');
    } catch (error: any) {
      alert("Trade failed: " + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Stock List */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" /> Market Watch
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {stocks.map(stock => (
            <div 
              key={stock.symbol}
              onClick={() => {
                setSelectedStockSymbol(stock.symbol);
              }}
              className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedStockSymbol === stock.symbol ? 'bg-slate-50 border-l-4 border-l-emerald-500' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">{stock.symbol}</h3>
                  <p className="text-xs text-slate-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">${stock.price.toFixed(2)}</p>
                  <p className={`text-xs font-semibold ${stock.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chart & Trade Area */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{selectedStock.name} ({selectedStock.symbol})</h2>
            <div className="flex items-center gap-4 mt-1">
                <span className="text-2xl font-mono text-slate-700">${selectedStock.price.toFixed(2)}</span>
                <span className={`px-2 py-1 rounded-md text-sm font-bold ${selectedStock.changePercent >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                </span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-500">Your Holding</p>
            <p className="text-xl font-bold text-slate-800">{userHolding} Shares</p>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
            <StockChart 
                data={history[selectedStockSymbol] || []} 
                color={selectedStock.changePercent >= 0 ? '#10b981' : '#ef4444'}
            />
        </div>


          {/* Trading Interface */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-slate-400" /> Trade {selectedStock.symbol}
                  </h3>
                  
                  <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                      <button 
                          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tradeType === 'BUY' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
                          onClick={() => setTradeType('BUY')}
                      >
                          Buy
                      </button>
                      <button 
                          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tradeType === 'SELL' ? 'bg-white shadow-sm text-red-700' : 'text-slate-500 hover:text-slate-700'}`}
                          onClick={() => setTradeType('SELL')}
                      >
                          Sell
                      </button>
                  </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Quantity</label>
                        <input 
                            type="number" 
                            min="1"
                            value={tradeAmount}
                            onChange={(e) => setTradeAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="Amount to trade"
                        />
                    </div>
                    
                    <div className="flex justify-between text-sm text-slate-600 py-2 border-t border-slate-50">
                        <span>Estimated Total:</span>
                        <span className="font-mono font-bold">
                            ${(parseInt(tradeAmount || '0') * selectedStock.price).toFixed(2)}
                        </span>
                    </div>

                      <Button 
                          variant={tradeType === 'BUY' ? 'primary' : 'danger'} 
                          className="w-full"
                          onClick={handleTrade}
                          disabled={!tradeAmount || parseInt(tradeAmount) <= 0}
                      >
                          {tradeType} {selectedStock.symbol}
                      </Button>
                  </div>
              </div>

            {/* Portfolio Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4">Your Position</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-500">Shares Owned</span>
                        <span className="font-bold text-slate-900">{userHolding}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-500">Market Value</span>
                        <span className="font-bold text-slate-900">${(userHolding * selectedStock.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-500">Avg Cost</span>
                        <span className="font-bold text-slate-900">${avgCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-500">Profit / Loss</span>
                      <span className={`font-bold ${
                        profitLoss > 0 ? 'text-emerald-600' : profitLoss < 0 ? 'text-red-600' : 'text-slate-900'
                      }`}>
                        ${profitLoss.toFixed(2)}
                      </span>
                    </div>
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
