/**
 * TimeGuard - Modern date/time library using Temporal API
 * Core Implementation (zero-dependency, polyfill-erased type-space)
 *
 * @author Berea-Soft
 * @license MIT
 */

import type {
  ITimeGuard,
  ITimeGuardConfig,
  Unit,
  FormatPreset,
  IRoundOptions,
  IDurationOptions,
  DurationParts,
  TemporalPlainDateTimePolyfill,
  TemporalZonedDateTimePolyfill,
  IDiffResult,
  IDiffOptions,
  IDurationExplanation,
  IFormattableDuration,
  TemporalPlainDateTime,
  TemporalZonedDateTime,
  TemporalDuration,
} from './types';
import { TemporalAdapter } from './adapters/temporal.adapter';
import { DateFormatter } from './formatters/date.formatter';
import {
  formatZeroDuration,
  joinDurationParts,
  getDurationUnitLabel,
} from './utils/duration-locale';

import { LocaleManager, EN_LOCALE, ES_LOCALE } from './locales/locale.manager';

// --- Internal Constants and Helpers (from timeguard.ts) ---

type TemporalDateTime = Temporal.PlainDateTime | Temporal.ZonedDateTime;

/** Numeric field names shared by every non-`'week'` {@link Unit} on `Temporal.PlainDateTime`. */
type GetNumericField =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'microsecond'
  | 'nanosecond';

/** Plural numeric field names on `Temporal.Duration`, keyed by every {@link Unit}. */
type DurationPluralField =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds'
  | 'microseconds'
  | 'nanoseconds';

// Time conversion constants (hoisted to avoid recalculation)
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;
const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;
const MS_PER_MONTH = DAYS_PER_MONTH * MS_PER_DAY;
const MS_PER_YEAR = DAYS_PER_YEAR * MS_PER_DAY;

// Hoisted constants
const ZERO_DIFF_DAYS = ' days';

/**
 * Calculate total milliseconds from duration parts using hoisted constants
 */
function calculateTotalMs(duration: Partial<DurationParts>): number {
  return (
    (duration.years || 0) * MS_PER_YEAR +
    (duration.months || 0) * MS_PER_MONTH +
    (duration.weeks || 0) * MS_PER_WEEK +
    (duration.days || 0) * MS_PER_DAY +
    (duration.hours || 0) * MS_PER_HOUR +
    (duration.minutes || 0) * MS_PER_MINUTE +
    (duration.seconds || 0) * MS_PER_SECOND +
    (duration.milliseconds || 0)
  );
}

/**
 * Diff result object that allows chaining with .as()
 *
 * Supports two modes:
 * - 'exact': Returns precise time differences
 * - 'calendar': Returns calendar-aware breakdown
 */
class DiffResult implements IDiffResult, IFormattableDuration {
  private _value: number;
  private _tg1: TimeGuard;
  private _tg2: TimeGuard;
  private _mode: 'calendar' | 'exact';
  private _breakdownData: DurationParts | null;
  private _locale: string;

  constructor(
    value: number,
    tg1: TimeGuard,
    tg2: TimeGuard,
    mode: 'calendar' | 'exact' = 'exact',
    breakdownData?: DurationParts,
    locale?: string,
  ) {
    this._value = value;
    this._tg1 = tg1;
    this._tg2 = tg2;
    this._mode = mode;
    this._breakdownData = breakdownData || null;
    this._locale = locale || 'en';
  }

  as(unit: Unit): number {
    return this._tg1.diff(this._tg2, unit);
  }

  breakdown(): DurationParts | null {
    return this._breakdownData;
  }

  format(locale?: string): string {
    const l = locale || this._locale;

    if (!this._breakdownData) {
      // Fallback for exact mode - show in days
      return `${Math.abs(this._tg1.diff(this._tg2, 'day'))}${ZERO_DIFF_DAYS}`;
    }

    const parts: string[] = [];
    const bd = this._breakdownData;

    // Build parts array in logical order
    if (bd.years !== 0) {
      parts.push(`${bd.years} ${getDurationUnitLabel('year', l, bd.years)}`);
    }
    if (bd.months !== 0) {
      parts.push(`${bd.months} ${getDurationUnitLabel('month', l, bd.months)}`);
    }
    if (bd.weeks !== 0) {
      parts.push(`${bd.weeks} ${getDurationUnitLabel('week', l, bd.weeks)}`);
    }
    if (bd.days !== 0) {
      parts.push(`${bd.days} ${getDurationUnitLabel('day', l, bd.days)}`);
    }
    if (bd.hours !== 0) {
      parts.push(`${bd.hours} ${getDurationUnitLabel('hour', l, bd.hours)}`);
    }
    if (bd.minutes !== 0) {
      parts.push(
        `${bd.minutes} ${getDurationUnitLabel('minute', l, bd.minutes)}`,
      );
    }
    if (bd.seconds !== 0) {
      parts.push(
        `${bd.seconds} ${getDurationUnitLabel('second', l, bd.seconds)}`,
      );
    }

    if (parts.length === 0) {
      return formatZeroDuration(l);
    }

    return joinDurationParts(parts, l);
  }

  getMode(): 'calendar' | 'exact' {
    return this._mode;
  }

  valueOf(): number {
    return this._value;
  }

  toString(): string {
    if (this._mode === 'calendar' && this._breakdownData) {
      return this.format();
    }
    return this._value.toString();
  }

  toJSON(): number {
    return this._value;
  }
}

/**
 * DurationResult class - Represents a duration breakdown with humanize support
 * Returned by until(), since(), and between() methods
 */
export class DurationResult implements DurationParts, IFormattableDuration {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  private _locale: string;
  private _startDate?: string;
  private _endDate?: string;
  private _steps: string[] = [];
  private _mode: 'exact' | 'estimated' = 'exact';
  private _leapYearFlags: Array<{
    year: number;
    isLeap: boolean;
    daysInFebruary: number;
  }> = [];
  private _calculationTimeMs: number = 0;

  constructor(
    parts: DurationParts,
    locale: string = 'en',
    metadata?: {
      startDate?: string;
      endDate?: string;
      steps?: string[];
      mode?: 'exact' | 'estimated';
      leapYearFlags?: Array<{
        year: number;
        isLeap: boolean;
        daysInFebruary: number;
      }>;
      calculationTimeMs?: number;
    },
  ) {
    this.years = parts.years;
    this.months = parts.months;
    this.weeks = parts.weeks;
    this.days = parts.days;
    this.hours = parts.hours;
    this.minutes = parts.minutes;
    this.seconds = parts.seconds;
    this.milliseconds = parts.milliseconds;
    this._locale = locale;

    if (metadata) {
      this._startDate = metadata.startDate;
      this._endDate = metadata.endDate;
      this._steps = metadata.steps || [];
      this._mode = metadata.mode || 'exact';
      this._leapYearFlags = metadata.leapYearFlags || [];
      this._calculationTimeMs = metadata.calculationTimeMs || 0;
    }
  }

