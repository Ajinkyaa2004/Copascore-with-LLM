import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ leagueId: string }> }
) {
  const params = await context.params;
  const leagueId = params.leagueId;
  const apiKey = process.env.SPORTSMONK_API_KEY || process.env.NEXT_PUBLIC_SPORTSMONK_API_KEY;

  if (!leagueId) {
    return NextResponse.json({ error: 'League ID is required' }, { status: 400 });
  }

  try {
    // 1. Get the league details to find the current season
    const leagueResponse = await fetch(
      `https://api.sportmonks.com/v3/football/leagues/${leagueId}?api_token=${apiKey}&include=currentSeason`
    );

    if (!leagueResponse.ok) {
      throw new Error(`SportsMonk League API error: ${leagueResponse.status}`);
    }

    const leagueData = await leagueResponse.json();
    let currentSeason = leagueData.data?.currentseason;

    // Fallback logic for leagues with missing current season (e.g. Play-offs)
    if (!currentSeason) {
      console.warn(`No current season found for league ${leagueId}. Checking fallbacks.`);

      const FALLBACK_LEAGUE_MAP: Record<string, string> = {
        '1659': '271', // Denmark Play-offs -> Denmark Superliga
        '513': '501',  // Scotland Play-offs -> Scotland Premiership (Safety)
      };

      const fallbackLeagueId = FALLBACK_LEAGUE_MAP[leagueId];

      if (fallbackLeagueId) {
        console.log(`Using fallback league ${fallbackLeagueId} for ${leagueId}`);
        const fallbackResponse = await fetch(
          `https://api.sportmonks.com/v3/football/leagues/${fallbackLeagueId}?api_token=${apiKey}&include=currentSeason`
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          currentSeason = fallbackData.data?.currentseason;
        }
      }
    }

    if (!currentSeason) {
      console.warn(`No active season found for league ${leagueId} or its fallback.`);
      return NextResponse.json({ data: [] });
    }

    const seasonId = currentSeason.id;

    // 2. Fetch teams for this season
    const teamsResponse = await fetch(
      `https://api.sportmonks.com/v3/football/teams/seasons/${seasonId}?api_token=${apiKey}`
    );

    if (!teamsResponse.ok) {
      throw new Error(`SportsMonk Teams API error: ${teamsResponse.status}`);
    }

    const teamsData = await teamsResponse.json();

    return NextResponse.json(teamsData);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
