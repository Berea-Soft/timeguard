/**
 * Temporal Adapter - Convert to/from JavaScript's Temporal API
 * Single Responsibility: Handle all Temporal API conversions
 * Note: this package never loads a polyfill — Temporal must already exist
 * on globalThis (native runtime support, or one the consumer loaded).
 */

import type {
  TemporalPlainDateTime,
  TemporalZonedDateTime,
  TemporalLike,
} from '../types';

type TemporalType = typeof Temporal;

// Cache to prevent repeated loading attempts
let temporalCache: TemporalType | null = null;

/**
 * Get Temporal from globalThis or imported module
 */
function useTemporal(): TemporalType {
  if (temporalCache) {
    return temporalCache;
  }

  const TemporalLoaded = (globalThis as Record<string, unknown>).Temporal as
    TemporalType | undefined;

  if (!TemporalLoaded) {
    throw new Error(
      'Temporal API not found on globalThis. @bereasoftware/timeguard never loads a polyfill — ' +
        'either run on Node.js >=26 (or a browser with native Temporal support: Chrome/Edge >=144, ' +
        'Firefox >=139), or assign your own Temporal polyfill to globalThis.Temporal before importing ' +
        'this package. If you need auto-polyfilling instead, use "@bereasoftware/time-guard" ' +
        '(same API, loads @js-temporal/polyfill automatically).',
    );
  }

  temporalCache = TemporalLoaded;
  return TemporalLoaded;
}

/**
 * Adapter for Temporal date/time operations
 */
export class TemporalAdapter {
  /**
   * Parse various input formats to Temporal.PlainDateTime
   */
  static parseToPlainDateTime(input: unknown): TemporalPlainDateTime {
    const Temporal = useTemporal();

    if (this.isPlainDateTime(input)) {
      return input;
    }

    if (this.isZonedDateTime(input)) {
      return (input as TemporalLike).toPlainDateTime();
    }

    if (this.isPlainDate(input)) {
      return (input as Temporal.PlainDate).toPlainDateTime({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    }

    if (this.isPlainTime(input)) {
      const now = Temporal.Now.plainDateTimeISO();
      return now.withPlainTime(input as Temporal.PlainTime);
    }

    if (
      input !== null &&
      typeof input === 'object' &&
      'getTime' in input &&
      typeof (input as Date).getTime === 'function'
    ) {
      return this.fromDate(input as Date);
    }

    if (typeof input === 'number') {
      return this.fromUnix(input);
    }

    if (typeof input === 'string') {
      return this.parseISOString(input);
    }

    if (typeof input === 'object' && input !== null) {
      return this.fromObject(input as Record<string, unknown>);
    }

    return Temporal.Now.plainDateTimeISO();
  }

  /**
   * Convert JavaScript Date to Temporal.PlainDateTime
   */
  static fromDate(date: Date): TemporalPlainDateTime {
    const Temporal = useTemporal();
    const iso = date.toISOString();
    const [datePart, timePart] = iso.split('T');
    return Temporal.PlainDateTime.from(datePart + 'T' + timePart.slice(0, -1));
  }

  /**
   * Convert Unix timestamp (milliseconds) to Temporal.PlainDateTime
   */
  static fromUnix(timestamp: number): TemporalPlainDateTime {
    return this.fromDate(new Date(timestamp));
  }

  /**
   * Parse ISO string to Temporal.PlainDateTime
   */
  static parseISOString(iso: string): TemporalPlainDateTime {
    const Temporal = useTemporal();
    try {
      // Try as full ISO datetime (with T or space separator)
      if (iso.includes('T') || / \d{2}:\d{2}/.test(iso)) {
        // Normalize space to T, and strip any offset/Z designator —
        // Temporal.PlainDateTime.from() rejects them outright since a
        // PlainDateTime is offset-naive (matches fromDate()'s handling).
        const normalized = iso
          .replace(' ', 'T')
          .replace(/(?:Z|[+-]\d{2}:\d{2})$/i, '');
        return Temporal.PlainDateTime.from(normalized);
      }
      // Try as date only
      return Temporal.PlainDate.from(iso).toPlainDateTime({ hour: 0 });
    } catch {
      return Temporal.Now.plainDateTimeISO();
    }
  }

  /**
   * Create from object with date components
   */
  static fromObject(obj: Record<string, unknown>): TemporalPlainDateTime {
    const Temporal = useTemporal();
    const year = obj.year || Temporal.Now.plainDateISO().year;
    const month = obj.month || 1;
    const day = obj.day || 1;
    const hour = obj.hour || 0;
    const minute = obj.minute || 0;
    const second = obj.second || 0;
    const millisecond = obj.millisecond || 0;

    return Temporal.PlainDateTime.from({
      year: this.toFiniteInteger(year),
      month: this.toFiniteInteger(month),
      day: this.toFiniteInteger(day),
      hour: this.toFiniteInteger(hour),
      minute: this.toFiniteInteger(minute),
      second: this.toFiniteInteger(second),
      millisecond: this.toFiniteInteger(millisecond),
    });
  }

  /**
   * Convert Temporal.PlainDateTime to JavaScript Date
   */
  static toDate(temporal: TemporalPlainDateTime | TemporalZonedDateTime): Date {
    const plainDT = this.toPlainDateTime(temporal);
    return new Date(plainDT.toString());
  }

  /**
   * Convert to Unix timestamp (milliseconds)
   */
  static toUnix(
    temporal: TemporalPlainDateTime | TemporalZonedDateTime,
  ): number {
    const plainDT = this.toPlainDateTime(temporal);
    // Use UTC to avoid timezone offset issues
    return Date.UTC(
      plainDT.year,
      plainDT.month - 1,
      plainDT.day,
      plainDT.hour,
      plainDT.minute,
      plainDT.second,
      plainDT.millisecond,
    );
  }

  /**
   * Convert to ISO string
   */
  static toISOString(
    temporal: TemporalPlainDateTime | TemporalZonedDateTime,
  ): string {
    if (this.isZonedDateTime(temporal)) {
      // A real offset/zone is attached (e.g. TimeGuard.now(), or after
      // .timezone()) — convert to the actual UTC instant instead of
      // just relabeling local wall-clock digits with a trailing 'Z',
      // which used to make e.g. TimeGuard.now().toISOString() lie about
      // being UTC (it was really local time in a UTC costume).
      return temporal.toInstant().toString({ smallestUnit: 'millisecond' });
    }
    // No zone info at all (bare PlainDateTime, e.g. TimeGuard.from(iso
    // string with no offset)) — there's no real timezone to convert
    // from, so format the wall-clock digits as-is with a trailing 'Z'
    // (unchanged, pre-existing behavior for these offset-naive inputs).
    // Force millisecond precision — Temporal's toString() omits the
    // fractional part entirely when it's zero, unlike Date#toISOString()
    // which always shows `.000`.
    return (
      this.toPlainDateTime(temporal).toString({
        smallestUnit: 'millisecond',
      }) + 'Z'
    );
  }

  /**
   * Ensure we have a PlainDateTime
   */
  static toPlainDateTime(
    temporal: TemporalPlainDateTime | TemporalZonedDateTime,
  ): TemporalPlainDateTime {
    if (this.isPlainDateTime(temporal)) {
      return temporal;
    }
    return (temporal as TemporalZonedDateTime).toPlainDateTime();
  }

  /**
   * Type guards
   */
  static isPlainDateTime(obj: unknown): obj is TemporalPlainDateTime {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'year' in obj &&
      'month' in obj &&
      'day' in obj &&
      'hour' in obj &&
      // A real Temporal.ZonedDateTime also has year/month/day/hour —
      // exclude it explicitly so this only matches genuine, offset-naive
      // PlainDateTime values (see isZonedDateTime below).
      !('timeZoneId' in obj)
    );
  }

  static isZonedDateTime(obj: unknown): obj is TemporalZonedDateTime {
    // This polyfill's Temporal.ZonedDateTime exposes `timeZoneId`, not
    // `timeZone` — the old check here never matched a real instance,
    // silently defeating every isZonedDateTime()-guarded branch.
    return obj !== null && typeof obj === 'object' && 'timeZoneId' in obj;
  }

  static isPlainDate(obj: unknown): obj is Temporal.PlainDate {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'year' in obj &&
      'month' in obj &&
      'day' in obj &&
      !('hour' in obj) &&
      'toPlainDateTime' in obj
    );
  }

