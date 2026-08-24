/**
 * TimeGuard - Core Types and Interfaces
 * Following SOLID principles and TypeScript best practices
 *
 * Temporal types are provided natively by TypeScript (lib.esnext.temporal).
 */

export type TemporalPlainDateTime = Temporal.PlainDateTime;
export type TemporalZonedDateTime = Temporal.ZonedDateTime;
export type TemporalPlainDate = Temporal.PlainDate;
export type TemporalPlainTime = Temporal.PlainTime;
export type TemporalDuration = Temporal.Duration;

export interface TemporalPlainDateTimeExtended extends TemporalPlainDateTime {
  dayOfWeek: number;
  dayOfYear: number;
  weekOfYear: number;
  yearOfWeek: number;
  microsecond: number;
  nanosecond: number;
  add<T extends TemporalPlainDateTime>(
    duration: TemporalDuration | Record<string, unknown>,
  ): T;
  subtract<T extends TemporalPlainDateTime>(
    duration: TemporalDuration | Record<string, unknown>,
  ): T;
  with<T extends TemporalPlainDateTime>(fields: Record<string, unknown>): T;
}

export interface TemporalZonedDateTimeExtended extends TemporalZonedDateTime {
  offset: string;
  offsetNanoseconds: number;
  timeZoneId: string;
}

export interface TemporalDurationExtended extends TemporalDuration {
  abs<T extends TemporalDuration>(this: T): T;
}

export interface TemporalDurationLike {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}

export type DurationLike =
  TemporalDuration | TemporalDurationLike | Record<string, unknown>;

export interface TemporalPlainDateTimePolyfill extends TemporalPlainDateTime {
  toZonedDateTime(timeZone: string): TemporalZonedDateTime;
  dayOfWeek: number;
  dayOfYear: number;
  weekOfYear: number;
  yearOfWeek: number;
  add(duration: DurationLike): TemporalPlainDateTimePolyfill;
  subtract(duration: DurationLike): TemporalPlainDateTimePolyfill;
  with(fields: Record<string, unknown>): TemporalPlainDateTimePolyfill;
  since(
    other: TemporalPlainDateTime,
    options?: Record<string, unknown>,
  ): TemporalDuration;
}

export interface TemporalZonedDateTimePolyfill extends TemporalZonedDateTime {
  offset: string;
  offsetNanoseconds: number;
  timeZoneId: string;
  toPlainDateTime(): TemporalPlainDateTime;
}

export interface TemporalLike {
  toPlainDateTime(): TemporalPlainDateTime;
  toPlainDate?(): TemporalPlainDate;
  toPlainTime?(): TemporalPlainTime;
}

export type DateInput =
  | TemporalPlainDateTime
  | TemporalZonedDateTime
  | TemporalPlainDate
  | TemporalPlainTime
  | Date
  | string
  | number
  | Record<string, unknown>;

/**
 * Unit type for date/time operations
 */
export type Unit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'microsecond'
  | 'nanosecond';

/**
 * Format preset strings for common patterns
 */
export type FormatPreset =
  'iso' | 'date' | 'time' | 'datetime' | 'rfc2822' | 'rfc3339' | 'utc';

/**
 * Duration-like object for arithmetic operations
 */
export interface IDuration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}

/**
 * Round options for precision control
 */
export interface IRoundOptions {
  smallestUnit?: Unit;
  roundingMode?:
    | 'ceil'
    | 'floor'
    | 'expand'
    | 'trunc'
    | 'halfExpand'
    | 'halfFloor'
    | 'halfCeil'
    | 'halfTrunc';
  roundingIncrement?: number;
}

/**
 * Duration options for normalizing time differences
 */
export interface IDurationOptions {
  largestUnit?:
    | 'year'
    | 'month'
    | 'week'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'millisecond';
  smallestUnit?:
    | 'year'
    | 'month'
    | 'week'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'millisecond';
}

/**
 * Diff result object that allows chaining with .as()
 * Example: tg1.diff(tg2).as('month')
 */
export interface IDiffResult {
  as(unit: Unit): number;
  /**
   * Get breakdown in calendar mode (e.g., "2 months 5 days")
   * Only available when mode is 'calendar'
   */
  breakdown(): DurationParts | null;
  /**
   * Format the difference as a human-readable string
   * @param locale Locale code (e.g., 'en', 'es', 'fr')
   * @example
   * diff.format('en') // "2 months and 5 days"
   * diff.format('es') // "2 meses y 5 días"
   */
  format(locale?: string): string;
  /**
   * Get the mode used for this diff calculation
   */
  getMode(): 'calendar' | 'exact';
}

