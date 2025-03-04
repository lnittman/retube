# Next.js Implementation Guide

This document provides implementation details for the Project application.

## Project Structure

```
project/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── grids/          # Grid management endpoints
│   │   ├── videos/         # Video processing endpoints
│   │   └── ai/             # AI integration endpoints
│   ├── (auth)/             # Authentication routes
│   ├── grids/              # Grid view routes
│   ├── explore/            # Discovery interface
│   ├── profile/            # User profile pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   ├── grids/              # Grid-related components
│   ├── videos/             # Video player components
│   └── shared/             # Common components
├── lib/                    # Utility functions and services
│   ├── api/                # API clients
│   ├── ai/                 # AI service integrations
│   ├── db/                 # Database clients
│   └── utils/              # Helper functions
├── types/                  # TypeScript type definitions
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets and PWA files
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker (generated)
├── styles/                 # Global styles
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies
```

## Core Implementation Areas

### 1. PWA Setup with Next.js 15

Install and configure the `next-pwa` package to enable Progressive Web App capabilities:

```typescript
// next.config.js
import withPWA from "next-pwa";

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(mp4|webm)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "video-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\/api\/((?!auth).*)$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
  ],
});

export default nextConfig;
```

Configure the PWA manifest in `app/layout.tsx`:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: "Project",
  description: "AI-native video discovery and sharing",
  manifest: "/manifest.json",
  themeColor: "#000000",
  // Other metadata
};
```

### 2. Database Integration

Set up Prisma with NeonDB PostgreSQL for structured data:

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
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
  user        User     @relation(fields: [userId], references: [id])
  videos      Video[]
  tags        Tag[]
}

model Video {
  id          String   @id @default(cuid())
  title       String
  description String?
  url         String
  thumbnailUrl String?
  platform    String   // YouTube, Instagram, TikTok, etc.
  platformId  String   // Original ID from the platform
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  gridId      String
  grid        Grid     @relation(fields: [gridId], references: [id])
  attributes  Attribute[]
}

model Attribute {
  id        String   @id @default(cuid())
  key       String   // color, subject, theme, etc.
  value     String
  videoId   String
  video     Video    @relation(fields: [videoId], references: [id])
  @@unique([videoId, key, value])
}

model Tag {
  id     String @id @default(cuid())
  name   String @unique
  grids  Grid[]
}
```

Create a database client for server components:

```typescript
// lib/db/index.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

### 3. Upstash KV Integration

Set up Upstash KV for caching and temporary data:

```typescript
// lib/db/kv.ts
import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

// Cache a video's metadata
export async function cacheVideoMetadata(videoId: string, metadata: any, expirationInSeconds = 3600) {
  return redis.set(`video:${videoId}:metadata`, JSON.stringify(metadata), { ex: expirationInSeconds });
}

// Retrieve cached video metadata
export async function getCachedVideoMetadata(videoId: string) {
  const data = await redis.get(`video:${videoId}:metadata`);
  return data ? JSON.parse(data as string) : null;
}

// Increment video view count
export async function incrementVideoViews(videoId: string) {
  return redis.incr(`video:${videoId}:views`);
}

// Get video view count
export async function getVideoViews(videoId: string) {
  return redis.get(`video:${videoId}:views`) as Promise<number>;
}
```

### 4. Vercel Blob Storage Integration

Set up Blob storage for storing thumbnails and other assets:

```typescript
// lib/db/blob.ts
import { put, del, list } from '@vercel/blob';

// Upload a thumbnail
export async function uploadThumbnail(videoId: string, file: File) {
  const { url } = await put(`thumbnails/${videoId}.jpg`, file, {
    access: 'public',
  });
  return url;
}

// Delete a thumbnail
export async function deleteThumbnail(videoId: string) {
  await del(`thumbnails/${videoId}.jpg`);
}

