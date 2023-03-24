import axios from 'axios';
import { Symbol } from 'enums/Stock';
import { Config } from 'Config';

const {SiteURL, Port} = Config;
const EndPoint = `${SiteURL}:${Port}/stock`;

/**
 * @memberof module:Stock
 *
 * @description Retrieve stock information from unofficial Yahoo Finance npm package
 *
 * @type {Symbol | Symbol[] | string[]} - Single symbol or list of symbols to retrieve.
 * @type {Object} - Optional query options to specify which fields to return, and in what format. More info in the documentation link below
 * @type {Object} - optional module options. More info in the documentation link below.
 * 
 * Documentation on API parameters here: https://github.com/gadicc/node-yahoo-finance2/blob/devel/docs/modules/quote.md
 *
 * @returns { object }
 */
async function getCurrentStockInfo(
  symbol: Symbol | Symbol[] | string | string[], 
  queryOptions: Object | null = null, 
  moduleOptions: Object | null = null)
{
  if (!symbol) {
    throw new Error("invalid stock symbol");
  }

  const params = {
    symbol,
    queryOptions,
    moduleOptions,
  };
  const response = await axios.get(`${EndPoint}/current`, { params });
  return response.data;
}

// interface to match return of yahoo finance API
interface historicalStockInterval {
  adjClose: number,
  close: number,
  date: string,
  high: number,
  low: number,
  open: number,
  volume: number
};

interface historicalStockInfo {
  intervals: historicalStockInterval[]
};

/**
 * @memberof module:Stock
 *
 * @description Retrieve stock information from unofficial Yahoo Finance npm package
 *
 * @type {Symbol} - Single symbol
 * @type {Object} - query options to specify starting period1 (required), period2, interval, events, includeAdjustedClose
 * @type {Object} - optional module options. More info in the documentation link below.
 * 
 * Documentation on API parameters here: https://github.com/gadicc/node-yahoo-finance2/blob/devel/docs/modules/historical.md
 *
 * @returns { object }
 */
 async function getHistoricalStockInfo(symbol: Symbol | string, queryOptions: Object | null = null, moduleOptions: Object | null = null)
  : Promise<historicalStockInfo>
{
  if (!symbol) {
    throw new Error("invalid stock symbol");
  }

  const params = {
    symbol,
    queryOptions,
    moduleOptions,
  };
  const response = await axios.get(`${EndPoint}/historical`, { params });

  return {
    intervals: response.data
  }
}

export {
  getCurrentStockInfo,
  getHistoricalStockInfo
};
