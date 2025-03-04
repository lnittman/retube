/**
 * Perplexity API integration for enhanced web search capabilities
 */

type PerplexitySearchOptions = {
  query: string;
  model?: string;
  maxTokens?: number;
  focus?: string[];
  includeAnswer?: boolean;
  includeCitations?: boolean;
};

type PerplexitySearchResponse = {
  answer?: string;
  citations?: {
    text: string;
    url: string;
  }[];
  error?: string;
};

/**
 * Performs a search using the Perplexity API
 */
export async function searchWithPerplexity(options: PerplexitySearchOptions): Promise<PerplexitySearchResponse> {
  const {
    query,
    model = 'sonar-small-online',
    maxTokens = 1000,
    focus = ['videos', 'multimedia', 'content creators'],
    includeAnswer = true,
    includeCitations = true,
  } = options;

  try {
    const response = await fetch('https://api.perplexity.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        model,
        max_tokens: maxTokens,
        focus,
        include_answer: includeAnswer,
        include_citations: includeCitations,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      answer: data.answer,
      citations: data.citations || [],
    };
  } catch (error) {
    console.error('Error in Perplexity search:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred during search',
    };
  }
}

/**
 * Extract video content information from Perplexity search results
 */
export function extractVideoContent(searchResponse: PerplexitySearchResponse): {
  videos: {
    title: string;
    platform: string;
    url: string;
    id: string;
  }[];
  creators: {
    name: string;
    platform: string;
    url?: string;
  }[];
  trends: string[];
} {
  // In a real implementation, we would parse the response to extract structured data
  // This is a simplified mock implementation
  if (!searchResponse.answer) {
    return {
      videos: [],
      creators: [],
      trends: [],
    };
  }

  // Mock data based on the search answer
  const videos = [
    { 
      id: crypto.randomUUID(), 
      title: 'Top Results from Search',
      platform: 'YouTube',
      url: 'https://youtube.com/watch?v=example1'
    },
    { 
      id: crypto.randomUUID(), 
      title: 'Expert Content on Topic',
      platform: 'Vimeo',
      url: 'https://vimeo.com/example2'
    },
    { 
      id: crypto.randomUUID(), 
      title: 'Trending Related Content',
      platform: 'TikTok',
      url: 'https://tiktok.com/@example3'
    }
  ];

  const creators = [
    {
      name: 'Top Creator',
      platform: 'YouTube',
      url: 'https://youtube.com/@creator1'
    },
    {
      name: 'Industry Expert',
      platform: 'Vimeo',
      url: 'https://vimeo.com/creator2'
    }
  ];

  const trends = [
    'First Emerging Trend',
    'Second Popular Topic',
    'Third Related Concept'
  ];

  return {
    videos,
    creators,
    trends
  };
} 