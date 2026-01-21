// Utility functions for formatting data

export const formatPercentage = (val: number): string => {
  return (val * 100).toFixed(1) + '%';
};

export const formatNumber = (val: number, decimals: number = 2): string => {
  return val.toFixed(decimals);
};

export const getTeamInitials = (teamName: string): string => {
  return teamName.substring(0, 2).toUpperCase();
};

export const getConfidenceLevel = (probability: number): 'high' | 'medium' | 'low' => {
  if (probability > 0.5) return 'high';
  if (probability > 0.4) return 'medium';
  return 'low';
};

export const getConfidenceColor = (probability: number): string => {
  if (probability > 0.5) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
  if (probability > 0.4) return 'bg-gradient-to-r from-amber-400 to-amber-500';
  return 'bg-gradient-to-r from-rose-400 to-rose-500';
};
