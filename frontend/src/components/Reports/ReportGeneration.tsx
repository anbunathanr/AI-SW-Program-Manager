import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { Assessment as ReportIcon, Download as DownloadIcon } from '@mui/icons-material';
import { getStatusColor } from '../../utils/colorUtils';

interface Report {
  id: string;
  name: string;
  type: string;
  status: 'generating' | 'completed' | 'scheduled' | 'failed';
  createdAt: string;
  size?: string;
}

const ReportGeneration: React.FC = () => {
  const [reportType, setReportType] = useState('weekly');
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Weekly Status Report - Jan 15',
      type: 'weekly',
      status: 'completed',
      createdAt: '2024-01-15T10:00:00Z',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Executive Summary - Q1 2024',
      type: 'executive',
      status: 'completed',
      createdAt: '2024-01-10T09:00:00Z',
      size: '1.1 MB',
    },
  ]);

  const handleGenerate = () => {
    setGenerating(true);
    const newReport: Report = {
      id: Math.random().toString(36).substring(2, 9),
      name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: reportType,
      status: 'generating',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);

    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === newReport.id ? { ...r, status: 'completed', size: '1.8 MB' } : r
        )
      );
      setGenerating(false);
    }, 3000);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Report Generation
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="weekly">Weekly Status</MenuItem>
                  <MenuItem value="executive">Executive Summary</MenuItem>
                  <MenuItem value="risk">Risk Report</MenuItem>
                  <MenuItem value="prediction">Prediction Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <ReportIcon />}
                onClick={handleGenerate}
                disabled={generating}
                fullWidth
              >
                {generating ? 'Generating...' : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Reports
          </Typography>
          <List>
            {reports.map((report) => (
              <ListItem
                key={report.id}
                divider
                secondaryAction={
                  report.status === 'completed' && (
                    <Button size="small" startIcon={<DownloadIcon />}>
                      Download
                    </Button>
                  )
                }
              >
                <ListItemText
                  primary={report.name}
                  secondary={`${new Date(report.createdAt).toLocaleString()}${report.size ? ` • ${report.size}` : ''}`}
                />
                <Chip
                  label={report.status}
                  size="small"
                  color={getStatusColor(report.status)}
                  sx={{ mr: 2 }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportGeneration;
