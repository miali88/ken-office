# Quick Start Guide - Unified Office Add-in

## ✅ Fixed Issues

1. ✅ Added missing `src/common/index.ts` file
2. ✅ Updated backend configuration (uses main `app/` APIs, not separate backend)
3. ✅ Added webpack proxy to forward `/api` requests to `http://localhost:3001`

## 🚀 How to Run

### Step 1: Install Dependencies

```bash
cd unified-addin
npm install
```

### Step 2: Start the Main App Backend (in another terminal)

The unified add-in needs the main app's API endpoints to work:

```bash
cd app
pnpm dev
```

This starts the Next.js app on **port 3001** with all the API routes:
- `/api/word-agent/rewrite` - AI document rewriting
- `/api/cases/[caseId]/doc-gen` - Document generation
- Other case-related APIs

### Step 3: Start the Add-in Dev Server

```bash
cd unified-addin
npm run dev
```

This starts webpack dev server on **port 3000** (HTTPS) and proxies API requests to port 3001.

### Step 4: Load in Office

**For Word:**
```bash
npm run start:word
```

**For Outlook:**
```bash
npm run start:outlook
```

## 📝 What Was Fixed

### 1. Missing `index.ts` Export File

**Error:**
```
Module not found: Error: Can't resolve '../common'
```

**Fix:**
Created `/unified-addin/src/common/index.ts` with exports:
```typescript
export * from './types';
export * from './api-client';
export * from './utils';
```

### 2. Backend Configuration

**Issue:** Originally tried to use a separate `/backend` directory, but:
- Backend doesn't exist at root level
- Backend APIs are actually in `/app` (Next.js application)

**Fix:**
- Removed `dev-backend` script
- Updated README to clarify backend is in `app/`
- Added webpack proxy configuration

### 3. Webpack Proxy

Added proxy to `webpack.config.js` so API requests from the add-in go through port 3000 (HTTPS) and get forwarded to port 3001 (HTTP):

```javascript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  }
]
```

## 🧪 Testing

### Test Webpack Build
```bash
cd unified-addin
npm run build:dev
```

Should complete without errors.

### Test Dev Server
```bash
npm run dev
```

Should start on `https://localhost:3000` without port conflicts.

### Test in Word
1. Ensure `app` is running on port 3001
2. Start unified add-in: `npm run dev`
3. Load in Word: `npm run start:word`
4. Open the add-in in Word
5. Try the AI features

## 🔧 Port Configuration

- **Add-in Frontend:** Port 3000 (HTTPS, webpack dev server)
- **Main App Backend:** Port 3001 (HTTP, Next.js)
- **API Proxy:** Requests to `https://localhost:3000/api/*` → `http://localhost:3001/api/*`

## ⚠️ Common Issues

### "Port 3000 already in use"

Kill the process:
```bash
lsof -ti:3000 | xargs kill -9
```

### "Cannot reach backend"

1. Ensure `app` is running: `cd app && pnpm dev`
2. Check it's on port 3001
3. Verify webpack proxy is configured (see `webpack.config.js`)

### "Module not found" errors

Run `npm install` in `unified-addin/`

## 📚 Structure Summary

```
office-agent/
├── unified-addin/          # Unified Office Add-in (NEW)
│   ├── src/
│   │   ├── common/         # ✅ Now includes index.ts
│   │   ├── outlook/
│   │   ├── word/
│   │   ├── taskpane/
│   │   └── commands/
│   └── webpack.config.js   # ✅ Now has proxy config
│
├── app/                    # Main Next.js backend (API routes)
│   └── api/
│       ├── word-agent/
│       └── cases/
│
├── ken-email/              # Original (untouched)
└── ken-word/               # Original (untouched)
```

## ✨ Ready to Go!

Everything is now configured. Just:

1. `cd app && pnpm dev` (terminal 1)
2. `cd unified-addin && npm run dev` (terminal 2)
3. `npm run start:word` or `npm run start:outlook`

Happy coding! 🎉