/**
 * Options for diff() method
 */
export interface IDiffOptions {
  /**
   * Calculation mode:
   * - 'calendar': Returns months/days breakdown (e.g., 65 days → 2 months 5 days)
   * - 'exact': Returns exact time units (e.g., 65 days)
   * @default 'exact'
   */
  mode?: 'calendar' | 'exact';
  /**
   * Unit for diff when using 'exact' mode
   * @default 'millisecond'
   */
  unit?: Unit;
  /**
   * Locale for formatting output text
   * @default from TimeGuard instance config
   */
  locale?: string;
}

/**
 * Duration parts breakdown
 */
export interface DurationParts {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/**
 * Base interface for formattable duration-like objects
 * Common functionality shared by DiffResult and DurationResult
 */
export interface IFormattableDuration {
  toString(): string;
  toJSON(): Record<string, number> | number;
}

/**
 * Options for humanize() method
 */
export interface IHumanizeOptions {
  /**
   * Locale code (e.g., 'en', 'es', 'fr')
   * @default from TimeGuard instance config
   */
  locale?: string;
  /**
   * Show full breakdown (e.g., "2 months and 5 days")
   * or just largest unit (e.g., "2 months")
   * @default false (largest unit only with Intl.RelativeTimeFormat style)
   */
  fullBreakdown?: boolean;
  /**
   * Numeric format: 'always', 'auto'
   * @default 'always'
   */
  numeric?: 'always' | 'auto';
}

/**
 * Duration result with humanize and total methods
 * Returned by until(), since(), and between()
 * Rich object for business logic: payments, metrics, analytics
 */
export interface IDurationResult extends DurationParts {
  /**
   * Convert duration to human-readable string
   * @example
   * duration.humanize() // "2 months"
   * duration.humanize({ fullBreakdown: true, locale: 'es' }) // "2 meses y 5 días"
   */
  humanize(options?: IHumanizeOptions): string;

  /**
   * Get total duration in specified unit (date-fns style)
   * Perfect for business metrics: payments, analytics, calculations
   *
   * Conversion factors account for:
   * - Leap years (1 year = 365.25 days)
   * - Average month length (1 month = 30.4375 days)
   *
   * @example
   * duration.total('days')    // 65
   * duration.total('months')  // 2.166... (65 / 30.4375)
   * duration.total('hours')   // 1560
   * duration.total('seconds') // 5616000
   *
   * Use cases:
   * - Billing calculations: `duration.total('days') * dailyRate`
   * - Performance metrics: `duration.total('milliseconds')`
   * - Report generation: `duration.total('months')`
   */
  total(unit: Unit): number;

  /**
   * String representation
   * Returns humanized format for display
   */
  toString(): string;

  /**
   * JSON representation
   * Returns breakdown as object for API responses
   */
  toJSON(): Record<string, number>;

  /**
   * Explain the calculation - killer feature for debugging and education
   * Returns detailed breakdown of how the duration was calculated
   *
   * Perfect for:
   * - Debugging complex date calculations
   * - Educational purposes (showing date math)
   * - Auditing time-based business logic
   *
   * @example
   * duration.explain()
   * // {
   * //   input: ['2024-01-15', '2024-03-20'],
   * //   steps: ['...step 1...', '...step 2...'],
   * //   breakdown: { years: 0, months: 2, days: 5, ... },
   * //   mode: 'exact',
   * //   explanation: '...'
   * // }
   */
  explain(): IDurationExplanation;
}

/**
 * Duration explanation object for debugging and education
 * Provides transparent insight into calculation methodology
 * Perfect for: debugging, auditing, educational purposes
 *
 * @example
 * duration.explain()
 * // {
 * //   input: ['2024-01-15', '2024-03-20'],
 * //   steps: [
 * //     'Parsed dates: 2024-01-15 (day 15 of 365) to 2024-03-20 (day 80 of 365)',
 * //     '2024 is a leap year (366 days)',
 * //     'February 2024 has 29 days',
 * //     'Month 1: 31 - 15 = 16 days remaining',
 * //     'Month 2: 29 days (full leap month)',
 * //     'Month 3: 1 - 20 = 20 days',
 * //     'Total: 16 + 29 + 20 = 65 days'
 * //   ],
 * //   breakdown: { years: 0, months: 2, weeks: 0, days: 5, ... },
 * //   mode: 'exact',
 * //   explanation: 'Calculated 2024-01-15 to 2024-03-20 including leap year adjustment'
 * // }
 */
export interface IDurationExplanation {
  /**
   * Input dates as array of strings or formatted representations
   */
  input: string[];

