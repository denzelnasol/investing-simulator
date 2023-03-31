import React, { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import { verifyUser } from 'api/Profile/User';

import Login from 'components/Login/Login';

interface PrivateProps {
    componentToRender: React.ReactNode
}

/**
 * Wrapper function to manage access to restricted components (require login)
 * 
 * @param component component to wrap
 * @returns Component that either renders passed in component, or login page
 */
function Private(props: PrivateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // check user token on back-end
    useEffect(() => {
        async function authenticateUser() { 
            const token = Cookies.get('token');
            setIsAuthenticated(await verifyUser(token));
        }

        authenticateUser();
    }, []);

    console.log(isAuthenticated);
    
    return (
        isAuthenticated 
            ? <div>{props.componentToRender}</div>
            : <Login />
    );
}

export default Private;