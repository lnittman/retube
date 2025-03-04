# Project Design Document

## Overview

Project is an AI-native single page Progressive Web Application (PWA) built with Next.js 15 and React 19 that reimagines video discovery and sharing. It provides a minimalist, intuitive interface organized around 'grids' - semantically grouped clusters of videos from YouTube, Instagram, TikTok, and other platforms.

The application leverages Vercel's ecosystem (NeonDB, Upstash KV, Blob storage) for seamless deployment and data management while combining OpenRouter API for advanced search models with Google's Gemini API for multimodal understanding of video content.

Project offers a thoughtful alternative to endless-scroll 'reels' with an AI-first approach to video organization and discovery.

## Core Features

- **Semantic Video Clustering**: Groups videos based on AI-derived attributes including color palette, subjects, people, themes, styles, and directors
- **Multimodal Content Understanding**: Uses Gemini API to analyze audio, visual, and textual elements of videos
- **Human-Centered Interface**: Features intuitive, playful interactions powered by Framer Motion
- **Grid-Based Organization**: Allows users to create, discover, and share thematic video collections
- **Structured AI Outputs**: Ensures consistent, predictable user experiences across the application

## Architecture

### Frontend Architecture

The frontend architecture follows a component-based structure optimized for performance and maintainability:

```
src/
├── app/ (Next.js 15 App Router)
│   ├── layout.tsx (Root layout with PWA configuration)
│   ├── page.tsx (Homepage)
│   ├── grids/
│   │   ├── [id]/
│   │   │   └── page.tsx (Grid detail page)
│   │   └── page.tsx (Grid listing page)
│   └── api/ (API routes)
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── grid/ (Grid-related components)
│   ├── video/ (Video player components)
│   └── layout/ (Layout components)
├── lib/
│   ├── ai/ (AI service integrations)
│   │   ├── openrouter.ts
│   │   └── gemini.ts
│   ├── db/ (Database clients)
│   │   ├── neon.ts
│   │   └── upstash.ts
│   └── utils/ (Utility functions)
└── types/ (TypeScript type definitions)
```

### Backend Architecture

The backend leverages Next.js API routes with both RESTful and GraphQL approaches:

- **Data Layer**: 
  - NeonDB (PostgreSQL) for structured video metadata
  - Upstash KV for high-frequency data (views, likes)
  - Vercel Blob Storage for thumbnails and static assets

- **API Layer**:
  - RESTful endpoints for CRUD operations
  - GraphQL API for complex data fetching
  - AI processing middleware for semantic analysis

- **Authentication**:
  - OAuth-based authentication
  - JWT for session management

### Data Flow

1. **Video Discovery**:
   - User searches or browses content
   - OpenRouter API processes search queries
   - Results are semantically clustered into grids

2. **Video Analysis**:
   - Videos are processed by Gemini API
   - Multimodal analysis extracts semantic attributes
   - Results are stored in NeonDB and indexed

3. **Grid Creation**:
   - AI suggests semantic groupings based on content analysis
   - Users can create custom grids
   - Grid metadata stored in NeonDB, real-time metrics in Upstash KV

## Technical Implementation

### React Server Components Architecture

Server Components render the grid structure and fetch initial data:

```jsx
// app/grids/page.tsx
async function GridsPage() {
  const grids = await fetchGrids();
  
  return (
    <div className="grid-container">
      {grids.map(grid => (
        <GridCard key={grid.id} grid={grid} />
      ))}
    </div>
  );
}
```

Client Components handle interactivity:

```jsx
// components/video/VideoPlayer.tsx
'use client'

import { useState } from 'react';

export function VideoPlayer({ videoUrl, metadata }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="video-container">
      <video 
        src={videoUrl} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls
      />
      <VideoMetadata data={metadata} isPlaying={isPlaying} />
    </div>
  );
}
```

### PWA Implementation

The PWA implementation uses next-pwa to enable offline capabilities:

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.(.*)\.cdn\.com\/.*/, // Video CDN
      handler: 'CacheFirst',
      options: {
        cacheName: 'video-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /api\/grids/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    }
  ]
});

