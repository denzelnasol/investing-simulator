import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// API
import { getCompetitionPortfolios } from 'api/Profile/User';

// Components
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { getCompetitionData } from 'api/Competition/Competition';

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
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState<any>([]);
    const [selectedCompetition, setSelectedCompetition] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            // fetch portfolios (request returns competition ids as well)
            const token: string = Cookies.get('token');
            const portfolios = await getCompetitionPortfolios(token);
            console.log(portfolios);

            if (!portfolios) return;

            // update list of competitions on UI
            const competitionLinks = await Promise.all(portfolios.map(async (p) => {
                const competitionName = p.competition.name;
                const competitionId = p.fk_competition;
                const competitionData = await getCompetitionData(competitionId);
                const startDate = new Date(competitionData.competitionStart).toLocaleString();
                const endDate = new Date(competitionData.competitionEnd).toLocaleString();
                return (
                    {
                        competitionName,
                        competitionId,
                        startDate,
                        endDate
                    }
                )
            }));
            setCompetitions(competitionLinks);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCompetition) {
            navigate(`/competition?id=${selectedCompetition.competitionId}`);
        }

    }, [selectedCompetition]);

    const competitionListTable = (
        <DataTable
            value={competitions}
            selectionMode="single"
            selection={selectedCompetition}
            onSelectionChange={e => setSelectedCompetition(e.value)}
        >
            <Column field="competitionName" header="Name"></Column>
            <Column field="startDate" header="Start Date"></Column>
            <Column field="endDate" header="End Date"></Column>
        </DataTable>
    );

    return (
        <div>
            <h1>Your Ongoing Competitions</h1>
            {competitionListTable}
        </div>
    );
};

export default CompetitionList;

// -------- NOTES ---------

// fetch portfolios
// use each portfolio's id to find competition it belongs in
// display list of buttons with compeititon names
// clicking on button redirects to competition page