  humanize(options?: {
    locale?: string;
    fullBreakdown?: boolean;
    numeric?: 'always' | 'auto';
  }): string {
    const locale = options?.locale || this._locale;
    const fullBreakdown = options?.fullBreakdown ?? false;
    const numeric = options?.numeric ?? 'always';

    const parts = [
      { unit: 'year', value: this.years },
      { unit: 'month', value: this.months },
      { unit: 'week', value: this.weeks },
      { unit: 'day', value: this.days },
      { unit: 'hour', value: this.hours },
      { unit: 'minute', value: this.minutes },
      { unit: 'second', value: this.seconds },
      { unit: 'millisecond', value: this.milliseconds },
    ];

    // `value > 0` would drop every part of a negative (this-is-earlier)
    // duration — e.g. `past.since(now)` — silently collapsing to "0
    // seconds" instead of "3 days ago". Filter on magnitude, not sign.
    const nonZeroParts = parts.filter((p) => p.value !== 0);

    if (nonZeroParts.length === 0) {
      return '0 seconds';
    }

    if (!fullBreakdown || nonZeroParts.length === 1) {
      const largest = nonZeroParts[0];
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, {
          numeric,
          style: 'long',
        });
        // Intl.RelativeTimeFormat is sign-aware by design (negative ->
        // "ago", positive -> "in ...") — pass the signed value through.
        return rtf.format(
          largest.value,
          largest.unit as Intl.RelativeTimeFormatUnit,
        );
      } catch {
        const abs = Math.abs(largest.value);
        return `${abs} ${this.pluralizeUnit(largest.unit, abs, locale)}`;
      }
    }

    const formatted = nonZeroParts.map((p) => {
      const abs = Math.abs(p.value);
      const label = getDurationUnitLabel(p.unit, locale, abs);
      return `${abs} ${label}`;
    });

    return joinDurationParts(formatted, locale);
  }

  total(unit: Unit): number {
    let totalMs = 0;
    totalMs += this.years * MS_PER_YEAR;
    totalMs += this.months * MS_PER_MONTH;
    totalMs += this.weeks * MS_PER_WEEK;
    totalMs += this.days * MS_PER_DAY;
    totalMs += this.hours * MS_PER_HOUR;
    totalMs += this.minutes * MS_PER_MINUTE;
    totalMs += this.seconds * MS_PER_SECOND;
    totalMs += this.milliseconds;

    switch (unit) {
      case 'millisecond':
        return totalMs;
      case 'second':
        return totalMs / MS_PER_SECOND;
      case 'minute':
        return totalMs / MS_PER_MINUTE;
      case 'hour':
        return totalMs / MS_PER_HOUR;
      case 'day':
        return totalMs / MS_PER_DAY;
      case 'week':
        return totalMs / MS_PER_WEEK;
      case 'month':
        return totalMs / MS_PER_MONTH;
      case 'year':
        return totalMs / MS_PER_YEAR;
      case 'microsecond':
        return totalMs * 1000; // milliseconds to microseconds
      case 'nanosecond':
        return totalMs * 1_000_000;
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  }

  toString(): string {
    return this.humanize({ fullBreakdown: true });
  }

  toJSON(): Record<string, number> {
    return {
      years: this.years,
      months: this.months,
      weeks: this.weeks,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds,
    };
  }

  explain(): IDurationExplanation {
    let steps = [...this._steps];

    if (steps.length === 0) {
      steps = this.generateExplanationSteps();
    }

    const explanationParts: string[] = [];

    if (this._startDate && this._endDate) {
      explanationParts.push(
        `Calculated duration from ${this._startDate} to ${this._endDate}`,
      );
    }

    if (this._leapYearFlags && this._leapYearFlags.length > 0) {
      const leapYears = this._leapYearFlags
        .filter((f) => f.isLeap)
        .map((f) => f.year);
      if (leapYears.length > 0) {
        explanationParts.push(`Leap year(s) detected: ${leapYears.join(', ')}`);
      }
    }

    explanationParts.push(
      `Breakdown: ${this.years} year(s), ${this.months} month(s), ${this.days} day(s)`,
    );
    explanationParts.push(`Mode: ${this._mode} calculation`);

    return {
      input:
        this._startDate && this._endDate
          ? [this._startDate, this._endDate]
          : [],
      steps,
      breakdown: {
        years: this.years,
        months: this.months,
        weeks: this.weeks,
        days: this.days,
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
        milliseconds: this.milliseconds,
      },
      mode: this._mode,
      explanation: explanationParts.join('. '),
      locale: this._locale,
      leapYearFlags:
        this._leapYearFlags.length > 0 ? this._leapYearFlags : undefined,
      metadata: {
        calculationTimeMs: this._calculationTimeMs,
        precision: 'day',
      },
    };
  }

  private generateExplanationSteps(): string[] {
    const steps: string[] = [];

    if (this._startDate && this._endDate) {
      steps.push(`Input: ${this._startDate} to ${this._endDate}`);
    } else {
      steps.push('Duration calculation started');
    }

    // Add component breakdown
    if (this.years > 0) {
      steps.push(`Years: ${this.years}`);
    }
    if (this.months > 0) {
      steps.push(`Months: ${this.months}`);
    }
    if (this.weeks > 0) {
      steps.push(`Weeks: ${this.weeks}`);
    }
    if (this.days > 0) {
      steps.push(`Days: ${this.days}`);
    }
    if (this.hours > 0) {
      steps.push(`Hours: ${this.hours}`);
    }
    if (this.minutes > 0) {
      steps.push(`Minutes: ${this.minutes}`);
    }
    if (this.seconds > 0) {
      steps.push(`Seconds: ${this.seconds}`);
    }
    if (this.milliseconds > 0) {
      steps.push(`Milliseconds: ${this.milliseconds}`);
    }

    if (this._leapYearFlags && this._leapYearFlags.length > 0) {
      for (const flag of this._leapYearFlags) {
        if (flag.isLeap) {
          steps.push(
            `${flag.year} is a leap year (February has ${flag.daysInFebruary} days)`,
          );
        }
      }
    }

    const totalParts = [
      this.years > 0 ? `${this.years}y` : '',
      this.months > 0 ? `${this.months}m` : '',
      this.days > 0 ? `${this.days}d` : '',
      this.hours > 0 ? `${this.hours}h` : '',
      this.minutes > 0 ? `${this.minutes}min` : '',
      this.seconds > 0 ? `${this.seconds}s` : '',
    ]
      .filter((p) => p.length > 0)
      .join(' ');

    steps.push(`Total: ${totalParts || '0'}`);

    return steps;
  }

  private pluralizeUnit(unit: string, count: number, locale: string): string {
    return getDurationUnitLabel(unit, locale, count);
  }
}

