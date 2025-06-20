# Deployment Guide

This guide covers different deployment options for the Workouts Frontend application.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Build and deploy**
   ```bash
   pnpm build
   vercel --prod
   ```

3. **Configure build settings in vercel.json**
   ```json
   {
     "buildCommand": "pnpm build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

### Netlify

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or drag and drop the `dist` folder to Netlify dashboard**

### GitHub Pages

1. **Add deployment script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "pnpm build && gh-pages -d dist"
     }
   }
   ```

2. **Install gh-pages**
   ```bash
   pnpm add -D gh-pages
   ```

3. **Configure base path in vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/workouts-fe/',
     // ... other config
   })
   ```

4. **Deploy**
   ```bash
   pnpm deploy
   ```

## 🔧 Production Build

### Environment Variables

Create production environment configuration:

**.env.production**
```env
VITE_API_BASE_URL=https://workouts-api.yourdomain.com
VITE_APP_ENV=production
```

### Build Optimization

The Vite configuration is already optimized for production:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['svelte'],
          router: ['svelte-spa-router']
        }
      }
    },
    sourcemap: false,
    minify: 'terser'
  }
})
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Docker Commands

```bash
# Build image
docker build -t workouts-fe .

# Run container
docker run -p 80:80 workouts-fe

# Or with docker-compose
docker-compose up -d
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  workouts-fe:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## ☁️ Cloud Platform Deployments

### AWS S3 + CloudFront

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront for SPA routing**
   - Create error page for 404 → /index.html

### Google Cloud Platform

```bash
# Install gcloud CLI and build
pnpm build

# Deploy to Firebase Hosting
firebase deploy

# Or to Google Cloud Storage
gsutil -m rsync -r -d dist/ gs://your-bucket-name
```

### Azure Static Web Apps

```bash
# Install Azure CLI
pnpm build

# Deploy to Azure
az storage blob upload-batch -s dist -d '$web' --account-name yourstorageaccount
```

## 🔒 Security Considerations

### Content Security Policy

Add CSP headers for production:

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://workouts-api.yourdomain.com;">
```

### HTTPS Configuration

Ensure HTTPS is enforced:

```nginx
# In nginx.conf
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # ... rest of configuration
}
```

## 📊 Performance Optimization

### Pre-compression

Enable gzip compression:

```bash
# Install compression tools
pnpm add -D vite-plugin-compression

# Add to vite.config.ts
import { compression } from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    svelte(),
    compression()
  ]
})
```

### Service Worker (PWA)

```bash
# Install PWA plugin
pnpm add -D vite-plugin-pwa

# Configure in vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

## 🔍 Monitoring and Analytics

### Error Tracking

Add error tracking service:

```typescript
// In src/main.ts
window.addEventListener('error', (event) => {
  // Send to error tracking service
  console.error('Global error:', event.error);
});
```

### Analytics

Add analytics tracking:

```typescript
// In src/App.svelte
import { location } from 'svelte-spa-router';

$: {
  if ($location) {
    // Track page views
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: $location
    });
  }
}
```

## 🚦 Health Checks

### Basic Health Check Endpoint

Create a simple health check:

```html
<!-- public/health.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Health Check</title>
</head>
<body>
    <h1>OK</h1>
    <p>Service is healthy</p>
</body>
</html>
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: workouts-fe
spec:
  replicas: 3
  selector:
    matchLabels:
      app: workouts-fe
  template:
    metadata:
      labels:
        app: workouts-fe
    spec:
      containers:
      - name: workouts-fe
        image: workouts-fe:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health.html
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: workouts-fe-service
spec:
  selector:
    app: workouts-fe
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 📝 Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Build optimization enabled
- [ ] HTTPS configured
- [ ] Security headers added
- [ ] Error tracking implemented
- [ ] Analytics configured
- [ ] Performance monitoring setup
- [ ] Health checks configured
- [ ] Backup strategy implemented
- [ ] Domain configured
- [ ] CDN setup (if applicable)

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
      
    - name: Build
      run: pnpm build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

This deployment guide provides comprehensive options for deploying your Workouts Frontend application across various platforms and environments.
