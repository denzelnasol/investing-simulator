import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { updateCompetition } from 'api/Competition/Competition';

interface Config {
  startDate: Date,
  endDate: Date,
  playerSize: number,
};

function CompetitionConfiguration({ ...props }) {
  /* use states */
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [playerSize, setPlayerSize] = useState<number>(null);

  useEffect(() => {
    if (props.competition) {
      setStartDate(props.competition.competitionStart);
      setEndDate(props.competition.competitionEnd);
      setPlayerSize(props.competition.requirements.maxParticipants);
    }
  }, [props.competition]);

  const showDialog = () => {
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };
  const saveConfiguration = async () => {

    const data = {
      startDate,
      endDate,
      playerSize,
      competitionId: props.competitionId
    }
    const result = await updateCompetition(data);
    if (result) {
      hideDialog();
      props.refresh();
    }
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
          <label htmlFor="startdate">Start Date</label> <br />
          <Calendar
            id="startdate"
            value={startDate ? new Date(startDate) : null}
            onChange={(e) => setStartDate(e.value)}
            maxDate={new Date(endDate)}
          />
        </div>

        <div className="p-field">
          <label htmlFor="enddate">End Date</label> <br />
          <Calendar
            id="enddate"
            value={endDate ? new Date(endDate) : null}
            onChange={(e) => setEndDate(e.value)}
            minDate={new Date(startDate)}
          />
        </div>

        <div className="p-field">
          <label htmlFor="playersize">Player Size</label> <br />
          <InputText
            id="playersize"
            type="number"
            value={playerSize ? playerSize.toString() : ""}
            onChange={(e) => setPlayerSize(parseInt(e.target.value))}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default CompetitionConfiguration;
