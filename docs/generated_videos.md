# Generated Videos Documentation

This document outlines the video generation approach and specifications for the roofing business frontend.

## Video Generation Approach

### Current Status: Direct Video Generation via HuggingFace MCP

After exploring the HuggingFace MCP tools available through `mcporter`, the following was discovered:

1. **Available Tools**: The HuggingFace MCP server provides 13 tools including:
   - `dynamic_space` - For invoking HuggingFace Spaces
   - `model_search` - For finding ML models
   - `space_search` - For finding Spaces
   - `use_space` - For accessing Spaces with UI

2. **Video Generation Space Found**: [OpenKing/wan2-video-generation](https://hf.co/spaces/OpenKing/wan2-video-generation)
   - Category: Video Generation
   - Can generate high-quality videos from text prompts or images
   - 22 likes, trending score: 3

3. **Limitation**: While the Space is accessible, the programmatic invocation via `dynamic_space` requires specific parameter schemas that weren't retrievable through the MCP interface. The video generation must be done manually through the Space's web interface.

## Recommended Video Generation Prompts

### 1. Hero Video Background
- **Filename**: `hero-background.mp4`
- **Duration**: 5-10 seconds (looped)
- **Resolution**: 1920x1080 (1080p) or 1280x720 (720p)
- **Prompt**: "Professional roofing crew working on a modern house with blue sky and fluffy white clouds. Cinematic shot with warm color grading, golden hour lighting, clean shots of completed asphalt shingle roofs, workers installing shingles, safety equipment visible. Slow motion, cinematic camera movement."
- **Style**: Cinematic, warm, professional
- **Frontend Location**: [`LandingHero.tsx`](frontend/components/landing/LandingHero.tsx) - Hero section background
- **Fallback Image**: [`hero-image.jpg`](frontend/public/images/hero-image.jpg) or a solid color with gradient overlay (#1E3A8A to #F97316)

### 2. How It Works Explainer Video
- **Filename**: `how-it-works.mp4`
- **Duration**: 30 seconds
- **Resolution**: 1920x1080 (1080p) or 1080x1920 (vertical for mobile)
- **Prompt**: "Animated explainer video showing the roofing quote process: 1) Customer submitting a request on a tablet with happy expression, 2) Animated checklist and document review showing quote generation, 3) Customer signing approval on tablet, 4) Construction crew arriving with trucks and materials, 5) Completed roof with happy homeowner. Clean white background with blue and orange accent colors, professional motion graphics style."
- **Style**: Animated motion graphics, clean, professional
- **Frontend Location**: [`FeaturesSection.tsx`](frontend/components/landing/FeaturesSection.tsx) - How It Works section
- **Fallback Image**: [`features-image.jpg`](frontend/public/images/features-image.jpg) or a step-by-step infographic image

### 3. Testimonial Video 1
- **Filename**: `testimonial-1.mp4`
- **Duration**: 10 seconds
- **Resolution**: 1920x1080 (1080p)
- **Prompt**: "Testimonial from a happy homeowner standing in front of their beautiful new roof. Warm lighting, genuine smile, natural setting in front of their house. Subtle bokeh background blur, professional interview style. Person speaking enthusiastically about their roofing experience."
- **Style**: Authentic, warm, professional interview
- **Frontend Location**: [`Testimonials.tsx`](frontend/components/landing/Testimonials.tsx) - Customer testimonial section
- **Fallback Image**: [`testimonial-avatar-1.jpg`](frontend/public/images/testimonial-avatar-1.jpg) or customer photo placeholder

### 4. Testimonial Video 2
- **Filename**: `testimonial-2.mp4`
- **Duration**: 10 seconds
- **Resolution**: 1920x1080 (1080p)
- **Prompt**: "Testimonial from a satisfied customer, different demographic than testimonial-1. Speaking about the professionalism of the roofing crew, quality of work, and timeliness. Professional home exterior background, natural lighting, authentic testimonial style."
- **Style**: Authentic, warm, professional interview
- **Frontend Location**: [`Testimonials.tsx`](frontend/components/landing/Testimonials.tsx) - Customer testimonial carousel
- **Fallback Image**: [`testimonial-avatar-2.jpg`](frontend/public/images/testimonial-avatar-2.jpg) or customer photo placeholder

### 5. Services Showcase Video
- **Filename**: `services-showcase.mp4`
- **Duration**: 15 seconds
- **Resolution**: 1920x1080 (1080p) or square for social media
- **Prompt**: "Showcase of different roofing services: 1) Close-up of new asphalt shingles being installed with hammer and nails, 2) Metal roofing panel being placed by professional crew, 3) Roof repair work with patching and sealing, 4) Different roof types shown: hip roof, gable roof, flat roof. Clean cuts, professional footage, warm color grading matching brand colors."
- **Style**: Dynamic showcase, professional, informative
- **Frontend Location**: [`PricingSection.tsx`](frontend/components/landing/PricingSection.tsx) - Services overview or separate Services page
- **Fallback Image**: [`services-image.jpg`](frontend/public/images/services-image.jpg) or composite services image

## Alternative Video Generation Methods

### Method 1: HuggingFace Spaces Web Interface

1. Visit [OpenKing/wan2-video-generation](https://hf.co/spaces/OpenKing/wan2-video-generation)
2. Enter the appropriate prompt for each video
3. Adjust parameters (duration, resolution, etc.)
4. Generate and download the video
5. Save to `frontend/public/videos/`

### Method 2: Using Replicate API (Recommended for Production)

For programmatic video generation in production, consider using [Replicate](https://replicate.com/) which offers:

- **Model**: `zeroscope-v2-xl` or `stable-video-diffusion`
- **API**: RESTful API with easy integration
- **Cost**: Pay-per-generation

Example API call:
```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: 'zeroscope-v2-xl',
    input: {
      prompt: 'Professional roofing crew working on a modern house...',
      num_frames: 24,
      fps: 8,
      width: 1024,
      height: 576
    }
  })
});
```

### Method 3: Using RunPod or Modal for Self-Hosted Generation

For high-volume or custom needs, deploy video generation models on:
- [RunPod](https://runpod.io/) - GPU instances for inference
- [Modal](https://modal.com/) - Serverless GPU compute

## Video Integration in Frontend

### Basic Video Component Example

```tsx
// components/ui/VideoPlayer.tsx
import { useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, alt, className = '' }: VideoPlayerProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div 
        className={`bg-gradient-to-br from-blue-900 to-orange-500 flex items-center justify-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-white text-lg">{alt}</span>
      </div>
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      className={className}
      onError={() => setError(true)}
      onLoadedData={() => setLoaded(true)}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
```

### Usage in Hero Section

```tsx
// components/landing/LandingHero.tsx
import VideoPlayer from '@/components/ui/VideoPlayer';

export default function LandingHero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <VideoPlayer
        src="/videos/hero-background.mp4"
        poster="/images/hero-image.jpg"
        alt="Professional roofing work showcase"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 container mx-auto px-4">
        {/* Hero content */}
      </div>
    </section>
  );
}
```

## Brand Colors for Video

- Consistency **Primary Blue**: `#1E3A8A` (Deep Blue)
- **Accent Orange**: `#F97316` (Bright Orange)
- **White**: `#FFFFFF`
- **Light Gray**: `#F3F4F6`

## Video File Specifications

| Video | Aspect Ratio | Recommended Codec | Estimated Size |
|-------|-------------|-------------------|----------------|
| hero-background.mp4 | 16:9 | H.264, AAC | < 5MB |
| how-it-works.mp4 | 16:9 or 9:16 | H.264, AAC | < 10MB |
| testimonial-1.mp4 | 16:9 | H.264, AAC | < 5MB |
| testimonial-2.mp4 | 16:9 | H.264, AAC | < 5MB |
| services-showcase.mp4 | 16:9 or 1:1 | H.264, AAC | < 8MB |

## Fallback Strategy

For each video, ensure:
1. **Primary**: Video file in `frontend/public/videos/`
2. **Secondary**: Fallback image in `frontend/public/images/`
3. **Tertiary**: CSS gradient or solid color background
4. **Accessibility**: Descriptive alt text and aria labels

## Next Steps

1. Generate videos using one of the recommended methods above
2. Save to `frontend/public/videos/`
3. Update component imports to use the videos
4. Test video loading and fallback behavior
5. Optimize video files for web (compress if needed)
6. Add video loading indicators for slow connections
