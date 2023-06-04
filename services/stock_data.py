import sys
import yfinance as yf

def get_stock_data(symbols):
  symbols = symbols.replace(',', ' ')
  tickers = yf.Tickers(symbols)

  stock_data = {}  # Object to store ticker info

  for ticker_symbol, ticker_obj in tickers.tickers.items():
      stock_data[ticker_symbol] = ticker_obj.info

  return stock_data

symbols = sys.argv[1]


print(get_stock_data(symbols))