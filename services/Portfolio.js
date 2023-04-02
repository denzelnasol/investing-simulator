const prisma = require("../src/db");

// returns all the data needed to be displayed on the portfolio dashboard
async function getPortfolio(portfolioId) {
  return await prisma.portfolio.findUnique({
    where: {
      portfolio_id: portfolioId
    }
  });
} 

async function getCompetitionPortfolios(profileId) {
  const portfolios = await prisma.portfolio.findMany({
    where: {
      fk_profile: profileId,
      portfolio_type: 'competition'
    },
    include: {
      competition: {
        select: {
          name: true
        }
      }
    }
  });

  return portfolios;
}

async function getMainPortfolio(profileId) {
  return await prisma.portfolio.findFirst({
    where: {
      AND: {
        fk_profile: profileId,
        portfolio_type: 'main'
      }
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
  getMainPortfolio,
  getCompetitionPortfolios,
  createMainPortfolio,
  createCompetitionPortfolio
};

