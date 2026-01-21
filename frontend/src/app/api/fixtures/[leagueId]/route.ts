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
        // Check if we need to use a fallback league ID (e.g. searching Play-off fixtures might want main league too?)
        // For now, let's just use the passed leagueId directly.

        // Calculate date range: Today + 14 days
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 14);

        const startDate = today.toISOString().split('T')[0];
        const endDate = futureDate.toISOString().split('T')[0];

        // Fetch fixtures between dates for the specific league
        const fixturesResponse = await fetch(
            `https://api.sportmonks.com/v3/football/fixtures/between/${startDate}/${endDate}?api_token=${apiKey}&leagues=${leagueId}&include=participants;round;venue`
        );

        if (!fixturesResponse.ok) {
            throw new Error(`SportsMonk Fixtures API error: ${fixturesResponse.status}`);
        }

        const fixturesData = await fixturesResponse.json();

        return NextResponse.json(fixturesData);
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        return NextResponse.json(
            { error: 'Failed to fetch fixtures' },
            { status: 500 }
        );
    }
}
