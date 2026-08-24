import { vi } from 'vitest';
import { readFileSync } from 'fs';

// Define __VERSION__ globally for tests (avoids vite define + oxc conflict)
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
vi.stubGlobal('__VERSION__', pkg.version);

/**
 * Vitest setup file
 *
 * timeguard has zero dependency on @js-temporal/polyfill — not even as a
 * devDependency. On Node.js >=26 (or any runtime with native Temporal),
 * globalThis.Temporal already exists and nothing here needs to do anything.
 * On an older Node used for local development, this loads a small,
 * dependency-free mock (./temporal-mock.ts) that covers enough of the
 * Temporal surface for the test suite to run — its own internal
 * `if (!globalThis.Temporal)` guard means it's a no-op wherever native
 * Temporal is already present, so real native Temporal always wins.
 */
if (globalThis.Temporal === undefined) {
  await import('./temporal-mock');
}

// Register all locales for tests (since core no longer auto-loads them)
import { LocaleManager } from '../src/locales/locale.manager';
import { ALL_LOCALES } from '../src/locales/index';
LocaleManager.getInstance().loadLocales(ALL_LOCALES);
