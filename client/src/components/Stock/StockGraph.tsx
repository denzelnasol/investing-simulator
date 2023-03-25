import React, { useState } from 'react';
import { useEffect } from 'react';
import { Chart } from 'primereact/chart';

import { getHistoricalStockInfo } from 'api/Stock/Stock';
import { StockInterval } from 'enums/Stock'
import Error from 'components/Error/Error';

function fetchPastData(stockSymbol: string, startingDate: Date, interval: StockInterval) {
    const queryOptions = {
        period1: startingDate,
        interval: interval
    };
    return getHistoricalStockInfo(stockSymbol, queryOptions);
}

function parseDateString(dateString: string) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    return `${year}/${month}`;
}

interface DataPoint {
    x: string,
    y: number
};

function StockGraph(props: {stockSymbol: string}) {
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
    const [error, setError] = useState(false);

    // call stock api and update state
    useEffect(() => {
        (async () => {
            let pastData
            try {
                // need to wrap in Date constructor since setFullYear returns a timestamp (not a date)
                const today = new Date();
                const yearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

                pastData = await fetchPastData(props.stockSymbol ?? "", yearAgo, StockInterval.Month);
            } catch (err) {
                console.log(err);
                setError(true);
                return;
            }
            
            const parsedPastData  = pastData.intervals.map(i => ({x: parseDateString(i.date), y: i.close}));
            setDataPoints(parsedPastData);
        })();

    }, []);
    
    const data = {
        datasets: [
            {
                data: dataPoints,
                borderColor: 'red'
            }
        ]
    };
    const options = {
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        // return error page if stock symbol is not found
        error ? <Error /> : 
        <div style={{border: 'solid'}}>
            <Chart
                type="line"
                data={data}
                options={options}
            />
        </div>
    );
}

export default StockGraph;