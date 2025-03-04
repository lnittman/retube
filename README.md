# Retube

Retube is an AI-native single page application that reimagines video discovery and sharing through semantic clustering. The application provides a minimalist, intuitive interface organized around 'grids' - semantically grouped clusters of videos.

## Features

- **Semantic Video Clustering**: Groups videos based on AI-derived attributes
- **Multimodal Content Understanding**: Uses Gemini API for comprehensive analysis
- **Grid-Based Organization**: For creating, discovering, and sharing video collections
- **Structured AI Outputs**: Ensures consistent user experiences
- **Minimal, Enigmatic Interface**: Focused on horizontal transitions and dark themes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, shadcn/ui
- **Database**: Prisma ORM with PostgreSQL
- **Caching**: Upstash Redis
- **Storage**: Vercel Blob Storage
- **AI**: OpenRouter API (Claude models), Gemini API (Gemini 2 Flash)
- **Content Fetching**: r.jina.ai

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- API keys for OpenRouter and Gemini

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/retube.git
   cd retube
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   OPENROUTER_API_KEY=your-openrouter-api-key
   GEMINI_API_KEY=your-gemini-api-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The application is deployed on Vercel. To deploy:

1. Make sure you have the Vercel CLI installed:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Deploy to production:
   ```
   npm run deploy
   ```

4. Alternatively, push to the main branch on GitHub for automatic deployment via GitHub integration.

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and libraries
- `/lib/ai` - AI agent implementation
- `/prisma` - Database schema definition
- `/public` - Static files

## AI Agent Architecture

Retube implements a multi-stage AI agent for processing content and generating semantic grids:

1. **Planning** - Using Claude 3 via OpenRouter to understand the request
2. **Searching** - Finding relevant content using r.jina.ai for URL analysis
3. **Analyzing** - Examining visual and semantic elements using Gemini 2 Flash
4. **Generating** - Creating a cohesive grid structure with Claude 3

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenRouter](https://openrouter.ai/)
- [Gemini API](https://ai.google.dev/)
- [Jina AI](https://jina.ai/)
