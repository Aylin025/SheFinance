import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { StockMarket } from './components/StockMarket';
import { Learn } from './components/Learn';
import { ViewState, UserState } from './types';
import { INITIAL_BALANCE } from './constants';
import { getPortfolio } from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  
  // Global App State
  const [userState, setUserState] = useState<UserState>({
    balance: INITIAL_BALANCE,
    portfolio: {},
    totalEquity: INITIAL_BALANCE
  });

  useEffect(() => {
    getPortfolio()
      .then(data => setUserState(data))
      .catch(err => console.error("Failed to fetch initial portfolio:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        balance={userState.balance} 
      />
      
      <main className="animate-fade-in">
        {currentView === ViewState.HOME && (
          <Home 
            onStart={() => setCurrentView(ViewState.MARKET)} 
            onLearn={() => setCurrentView(ViewState.LEARN)} 
          />
        )}
        
        {currentView === ViewState.MARKET && (
          <StockMarket 
            userState={userState} 
            setUserState={setUserState}
          />
        )}
        
        {currentView === ViewState.LEARN && (
          <Learn />
        )}
      </main>
    </div>
  );
};

export default App;
