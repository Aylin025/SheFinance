import asyncio
import yfinance as yf # type: ignore
from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel # type: ignore
from typing import Dict, List, Optional
from datetime import datetime
import json
import time
import subprocess
import requests

app = FastAPI()

# Global State (In-Memory Database Simulation)
INITIAL_BALANCE = 10000.0

class PortfolioItem(BaseModel):
    symbol: str
    quantity: int
    avgCost: float

class UserState(BaseModel):
    balance: float
    portfolio: Dict[str, PortfolioItem]
    totalEquity: float

class TradeRequest(BaseModel):
    symbol: str
    type: str # 'BUY' or 'SELL'
    quantity: int

user_state = UserState( # type: ignore
    balance=INITIAL_BALANCE,
    portfolio={}, # type: ignore
    totalEquity=INITIAL_BALANCE # type: ignore
)

INITIAL_STOCKS = [
    {"symbol": "GOOGL", "name": "Alphabet Inc.", "category": "Tech"},
    {"symbol": "AMZN", "name": "Amazon.com", "category": "Retail"},
    {"symbol": "TSLA", "name": "Tesla Inc.", "category": "Auto"},
    {"symbol": "AAPL", "name": "Apple Inc.", "category": "Tech"},
    {"symbol": "NVDA", "name": "NVIDIA Corp", "category": "Tech"},
    {"symbol": "JPM", "name": "JPMorgan Chase", "category": "Finance"},
    {"symbol": "KO", "name": "Coca-Cola", "category": "Consumer"},
]

def get_current_price(symbol: str) -> float:
    # Use the live cached scraped data so we never get blocked and trading P&L perfectly matches the dashboard
    global market_cache
    if market_cache:
        for stock in market_cache:
            if stock['symbol'] == symbol:
                return stock['price']
    return 0.0

@app.get("/api/portfolio")
def get_portfolio():
    # Calculate total equity
    total_equity = user_state.balance
    for symbol, item in user_state.portfolio.items():
        price = get_current_price(symbol)
        total_equity += price * item.quantity
    
    user_state.totalEquity = total_equity
    return user_state

@app.post("/api/trade")
def trade(request: TradeRequest):
    price = get_current_price(request.symbol)
    if price <= 0:
        raise HTTPException(status_code=400, detail="Cannot fetch current price for symbol")
    
    cost = request.quantity * price

    if request.type == 'BUY':
        if user_state.balance < cost:
            raise HTTPException(status_code=400, detail="Insufficient funds")
        
        user_state.balance -= cost
        if request.symbol in user_state.portfolio:
            item = user_state.portfolio[request.symbol]
            total_cost = (item.quantity * item.avgCost) + cost
            new_quantity = item.quantity + request.quantity
            item.quantity = new_quantity
            item.avgCost = total_cost / new_quantity
        else:
            user_state.portfolio[request.symbol] = PortfolioItem( # type: ignore
                symbol=request.symbol,
                quantity=request.quantity, # type: ignore
                avgCost=price # type: ignore
            )
            
    elif request.type == 'SELL':
        if request.symbol not in user_state.portfolio or user_state.portfolio[request.symbol].quantity < request.quantity:
            raise HTTPException(status_code=400, detail="Insufficient holdings")
        
        user_state.balance += cost
        item = user_state.portfolio[request.symbol]
        item.quantity -= request.quantity
        
        if item.quantity <= 0:
            user_state.portfolio.pop(request.symbol, None)
            
    return get_portfolio()

market_cache = []
last_fetch_time = 0

@app.get("/api/market")
def get_market():
    global market_cache, last_fetch_time
    # Return cache if less than 60 seconds have passed
    if time.time() - last_fetch_time < 60 and market_cache:
        return market_cache

    # Fetch all prices via subprocess to bypass uvicorn asyncio loop issues with yfinance
    symbols_str = ",".join([s["symbol"] for s in INITIAL_STOCKS])
    fetched_data = {}
    try:
        output = subprocess.check_output(["python3", "fetch_prices.py", symbols_str], text=True)
        fetched_data = json.loads(output)
    except Exception as e:
        print("Subprocess fetch failed:", e)

    result = []
    for stock in INITIAL_STOCKS:
        sym = stock["symbol"]
        current_price = 0.0 # Strict fallback to 0 if Yahoo goes down
        prev_close = 0.0
        
        if sym in fetched_data:
            current_price = fetched_data[sym]["price"]
            prev_close = fetched_data[sym]["prev"]

        change = current_price - prev_close
        change_percent = (change / prev_close) * 100 if prev_close else 0

        result.append({
            "symbol": sym,
            "name": stock["name"],
            "price": current_price,
            "change": change,
            "changePercent": change_percent,
            "category": stock["category"]
        })
        
    # Only cache if data was successfully fetched (not just fallbacks)
    is_valid = any([r['changePercent'] != 0.0 for r in result])
    
    if is_valid:
        market_cache = result
        last_fetch_time = time.time()
        return result
    else:
        # If the fetch resulted in fallback values, return cache if exists
        if market_cache:
            return market_cache
        return result


@app.get("/api/market/history/{symbol}")
def get_market_history(symbol: str):
    try:
        url = f"https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=15m&range=5d"
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        data = response.json()
        result = data['chart']['result'][0]
        timestamps = result['timestamp']
        close_prices = result['indicators']['quote'][0]['close']
        
        points = []
        for t, price in zip(timestamps, close_prices):
            if price is not None:
                time_str = datetime.fromtimestamp(t).strftime("%I:%M %p")
                points.append({
                    "time": time_str,
                    "price": float(price)
                })
        
        return list(points[-30:]) # type: ignore
    except Exception as e:
        print(f"Error fetching history for {symbol}: {e}")
        return []

