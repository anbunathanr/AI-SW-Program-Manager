import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'configuring') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
