import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Chip,
  Button,
  Divider,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getPriorityColor } from '../../utils/colorUtils';

interface Notification {
  id: string;
  type: 'risk' | 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  metadata?: {
    projectId?: string;
    riskId?: string;
    reportId?: string;
  };
}

const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'risk',
        title: 'Critical Risk Detected',
        message: 'Budget overrun risk detected in Project Alpha. Immediate action required.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        read: false,
        priority: 'critical',
        metadata: { projectId: 'project-alpha', riskId: 'risk-001' }
      },
      {
        id: '2',
        type: 'success',
        title: 'Report Generated',
        message: 'Weekly status report has been successfully generated and is ready for download.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        read: false,
        priority: 'medium',
        metadata: { reportId: 'report-weekly-001' }
      },
      {
        id: '3',
        type: 'warning',
        title: 'Sprint Velocity Declining',
        message: 'Team velocity has dropped by 20% in the last sprint. Consider reviewing team capacity.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: true,
        priority: 'high',
        metadata: { projectId: 'project-beta' }
      },
      {
        id: '4',
        type: 'info',
        title: 'Document Processed',
        message: 'SOW document has been processed and insights have been extracted.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: true,
        priority: 'low'
      },
      {
        id: '5',
        type: 'error',
        title: 'Integration Failure',
        message: 'Failed to sync data from Jira. Please check your API credentials.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: false,
        priority: 'high'
      }
    ];

    setNotifications(mockNotifications);

    // Simulate new notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Math.random().toString(36).substring(2, 11),
        type: Math.random() > 0.5 ? 'info' : 'warning',
        title: 'New Update Available',
        message: 'A new prediction model update is available for your projects.',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'risk':
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <SuccessIcon color="success" />;
      case 'info':
      default:
        return <InfoIcon color="info" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
    handleMenuClose();
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    handleMenuClose();
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
            <Typography variant="h6">
              Notifications
            </Typography>
          </Box>
          
          <Box>
            <Button size="small" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark All Read
            </Button>
            <Button size="small" onClick={clearAll} disabled={notifications.length === 0}>
              Clear All
            </Button>
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Alert severity="info">
            No notifications at the moment. You're all caught up!
          </Alert>
        ) : (
          <List dense>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => handleMenuOpen(e, notification.id)}
                    >
                      <MoreIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.read ? 'normal' : 'bold',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.priority}
                          size="small"
                          color={getPriorityColor(notification.priority)}
                          sx={{ height: 16, fontSize: '0.6rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontWeight: notification.read ? 'normal' : 'medium',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedNotification && markAsRead(selectedNotification)}>
            <MarkReadIcon sx={{ mr: 1 }} />
            Mark as Read
          </MenuItem>
          <MenuItem onClick={() => selectedNotification && deleteNotification(selectedNotification)}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;