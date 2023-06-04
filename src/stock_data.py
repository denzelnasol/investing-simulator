import sys
from urllib.error import HTTPError
import yfinance as yf

def get_stock_data(symbols):
  symbols = symbols.replace(',', ' ')
  tickers = yf.Tickers(symbols)

  stock_data = {}  # Object to store ticker info

  for ticker_symbol, ticker_obj in tickers.tickers.items():
    try:
      stock_data[ticker_symbol] = ticker_obj.info
    except HTTPError as e:
      print(f"Error retrieving data for symbol {ticker_symbol}: {e}")
      stock_data[ticker_symbol] = None

  return stock_data

symbols = sys.argv[1]


print(get_stock_data(symbols))