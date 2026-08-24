import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
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
 * Context to share global TimeGuard configuration across the React component tree.
 */
export const TimeGuardContext = createContext<ITimeGuardConfig | undefined>(
  undefined,
);

/**
 * React Provider to define default/global TimeGuard configurations.
 */
export function TimeGuardProvider({
  children,
  config,
}: {
  children: ReactNode;
  config?: ITimeGuardConfig;
}) {
  return React.createElement(
    TimeGuardContext.Provider,
    { value: config },
    children,
  );
}

/**
 * React Hook to safely retrieve the global TimeGuard configuration from Context.
 */
export function useTimeGuardConfig(): ITimeGuardConfig | undefined {
  return useContext(TimeGuardContext);
}

/**
 * React Hook to create a reactive TimeGuard instance.
 * Automatically updates when input or configuration changes.
 * Integrates global context configuration as a fallback.
 */
export function useTimeGuard(
  input?: unknown,
  config?: ITimeGuardConfig,
): TimeGuard {
  const globalConfig = useTimeGuardConfig();
  const activeConfig = config ?? globalConfig;
  const [tg, setTg] = useState(() => TimeGuard.from(input, activeConfig));

  useEffect(() => {
    setTg(TimeGuard.from(input, activeConfig));
  }, [
    input,
    activeConfig?.locale,
    activeConfig?.timezone,
    activeConfig?.strict,
  ]);

  return tg;
}

/**
 * React Hook to get a reactive TimeGuard instance representing the current time.
 * Automatically updates on a specified interval (default: 1000ms).
 * Integrates global context configuration as a fallback.
 */
export function useCurrentTime(options?: {
  interval?: number;
  config?: ITimeGuardConfig;
}): TimeGuard {
  const globalConfig = useTimeGuardConfig();
  const activeConfig = options?.config ?? globalConfig;
  const interval = options?.interval ?? DEFAULT_TICK_INTERVAL_MS;
  const [time, setTime] = useState(() => TimeGuard.now(activeConfig));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(TimeGuard.now(activeConfig));
    }, interval);
    return () => clearInterval(timer);
  }, [
    interval,
    activeConfig?.locale,
    activeConfig?.timezone,
    activeConfig?.strict,
  ]);

  return time;
}

/**
 * React Hook that returns a dynamic relative time string that updates periodically.
 * Integrates global context configuration as a fallback.
 */
export function useRelativeTime(
  date: unknown,
  options?: {
    interval?: number;
    locale?: string;
    numeric?: 'always' | 'auto';
  },
): string {
  const globalConfig = useTimeGuardConfig();
  const interval = options?.interval ?? DEFAULT_RELATIVE_INTERVAL_MS;
  const locale = options?.locale ?? globalConfig?.locale;
  const numeric = options?.numeric;
  const [relative, setRelative] = useState('');

  useEffect(() => {
    const update = () => {
      setRelative(computeRelativeTime(date, { locale, numeric }));
    };

    update();
    const timer = setInterval(update, interval);
    return () => clearInterval(timer);
  }, [date, interval, locale, numeric]);

  return relative;
}

/**
 * React Hook to create and manage reactive TimeRange instances.
 * Automatically updates when start, end, or configuration changes.
 */
export function useTimeRange(
  start: unknown,
  end: unknown,
  config?: ITimeGuardConfig,
): TimeRange {
  const globalConfig = useTimeGuardConfig();
  const activeConfig = config ?? globalConfig;
  const [range, setRange] = useState(() =>
    createTimeRangeFrom(start, end, activeConfig),
  );

  useEffect(() => {
    setRange(createTimeRangeFrom(start, end, activeConfig));
  }, [
    start,
    end,
    activeConfig?.locale,
    activeConfig?.timezone,
    activeConfig?.strict,
  ]);

  return range;
}
