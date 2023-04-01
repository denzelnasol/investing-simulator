const prisma = require("../src/db");
const { getRTStockDetails } = require("./StockApi");

async function getStockBySymbol(symbol) {
  return await prisma.stock.findFirst({
    where: {
      symbol: symbol
    }
  });
}

async function addStock(symbol, asking) {
  return await prisma.stock.create({
    data: {
        symbol,
        price_per_share: asking,
    }
});
}

async function getAllAvailableStocks() {
  return await prisma.stock.findMany({
    distinct: ['symbol']
  });
}

// get the stock info owned by portfolio
async function getStockInfo(portfolioId, stock) {
  return await prisma.owns.findFirst({
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

    if (pricePerShare === 0) {
      getRTStockDetails(stock);
    }

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
  getStockBySymbol,
  addStock,
  getAllAvailableStocks,
  getStockInfo,
  getStocks,
  buyStock,
  sellStock
}