/**
 * TimeRange - Fluent API for date range operations
 *
 * @example
 * TimeGuard.range('2024-01-15', '2024-03-20')
 *   .toDuration().humanize()        // "2 months and 5 days"
 *   .inMonths()                     // 2.1355 (precise decimal)
 */
export class TimeRange {
  private _start: TimeGuard;
  private _end: TimeGuard;
  // `_start`/`_end` never change after construction (no setters), so the
  // ordered/validated pair only needs to be computed once and reused across
  // contains()/overlaps()/intersect()/union() instead of on every call.
  private _ordered?: [Temporal.PlainDateTime, Temporal.PlainDateTime];

  constructor(start: TimeGuard, end: TimeGuard) {
    this._start = start;
    this._end = end;
  }

  get start(): TimeGuard {
    return this._start;
  }

  get end(): TimeGuard {
    return this._end;
  }

  private getOrdered(): [Temporal.PlainDateTime, Temporal.PlainDateTime] {
    if (!this._ordered) {
      const t1 = TemporalAdapter.toPlainDateTime(this._start.toTemporal());
      const t2 = TemporalAdapter.toPlainDateTime(this._end.toTemporal());
      this._ordered =
        TemporalAdapter.compare(t1, t2) <= 0 ? [t1, t2] : [t2, t1];
    }
    return this._ordered;
  }

  toDuration(): DurationResult {
    return TimeGuard.between(this._start, this._end);
  }

  inMonths(): number {
    return this.toDuration().total('month');
  }

  humanize(options?: {
    locale?: string;
    fullBreakdown?: boolean;
    numeric?: 'always' | 'auto';
  }): string {
    return this.toDuration().humanize(options);
  }

  in(unit: Unit): number {
    return this.toDuration().total(unit);
  }

  contains(date: unknown): boolean {
    const tg = date instanceof TimeGuard ? date : new TimeGuard(date);
    const t = TemporalAdapter.toPlainDateTime(tg.toTemporal());
    const [startT, endT] = this.getOrdered();
    return (
      TemporalAdapter.compare(t, startT) >= 0 &&
      TemporalAdapter.compare(t, endT) <= 0
    );
  }

  overlaps(other: TimeRange): boolean {
    const [s1, e1] = this.getOrdered();
    const [s2, e2] = other.getOrdered();
    return (
      TemporalAdapter.compare(s1, e2) <= 0 &&
      TemporalAdapter.compare(s2, e1) <= 0
    );
  }

  intersect(other: TimeRange): TimeRange | null {
    if (!this.overlaps(other)) {
      return null;
    }
    const [s1, e1] = this.getOrdered();
    const [s2, e2] = other.getOrdered();

    const startT = TemporalAdapter.compare(s1, s2) >= 0 ? s1 : s2;
    const endT = TemporalAdapter.compare(e1, e2) <= 0 ? e1 : e2;

    const startTg = TimeGuard.fromTemporal(startT, {
      locale: this._start.locale(),
    });
    const endTg = TimeGuard.fromTemporal(endT, { locale: this._end.locale() });

    return new TimeRange(startTg, endTg);
  }

  union(other: TimeRange): TimeRange {
    const [s1, e1] = this.getOrdered();
    const [s2, e2] = other.getOrdered();

    const startT = TemporalAdapter.compare(s1, s2) <= 0 ? s1 : s2;
    const endT = TemporalAdapter.compare(e1, e2) >= 0 ? e1 : e2;

    const startTg = TimeGuard.fromTemporal(startT, {
      locale: this._start.locale(),
    });
    const endTg = TimeGuard.fromTemporal(endT, { locale: this._end.locale() });

    return new TimeRange(startTg, endTg);
  }
}

/**
 * TimeGuard implementation - Main facade class
 */
export class TimeGuard implements ITimeGuard {
  private temporal: TemporalDateTime;
  private config: Required<ITimeGuardConfig>;
  private formatterInstance: DateFormatter;

  /** Process-wide holiday registry, shared by every `TimeGuard` instance. See `registerHolidays()`. */
  private static holidays: Set<string> = new Set();

  /**
   * Registers holiday dates in the process-wide registry used by
   * `isHoliday()`/`isBusinessDay()`/`addBusinessDays()`. Additive, with no
   * cap or eviction — call this once at startup with your full holiday
   * calendar, not per-request or per-tenant in a long-running server (use
   * `clearHolidays()` between tenants if you need per-tenant calendars).
   */
  static registerHolidays(dates: string[]): void {
    dates.forEach((d) => {
      try {
        const tg = new TimeGuard(d);
        this.holidays.add(tg.format('YYYY-MM-DD'));
      } catch {
        // Ignore invalid dates
      }
    });
  }

  static clearHolidays(): void {
    this.holidays.clear();
  }

  static getRegisteredHolidays(): string[] {
    return Array.from(this.holidays).sort();
  }

