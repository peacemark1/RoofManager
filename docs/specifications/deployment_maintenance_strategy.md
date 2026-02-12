# RoofManager Deployment & Maintenance Strategy

Comprehensive guide for deploying, maintaining, and troubleshooting the redesigned RoofManager platform with Ghanaian cultural elements, 3D animations, and liquid glass UI.

---

## 1. Cross-Browser & Device Compatibility Strategy

### 1.1 Browser Support Matrix

The RoofManager platform supports the following browsers with varying levels of feature support:

| Browser | Platform | Support Level | Notes |
|---------|----------|---------------|-------|
| Chrome | Desktop | Full Support | Primary development target |
| Chrome | Mobile | Full Support | Android devices, primary mobile target |
| Firefox | Desktop | Full Support | Good compatibility |
| Firefox | Mobile | Full Support | iOS and Android |
| Safari | Desktop | Full Support | macOS, requires testing |
| Safari | iOS | Full Support | iPhone and iPad |
| Edge | Desktop | Full Support | Chromium-based |
| Samsung Internet | Mobile | Full Support | Android Galaxy devices |
| Opera Mini | Mobile | Graceful Degradation | Limited JS, basic CSS only |
| Opera | Desktop | Full Support | Chromium-based |

#### CSS Properties Requiring Fallbacks

```css
/* Glassmorphism fallback strategy */
.glass-card {
  /* Modern browsers */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Fallback for Opera Mini and older browsers */
.no-backdrop-filter .glass-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
}
```

#### JavaScript APIs Requiring Polyfills

| API | Polyfill Required | Use Case |
|-----|-------------------|-----------|
| `fetch` | `whatwg-fetch` | API calls |
| `Promise` | `core-js` | Async operations |
| `Array.prototype.includes` | `core-js` | Array methods |
| `Object.entries` | `core-js` | Object iteration |
| `WebGL` | `ogl` or fallback | 3D animations |

### 1.2 Device Breakpoints & Responsiveness

```css
/* Tailwind CSS breakpoints */
@theme {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Responsive strategy documentation */
- Mobile: < 640px (phones in portrait)
- Tablet: 640px - 1024px (tablets, large phones)
- Desktop: 1024px - 1280px (laptops, small monitors)
- Large: > 1280px (desktop monitors)
```

#### Touch vs Mouse Interaction Detection

```typescript
// lib/utils/detection.ts
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}

export function getInteractionMode(): 'touch' | 'mouse' {
  return isTouchDevice() ? 'touch' : 'mouse';
}
```

#### Mobile-First CSS Approach

```tsx
// components/ui/responsive-button.tsx
export function ResponsiveButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="
      px-4 py-2 
      sm:px-6 sm:py-3 
      lg:px-8 lg:py-4
      text-sm 
      sm:text-base
      lg:text-lg
      touch-manipulation
      min-h-[44px]
      sm:min-h-[48px]
    ">
      {children}
    </button>
  );
}
```

#### Fluid Typography

```css
/* Fluid typography using clamp() */
:root {
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-base: clamp(1rem, 0.925rem + 0.375vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --font-size-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --font-size-3xl: clamp(2rem, 1.75rem + 1.25vw, 3rem);
}

/* Viewport-relative spacing */
:root {
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: clamp(1rem, 2rem);
  --space-xl: clampvw, 2(2rem, 4vw, 4rem);
}
```

### 1.3 3D Animation Fallback Strategy

#### Device Capability Detection

```typescript
// lib/hooks/useAnimationPreference.ts
export function useAnimationPreference() {
  const [animationLevel, setAnimationLevel] = useState<'full' | 'reduced' | 'minimal'>('full');
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setAnimationLevel(prefersReducedMotion ? 'minimal' : 'full');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setAnimationLevel(e.matches ? 'minimal' : 'full');
    };
    prefersReducedMotion.addEventListener('change', handleMotionChange);

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLAvailable(!!gl);
    } catch {
      setWebGLAvailable(false);
    }

    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return { animationLevel, webGLAvailable };
}
```

