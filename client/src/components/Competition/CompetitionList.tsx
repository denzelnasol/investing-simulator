import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { getCompetitionPortfolios } from 'api/Profile/User';

interface Competition {
    name: string,
    [key: string]: any
}

interface FetchedPortfolio {
    fk_competition: string,
    competition: Competition,
    [key: string]: any
}

function CompetitionList(props) {
    const [competitions, setCompetitions] = useState<any>([]);

    useEffect(() => {
        async function fetchData() {
            // fetch portfolios (request returns competition ids as well)
            const token: string = Cookies.get('token');
            const portfolios = await getCompetitionPortfolios(token);
            console.log(portfolios);

            // update list of competitions on UI
            const competitionLinks = portfolios.map((p: FetchedPortfolio) => {
                console.log(p);
                
                const competitionName = p.competition.name;
                const competitionId = p.fk_competition;
                return (
                    <li key={competitionId}>
                        <Link to={`/competition?id=${competitionId}`} style={{ textDecoration: 'none' }}>
                            <Button label={competitionName} />
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
