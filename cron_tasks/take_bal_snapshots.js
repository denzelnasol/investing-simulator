const { Pool } = require('pg');
const yahooFinance = require('yahoo-finance2').default;
const { exec } = require('child_process');


// CHANGE THIS URL TO PRODUCTION DB
const POSTGRES_URL = 'postgres://postgres:123456@127.0.0.1:5432/investing-sim-main';

var pool = new Pool({
    connectionString: POSTGRES_URL
});


async function main() {
    const fields = [ "regularMarketPrice" ];

    // fetch stock data with batch request
    var stocks = await pool.query('select symbol from stock');
    // var apiResults = [];
    // for (let s of stocks.rows) {
    //     let result = await yahooFinance.quoteCombine(s.symbol.toUpperCase(), { fields });
    //     if (result) {
    //         apiResults.push({ symbol: s.symbol, pps: result.regularMarketPrice });
    //     }
    // }

    let symbols = [];
    for (let s of stocks.rows) {
        symbols.push(s.symbol)
    }

    
    symbols = symbols.join(',');

    // update stock pps
    // for (let s of apiResults) {
    //     await pool.query('call update_stock_values($1, $2)', [ s.symbol, s.pps ]);
    // }

    const command = `python3 stock_data.py ${symbols}`;
    const stocks = new Promise((resolve, reject) => {
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
                    stock['regularMarketPrice'] = parsedData[symbol].currentPrice;

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

    const apiStocks = await data;

    for (let s of apiStocks) {
        await pool.query('call update_stock_values($1, $2)', [ s.symbol, s.regularMarketPrice ]);
    }

    // update the balances
    await pool.query('call update_balances()');

    // take the snapshot
    await pool.query('call snapshot_balances()');
}

// execute
main()
.then()
.catch(err => console.log(err))
.finally(() => process.exit(0));

