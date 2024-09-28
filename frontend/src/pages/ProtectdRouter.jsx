import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ element, children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);  
    const location = useLocation();

    const checkAuth = async () => {
        const accessToken = localStorage.getItem('accessToken');  
        try {
            await axios.get('https://issue-tracker-system-1t4j.onrender.com/api/v1/users/protected-route', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,  
                },withCredentials: true,
            });
            setIsAuthenticated(true);
            console.log(res.data);
        } catch (error) {
            setIsAuthenticated(false);
            console.log(error);
        }
    };

    useEffect(() => {
        console.log("protected route");
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;  
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return element ? element : children;
}

export default ProtectedRoute;
