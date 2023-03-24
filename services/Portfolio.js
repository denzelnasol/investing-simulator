const prisma = require("../src/db");

// returns all the data needed to be displayed on the portfolio dashboard
async function getPortfolio(portfolioId) {
  return await prisma.portfolio.findUnique({
    where: {
      portfolio_id: portfolioId
    }
  });
}

async function createMainPortfolio(profileId, balance) {
  return await prisma.portfolio.create({
    data: {
        portfolio_type: 'main',
        base_balance: balance,
        fk_profile: profileId
    }
  });
}

async function createCompetitionPortfolio(profileId, competitionId, balance) {
  return await prisma.portfolio.create({
    data: {
        portfolio_type: 'competition',
        base_balance: balance,
        fk_profile: profileId,
        fk_competition: competitionId,
    }
  }); 
}

module.exports = {
  getPortfolio,
  createMainPortfolio,
  createCompetitionPortfolio
};