  private static readonly ZERO_DURATION: DurationParts = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  private static isLeapYearValue(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  private static toDurationParts(duration: TemporalDuration): DurationParts {
    return {
      years: Math.floor(duration.years || 0),
      months: Math.floor(duration.months || 0),
      weeks: Math.floor(duration.weeks || 0),
      days: Math.floor(duration.days || 0),
      hours: Math.floor(duration.hours || 0),
      minutes: Math.floor(duration.minutes || 0),
      seconds: Math.floor(duration.seconds || 0),
      milliseconds: Math.floor(duration.milliseconds || 0),
    };
  }

  constructor(input?: unknown, config?: ITimeGuardConfig) {
    this.formatterInstance = new DateFormatter();

    this.config = {
      locale: config?.locale || 'en',
      timezone: config?.timezone || 'UTC',
      strict: config?.strict ?? false,
    };

    if (input === undefined) {
      // TimeGuard.now() — capture the actual current instant with real
      // offset/zone info attached (config?.timezone, NOT this.config.timezone
      // — the latter has already been defaulted to the 'UTC' sentinel used
      // elsewhere to mean "no explicit zone requested"). With no explicit
      // timezone, Temporal.Now.zonedDateTimeISO(undefined) uses the
      // system's own zone — same wall-clock reading format() already
      // showed, but now genuinely zoned instead of a bare, offset-naive
      // PlainDateTime mislabeled as UTC by toISOString()/getOffset().
      // An explicit timezone computes "now" AS OBSERVED there directly,
      // fixing the previous bug where it took the system's local reading
      // and just relabeled it with the requested zone without converting.
      this.temporal = TemporalAdapter.nowInTimezone(config?.timezone);
      return;
    }

    // A TimeGuard instance has no public year/month/day fields for
    // TemporalAdapter to read (its Temporal value is private), so unwrap it
    // explicitly instead of falling through to the generic object branch.
    const resolvedInput =
      input instanceof TimeGuard ? input.toTemporal() : input;
    this.temporal = TemporalAdapter.parseToPlainDateTime(resolvedInput);

    // Convert to ZonedDateTime if timezone is specified
    if (this.config.timezone && this.config.timezone !== 'UTC') {
      try {
        const zoned = (
          this.temporal as {
            toZonedDateTime(tz: string): TemporalZonedDateTimePolyfill;
          }
        ).toZonedDateTime(this.config.timezone);
        this.temporal = zoned;
      } catch {
        // Keep as PlainDateTime if timezone conversion fails
      }
    }
  }

  static now(config?: ITimeGuardConfig): TimeGuard {
    return new TimeGuard(undefined, config);
  }

  static from(input: unknown, config?: ITimeGuardConfig): TimeGuard {
    return new TimeGuard(input, config);
  }

  static fromTemporal(
    temporal: TemporalPlainDateTime | TemporalZonedDateTime,
    config?: ITimeGuardConfig,
  ): TimeGuard {
    const instance = new TimeGuard(undefined, config);
    instance.temporal = temporal;
    return instance;
  }

  /**
   * Calculate duration between two dates - always returns positive duration
   *
   * @example
   * TimeGuard.between(start, end).humanize() // "2 months and 5 days"
   * TimeGuard.between(end, start).humanize() // "2 months and 5 days" (still positive)
   */
  static between(date1: TimeGuard, date2: TimeGuard): DurationResult {
    const t1 = TemporalAdapter.toPlainDateTime(date1.temporal);
    const t2 = TemporalAdapter.toPlainDateTime(date2.temporal);

    const [earlier, later] =
      TemporalAdapter.compare(t1, t2) <= 0 ? [date1, date2] : [date2, date1];

    return earlier.until(later);
  }

  /**
   * Create a TimeRange for fluent duration calculations
   *
   * @example
   * TimeGuard.range("2024-01-15", "2024-03-20").humanize() // "2 months and 5 days"
   */
  static range(start: unknown, end: unknown): TimeRange {
    const startTg = start instanceof TimeGuard ? start : new TimeGuard(start);
    const endTg = end instanceof TimeGuard ? end : new TimeGuard(end);
    return new TimeRange(startTg, endTg);
  }

  toTemporal(): TemporalPlainDateTime | TemporalZonedDateTime {
    return this.temporal;
  }

  toDate(): Date {
    return TemporalAdapter.toDate(this.temporal);
  }

  toISOString(): string {
    return TemporalAdapter.toISOString(this.temporal);
  }

  valueOf(): number {
    return TemporalAdapter.toUnix(this.temporal);
  }

  unix(): number {
    return Math.floor(this.valueOf() / 1000);
  }

  toJSON(): string {
    return this.toISOString();
  }

  [Symbol.toPrimitive](hint: 'default' | 'string' | 'number'): string | number {
    if (hint === 'number') {
      return this.valueOf();
    }
    if (hint === 'string') {
      return this.toISOString();
    }
    // default hint (e.g., when using == or + operator)
    return this.toISOString();
  }

  toString(): string {
    return this.format('YYYY-MM-DD HH:mm:ss');
  }

  locale(): string;
  locale(locale: string): TimeGuard;
  locale(locale?: string): string | TimeGuard {
    if (locale === undefined) {
      return this.config.locale;
    }
    const cloned = this.clone();
    cloned.config.locale = locale;
    return cloned;
  }

  timezone(): string | null;
  timezone(timezone: string): TimeGuard;
  timezone(timezone?: string): string | null | TimeGuard {
    if (timezone === undefined) {
      return this.config.timezone;
    }
    const cloned = this.clone();
    cloned.config.timezone = timezone;
    try {
      const plainDT = TemporalAdapter.toPlainDateTime(
        cloned.temporal,
      ) as TemporalPlainDateTimePolyfill;
      cloned.temporal = plainDT.toZonedDateTime(timezone);
    } catch {
      // Keep as PlainDateTime if timezone conversion fails
    }
    return cloned;
  }

  format(pattern: string | FormatPreset): string {
    const knownPresets = [
      'iso',
      'date',
      'time',
      'datetime',
      'rfc2822',
      'rfc3339',
      'utc',
    ];
    // These 4 presets denote UTC (their pattern ends in a literal "Z") —
    // if this instance carries real zone/offset info (e.g. TimeGuard.now()),
    // convert to the actual UTC instant first instead of formatting local
    // wall-clock digits with a "Z" stapled on (the same mislabeling bug
    // toISOString() had).
    const utcPresets = ['iso', 'rfc2822', 'rfc3339', 'utc'];
    const plainDT =
      utcPresets.includes(pattern as string) &&
      TemporalAdapter.isZonedDateTime(this.temporal)
        ? (this.temporal as TemporalZonedDateTimePolyfill)
            .toInstant()
            .toZonedDateTimeISO('UTC')
            .toPlainDateTime()
        : TemporalAdapter.toPlainDateTime(this.temporal);
    const formatPattern = knownPresets.includes(pattern as string)
      ? this.formatterInstance.getPreset(pattern as FormatPreset)
      : (pattern as string);
    return this.formatterInstance.format(
      plainDT,
      formatPattern,
      this.config.locale,
    );
  }

  get(component: Unit): number {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    if (component === 'week') {
      return (plainDT as TemporalPlainDateTimePolyfill).weekOfYear;
    }

    const unitMap: Record<Exclude<Unit, 'week'>, GetNumericField> = {
      year: 'year',
      month: 'month',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
      millisecond: 'millisecond',
      microsecond: 'microsecond',
      nanosecond: 'nanosecond',
    };

    return plainDT[unitMap[component]];
  }

  /** Map from singular Unit to plural Temporal polyfill key */
  private static readonly UNIT_TO_PLURAL: Record<string, string> = {
    year: 'years',
    month: 'months',
    week: 'weeks',
    day: 'days',
    hour: 'hours',
    minute: 'minutes',
    second: 'seconds',
    millisecond: 'milliseconds',
    microsecond: 'microseconds',
    nanosecond: 'nanoseconds',
    // Also accept already-plural keys
    years: 'years',
    months: 'months',
    weeks: 'weeks',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    milliseconds: 'milliseconds',
    microseconds: 'microseconds',
    nanoseconds: 'nanoseconds',
  };

  add(units: Partial<Record<Unit, number>>): TimeGuard {
    let plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    const duration: Record<string, number> = {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      microseconds: 0,
      nanoseconds: 0,
    };
    let hasValidFields = false;

    Object.entries(units).forEach(([unit, value]) => {
      if (value !== undefined && value !== 0) {
        const num = Number(value);
        if (Number.isFinite(num)) {
          const targetKey = TimeGuard.UNIT_TO_PLURAL[unit] || unit;
          duration[targetKey] = Math.trunc(num);
          hasValidFields = true;
        }
      }
    });

    if (!hasValidFields) {
      return this;
    }

    plainDT = (plainDT as TemporalPlainDateTimePolyfill).add(duration);
    return TimeGuard.fromTemporal(plainDT, this.config);
  }

  subtract(units: Partial<Record<Unit, number>>): TimeGuard {
    const negated: Partial<Record<Unit, number>> = {};
    Object.entries(units).forEach(([unit, value]) => {
      negated[unit as Unit] = value ? -value : 0;
    });
    return this.add(negated);
  }

  // Overloaded signatures for diff()
  diff(other: TimeGuard): DiffResult;
  diff(other: TimeGuard, unit: Unit): number;
  diff(other: TimeGuard, options: IDiffOptions): DiffResult;
  diff(
    other: TimeGuard,
    unitOrOptions?: Unit | IDiffOptions,
  ): DiffResult | number {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    const unitMap: Record<Unit, DurationPluralField> = {
      year: 'years',
      month: 'months',
      week: 'weeks',
      day: 'days',
      hour: 'hours',
      minute: 'minutes',
      second: 'seconds',
      millisecond: 'milliseconds',
      microsecond: 'microseconds',
      nanosecond: 'nanoseconds',
    };

    if (typeof unitOrOptions === 'string') {
      const unit = unitOrOptions;
      const mappedUnit = unitMap[unit];
      // largestUnit must match smallestUnit — otherwise Temporal balances
      // the difference across larger units first (years/months/days/...)
      // and `duration[mappedUnit]` only holds the leftover remainder below
      // whichever unit it picked, not the total (e.g. diff(x, 'minute')
      // for a 5-hour gap would return 0, since the 5 hours get absorbed
      // into an implicit `hours` component instead of being expressed as
      // 300 minutes).
      const duration = (plainDT1 as TemporalPlainDateTimePolyfill).since(
        plainDT2,
        {
          largestUnit: unit,
          smallestUnit: unit,
        },
      );
      return Math.round(duration[mappedUnit] || 0);
    }

    const options = (unitOrOptions as IDiffOptions) || {};
    const mode = options.mode || 'exact';
    const unit = options.unit || 'millisecond';
    const locale = options.locale || this.config.locale;

    if (mode === 'exact') {
      const mappedUnit = unitMap[unit];
      const duration = (plainDT1 as TemporalPlainDateTimePolyfill).since(
        plainDT2,
        {
          smallestUnit: unit,
        },
      );
      const result = Math.round(duration[mappedUnit] || 0);

      if (unitOrOptions === undefined || typeof unitOrOptions === 'object') {
        const totalMs = calculateTotalMs(duration);
        return new DiffResult(
          Math.round(totalMs),
          this,
          other,
          mode,
          undefined,
          locale,
        );
      }

      return result;
    }

    if (mode === 'calendar') {
      // Calendar-mode breakdowns describe the gap between two dates, not a
      // signed vector — always diff from the earlier date to the later one
      // so `a.diff(b, {mode: 'calendar'})` and `b.diff(a, {mode: 'calendar'})`
      // report the same positive months/days, matching between()'s contract.
      const isReversed = TemporalAdapter.compare(plainDT1, plainDT2) < 0;
      const laterDT = isReversed ? plainDT2 : plainDT1;
      const earlierDT = isReversed ? plainDT1 : plainDT2;
      const duration = (laterDT as TemporalPlainDateTimePolyfill).since(
        earlierDT,
        {
          largestUnit: 'month',
          smallestUnit: 'millisecond',
        },
      );

      const breakdownData: DurationParts = {
        years: Math.floor(duration.years || 0),
        months: Math.floor(duration.months || 0),
        weeks: Math.floor(duration.weeks || 0),
        days: Math.floor(duration.days || 0),
        hours: Math.floor(duration.hours || 0),
        minutes: Math.floor(duration.minutes || 0),
        seconds: Math.floor(duration.seconds || 0),
        milliseconds: Math.floor(duration.milliseconds || 0),
      };

      const totalMs = calculateTotalMs(duration);
      return new DiffResult(
        Math.round(totalMs),
        this,
        other,
        mode,
        breakdownData,
        locale,
      );
    }

    const duration = (plainDT1 as TemporalPlainDateTimePolyfill).since(
      plainDT2,
      {
        smallestUnit: 'millisecond',
      },
    );
    const totalMs = calculateTotalMs(duration);
    return new DiffResult(
      Math.round(totalMs),
      this,
      other,
      mode,
      undefined,
      locale,
    );
  }

  isBefore(other: TimeGuard): boolean {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    return TemporalAdapter.compare(plainDT1, plainDT2) < 0;
  }

  isAfter(other: TimeGuard): boolean {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    return TemporalAdapter.compare(plainDT1, plainDT2) > 0;
  }

  isSame(other: TimeGuard, unit?: Unit): boolean {
    if (!unit) {
      return (
        TemporalAdapter.compare(
          TemporalAdapter.toPlainDateTime(this.temporal),
          TemporalAdapter.toPlainDateTime(other.temporal),
        ) === 0
      );
    }

    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    switch (unit) {
      case 'year':
        return plainDT1.year === plainDT2.year;
      case 'month':
        return (
          plainDT1.year === plainDT2.year && plainDT1.month === plainDT2.month
        );
      case 'day':
        return (
          plainDT1.year === plainDT2.year &&
          plainDT1.month === plainDT2.month &&
          plainDT1.day === plainDT2.day
        );
      case 'hour':
        return (
          plainDT1.year === plainDT2.year &&
          plainDT1.month === plainDT2.month &&
          plainDT1.day === plainDT2.day &&
          plainDT1.hour === plainDT2.hour
        );
      case 'minute':
        return (
          plainDT1.year === plainDT2.year &&
          plainDT1.month === plainDT2.month &&
          plainDT1.day === plainDT2.day &&
          plainDT1.hour === plainDT2.hour &&
          plainDT1.minute === plainDT2.minute
        );
      case 'second':
        return (
          plainDT1.year === plainDT2.year &&
          plainDT1.month === plainDT2.month &&
          plainDT1.day === plainDT2.day &&
          plainDT1.hour === plainDT2.hour &&
          plainDT1.minute === plainDT2.minute &&
          plainDT1.second === plainDT2.second
        );
      default:
        return false;
    }
  }

  isBetween(
    start: TimeGuard,
    end: TimeGuard,
    unit?: Unit,
    inclusivity: '[)' | '()' | '[]' | '(]' = '[]',
  ): boolean {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainStart = TemporalAdapter.toPlainDateTime(start.temporal);
    const plainEnd = TemporalAdapter.toPlainDateTime(end.temporal);

    let afterStart: boolean;
    let beforeEnd: boolean;

    if (unit) {
      const startCopy = this.clone().startOf(unit);
      const endCopy = this.clone().endOf(unit);
      const plainCopy = TemporalAdapter.toPlainDateTime(startCopy.temporal);
      const plainEndCopy = TemporalAdapter.toPlainDateTime(endCopy.temporal);

      afterStart = TemporalAdapter.compare(plainCopy, plainStart) >= 0;
      beforeEnd = TemporalAdapter.compare(plainEndCopy, plainEnd) <= 0;
    } else {
      afterStart = TemporalAdapter.compare(plainDT, plainStart) >= 0;
      beforeEnd = TemporalAdapter.compare(plainDT, plainEnd) <= 0;
    }

    const hasStartBracket = inclusivity[0] === '[';
    const hasEndBracket = inclusivity[1] === ']';

    return (
      (hasStartBracket
        ? afterStart
        : TemporalAdapter.compare(plainDT, plainStart) > 0) &&
      (hasEndBracket
        ? beforeEnd
        : TemporalAdapter.compare(plainDT, plainEnd) < 0)
    );
  }

  clone(): TimeGuard {
    return TimeGuard.fromTemporal(this.temporal, this.config);
  }

  startOf(unit: Unit): TimeGuard {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const values: Partial<Record<Unit, number>> = {};

    switch (unit) {
      case 'year':
        values.month = 1;
        values.day = 1;
        values.hour = 0;
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'month':
        values.day = 1;
        values.hour = 0;
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'week':
      case 'day':
        values.hour = 0;
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'hour':
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'minute':
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'second':
        values.millisecond = 0;
        break;
    }

    const updated = (plainDT as TemporalPlainDateTimePolyfill).with(
      values as Record<string, unknown>,
    );
    return TimeGuard.fromTemporal(updated, this.config);
  }

  endOf(unit: Unit): TimeGuard {
    const start = this.startOf(unit);
    const next = start
      .add({ [unit]: 1 } as Partial<Record<Unit, number>>)
      .subtract({ millisecond: 1 } as Partial<Record<Unit, number>>);
    return next;
  }

  set(values: Partial<Record<Unit, number>>): TimeGuard {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const updated = (plainDT as TemporalPlainDateTimePolyfill).with(
      values as Record<string, unknown>,
    );
    return TimeGuard.fromTemporal(updated, this.config);
  }

  year(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).year;
  }

