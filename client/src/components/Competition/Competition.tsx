import React, { useState } from 'react';

import CompetitionSidebar from 'components/Competition/CompetitionSidebar';
import CompetitionStandings from 'components/Competition/CompetitionStandings';
import CompetitionGraph from 'components/Competition/CompetitionGraph';
import CompetitionInvite from 'components/Competition/CompeititonInvite';
import CompetitionConfiguration from './CompetitionConfig';

import Card from 'components/PrimeReact/Card/Card';
import Toolbar from 'components/PrimeReact/Toolbar/Toolbar';

import './style.scss';
import Button from 'components/PrimeReact/Button/Button';

function Competition({ ...props }) {
    const [config, setConfig] = useState({
        startdate: '',
        enddate: '',
        playersize: 0,
      });
    
      const handleConfigSave = (newConfig) => {
        setConfig(newConfig);
      };

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
                Competition Page
            </div>

            <Toolbar className="my-3 bg-gray-300" left={leftToolbarContents} right={rightToolbarContents} />

            <CompetitionSidebar />
            <CompetitionGraph />
            <CompetitionStandings />
        </Card>
    );
}

export default Competition