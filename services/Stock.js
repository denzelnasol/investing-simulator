const prisma = require("../src/db");

// get the stock info owned by portfolio
async function getStockInfo(portfolioId, stock) {
  return await prisma.owns.findMany({
    where: {
      fk_portfolio: portfolioId,
      fk_stock: stock
    }
  });
}

// returns all the stocks owned by portfolio
async function getStocks(portfolioId) {
  return await prisma.owns.findMany({
    where: {
      fk_portfolio: portfolioId
    }
  });
}

async function buyStock(portfolioId, stock, numShares, pricePerShare) {
    // note: db has a transaction trigger so we just need to modify transaction
    // when purchasing: amount should be negative (refer to docs)
    // balance will be updated by triggers
    const totalAmountCredited = -numShares * pricePerShare;
    const transactionTime = new Date();
    return await prisma.transaction.create({
        data: {
            num_shares: numShares,
            total_amount: totalAmountCredited,
            transaction_time: transactionTime,
            fk_portfolio: portfolioId,
            fk_stock: stock,
        }
    });
}

async function sellStock(portfolioId, stock, numShares, pricePerShare) {
    // note: db has a transaction trigger so we just need to modify transaction
    // when selling: amount should be positive (refer to docs)
    // balance will be updated by triggers
    const totalAmountCredited = numShares * pricePerShare;
    const transactionTime = new Date();
    return await prisma.transaction.create({
        data: {
            num_shares: -numShares,
            total_amount: totalAmountCredited,
            transaction_time: transactionTime,
            fk_portfolio: portfolioId,
            fk_stock: stock,
        }
    });
}

module.exports = {
  getStockInfo,
  getStocks,
  buyStock,
  sellStock
}
