import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

interface Config {
  startDate: Date,
  endDate: Date,
  playerSize: number,
};

function CompetitionConfiguration(props: {startingConfig: Config, onSave: (config: Config) => void}) {
  const {startingConfig} = props;

  /* use states */
  const [visible, setVisible] = useState(false);
  const [configuration, setConfiguration] = useState({
    startDate: startingConfig.startDate,
    endDate: startingConfig.endDate,
    playerSize: startingConfig.playerSize,
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

  const handleStartDateChange = (e) => {
    const startDate = e.value;
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 1);
    setMinEndDate(nextDay);
    setConfiguration({...configuration, startDate: startDate ?? null});
  };

  const handleEndDateChange = (e) => {
    setConfiguration({...configuration, endDate: e.value ?? null});
  };

  const footer = (
    <div>
      <Button label="Cancel" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" className="p-button-primary" onClick={saveConfiguration} />
    </div>
  );

  return (
    <div>
      <Button label="Configure" icon="pi pi-cog" iconPos="right" className="p-button-secondary" onClick={showDialog} />

      <Dialog header="Configuration" visible={visible} modal onHide={hideDialog} footer={footer}>
        <div className="p-field">
          <label htmlFor="startdate">Start Date</label> <br/>
          <Calendar 
            id="startdate" 
            value={configuration.startDate ? new Date(configuration.startDate) : null} 
            onChange={handleStartDateChange} 
            minDate={new Date()}
          />
        </div>

        <div className="p-field">
          <label htmlFor="enddate">End Date</label> <br/>
          <Calendar 
            id="enddate" 
            value={configuration.endDate ? new Date(configuration.endDate) : null}
            onChange={handleEndDateChange} 
            minDate={minEndDate}
          />
        </div>

        <div className="p-field">
          <label htmlFor="playersize">Player Size</label> <br/>
          <InputText 
            id="playersize" 
            type="number" 
            value={configuration.playerSize.toString()} 
            onChange={(e) => setConfiguration({ ...configuration, playerSize: parseInt(e.target.value) })} 
          />
        </div>
      </Dialog>
    </div>
  );
}

export default CompetitionConfiguration;
