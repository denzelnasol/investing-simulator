var express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

var router = express.Router();
router.use(cookieParser());

const profile = require('../services/Profile');
const portfolio = require('../services/Portfolio');
const stockDbService = require('../services/Stock');
const stockApiService = require('../services/StockApi');
const historyDbService = require('../services/History');

const PORTFOLIO_STARTING_BALANCE = 10000;

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* Login a user */
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await profile.getProfile(email, password);
  if (user === null) {
    res.send({ success: false });
    return;
  }

  const token = jwt.sign({ email }, process.env.JWT_KEY);
  res.cookie('token', token, { httpOnly: true });


  res.send({ success: true, token,
    profileId: user.profile_id,
  });

});

/* Verify a user's credentials  */
router.get('/verify', async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.user = decoded;
    res.send({ success: true });
  });
});

/* Register a user */
router.post('/register', async (req, res, next) => {
  const { firstName, lastName, password, email, phoneNumber } = req.body;

  var p;
  var pf;
  try {
    p = await profile.createProfile(firstName, lastName, email, password, phoneNumber);
    pf = await portfolio.createMainPortfolio(p.profile_id, PORTFOLIO_STARTING_BALANCE);
  } catch (err) {
    res.send({ success: false });
    return;
  }

  if (p === null) {
    res.send({ success: false });
    return;
  }

  res.send({ success: true });
});

// dashboard/competition portfolios and view other peoples portfolios
router.get('/portfolio/:portfolioId', async (req, res, next) => {
  try {
    let portfolioId = req.params.portfolioId;
    let pf = await portfolio.getPortfolio(portfolioId);
    let st = await stockDbService.getStocks(pf.portfolio_id);
    let stData = await stockApiService.getRTStockSummary(st.map(s => s.fk_stock));
    let histData = await historyDbService.getHistory(pf.portfolio_id);
  
    res.json({
      balance: pf.base_balance,
      stocks: stData,
      history: histData,
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
