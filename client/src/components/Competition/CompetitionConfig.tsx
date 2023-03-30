import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

function CompetitionConfiguration(props) {
  const [visible, setVisible] = useState(false);
  const [configuration, setConfiguration] = useState({
    startdate: new Date(),
    enddate: new Date(),
    playersize: 0,
  });

  const showDialog = () => {
    setVisible(true);
  }

  const hideDialog = () => {
    setVisible(false);
  }

  const saveConfiguration = () => {
    // Save configuration and close dialog
    console.log(configuration);
    hideDialog();
  }
  const minStartDate = new Date();

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
            <label htmlFor="startdate">Start Date</label>
            <Calendar id="startdate" value={configuration.startdate} onChange={(e) => setConfiguration({ ...configuration, startdate: e.value })} minDate={minStartDate} />
        </div>
        <div className="p-field">
            <label htmlFor="enddate">End Date</label>
            <Calendar id="enddate" value={configuration.enddate} onChange={(e) => setConfiguration({ ...configuration, enddate: e.value })} />
        </div>
        <div className="p-field">
            <label htmlFor="playersize">Player Size</label>
            <InputText id="playersize" type="number" value={configuration.playersize.toString()} onChange={(e) => setConfiguration({ ...configuration, playersize: parseInt(e.target.value) })} />
        </div>
      </Dialog>
    </div>
  );
}

export default CompetitionConfiguration;
