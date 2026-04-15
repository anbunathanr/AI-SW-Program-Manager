import React from 'react';
import ReactDOM from 'react-dom/client';
import TestReportGeneration from './TestReportGeneration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TestReportGeneration />
  </React.StrictMode>
);