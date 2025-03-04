# init.md

# Project Initialization Guide

This document provides comprehensive instructions for AI assistants to implement Project, an AI-native single page PWA built with Next.js 15 and React 19 that reimagines video discovery and sharing through semantic clustering.

## Project Overview

Project is a minimalist, intuitive interface organized around 'grids' - semantically grouped clusters of videos from YouTube, Instagram, TikTok, and other platforms. It leverages Vercel's ecosystem (NeonDB, Upstash KV, Blob storage) for seamless deployment and data management, while combining OpenRouter API for advanced search models with Google's Gemini API for multimodal understanding of video content.

## Core Concepts

1. **Semantic Video Clustering**: AI-derived attributes (color palette, subjects, people, themes, styles, directors)
2. **Multimodal Understanding**: Using Gemini API for audio, visual, and textual analysis
3. **Grid-based Organization**: Allowing users to create, discover, and share thematic video collections
4. **Structured AI Outputs**: Consistent, predictable user experiences across the application

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui
- **Data Fetching**: React Query, GraphQL, RESTful APIs
- **Database**: Prisma ORM with NeonDB PostgreSQL
- **Caching**: Upstash KV for high-performance caching
- **Storage**: Vercel Blob Storage for media assets
- **AI**: OpenRouter API, Gemini API

## Implementation Roadmap

### 1. Project Setup

```bash
# Create a new Next.js project with TypeScript
npx create-next-app@latest project --typescript --tailwind --app --src-dir
cd project

# Install core dependencies
npm install @prisma/client @tanstack/react-query framer-motion @vercel/blob @upstash/redis @upstash/kv
npm install @neondatabase/serverless openai @google/generative-ai

# Install development dependencies
npm install -D prisma @tanstack/eslint-plugin-query @types/node
```

### 2. PWA Configuration

Implement Progressive Web App capabilities:

```bash
# Install next-pwa
npm install next-pwa
```

Configure `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
};

module.exports = withPWA(nextConfig);
```

Add PWA metadata to your `app/layout.tsx`:

```typescript
export const metadata = {
  title: 'Project',
  description: 'AI-native video discovery and sharing',
  manifest: '/manifest.json',
  // Other metadata
};
```

Create `public/manifest.json`:

```json
{
  "name": "Project",
  "short_name": "Project",
  "description": "AI-native video discovery and sharing",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 3. Database and Schema Setup

```bash
# Initialize Prisma
npx prisma init
```

Create `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  grids     Grid[]
}

model Grid {
  id          String   @id @default(cuid())
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  videos      Video[]
  tags        Tag[]
}

model Video {
  id          String   @id @default(cuid())
  title       String
  description String?
  url         String
  thumbnailUrl String?
  platform    String   // "youtube", "instagram", "tiktok", etc.
  externalId  String   // Platform-specific ID
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  gridId      String
  grid        Grid     @relation(fields: [gridId], references: [id], onDelete: Cascade)
  metadata    Json?    // AI-derived metadata
}

model Tag {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  grids     Grid[]
}
```

Generate Prisma client:

```bash
npx prisma generate
```

### 4. Environment Configuration

Create `.env.local`:

```
# Database
DATABASE_URL="postgresql://username:password@neon.db/project"
DIRECT_URL="postgresql://username:password@neon.db/project?connect_timeout=10"

# Upstash
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-blob-token"

# AI APIs
OPENROUTER_API_KEY="your-openrouter-api-key"
GEMINI_API_KEY="your-gemini-api-key"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 5. API Integration

#### OpenRouter API Setup

Create `lib/openrouter.ts`:

```typescript
export async function generateChatCompletion(messages: any[]) {
  const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://your-site.com',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-opus',
      messages,
      max_tokens: 1000,
    }),
  });
  
  return response.json();
}
```

#### Gemini API Setup

Create `lib/gemini.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeVideoContent(videoUrl: string, transcript: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  
  const prompt = `Analyze this video content. URL: ${videoUrl}\n\nTranscript: ${transcript}\n\nProvide a detailed analysis of the video content, including main themes, subjects, style, and mood.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 6. Database Client Setup

Create `lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 7. API Routes Implementation

Create `app/api/grids/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const grids = await prisma.grid.findMany({
      include: {
        videos: true,
        tags: true,
      },
    });
    
    return NextResponse.json(grids);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch grids' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, userId, tags } = body;
    
    const grid = await prisma.grid.create({
      data: {
        title,
        description,
        userId,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
    
    return NextResponse.json(grid);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create grid' }, { status: 500 });
  }
}
```

Create `app/api/videos/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyzeVideoContent } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, gridId, platform, externalId } = body;
    
    // Mock transcript for demo purposes
    // In production, you would extract this from the video
    const mockTranscript = "This is a sample transcript of the video content.";
    
    // Analyze video content using Gemini API
    const analysisResult = await analyzeVideoContent(url, mockTranscript);
    
    // Create video record with AI-derived metadata
    const video = await prisma.video.create({
      data: {
        title,
        url,
        platform,
        externalId,
        gridId,
        metadata: {
          analysis: analysisResult,
          // Additional metadata fields would be added here
        },
      },
    });
    
    return NextResponse.json(video);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}
```

### 8. Authentication Setup

Implement authentication using NextAuth.js:

```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // In production, implement proper authentication
        // This is a simplified example
        if (!credentials?.email) return null;
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          // Create user for demo purposes
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
            },
          });
        }
        
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### 9. React Query Setup

Create `lib/react-query.tsx`:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

Update `app/layout.tsx`:

```typescript
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
```

### 10. UI Components Setup

Install shadcn/ui:

```bash
npx shadcn-ui@latest init
```

Add the necessary components:

```bash
npx shadcn-ui@latest add button card dialog input
```

### 11. Video Grid Component

Create `components/video-grid.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  platform: string;
}

interface GridProps {
  id: string;
  title: string;
}

export function VideoGrid({ id, title }: GridProps) {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ['grid-videos', id],
    queryFn: async () => {
      const res = await fetch(`/api/grids/${id}/videos`);
      if (!res.ok) throw new Error('Failed to fetch videos');
      return res.json();
    },
  });

  if (isLoading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos?.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full

## Resources

- [api.openrouter.ai api](https://api.openrouter.ai/api/v1) - Resource for this project
- [nextjs.org docs](https://nextjs.org/docs) - Resource for this project
- [reactjs.org docs](https://reactjs.org/docs/getting-started.html) - Resource for this project
- [www.typescriptlang.org docs](https://www.typescriptlang.org/docs/handbook/intro.html) - Resource for this project
- [tailwindcss.com docs](https://tailwindcss.com/docs) - Resource for this project
- [www.framer.com api](https://www.framer.com/api/motion/) - Resource for this project
- [github.com shadcn](https://github.com/shadcn/ui) - Resource for this project
- [react-query.tanstack.com guides](https://react-query.tanstack.com/guides) - Resource for this project