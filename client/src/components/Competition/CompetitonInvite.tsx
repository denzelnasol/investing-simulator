import React, { useState } from 'react';

// Components
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';

// API
import { sendEmail } from 'api/Email/Email';

// Styles
import './style.scss';

function CompetitionInvite({ ...props }) {
    // ** useStates ** //
    const [visible, setVisible] = useState(false);
    const [emails, setEmails] = useState([]);


    // ** Callback Functions ** //
    const showDialog = () => {
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const sendInvitations = () => {
        sendEmail(emails);
        setEmails([]);
        hideDialog();
    }

    // ** UI ** //
    const footer = (
        <div>
            <Button label="Cancel" className="p-button-text" onClick={hideDialog} />
            <Button label="Send Invitation" className="p-button-primary" onClick={sendInvitations} />
        </div>
    );

    return (
        <div className="p-card fluid invite-dialog">
            <Button label="Invite" className="p-button-success" icon="pi pi-plus" iconPos="right" onClick={showDialog} />
            <Dialog className="w-30rem invite-dialog" header="Share Competition Link" visible={visible} modal onHide={hideDialog} footer={footer}>
                <div className="p-field w-full">
                    <label htmlFor="email">{`Enter emails (press enter to complete)`}</label> <br/>
                    <Chips className="mt-3 w-full" value={emails} onChange={(e) => setEmails(e.value)} />
                </div>
            </Dialog>
        </div>
    );
}

export default CompetitionInvite;
