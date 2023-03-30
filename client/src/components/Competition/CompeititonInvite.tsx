import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

function CompetitionInvite(props) {
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const showDialog = () => {
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const sendInvitation = () => {
        console.log('Invitation sent to:', name, email);
        hideDialog();
    };

    const footer = (
        <div>
            <Button label="Cancel" className="p-button-text" onClick={hideDialog} />
            <Button label="Send Invitation" className="p-button-primary" onClick={sendInvitation} />
        </div>
    );

    return (
        <div>
            <Button label="Invite" className="p-button-success" icon="pi pi-plus" iconPos="right" onClick={showDialog} />
            <Dialog header="Invite a Friend to the Competition" visible={visible} modal onHide={hideDialog} footer={footer}>
                <div className="p-field">
                    <label htmlFor="name">Name</label> <br/>
                    <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="p-field">
                    <label htmlFor="email">Email Address</label> <br/>
                    <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </Dialog>
        </div>
    );
}

export default CompetitionInvite;
