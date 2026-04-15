import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { awsConfig } from './config/aws-config';
import './App.css';

// Configure Amplify once at app startup
try {
  Amplify.configure(awsConfig);
} catch (error) {
  console.warn('AWS Amplify configuration failed:', error);
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Authenticator.Provider is required for useAuthenticator hook in child components */}
        <Authenticator.Provider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </Authenticator.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