module.exports = withPWA({
  // Next.js config
});
```

### AI Integration

OpenRouter integration for video search:

```typescript
// lib/ai/openrouter.ts
export async function searchVideos(query: string) {
  const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://project-app.com',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-opus',
      messages: [
        {
          role: 'user',
          content: `Find videos related to: ${query}`
        }
      ],
      stream: false,
    }),
  });
  
  return response.json();
}
```

Gemini API for video content analysis:

```typescript
// lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeVideoContent(videoUrl: string, transcript: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

  const result = await model.generateContent([
    videoUrl, // Video content
    `Analyze this video and extract the following attributes:
     - Main themes
     - Visual style
     - Key subjects
     - Color palette
     - Emotional tone
     
     Video transcript: ${transcript}`
  ]);

  return result.response.text();
}
```

### Database Integration

NeonDB integration for structured data:

```typescript
// lib/db/neon.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function getGridById(id: string) {
  return sql`SELECT * FROM grids WHERE id = ${id}`;
}

export async function getVideosByGridId(gridId: string) {
  return sql`SELECT * FROM videos WHERE grid_id = ${gridId}`;
}
```

Upstash KV for real-time metrics:

```typescript
// lib/db/upstash.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function incrementVideoViews(videoId: string) {
  return redis.incr(`video:${videoId}:views`);
}

export async function getVideoViews(videoId: string) {
  return redis.get(`video:${videoId}:views`) || 0;
}
```

## Design Patterns

### Semantic Video Clustering

The application uses AI-driven semantic clustering to organize videos based on various attributes:

1. **Feature Extraction**: Gemini API analyzes video content (visual, audio, text)
2. **Embedding Generation**: Creates numerical representations of videos
3. **Similarity Calculation**: Groups videos based on semantic proximity
4. **Cluster Formation**: Creates grids based on identified patterns
5. **User Refinement**: Allows manual adjustment of clustering

### Responsive Grid Implementation

The grid interface uses a responsive, adaptive layout:

```jsx
// components/grid/GridLayout.tsx
export function GridLayout({ videos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map(video => (
        <div key={video.id} className="video-card">
          <VideoPlayer url={video.url} />
          <div className="p-2">
            <h3 className="text-lg font-medium">{video.title}</h3>
            <p className="text-sm text-gray-500">{video.source}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Offline-First Strategy

The application implements an offline-first strategy using service workers:

1. **Cache API**: Stores video metadata and thumbnails
2. **IndexedDB**: Maintains user preferences and interaction history
3. **Background Sync**: Queues actions when offline for later execution
4. **Optimistic UI Updates**: Updates UI immediately, syncs later

## Technologies

The application leverages the following technologies:

| Technology | Purpose |
|------------|---------|
| Next.js | React framework for server-side rendering and API routes |
| React | UI component library |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first CSS framework |
| Framer Motion | Animation library |
| shadcn/ui | Reusable UI components |
| React Query | Data fetching and state management |
| Prisma | ORM for database access |
| ESLint | Code linting |
| OpenRouter API | AI model gateway |
| Gemini API | Multimodal AI analysis |
| NeonDB | Serverless PostgreSQL database |
| Upstash KV | Key-value store for caching |
| Vercel Blob Storage | Object storage for media |
| GraphQL | Query language for APIs |
| RESTful APIs | HTTP-based API architecture |

## Performance Considerations

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js image optimization for thumbnails
- **Streaming SSR**: Incremental page rendering
- **Edge Caching**: CDN caching for static assets
- **Selective Hydration**: Prioritize interactive elements

## Security Considerations

- **Content Security Policy**: Restrict resource loading
- **API Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all user inputs
- **Authentication**: Secure user authentication
- **HTTPS Only**: Enforce secure connections

## Accessibility

- **ARIA Attributes**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Clear focus indicators
- **Responsive Design**: Adapts to all screen sizes and devices

## Conclusion

Project represents a new approach to video discovery and organization, leveraging AI to create meaningful connections between content. By combining Next.js 15 and React 19's latest features with Vercel's ecosystem and advanced AI APIs, the application delivers a performant, accessible, and intuitive experience for users seeking a more thoughtful alternative to traditional video platforms.

The architecture prioritizes performance, offline capabilities, and semantic understanding while maintaining a clean, maintainable codebase through modern React patterns and TypeScript.

## Resources

- [nextjs.org docs](https://nextjs.org/docs) - Resource for this project
- [reactjs.org docs](https://reactjs.org/docs/getting-started.html) - Resource for this project
- [tailwindcss.com docs](https://tailwindcss.com/docs) - Resource for this project
- [www.framer.com api](https://www.framer.com/api/motion/) - Resource for this project
- [www.npmjs.com package](https://www.npmjs.com/package/@shadcn/ui) - Resource for this project
- [react-query.tanstack.com overview](https://react-query.tanstack.com/overview) - Resource for this project
- [www.prisma.io docs](https://www.prisma.io/docs/) - Resource for this project
- [eslint.org docs](https://eslint.org/docs/user-guide/getting-started) - Resource for this project