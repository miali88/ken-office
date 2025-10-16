# Kenneth AI - Unified Office Add-in

A unified Office Add-in that works across **Microsoft Word** and **Microsoft Outlook**, with runtime host detection and dynamic module loading.

## Architecture

```
unified-addin/
├── src/
│   ├── common/          # Shared utilities, types, API clients
│   ├── outlook/         # Outlook-specific features
│   ├── word/            # Word-specific features
│   ├── taskpane/        # Main entry point with host detection
│   └── commands/        # Office command handlers
├── assets/              # Shared icons and images
├── manifests/
│   ├── manifest-word.xml      # Word add-in manifest
│   └── manifest-outlook.xml   # Outlook add-in manifest
├── dist/                # Build output
└── package.json
```

## How It Works

The add-in uses **runtime host detection** to load the appropriate module:

1. `taskpane.ts` boots up with `Office.onReady()`
2. Detects host using `Office.context.host`
3. Dynamically imports the appropriate module:
   - `Office.HostType.Word` → loads `word/word-main.ts`
   - `Office.HostType.Outlook` → loads `outlook/outlook-main.ts`
4. Host-specific module injects its UI and functionality

This architecture allows:
- **Single codebase** for both hosts
- **Shared utilities** and API clients
- **Lazy loading** - only load what's needed
- **Clean separation** between host-specific logic

## Features

### Word Add-in
- **AI Autofill**: Extract placeholders and suggest values from case files
- **AI Rewrite**: Rewrite entire document with track changes
- **AI Chat**: Chat interface for document assistance
- Integration with backend API for case data

### Outlook Add-in
- **Email Summary**: AI-powered email summarization
- **Filing Information**: View and manage case filing data
- **Attachments**: Track attachment filing status

## Prerequisites

- Node.js (v16+)
- npm or pnpm
- Office 365 subscription (for testing)
- Backend server running (port 3001)

## Installation

```bash
cd unified-addin
npm install
```

## Development

### Start Development Server

```bash
# Start webpack dev server + backend
npm run dev

# Or separately:
npm run dev-server  # Frontend only
npm run dev-backend # Backend only (from ../backend)
```

### Load Add-in in Office

**For Word:**
```bash
npm run start:word
```

**For Outlook:**
```bash
npm run start:outlook
```

This will:
1. Start the dev server (if not running)
2. Side-load the manifest into the Office application
3. Open the application with the add-in loaded

### Manual Side-loading

**Word (Desktop):**
1. Open Word
2. Go to Insert > My Add-ins > Upload My Add-in
3. Browse to `manifests/manifest-word.xml`
4. Click Upload

**Outlook (Web):**
1. Open Outlook on the web
2. Go to Settings > View all Outlook settings > General > Manage add-ins
3. Click "+ Add from file"
4. Upload `manifests/manifest-outlook.xml`

## Building for Production

```bash
npm run build
```

This creates optimized bundles in the `dist/` directory.

## Project Structure Details

### Entry Points

- **taskpane.ts**: Main entry with host detection
- **commands.ts**: Office command functions (ribbon buttons)

### Shared Code (`src/common/`)

- **types.ts**: TypeScript interfaces and types
- **api-client.ts**: Unified API client for backend calls
- **utils.ts**: Helper functions (logging, DOM manipulation, etc.)

### Word Module (`src/word/`)

- **word-main.ts**: Word initialization and features
- **ai-rewrite.ts**: Document rewriting logic
- **chat-app.tsx**: React chat widget
- **chat-widget.tsx**: Chat UI components
- **taskpane.css**: Word-specific styles

### Outlook Module (`src/outlook/`)

- **outlook-main.ts**: Outlook initialization and features
- **outlook.css**: Outlook-specific styles

## Backend Integration

The add-in connects to backend APIs for:
- Case data retrieval
- AI processing (doc-gen, rewrite, chat)
- Memory/context management

**Backend APIs are in the main `app/` directory** - the Next.js application that contains:
- `/app/api/word-agent/rewrite/route.ts` - AI rewrite endpoint
- `/app/api/cases/[caseId]/doc-gen/route.ts` - Document generation endpoint
- Other case and AI-related APIs

**Important:** Start the main `app/` server (port 3001) separately:
```bash
cd app
pnpm dev
```

Then the unified add-in will proxy API requests through webpack dev server.

## Manifests

Two separate manifests are required because Office doesn't allow mixing manifest types:

### manifest-word.xml
- Type: `TaskPaneApp`
- Host: `Document` (Word)
- Extension Points: Primary command surface

### manifest-outlook.xml
- Type: `MailApp`
- Host: `Mailbox` (Outlook)
- Extension Points: Message read command surface

Both manifests point to the same web assets (taskpane.html, commands.html).

## Environment Variables

Create a `.env` file in the root:

```env
BACKEND_URL=https://localhost:3001
OPENAI_API_KEY=sk-...
```

## Debugging

### Browser DevTools

**Word/Outlook Desktop:**
- Right-click in the task pane
- Select "Inspect"

**Outlook Web:**
- Press F12 for browser DevTools

### Logs

Check browser console for detailed logs:
- `[Taskpane]` - Main entry point
- `[Word]` - Word-specific logs
- `[Outlook]` - Outlook-specific logs

## Common Issues

### "Add-in not loading"
- Ensure dev server is running on port 3000
- Check HTTPS certificates (Office requires HTTPS)
- Verify manifest XML is valid: `npm run validate:word` or `npm run validate:outlook`

### "Cannot connect to backend"
- Ensure backend server is running on port 3001
- Check CORS settings in backend
- Verify `AppDomains` in manifest includes backend URL

### "Module not found errors"
- Run `npm install` to ensure all dependencies are installed
- Clear webpack cache: `rm -rf dist && npm run build:dev`

## Scripts Reference

- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run dev` - Start dev server + backend
- `npm run dev-server` - Frontend dev server only
- `npm run dev-backend` - Backend dev server only
- `npm run start:word` - Side-load Word add-in
- `npm run start:outlook` - Side-load Outlook add-in
- `npm run stop` - Stop debugging
- `npm run validate:word` - Validate Word manifest
- `npm run validate:outlook` - Validate Outlook manifest
- `npm run watch` - Watch mode for development

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **React** - UI components (chat widget)
- **Webpack** - Module bundler
- **Babel** - JavaScript transpiler
- **Office.js** - Office Add-ins API
- **Express** - Backend server (in /backend)
- **Mastra AI** - AI agent framework (in /backend)

## Contributing

1. Make changes only in `/unified-addin` - do not modify `/ken-email` or `/ken-word`
2. Test in both Word and Outlook before committing
3. Update this README if adding new features

## License

MIT

## Support

For issues or questions, contact Kenneth AI support.
