import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { createCompetition } from 'api/Competition/Competition';

function CompetitionCreate() {
  const [balance, setBalance] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [entryPoints, setEntryPoints] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await createCompetition({
      entry_points: entryPoints,
      max_num_players: maxPlayers,
      start_balance: balance,
      start_time: startDate,
      end_time: endDate,
    });

    if (result) {
      console.log('Competition created');
    } else {
      console.error('Error creating competition');
    }
  };

  return (
    <div style={{ padding: '2em' }}>
        <h1 style={{ color: 'var(--primary-color)'}}>Competition Create</h1>
        <form onSubmit={handleSubmit}>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
            <i className="pi pi-wallet"></i>
            </span>
            <InputNumber
            id="balance"
            name="balance"
            value={balance}
            onChange={(event) => setBalance(event.value)}
            placeholder="Starting balance"
            required
            mode="currency"
            currency="USD"
            />
        </div>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
            </span>
            <Calendar
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={(event) => setStartDate(event.value)}
            placeholder="Start date"
            required
            dateFormat="mm/dd/yy"
            />
        </div>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
            </span>
            <Calendar
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={(event) => setEndDate(event.value)}
            placeholder="End date"
            required
            dateFormat="mm/dd/yy"
            />
        </div>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
            <i className="pi pi-dollar"></i>
            </span>
            <InputNumber
            id="entryPoints"
            name="entryPoints"
            value={entryPoints}
            onChange={(event) => setEntryPoints(event.value)}
            placeholder="Entry points"
            required
            />
        </div>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
            <i className="pi pi-users"></i>
            </span>
            <InputNumber
            id="maxPlayers"
            name="maxPlayers"
            value={maxPlayers}
            onChange={(event) => setMaxPlayers(event.value)}
            placeholder="Max players"
            required
            mode="decimal"
            minFractionDigits={0}
            maxFractionDigits={0}
            />
        </div>
        <Button label="Create Competition" icon="pi pi-check" type="submit" />
        </form>
    </div>
  );
}

export default CompetitionCreate;
