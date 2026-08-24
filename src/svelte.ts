/**
 * TimeGuard — Svelte 5 Integration
 *
 * Provides reactive stores and lifecycle-managed wrappers for TimeGuard.
 * Compatible with both Svelte 4 (`$store` auto-subscription) and
 * Svelte 5 (`$state` + `get()` from stores).
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useCurrentTime, useRelativeTime } from '@bereasoftware/timeguard/svelte';
 *
 *   const now = useCurrentTime({ interval: 1000 });
 *   const relative = useRelativeTime('2026-05-20T08:00:00');
 * </script>
 *
 * <h1>{$now.format('HH:mm:ss')}</h1>
 * <p>Published: {$relative}</p>
 * ```
 */

import { writable, readable, derived, type Readable } from 'svelte/store';
import {
  TimeGuard,
  type ITimeGuardConfig,
  type TimeRange,
  DEFAULT_TICK_INTERVAL_MS,
  DEFAULT_RELATIVE_INTERVAL_MS,
  computeRelativeTime,
  createTimeRangeFrom,
} from './core';

/**
 * Duck-type check: is this a Svelte store (has `subscribe`)?
 */
function isStore<T>(val: unknown): val is Readable<T> {
  return (
    typeof val === 'object' &&
    val !== null &&
    'subscribe' in val &&
    typeof (val as { subscribe: Function }).subscribe === 'function'
  );
}

/**
 * Coerce a plain value or a store into a Readable store.
 */
function toStore<T>(val: T | Readable<T>): Readable<T> {
  return isStore(val) ? val : readable(val);
}

/**
 * Injection-key symbol to retrieve a global TimeGuard configuration
 * provided at the app root. Consumers use `getContext(TimeGuardConfigKey)`.
 */
export const TimeGuardConfigKey = Symbol('TimeGuardConfig');

/**
 * Creates a reactive readable store of a TimeGuard instance.
 * Automatically updates when `input` changes (supports both plain values
 * and Svelte stores as input — pass a `Readable` for full reactivity).
 * Integrates global config from `getContext(TimeGuardConfigKey)` as fallback.
 *
 * ```svelte
 * <script>
 *   import { writable } from 'svelte/store';
 *   import { useTimeGuard } from '@bereasoftware/timeguard/svelte';
 *   import { TimeGuard } from '@bereasoftware/timeguard';
 *
 *   // Static input — no reactivity needed
 *   const tg = useTimeGuard('2026-05-20');
 *
 *   // Reactive input — pass a store
 *   const dateStore = writable('2026-05-20');
 *   const tg2 = useTimeGuard(dateStore);
 * </script>
 *
 * <p>{$tg.format('dddd, DD MMMM YYYY')}</p>
 * <p>{$tg2.format('dddd, DD MMMM YYYY')}</p>
 * ```
 */
export function useTimeGuard(
  input?: unknown | Readable<unknown>,
  config?: ITimeGuardConfig,
): Readable<TimeGuard> {
  if (isStore(input)) {
    return derived(input, ($val: unknown) => TimeGuard.from($val, config));
  }
  return readable(TimeGuard.from(input, config));
}

/**
 * Creates a readable store of the current time that ticks on a specified
 * interval (default 1000ms). Automatically clears the interval on
 * component destroy.
 *
 * ```svelte
 * <script>
 *   import { useCurrentTime } from '@bereasoftware/timeguard/svelte';
 *   const now = useCurrentTime({ interval: 1000 });
 * </script>
 * <p>{$now.format('HH:mm:ss')}</p>
 * ```
 */
export function useCurrentTime(options?: {
  interval?: number;
  config?: ITimeGuardConfig;
}): Readable<TimeGuard> {
  const interval = options?.interval ?? DEFAULT_TICK_INTERVAL_MS;
  const config = options?.config;

  const store = writable(TimeGuard.now(config), () => {
    const timer = setInterval(() => {
      store.set(TimeGuard.now(config));
    }, interval);

    return () => {
      clearInterval(timer);
    };
  });

  return { subscribe: store.subscribe };
}

/**
 * Creates a readable store of a relative time string that recalculates
 * periodically (default every 60s).
 *
 * ```svelte
 * <script>
 *   import { useRelativeTime } from '@bereasoftware/timeguard/svelte';
 *   const relative = useRelativeTime('2026-05-20T08:00:00', { locale: 'es' });
 * </script>
 * <p>{$relative}</p>
 * ```
 */
export function useRelativeTime(
  date: unknown,
  options?: {
    interval?: number;
    locale?: string;
    numeric?: 'always' | 'auto';
  },
): Readable<string> {
  const interval = options?.interval ?? DEFAULT_RELATIVE_INTERVAL_MS;
  const locale = options?.locale;
  const numeric = options?.numeric;

  const compute = () => computeRelativeTime(date, { locale, numeric });

  const store = writable(compute(), () => {
    const timer = setInterval(() => {
      store.set(compute());
    }, interval);

    return () => {
      clearInterval(timer);
    };
  });

  return { subscribe: store.subscribe };
}

/**
 * Creates a readable store of a TimeRange instance.
 * Recalculates reactively when `start` or `end` change (supports both
 * plain values and Svelte stores).
 *
 * ```svelte
 * <script>
 *   import { writable } from 'svelte/store';
 *   import { useTimeRange } from '@bereasoftware/timeguard/svelte';
 *
 *   // Static range
 *   const range = useTimeRange('2026-05-20', '2026-06-01');
 *
 *   // Reactive range
 *   const start = writable('2026-05-20');
 *   const end = writable('2026-06-01');
 *   const range2 = useTimeRange(start, end);
 * </script>
 *
 * <p>Duration: {$range.toDuration().humanize()}</p>
 */
export function useTimeRange(
  start: unknown | Readable<unknown>,
  end: unknown | Readable<unknown>,
  config?: ITimeGuardConfig,
): Readable<TimeRange> {
  const startStore = toStore(start);
  const endStore = toStore(end);

  return derived([startStore, endStore], ([$start, $end]: [unknown, unknown]) =>
    createTimeRangeFrom($start, $end, config),
  );
}
