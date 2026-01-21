import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const groqApiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!groqApiKey) {
        return NextResponse.json(
            { error: 'GROQ API key not configured' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Call GROQ API for chat completion
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert football analyst with deep knowledge of tactics, player statistics, and betting strategies. 
Provide detailed, insightful analysis that covers:
- Tactical formations and playing styles
- Key player matchups and individual strengths/weaknesses
- Historical performance and recent form
- Statistical analysis and trends
- Betting insights based on probabilities and value
- Match context (injuries, suspensions, motivation, etc.)

Always be specific, data-driven, and provide actionable insights. Format your responses with clear sections and use bold text for emphasis where appropriate.`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.8,
                max_tokens: 1500,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('GROQ API error:', response.status, errorData);
            throw new Error(`GROQ API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content;

        if (!aiResponse) {
            throw new Error('No response from AI');
        }

        return NextResponse.json({
            response: aiResponse
        });

    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate response',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
