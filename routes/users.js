var express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

var router = express.Router();
router.use(cookieParser());

const { createProfile, getProfile } = require('../services/Profile');
const { createMainPortfolio } = require('../services/Portfolio');

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

  const p = await createProfile(firstName, lastName, email, password, phoneNumber);
  if (p === null) {
    res.send({ success: false });
    return;
  }

  await createMainPortfolio(p.profile_id, 10000);

  res.send({ success: true });
});

module.exports = router;
