// BGCA Sandbox — public surface of the module.
// Self-contained demo. No Supabase, no shared state with the production app.

export { default as BgcaRouter } from './components/BgcaRouter';

export const BGCA_CONFIG = {
  BASE_PATH: '/bgca',
} as const;