  static isPlainTime(obj: unknown): obj is Temporal.PlainTime {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'hour' in obj &&
      !('year' in obj)
    );
  }

  private static toFiniteInteger(value: unknown): number {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      throw new Error(`Temporal error: Expected finite integer, got ${value}`);
    }
    return Math.trunc(num);
  }

  /**
   * Validate that a PlainDateTime has finite integer components
   */
  private static validatePlainDateTime(dt: TemporalPlainDateTime): void {
    const fields = [
      'year',
      'month',
      'day',
      'hour',
      'minute',
      'second',
      'millisecond',
    ] as const;
    for (const field of fields) {
      const value = dt[field];
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        !Number.isInteger(value)
      ) {
        throw new Error(
          `Temporal error: Expected finite integer for ${field}, got ${value}`,
        );
      }
    }
  }

  /**
   * Get current time as PlainDateTime
   */
  static now(): TemporalPlainDateTime {
    const Temporal = useTemporal();
    return Temporal.Now.plainDateTimeISO();
  }

  /**
   * Get current time as a ZonedDateTime, carrying real offset/zone info.
   * With no `timezone`, uses the system's own default zone (still a real
   * zone, not the offset-naive PlainDateTime `now()` above returns) —
   * this is what TimeGuard.now() uses, so toISOString()/getOffset() can
   * perform a genuine conversion instead of mislabeling local time as UTC.
   */
  static nowInTimezone(timezone?: string): TemporalZonedDateTime {
    const Temporal = useTemporal();
    return Temporal.Now.zonedDateTimeISO(timezone);
  }

  /**
   * Compare two Temporal.PlainDateTime objects
   * Returns: -1 if dt1 < dt2, 0 if equal, 1 if dt1 > dt2
   * Uses ISO string comparison as fallback for polyfills that don't have Temporal.PlainDateTime.compare
   */
  static compare(
    dt1: TemporalPlainDateTime,
    dt2: TemporalPlainDateTime,
  ): number {
    const Temporal = useTemporal();

    // Validate both date times have finite integer components
    this.validatePlainDateTime(dt1);
    this.validatePlainDateTime(dt2);

    // Try using Temporal.PlainDateTime.compare if available
    if (
      Temporal.PlainDateTime &&
      typeof Temporal.PlainDateTime.compare === 'function'
    ) {
      return Temporal.PlainDateTime.compare(dt1, dt2);
    }

    // Fallback: compare as ISO strings (which works for PlainDateTime)
    const iso1 = dt1.toString();
    const iso2 = dt2.toString();

    if (iso1 < iso2) {
      return -1;
    }
    if (iso1 > iso2) {
      return 1;
    }
    return 0;
  }
}
