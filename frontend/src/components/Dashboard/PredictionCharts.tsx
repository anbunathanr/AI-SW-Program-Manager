import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PredictionChartsProps {
  expanded?: boolean;
}

const PredictionCharts: React.FC<PredictionChartsProps> = ({ expanded = false }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [delayData, setDelayData] = useState<any[]>([]);
  const [workloadData, setWorkloadData] = useState<any[]>([]);
  const [confidenceData, setConfidenceData] = useState<any[]>([]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDelayData([
        { date: '2024-01-01', predicted: 5, actual: 3, confidence: 85 },
        { date: '2024-01-08', predicted: 7, actual: 6, confidence: 78 },
        { date: '2024-01-15', predicted: 12, actual: 10, confidence: 82 },
        { date: '2024-01-22', predicted: 8, actual: null, confidence: 75 },
        { date: '2024-01-29', predicted: 15, actual: null, confidence: 70 },
      ]);

      setWorkloadData([
        { team: 'Frontend', current: 85, predicted: 92, capacity: 100 },
        { team: 'Backend', current: 78, predicted: 85, capacity: 100 },
        { team: 'DevOps', current: 95, predicted: 98, capacity: 100 },
        { team: 'QA', current: 70, predicted: 88, capacity: 100 },
      ]);

      setConfidenceData([
        { name: 'High Confidence', value: 65, color: '#4caf50' },
        { name: 'Medium Confidence', value: 25, color: '#ff9800' },
        { name: 'Low Confidence', value: 10, color: '#f44336' },
      ]);

      setLoading(false);
    }, 1200);
    return () => clearTimeout(id);
  }, [timeRange]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            Predictions & Analytics
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">7 Days</MenuItem>
              <MenuItem value="30d">30 Days</MenuItem>
              <MenuItem value="90d">90 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {/* Delay Prediction Trends */}
          <Grid item xs={12} md={expanded ? 6 : 12}>
            <Typography variant="subtitle1" gutterBottom>
              Delay Prediction Trends
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={delayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Predicted Delay"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#4caf50"
                  strokeWidth={2}
                  name="Actual Delay"
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>

          {/* Workload Imbalance */}
          {expanded && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Team Workload Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#1976d2" name="Current Load" />
                  <Bar dataKey="predicted" fill="#ff9800" name="Predicted Load" />
                  <Bar dataKey="capacity" fill="#e0e0e0" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          )}

          {/* Confidence Scores */}
          {expanded && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Prediction Confidence
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={confidenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {confidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          )}

          {/* Summary Stats */}
          <Grid item xs={12} md={expanded ? 6 : 12}>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  78%
                </Typography>
                <Typography variant="caption">
                  Prediction Accuracy
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  12
                </Typography>
                <Typography variant="caption">
                  Days Avg Delay
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  85%
                </Typography>
                <Typography variant="caption">
                  Team Utilization
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PredictionCharts;