  /**
   * Step-by-step calculation explanation
   * Each step is human-readable and educational
   * Useful for debugging complex date calculations
   */
  steps: string[];

  /**
   * Duration breakdown by component
   * Same as the DurationResult properties
   */
  breakdown: DurationParts;

  /**
   * Calculation mode
   * - 'exact': Uses Temporal API precise calculations
   * - 'estimated': Fallback for edge cases
   */
  mode: 'exact' | 'estimated';

  /**
   * Human-readable explanation of the entire calculation
   * Summarizes the approach and any special handling
   */
  explanation: string;

  /**
   * Locale used for explanation text
   * Supports internationalization of step descriptions
   */
  locale: string;

  /**
   * Leap year flags if applicable
   * Documents which years were leap years in the calculation
   */
  leapYearFlags?: {
    year: number;
    isLeap: boolean;
    daysInFebruary: number;
  }[];

  /**
   * Performance metadata
   * For monitoring calculation complexity
   */
  metadata?: {
    calculationTimeMs: number;
    precision: 'nanosecond' | 'microsecond' | 'millisecond' | 'second' | 'day';
  };
}

/**
 * Calendar system interface
 */
export interface ICalendarSystem {
  id: string;
  name: string;
  locale?: string;
  getMonthName(month: number, short?: boolean): string;
  getWeekdayName(day: number, short?: boolean): string;
  isLeapYear(year: number): boolean;
  daysInMonth(year: number, month: number): number;
  daysInYear(year: number): number;
}

/**
 * Calendar manager interface
 */
export interface ICalendarManager {
  register(calendar: ICalendarSystem): void;
  get(id: string): ICalendarSystem | undefined;
  list(): string[];
  setDefault(id: string): void;
  getDefault(): ICalendarSystem;
}

/**
 * Locale configuration interface
 */
export interface ILocale {
  name: string;
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  meridiem?: {
    am: string;
    pm: string;
  };
  formats?: Record<string, string>;
}

/**
 * Configuration options for TimeGuard instance
 */
export interface ITimeGuardConfig {
  locale?: string;
  timezone?: string;
  strict?: boolean;
}

/**
 * Interface for date/time parsing strategy (Strategy Pattern)
 */
export interface IDateParser {
  parse(input: unknown): TemporalPlainDateTime | null;
  canHandle(input: unknown): boolean;
}

/**
 * Interface for date/time formatting (Strategy Pattern)
 */
export interface IDateFormatter {
  format(
    date: TemporalPlainDateTime | TemporalZonedDateTime,
    pattern: string,
  ): string;
  getPreset(preset: FormatPreset): string;
}

/**
 * Interface for locale management (Single Responsibility)
 */
export interface ILocaleManager {
  setLocale(locale: string, data?: ILocale): void;
  getLocale(locale?: string): ILocale;
  listLocales(): string[];
}

/**
 * Interface for arithmetic operations
 */
export interface IDateArithmetic {
  add(units: Partial<Record<Unit, number>> | IDuration): TimeGuard;
  subtract(units: Partial<Record<Unit, number>> | IDuration): TimeGuard;
  // Overloaded diff: returns IDiffResult without unit, number with unit
  diff(other: TimeGuard): IDiffResult;
  diff(other: TimeGuard, unit: Unit): number;
  until(other: TimeGuard, options?: IDurationOptions): IDurationResult;
  since(other: TimeGuard, options?: IDurationOptions): IDurationResult;
  round(options: IRoundOptions): TimeGuard;
  addBusinessDays(days: number): TimeGuard;
  subtractBusinessDays(days: number): TimeGuard;
}

/**
 * Interface for query operations
 */
export interface IDateQuery {
  isBefore(other: TimeGuard): boolean;
  isAfter(other: TimeGuard): boolean;
  isSame(other: TimeGuard, unit?: Unit): boolean;
  isBetween(
    start: TimeGuard,
    end: TimeGuard,
    unit?: Unit,
    inclusivity?: '[)' | '()' | '[]' | '(]',
  ): boolean;
  isWeekend(): boolean;
  isHoliday(): boolean;
  isBusinessDay(): boolean;
}

/**
 * Interface for manipulation operations
 */
export interface IDateManipulation {
  clone(): TimeGuard;
  startOf(unit: Unit): TimeGuard;
  endOf(unit: Unit): TimeGuard;
  set(values: Partial<Record<Unit, number>>): TimeGuard;
  // Component getters
  year(): number;
  month(): number;
  day(): number;
  hour(): number;
  minute(): number;
  second(): number;
  millisecond(): number;
  dayOfWeek(): number;
  dayOfYear(): number;
  weekOfYear(): number;
  daysInMonth(): number;
  daysInYear(): number;
  inLeapYear(): boolean;
}

/**
 * Interface for timezone operations
 */
export interface ITimezoneAdapter {
  toTimezone(
    date: TemporalPlainDateTime,
    timezone: string,
  ): TemporalZonedDateTime;
  fromTimezone(
    date: TemporalZonedDateTime,
    targetTimezone: string,
  ): TemporalPlainDateTime;
  getOffset(timezone: string): number;
}

/**
 * Main TimeGuard interface (Facade Pattern)
 */
export interface ITimeGuard
  extends IDateArithmetic, IDateQuery, IDateManipulation {
  /**
   * Get the underlying Temporal date object
   */
  toTemporal(): TemporalPlainDateTime | TemporalZonedDateTime;

  /**
   * Get as JavaScript Date (compatibility)
   */
  toDate(): Date;

  /**
   * Get as ISO string
   */
  toISOString(): string;

  /**
   * Get as Unix timestamp (milliseconds)
   */
  valueOf(): number;

  /**
   * Format the date with pattern or preset
   */
  format(pattern: string | FormatPreset): string;

  /**
   * Get accessor for components
   */
  get(component: Unit): number;

  /**
   * Locale of this instance
   */
  locale(): string;

  /**
   * Clone with new locale
   */
  locale(locale: string): TimeGuard;

  /**
   * Timezone info
   */
  timezone(): string | null;

  /**
   * Convert to another timezone
   */
  timezone(timezone: string): TimeGuard;

  /**
   * Get Unix timestamp in seconds
   */
  unix(): number;

  /**
   * Convert to JSON
   */
  toJSON(): string;

  /**
   * String representation
   */
  toString(): string;

  /**
   * Convert to PlainDate object
   */
  toPlainDate(): {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number;
  };

  /**
   * Convert to PlainTime object
   */
  toPlainTime(): {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
  };

  /**
   * Get timezone offset (±HH:mm format or Z)
   */
  getOffset(): string;

  /**
   * Get timezone offset in nanoseconds
   */
  getOffsetNanoseconds(): number;

  /**
   * Get timezone ID
   */
  getTimeZoneId(): string | null;

  /**
   * Start of day
   */
  startOfDay(): TimeGuard;

  /**
   * End of day
   */
  endOfDay(): TimeGuard;

  /**
   * Duration from another date (inverse of until)
   */
  since(other: TimeGuard, options?: IDurationOptions): IDurationResult;

  /**
   * ISO 8601 duration string (P1Y2M3DT4H5M6S)
   */
  toDurationString(other?: TimeGuard): string;

  /**
   * Check if in past
   */
  isPast(): boolean;

  /**
   * Check if in future
   */
  isFuture(): boolean;

  /**
   * Check if today
   */
  isToday(): boolean;

  /**
   * Check if tomorrow
   */
  isTomorrow(): boolean;

  /**
   * Check if yesterday
   */
  isYesterday(): boolean;
}

/**
 * Plugin interface for extending functionality
 */
export interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(timeGuard: typeof TimeGuard, config?: unknown): void;
  /**
   * Reverses whatever install() did to `timeGuard`'s prototype/static
   * surface (deleting added members, restoring wrapped ones). Optional
   * for backward compatibility with plugins written before this hook
   * existed — PluginManager.unuse()/clear() only call it if present, so
   * omitting it just means re-registering the same plugin after a clear()
   * stacks a new patch instead of starting clean (the pre-existing
   * behavior, unchanged for plugins that don't implement this).
   */
  uninstall?(timeGuard: typeof TimeGuard): void;
}

