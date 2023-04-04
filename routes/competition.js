var express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

var router = express.Router();
router.use(cookieParser());

const portfolioDbService = require('../services/Portfolio');
const competitionDbService = require('../services/Competition');
const { verifyToken, getTokenFromRequest } = require('../services/Auth');
const { getProfileByEmail } = require('../services/Profile');

// when the user searches for competitions show the list of competitions
// router.get('/all', async (req, res, next) => {
//     try {

//         let competitions = await competitionDbService.getCompetitions();

//         res.json({ 
//             competitions: competitions.map(x => {
//                 return {
//                     uuid: x.competition_id,
//                     competitionStart: x.start_time,
//                     competitionEnd: x.end_time,
//                 };
//             }) 
//         });

//     } catch (err) {
//         res.status(404).json(err);
//     }
// });

// when the user clicks on Competition in navbar show the list of personal competitions
router.get('/', async (req, res, next) => {
    try {

        // get profile id from cookie
        var profileId = req.body.profileId;

        let competitions = await competitionDbService.getPersonalCompetitions(profileId);
        res.json({ competitions: competitions });

    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});


// when the user clicks on any competition show the info
router.get('/:competitionId', async (req, res, next) => {
    try {
        var competitionId = req.params.competitionId;

        var members = await competitionDbService.getCompetitionParticipants(competitionId);
        var comp = await competitionDbService.getCompetitionInfo(competitionId);

        res.json({
            requirements: {
                maxParticipants: comp.max_num_players,
                entryPoints: comp.entry_points
            },
            state: comp.state,
            competitionName: comp.name,
            competitionStart: comp.start_time,
            competitionEnd: comp.end_time,
            startingBalance: comp.start_balance,
            rankings: members.map(x => {
                return {
                    id: x.portfolio_id,
                    balance: x.base_balance,
                    profits: x.investment_profit,
                    firstName: x.profile.first_name,
                    lastName: x.profile.last_name,
                    email: x.profile.email,
                }
            }).sort((a, b) => {
                let r1 = a.profits + a.balance;
                let r2 = b.profits + b.balance;
                return r1 - r2;
            })
        });

    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});

// when the user clicks on Competition in navbar show the list of personal competitions
router.get('/join/:competitionId', async (req, res, next) => {
    try {
        const cookie = getTokenFromRequest(req)
        const token = await verifyToken(cookie);

        if (!token) {
            res.status(403).json('Player is not yet logged in.');
            return;
        }
        const email = token.email;

        const profile = await getProfileByEmail(email);
        const profileId = profile.profile_id;

        const competitionId = req.params.competitionId;

        const members = await competitionDbService.getCompetitionParticipants(competitionId);

        for (const member of members) {
            if (member.profile.email === email) {
                res.status(200).json({
                    isPlayerAlreadyInCompetition: true,
                    isCompetitionFilled: false,
                    text: 'This player is already in the competition.'
                });
                return;
            }
        }

        const comp = await competitionDbService.getCompetitionInfo(competitionId);
        if (comp.max_num_players === members.length) {
            res.status(200).json({
                isPlayerAlreadyInCompetition: false,
                isCompetitionFilled: true,
                text: 'competition is maxed out!'
            });
            return;
        }

        const result = await portfolioDbService.createCompetitionPortfolio(profileId, competitionId, comp.start_balance);
        if (result) {
            return res.sendStatus(201);
        }

    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});


// create competition
router.post('/create', async (req, res, next) => {
    try {
        // get profile id from cookie 
        const cookie = getTokenFromRequest(req)
        const token = await verifyToken(cookie);

        if (!token) {
            res.status(403).json('Player is not yet logged in.');
            return;
        }
        const email = token.email;

        const profile = await getProfileByEmail(email);
        const profileId = profile.profile_id;
        const { start_balance, start_time, end_time, entry_points, max_num_players, name } = req.body;

        const comp = await competitionDbService.createCompetition(start_balance, start_time, end_time, entry_points, max_num_players, name);

        const result = await portfolioDbService.createCompetitionPortfolio(profileId, comp.competition_id, comp.start_balance);
        if (result) {
            return res.sendStatus(201);
        }
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
});

router.post('/update', async (req, res) => {

    const { playerSize, startDate, endDate, competitionId } = req.body;
    try {
        const result = await competitionDbService.updateCompetition(competitionId, startDate, endDate, playerSize)
        if (result) {
            return res.sendStatus(201);
        }
    } catch (e) {
        console.log(e);
        res.status(404).json(e);
    }
})

router.post('/start', async (req, res) => {
    const { competitionId } = req.body;
    try {
        const result = await competitionDbService.startCompetition(competitionId)
        if (result) {
            return res.sendStatus(201);
        }
    } catch (e) {
        console.log(e)
        res.status(404).json(e);
    }
})

router.post('/end', async (req, res) => {
    const { competitionId } = req.body;
    try {
        const result = await competitionDbService.endCompetition(competitionId)
        if (result) {
            return res.sendStatus(201);
        }
    } catch (e) {
        console.log(e)
        res.status(404).json(e);
    }
})



module.exports = router;
