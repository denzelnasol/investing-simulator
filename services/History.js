const prisma = require("../src/db");

// returns the balance history of portfolio
exports.getHistory = async function(portfolioId) {
    const history = await prisma.history.findMany({
        where: {
          fk_portfolio: portfolioId
        }
    });
    return history.map(h => {
        return {
          balance: h.balance,
          time: h.snapshot_time
        }
    });
}

