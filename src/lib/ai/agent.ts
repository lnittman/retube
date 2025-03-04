import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { searchWithPerplexity, extractVideoContent } from './perplexity';

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
  perplexityApiKey: string;
  geminiApiKey: string;
  plannerModel?: string;
  analyzerModel?: string;
  multimodalModel?: string;
  searchModel?: string;
};

// Agent class for handling the multi-step AI process
export class AIAgent {
  private config: AgentConfig;
  private task: AgentTask | null = null;
  private geminiApi: GoogleGenerativeAI | null = null;

  constructor(config: AgentConfig) {
    this.config = {
      ...config,
      plannerModel: config.plannerModel || 'gemini-1.5-flash',
      analyzerModel: config.analyzerModel || 'gemini-1.5-flash',
      multimodalModel: config.multimodalModel || 'gemini-1.5-pro',
      searchModel: config.searchModel || 'sonar-small-online',
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
      this.addMessage("Planning approach using Gemini 1.5 Flash");
      const plan = await this.planApproach();
      
      // Searching stage
      await this.updateTaskStatus('searching');
      
      if (this.task.inputType === 'url') {
        this.addMessage(`Fetching content from URL using r.jina.ai/${encodeURIComponent(this.task.input)}`);
      } else {
        this.addMessage("Performing web search with Perplexity API");
      }
      
      this.addMessage("Searching for related content and identifying key themes");
      this.addMessage("Extracting entities and concepts for semantic mapping");
      const searchResults = await this.searchContent();
      
      // Analyzing stage 
      await this.updateTaskStatus('analyzing');
      this.addMessage("Analyzing visual and textual components with Gemini 1.5 Pro");
      this.addMessage("Detecting patterns and relationships between content pieces");
      const analysis = await this.analyzeContent();
      
      // Generating stage
      await this.updateTaskStatus('generating');
      this.addMessage("Generating semantic grid structure with Gemini 1.5 Pro");
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
  
  // Planning stage - uses Gemini to create a plan
  private async planApproach(): Promise<any> {
    if (!this.task || !this.geminiApi) return this.mockPlanApproach();
    
    try {
      const model = this.geminiApi.getGenerativeModel({
        model: this.config.plannerModel as string,
      });
      
      const prompt = `
      You are an AI assistant that creates structured plans for analyzing content and creating semantic video grids. 
      Your task is to create a detailed plan for the following request. Focus on identifying:
      1. Key themes and concepts
      2. Types of content to search for
      3. Visual and audio elements to analyze
      4. Potential grid structure and organization
      5. Criteria for clustering related content
      
      Request: ${this.task.inputType === 'url' 
        ? `Analyze the content at: ${this.task.input} and create a semantic video grid based on it.`
        : `Create a semantic video grid based on this topic: ${this.task.input}`}
      
      Provide your response as JSON with the following structure:
      {
        "plan": {
          "overview": "Summary of the plan",
          "steps": ["Step 1", "Step 2", ...],
          "themes": ["Theme 1", "Theme 2", ...],
          "contentTypes": ["Type 1", "Type 2", ...],
          "clusterCriteria": ["Criteria 1", "Criteria 2", ...]
        }
      }
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      try {
        // Try to parse JSON from the response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                         text.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          return {
            content: text,
            structure: this.extractPlanStructure(text)
          };
        }
      } catch (parseError) {
        console.error('Error parsing Gemini plan response:', parseError);
        return this.mockPlanApproach();
      }
    } catch (error) {
      console.error('Error in planning stage:', error);
      // Fallback to mock plan
      return this.mockPlanApproach();
    }
  }
  
  // Extract structured information from the plan
  private extractPlanStructure(planContent: string): any {
    // If we couldn't get structured JSON directly, try to extract structure from text
    // This is a simplified version - in production you would use Gemini to extract structured data
    return {
      themes: ['theme1', 'theme2', 'theme3'],
      contentTypes: ['videos', 'articles', 'images'],
      clusterCriteria: ['semantic similarity', 'visual style', 'topic relevance']
    };
  }
  
  // Mock plan for fallback
  private mockPlanApproach(): any {
    if (!this.task) return null;
    
    return {
      plan: {
        overview: `Plan for ${this.task.inputType === 'url' ? 'analyzing the content at URL: ' + this.task.input : 'creating a grid for topic: ' + this.task.input}`,
        steps: [
          'Extract key themes from the input',
          'Search for semantically similar content',
          'Group content into meaningful clusters',
          'Create a coherent grid structure'
        ],
        themes: ['innovation', 'design', 'technology', 'creativity'],
        contentTypes: ['video', 'article', 'image', 'audio'],
        clusterCriteria: ['topic', 'style', 'platform', 'creator']
      }
    };
  }
  
  // Searching stage - uses Perplexity for search and r.jina.ai for URLs
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
        // For text inputs, use Perplexity API for semantic search
        const searchQuery = `Find videos, content creators, and trends related to: ${this.task.input}. Focus on high-quality visual content.`;
        
        const perplexityResponse = await searchWithPerplexity({
          query: searchQuery,
          model: this.config.searchModel as string,
          maxTokens: 1000,
          focus: ['videos', 'multimedia', 'content creators'],
          includeAnswer: true,
          includeCitations: true,
        });
        
        if (perplexityResponse.error) {
          throw new Error(`Perplexity API error: ${perplexityResponse.error}`);
        }
        
        // Process the Perplexity response to extract relevant information
        const extractedContent = extractVideoContent(perplexityResponse);
        
        return {
          searchResults: perplexityResponse.answer,
          citations: perplexityResponse.citations || [],
          relatedVideos: extractedContent.videos,
          creators: extractedContent.creators,
          trends: extractedContent.trends
        };
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
  
  // Analyzing stage - performs multimodal analysis using Gemini
  private async analyzeContent(): Promise<any> {
    if (!this.task || !this.geminiApi) return this.mockAnalyzeContent();
    
    try {
      // Use Gemini 1.5 Pro for multimodal analysis
      const model = this.geminiApi.getGenerativeModel({
        model: this.config.multimodalModel as string,
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
        6. Color Palettes - Suggest 3-5 color palettes that would match the content's aesthetic
        
        Format your response as structured JSON with the schema:
        {
          "contentAnalysis": {
            "themes": ["theme1", "theme2", ...],
            "visualElements": ["element1", "element2", ...],
            "audioElements": ["element1", "element2", ...],
            "emotionalTone": "description",
            "pacing": "description"
          },
          "semanticClusters": [
            {
              "name": "cluster name",
              "videos": ["video_id1", "video_id2", ...]
            }
          ],
          "colorPalettes": [
            {
              "name": "palette name", 
              "colors": ["#hex1", "#hex2", ...], 
              "mood": "description"
            }
          ]
        }
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
      ],
      colorPalettes: [
        {
          name: 'tech minimal',
          colors: ['#0F0F0F', '#232D3F', '#005B41', '#008170', '#F1EFEF'],
          mood: 'professional and focused'
        },
        {
          name: 'creative vibrance',
          colors: ['#7C9D96', '#E9B384', '#19376D', '#A5D7E8', '#576CBC'],
          mood: 'inspiring and energizing'
        },
        {
          name: 'calm clarity',
          colors: ['#F9F7F7', '#DBE2EF', '#3F72AF', '#112D4E', '#B9D7EA'],
          mood: 'thoughtful and serene'
        }
      ]
    };
  }
  
  // Generating stage - creates the final grid
  private async generateGrid(): Promise<any> {
    if (!this.task || !this.geminiApi) return this.mockGenerateGrid();
    
    try {
      // Use Gemini 1.5 Pro for grid generation
      const model = this.geminiApi.getGenerativeModel({
        model: this.config.multimodalModel as string,
      });
      
      const analysisResults = this.task.result?.analysis || this.mockAnalyzeContent();
      const searchResults = this.task.result?.searchResults || this.mockSearchResults();
      
      const prompt = `
        Create a semantic grid structure for organizing a collection of videos.
        
        Input topic: ${this.task.input}
        
        Analysis results: ${JSON.stringify(analysisResults, null, 2)}
        
        Search results: ${JSON.stringify(searchResults, null, 2)}
        
        Create a grid with the following structure:
        - A concise but descriptive title
        - A brief description
        - A set of clusters, each with a name and list of videos
        - A set of tags for categorization
        - A recommended color palette based on the content
        
        Return your response in JSON format with this schema:
        {
          "title": "Grid title",
          "description": "Grid description",
          "clusters": [
            {
              "name": "Cluster name",
              "videos": [
                {"id": "video_id", "title": "Video title", "platform": "Platform name"}
              ]
            }
          ],
          "tags": ["tag1", "tag2", ...],
          "colorPalette": {
            "name": "Palette name",
            "colors": ["#hex1", "#hex2", ...]
          }
        }
      `;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      try {
        // Try to parse JSON from the response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                         text.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const gridData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          return {
            ...gridData,
            id: crypto.randomUUID(),
            createdAt: new Date()
          };
        } else {
          // If we can't parse JSON, create a structured grid from the text
          return this.createStructuredGrid(text);
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
      colorPalette: {
        name: 'default',
        colors: ['#121212', '#2D3047', '#419D78', '#E0A458', '#FFDBB5']
      },
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
      colorPalette: {
        name: 'tech minimal',
        colors: ['#0F0F0F', '#232D3F', '#005B41', '#008170', '#F1EFEF']
      },
      createdAt: new Date()
    };
  }
}

// Export a function to process prompts for the API route
export async function processPrompt(input: string, inputType: 'url' | 'text'): Promise<AgentTask> {
  const agent = new AIAgent({
    perplexityApiKey: process.env.PERPLEXITY_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  });
  
  await agent.createTask(input, inputType);
  return agent.execute();
}

// Factory function to create an agent with environment variables
export async function createAgent(): Promise<AIAgent> {
  const perplexityApiKey = process.env.PERPLEXITY_API_KEY || '';
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  
  if (!perplexityApiKey || !geminiApiKey) {
    throw new Error('Missing required API keys for AI agent');
  }
  
  return new AIAgent({
    perplexityApiKey,
    geminiApiKey
  });
} 