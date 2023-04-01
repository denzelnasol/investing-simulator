import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import CompetitionSidebar from 'components/Competition/CompetitionSidebar';
import CompetitionStandings from 'components/Competition/CompetitionStandings';
import CompetitionGraph from 'components/Competition/CompetitionGraph';
import CompetitionInvite from 'components/Competition/CompeititonInvite';
import CompetitionConfiguration from './CompetitionConfig';
import { getCompetitionData } from 'api/Competition/Competition';
import { Participant } from './sharedTypes/ParticipantInterface';

import './style.scss';
import Button from 'components/PrimeReact/Button/Button';
import Card from 'components/PrimeReact/Card/Card';
import Toolbar from 'components/PrimeReact/Toolbar/Toolbar';


function Competition({ ...props }) {
    const [searchParams] = useSearchParams();

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [competitionName, setCompetitionName] = useState("");
    const [config, setConfig] = useState({
        startdate: '',
        enddate: '',
        playersize: 0,
    });
    const handleConfigSave = (newConfig) => {
        setConfig(newConfig);
    };

    // fetch information about competition
    useEffect(() => {
        async function fetchData() {
            // get competition id from query string in URL
            const id = searchParams.get("id");
            const data = await getCompetitionData(id);
            console.log(data);

            setCompetitionName(data.competitionName);
            setParticipants(data.rankings);
        }

        fetchData();
    }, []);

    const leftToolbarContents = (
        <>
            <div className="mr-5 font-bold text-gray-700">Start Date: {config.startdate}</div>
            <div className="mr-5 font-bold text-gray-700">End Date: {config.enddate}</div>
            <div className="font-bold text-gray-700">Player Size: {config.playersize}</div>
        </>
    );
    
    const rightToolbarContents = (
        <>
            <Button className="mr-2" label="Start Competition" icon="pi pi-arrow-circle-right" iconPos="right"/>
            <CompetitionInvite />
            <div className='mr-2'></div>
            <CompetitionConfiguration onSave={handleConfigSave}/>
        </>
    );

    return (
        <Card className="competition-card mx-4">
            <div className="text-5xl font-bold text-gray-700 text-center">
                {competitionName}
            </div>

            <Toolbar className="my-3 bg-gray-300" left={leftToolbarContents} right={rightToolbarContents} />

            <CompetitionSidebar />
            <CompetitionGraph />
            <CompetitionStandings participants={participants}/>
        </Card>
    );
}

export default Competition