const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { getProfileByEmail } = require('../services/Profile');
const { getStockBySymbol, addStock, buyStock, getStockInfo, getAllAvailableStocks, sellStock, isValidPurchase } = require('../services/Stock');
const { getRTStockDetails, getRTStockSummary } = require('../services/StockApi');
const { getMainPortfolio } = require('../services/Portfolio');
const { requireAuth } = require('../services/Auth');

const yahooFinance = require('yahoo-finance2').default;
const router = express.Router();
router.use(cookieParser());

/* GET current stock listing. */
router.get('/current', async (req, res, next) => {
  const symbol = req.query.symbol;
  const queryOptions = req.query.queryOptions;
  const moduleOptions = req.query.moduleOptions;

  try {
    const result = await yahooFinance.quote(symbol, queryOptions, moduleOptions);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(404).json(e);
  }
    
});

/* GET historical stock listing. */
router.get('/historical', async (req, res, next) => {
  const symbol = req.query.symbol;
  const queryOptions = req.query.queryOptions;
  const moduleOptions = req.query.moduleOptions;

  const result = await yahooFinance.historical(symbol, queryOptions, moduleOptions);
  res.send(result);
});

// when user clicks on stock it should show stock info page
router.get('/:symbol', async (req, res, next) => {
  try {


    // get portfolioId from cookie.token
    var portfolioId = req.body.portfolioId;

    let symbol = req.params.symbol;

    let pfData = await getStockInfo(portfolioId, symbol);
    let details = await getRTStockDetails(symbol);

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
    let stocks = await getAllAvailableStocks();
    let stData = await getRTStockSummary(stocks.map(x => x.symbol));

    res.send({ stocks: stData });

  } catch (err) {
    res.status(404).json(err);
  }
});

router.post('/db-stock', async (req, res, next) => {
  try {
    const stock = await getStockBySymbol(req.body.symbol);
    res.send(stock);
  } catch (e) {
    res.status(404).json(e);
  }
})

router.post('/buy-stock', requireAuth, async (req, res) => {
  const { symbol, asking, quantity } = req.body;
  let { portfolioId } = req.body
  const email = req.user.email;

  try {
    const profile = await getProfileByEmail(email);
    const profileId = profile.profile_id;

    // if portfolio was not specified, use the main portfolio as default
    if (!portfolioId) {
      const mainPortfolio = await getMainPortfolio(profileId);
      portfolioId = mainPortfolio.portfolio_id;
    }

    // Add the stock if it doesn't yet exist in the table
    let stock = await getStockBySymbol(symbol);
    if (!stock || stock == undefined) {
      stock = await addStock(symbol, asking);
    }

    /** 
     * The client has already made an api request for a stock list.
     * We can pass in the asking price from the particular stocking, and skip this.
     */
    // let details = await getRTStockDetails(symbol, [ 'regularMarketPrice' ]);
    // let pps = details.regularMarketPrice;

    let isValid = await isValidPurchase(portfolioId, quantity, asking);
    if (isValid) {
      await buyStock(portfolioId, stock.symbol, quantity, asking);
    }
    res.send({ success: isValid });

  } catch (err) {
    console.log(err);
    res.send({ success: false });
  }
})

router.post('/sell-stock', requireAuth, async (req, res) => {
  const { symbol, asking, quantity } = req.body;
  let { portfolioId } = req.body;
  const email = req.user.email;

  try {
    const profile = await getProfileByEmail(email);
    const profileId = profile.profile_id;

    // if portfolio was not specified, use the main portfolio as default
    if (!portfolioId) {
      const mainPortfolio = await getMainPortfolio(profileId);
      portfolioId = mainPortfolio.portfolio_id;
    }

    // Add the stock if it doesn't yet exist in the table
    let stock = await getStockBySymbol(symbol);
    if (!stock || stock == undefined) {
      stock = await addStock(symbol, asking);
    }
    
    await sellStock(portfolioId, stock.symbol, quantity, asking);
    res.send({ success: true })
  } catch (err) {
    console.log(err);
    res.send({ success: false });
  }
})


/** @todo Replace the param usage with body fields for post requests. */
// when the user wants to buy a stock
router.post('/sell/:symbol', async (req, res, next) => {
  try {

    // get portfolioId from cookie.token
    var portfolioId = req.body.portfolioId;

    let symbol = req.params.symbol;
    let numShares = req.body.numShares;

    let details = await getRTStockDetails(['regularMarketPrice']);
    let pps = details.regularMarketPrice;
    let result = await sellStock(portfolioId, symbol, numShares, pps);

    res.sendStatus(201);

  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
