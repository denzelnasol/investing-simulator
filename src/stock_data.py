import sys
import json
import yfinance as yf
from requests.exceptions import HTTPError

def get_stock_data(symbols):
    symbols = symbols.replace(',', ' ')
    tickers = yf.Tickers(symbols)

    stock_data = {}  # Object to store ticker info

    for ticker_symbol, ticker_obj in tickers.tickers.items():
        try:
            stock_data[ticker_symbol] = ticker_obj.info
        except HTTPError as e:
            # print(f"Error retrieving data for symbol {ticker_symbol}: {e}")
            continue

    print(stock_data)
    stock_data_json = json.dumps(stock_data)
    return stock_data_json

symbols = sys.argv[1]
get_stock_data(symbols)