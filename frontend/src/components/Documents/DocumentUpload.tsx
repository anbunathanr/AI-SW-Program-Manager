import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { getStatusColor } from '../../utils/colorUtils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  insights?: string[];
  error?: string;
}

const DocumentUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [documentType, setDocumentType] = useState('auto');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const intervalRefs = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  // Clear all intervals on unmount
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(clearInterval);
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // handleDrop depends on handleFiles — add it to the dependency array
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    handleFiles(droppedFiles);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as File[];
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    fileList.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setErrorMessage(`File type "${file.type}" is not supported. Please upload PDF, DOCX, or TXT files.`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
      };

      setFiles(prev => [...prev, newFile]);
      simulateUpload(newFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + 10, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            intervalRefs.current.delete(interval);
            setTimeout(() => {
              setFiles(prev => prev.map(f =>
                f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
              ));
              simulateProcessing(fileId);
            }, 500);
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
    intervalRefs.current.add(interval);
  };

  const simulateProcessing = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + 15, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            intervalRefs.current.delete(interval);
            setTimeout(() => {
              setFiles(prev => prev.map(f =>
                f.id === fileId
                  ? {
                      ...f,
                      status: 'completed',
                      progress: 100,
                      insights: [
                        'Project timeline identified: 6 months',
                        'Budget allocation: $250,000',
                        'Key stakeholders: 5 identified',
                        'Risk factors: 3 potential issues found',
                      ],
                    }
                  : f
              ));
            }, 500);
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 300);
    intervalRefs.current.add(interval);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <FileIcon />;
    }
  };



  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Document Upload & Intelligence
      </Typography>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={5000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box mb={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Document Type</InputLabel>
              <Select
                value={documentType}
                label="Document Type"
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <MenuItem value="auto">Auto-detect</MenuItem>
                <MenuItem value="sow">Statement of Work (SOW)</MenuItem>
                <MenuItem value="brd">Business Requirements Document</MenuItem>
                <MenuItem value="sla">Service Level Agreement</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: dragOver ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: dragOver ? 'action.hover' : 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & drop files here
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or click to select files
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, DOCX, TXT (Max 10MB)
            </Typography>
            
            <Box mt={2}>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                  Select Files
                </Button>
              </label>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Uploaded Files ({files.length})
            </Typography>
            
            <List>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  divider
                  secondaryAction={
                    <Box display="flex" alignItems="center">
                      <Chip
                        label={file.status}
                        size="small"
                        color={getStatusColor(file.status)}
                        sx={{ mr: 1 }}
                      />
                      <IconButton edge="end" onClick={() => removeFile(file.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getStatusIcon(file.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {formatFileSize(file.size)} • {file.type}
                        </Typography>
                        {(file.status === 'uploading' || file.status === 'processing') && (
                          <Box mt={1}>
                            <LinearProgress 
                              variant="determinate" 
                              value={file.progress}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {file.status === 'uploading' ? 'Uploading' : 'Processing'}: {file.progress}%
                            </Typography>
                          </Box>
                        )}
                        {file.insights && (
                          <Box mt={1}>
                            <Typography variant="caption" color="success.main" display="block">
                              AI Insights Extracted:
                            </Typography>
                            {file.insights.map((insight, index) => (
                              <Chip
                                key={index}
                                label={insight}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mt: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                        {file.error && (
                          <Alert severity="error" sx={{ mt: 1 }}>
                            {file.error}
                          </Alert>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DocumentUpload;