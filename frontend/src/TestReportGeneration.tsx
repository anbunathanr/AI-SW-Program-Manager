import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ReportGeneration from './components/Reports/ReportGeneration';

const theme = createTheme();

const TestReportGeneration: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <ReportGeneration />
      </div>
    </ThemeProvider>
  );
};

export default TestReportGeneration;