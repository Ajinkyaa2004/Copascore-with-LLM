// Type definitions for the application

export interface Team {
  name: string;
  code: string;
}

export interface MatchPrediction {
  prediction: 'Home Win' | 'Draw' | 'Away Win';
  home_win_probability: number;
  draw_probability: number;
  away_win_probability: number;
  confidence: number;
  reasoning: string;
  home_team?: string;
  away_team?: string;
}

export interface TeamStats {
  win_rate: number;
  goals_scored_per_match: number;
  shots_per_match: number;
  corners_per_match: number;
  cards_per_match: number;
}

export interface MatchStats {
  home_stats: TeamStats;
  away_stats: TeamStats;
}

export interface TeamForm {
  form_string: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}

export interface TableRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goal_diff?: number;
  // Legacy support if needed
  Team?: string;
  P?: number;
  W?: number;
  D?: number;
  L?: number;
  Pts?: number;
}

export interface PlayerCard {
  name: string;
  nationality: string;
  age: number;
  number: number;
  position: string;
  radar: Record<string, number>;
  detailed: Record<string, number>;
}

export type ViewType = 'predictions' | 'hub' | 'play' | 'scores' | 'highlights' | 'chat' | 'players';
