import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DocumentIcon,
  AccessTime as TimeIcon,
  TrendingUp as RelevanceIcon,
} from '@mui/icons-material';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  documentType: string;
  relevanceScore: number;
  lastModified: string;
  highlights: string[];
  metadata: {
    author?: string;
    project?: string;
    tags?: string[];
  };
}

const SemanticSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const documentTypes = [
    { value: 'all', label: 'All Documents' },
    { value: 'sow', label: 'Statement of Work' },
    { value: 'brd', label: 'Business Requirements' },
    { value: 'sla', label: 'Service Level Agreement' },
    { value: 'contract', label: 'Contracts' },
    { value: 'report', label: 'Reports' },
  ];

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Project Alpha - Statement of Work',
          content: 'This document outlines the scope, deliverables, and timeline for Project Alpha development. The project involves building a comprehensive dashboard for program management with AI-driven insights and real-time monitoring capabilities.',
          documentType: 'SOW',
          relevanceScore: 95,
          lastModified: '2024-01-15T10:30:00Z',
          highlights: ['AI-driven insights', 'real-time monitoring', 'program management'],
          metadata: {
            author: 'John Smith',
            project: 'Project Alpha',
            tags: ['dashboard', 'AI', 'monitoring']
          }
        },
        {
          id: '2',
          title: 'Risk Management Framework - BRD',
          content: 'Business requirements for implementing automated risk detection and mitigation strategies. The system should identify potential project risks using machine learning algorithms and provide actionable recommendations.',
          documentType: 'BRD',
          relevanceScore: 87,
          lastModified: '2024-01-12T14:20:00Z',
          highlights: ['risk detection', 'machine learning', 'actionable recommendations'],
          metadata: {
            author: 'Sarah Johnson',
            project: 'Risk Framework',
            tags: ['risk', 'ML', 'automation']
          }
        },
        {
          id: '3',
          title: 'API Integration SLA',
          content: 'Service level agreement for third-party API integrations including response time requirements, availability guarantees, and escalation procedures for system failures.',
          documentType: 'SLA',
          relevanceScore: 78,
          lastModified: '2024-01-10T09:15:00Z',
          highlights: ['API integrations', 'response time', 'availability guarantees'],
          metadata: {
            author: 'Mike Chen',
            project: 'Integration Services',
            tags: ['API', 'SLA', 'integration']
          }
        }
      ];

      // Filter results based on current filters
      let filteredResults = mockResults;
      
      if (documentTypeFilter !== 'all') {
        filteredResults = filteredResults.filter(result => 
          result.documentType.toLowerCase() === documentTypeFilter
        );
      }

      // Sort results
      if (sortBy === 'relevance') {
        filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      } else if (sortBy === 'date') {
        filteredResults.sort((a, b) => 
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        );
      }

      setResults(filteredResults);
      setLoading(false);
    }, 1500);
  };

  // onKeyPress is deprecated — use onKeyDown instead
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const highlightText = (text: string, highlights: string[]) => {
    let safeText = escapeHtml(text);
    highlights.forEach(highlight => {
      const safeHighlight = escapeHtml(highlight);
      const regex = new RegExp(`(${safeHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      safeText = safeText.replace(regex, '<mark>$1</mark>');
    });
    return safeText;
  };

  const getRelevanceColor = (score: number): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Semantic Search
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search documents using natural language..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} disabled={loading}>
                        {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={documentTypeFilter}
                  label="Document Type"
                  onChange={(e) => setDocumentTypeFilter(e.target.value)}
                >
                  {documentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date Range"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  {dateFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="date">Date Modified</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {query && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Search suggestions: Try "project risks", "budget allocation", "timeline delays", or "stakeholder requirements"
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Results ({results.length})
            </Typography>

            <List>
              {results.map((result, index) => (
                <React.Fragment key={result.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" component="div" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                          {result.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            icon={<RelevanceIcon />}
                            label={`${result.relevanceScore}%`}
                            size="small"
                            color={getRelevanceColor(result.relevanceScore)}
                          />
                          <Chip
                            icon={<DocumentIcon />}
                            label={result.documentType}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.content, result.highlights)
                        }}
                      />

                      <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                        {result.highlights.map((highlight, idx) => (
                          <Chip
                            key={idx}
                            label={highlight}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="caption" color="text.secondary">
                            <TimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {new Date(result.lastModified).toLocaleDateString()}
                          </Typography>
                          {result.metadata.author && (
                            <Typography variant="caption" color="text.secondary">
                              By {result.metadata.author}
                            </Typography>
                          )}
                          {result.metadata.project && (
                            <Typography variant="caption" color="text.secondary">
                              Project: {result.metadata.project}
                            </Typography>
                          )}
                        </Box>
                        
                        {result.metadata.tags && (
                          <Box display="flex" gap={0.5}>
                            {result.metadata.tags.map((tag, idx) => (
                              <Chip
                                key={idx}
                                label={tag}
                                size="small"
                                variant="filled"
                                sx={{ fontSize: '0.6rem', height: 18 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                  {index < results.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {query && results.length === 0 && !loading && (
        <Alert severity="info">
          No results found for "{query}". Try different keywords or adjust your filters.
        </Alert>
      )}
    </Box>
  );
};

export default SemanticSearch;