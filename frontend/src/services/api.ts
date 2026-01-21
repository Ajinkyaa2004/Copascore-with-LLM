// API service for SportsMonk and GROQ integration
import axios from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MatchPrediction, TableRow, PlayerCard } from '@/types';

// GROQ API configuration
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

// Available leagues in free plan
export const AVAILABLE_LEAGUES = [
  { id: 271, name: 'Denmark Superliga', country: 'Denmark' },
  { id: 1659, name: 'Denmark Superliga Play-offs', country: 'Denmark' },
  { id: 501, name: 'Scotland Premiership', country: 'Scotland' },
  { id: 513, name: 'Scotland Premiership Play-offs', country: 'Scotland' },
];

export interface League {
  id: number;
  name: string;
  country: string;
}

export interface Team {
  id: number;
  name: string;
  short_code?: string;
  image_path?: string;
}

export interface Odds {
  home: number;
  draw: number;
  away: number;
}

export interface StandingsRow {
  position: number;
  team_name: string;
  points: number;
  won: number;
  draw: number;
  lost: number;
  goal_diff?: number;
  played?: number;
  logo?: string;
}

export interface Fixture {
  id: number;
  name: string;
  start_at: string;
  home_team: { name: string; image_path: string };
  away_team: { name: string; image_path: string };
  venue?: { name: string };
  round?: { name: string };
}

export const api = {
  // Get available leagues
  getLeagues: async (): Promise<League[]> => {
    return AVAILABLE_LEAGUES;
  },

  // Get teams by league (using Next.js API route to avoid CORS)
  getTeamsByLeague: async (leagueId: number): Promise<Team[]> => {
    try {
      const response = await fetch(`/api/teams/${leagueId}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.data.map((team: any) => ({
        id: team.id,
        name: team.name,
        short_code: team.short_code,
        image_path: team.image_path
      }));
    } catch (error) {
      console.error('Error fetching teams by league:', error);
      return [];
    }
  },

  // Get all teams from the default league (Denmark Superliga)
  getTeams: async (): Promise<Team[]> => {
    return api.getTeamsByLeague(271);
  },

  // Get players for a specific team
  getTeamPlayers: async (teamId: number): Promise<PlayerCard[]> => {
    try {
      const response = await fetch(`/api/players/squad/${teamId}`);
      if (!response.ok) return [];
      const data = await response.json();
      if (!data.data) return [];

      return data.data.map((item: any) => {
        const p = item.player;
        return {
          name: p.display_name || p.name,
          nationality: p.nationality_id ? 'Unknown' : 'Unknown',
          age: p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 0,
          number: item.jersey_number || 0,
          position: item.position_id ? 'Player' : 'Player',
          radar: {
            pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 50, physical: 60
          },
          detailed: { goals: 0, assists: 0, appearances: 0 }
        };
      });
    } catch (error) {
      console.error("Error fetching team players:", error);
      return [];
    }
  },

  // Get odds for a potential match between two teams
  getMatchOdds: async (homeTeamId: number, awayTeamId: number): Promise<Odds | null> => {
    try {
      const response = await fetch(`/api/odds?homeTeamId=${homeTeamId}&awayTeamId=${awayTeamId}`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const odds = data.data[0];
        return {
          home: odds.home || 2.0,
          draw: odds.draw || 3.0,
          away: odds.away || 4.0
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching match odds:', error);
      return null;
    }
  },

  // Get league standings
  getStandings: async (leagueId: number): Promise<StandingsRow[]> => {
    try {
      const response = await fetch(`/api/standings/${leagueId}`);
      if (!response.ok) return [];

      const data = await response.json();
      if (!data.data || data.data.length === 0) return [];

      const standingsList = data.data;

      return standingsList.map((item: any) => {
        const won = item.details?.find((d: any) => d.type_id === 129)?.value || 0;
        const draw = item.details?.find((d: any) => d.type_id === 130)?.value || 0;
        const lost = item.details?.find((d: any) => d.type_id === 131)?.value || 0;

        return {
          position: item.position,
          team_name: item.participant?.name || 'Unknown',
          logo: item.participant?.image_path,
          points: item.points,
          won,
          draw,
          lost,
          goal_diff: item.details?.find((d: any) => d.type_id === 134)?.value || 0,
          played: won + draw + lost
        };
      });
    } catch (error) {
      console.error('Error fetching standings:', error);
      return [];
    }
  },

  // Get upcoming fixtures
  getFixtures: async (leagueId: number): Promise<Fixture[]> => {
    try {
      const response = await fetch(`/api/fixtures/${leagueId}`);
      if (!response.ok) return [];

      const data = await response.json();
      if (!data.data) return [];

      return data.data.map((match: any) => ({
        id: match.id,
        name: match.name,
        start_at: match.starting_at,
        home_team: {
          name: match.participants?.find((p: any) => p.meta?.location === 'home')?.name || 'Home',
          image_path: match.participants?.find((p: any) => p.meta?.location === 'home')?.image_path
        },
        away_team: {
          name: match.participants?.find((p: any) => p.meta?.location === 'away')?.name || 'Away',
          image_path: match.participants?.find((p: any) => p.meta?.location === 'away')?.image_path
        },
        venue: match.venue ? { name: match.venue.name } : undefined,
        round: match.round ? { name: match.round.name } : undefined
      })).sort((a: any, b: any) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      return [];
    }
  },

  // Predict match outcome using GROQ LLM
  predictMatch: async (
    leagueName: string,
    homeTeam: string,
    awayTeam: string,
    odds: Odds
  ): Promise<MatchPrediction> => {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leagueName, homeTeam, awayTeam, odds })
      });
      if (!response.ok) throw new Error(`Prediction failed: ${response.status}`);
      return await response.json() as MatchPrediction;
    } catch (error) {
      console.error('Error predicting match:', error);
      throw error;
    }
  },

  // Chat with AI using GROQ
  chatWithAI: async (message: string, context?: string): Promise<string> => {
    try {
      const systemMessage = context
        ? `You are an expert football analyst. Context: ${context}. Provide insightful analysis.`
        : 'You are an expert football analyst. Provide insightful analysis of matches, teams, and players.';

      const response = await axios.post(
        `${GROQ_BASE_URL}/chat/completions`,
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  },

  // Simulate a full season
  simulateSeason: async (): Promise<TableRow[]> => {
    try {
      const teams = await api.getTeamsByLeague(271);
      const teamNames = teams.map(t => t.name).join(', ');

      const prompt = `Simulate a realistic final league table for the Denmark Superliga 2024/2025 season involving these teams: ${teamNames}. 
          Return ONLY a JSON array of objects with the following structure for each team:
          {
            "position": number,
            "team": "Team Name",
            "played": number,
            "won": number,
            "drawn": number,
            "lost": number,
            "points": number,
            "goal_diff": number
          }
          Ensure the math adds up. Sort by position 1 to 12.`;

      const content = await api.chatWithAI(prompt, "You are a football statistician engine.");
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse simulation result");
      }
    } catch (error) {
      console.error('Error simulating season:', error);
      return [
        { position: 1, team: 'FC Copenhagen', played: 32, won: 20, drawn: 6, lost: 6, points: 66 },
        { position: 2, team: 'FC Midtjylland', played: 32, won: 19, drawn: 5, lost: 8, points: 62 },
      ];
    }
  }
};
