import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface RiskAlert {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  impact: string;
  recommendation: string;
  createdAt: string;
}

interface RiskAlertsCardProps {
  expanded?: boolean;
}

const RiskAlertsCard: React.FC<RiskAlertsCardProps> = ({ expanded = false }) => {
  const [risks, setRisks] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<RiskAlert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setRisks([
        {
          id: '1',
          title: 'Sprint Velocity Declining',
          severity: 'High',
          description: 'Team velocity has dropped by 30% over the last 2 sprints',
          impact: 'Potential delay in milestone delivery',
          recommendation: 'Review team capacity and remove blockers',
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          title: 'Budget Overrun Risk',
          severity: 'Critical',
          description: 'Current burn rate exceeds planned budget by 15%',
          impact: 'Project may exceed allocated budget',
          recommendation: 'Immediate cost review and optimization required',
          createdAt: '2024-01-14T14:20:00Z',
        },
        {
          id: '3',
          title: 'Dependency Delay',
          severity: 'Medium',
          description: 'External API integration delayed by 1 week',
          impact: 'Minor impact on testing phase',
          recommendation: 'Adjust testing schedule and prepare fallback',
          createdAt: '2024-01-13T09:15:00Z',
        },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <ErrorIcon sx={{ color: '#d32f2f' }} />;
      case 'High': return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'Medium': return <InfoIcon sx={{ color: '#ffc107' }} />;
      case 'Low': return <CheckCircleIcon sx={{ color: '#2196f3' }} />;
      default: return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#ff9800';
      case 'Medium': return '#ffc107';
      case 'Low': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const handleRiskClick = (risk: RiskAlert) => {
    setSelectedRisk(risk);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRisk(null);
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
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Risk Alerts ({risks.length})
          </Typography>

          <List dense={!expanded}>
            {risks.slice(0, expanded ? risks.length : 3).map((risk) => (
              <ListItem key={risk.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleRiskClick(risk)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon>
                    {getSeverityIcon(risk.severity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={risk.title}
                    secondary={expanded ? risk.description : undefined}
                  />
                  <Chip
                    label={risk.severity}
                    size="small"
                    sx={{
                      backgroundColor: getSeverityColor(risk.severity),
                      color: 'white',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {!expanded && risks.length > 3 && (
            <Box mt={2}>
              <Button variant="outlined" size="small">
                View All Risks ({risks.length})
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {selectedRisk && getSeverityIcon(selectedRisk.severity)}
            {selectedRisk?.title}
            <Chip
              label={selectedRisk?.severity}
              size="small"
              sx={{
                backgroundColor: getSeverityColor(selectedRisk?.severity || ''),
                color: 'white',
                ml: 1,
              }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <Typography paragraph>{selectedRisk?.description}</Typography>

          <Typography variant="h6" gutterBottom>Impact</Typography>
          <Typography paragraph>{selectedRisk?.impact}</Typography>

          <Typography variant="h6" gutterBottom>Recommendation</Typography>
          <Typography paragraph>{selectedRisk?.recommendation}</Typography>

          <Typography variant="caption" color="text.secondary">
            Created: {selectedRisk && new Date(selectedRisk.createdAt).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Mark as Resolved
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RiskAlertsCard;
