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

        // Fallback logic
        if (!currentSeason) {
            const FALLBACK_LEAGUE_MAP: Record<string, string> = {
                '1659': '271', // Denmark Play-offs -> Denmark Superliga
                '513': '501',  // Scotland Play-offs -> Scotland Premiership
            };
            const fallbackLeagueId = FALLBACK_LEAGUE_MAP[leagueId];
            if (fallbackLeagueId) {
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
            return NextResponse.json({ data: [] });
        }

        const seasonId = currentSeason.id;

        // 2. Fetch Standings for this season
        const standingsResponse = await fetch(
            `https://api.sportmonks.com/v3/football/standings/seasons/${seasonId}?api_token=${apiKey}&include=details;participant`
        );

        if (!standingsResponse.ok) {
            // Some leagues might not have standings yet or structure is different
            // Try fallback or just return empty
            return NextResponse.json({ data: [] });
        }

        const standingsData = await standingsResponse.json();

        return NextResponse.json(standingsData);
    } catch (error) {
        console.error('Error fetching standings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch standings' },
            { status: 500 }
        );
    }
}
