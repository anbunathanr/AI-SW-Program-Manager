import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SimpleDashboard from './components/Dashboard/SimpleDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

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

function SimpleApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <SimpleDashboard />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default SimpleApp;