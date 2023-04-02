import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// components
import StocksOwnedTable from '../StocksOwned/StocksOwnedTable';
import { getStocks } from "api/Profile/User";
import { Button } from 'primereact/button';

interface Props {
    competitionId: string
}

function CompetitionPortfolio(props: Props) {
    const navigate = useNavigate();

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
            <StocksOwnedTable rows={10} competitionId={props.competitionId} stocks={stocks} onTrade={() => {}} />       
            <Button
                label="Buy More"
                icon='pi pi-plus'
                className='p-button-primary p-ml-auto mr-2'
                onClick={() => navigate(`/stock-table?competition-id=${props.competitionId}`)}
            />
        </div>
    );
}

export default CompetitionPortfolio;