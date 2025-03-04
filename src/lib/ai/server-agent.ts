'use server';

import { processPrompt as clientProcessPrompt } from './agent';

// Re-export the processPrompt function for server components
export async function processPrompt(input: string, inputType: 'url' | 'text') {
  return clientProcessPrompt(input, inputType);
}

// Export server status check function
export async function getAgentStatus() {
  return {
    status: 'available',
    models: {
      planner: 'anthropic/claude-3-opus',
      analyzer: 'anthropic/claude-3-haiku',
      multimodal: 'gemini-2-flash'
    }
  };
} 