  month(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).month;
  }

  day(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).day;
  }

  hour(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).hour;
  }

  minute(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).minute;
  }

  second(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).second;
  }

  millisecond(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).millisecond;
  }

  dayOfWeek(): number {
    return (
      TemporalAdapter.toPlainDateTime(
        this.temporal,
      ) as TemporalPlainDateTimePolyfill
    ).dayOfWeek;
  }

  dayOfYear(): number {
    return (
      TemporalAdapter.toPlainDateTime(
        this.temporal,
      ) as TemporalPlainDateTimePolyfill
    ).dayOfYear;
  }

  weekOfYear(): number {
    return (
      TemporalAdapter.toPlainDateTime(
        this.temporal,
      ) as TemporalPlainDateTimePolyfill
    ).weekOfYear;
  }

  daysInMonth(): number {
    const plainDT = TemporalAdapter.toPlainDateTime(
      this.temporal,
    ) as TemporalPlainDateTimePolyfill;
    const nextMonth = plainDT.add({ months: 1 }).with({ day: 1 });
    const lastDay = nextMonth.subtract({ days: 1 });
    return lastDay.day;
  }

  daysInYear(): number {
    const year = this.year();
    return TimeGuard.isLeapYearValue(year) ? 366 : 365;
  }

  inLeapYear(): boolean {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    return TimeGuard.isLeapYearValue(plainDT.year);
  }

  until(other: TimeGuard, options?: IDurationOptions): DurationResult {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    const startTime = performance.now();

    try {
      // Default to a calendar-aware years/months/days/... breakdown —
      // Temporal's own default largestUnit ('auto') caps balancing at
      // 'day', which would silently collapse months/years into days.
      const temporalOptions: Record<string, string> = {
        largestUnit: options?.largestUnit || 'year',
      };
      if (options?.smallestUnit) {
        temporalOptions.smallestUnit = options.smallestUnit;
      }

      const duration = (plainDT2 as TemporalPlainDateTimePolyfill).since(
        plainDT1,
        temporalOptions,
      );
      const parts = TimeGuard.toDurationParts(duration);

      const startYear = plainDT1.year;
      const endYear = plainDT2.year;
      const leapYearFlags: Array<{
        year: number;
        isLeap: boolean;
        daysInFebruary: number;
      }> = [];

      for (let year = startYear; year <= endYear; year++) {
        const isLeap = TimeGuard.isLeapYearValue(year);
        leapYearFlags.push({ year, isLeap, daysInFebruary: isLeap ? 29 : 28 });
      }

      const steps = this.generateUntilSteps(
        plainDT1,
        plainDT2,
        parts,
        leapYearFlags,
      );
      const endTime = performance.now();
      const calculationTimeMs = endTime - startTime;

      return new DurationResult(parts, this.config.locale, {
        startDate: plainDT1.toString(),
        endDate: plainDT2.toString(),
        steps,
        mode: 'exact',
        leapYearFlags: leapYearFlags.filter((f) => f.isLeap),
        calculationTimeMs,
      });
    } catch {
      return new DurationResult(TimeGuard.ZERO_DURATION, this.config.locale, {
        startDate: plainDT1.toString(),
        endDate: plainDT2.toString(),
        steps: ['Calculation failed, returning zero duration'],
        mode: 'estimated',
      });
    }
  }

  private generateUntilSteps(
    start: TemporalPlainDateTime,
    end: TemporalPlainDateTime,
    parts: DurationParts,
    leapYearFlags: Array<{
      year: number;
      isLeap: boolean;
      daysInFebruary: number;
    }>,
  ): string[] {
    const steps: string[] = [];
    steps.push(
      `Parsed dates: ${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')} (day ${start.dayOfYear} of ${TimeGuard.isLeapYearValue(start.year) ? 366 : 365})`,
    );
    steps.push(
      `to ${end.year}-${String(end.month).padStart(2, '0')}-${String(end.day).padStart(2, '0')} (day ${end.dayOfYear} of ${TimeGuard.isLeapYearValue(end.year) ? 366 : 365})`,
    );

    const leapYearsInRange = leapYearFlags.filter((f) => f.isLeap);
    if (leapYearsInRange.length > 0) {
      for (const flag of leapYearsInRange) {
        steps.push(
          `${flag.year} is a leap year (February has ${flag.daysInFebruary} days)`,
        );
      }
    }

    if (parts.years > 0) {
      steps.push(`Years: ${parts.years}`);
    }
    if (parts.months > 0) {
      steps.push(`Months: ${parts.months}`);
    }
    if (parts.days > 0) {
      steps.push(`Days: ${parts.days}`);
    }

    if (parts.hours > 0 || parts.minutes > 0 || parts.seconds > 0) {
      const timeComponents = [];
      if (parts.hours > 0) {
        timeComponents.push(`${parts.hours}h`);
      }
      if (parts.minutes > 0) {
        timeComponents.push(`${parts.minutes}m`);
      }
      if (parts.seconds > 0) {
        timeComponents.push(`${parts.seconds}s`);
      }
      steps.push(`Time: ${timeComponents.join(' ')}`);
    }

    const totalDays =
      parts.years * 365.25 +
      parts.months * 30.4375 +
      parts.days +
      parts.hours / 24;
    steps.push(`Total: approximately ${totalDays.toFixed(2)} days`);
    return steps;
  }

  round(options: IRoundOptions = {}): TimeGuard {
    const { smallestUnit = 'millisecond', roundingMode = 'halfExpand' } =
      options;
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    const polyfillDT = plainDT as TemporalPlainDateTimePolyfill;
    const unitValues: Record<Unit, number> = {
      year: polyfillDT.year,
      month: polyfillDT.month,
      day: polyfillDT.day,
      hour: polyfillDT.hour,
      minute: polyfillDT.minute,
      second: polyfillDT.second,
      millisecond: polyfillDT.millisecond,
      microsecond: polyfillDT.microsecond || 0,
      nanosecond: polyfillDT.nanosecond || 0,
      week: 0,
    };

    const unitOrder: Unit[] = [
      'year',
      'month',
      'day',
      'hour',
      'minute',
      'second',
      'millisecond',
      'microsecond',
      'nanosecond',
    ];
    const smallestIndex = unitOrder.indexOf(smallestUnit);

    if (smallestIndex === -1) {
      return this.clone();
    }

    const roundedValues: Partial<Record<Unit, number>> = {};
    for (let i = 0; i < smallestIndex; i++) {
      const unit = unitOrder[i];
      roundedValues[unit as Unit] = unitValues[unit];
    }

    const unit = unitOrder[smallestIndex];
    let value = unitValues[unit];

    if (smallestIndex + 1 < unitOrder.length) {
      const nextUnitValue = unitValues[unitOrder[smallestIndex + 1]];
      const shouldRoundUp = (mode: string, nextVal: number): boolean => {
        switch (mode) {
          case 'ceil':
            return nextVal > 0;
          case 'floor':
          case 'trunc':
            return false;
          case 'halfExpand':
          case 'halfFloor':
          case 'halfCeil':
            return nextVal >= 5;
          case 'expand':
            return nextVal > 0;
          default:
            return nextVal >= 5;
        }
      };
      if (shouldRoundUp(roundingMode, nextUnitValue)) {
        value += 1;
      }
    }

    roundedValues[unit as Unit] = value;
    for (let i = smallestIndex + 1; i < unitOrder.length; i++) {
      roundedValues[unitOrder[i] as Unit] = 0;
    }

    return this.set(roundedValues);
  }

  toPlainDate(): {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number;
  } {
    const plainDT = TemporalAdapter.toPlainDateTime(
      this.temporal,
    ) as TemporalPlainDateTimePolyfill;
    return {
      year: plainDT.year,
      month: plainDT.month,
      day: plainDT.day,
      dayOfWeek: plainDT.dayOfWeek,
    };
  }

  toPlainTime(): {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
  } {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    return {
      hour: plainDT.hour,
      minute: plainDT.minute,
      second: plainDT.second,
      millisecond: plainDT.millisecond,
    };
  }

  withDate(year: number, month: number, day: number): TimeGuard {
    return this.set({ year, month, day });
  }

  withTime(
    hour: number,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
  ): TimeGuard {
    return this.set({ hour, minute, second, millisecond });
  }

  getOffset(): string {
    return (this.temporal as TemporalZonedDateTimePolyfill)?.offset || 'Z';
  }

  getOffsetNanoseconds(): number {
    return (
      (this.temporal as TemporalZonedDateTimePolyfill)?.offsetNanoseconds || 0
    );
  }

  getTimeZoneId(): string | null {
    return (this.temporal as TemporalZonedDateTimePolyfill)?.timeZoneId || null;
  }

  startOfDay(): TimeGuard {
    return this.startOf('day');
  }

  endOfDay(): TimeGuard {
    return this.endOf('day');
  }

  since(other: TimeGuard, options?: IDurationOptions): DurationResult {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    const startTime = performance.now();

    try {
      // Default to a calendar-aware years/months/days/... breakdown —
      // Temporal's own default largestUnit ('auto') caps balancing at
      // 'day', which would silently collapse months/years into days.
      const temporalOptions: Record<string, string> = {
        largestUnit: options?.largestUnit || 'year',
      };
      if (options?.smallestUnit) {
        temporalOptions.smallestUnit = options.smallestUnit;
      }

      const duration = (plainDT1 as TemporalPlainDateTimePolyfill).since(
        plainDT2,
        temporalOptions,
      );
      const parts = TimeGuard.toDurationParts(duration);

      const startYear = plainDT2.year;
      const endYear = plainDT1.year;
      const leapYearFlags: Array<{
        year: number;
        isLeap: boolean;
        daysInFebruary: number;
      }> = [];

      for (let year = startYear; year <= endYear; year++) {
        const isLeap = TimeGuard.isLeapYearValue(year);
        leapYearFlags.push({ year, isLeap, daysInFebruary: isLeap ? 29 : 28 });
      }

      const steps = this.generateUntilSteps(
        plainDT2,
        plainDT1,
        parts,
        leapYearFlags,
      );
      const endTime = performance.now();
      const calculationTimeMs = endTime - startTime;

      return new DurationResult(parts, this.config.locale, {
        startDate: plainDT2.toString(),
        endDate: plainDT1.toString(),
        steps,
        mode: 'exact',
        leapYearFlags: leapYearFlags.filter((f) => f.isLeap),
        calculationTimeMs,
      });
    } catch {
      return new DurationResult(TimeGuard.ZERO_DURATION, this.config.locale, {
        startDate: plainDT2.toString(),
        endDate: plainDT1.toString(),
        steps: ['Calculation failed, returning zero duration'],
        mode: 'estimated',
      });
    }
  }

  toDurationString(other?: TimeGuard): string {
    const duration = other ? this.until(other) : this.until(TimeGuard.now());
    const parts: string[] = [];
    if (duration.years) {
      parts.push(`${duration.years}Y`);
    }
    if (duration.months) {
      parts.push(`${duration.months}M`);
    }
    if (duration.days) {
      parts.push(`${duration.days}D`);
    }

    const timeParts: string[] = [];
    if (duration.hours) {
      timeParts.push(`${duration.hours}H`);
    }
    if (duration.minutes) {
      timeParts.push(`${duration.minutes}M`);
    }
    if (duration.seconds) {
      timeParts.push(`${duration.seconds}S`);
    }

    const result = `P${parts.join('')}${timeParts.length > 0 ? 'T' + timeParts.join('') : ''}`;
    return result === 'P' ? 'PT0S' : result;
  }

  isPast(): boolean {
    return this.isBefore(TimeGuard.now());
  }
  isFuture(): boolean {
    return this.isAfter(TimeGuard.now());
  }
  isToday(): boolean {
    return this.isSame(TimeGuard.now(), 'day');
  }
  isTomorrow(): boolean {
    return this.isSame(TimeGuard.now().add({ day: 1 }), 'day');
  }
  isYesterday(): boolean {
    return this.isSame(TimeGuard.now().subtract({ day: 1 }), 'day');
  }

  isWeekend(): boolean {
    const plainDT = TemporalAdapter.toPlainDateTime(
      this.temporal,
    ) as TemporalPlainDateTimePolyfill;
    return plainDT.dayOfWeek === 6 || plainDT.dayOfWeek === 7;
  }

  isHoliday(): boolean {
    // Build the lookup key directly from numeric fields instead of running
    // it through the full pattern formatter (regex + token replacement).
    const year = String(this.get('year')).padStart(4, '0');
    const month = String(this.get('month')).padStart(2, '0');
    const day = String(this.get('day')).padStart(2, '0');
    return TimeGuard.holidays.has(`${year}-${month}-${day}`);
  }

  isBusinessDay(): boolean {
    return !this.isWeekend() && !this.isHoliday();
  }

  addBusinessDays(days: number): TimeGuard {
    const num = Math.trunc(days);
    if (!Number.isFinite(num) || num === 0) {
      return this;
    }
    let cloned = this.clone();
    let remaining = Math.abs(num);
    const step = num > 0 ? 1 : -1;

    while (remaining > 0) {
      cloned = cloned.add({ day: step });
      if (cloned.isBusinessDay()) {
        remaining--;
      }
    }
    return cloned;
  }

  subtractBusinessDays(days: number): TimeGuard {
    return this.addBusinessDays(-days);
  }
}