/**
 * Factory interface
 */
export interface ITimeGuardFactory {
  create(input?: unknown, config?: ITimeGuardConfig): ITimeGuard;
  now(config?: ITimeGuardConfig): ITimeGuard;
  fromTemporal(
    date: TemporalPlainDateTime | TemporalZonedDateTime,
    config?: ITimeGuardConfig,
  ): ITimeGuard;
}

/**
 * Forward declaration for TimeGuard class
 * Implementation is in ./index.ts, exported via ./index.ts
 */
export declare class TimeGuard implements ITimeGuard {
  constructor(input?: unknown, config?: ITimeGuardConfig);
  static now(config?: ITimeGuardConfig): TimeGuard;
  static from(input: unknown, config?: ITimeGuardConfig): TimeGuard;
  static fromTemporal(
    temporal: TemporalPlainDateTime | TemporalZonedDateTime,
    config?: ITimeGuardConfig,
  ): TimeGuard;
  static between(date1: TimeGuard, date2: TimeGuard): DurationResult;
  static range(start: unknown, end: unknown): TimeRange;
  static registerHolidays(dates: string[]): void;
  static clearHolidays(): void;
  static getRegisteredHolidays(): string[];
  // Include standard ITimeGuard signatures
  toTemporal(): TemporalPlainDateTime | TemporalZonedDateTime;
  toDate(): Date;
  toISOString(): string;
  valueOf(): number;
  format(pattern: string | FormatPreset): string;
  get(component: Unit): number;
  locale(): string;
  locale(locale: string): TimeGuard;
  timezone(): string | null;
  timezone(timezone: string): TimeGuard;
  unix(): number;
  toJSON(): string;
  toString(): string;
  toPlainDate(): {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number;
  };
  toPlainTime(): {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
  };
  getOffset(): string;
  getOffsetNanoseconds(): number;
  getTimeZoneId(): string | null;
  startOfDay(): TimeGuard;
  endOfDay(): TimeGuard;
  since(other: TimeGuard, options?: IDurationOptions): IDurationResult;
  toDurationString(other?: TimeGuard): string;
  isPast(): boolean;
  isFuture(): boolean;
  isToday(): boolean;
  isTomorrow(): boolean;
  isYesterday(): boolean;
  add(units: Partial<Record<Unit, number>> | IDuration): TimeGuard;
  subtract(units: Partial<Record<Unit, number>> | IDuration): TimeGuard;
  diff(other: TimeGuard): IDiffResult;
  diff(other: TimeGuard, unit: Unit): number;
  until(other: TimeGuard, options?: IDurationOptions): IDurationResult;
  round(options: IRoundOptions): TimeGuard;
  addBusinessDays(days: number): TimeGuard;
  subtractBusinessDays(days: number): TimeGuard;
  isBefore(other: TimeGuard): boolean;
  isAfter(other: TimeGuard): boolean;
  isSame(other: TimeGuard, unit?: Unit): boolean;
  isBetween(
    start: TimeGuard,
    end: TimeGuard,
    unit?: Unit,
    inclusivity?: '[)' | '()' | '[]' | '(]',
  ): boolean;
  isWeekend(): boolean;
  isHoliday(): boolean;
  isBusinessDay(): boolean;
  clone(): TimeGuard;
  startOf(unit: Unit): TimeGuard;
  endOf(unit: Unit): TimeGuard;
  set(values: Partial<Record<Unit, number>>): TimeGuard;
  year(): number;
  month(): number;
  day(): number;
  hour(): number;
  minute(): number;
  second(): number;
  millisecond(): number;
  dayOfWeek(): number;
  dayOfYear(): number;
  weekOfYear(): number;
  daysInMonth(): number;
  daysInYear(): number;
  inLeapYear(): boolean;
}

/**
 * Forward declaration for DurationResult class
 * Implementation is in ./index.ts, exported via ./index.ts
 */
export declare class DurationResult implements IDurationResult {
  constructor(
    parts: DurationParts,
    locale?: string,
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
  );
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  humanize(options?: {
    locale?: string;
    fullBreakdown?: boolean;
    numeric?: 'always' | 'auto';
  }): string;
  total(unit: Unit): number;
  toString(): string;
  toJSON(): Record<string, number>;
  explain(): IDurationExplanation;
}

/**
 * Forward declaration for TimeRange class
 * Fluent API for date range operations with semantic naming
 * Implementation is in ./index.ts, exported via ./index.ts
 */
export declare class TimeRange {
  constructor(start: TimeGuard, end: TimeGuard);
  get start(): TimeGuard;
  get end(): TimeGuard;
  toDuration(): DurationResult;
  inMonths(): number;
  humanize(options?: {
    locale?: string;
    fullBreakdown?: boolean;
    numeric?: 'always' | 'auto';
  }): string;
  in(unit: Unit): number;
  contains(date: unknown): boolean;
  overlaps(other: TimeRange): boolean;
  intersect(other: TimeRange): TimeRange | null;
  union(other: TimeRange): TimeRange;
}
