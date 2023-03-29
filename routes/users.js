var express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

var router = express.Router();
router.use(cookieParser());

const ProfileService = require('../services/Profile');
const PortfolioService = require('../services/Portfolio');

// constants
const UNAUTHORIZED_RESPONSE = { success: false, message: 'Unauthorized'};

function getTokenFromRequest(request) {
  return request.headers['authorization'];
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* Login a user */
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const profile = await ProfileService.findProfileByLogin(email, password);
  if (!profile) {
    res.send({ success: false });
    return;
  }

  const token = jwt.sign({ email }, process.env.JWT_KEY);
  res.cookie('token', token, { httpOnly: false }); // MUST DISABLY HTTPONLY FOR COOKIE TO WORK
  res.send({ success: true, token });
});

/* Verify a user's credentials  */
router.get('/verify', async (req, res, next) => {
  const token = getTokenFromRequest(req);
  
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(401).json(UNAUTHORIZED_RESPONSE);
      return;
    }

    req.user = decoded;
    res.send({ success: true });
  });
});

/* Register a user */
router.post('/register', async (req, res, next) => {
  const { firstName, lastName, password, email, phoneNumber } = req.body;

  const profile = await ProfileService.addProfile(firstName, lastName, password, email, phoneNumber);
  if (!profile) {
    res.send({ success: false });
    return;
  }

  res.send({ success: true });
});

/* Get a specific user's portfolios */
router.post('/portfolios', async (req, res, next) => {
  const token = getTokenFromRequest(req);
  const { profileId } = req.body;
  console.log(profileId);


  const portfolios = await PortfolioService.getPortfoliosByProfile(profileId);
  if (!portfolios) {
    res.send({ success: false })
    return;
  }

  console.log(portfolios);
  res.send({ success: true, portfolios: portfolios});
});

module.exports = router;
