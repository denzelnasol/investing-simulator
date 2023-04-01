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

// get competition info
async function getCompetitionInfo(competitionId) {
    return await prisma.competition.findFirst({
        where: {
            competition_id: competitionId
        },
    });
}

async function createCompetition(balance, startDate, endDate, entryPoints = -1, numPlayers = -1, name) {
   
    return await prisma.competition.create({
        data: {
            max_num_players: numPlayers,
            entry_points: entryPoints,
            start_balance: balance,
            start_time: startDate,
            end_time: endDate,
            name: name,
        }
    });
}

module.exports = {
    getCompetitionInfo,
    getCompetitions,
    getPersonalCompetitions,
    getCompetitionParticipants,
    createCompetition,
};
