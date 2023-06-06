const yahooFinance = require('yahoo-finance2').default;
const { exec } = require('child_process');

// get a summary of all symbols
async function getRTStockSummary(symbols) {
    const fields = ["regularMarketChange"];
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
    // return await yahooFinance.quote(symbol.toUpperCase(), { fields: fields });
    return await getYFStockSymbols(symbol);
}

async function getYFStockSymbols(symbols) {

    if (Array.isArray(symbols)) {
        symbols = symbols.join(',');
    }

    const command = `python3 stock_data.py ${symbols}`;
    const data = new Promise((resolve, reject) => {
        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                reject(error);
            } else {
                const parsedData = JSON.parse(stdout);
                let stocks = [];

                // Iterate over the keys of the data object
                for (const symbol of Object.keys(parsedData)) {
                    const stock = {};
                    stock['symbol'] = parsedData[symbol].symbol;
                    stock['averageAnalystRating'] = parsedData[symbol].recommendationMean;
                    stock['regularMarketPrice'] = parsedData[symbol].currentPrice;
                    stock['regularMarketPreviousClose'] = parsedData[symbol].regularMarketPreviousClose;
                    stock['regularMarketOpen'] = parsedData[symbol].regularMarketOpen;
                    stock['regularMarketChange'] = parsedData[symbol].currentPrice - parsedData[symbol].regularMarketOpen;
                    stock['longName'] = parsedData[symbol].longName;
                    stock['ask'] = stock['regularMarketPrice'];
                    stock['marketCap'] = parsedData[symbol].marketCap;
                    stock['exchange'] = parsedData[symbol].exchange
                    stock['fiftyTwoWeekHigh'] = parsedData[symbol].fiftyTwoWeekHigh;
                    stock['fiftyTwoWeekLow'] = parsedData[symbol].fiftyTwoWeekLow;

                    // Add the stock object to the stocks object using the symbol as the key
                    stocks.push(stock);
                }

                if (stocks.length === 1) {
                    stocks = stocks[0];
                }

                resolve(stocks);
            }
        });
    });

    try {
        const result = await data;
        return result
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    getRTStockSummary,
    getRTStockDetails,
    getYFStockSymbols,
};
