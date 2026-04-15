import React, { useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Container, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginInner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return null;
};

const Login: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            AI SW Program Manager
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Sign in to access your dashboard
          </Typography>
        </Box>

        <Authenticator signUpAttributes={['email']}>
          <LoginInner />
        </Authenticator>
      </Paper>
    </Container>
  );
};

export default Login;