#### Performance Tier Detection

```typescript
// lib/utils/performance.ts
export function getPerformanceTier(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'high';

  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check device memory
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check connection speed
  const connection = (navigator as any).connection;
  const isSlowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

  if (cores >= 8 && memory >= 8 && !isSlowConnection) return 'high';
  if (cores >= 4 && memory >= 4 && !isSlowConnection) return 'medium';
  return 'low';
}

export function shouldUseWebGL(): boolean {
  if (getPerformanceTier() === 'low') return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
```

#### Component-Level Fallback Implementation

```tsx
// components/landing/Hero3D.tsx
'use client';

import { useAnimationPreference } from '@/lib/hooks/useAnimationPreference';
import { shouldUseWebGL } from '@/lib/utils/performance';

export function Hero3D() {
  const { animationLevel, webGLAvailable } = useAnimationPreference();
  const useWebGL = shouldUseWebGL() && webGLAvailable && animationLevel !== 'minimal';

  if (animationLevel === 'minimal') {
    return <HeroStatic />;
  }

  if (useWebGL) {
    return <HeroWebGL />;
  }

  return <HeroCSSAnimation />;
}

function HeroWebGL() {
  // Full 3D animation with Three.js or React Three Fiber
  return <ThreeScene />;
}

function HeroCSSAnimation() {
  // CSS-only animations with hardware acceleration
  return (
    <div className="hero-container">
      <div className="hero-roof animate-roof-float" />
      <div className="hero-pattern animate-pattern-shift" />
    </div>
  );
}

function HeroStatic() {
  // Static fallback with subtle hover effects only
  return (
    <div className="hero-static">
      <img src="/hero-static.webp" alt="RoofManager" />
    </div>
  );
}
```

### 1.4 Network Condition Adaptation

#### Network Information API Integration

```typescript
// lib/hooks/useNetworkStatus.ts
interface NetworkStatus {
  isOnline: boolean;
  effectiveType: string | null;
  downlink: number | null;
  saveData: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    effectiveType: null,
    downlink: null,
    saveData: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setStatus({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType || null,
        downlink: connection?.downlink || null,
        saveData: connection?.saveData || false,
      });
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateStatus);
    }

    updateStatus();

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
}
```

#### Lazy Loading Strategy

```tsx
// components/animations/LazyAnimated.tsx
'use client';

import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';

export function LazyAnimated({ children }: { children: React.ReactNode }) {
  const { effectiveType, downlink } = useNetworkStatus();
  
  // Disable animations on slow connections
  const shouldAnimate = effectiveType !== 'slow-2g' && effectiveType !== '2g' && (downlink || 0) > 1;

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{children}</motion.div>;
}
```

---

## 2. Debugging & Error Tracking Systems

### 2.1 Frontend Debugging Strategy

#### Browser DevTools Configuration

```javascript
// Enable comprehensive console logging in development
// In browser console:
localStorage.setItem('debug', 'roofmanager:*');
localStorage.setItem('debugVerbose', 'true');
```

#### React DevTools Integration

```bash
# Install React DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

#### State Management Debugging (Zustand)

```typescript
// lib/stores/debugStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DebugState {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
}

interface LogEntry {
  timestamp: Date;
  action: string;
  payload?: any;
  state?: any;
}

export const useDebugStore = create<DebugState>()(
  devtools(
    (set) => ({
      logs: [],
      addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
      clearLogs: () => set({ logs: [] }),
    }),
    { name: 'roofmanager-debug' }
  )
);
```

#### Network Request Debugging

```typescript
// lib/api/debugInterceptor.ts
import axios from 'axios';

