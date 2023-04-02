import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import CompetitionSidebar from 'components/Competition/CompetitionSidebar';
import CompetitionStandings from 'components/Competition/CompetitionStandings';
import CompetitionGraph from 'components/Competition/CompetitionGraph';
import CompetitionInvite from 'components/Competition/CompetitonInvite';
import CompetitionConfiguration from './CompetitionConfig';
import { endCompetition, getCompetitionData, startCompetition } from 'api/Competition/Competition';
import { Participant } from './sharedTypes/ParticipantInterface';

import './style.scss';
import Button from 'components/PrimeReact/Button/Button';
import Card from 'components/PrimeReact/Card/Card';
import Toolbar from 'components/PrimeReact/Toolbar/Toolbar';


function Competition({ ...props }) {
    const [searchParams] = useSearchParams();

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [competitionName, setCompetitionName] = useState("");
    const [competitionData, setCompetitionData] = useState<any>(null);
    const [competitionId, setCompetitionId] = useState<string>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [config, setConfig] = useState({
        startDate: new Date(),
        endDate: new Date(),
        playerSize: 0,
    });

    // fetch information about competition
    useEffect(() => {
        async function checkCompetitionEnded(endDate: Date, competitionId: string, state: string) {
            const currentDate = new Date();
            if (endDate < currentDate && state !== 'ended') {
                await endCompetition(competitionId);
                fetchData();
            }
        }

        async function fetchData() {
            // get competition id from query string in URL
            const id = searchParams.get("id");
            const data = await getCompetitionData(id);
            setCompetitionData(data);
            setCompetitionId(id);

            setCompetitionName(data.competitionName);
            setParticipants(data.rankings);
            setConfig({
                startDate: new Date(data.competitionStart),
                endDate: new Date(data.competitionEnd),
                playerSize: data.requirements.maxParticipants,
            });

            await checkCompetitionEnded(new Date(data.competitionEnd), id, data.state);
        }

        fetchData();
    }, [refresh]);

    const triggerRefresh = () => {
        setRefresh(!refresh);
    }

    const leftToolbarContents = (
        <>
            <div className="mr-5 font-bold text-gray-700">Start Date: {config.startDate.toDateString()}</div>
            <div className="mr-5 font-bold text-gray-700">End Date: {config.endDate.toDateString()}</div>
            <div className="mr-5 font-bold text-gray-700">Player Size: {config.playerSize}</div>

            {competitionData && competitionData.state === 'started'
                && <div className="font-bold text-green-500">Game Ongoing</div>
            }

            {competitionData && competitionData.state === 'ended'
                && <div className="font-bold text-red-500">Game Ended</div>
            }
        </>
    );

    const startButton = (
        <Button
            className="mr-2"
            label="Start Competition"
            icon="pi pi-arrow-circle-right"
            iconPos="right"
            onClick={async () => {
                await startCompetition(competitionId)
                triggerRefresh();
            }}
            disabled={competitionData && (competitionData.state === 'started' || competitionData.state === 'ended')}
        />
    );

    const configurationDialog = (
        <CompetitionConfiguration
            competition={competitionData}
            competitionId={competitionId}
            refresh={triggerRefresh}
        />
    )

    const inviteButton = (
        <CompetitionInvite competitionName competitionId={searchParams.get("id")} />
    );

    const rightToolbarContents = (
        <>
            {
                (competitionData && (competitionData.state === 'started' || competitionData.state === 'ended'))
                    ? <> </>
                    : <>
                        {startButton}
                        {inviteButton}
                        <div className='mr-2'></div>
                        {configurationDialog}
                    </>
            }
        </>
    );

    return (
        <Card className="competition-card mx-4">
            <div className="text-5xl font-bold text-gray-700 text-center">
                {competitionName}
            </div>

            <Toolbar className="my-3 bg-gray-300" left={leftToolbarContents} right={rightToolbarContents} />

            <CompetitionSidebar />
            <CompetitionGraph competition={competitionData} competitionId={competitionId} />
            <CompetitionStandings participants={participants} />
        </Card>
    );
}

export default Competition