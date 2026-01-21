import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ teamId: string }> }
) {
    const params = await context.params;
    const teamId = params.teamId;
    const apiKey = process.env.SPORTSMONK_API_KEY || process.env.NEXT_PUBLIC_SPORTSMONK_API_KEY;

    if (!teamId) {
        return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://api.sportmonks.com/v3/football/squads/teams/${teamId}?api_token=${apiKey}&include=player`
        );

        if (!response.ok) {
            // If 429, handle rate limit?
            if (response.status === 429) {
                return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
            }
            throw new Error(`SportsMonk API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching squad:', error);
        return NextResponse.json(
            { error: 'Failed to fetch squad' },
            { status: 500 }
        );
    }
}
