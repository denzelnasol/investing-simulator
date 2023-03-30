import React from 'react';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useState } from 'react';

import './style.scss';

function CompetitionSidebar(props) {
  const [visible, setVisible] = useState<boolean>(false);

  const sidebar = (
    <Sidebar
      visible={visible}
      onHide={() => setVisible(false)}
      className="scrollable-sidebar surface-200"
    >
      <h2>Competition Infomation</h2>
      <p>Compete with individuals with this exciting feature. Here you can compete against 
        up to 4 players to see who is the best day trader!
      </p> <br/>
      <p>How this works</p> <br/>
      <p>Invite up to 3 other players to join your competition through the "invite" button.</p>

    </Sidebar>
  );

  const sidebarButton = (
    <Button className="scrollable-button text-center bg-blue-600" onClick={() => setVisible(true)}>
      <div className="flex flex-column m-3">
        <div>
          Info
        </div>
        <i className="pi pi-briefcase" style={{ 'fontSize': '1.5rem' }} />
      </div>
    </Button>
  );

  return (
    <div>
      {sidebar}

      {sidebarButton}
    </div>
  );
}

export default CompetitionSidebar