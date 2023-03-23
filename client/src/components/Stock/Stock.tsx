import { getCurrentStockInfo, getHistoricalStockInfo } from 'api/Stock/Stock';
import StockDetails from './StockDetails';
import Error from 'components/Error/Error';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StockGraph from './StockGraph';

function fetchCurrentData(symbol: string | null) {
    if (symbol == null) {
        return null;
    }

    return getCurrentStockInfo(symbol);
};

function fetchPastData(symbol: string | null) {
    if (symbol == null) {
        return null;
    }

    const today = new Date();

    // need to wrap in Date constructor since setFullYear returns a timestamp (not a date)
    const yearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

    const queryOptions = {
        period1: yearAgo,
        interval: "1mo"
    };
    return getHistoricalStockInfo(symbol, queryOptions);
}

function getPastDataPrices(data: any[]) {
    const prices: number[] = []

    data.forEach((val) => {
        prices.push(val.open);
    });
    console.log(prices);

    return prices;
}

function getPastDataDates(data: any[]) {
    const dates: Date[] = []

    data.forEach((val) => {
        const date = new Date(val.date);
        dates.push(date);
    });
    console.log(dates);

    return dates;
}

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
    const [pastPrices, setPastPrices] = useState<number[]>([]);
    const [pastDates, setPastDates] = useState<Date[]>([]);
    const [error, setError] = useState(false);
    
    // call stock api and update state
    useEffect(() => {
        (async () => {
            const curData = await fetchCurrentData(stockSymbol);
            const pastData = await fetchPastData(stockSymbol);
            console.log(pastData);
            if (!curData || !pastData) {
                setError(true);
                return;
            }

            setName(curData.longName);
            setAsk(curData.ask);
            setMarketCap(curData.marketCap);
            setExchange(curData.exchange);
            setYearlyHigh(curData.fiftyTwoWeekHigh);
            setYearlyLow(curData.fiftyTwoWeekLow);
            
            const prices = getPastDataPrices(pastData);
            const dates = getPastDataDates(pastData);
            setPastPrices(prices);
            setPastDates(dates);

            setError(false);
        })();

    }, []);
    
    return (
        // return error page if stock symbol is not found
        error ? <Error /> : 
        <div>
            <h1>{name}</h1>
            <StockGraph prices={pastPrices} dates={pastDates}/>
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
    fetchCurrentData,
    fetchPastData
}
export default Stock;