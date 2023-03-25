const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance2').default;

const stockDbService = require('../services/Stock');
const stockApiService = require('../services/StockApi');

/* GET current stock listing. */
router.get('/current', async (req, res, next) => {
  const symbol = req.query.symbol;
  const queryOptions = req.query.queryOptions;
  const moduleOptions = req.query.moduleOptions

  const result = await yahooFinance.quote(symbol, queryOptions, moduleOptions);
  res.send(result);
});

/* GET historical stock listing. */
router.get('/current', async (req, res, next) => {
  const symbol = req.query.symbol;
  const queryOptions = req.query.queryOptions;
  const moduleOptions = req.query.moduleOptions

  const result = await yahooFinance.historical(symbol, queryOptions, moduleOptions);
  res.send(result);
});


// when user clicks on stock it should show stock info page
router.get('/:symbol', async (req, res, next) => {
  try {


    // get portfolioId from cookie.token
    var portfolioId = req.body.portfolioId;

    let symbol = req.params.symbol;

    let pfData = await stockDbService.getStockInfo(portfolioId, symbol);
    let details = await stockApiService.getRTStockDetails(symbol);

    res.send({
      numShares: pfData.num_shares,
      amountInvested: pfData.amount_invested,
      details: details,
    });


  } catch (err) {
    res.status(404).json(err);
  }
});

// when the user searches for stocks show a list of all available stocks
router.get('/all', async (req, res, next) => {
  try {


    let stocks = await stockDbService.getAllAvailableStocks();
    let stData = await stockApiService.getRTStockSummary(stocks.map(x => x.symbol));

    res.send({ stocks: stData });

  } catch (err) {
    res.status(404).json(err);
  }
});

// when the user wants to buy a stock
router.post('/buy/:symbol', async (req, res, next) => {
  try {


    // get portfolioId from cookie.token
    var portfolioId = req.body.portfolioId;

    let symbol = req.params.symbol;
    let numShares = req.body.numShares;

    // allow negative balances?

    let details = await stockApiService.getRTStockDetails([ 'regularMarketPrice' ]);
    let pps = details.regularMarketPrice;
    let result = await stockDbService.buyStock(portfolioId, symbol, numShares, pps);

    res.sendStatus(201);

  } catch (err) {
    res.status(404).json(err);
  }
});

// when the user wants to buy a stock
router.post('/sell/:symbol', async (req, res, next) => {
  try {

    // get portfolioId from cookie.token
    var portfolioId = req.body.portfolioId;

    let symbol = req.params.symbol;
    let numShares = req.body.numShares;

    let details = await stockApiService.getRTStockDetails([ 'regularMarketPrice' ]);
    let pps = details.regularMarketPrice;
    let result = await stockDbService.sellStock(portfolioId, symbol, numShares, pps);

    res.sendStatus(201);

  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
