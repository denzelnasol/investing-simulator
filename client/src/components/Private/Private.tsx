import React, { useEffect } from 'react';

/**
 * Wrapper function to manage access to restricted components (require login)
 * 
 * @param component component to wrap
 * @returns Component that either renders passed in component, or login page
 */
function Private(props) {
    
    // check user token on back-end
    useEffect(() => {
        

    }, []);
    
    return (
    <div>
         
    </div>
    );
}

export default Private;