import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const homeTeamId = searchParams.get('homeTeamId');
  const awayTeamId = searchParams.get('awayTeamId');
  const apiKey = process.env.SPORTSMONK_API_KEY || process.env.NEXT_PUBLIC_SPORTSMONK_API_KEY;

  if (!homeTeamId || !awayTeamId) {
    return NextResponse.json(
      { error: 'Missing team IDs' },
      { status: 400 }
    );
  }

  try {
    // Get head-to-head fixtures to find a fixture between these teams
    const h2hResponse = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/head-to-head/${homeTeamId}/${awayTeamId}?api_token=${apiKey}&include=odds`
    );

    if (!h2hResponse.ok) {
      console.log('No head-to-head data available');
      return NextResponse.json({ data: null });
    }

    const h2hData = await h2hResponse.json();

    // Check if we have fixtures with odds
    if (h2hData.data && h2hData.data.length > 0) {
      // Try to find a fixture with odds
      for (const fixture of h2hData.data) {
        if (fixture.odds && fixture.odds.length > 0) {
          // Find the 1X2 market odds
          for (const oddsSet of fixture.odds) {
            if (oddsSet.bookmaker && oddsSet.bookmaker.name) {
              // Look for values in the odds
              const homeOdds = oddsSet.values?.find((v: any) => v.value === 'Home' || v.value === '1');
              const drawOdds = oddsSet.values?.find((v: any) => v.value === 'Draw' || v.value === 'X');
              const awayOdds = oddsSet.values?.find((v: any) => v.value === 'Away' || v.value === '2');

              if (homeOdds && drawOdds && awayOdds) {
                return NextResponse.json({
                  data: [{
                    home: parseFloat(homeOdds.odd) || 2.0,
                    draw: parseFloat(drawOdds.odd) || 3.0,
                    away: parseFloat(awayOdds.odd) || 4.0
                  }]
                });
              }
            }
          }
        }
      }
    }

    // If no odds found, return default odds
    return NextResponse.json({ 
      data: [{
        home: 2.0,
        draw: 3.0,
        away: 4.0
      }]
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    // Return default odds on error
    return NextResponse.json({ 
      data: [{
        home: 2.0,
        draw: 3.0,
        away: 4.0
      }]
    });
  }
}
