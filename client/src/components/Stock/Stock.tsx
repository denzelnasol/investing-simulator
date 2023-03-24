import { getCurrentStockInfo } from 'api/Stock/Stock';
import StockDetails from './StockDetails';
import Error from 'components/Error/Error';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StockGraph from './StockGraph';

function fetchCurrentData(symbol: string) {
    return getCurrentStockInfo(symbol);
};

function Stock(props) {
    // get stock symbol from query string in URL
    const [searchParams] = useSearchParams();
    const stockSymbol = searchParams.get("symbol");

    // state
    const [name, setName] = useState("");
    const [ask, setAsk] = useState(0);
    const [marketCap, setMarketCap] = useState(0);
    const [exchange, setExchange] = useState("");
    const [yearlyHigh, setYearlyHigh] = useState(0);
    const [yearlyLow, setYearlyLow] = useState(0);
    const [error, setError] = useState(false);
    
    // call stock api and update state
    useEffect(() => {
        (async () => {
            let curData;
            try {
                curData = await fetchCurrentData(stockSymbol ?? "");
            } catch (err) {
                setError(true);
                return;
            }

            setName(curData.longName);
            setAsk(curData.ask);
            setMarketCap(curData.marketCap);
            setExchange(curData.exchange);
            setYearlyHigh(curData.fiftyTwoWeekHigh);
            setYearlyLow(curData.fiftyTwoWeekLow);
            setError(false);
        })();

    }, []);
    
    return (
        // return error page if stock symbol is not found
        error ? <Error /> : 
        <div>
            <h1>{name}</h1>
            <StockGraph stockSymbol={stockSymbol} />
            <StockDetails 
                ask={ask} 
                marketCap={marketCap} 
                exchange={exchange} 
                yearlyHigh={yearlyHigh} 
                yearlyLow={yearlyLow}
            />           
        </div>
    );
}

export const exportedForTesting = {
    fetchCurrentData
}
export default Stock;