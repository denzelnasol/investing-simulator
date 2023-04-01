import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { getAllPortfolios } from 'api/Profile/User';

interface fetchedPortfolio {
    fk_competition: string,
    [key: string]: any
}

function CompetitionList(props) {
    const [competitions, setCompetitions] = useState<any>([]);

    useEffect(() => {
        async function fetchData() {
            // fetch portfolios (request returns competition ids as well)
            const token: string = Cookies.get('token');
            const portfolios = await getAllPortfolios(token);
            console.log(portfolios);

            // update list of competitions on UI
            const competitionLinks = portfolios.map((p: fetchedPortfolio) => {
                console.log(p);
                return (
                    <li key={p.fk_competition}>
                        <Link to="/competition?id=123" style={{ textDecoration: 'none' }}>
                            <Button label={p.base_balance} />
                        </Link>
                    </li>
                )
            });
            setCompetitions(competitionLinks);
        }

        fetchData();
    }, []);

    return (
        <div>
            <h1>Your Ongoing Competitions</h1>
            <ul style={{listStyleType: 'none'}}>
                {competitions}
            </ul>
        </div>
    );
};

export default CompetitionList;

// -------- NOTES ---------

// fetch portfolios
// use each portfolio's id to find competition it belongs in
// display list of buttons with compeititon names
// clicking on button redirects to competition page
