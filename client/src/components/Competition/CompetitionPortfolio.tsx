import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import { getCurrentStockInfo } from 'api/Stock/Stock';

// components
import StocksOwnedTable from '../StocksOwned/StocksOwnedTable';
import { getStocks } from "api/Profile/User";

interface Props {
    competitionId: string
}

function CompetitionPortfolio(props: Props) {
    /* useStates */
    const [stocks, setStocks] = useState<any>(null);

    useEffect(() => {
        async function fetchOwnedStocks() {
            const token: string = Cookies.get('token');

            console.log(props.competitionId);
            if (props.competitionId) {
                const stocks = await getStocks(token, props.competitionId);
                console.log(stocks);
                
                setStocks(stocks);
            }
        }

        fetchOwnedStocks();
    }, [props.competitionId]); // run this useEffect when competitionId is provided
    
    return (
        <div>
            <StocksOwnedTable isLoading={false} rows={10} stocks={stocks} onTrade={() => {}} />       
        </div>
    );
}

export default CompetitionPortfolio;