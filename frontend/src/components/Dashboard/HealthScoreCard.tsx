import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface HealthScore {
  overall: number;
  ragStatus: 'Green' | 'Amber' | 'Red';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

const HealthScoreCard: React.FC = () => {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setHealthScore({
        overall: 78,
        ragStatus: 'Amber',
        trend: 'down',
        lastUpdated: new Date().toLocaleString(),
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(id);
  }, []);

  const getRagColor = (status: string) => {
    switch (status) {
      case 'Green': return '#4caf50';
      case 'Amber': return '#ff9800';
      case 'Red': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <TrendingFlat color="action" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Health Score
        </Typography>
        
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={healthScore?.overall || 0}
              size={120}
              thickness={4}
              sx={{ color: getRagColor(healthScore?.ragStatus || 'Green') }}
            />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h4" component="div" color="text.secondary">
                {healthScore?.overall}%
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            label={`RAG: ${healthScore?.ragStatus}`}
            sx={{ 
              backgroundColor: getRagColor(healthScore?.ragStatus || 'Green'),
              color: 'white'
            }}
          />
          <Box display="flex" alignItems="center">
            {getTrendIcon(healthScore?.trend || 'stable')}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Last updated: {healthScore?.lastUpdated}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard;