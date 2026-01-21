import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const groqApiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  try {
    const body = await request.json();
    const { leagueName, homeTeam, awayTeam, odds } = body;

    const prompt = `You are an expert football analyst. Analyze this match and provide a detailed prediction.

League: ${leagueName}
Home Team: ${homeTeam}
Away Team: ${awayTeam}
Betting Odds:
- Home Win: ${odds.home}
- Draw: ${odds.draw}
- Away Win: ${odds.away}

Based on the odds and your football knowledge, provide:
1. Predicted outcome (Home Win/Draw/Away Win)
2. Probability percentages for each outcome (must add up to 100%)
3. Confidence level (0-100%)
4. Brief reasoning (2-3 sentences)

Respond ONLY with valid JSON in this exact format:
{
  "prediction": "Home Win" or "Draw" or "Away Win",
  "home_win_probability": <number between 0-100>,
  "draw_probability": <number between 0-100>,
  "away_win_probability": <number between 0-100>,
  "confidence": <number between 0-100>,
  "reasoning": "your analysis here"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse JSON response
    try {
      const parsed = JSON.parse(aiResponse);
      return NextResponse.json({
        prediction: parsed.prediction,
        home_win_probability: parsed.home_win_probability,
        draw_probability: parsed.draw_probability,
        away_win_probability: parsed.away_win_probability,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning,
        home_team: homeTeam,
        away_team: awayTeam
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        prediction: 'Home Win',
        home_win_probability: 45,
        draw_probability: 30,
        away_win_probability: 25,
        confidence: 70,
        reasoning: aiResponse,
        home_team: homeTeam,
        away_team: awayTeam
      });
    }
  } catch (error) {
    console.error('Error in prediction:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}
