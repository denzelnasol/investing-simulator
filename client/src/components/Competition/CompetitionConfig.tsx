import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';


function CompetitionConfiguration(props) {
  const [visible, setVisible] = useState(false);
  const [configuration, setConfiguration] = useState({
    start_time: null as string | null,
    end_time: null as string | null,
    max_num_players: 0,
    start_balance : 0,
    entry_points: 0,
  });
  const [minEndDate, setMinEndDate] = useState(new Date());

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };
  const saveConfiguration = () => {
    props.onSave(configuration);
    hideDialog();
  };

  const footer = (
    <div>
      <Button label="Cancel" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" className="p-button-primary" onClick={saveConfiguration} />
    </div>
  );
  const handleStartDateChange = (e) => {
    const startDate = e.value;
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 1);
    setMinEndDate(nextDay);
    setConfiguration({...configuration, start_time: startDate?.toString() ?? null});
  };

  const handleEndDateChange = (e) => {
    setConfiguration({...configuration, end_time: e.value?.toString() ?? null});
  };

  return (
    <div>
      <Button label="Configure" icon="pi pi-cog" iconPos="right" className="p-button-secondary" onClick={showDialog} />

      <Dialog header="Configuration" visible={visible} modal onHide={hideDialog} footer={footer}>
      <div className="p-field">
          <label htmlFor="startdate">Start Date</label> <br/>
          <Calendar id="startdate" value={configuration.start_time ? new Date(configuration.start_time) : null} onChange={handleStartDateChange}minDate={new Date()}/>
        </div>
        <div className="p-field">
          <label htmlFor="enddate">End Date</label> <br/>
          <Calendar id="enddate" value={configuration.end_time ? new Date(configuration.end_time) : null}onChange={handleEndDateChange} minDate={minEndDate}/>
        </div>
        <div className="p-field">
          <label htmlFor="playersize">Player Size</label> <br/>
          <InputText id="playersize" type="number" value={configuration.max_num_players.toString()} onChange={(e) => setConfiguration({ ...configuration, max_num_players: parseInt(e.target.value) })} />
        </div>
      </Dialog>
    </div>
  );
}

export default CompetitionConfiguration;
