import React from 'react';

import { Divider } from 'primereact/divider';

const Footer = () => {
    return (
        <footer>
            {/* <Divider/> */}
            <div className='grid'>
                <div className='col-4' style={{textAlign:'center'}}>
                    <div className='mt-3' style={{ color: 'var(--primary-color)'}}>Copyright 2023. Investing Simulator. All Rights Reserved  </div>
                </div>
                {/* <div className='col-4' style={{textAlign:'center'}}>
                    <p style={{ color: 'var(--primary-color)'}}>Created by Group 24  </p>
                </div>
                <div className='col-4' style={{textAlign:'center'}}>
                    <p style={{ color: 'var(--primary-color)'}}>Andy C. Mathew W. Harry N. Denzel N. </p>
                </div> */}
            </div>
        </footer>
    );

    
}
export default Footer;
