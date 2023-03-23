import React from 'react';

import { Chart } from 'primereact/chart';

interface GraphVariables {
    prices: number[],
    dates: Date[]
};

interface DataPoint {
    x: string,
    y: number
};

function getDateAsString(date: Date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    return `${year}/${month}`;
}

function transformData(variables: GraphVariables) {
    const {prices, dates} = variables;

    const dataPoints: DataPoint[] = [];
    prices.forEach((price, index) => {
        const dateString = getDateAsString(dates[index]);

        dataPoints.push({x: dateString, y: price});
    });

    return dataPoints;
}

function StockGraph(props: GraphVariables) {
    
    const data = {
        datasets: [
            {
                data: transformData(props),
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