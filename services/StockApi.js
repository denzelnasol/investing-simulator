const yahooFinance = require('yahoo-finance2').default;

// get a summary of all symbols
async function getRTStockSummary(symbols) {
    const fields = [ "regularMarketChange" ];
    var apiResults = [];
    for (let s of symbols) {
        let result = await yahooFinance.quoteCombine(s.toUpperCase(), { fields: fields });
        if (result) {
            apiResults.push({ 
                symbol: s, 
                percentChange: result.regularMarketChange, 
                delisted: false
            });
        } else {
            // yahoo finance will delist stocks if pps drops below a certain amount
            apiResults.push({ 
                symbol: s, 
                percentChange: 0, 
                delisted: true 
            });
        }
    }
    return apiResults;
}

// get full info on the symbol
async function getRTStockDetails(symbol, fields = []) {
    return await yahooFinance.quote(symbol.toUpperCase(), { fields: fields });
}

module.exports = {
    getRTStockSummary,
    getRTStockDetails,
};
