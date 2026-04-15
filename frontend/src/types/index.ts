// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  tenantId: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailAlerts: boolean;
  dashboardLayout: string[];
}

// Dashboard Types
export interface HealthScore {
  overall: number;
  ragStatus: 'Green' | 'Amber' | 'Red';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  components: {
    budget: number;
    timeline: number;
    quality: number;
    resources: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: {
    allocated: number;
    spent: number;
    remaining: number;
  };
  team: TeamMember[];
  healthScore: number;
  ragStatus: 'Green' | 'Amber' | 'Red';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  workload: number;
}

// Risk Management Types
export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probability: number;
  impact: string;
  mitigation: string;
  owner: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  projectId: string;
  category: 'technical' | 'business' | 'resource' | 'timeline' | 'budget';
}

// Prediction Types
export interface Prediction {
  id: string;
  type: 'delay' | 'budget' | 'resource' | 'quality';
  projectId: string;
  prediction: any;
  confidence: number;
  createdAt: string;
  validUntil: string;
}

export interface DelayPrediction {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
  factors: string[];
}

export interface WorkloadPrediction {
  team: string;
  current: number;
  predicted: number;
  capacity: number;
  recommendations: string[];
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt';
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  projectId?: string;
  category: 'sow' | 'brd' | 'sla' | 'contract' | 'report' | 'other';
  status: 'processing' | 'completed' | 'failed';
  insights?: DocumentInsight[];
  url?: string;
}

export interface DocumentInsight {
  type: 'timeline' | 'budget' | 'stakeholder' | 'requirement' | 'risk';
  content: string;
  confidence: number;
  location: {
    page?: number;
    section?: string;
  };
}

// Search Types
export interface SearchResult {
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

export interface SearchFilters {
  documentType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  projects?: string[];
  tags?: string[];
}

// Report Types
export interface Report {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'executive' | 'risk' | 'prediction' | 'custom';
  status: 'generating' | 'completed' | 'scheduled' | 'failed';
  createdAt: string;
  completedAt?: string;
  size?: string;
  downloadUrl?: string;
  scheduledFor?: string;
  config: ReportConfig;
}

export interface ReportConfig {
  projectIds?: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sections: string[];
  format: 'pdf' | 'excel' | 'csv';
  recipients?: string[];
}

// Notification Types
export interface Notification {
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

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    period: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'multiselect' | 'date' | 'number' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// State Management Types
export interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}