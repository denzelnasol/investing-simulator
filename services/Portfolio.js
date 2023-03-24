const prisma = require("../src/db");

// returns all the data needed to be displayed on the portfolio dashboard
exports.getPortfolio = async function(portfolioId) {
  return await prisma.portfolio.findUnique({
    where: {
      portfolio_id: portfolioId
    }
  });
}

exports.createMainPortfolio = async function(profileId, balance) {
  return await prisma.portfolio.create({
    data: {
        portfolio_type: 'main',
        base_balance: balance,
        fk_profile: profileId
    }
  });
}

exports.createCompetitionPortfolio = async function(profileId, competitionId, balance) {
  return await prisma.portfolio.create({
    data: {
        portfolio_type: 'competition',
        base_balance: balance,
        fk_profile: profileId,
        fk_competition: competitionId,
    }
  }); 
}

