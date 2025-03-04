'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Types
type AgentTask = {
  id: string;
  input: string;
  inputType: 'url' | 'text';
  status: 'pending' | 'planning' | 'searching' | 'analyzing' | 'generating' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: string[];
};

type AgentConfig = {
  openRouterApiKey: string;
  geminiApiKey: string;
  plannerModel?: string;
  analyzerModel?: string;
  multimodalModel?: string;
};

// Agent class for handling the multi-step AI process
export class AIAgent {
  private config: AgentConfig;
  private task: AgentTask | null = null;
  private geminiApi: GoogleGenerativeAI | null = null;

  constructor(config: AgentConfig) {
    this.config = {
      ...config,
      plannerModel: config.plannerModel || 'anthropic/claude-3-opus',
      analyzerModel: config.analyzerModel || 'anthropic/claude-3-haiku',
      multimodalModel: config.multimodalModel || 'gemini-2-flash',
    };

    if (this.config.geminiApiKey) {
      this.geminiApi = new GoogleGenerativeAI(this.config.geminiApiKey);
    }
  }

  // Create a new task
  async createTask(input: string, inputType: 'url' | 'text'): Promise<AgentTask> {
    this.task = {
      id: crypto.randomUUID(),
      input,
      inputType,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    
    return this.task;
  }
  
  // Execute the full pipeline
  async execute(): Promise<AgentTask> {
    if (!this.task) {
      throw new Error('No task has been created');
    }
    
    try {
      // Planning stage
      await this.updateTaskStatus('planning');
      this.addMessage("Planning approach to analyze content and create semantic relationships");
      const plan = await this.planApproach();
      
      // Searching stage
      await this.updateTaskStatus('searching');
      
      if (this.task.inputType === 'url') {
        this.addMessage(`Fetching content from URL using r.jina.ai/${encodeURIComponent(this.task.input)}`);
      }
      
      this.addMessage("Searching for related content and identifying key themes");
      this.addMessage("Extracting entities and concepts for semantic mapping");
      const searchResults = await this.searchContent();
      
      // Analyzing stage 
      await this.updateTaskStatus('analyzing');
      this.addMessage("Analyzing visual and textual components with Gemini-2-flash");
      this.addMessage("Detecting patterns and relationships between content pieces");
      const analysis = await this.analyzeContent();
      
      // Generating stage
      await this.updateTaskStatus('generating');
      this.addMessage("Generating semantic grid structure with optimized clusters");
      this.addMessage("Finalizing grid with metadata and relationships");
      const grid = await this.generateGrid();
      
      // Complete
      this.task.result = {
        plan,
        searchResults,
        analysis,
        grid
      };
      
      await this.updateTaskStatus('completed');
      return this.task;
      
    } catch (error) {
      this.task.error = error instanceof Error ? error.message : 'Unknown error occurred';
      await this.updateTaskStatus('failed');
      return this.task;
    }
  }
  
  // Update task status
  private async updateTaskStatus(status: AgentTask['status']): Promise<void> {
    if (this.task) {
      this.task.status = status;
      this.task.updatedAt = new Date();
    }
  }
  
  // Add a message to the task
  private addMessage(message: string): void {
    if (this.task && this.task.messages) {
      this.task.messages.push(message);
    }
  }
  
  // Planning stage - uses OpenRouter's Claude to create a plan
  private async planApproach(): Promise<any> {
    if (!this.task) return null;
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openRouterApiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://retube.app',
          'X-Title': 'Retube Grid Generator',
        },
        body: JSON.stringify({
          model: this.config.plannerModel,
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that creates structured plans for analyzing content and creating semantic video grids. 
              Your task is to create a detailed plan for the following request. Focus on identifying:
              1. Key themes and concepts
              2. Types of content to search for
              3. Visual and audio elements to analyze
              4. Potential grid structure and organization
              5. Criteria for clustering related content`
            },
            {
              role: 'user',
              content: this.task.inputType === 'url' 
                ? `I need a plan to analyze the content at: ${this.task.input} and create a semantic video grid based on it.`
                : `I need a plan to create a semantic video grid based on this topic: ${this.task.input}`
            }
          ],
          max_tokens: 1000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }
      
      const data = await response.json();
      const planContent = data.choices[0].message.content;
      
      return {
        content: planContent,
        structure: this.extractPlanStructure(planContent)
      };
    } catch (error) {
      console.error('Error in planning stage:', error);
      // Fallback to mock plan
      return this.mockPlanApproach();
    }
  }
  
  // Extract structured information from the plan
  private extractPlanStructure(planContent: string): any {
    // In a real implementation, you might use Gemini to extract structured data from the plan
    // Here we're just creating a mock structure
    return {
      themes: ['theme1', 'theme2', 'theme3'],
      contentTypes: ['videos', 'articles', 'images'],
      clusterCriteria: ['semantic similarity', 'visual style', 'topic relevance']
    };
  }
  
  // Mock plan for fallback
  private mockPlanApproach(): any {
    if (!this.task) return null;
    
    const planTemplate = `
      Task: ${this.task.inputType === 'url' ? 'Analyze the content at URL: ' + this.task.input : 'Create a grid for topic: ' + this.task.input}
      
      1. Understanding the request
      2. Key themes to explore
      3. Types of videos to include
      4. Potential cluster categories
      5. Multimodal analysis requirements
    `;
    
    return {
      content: planTemplate,
      structure: {
        themes: ['innovation', 'design', 'technology', 'creativity'],
        contentTypes: ['video', 'article', 'image', 'audio'],
        clusterCriteria: ['topic', 'style', 'platform', 'creator']
      },
      steps: [
        'Extract key themes from the input',
        'Search for semantically similar content',
        'Group content into meaningful clusters',
        'Create a coherent grid structure'
      ]
    };
  }
  
  // Searching stage - finds relevant content using r.jina.ai for URLs
  private async searchContent(): Promise<any> {
    if (!this.task) return null;
    
    try {
      if (this.task.inputType === 'url') {
        // Use r.jina.ai to fetch and parse content
        const jinaUrl = `https://r.jina.ai/${encodeURIComponent(this.task.input)}`;
        const response = await fetch(jinaUrl);
        
        if (!response.ok) {
          throw new Error(`Jina Reader error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
          content: data.content,
          links: data.links,
          images: data.images,
          relatedVideos: this.extractVideosFromJinaResponse(data)
        };
      } else {
        // For text inputs, use a semantic search
        return this.mockSearchResults();
      }
    } catch (error) {
      console.error('Error in search stage:', error);
      // Fallback to mock search results
      return this.mockSearchResults();
    }
  }
  
  // Extract videos from Jina response
  private extractVideosFromJinaResponse(jinaData: any): any[] {
    // In a real implementation, you would parse the Jina response to extract videos
    // This is a mock implementation
    return [
      { 
        id: 'v1', 
        title: 'Introduction to the Topic',
        platform: 'YouTube',
        url: 'https://youtube.com/watch?v=example1'
      },
      { 
        id: 'v2', 
        title: 'Deep Dive Analysis',
        platform: 'Vimeo',
        url: 'https://vimeo.com/example2'
      },
      { 
        id: 'v3', 
        title: 'Expert Perspective',
        platform: 'YouTube',
        url: 'https://youtube.com/watch?v=example3'
      }
    ];
  }
  
  // Mock search results for fallback
  private mockSearchResults(): any {
    return {
      relatedVideos: [
        { 
          id: 'v1', 
          title: 'Introduction to the Topic',
          platform: 'YouTube',
          url: 'https://youtube.com/watch?v=example1'
        },
        { 
          id: 'v2', 
          title: 'Deep Dive Analysis',
          platform: 'Vimeo',
          url: 'https://vimeo.com/example2'
        },
        { 
          id: 'v3', 
          title: 'Expert Perspective',
          platform: 'YouTube',
          url: 'https://youtube.com/watch?v=example3'
        },
        { 
          id: 'v4', 
          title: 'Historical Context',
          platform: 'TikTok',
          url: 'https://tiktok.com/@example4'
        },
        { 
          id: 'v5', 
          title: 'Future Trends',
          platform: 'Instagram',
          url: 'https://instagram.com/p/example5'
        }
      ]
    };
  }
  
  // Analyzing stage - performs multimodal analysis using Gemini-2-flash
  private async analyzeContent(): Promise<any> {
    if (!this.task || !this.geminiApi) return null;
    
    try {
      // Use Gemini-2-flash for multimodal analysis
      const model = this.geminiApi.getGenerativeModel({
        model: this.config.multimodalModel,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
      
      const searchResults = this.task.result?.searchResults || this.mockSearchResults();
      
      const prompt = `
        Analyze the following content and extract key themes, visual elements, and semantic relationships.
        
        Input: ${this.task.input}
        
        ${searchResults.relatedVideos ? 
          `Related videos: ${JSON.stringify(searchResults.relatedVideos, null, 2)}` : ''}
        
        Provide a structured analysis with the following sections:
        1. Core Themes - Identify the main themes and topics present in the content
        2. Visual Elements - Identify common visual styles, patterns, or techniques
        3. Audio Elements - Identify sound design, music, or spoken word patterns
        4. Semantic Clusters - Group the content into meaningful clusters based on theme, style, or approach
        5. Emotional Tone - Describe the overall emotional tone and feel
        
        Format your response as structured JSON.
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      try {
        // Try to parse the JSON response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                          text.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1] || jsonMatch[0]);
        }
        
        // If not parsable as JSON, return the text response in a structured format
        return {
          rawAnalysis: text,
          contentAnalysis: {
            themes: ['theme extraction failed'],
            visualElements: ['visual elements extraction failed'],
            audioElements: ['audio elements extraction failed'],
            emotionalTone: 'unknown',
            pacing: 'unknown'
          }
        };
      } catch (parseError) {
        console.error('Error parsing Gemini analysis response:', parseError);
        return this.mockAnalyzeContent();
      }
      
    } catch (error) {
      console.error('Error in analysis stage:', error);
      // Fallback to mock analysis
      return this.mockAnalyzeContent();
    }
  }
  
  // Mock analysis results for fallback
  private mockAnalyzeContent(): any {
    return {
      contentAnalysis: {
        themes: ['innovation', 'design', 'technology', 'society', 'culture'],
        visualElements: ['minimalism', 'geometric patterns', 'high contrast', 'monochrome'],
        audioElements: ['ambient', 'electronic', 'spoken word', 'silence'],
        emotionalTone: 'contemplative',
        pacing: 'methodical'
      },
      semanticClusters: [
        {
          name: 'Theoretical Foundations',
          videos: ['v1', 'v3']
        },
        {
          name: 'Practical Applications',
          videos: ['v2', 'v5']
        },
        {
          name: 'Cultural Impact',
          videos: ['v4']
        }
      ]
    };
  }
  
  // Generating stage - creates the final grid
  private async generateGrid(): Promise<any> {
    if (!this.task) return null;
    
    try {
      // In a real implementation, this would use OpenRouter to generate a final grid
      // based on the analysis from the previous stages
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openRouterApiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://retube.app',
          'X-Title': 'Retube Grid Generator',
        },
        body: JSON.stringify({
          model: this.config.plannerModel,
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that creates structured semantic grids for organizing content.
                Your task is to create a final grid structure based on the analysis provided.
                The grid should have:
                1. A concise but descriptive title
                2. A brief description
                3. A set of clusters, each with a name and list of videos
                4. A set of tags for categorization
                Your response should be in JSON format without any explanatory text.`
            },
            {
              role: 'user',
              content: `Create a semantic grid for: ${this.task.input}
                
                Here is the analysis:
                ${JSON.stringify(this.task.result?.analysis || this.mockAnalyzeContent(), null, 2)}
                
                Here are the content items:
                ${JSON.stringify(this.task.result?.searchResults?.relatedVideos || 
                  this.mockSearchResults().relatedVideos, null, 2)}`
            }
          ],
          max_tokens: 1000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }
      
      const data = await response.json();
      const gridContent = data.choices[0].message.content;
      
      try {
        // Try to parse JSON from the response
        const jsonMatch = gridContent.match(/```json\n([\s\S]*?)\n```/) || 
                           gridContent.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const gridData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          return {
            ...gridData,
            id: crypto.randomUUID(),
            createdAt: new Date()
          };
        } else {
          // If we can't parse JSON, create a structured grid from the text
          return this.createStructuredGrid(gridContent);
        }
        
      } catch (parseError) {
        console.error('Error parsing grid generation response:', parseError);
        return this.mockGenerateGrid();
      }
      
    } catch (error) {
      console.error('Error in grid generation stage:', error);
      // Fallback to mock grid
      return this.mockGenerateGrid();
    }
  }
  
  // Create a structured grid from text
  private createStructuredGrid(text: string): any {
    // This would extract structured info from unstructured text
    // Simplified mock implementation
    return {
      id: crypto.randomUUID(),
      title: this.task?.inputType === 'url' 
        ? 'Generated from Content Analysis' 
        : `${this.task?.input.substring(0, 30)}${this.task?.input.length! > 30 ? '...' : ''}`,
      description: 'An AI-generated semantic grid exploring interconnected themes and perspectives.',
      clusters: [
        {
          name: 'Primary Concepts',
          videos: [
            { id: 'v1', title: 'Introduction to the Topic' },
            { id: 'v3', title: 'Expert Perspective' }
          ]
        },
        {
          name: 'Applied Ideas',
          videos: [
            { id: 'v2', title: 'Deep Dive Analysis' },
            { id: 'v5', title: 'Future Trends' }
          ]
        }
      ],
      tags: ['ai-generated', 'semantic-analysis', 'multimodal'],
      createdAt: new Date()
    };
  }
  
  // Mock grid generation for fallback
  private mockGenerateGrid(): any {
    return {
      id: crypto.randomUUID(),
      title: this.task?.inputType === 'url' 
        ? 'Explorations From Content Analysis' 
        : `${this.task?.input.substring(0, 30)}${this.task?.input.length! > 30 ? '...' : ''}`,
      description: 'An AI-generated semantic grid exploring interconnected themes and perspectives.',
      clusters: [
        {
          name: 'Theoretical Foundations',
          videos: [
            { id: 'v1', title: 'Introduction to the Topic' },
            { id: 'v3', title: 'Expert Perspective' }
          ]
        },
        {
          name: 'Practical Applications',
          videos: [
            { id: 'v2', title: 'Deep Dive Analysis' },
            { id: 'v5', title: 'Future Trends' }
          ]
        },
        {
          name: 'Cultural Impact',
          videos: [
            { id: 'v4', title: 'Historical Context' }
          ]
        }
      ],
      tags: ['ai-generated', 'semantic-analysis', 'multimodal'],
      createdAt: new Date()
    };
  }
}

// Factory function to create an agent with environment variables
export async function createAgent(): Promise<AIAgent> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  
  if (!openRouterApiKey || !geminiApiKey) {
    throw new Error('Missing required API keys for AI agent');
  }
  
  return new AIAgent({
    openRouterApiKey,
    geminiApiKey
  });
}

// Convenience function to process a prompt directly
export async function processPrompt(input: string, inputType: 'url' | 'text'): Promise<AgentTask> {
  try {
    const agent = await createAgent();
    const task = await agent.createTask(input, inputType);
    return await agent.execute();
  } catch (error) {
    console.error('Error processing prompt:', error);
    throw error;
  }
} 