const { Pool } = require('pg');
const yahooFinance = require('yahoo-finance2').default;

// CHANGE THIS URL TO PRODUCTION DB
const POSTGRES_URL = 'postgres://postgres:123456@34.122.66.103:5432/cmpt372"';

var pool = new Pool({
    connectionString: POSTGRES_URL
});


async function main() {
    const fields = [ "regularMarketPrice" ];

    // fetch stock data with batch request
    var stocks = await pool.query('select symbol from stock');
    var apiResults = [];
    for (let s of stocks.rows) {
        let result = await yahooFinance.quoteCombine(s.symbol.toUpperCase(), { fields });
        if (result) {
            apiResults.push({ symbol: s.symbol, pps: result.regularMarketPrice });
        }
    }

    // update stock pps
    for (let s of apiResults) {
        await pool.query('call update_stock_values($1, $2)', [ s.symbol, s.pps ]);
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

