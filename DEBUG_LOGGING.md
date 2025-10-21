# Debug Logging Configuration

## Overview
All debug console statements in the codebase are now controlled by a centralized debug utility that automatically disables logging in production builds.

## Debug Utility (`src/utils/debug.ts`)

The debug utility provides three wrapper functions:
- `debugLog()` - Replaces `console.log()` for debug messages
- `debugWarn()` - Replaces `console.warn()` for debug warnings
- `debugInfo()` - Replaces `console.info()` for debug info

These functions only execute in **development mode** (`npm run dev`) and are automatically disabled in **production builds** (`npm run build`).

## Files Updated

### Core Services
- ✅ `src/lib/supabase.ts` - Supabase client configuration debug logs
- ✅ `src/services/surveyService.ts` - Survey data saving/loading debug logs
- ✅ `src/services/universityService.ts` - University data operations debug logs
- ✅ `src/services/analyticsService.ts` - Analytics calculation debug logs

### UI Components
- ✅ `src/components/Survey/sections/FlourishingSection.tsx` - Domain selection debug logs
- ✅ `src/components/Survey/sections/WrapUpSection.tsx` - Survey completion debug logs
- ✅ `src/modules/superadmin/components/SessionRow.tsx` - Session data debug logs

## Error Logging

**Important:** `console.error()` statements were **intentionally NOT wrapped** and will continue to log in production. This is by design for:
- Error monitoring and tracking
- Production debugging
- Alert systems integration
- User support and troubleshooting

Files with production error logging:
- All service files (`analyticsService.ts`, `surveyService.ts`, `universityService.ts`, etc.)
- All component error handlers
- SuperAdmin services

## How It Works

```typescript
// Development mode (npm run dev)
debugLog('Test message'); // ✅ Logs to console

// Production build (npm run build)
debugLog('Test message'); // ❌ Does NOT log (code is skipped)
```

## Manual Control

To override the automatic behavior, edit `src/utils/debug.ts`:

```typescript
// Force enable (always show debug logs):
const IS_DEBUG_ENABLED = true;

// Force disable (never show debug logs):
const IS_DEBUG_ENABLED = false;

// Automatic (recommended - current setting):
const IS_DEBUG_ENABLED = import.meta.env.DEV;
```

## Usage Guidelines

### DO Use `debugLog()` for:
- Development debugging
- Data inspection
- Flow tracing
- Feature development logs
- Temporary debugging

### DO Use `console.error()` for:
- Production errors
- Failed API calls
- Database errors
- User-facing errors
- Critical failures

### Example

```typescript
import { debugLog } from '../utils/debug';

// Debug logging (disabled in production)
debugLog('Processing user data:', userData);

// Error logging (enabled in production)
try {
  await saveData();
} catch (error) {
  console.error('Failed to save data:', error); // ✅ Logs in production
}
```

## Verification

To verify debug logs are disabled in production:
1. Run `npm run build`
2. Serve the build: `npm run preview`
3. Open browser console - no debug messages should appear
4. Only error messages (if any) should be visible

---

**Last Updated:** October 2025

