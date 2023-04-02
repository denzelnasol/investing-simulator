import React, { useEffect } from "react";
import Cookies from 'js-cookie';

// components
import StocksOwnedTable from '../StocksOwned/StocksOwnedTable';
import { getStocks } from "api/Profile/User";

interface Props {
    competitionId: string
}

function CompetitionPortfolio(props: Props) {

    useEffect(() => {
        async function fetchOwnedStocks() {
            const token: string = Cookies.get('token');

            console.log(props.competitionId);

            const stocks = await getStocks(token, props.competitionId);
            
            console.log(stocks);
        }

        fetchOwnedStocks();
    }, [props.competitionId]); // run this useEffect when competitionId is provided
    
    return (
        <div>
            <StocksOwnedTable isLoading={false} rows={10} stocks={null} onTrade={() => {}} />       
        </div>
    );
}

export default CompetitionPortfolio;