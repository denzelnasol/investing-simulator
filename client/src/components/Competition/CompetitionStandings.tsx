import React from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Participant } from './sharedTypes/ParticipantInterface'

function CompetitionStandings(props: {participants: Participant[]}) {
    const data = props.participants.map((p, index) => {
        return {
            ranking: index + 1,
            name: `${p.firstName} ${p.lastName}`,
            balance: p.balance,
        };
    }).sort((a, b) => b.balance - a.balance);
    

    const header = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h1 className="m-0 text-gray-700">Current Standings</h1>
            </div>
        );
    }
    
    return (
        <DataTable 
            header={header}
            value={data}
            size={"large"}
            showGridlines
            stripedRows
        >
            <Column field="ranking" header="Ranking" />
            <Column field="name" header="Name" />
            <Column field="balance" header="Balance" />
        </DataTable>
    );
}

export default CompetitionStandings