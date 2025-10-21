// Global debug flag - automatically disabled in production builds
const IS_DEBUG_ENABLED = import.meta.env.DEV;

/**
 * Debug logger that only logs in development mode
 * Usage: debugLog('message', data)
 */
export const debugLog = (...args: any[]) => {
  if (IS_DEBUG_ENABLED) {
    console.log(...args);
  }
};

/**
 * Debug warning that only logs in development mode
 * Usage: debugWarn('message', data)
 */
export const debugWarn = (...args: any[]) => {
  if (IS_DEBUG_ENABLED) {
    console.warn(...args);
  }
};

/**
 * Debug info that only logs in development mode
 * Usage: debugInfo('message', data)
 */
export const debugInfo = (...args: any[]) => {
  if (IS_DEBUG_ENABLED) {
    console.info(...args);
  }
};

// Note: console.error is NOT wrapped as errors should be logged in production
// for monitoring and debugging purposes

