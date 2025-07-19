# Deployment Guide

This guide covers deploying the Interlink application to various platforms.

## Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and optimizations.

### Prerequisites
- GitHub repository with your code
- Vercel account
- Supabase project set up

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Import"

### Step 2: Configure Environment Variables
In your Vercel project dashboard:

1. Go to Settings > Environment Variables
2. Add all variables from your `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=postgres
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=postgres
\`\`\`

### Step 3: Configure Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

### Step 5: Configure Custom Domain (Optional)
1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Step 6: Update Supabase Settings
1. Go to your Supabase project
2. Authentication > Settings
3. Add your production URL to Site URL and Redirect URLs

## Manual Deployment

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Start Production Server
\`\`\`bash
npm start
\`\`\`

### Using PM2 (Process Manager)
\`\`\`bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "interlink" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
\`\`\`

## Docker Deployment

### Dockerfile
\`\`\`dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
\`\`\`

### Docker Compose
\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    env_file:
      - .env.local
\`\`\`

### Build and Run
\`\`\`bash
# Build the image
docker build -t interlink .

# Run the container
docker run -p 3000:3000 --env-file .env.local interlink
\`\`\`

## Environment-Specific Configuration

### Production Environment Variables
\`\`\`env
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Production Database
POSTGRES_URL=your_production_postgres_url

# Production App URL
NEXT_PUBLIC_VERCEL_URL=https://your-domain.com
\`\`\`

### Staging Environment
Create separate Supabase project for staging:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
\`\`\`

## Database Migration

### Production Database Setup
1. Create production Supabase project
2. Run all SQL scripts in order
3. Set up RLS policies
4. Configure authentication settings

### Data Migration
\`\`\`sql
-- Export data from development
pg_dump development_db > backup.sql

-- Import to production
psql production_db < backup.sql
\`\`\`

## Performance Optimization

### Next.js Optimizations
\`\`\`javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
}

module.exports = nextConfig
\`\`\`

### Caching Strategy
- Static pages cached at CDN level
- API responses cached with appropriate headers
- Database queries optimized with proper indexing

## Monitoring and Logging

### Vercel Analytics
Enable Vercel Analytics for performance monitoring:
\`\`\`bash
npm install @vercel/analytics
\`\`\`

### Error Tracking
Set up error tracking with Sentry:
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

### Health Checks
Create health check endpoint:
\`\`\`typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date().toISOString() })
}
\`\`\`

## Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different keys for different environments
- Rotate keys regularly

### HTTPS
- Always use HTTPS in production
- Configure proper SSL certificates
- Set up HSTS headers

### Content Security Policy
\`\`\`javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
\`\`\`

## Backup Strategy

### Database Backups
\`\`\`bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
\`\`\`

### File Backups
- Static assets backed up to cloud storage
- Code backed up in version control
- Environment variables documented securely

## Rollback Strategy

### Quick Rollback
\`\`\`bash
# Vercel rollback to previous deployment
vercel --prod rollback
\`\`\`

### Database Rollback
- Keep database migration scripts
- Test rollback procedures
- Have restoration plan ready

## Troubleshooting Deployment Issues

### Common Issues

**Build Failures**
\`\`\`bash
# Clear cache and rebuild
rm -rf .next
npm run build
\`\`\`

**Environment Variable Issues**
- Check variable names for typos
- Ensure all required variables are set
- Verify variable values are correct

**Database Connection Issues**
- Check connection strings
- Verify network access
- Test database connectivity

**Performance Issues**
- Enable compression
- Optimize images
- Use proper caching headers
- Monitor bundle size

### Getting Help
- Check Vercel deployment logs
- Review Next.js build output
- Monitor application logs
- Use browser developer tools
