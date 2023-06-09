import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// api
import { getCurrentStockInfo } from 'api/Stock/Stock';

// components
import StockDetails from './StockDetails';
import Error from 'components/Error/Error';
import StockGraph from './StockGraph';
import { Card } from 'primereact/card';

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
                console.log(err);
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
        <Card title={name} style={{ margin: 20 }}>
            <StockGraph stockSymbol={stockSymbol ?? ""} />
            <Card title="Details" style={{ marginTop: 20 }}>
                <StockDetails 
                    ask={ask} 
                    marketCap={marketCap} 
                    exchange={exchange} 
                    yearlyHigh={yearlyHigh} 
                    yearlyLow={yearlyLow}
                />      
            </Card>     
        </Card>
    );
}

export const exportedForTesting = {
    fetchCurrentData
}
export default Stock;