// List all thumbnails
export async function listThumbnails(prefix = 'thumbnails/') {
  return list({ prefix });
}
```

### 5. AI Integration with OpenRouter and Gemini

Set up OpenRouter API client:

```typescript
// lib/ai/openrouter.ts
export async function generateCompletion(prompt: string, modelName = 'anthropic/claude-3-opus') {
  const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'Project'
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  return response.json();
}
```

Set up Gemini API for multimodal understanding:

```typescript
// lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeVideoContent(videoUrl: string, transcript: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  
  // Create a multipart prompt with video thumbnail and transcript
  const result = await model.generateContent([
    videoUrl, // This would be a thumbnail URL in practice
    `Analyze this video with the following transcript:\n\n${transcript}\n\nProvide a detailed analysis including main themes, key subjects, visual style, and color palette.`
  ]);

  const response = await result.response;
  const text = response.text();
  
  // Parse the response to extract structured data
  // This is a simplified example - you'd need more robust parsing
  const analysis = {
    themes: extractThemes(text),
    subjects: extractSubjects(text),
    visualStyle: extractVisualStyle(text),
    colorPalette: extractColorPalette(text),
  };
  
  return analysis;
}

// Helper functions to parse the AI response
function extractThemes(text: string) {
  // Implementation to extract themes from AI response
  return [];
}

function extractSubjects(text: string) {
  // Implementation to extract subjects from AI response
  return [];
}

function extractVisualStyle(text: string) {
  // Implementation to extract visual style from AI response
  return '';
}

function extractColorPalette(text: string) {
  // Implementation to extract color palette from AI response
  return [];
}
```

### 6. Video Grid Implementation

Create a responsive grid component:

```tsx
// components/grids/VideoGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { VideoCard } from '../videos/VideoCard';
import type { Video } from '@/types';

interface VideoGridProps {
  videos: Video[];
  columns?: number;
  gap?: number;
}

export function VideoGrid({ videos, columns = 3, gap = 4 }: VideoGridProps) {
  const [visibleVideos, setVisibleVideos] = useState<Video[]>([]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  // Load videos when grid comes into view
  useEffect(() => {
    if (inView) {
      setVisibleVideos(videos);
    }
  }, [inView, videos]);

  // Determine column classes based on props
  const getColumnClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Determine gap classes based on props
  const getGapClass = () => {
    return `gap-${gap}`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className={`grid ${getColumnClass()} ${getGapClass()} w-full`}
    >
      {visibleVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </motion.div>
  );
}
```

Create a video card component:

```tsx
// components/videos/VideoCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Video } from '@/types';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-gray-900"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="aspect-video relative">
        {isHovered ? (
          <iframe
            src={`${getEmbedUrl(video.url)}?autoplay=1&mute=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <Image
            src={video.thumbnailUrl || '/placeholder-thumbnail.jpg'}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-white font-medium truncate">{video.title}</h3>
        <div className="flex items-center mt-1">
          <span className="text-xs text-gray-400">{video.platform}</span>
          <span className="mx-1 text-gray-500">•</span>
          <span className="text-xs text-gray-400">
            {formatDate(video.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions
function getEmbedUrl(url: string): string {
  // Extract platform and video ID from URL
  // Return appropriate embed URL
  return url;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
```

### 7. Semantic Video Clustering Implementation

Create a service for clustering videos:

```typescript
// lib/ai/clustering.ts
import { generateCompletion } from './openrouter';
import { analyzeVideoContent } from './gemini';
import { prisma } from '../db';
import type { Video, Attribute } from '@/types';

// Analyze a video and extract attributes
export async function analyzeVideo(videoUrl: string, transcript: string): Promise<Attribute[]> {
  // Use Gemini for multimodal understanding
  const analysis = await analyzeVideoContent(videoUrl, transcript);
  
  // Convert analysis to attributes
  const attributes: Attribute[] = [
    ...analysis.themes.map(theme => ({ key: '

## Resources

- [nextjs.org docs](https://nextjs.org/docs) - Resource for this project
- [github.com typescript-cheatsheets](https://github.com/typescript-cheatsheets/react) - Resource for this project
- [tailwindcss.com docs](https://tailwindcss.com/docs) - Resource for this project
- [www.framer.com api](https://www.framer.com/api/motion/) - Resource for this project
- [react-query.tanstack.com guides](https://react-query.tanstack.com/guides) - Resource for this project
- [www.prisma.io docs](https://www.prisma.io/docs/) - Resource for this project
- [eslint.org docs](https://eslint.org/docs/rules/) - Resource for this project
- [graphql.org learn](https://graphql.org/learn/) - Resource for this project