// --- Shared reactive-integration helpers ---
// Used by the React/Vue/Svelte/Solid/Qwik wrappers (src/react.ts, src/vue.ts,
// src/svelte.ts, src/solid.ts, src/qwik.ts) to avoid re-implementing the same
// default intervals and since()/humanize() computation in every framework.

/** Default polling interval (ms) used by "current time" reactive hooks. */
export const DEFAULT_TICK_INTERVAL_MS = 1000;

/** Default recompute interval (ms) used by "relative time" reactive hooks. */
export const DEFAULT_RELATIVE_INTERVAL_MS = 60000;

/**
 * Computes a relative-time string for `date` against `TimeGuard.now()`.
 * Shared logic behind every framework's `useRelativeTime` hook.
 */
export function computeRelativeTime(
  date: unknown,
  options?: { locale?: string; numeric?: 'always' | 'auto' },
): string {
  const tgDate = TimeGuard.from(date);
  const now = TimeGuard.now();
  return tgDate.since(now).humanize(options);
}

/**
 * Builds a TimeRange from raw start/end inputs and a shared config.
 * Shared logic behind every framework's `useTimeRange` hook.
 */
export function createTimeRangeFrom(
  start: unknown,
  end: unknown,
  config?: ITimeGuardConfig,
): TimeRange {
  return new TimeRange(
    TimeGuard.from(start, config),
    TimeGuard.from(end, config),
  );
}

