/**
 * timeguard - Modern date/time library using the native Temporal API
 * Zero-polyfill edition (~5KB gzip, zero dependencies — not even a
 * @js-temporal/polyfill devDependency: types come from TypeScript's own
 * ambient "ESNext.Temporal" lib, see tsconfig.json)
 *
 * This package never imports a Temporal polyfill, at runtime or even for
 * types, and assumes globalThis.Temporal is already available in the
 * environment. Requires one of:
 *   - Node.js >=26.0.0 (Temporal enabled by default, unflagged, since v26.0.0)
 *   - A browser with native Temporal (Chrome/Edge >=144, Firefox >=139)
 *   - Any runtime where you've assigned your own Temporal polyfill to
 *     globalThis.Temporal *before* importing this package
 *
 * On an unsupported runtime, calling any TimeGuard method throws immediately
 * with an actionable error instead of silently misbehaving — see
 * `TemporalAdapter`'s `useTemporal()` in ./adapters/temporal.adapter.ts.
 *
 * timeguard shares its entire implementation (this same `./core`) with its
 * sibling package `@bereasoftware/time-guard`, which auto-loads
 * @js-temporal/polyfill instead of assuming a native one — same API surface,
 * same functionality, different runtime contract. If you're not sure your
 * target runtime has native Temporal, use that package instead.
 *
 * @author Berea-Soft
 * @license MIT
 */

export * from './core';
