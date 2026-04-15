import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  Assessment as ReportIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

import HealthScoreCard from './HealthScoreCard';
import RiskAlertsCard from './RiskAlertsCard';
import PredictionCharts from './PredictionCharts';

const Dashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications] = useState(3);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'risks', label: 'Risk Alerts', icon: <WarningIcon /> },
    { id: 'predictions', label: 'Predictions', icon: <TrendingUpIcon /> },
    { id: 'upload', label: 'Upload Documents', icon: <UploadIcon /> },
    { id: 'search', label: 'Search', icon: <SearchIcon /> },
    { id: 'reports', label: 'Reports', icon: <ReportIcon /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <HealthScoreCard />
            </Grid>
            <Grid item xs={12} md={8}>
              <RiskAlertsCard />
            </Grid>
            <Grid item xs={12}>
              <PredictionCharts />
            </Grid>
          </Grid>
        );
      case 'upload':
        return <Typography>Document Upload - Coming Soon</Typography>;
      case 'search':
        return <Typography>Semantic Search - Coming Soon</Typography>;
      case 'reports':
        return <Typography>Report Generation - Coming Soon</Typography>;
      case 'risks':
        return <RiskAlertsCard expanded />;
      case 'predictions':
        return <PredictionCharts expanded />;
      default:
        return <Typography>View not implemented</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AI SW Program Manager
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => console.log('Sign out clicked')}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActiveView(item.id);
                    setDrawerOpen(false);
                  }}
                  selected={activeView === item.id}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
