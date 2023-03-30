var express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

var router = express.Router();
router.use(cookieParser());

const ProfileService = require('../services/Profile');
const PortfolioService = require('../services/Portfolio');

const { getProfile, getProfileByEmail } = require('../services/Profile');
const { createMainPortfolio, getPortfolio, getMainPortfolio } = require('../services/Portfolio');
const { getStocks } = require('../services/Stock');
const { getRTStockSummary } = require('../services/StockApi');
const { getHistory } = require('../services/History');
const { requireAuth } = require('../services/Auth');

const PORTFOLIO_STARTING_BALANCE = 10000;

/* GET users listing. */
router.get('/', (req, res, next) => {
	res.send('respond with a resource');
});

router.get('/profile', requireAuth, async (req, res) => {
	const email = req.user.userEmail;
	const profile = await getProfileByEmail(email);
	res.send(profile);
})

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
router.get('/verify', requireAuth, async (req, res, next) => {
	res.send({ success: true });
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

/* Get a specific user's portfolios and associated competition names */
router.get('/all-portfolios', requireAuth, async (req, res, next) => {
	const { userEmail } = req.user;

	const profile = await ProfileService.getProfileByEmail(userEmail);
	const portfolios = await PortfolioService.getPortfoliosByProfile(profile.profile_id);
	if (!portfolios) {
		res.send({ success: false })
		return;
	}

	res.send({ success: true, portfolios: portfolios});
})

router.get('/portfolio', requireAuth, async (req, res) => {
	const email = req.user.userEmail;
	const competitionName = req.params['competitionName'];
	if (competitionName) {
		// retrieve the portfolio associated with the competition
		return;
	}

	// get the main portfolio
	const profile = await getProfileByEmail(email);
	const portfolio = await getMainPortfolio(profile.profile_id);
	res.send(portfolio);
})

router.get('/owned-stocks', requireAuth, async (req, res) => {
	const email = req.user.userEmail;
	const competitionName = req.params['competitionName'];
	if (competitionName) {
		// retrieve the stocks for portfolio associated with the competition
		return;
	}

	// retrieve the stocks for main portfolio
	const profile = await getProfileByEmail(email);
	const portfolio = await getMainPortfolio(profile.profile_id);
	const stocks = await getStocks(portfolio.portfolio_id);
	res.send(stocks);
})

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
