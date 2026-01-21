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

  console.log(`Fetching odds for Home: ${homeTeamId}, Away: ${awayTeamId}`);

  try {
    // First, try to find an upcoming fixture between these teams
    const upcomingResponse = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/between/${homeTeamId}/${awayTeamId}?api_token=${apiKey}&include=odds`
    );

    if (upcomingResponse.ok) {
      const upcomingData = await upcomingResponse.json();
      console.log('Upcoming fixtures response:', JSON.stringify(upcomingData, null, 2));
      
      if (upcomingData.data && upcomingData.data.length > 0) {
        for (const fixture of upcomingData.data) {
          if (fixture.odds && fixture.odds.length > 0) {
            console.log('Found odds in upcoming fixture:', fixture.odds);
            
            for (const oddsSet of fixture.odds) {
              if (oddsSet.bookmaker && oddsSet.values) {
                const homeOdds = oddsSet.values.find((v: any) => 
                  v.value === 'Home' || v.value === '1' || v.label === '1'
                );
                const drawOdds = oddsSet.values.find((v: any) => 
                  v.value === 'Draw' || v.value === 'X' || v.label === 'X'
                );
                const awayOdds = oddsSet.values.find((v: any) => 
                  v.value === 'Away' || v.value === '2' || v.label === '2'
                );

                if (homeOdds && drawOdds && awayOdds) {
                  const odds = {
                    home: parseFloat(homeOdds.odd || homeOdds.value) || 2.0,
                    draw: parseFloat(drawOdds.odd || drawOdds.value) || 3.0,
                    away: parseFloat(awayOdds.odd || awayOdds.value) || 4.0
                  };
                  console.log('Successfully parsed odds:', odds);
                  return NextResponse.json({ data: [odds] });
                }
              }
            }
          }
        }
      }
    }

    // Try head-to-head as fallback
    const h2hResponse = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/head-to-head/${homeTeamId}/${awayTeamId}?api_token=${apiKey}&include=odds`
    );

    if (h2hResponse.ok) {
      const h2hData = await h2hResponse.json();
      console.log('Head-to-head response:', JSON.stringify(h2hData, null, 2));
      
      if (h2hData.data && h2hData.data.length > 0) {
        for (const fixture of h2hData.data) {
          if (fixture.odds && fixture.odds.length > 0) {
            console.log('Found odds in h2h fixture:', fixture.odds);
            
            for (const oddsSet of fixture.odds) {
              if (oddsSet.bookmaker && oddsSet.values) {
                const homeOdds = oddsSet.values.find((v: any) => 
                  v.value === 'Home' || v.value === '1' || v.label === '1'
                );
                const drawOdds = oddsSet.values.find((v: any) => 
                  v.value === 'Draw' || v.value === 'X' || v.label === 'X'
                );
                const awayOdds = oddsSet.values.find((v: any) => 
                  v.value === 'Away' || v.value === '2' || v.label === '2'
                );

                if (homeOdds && drawOdds && awayOdds) {
                  const odds = {
                    home: parseFloat(homeOdds.odd || homeOdds.value) || 2.0,
                    draw: parseFloat(drawOdds.odd || drawOdds.value) || 3.0,
                    away: parseFloat(awayOdds.odd || awayOdds.value) || 4.0
                  };
                  console.log('Successfully parsed odds from h2h:', odds);
                  return NextResponse.json({ data: [odds] });
                }
              }
            }
          }
        }
      }
    }

    console.log('No odds found, using default values');
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
