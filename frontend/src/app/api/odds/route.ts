import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const homeTeamId = searchParams.get('homeTeamId');
  const awayTeamId = searchParams.get('awayTeamId');
  const apiKey = process.env.SPORTSMONK_API_KEY || process.env.NEXT_PUBLIC_SPORTSMONK_API_KEY;

  if (!homeTeamId || !awayTeamId) {
    return NextResponse.json({ error: 'Missing team IDs' }, { status: 400 });
  }

  let debugLog: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    debugLog.push(msg);
  };

  log(`Fetching odds for Home: ${homeTeamId}, Away: ${awayTeamId}`);

  try {
    // 1. Fetch head-to-head fixtures with odds included as backup
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/head-to-head/${homeTeamId}/${awayTeamId}?api_token=${apiKey}&include=state;odds`
    );

    if (!response.ok) {
      log(`SportsMonk Fixture API error: ${response.status}`);
      return NextResponse.json({ data: [], debug: debugLog });
    }

    const data = await response.json();
    let bestMatch: any = null;

    if (data.data && data.data.length > 0) {
      log(`Found ${data.data.length} head-to-head fixtures.`);

      const fixtures = data.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter for upcoming or today
      const upcoming = fixtures.filter((f: any) => {
        const d = new Date(f.starting_at);
        const state = f.state?.state_code || f.state?.short_code;
        return d >= today || state === 'NS';
      });

      if (upcoming.length > 0) {
        // Sort upcoming by date ascending (soonest first)
        upcoming.sort((a: any, b: any) => new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime());
        bestMatch = upcoming[0];
        log(`Found UPCOMING match: ${bestMatch.name} (ID: ${bestMatch.id}) at ${bestMatch.starting_at}`);
      } else {
        log("No upcoming matches found. Checking recent past...");
        // Sort all by date descending (newest first)
        fixtures.sort((a: any, b: any) => new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime());
        bestMatch = fixtures[0];
        log(`Found RECENT match: ${bestMatch.name} (ID: ${bestMatch.id}) at ${bestMatch.starting_at}`);
      }
    } else {
      log("No head-to-head data returned from API.");
      return NextResponse.json({ data: [], debug: debugLog });
    }

    if (!bestMatch) {
      log("Could not identify a valid match fixture.");
      return NextResponse.json({ data: [], debug: debugLog });
    }

    // Helper to parse bookmaker data (handles both flat list and nested structures)
    const parseOddsFromBookmakers = (items: any[]) => {
      // Group by bookmaker_id to ensure we match odds from the same provider
      const byBookmaker: Record<string, any[]> = {};

      for (const item of items) {
        // Case A: Item is a Bookmaker object with nested odds/values (Legacy or specific include)
        if (item.values || item.odds) {
          const nested = item.values || item.odds;
          if (Array.isArray(nested)) {
            // Assume item.id is the bookmaker id if available
            const bkId = item.id || 'unknown';
            if (!byBookmaker[bkId]) byBookmaker[bkId] = [];
            byBookmaker[bkId].push(...nested);
          }
        }
        // Case B: Item is a flat Odd object (V3 standard for /markets endpoint)
        else if (item.bookmaker_id || item.label) {
          // If no bookmaker_id, group under 'generic' (though dangerous for mixed sources, better than nothing)
          const bkId = item.bookmaker_id || 'generic';
          if (!byBookmaker[bkId]) byBookmaker[bkId] = [];
          byBookmaker[bkId].push(item);
        }
      }

      // Iterate over each bookmaker's collection of odds
      for (const bkId in byBookmaker) {
        const odds = byBookmaker[bkId];

        // Find 1x2 values
        // Note: Check both 'value' and 'label' for "1", "X", "2", "Home", "Draw", "Away"
        const home = odds.find((v: any) => ['Home', '1'].includes(v.value) || ['Home', '1'].includes(v.label));
        const draw = odds.find((v: any) => ['Draw', 'X'].includes(v.value) || ['Draw', 'X'].includes(v.label));
        const away = odds.find((v: any) => ['Away', '2'].includes(v.value) || ['Away', '2'].includes(v.label));

        if (home && draw && away) {
          const getVal = (o: any) => {
            // value might be the label, odd is the number? 
            // In V3: 'value' is often the decimal odd (e.g. "2.25"), 'label' is "1".
            // Sometimes 'odd' property exists.
            // We try parsing value first, if it looks like a number.
            let val = o.value;
            if (!val || isNaN(parseFloat(val)) || ['Home', 'Draw', 'Away', '1', 'X', '2'].includes(val)) {
              val = o.odd;
            }
            // If value was surprisingly the label, and no 'odd' key, we might be stuck.
            // But usually item.value is the decimal string in V3 flat odds.
            return parseFloat(val);
          };

          const hVal = getVal(home);
          const dVal = getVal(draw);
          const aVal = getVal(away);

          if (!isNaN(hVal) && !isNaN(dVal) && !isNaN(aVal)) {
            return {
              home: Number(hVal.toFixed(2)),
              draw: Number(dVal.toFixed(2)),
              away: Number(aVal.toFixed(2))
            };
          }
        }
      }
      return null;
    };

    // 2. Try User's Preferred Endpoint: /odds/pre-match/fixtures/{id}/markets/1
    const oddsUrl = `https://api.sportmonks.com/v3/football/odds/pre-match/fixtures/${bestMatch.id}/markets/1?api_token=${apiKey}`;
    log(`Attempting specific odds endpoint: ${oddsUrl}`);

    try {
      const oddsResponse = await fetch(oddsUrl);
      if (oddsResponse.ok) {
        const oddsData = await oddsResponse.json();
        if (oddsData.data && oddsData.data.length > 0) {
          log(`Specific endpoint returned ${oddsData.data.length} entries.`);
          // Log structure for debug
          log(`Sample keys: ${Object.keys(oddsData.data[0]).join(', ')}`);

          const parsed = parseOddsFromBookmakers(oddsData.data);
          if (parsed) {
            log(`Successfully parsed odds from specific endpoint: ${JSON.stringify(parsed)}`);
            return NextResponse.json({ data: [parsed], debug: debugLog });
          } else {
            log("Could not validly parse 1x2 odds from specific endpoint data.");
          }
        } else {
          log("Specific endpoint returned empty data.");
        }
      } else {
        log(`Specific endpoint failed with status: ${oddsResponse.status}`);
      }
    } catch (e: any) {
      log(`Error calling specific endpoint: ${e.message}`);
    }

    // 3. Fallback: Check included odds in the H2H fixture
    log("Falling back to included odds from H2H response...");
    if (bestMatch.odds && bestMatch.odds.length > 0) {
      // Filter for market 1
      const market1Odds = bestMatch.odds.filter((o: any) => o.market_id === 1 || o.label === 'Match Winner' || o.label === '3Way Result');
      log(`Found ${market1Odds.length} potential Match Winner sets in fallback data.`);

      const parsed = parseOddsFromBookmakers(market1Odds);
      if (parsed) {
        log(`Successfully parsed odds from fallback: ${JSON.stringify(parsed)}`);
        return NextResponse.json({ data: [parsed], debug: debugLog });
      }
    } else {
      log("No included odds found in fallback data.");
    }

    log("Failed to find any valid odds.");
    return NextResponse.json({ data: [], debug: debugLog });

  } catch (error: any) {
    log(`Critical Error: ${error.message}`);
    return NextResponse.json({
      error: 'Failed to fetch odds',
      data: [],
      debug: debugLog
    }, { status: 500 });
  }
}
