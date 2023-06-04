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
    return await yahooFinance.quote(symbol.toUpperCase(), { fields: fields });
}

async function getYFStockSymbols(symbols) {
    // const symbolString = symbols.join(',');
    const symbolString = "AMZN,GOOGL";

    const command = `python3 stock_data.py ${symbolString}`;

    const res = exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (stderr) {
            console.error(`Python script returned an error: ${stderr}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const parsedData = JSON.parse(stdout);

        const stocks = [];

        // Iterate over the keys of the data object
        for (const symbol of Object.keys(parsedData)) {
            const stock = {};
            stock['symbol'] = parsedData[symbol].symbol;
            stock['averageAnalystRating'] = parsedData[symbol].recommendationMean;
            stock['regularMarketPrice'] = parsedData[symbol].currentPrice;
            stock['regularMarketPreviousClose'] = parsedData[symbol].regularMarketPreviousClose;
            stock['regularMarketOpen'] = parsedData[symbol].regularMarketOpen;
            stock['regularMarketChange'] = parsedData[symbol].currentPrice - parsedData[symbol].regularMarketOpen;

            // Add the stock object to the stocks object using the symbol as the key
            stocks.push(stock);
        }

        return stocks;
    });

    return res;
}

module.exports = {
    getRTStockSummary,
    getRTStockDetails,
    getYFStockSymbols,
};
