// Utility functions to handle Material-UI color prop types

export type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

export const getValidChipColor = (color: string): ChipColor => {
  const validColors: ChipColor[] = ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'];
  return validColors.includes(color as ChipColor) ? (color as ChipColor) : 'default';
};

export const getStatusColor = (status: string): ChipColor => {
  switch (status) {
    case 'completed': return 'success';
    case 'generating': return 'warning';
    case 'scheduled': return 'info';
    case 'failed': return 'error';
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'default';
    default: return 'default';
  }
};

export const getPriorityColor = (priority: string): ChipColor => {
  switch (priority) {
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'default';
    default: return 'default';
  }
};

export const getRelevanceColor = (score: number): ChipColor => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'default';
};