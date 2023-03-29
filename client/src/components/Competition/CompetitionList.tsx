import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';

import { getUserPortfolios, verifyUser } from 'api/Profile/User';


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
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const token: string = Cookies.get('token');

            // check if user is logged in
                // const loggedIn: boolean = await verifyUser(token);
                // if (!loggedIn) {
                //     navigate('/login');
                //     return;
                // }

            // fetch portfolios
            const portfolios = await getUserPortfolios(token);
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