export const setupDebugInterceptors = () => {
  // Log all requests in development
  if (process.env.NODE_ENV === 'development') {
    axios.interceptors.request.use((config) => {
      console.group(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Headers:', config.headers);
      console.log('Payload:', config.data);
      console.groupEnd();
      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        console.group(`API Response: ${response.status}`);
        console.log('Data:', response.data);
        console.groupEnd();
        return response;
      },
      (error) => {
        console.group(`API Error: ${error.response?.status || 'Network Error'}`);
        console.error('Message:', error.message);
        console.error('Response:', error.response?.data);
        console.groupEnd();
        return Promise.reject(error);
      }
    );
  }
};
```

### 2.2 Error Tracking Integration

#### Sentry Integration

```bash
# Install Sentry
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  
  // Customize error collection
  ignoreErrors: [
    'Network request failed',
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ],
  
  // BeforeSend hook for additional processing
  beforeSend(event, hint) {
    const error = hint.originalException;
    
    // Filter out non-critical errors
    if (error instanceof Error && error.message.includes('non-critical')) {
      return null;
    }
    
    return event;
  },
});
```

```typescript
// sentry.edge.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Adjust for edge runtime
  maxBreadcrumbs: 50,
  attachStacktrace: true,
});
```

#### Error Boundary Implementation

```tsx
// components/ui/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: errorInfo });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please try again or contact support.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReload}>Reload Page</Button>
              <Button variant="outline" onClick={this.handleGoHome}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Custom Error Pages

```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <span className="text-6xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Error
          </h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but something went wrong. Our team has been notified.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/')}>
              Go to Homepage
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### 2.3 Backend Debugging Strategy

#### Logging Configuration (Winston)

```javascript
// backend/utils/logger.js
const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    if (stack) {
      msg += `\n${stack}`;
    }
    return msg;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // File output for errors
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File output for all logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log'),
    }),
  ],
});

module.exports = logger;
```

#### Request/Response Logging Middleware

```javascript
// backend/middleware/logger.middleware.js
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    };
    
    if (res.statusCode >= 400) {
      logger.warn('Request failed', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
};

module.exports = requestLogger;
```

#### Database Query Logging

```javascript
// backend/prisma/logger.js
const { Prisma } = require('@prisma/client');

const prismaQueryLogger = (params) => {
  console.log('Prisma Query:', {
    model: params.model,
    action: params.action,
    query: params.query,
    duration: params.duration,
  });
};

// Enable logging in development
if (process.env.NODE_ENV === 'development') {
  Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, args, query }) {
            const start = Date.now();
            const result = await query(args);
            const duration = Date.now() - start;
            
            if (duration > 100) {
              console.warn(`Slow query detected: ${operation} took ${duration}ms`);
            }
            
            return result;
          },
        },
      },
    })
  );
}
```

### 2.4 Mobile Debugging

#### Chrome DevTools Remote Debugging

```bash
# Enable USB debugging on Android device
# 1. Enable Developer Options > USB Debugging
# 2. Connect device via USB
# 3. Visit chrome://inspect on desktop Chrome
# 4. Click "Port Forwarding"
# 5. Add: localhost:3000 -> localhost:3000
```

#### iOS Safari Web Inspector

```bash
# Enable Web Inspector on iOS
# 1. Settings > Safari > Advanced > Web Inspector: ON
# 2. Connect iOS device to Mac
# 3. Open Safari > Develop > [Device Name] > [Page]
```

---

## 3. CI/CD Pipeline Configuration

### 3.1 GitHub Actions Workflows

#### Frontend CI/CD Pipeline

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend.yml'
  pull_request:
    branches: [main]
    paths:
      - 'frontend/**'

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run ESLint
        run: cd frontend && npm run lint

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run TypeScript type check
        run: cd frontend && npx tsc --noEmit

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run unit tests
        run: cd frontend && npm run test -- --coverage --passWithNoTests
      
      - name: Upload coverage to Codecov
        if: github.ref == 'refs/heads/main'
        uses: codecov/codecov-action@v3
        with:
          directory: ./frontend/coverage
          fail_ci_if_error: false

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, type-check, test]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Build Next.js application
        run: cd frontend && npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: frontend/.next
          retention-days: 7

  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: frontend-build
          path: frontend/.next
      
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: frontend-build
          path: frontend/.next
      
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

#### Backend CI/CD Pipeline

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend.yml'
  pull_request:
    branches: [main]
    paths:
      - 'backend/**'

env:
  NODE_VERSION: '20'
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_DB: roofmanager_test

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Run ESLint
        run: cd backend && npm run lint

  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: ${{ env.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
          POSTGRES_DB: ${{ env.POSTGRES_DB }}
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Generate Prisma Client
        run: cd backend && npx prisma generate
      
      - name: Run database migrations
        run: cd backend && npx prisma migrate deploy
        env:
          DATABASE_URL: postgres://${{ env.POSTGRES_USER }}:${{ env.POSTGRES_PASSWORD }}@localhost:5432/${{ env.POSTGRES_DB }}
      
      - name: Run unit tests
        run: cd backend && npm run test -- --coverage --passWithNoTests
        env:
          DATABASE_URL: postgres://${{ env.POSTGRES_USER }}:${{ env.POSTGRES_PASSWORD }}@localhost:5432/${{ env.POSTGRES_DB }}
          JWT_SECRET: test-secret
          NODE_ENV: test
      
      - name: Upload coverage to Codecov
        if: github.ref == 'refs/heads/main'
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage
          fail_ci_if_error: false

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Run npm audit
        run: cd backend && npm audit --production --audit-level=high
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test, security-scan]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Build Docker image
        if: false
        run: cd backend && docker build -t roofmanager-backend:${{ github.sha }} .

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Railway Staging
        uses: khemraj-r/composite-action@v1
        with:
          command: |
            echo "Deploying to Railway staging..."

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Deploy to Railway Production
        uses: khemraj-r/composite-action@v1
        with:
          command: |
            echo "Deploying to Railway production..."
```

