import json
import requests
import sys

def main():
    if len(sys.argv) < 2:
        return
    symbols = sys.argv[1].split(",")
    res = {}
    
    for s in symbols:
        url = f"https://query2.finance.yahoo.com/v8/finance/chart/{s}?interval=1d&range=1d"
        try:
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            data = response.json()
            meta = data['chart']['result'][0]['meta']
            price = meta['regularMarketPrice']
            prev = meta['chartPreviousClose']
            res[s] = {"price": float(price), "prev": float(prev)}
        except Exception:
            pass
    print(json.dumps(res))

if __name__ == "__main__":
    main()