// --- Exports ---

// Type exports (zero cost — erased at build time)
export type {
  ITimeGuard,
  ITimeGuardConfig,
  ITimeGuardFactory,
  ITimeGuardPlugin,
  IDateParser,
  IDateFormatter,
  ILocaleManager,
  IDateArithmetic,
  IDateQuery,
  IDateManipulation,
  ITimezoneAdapter,
  ICalendarSystem,
  ICalendarManager,
  IRoundOptions,
  IDurationOptions,
  IDurationResult,
  IDurationExplanation,
  IHumanizeOptions,
  IDiffResult,
  IDiffOptions,
  DurationParts,
  Unit,
  FormatPreset,
  ILocale,
} from './types';

// Adapter exports
export { TemporalAdapter } from './adapters/temporal.adapter';

// Locale exports — core only: manager + EN/ES built-in. The other 38+
// locales, every non-Gregorian calendar, and all 3 plugins are full
// implementations that used to be re-exported here *in addition* to their
// own dedicated subpath entries (`/locales`, `/calendars`,
// `/plugins/*`) — meaning every one of them got bundled into this shared
// core chunk whether or not a consumer imported anything but `TimeGuard`.
// They're intentionally not re-exported from here anymore: get them from
// their subpath instead (see README → Bundle Modular). Nothing at runtime
// is lost — LocaleManager/CalendarManager/PluginManager work standalone
// with just EN/ES + Gregorian + no plugins, exactly as before.
export { LocaleManager, EN_LOCALE, ES_LOCALE };

// Formatter exports
export { DateFormatter } from './formatters/date.formatter';

// Calendar exports (core only: Gregorian + manager)
export {
  CalendarManager,
  GregorianCalendar,
  calendarManager,
} from './calendars/calendar.manager';

// Plugin Manager (core infra, no built-in plugins)
export { PluginManager } from './plugins/manager';

// Factory function (fluent API)
export function timeGuard(input?: unknown, config?: ITimeGuardConfig) {
  return new TimeGuard(input, config);
}

// Convenience exports
declare const __VERSION__: string | undefined;
/** The current version of TimeGuard */
export const version: string =
  typeof __VERSION__ !== 'undefined' ? __VERSION__ : '0.0.0';
