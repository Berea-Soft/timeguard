/**
 * TimeGuard Relative Time Plugin
 * Adds human-readable time differences (e.g., "2 hours ago", "in 3 days")
 * Follows SOLID principles and Temporal API standards
 */

import type { ITimeGuardPlugin } from '../../types';
import type { TimeGuard } from '../../index';
import type {
  RelativeTimeConfig,
  RelativeTimeFormats,
  RelativeTimeThreshold,
} from './types';

const DEFAULT_THRESHOLDS: RelativeTimeThreshold[] = [
  { l: 's', r: 44, d: 'second' },
  { l: 'm', r: 89 },
  { l: 'mm', r: 44, d: 'minute' },
  { l: 'h', r: 89 },
  { l: 'hh', r: 21, d: 'hour' },
  { l: 'd', r: 35 },
  { l: 'dd', r: 25, d: 'day' },
  { l: 'M', r: 45 },
  { l: 'MM', r: 10, d: 'month' },
  { l: 'y', r: 17 },
  { l: 'yy', d: 'year' },
];

const DEFAULT_FORMATS: RelativeTimeFormats = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years',
};

export class RelativeTimePlugin implements ITimeGuardPlugin {
  name = 'relative-time';
  version = '1.0.0';

  private config: RelativeTimeConfig;
  private formats: RelativeTimeFormats;

  constructor(config?: RelativeTimeConfig) {
    this.config = {
      thresholds: config?.thresholds || DEFAULT_THRESHOLDS,
      rounding: config?.rounding || Math.round,
    };
    this.formats = DEFAULT_FORMATS;
  }

  /**
   * Install plugin into TimeGuard
   */
  install(TimeGuardClass: typeof TimeGuard): void {
    const plugin = this;

    /**
     * Get relative time string (e.g., "2 hours ago")
     */
    (
      TimeGuardClass.prototype as unknown as {
        fromNow: (withoutSuffix?: boolean) => string;
      }
    ).fromNow = function (withoutSuffix?: boolean): string {
      return plugin.formatRelativeTime(
        this as unknown as TimeGuard,
        false,
        withoutSuffix,
      );
    };

    (
      TimeGuardClass.prototype as unknown as {
        toNow: (withoutSuffix?: boolean) => string;
      }
    ).toNow = function (withoutSuffix?: boolean): string {
      return plugin.formatRelativeTime(
        this as unknown as TimeGuard,
        true,
        withoutSuffix,
      );
    };

    (
      TimeGuardClass.prototype as unknown as {
        humanize: (other?: TimeGuard, withoutSuffix?: boolean) => string;
      }
    ).humanize = function (other?: TimeGuard, withoutSuffix?: boolean): string {
      if (other) {
        return plugin.formatRelativeTime(
          this as unknown as TimeGuard,
          other.isAfter(this as unknown as TimeGuard),
          withoutSuffix,
        );
      }
      return plugin.formatRelativeTime(
        this as unknown as TimeGuard,
        false,
        withoutSuffix,
      );
    };
  }

  /**
   * Reverse install() — none of fromNow/toNow/humanize pre-exist on
   * TimeGuard, so undoing this is just deleting them, not restoring a
   * prior value.
   */
  uninstall(TimeGuardClass: typeof TimeGuard): void {
    delete (TimeGuardClass.prototype as unknown as Record<string, unknown>)
      .fromNow;
    delete (TimeGuardClass.prototype as unknown as Record<string, unknown>)
      .toNow;
    delete (TimeGuardClass.prototype as unknown as Record<string, unknown>)
      .humanize;
  }

  /**
   * Format relative time
   */
  private formatRelativeTime(
    date: TimeGuard,
    isFuture: boolean,
    withoutSuffix?: boolean,
  ): string {
    const now = (date.constructor as typeof TimeGuard).now();
    const diff = now.diff(date, 'millisecond');
    const absDiff = Math.abs(diff);
    const isFromNow = diff > 0;
    const actualIsFuture = isFuture ?? !isFromNow;

    const result = this.getRelativeTimeString(absDiff);

    if (withoutSuffix) {
      return result;
    }

    const suffix = actualIsFuture ? this.formats.future : this.formats.past;
    return suffix.replace('%s', result);
  }

  /**
   * Get relative time string based on milliseconds
   */
  private getRelativeTimeString(milliseconds: number): string {
    const thresholds = this.config.thresholds || DEFAULT_THRESHOLDS;
    const rounding = this.config.rounding || Math.round;

    // Thresholds without an explicit `d` (e.g. 'm', 'h', 'd', 'M', 'y') carry
    // forward the unit of the last entry that specified one, and `r` is
    // interpreted in THAT unit — matching dayjs's relativeTime convention
    // this table was written against. `r` is never in a fixed unit like
    // milliseconds/seconds regardless of position.
    let unit = 'second';
    for (let i = 0; i < thresholds.length; i++) {
      const threshold = thresholds[i];
      unit = threshold.d || unit;
      const value = milliseconds / this.getUnitMilliseconds(unit);
      const isLast = i === thresholds.length - 1;

      if (isLast || threshold.r === undefined || value <= threshold.r) {
        const roundedValue = rounding(value);
        const label = threshold.l;
        const format =
          this.formats[label as keyof typeof this.formats] || label;

        if (typeof format === 'string') {
          return format.includes('%d')
            ? format.replace('%d', String(roundedValue))
            : format;
        }

        return format;
      }
    }

    // Fallback (unreachable — the last threshold always matches above)
    return `${rounding(milliseconds / 1000)} seconds`;
  }

  /**
   * Get milliseconds per unit
   */
  private getUnitMilliseconds(unit: string): number {
    const msMap: Record<string, number> = {
      second: 1000,
      minute: 1000 * 60,
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
      month: 1000 * 60 * 60 * 24 * 30,
      year: 1000 * 60 * 60 * 24 * 365,
    };
    return msMap[unit] || 1;
  }

  /**
   * Set format strings
   */
  setFormats(formats: Partial<RelativeTimeFormats>): void {
    Object.assign(this.formats, formats);
  }

  /**
   * Get current formats
   */
  getFormats(): RelativeTimeFormats {
    return { ...this.formats };
  }
}

/**
 * Create and export default instance
 */
export default new RelativeTimePlugin();
