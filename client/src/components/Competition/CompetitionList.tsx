import React, { useEffect, useState } from 'react';

import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

import { getUserPortfolios } from 'api/Profile/User';


const testCompetitions: CompeititonWrapper[] = [
    {
        portfolioId: 10,
        name: "my comp0"
    },
    {
        portfolioId: 11,
        name: "my comp1"
    },
    {
        portfolioId: 12,
        name: "my comp2"
    },
    {
        portfolioId: 13,
        name: "my comp3"
    },
];

interface CompeititonWrapper {
    portfolioId: number,
    name: string
}

function CompetitionList(props) {
    const [competitions, setCompetitions] = useState<any>([]);

    useEffect(() => {
        (async () => {
            // fetch portfolios
            const profileId = '1fdce0aa-7638-422f-94bf-fb7265bcb48d'
            const portfolios = await getUserPortfolios(profileId);
            console.log(portfolios);

            // fetch competitions with portfolio ids
        })();
    

        const fetchedComps = testCompetitions.map((c: CompeititonWrapper) => {
            return (
                <li key={c.portfolioId}>
                    <Link to="/competition" style={{ textDecoration: 'none' }}>
                        <Button label={c.name} />
                    </Link>
                </li>
            )
        });
        setCompetitions(fetchedComps);

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

// have function to get *competition name* using portfolio as arg

// could pass in user id/cookie as a prop