### 3.2 Vercel Configuration

```json
// frontend/vercel.json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "regions": ["iad1", "lhr1", "cdg1"],
  
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,DELETE,PATCH,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Service-Worker-Allowed", "value": "/" }
      ]
    },
    {
      "source": "/(.*).woff2",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  
  "rewrites": [
    {
      "source": "/api/payments/webhook",
      "destination": "/api/webhooks/stripe"
    }
  ],
  
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### 3.3 Environment Management

#### Environment Variables Documentation

```bash
# ===========================================
# FRONTEND ENVIRONMENT VARIABLES
# ===========================================

# API Configuration
NEXT_PUBLIC_API_URL=https://backend-production.railway.app/api

# Authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Feature Flags
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_3D=true

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ===========================================
# BACKEND ENVIRONMENT VARIABLES
# ===========================================

# Server Configuration
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (SendGrid)
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@roofmanager.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Payment Processing (Paystack - Ghana)
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=whsec_...

# File Storage
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# AI Integration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen3-coder:30b

# Frontend URL
FRONTEND_URL=https://roofmanager.vercel.app

# Logging
LOG_LEVEL=info
```

---

## 4. Performance Optimization Strategy

### 4.1 Frontend Performance

#### Code Splitting Configuration

```tsx
// app/(dashboard)/layout.tsx
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

#### Dynamic Imports for Heavy Components

```tsx
// components/animations/HeavyAnimation.tsx
import dynamic from 'next/dynamic';

export const Hero3D = dynamic(
  () => import('./Hero3DCanvas').then((mod) => mod.Hero3DCanvas),
  {
    loading: () => <Hero3DPlaceholder />,
    ssr: false,
  }
);

export const RevenueChart3D = dynamic(
  () => import('./RevenueChart3D').then((mod) => mod.RevenueChart3D),
  {
    loading: () => <ChartPlaceholder />,
    ssr: false,
  }
);
```

#### Bundle Analysis

```bash
# Add bundle analyzer
npm install @next/bundle-analyzer --save-dev
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

```bash
# Run bundle analysis
ANALYZE=true npm run build
```

### 4.2 Animation Performance

#### GPU Acceleration Guidelines

```css
/* Use transform and opacity for animations */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Avoid animating layout properties */
.avoid-animate {
  /* Instead of animating width, height, margin, padding */
  /* Use transform: scale() instead */
}

