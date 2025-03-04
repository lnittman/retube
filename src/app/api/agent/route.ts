import { NextRequest, NextResponse } from 'next/server';
import { processPrompt, getAgentStatus } from '@/lib/ai/server-agent';

export async function POST(req: NextRequest) {
  try {
    const { input, inputType } = await req.json();

    if (!input || !inputType) {
      return NextResponse.json(
        { error: 'Missing required fields: input and inputType' },
        { status: 400 }
      );
    }

    if (inputType !== 'url' && inputType !== 'text') {
      return NextResponse.json(
        { error: 'inputType must be either "url" or "text"' },
        { status: 400 }
      );
    }

    // Process the prompt using the AI agent
    const task = await processPrompt(input, inputType);

    // Return the task data including messages
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error in agent API route:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// GET method to check agent status and available models
export async function GET() {
  const status = await getAgentStatus();
  return NextResponse.json(status);
} 