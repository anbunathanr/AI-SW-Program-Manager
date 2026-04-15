import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={3}
        >
          <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" paragraph>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try again
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;