/* Animation performance budget */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.performance-budget {
  animation: slideIn 0.3s ease-out;
}
```

#### Frame Rate Monitoring

```typescript
// lib/hooks/useFrameRate.ts
export function useFrameRate(callback: (fps: number) => void) {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = frameCount;
        callback(fps);
        frameCount = 0;
        lastTime = now;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [callback]);
}
```

### 4.3 Backend Performance

#### Database Query Optimization

```typescript
// backend/controllers/job.controller.js
const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Use Prisma's include for efficient loading
    const jobs = await prisma.job.findMany({
      skip,
      take: Number(limit),
      where: {
        status: status ? { equals: status } : undefined,
        OR: search
          ? [
              { customer: { name: { contains: search, mode: 'insensitive' } } },
              { address: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedCrew: {
          select: { id: true, name: true },
        },
        _count: {
          select: { photos: true, materials: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get total count separately for performance
    const total = await prisma.job.count({
      where: {
        status: status ? { equals: status } : undefined,
      },
    });

    res.json({
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};
```

#### Connection Pooling

```typescript
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Connection pool settings are set via DATABASE_URL
// postgresql://user:password@host:5432/database?connection_limit=10
```

### 4.4 Performance Budgets

```javascript
// next.config.js
module.exports = {
  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Performance budgets (in bytes)
  experimental: {
    // Warning threshold for bundle sizes
    bundleSizeWarningThreshold: 200 * 1024, // 200KB
  },
};
```

#### Performance Budget Definition

| Metric | Target | Threshold | Priority |
|--------|--------|-----------|----------|
| First Contentful Paint (FCP) | < 1.8s | < 2.5s | High |
| Largest Contentful Paint (LCP) | < 2.5s | < 3.0s | High |
| First Input Delay (FID) | < 100ms | < 300ms | High |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 | Medium |
| Time to Interactive (TTI) | < 3.8s | < 5.0s | Medium |
| JavaScript Bundle Size | < 200KB | < 300KB | High |
| CSS Bundle Size | < 50KB | < 100KB | Medium |
| Images (Above Fold) | < 100KB | < 200KB | High |

---

## 5. Testing Strategy

### 5.1 Unit Testing

#### Jest Configuration

```javascript
// frontend/jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

```javascript
// frontend/jest.setup.js
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});
```

#### Unit Test Examples

```tsx
// components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });
});
```

```tsx
// lib/utils/formatters.test.ts
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats number as currency', () => {
    expect(formatCurrency(1250.50)).toBe('GHS 1,250.50');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('GHS 0.00');
  });

  it('handles large numbers', () => {
    expect(formatCurrency(1000000)).toBe('GHS 1,000,000.00');
  });
});
```

### 5.2 Integration Testing

```javascript
// backend/tests/api.test.js
const request = require('supertest');
const app = require('../server.js');
const prisma = require('../prisma/client');

describe('Job API Endpoints', () => {
  beforeAll(async () => {
    // Setup test data
    await prisma.job.deleteMany();
    await prisma.customer.deleteMany();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.job.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/jobs', () => {
    it('returns paginated jobs', async () => {
      // Create test data
      const customer = await prisma.customer.create({
        data: {
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '+233123456789',
        },
      });

      await prisma.job.create({
        data: {
          title: 'Roof Repair',
          customerId: customer.id,
          status: 'SCHEDULED',
          address: '123 Test Street',
        },
      });

      const response = await request(app)
        .get('/api/jobs')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('POST /api/jobs', () => {
    it('creates a new job', async () => {
      const customer = await prisma.customer.create({
        data: {
          name: 'New Customer',
          email: 'new@example.com',
          phone: '+233987654321',
        },
      });

      const jobData = {
        title: 'New Roof Installation',
        customerId: customer.id,
        status: 'LEAD',
        address: '456 New Street',
        estimatedCost: 15000,
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Roof Installation');
    });
  });
});
```

### 5.3 E2E Testing

```typescript
// frontend/tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'demo@roofmanager.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('displays metrics cards', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for key metrics
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Active Jobs')).toBeVisible();
    await expect(page.locator('text=Pending Quotes')).toBeVisible();
  });

  test('navigates to jobs page', async ({ page }) => {
    await page.click('a[href="/dashboard/jobs"]');
    await expect(page).toHaveURL(/\/dashboard\/jobs/);
    await expect(page.locator('h1:has-text("Jobs")')).toBeVisible();
  });

  test('creates a new lead', async ({ page }) => {
    await page.goto('/dashboard/leads');
    await page.click('button:has-text("Add Lead")');
    
    // Fill lead form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '+233123456789');
    await page.fill('textarea[name="notes"]', 'Test lead from E2E test');
    
    await page.click('button:has-text("Save")');
    
    // Verify lead was created
    await expect(page.locator('text=John Doe')).toBeVisible();
  });
});
```

```typescript
// frontend/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 5.4 Accessibility Testing

```javascript
// frontend/tests/a11y/axe.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('login page has no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard has no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    // Login first
    await page.fill('input[name="email"]', 'demo@roofmanager.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

## 6. Maintenance Routines

### 6.1 Daily Maintenance Checklist

```markdown
## Daily Maintenance Tasks

### Morning Checklist
- [ ] Check Sentry for new errors
- [ ] Review failed deployment status
- [ ] Monitor build status on Vercel/Railway
- [ ] Check security alerts (GitHub Dependabot)

### Throughout the Day
- [ ] Monitor application performance (Lighthouse scores)
- [ ] Review user feedback from support channels
- [ ] Check for any API downtime
- [ ] Monitor database connection pool usage

### End of Day
- [ ] Document any incidents encountered
- [ ] Update sprint/task status
- [ ] Review tomorrow's deployment schedule
```

### 6.2 Weekly Maintenance Checklist

```markdown
## Weekly Maintenance Tasks

### Dependency Updates
- [ ] Review available updates for frontend packages
- [ ] Review available updates for backend packages
- [ ] Test updates in staging environment
- [ ] Update changelog for new versions

### Security
- [ ] Run npm audit for vulnerabilities
- [ ] Review Sentry error trends
- [ ] Check for expired SSL certificates
- [ ] Review access logs for suspicious activity

### Performance
- [ ] Review Core Web Vitals data
- [ ] Analyze bundle size changes
- [ ] Check database query performance
- [ ] Review API response times

### Backups
- [ ] Verify database backup completion
- [ ] Test backup restoration procedure
- [ ] Clean up old backup files
```

### 6.3 Monthly Maintenance Checklist

```markdown
## Monthly Maintenance Tasks

### Major Updates
- [ ] Review and apply major dependency updates
- [ ] Update Node.js version if needed
- [ ] Review and update Docker images
- [ ] Update CI/CD pipeline versions

### Security Audit
- [ ] Run comprehensive security scan
- [ ] Review user access and permissions
- [ ] Audit API keys and secrets
- [ ] Review firewall rules

### Database Maintenance
- [ ] Analyze and optimize database indexes
- [ ] Review query performance
- [ ] Clean up orphaned records
- [ ] Verify backup integrity

### Cost Optimization
- [ ] Review service usage and costs
- [ ] Identify unused resources
- [ ] Optimize resource allocation
- [ ] Review CDN usage patterns
```

### 6.4 Quarterly Maintenance Checklist

```markdown
## Quarterly Maintenance Tasks

### Architecture Review
- [ ] Review system architecture documentation
- [ ] Identify technical debt
- [ ] Plan refactoring efforts
- [ ] Evaluate new technology options

### Security Assessment
- [ ] Conduct penetration testing
- [ ] Review compliance requirements
- [ ] Update security policies
- [ ] Train team on security best practices

### Disaster Recovery
- [ ] Test backup restoration procedure
- [ ] Document recovery time objectives
- [ ] Update runbooks and procedures
- [ ] Conduct team training

### Performance Audit
- [ ] Comprehensive performance testing
- [ ] Load testing under peak conditions
- [ ] Stress testing for limits
- [ ] Optimization implementation planning
```

---

## 7. Documentation Requirements

### 7.1 Supporting Documentation Files

The following additional documentation files should be created:

1. **[`docs/debugging_guide.md`](docs/debugging_guide.md)** - Frontend and backend debugging procedures
2. **[`docs/error_tracking_guide.md`](docs/error_tracking_guide.md)** - Sentry integration and usage
3. **[`docs/ci_cd_guide.md`](docs/ci_cd_guide.md)** - CI/CD pipeline documentation
4. **[`docs/performance_guide.md`](docs/performance_guide.md)** - Performance optimization guidelines
5. **[`docs/testing_guide.md`](docs/testing_guide.md)** - Testing procedures and coverage
6. **[`docs/maintenance_checklist.md`](docs/maintenance_checklist.md)** - Daily/weekly/monthly tasks
7. **[`docs/runbooks.md`](docs/runbooks.md)** - Incident response procedures

---

## Appendix A: Deployment Architecture

```mermaid
graph TB
    subgraph Frontend [Vercel - Free Tier]
        F[Next.js App] --> |CDN| CD[Cloudflare CDN]
        CD --> |HTTPS| U[Users]
    end
    
    subgraph Backend [Railway - $5/mo]
        BE[Express API] --> |HTTPS| CD
        BE --> |TCP| DB[(Supabase PostgreSQL)]
    end
    
    subgraph Services
        S1[SendGrid - Email]
        S2[Twilio/Hubtel - SMS]
        S3[Stripe - Payments]
        S4[Cloudinary - Storage]
    end
    
    BE --> S1
    BE --> S2
    BE --> S3
    BE --> S4
    
    subgraph Monitoring
        M1[Sentry - Error Tracking]
        M2[GitHub Actions - CI/CD]
        M3[Lighthouse CI - Performance]
    end
    
    F --> M1
    BE --> M1
    M2 --> F
    M2 --> BE
    M3 --> F
```

---

## Appendix B: GitHub Actions Workflow

```mermaid
flowchart TD
    A[Push Code] --> B{Which branch?}
    
    B -->|main| C[Run All Tests]
    B -->|develop| D[Run All Tests]
    B -->|feature/*| E[Run Lint + Type Check]
    
    C --> F{Tests Pass?}
    D --> F
    E --> F
    
    F -->|No| G[Notify Failures]
    G --> H[Stop]
    
    F -->|Yes| I{Deploy?}
    
    I -->|main| J[Deploy to Production]
    I -->|develop| K[Deploy to Staging]
    I -->|PR| L[Deploy Preview]
    
    J --> M[Notify Success]
    K --> M
    L --> M
    
    M --> N[Complete]
```

---

## Appendix C: Performance Monitoring Dashboard

```mermaid
flowchart LR
    subgraph Metrics [Core Web Vitals]
        FCP[FCP < 1.8s]
        LCP[LCP < 2.5s]
        FID[FID < 100ms]
        CLS[CLS < 0.1]
    end
    
    subgraph Monitoring [Tools]
        V[Vercel Analytics]
        G[Google Analytics]
        S[Sentry Performance]
    end
    
    subgraph Alerts [Thresholds]
        P1[Warning: 80% of target]
        P2[Critical: 90% of target]
    end
    
    Metrics --> Monitoring
    Monitoring --> P1
    P1 --> P2
    P2 -->|Trigger| A[Alert Team]
```

---

## Appendix D: Incident Severity Levels

| Severity | Description | Response Time | Examples |
|-----------|-------------|---------------|----------|
| P1 - Critical | Complete system outage | 15 minutes | Database down, API completely unavailable |
| P2 - High | Major feature broken | 1 hour | Login fails, payments don't process |
| P3 - Medium | Feature impaired | 4 hours | Slow performance, minor bugs |
| P4 - Low | Minor issue | 24 hours | Typo, cosmetic issue, suggestion |

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-11  
**Next Review:** 2026-05-11
