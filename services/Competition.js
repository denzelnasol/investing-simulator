const prisma = require("../src/db");


// returns a list of all competitions in db
async function getCompetitions() {
    return await prisma.competition.findMany();
}

async function getPersonalCompetitions(profileId) {
    return await prisma.portfolio.findMany({
        where: {
            fk_profile: profileId,
            portfolio_type: 'competition'
        },
        include: {
            competition: true,
        }
    });
}

// returns the list of participants in a competition (not sorted)
async function getCompetitionParticipants(competitionId) {
    return await prisma.portfolio.findMany({
        where: {
            fk_competition: competitionId
        },
    });
}

async function createCompetition(balance, startDate, endDate, entryPoints = -1, numPlayers = -1) {
    // let startDate = new Date();
    // let endDate = new Date();
    // endDate.setMonth(endDate.getMonth() + COMPETITION_DURATION_MONTHS);
    return await prisma.competition.create({
        data: {
            max_num_players: numPlayers,
            entry_points: entryPoints,
            start_balance: balance,
            start_time: startDate,
            end_time: endDate,
        }
    });
}

module.exports = {
    getCompetitions,
    getPersonalCompetitions,
    getCompetitionParticipants,
    createCompetition,
};
