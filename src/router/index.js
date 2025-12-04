import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import routes from './routes';
import AuthService from '../services/AuthService'; // Your AuthService
import { selectStoredPermissions } from '../stores/permissionsSlice';
import Layout from './Layout';


const AppRouter = () => {
    const isAuthenticated = AuthService.getCurrentUser();
    const basePath = process.env.REACT_APP_BASE_PATH || '/legal_stg/user-portal';
    
    return (
        <Router  basename={basePath} >
            <Routes>
                <Route element={<Layout  />}>
                    {routes.map((route, index) => {

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<route.component />}
                            />
                        );
                    })}
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;
