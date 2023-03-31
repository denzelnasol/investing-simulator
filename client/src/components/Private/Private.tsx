import React, { useEffect } from 'react';
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
    
    // check user token on back-end
    useEffect(() => {
        async function authenticateUser() { 
            const cookieVal = await Cookies.get('token');
            const isAuthenticated = await verifyUser(cookieVal);
            if (!isAuthenticated) {
                navigate('/login');
            }
        }

        authenticateUser();
    }, []);
    
    return (
        <ComponentToRender />
    );
}

export default Private;