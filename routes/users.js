var express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

var router = express.Router();
router.use(cookieParser());

const { createProfile, getProfile } = require('../services/Profile');
const { createMainPortfolio, getPortfolio } = require('../services/Portfolio');
const { getStocks } = require('../services/Stock');
const { getRTStockSummary } = require('../services/StockApi');
const { getHistory } = require('../services/History');

const PORTFOLIO_STARTING_BALANCE = 10000;

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* Login a user */
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await getProfile(email, password);
  if (user === null) {
    res.send({ success: false });
    return;
  }

  const token = jwt.sign({ email }, process.env.JWT_KEY);
  res.cookie('token', token, { httpOnly: false }); // MUST DISABLY HTTPONLY FOR COOKIE TO WORK
  res.send({ success: true, token });

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

  let newProfile;
  let newPortfolio;
  try {
    newProfile = await profile.createProfile(firstName, lastName, email, password, phoneNumber);
    newPortfolio = await createMainPortfolio(newProfile.profile_id, PORTFOLIO_STARTING_BALANCE);
  } catch (err) {
    res.send({ success: false });
    return;
  }

  res.send({ success: true });
});

// dashboard/competition portfolios and view other peoples portfolios
router.get('/portfolio/:portfolioId', async (req, res, next) => {
  try {
    let portfolioId = req.params.portfolioId;
    let pf = await getPortfolio(portfolioId);
    let st = await getStocks(pf.portfolio_id);
    let stData = await getRTStockSummary(st.map(s => s.fk_stock));
    let histData = await getHistory(pf.portfolio_id);
  
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
