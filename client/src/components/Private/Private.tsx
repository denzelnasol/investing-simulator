import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';
import { verifyUser } from 'api/Profile/User';

interface PrivateProps {
    componentToRender: React.ComponentType<any>
}

/**
 * Wrapper function to manage access to restricted components (require login)
 * 
 * @param component component to wrap
 * @returns Component that either renders passed in component, or login page
 */
function Private(props: PrivateProps) {
    const ComponentToRender = props.componentToRender;
    const navigate = useNavigate();
    const [token, setToken] = useState()
    
    // check user token on back-end
    useEffect(() => {
        async function authenticateUser() { 
            const cookieVal = await Cookies.get('token');
            setToken(cookieVal);

            const isAuthenticated = await verifyUser(cookieVal);
            if (!isAuthenticated) {
                navigate('/login');
            }
        }

        authenticateUser();
    }, []);
    
    return (
        <ComponentToRender token={token}/>
    );
}

export default Private;