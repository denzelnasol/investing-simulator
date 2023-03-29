const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { getProfileByEmail } = require('../services/Profile');
const { getStockBySymbol, addStock, buyStock } = require('../services/Stock');
const { getMainPortfolio } = require('../services/Portfolio');
const yahooFinance = require('yahoo-finance2').default;
const router = express.Router();
router.use(cookieParser());

/* GET current stock listing. */
router.get('/current', async (req, res, next) => {
  const symbol = req.query.symbol;
  const queryOptions = req.query.queryOptions;
  const moduleOptions = req.query.moduleOptions;

  const result = await yahooFinance.quote(symbol, queryOptions, moduleOptions);
  res.send(result);
});

/* GET historical stock listing. */
router.get('/historical', async (req, res, next) => {
  const symbol = req.query.symbol;
  const queryOptions = req.query.queryOptions;
  const moduleOptions = req.query.moduleOptions;

  const result = await yahooFinance.historical(symbol, queryOptions, moduleOptions);
  res.send(result);
});

router.post('/buy-stock', async (req, res) => {
  const { symbol, asking, quantity, authToken } = req.body;

  const token = jwt.verify(authToken, process.env.JWT_KEY);
  const email = token.email;

  const profile = await getProfileByEmail(email);
  const profileId = profile.profile_id;

  const mainPortfolio = await getMainPortfolio(profileId);
  const portfolioId = mainPortfolio.portfolio_id;

  let stock = await getStockBySymbol(symbol);
  if (!stock || stock == undefined) {
    stock = await addStock(symbol, asking);
  }

  await buyStock(portfolioId, stock.symbol, quantity, asking);
  res.send({ success: true })
})

module.exports = router;
