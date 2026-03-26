# 💸 SheFinance – Women’s Trading & Financial Education Platform

**SheFinance** is a full-stack financial education and trading simulation platform designed to empower women to learn investing in a risk-free, interactive environment. The platform combines real-time market data, portfolio tracking, and educational resources to make finance more accessible and engaging.

---

## 🚀 Features

- 📊 **Interactive Portfolio Dashboard**  
  Track portfolio performance including revenue, losses, and overall returns in real time.

- 💼 **Trading Simulation Engine**  
  Execute simulated trades with backend logic handling:
  - Profit & Loss (P&L) calculations  
  - Cash balance updates  
  - Portfolio management  

- 📈 **Live Market Data Integration**  
  Uses `yfinance` to fetch real-time asset prices for accurate portfolio valuation.

- 📚 **Financial Education Hub**  
  Dedicated section with resources to help users learn investing fundamentals.

---

## 🛠️ Tech Stack

**Frontend**
- React  
- Next.js  
- TypeScript  

**Backend**
- Python  
- FastAPI  

**Data**
- yfinance API for live market data  

---

## ⚙️ How It Works

1. Users simulate buying and selling assets through the platform  
2. The backend processes trades and updates:
   - Portfolio holdings  
   - Cash balance  
   - Real-time P&L  
3. Live stock prices are fetched to compute current portfolio value  
4. Results are visualized in an interactive dashboard  

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Aylin025/SheFinance.git
cd SheFinance
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🌱 Future Improvements

- User authentication & personalized portfolios  
- Advanced analytics (Sharpe ratio, risk metrics)  
- Social/community features for women investors  
- AI-driven investment insights  

---

## 💡 Motivation

Finance can feel intimidating and inaccessible — especially for women who are underrepresented in investing. SheFinance aims to close that gap by providing a supportive, educational, and hands-on learning experience.

---

**Aylin Rym**  
- LinkedIn: https://linkedin.com/in/AylinRym  
