/**
 * TimeGuard — Qwik Integration
 *
 * Provides reactive signal-based wrappers for TimeGuard using Qwik's
 * resumable reactivity model. All hooks use `useSignal` and
 * `useVisibleTask$` with automatic cleanup for optimal performance.
 *
 * @example
 * ```tsx
 * import { component$ } from '@builder.io/qwik';
 * import { useCurrentTime, useRelativeTime } from '@bereasoftware/timeguard/qwik';
 *
 * export default component$(() => {
 *   const now = useCurrentTime({ interval: 1000 });
 *   const relative = useRelativeTime('2026-05-20T08:00:00');
 *
 *   return (
 *     <div>
 *       <h1>{now.value.format('HH:mm:ss')}</h1>
 *       <p>Published: {relative.value}</p>
 *     </div>
 *   );
 * });
 * ```
 */

import {
  type Signal,
  useSignal,
  useVisibleTask$,
  useTask$,
  isSignal,
} from '@builder.io/qwik';
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
 * Creates a Qwik Signal of a TimeGuard instance.
 * Uses `useTask$` to reactively update when input changes — pass a Signal
 * for `input` to make this actually track it via `track()`; a plain value
 * is used once and won't update on its own (`track()` only registers a
 * dependency when it reads a Signal's `.value`, not a closed-over plain
 * variable).
 * Must be called inside `component$`.
 */
export function useTimeGuard(
  input?: unknown,
  config?: ITimeGuardConfig,
): Signal<TimeGuard> {
  const tg = useSignal(
    TimeGuard.from(isSignal(input) ? input.value : input, config),
  );

  useTask$(({ track }) => {
    if (isSignal(input)) {
      const source = input;
      tg.value = TimeGuard.from(
        track(() => source.value),
        config,
      );
    } else {
      tg.value = TimeGuard.from(input, config);
    }
  });

  return tg;
}

/**
 * Creates a Qwik Signal of the current time that ticks on a specified
 * interval (default 1000ms). Uses `useVisibleTask$` for cleanup.
 * Must be called inside `component$`.
 */
export function useCurrentTime(options?: {
  interval?: number;
  config?: ITimeGuardConfig;
}): Signal<TimeGuard> {
  const interval = options?.interval ?? DEFAULT_TICK_INTERVAL_MS;
  const config = options?.config;
  const time = useSignal(TimeGuard.now(config));

  useVisibleTask$(({ cleanup }) => {
    const timer = setInterval(() => {
      time.value = TimeGuard.now(config);
    }, interval);

    cleanup(() => clearInterval(timer));
  });

  return time;
}

/**
 * Creates a Qwik Signal of a relative time string that recalculates
 * periodically (default every 60s).
 * Must be called inside `component$`.
 */
export function useRelativeTime(
  date: unknown,
  options?: {
    interval?: number;
    locale?: string;
    numeric?: 'always' | 'auto';
  },
): Signal<string> {
  const interval = options?.interval ?? DEFAULT_RELATIVE_INTERVAL_MS;
  const locale = options?.locale;
  const numeric = options?.numeric;

  const compute = () => computeRelativeTime(date, { locale, numeric });

  const relative = useSignal(compute());

  useVisibleTask$(({ cleanup }) => {
    const timer = setInterval(() => {
      relative.value = compute();
    }, interval);

    cleanup(() => clearInterval(timer));
  });

  return relative;
}

/**
 * Creates a Qwik Signal of a TimeRange instance.
 * Must be called inside `component$`.
 */
export function useTimeRange(
  start: unknown,
  end: unknown,
  config?: ITimeGuardConfig,
): Signal<TimeRange> {
  const range = useSignal(createTimeRangeFrom(start, end, config));

  useTask$(({ track }) => {
    track(() => start);
    track(() => end);
    range.value = createTimeRangeFrom(start, end, config);
  });

  return range;
}
