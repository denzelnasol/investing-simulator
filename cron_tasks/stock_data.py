import sys
import json
from urllib.error import HTTPError
import yfinance as yf

def get_stock_data(symbols):
  stock_data = {}  # Object to store ticker info

  if ',' not in symbols:
    ticker = yf.Ticker(symbols)
    stock_data[symbols] = ticker.info
    stock_data_json = json.dumps(stock_data)
    return stock_data_json
  
  symbols = symbols.replace(',', ' ')
  tickers = yf.Tickers(symbols)


  for ticker_symbol, ticker_obj in tickers.tickers.items():
      stock_data[ticker_symbol] = ticker_obj.info

  stock_data_json = json.dumps(stock_data)
  return stock_data_json

symbols = sys.argv[1]


print(get_stock_data(symbols))