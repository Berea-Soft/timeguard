/**
 * TimeGuard Duration Plugin
 * Implements ISO 8601 duration support and time calculations
 * Follows SOLID principles and enables advanced duration operations
 */

import type { ITimeGuardPlugin } from '../../types';
import type { TimeGuard } from '../../index';
import type {
  DurationInput,
  DurationObject,
  DurationUnit,
  IDuration,
} from './types';

/**
 * Duration class - represents time span following ISO 8601 standard
 */
export class Duration implements IDuration {
  private years: number = 0;
  private months: number = 0;
  private weeks: number = 0;
  private days: number = 0;
  private hours: number = 0;
  private minutes: number = 0;
  private seconds: number = 0;
  private milliseconds: number = 0;

  constructor(input: DurationInput) {
    this.years = input.years || 0;
    this.months = input.months || 0;
    this.weeks = input.weeks || 0;
    this.days = input.days || 0;
    this.hours = input.hours || 0;
    this.minutes = input.minutes || 0;
    this.seconds = input.seconds || 0;
    this.milliseconds = input.milliseconds || 0;
  }

  /**
   * Create Duration from ISO 8601 string
   * @example Duration.fromISO("P3Y6M4DT12H30M5S")
   */
  static fromISO(iso: string): Duration {
    const isoRegex =
      /^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?)?$/;
    const match = iso.match(isoRegex);

    if (!match) {
      throw new Error(`Invalid ISO 8601 duration: ${iso}`);
    }

    const [, negative, years, months, weeks, days, hours, minutes, seconds] =
      match;
    const multiplier = negative ? -1 : 1;

    return new Duration({
      years: parseInt(years || '0', 10) * multiplier,
      months: parseInt(months || '0', 10) * multiplier,
      weeks: parseInt(weeks || '0', 10) * multiplier,
      days: parseInt(days || '0', 10) * multiplier,
      hours: parseInt(hours || '0', 10) * multiplier,
      minutes: parseInt(minutes || '0', 10) * multiplier,
      seconds: parseFloat(seconds || '0') * multiplier,
    });
  }

  /**
   * Create a Duration between this date and another
   */
  static between(from: TimeGuard, to: TimeGuard): Duration {
    // Calculate (to - from) using since() for proper duration
    const fromDT = (
      from as unknown as { toTemporal(): Temporal.PlainDateTime }
    ).toTemporal();
    const toDT = (
      to as unknown as { toTemporal(): Temporal.PlainDateTime }
    ).toTemporal();
    const duration = (
      toDT as unknown as {
        since(other: Temporal.PlainDateTime): {
          years?: number;
          months?: number;
          days?: number;
          hours?: number;
          minutes?: number;
          seconds?: number;
          milliseconds?: number;
        };
      }
    ).since(fromDT);

    return new Duration({
      years: duration.years || 0,
      months: duration.months || 0,
      weeks: 0,
      days: duration.days || 0,
      hours: duration.hours || 0,
      minutes: duration.minutes || 0,
      seconds: duration.seconds || 0,
      milliseconds: duration.milliseconds || 0,
    });
  }

  /**
   * Create Duration from milliseconds
   */
  static fromMilliseconds(ms: number): Duration {
    const isNegative = ms < 0;
    const absMilhs = Math.abs(ms);

    const years = Math.floor(absMilhs / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (absMilhs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
    );
    const days = Math.floor(
      (absMilhs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
    );
    const hours = Math.floor(
      (absMilhs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((absMilhs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absMilhs % (1000 * 60)) / 1000);
    const milliseconds = Math.floor(absMilhs % 1000);

    const multiplier = isNegative ? -1 : 1;

    return new Duration({
      years: years * multiplier,
      months: months * multiplier,
      days: days * multiplier,
      hours: hours * multiplier,
      minutes: minutes * multiplier,
      seconds: seconds * multiplier,
      milliseconds: milliseconds * multiplier,
    });
  }

  /**
   * Get duration in specific unit
   */
  as(unit: DurationUnit): number {
    const ms = this.asMilliseconds();

    const conversions: Record<DurationUnit, number> = {
      milliseconds: 1,
      seconds: 1000,
      minutes: 1000 * 60,
      hours: 1000 * 60 * 60,
      days: 1000 * 60 * 60 * 24,
      weeks: 1000 * 60 * 60 * 24 * 7,
      months: 1000 * 60 * 60 * 24 * 30,
      years: 1000 * 60 * 60 * 24 * 365,
    };

    return ms / conversions[unit];
  }

  /**
   * Get duration as milliseconds
   */
  asMilliseconds(): number {
    return (
      this.years * 1000 * 60 * 60 * 24 * 365 +
      this.months * 1000 * 60 * 60 * 24 * 30 +
      this.weeks * 1000 * 60 * 60 * 24 * 7 +
      this.days * 1000 * 60 * 60 * 24 +
      this.hours * 1000 * 60 * 60 +
      this.minutes * 1000 * 60 +
      this.seconds * 1000 +
      this.milliseconds
    );
  }

  /**
   * Get duration as seconds
   */
  asSeconds(): number {
    return this.asMilliseconds() / 1000;
  }

  /**
   * Get duration as minutes
   */
  asMinutes(): number {
    return this.asSeconds() / 60;
  }

  /**
   * Get duration as hours
   */
  asHours(): number {
    return this.asMinutes() / 60;
  }

  /**
   * Get duration as days
   */
  asDays(): number {
    return this.asHours() / 24;
  }

  /**
   * Get duration as weeks
   */
  asWeeks(): number {
    return this.asDays() / 7;
  }

  /**
   * Get duration as months
   */
  asMonths(): number {
    return this.asDays() / 30;
  }

  /**
   * Get duration as years
   */
  asYears(): number {
    return this.asDays() / 365;
  }

  /**
   * Get all components
   */
  toObject(): DurationObject {
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

  /**
   * Get ISO 8601 string representation
   * @example "P3Y6M4DT12H30M5S"
   */
  toISO(): string {
    // Date part
    let datePart = '';
    if (this.years) {
      datePart += `${this.years}Y`;
    }
    if (this.months) {
      datePart += `${this.months}M`;
    }
    if (this.weeks || this.days) {
      datePart += `${this.weeks * 7 + this.days}D`;
    }

    // Time part
    let timePart = '';
    if (this.hours) {
      timePart += `${this.hours}H`;
    }
    if (this.minutes) {
      timePart += `${this.minutes}M`;
    }
    if (this.seconds || this.milliseconds) {
      timePart += `${this.seconds + this.milliseconds / 1000}S`;
    }

    const sign = this.isNegative() ? '-' : '';
    return `${sign}P${datePart}${timePart ? `T${timePart}` : ''}`;
  }

  /**
   * Get human-readable string
   */
  humanize(): string {
    const parts: string[] = [];

    if (this.years) {
      parts.push(
        `${Math.abs(this.years)} year${Math.abs(this.years) !== 1 ? 's' : ''}`,
      );
    }
    if (this.months) {
      parts.push(
        `${Math.abs(this.months)} month${Math.abs(this.months) !== 1 ? 's' : ''}`,
      );
    }
    if (this.weeks) {
      parts.push(
        `${Math.abs(this.weeks)} week${Math.abs(this.weeks) !== 1 ? 's' : ''}`,
      );
    }
    if (this.days) {
      parts.push(
        `${Math.abs(this.days)} day${Math.abs(this.days) !== 1 ? 's' : ''}`,
      );
    }
    if (this.hours) {
      parts.push(
        `${Math.abs(this.hours)} hour${Math.abs(this.hours) !== 1 ? 's' : ''}`,
      );
    }
    if (this.minutes) {
      parts.push(
        `${Math.abs(this.minutes)} minute${Math.abs(this.minutes) !== 1 ? 's' : ''}`,
      );
    }
    if (this.seconds) {
      parts.push(
        `${Math.abs(this.seconds)} second${Math.abs(this.seconds) !== 1 ? 's' : ''}`,
      );
    }
    if (this.milliseconds) {
      parts.push(`${Math.abs(this.milliseconds)} ms`);
    }

    if (parts.length === 0) {
      return '0 seconds';
    }

    const text = parts.join(', ');
    return this.isNegative() ? `-${text}` : text;
  }

  /**
   * Check if duration is negative
   */
  isNegative(): boolean {
    return (
      this.years < 0 ||
      this.months < 0 ||
      this.weeks < 0 ||
      this.days < 0 ||
      this.hours < 0 ||
      this.minutes < 0 ||
      this.seconds < 0 ||
      this.milliseconds < 0
    );
  }

  /**
   * Get absolute duration
   */
  abs(): Duration {
    return new Duration({
      years: Math.abs(this.years),
      months: Math.abs(this.months),
      weeks: Math.abs(this.weeks),
      days: Math.abs(this.days),
      hours: Math.abs(this.hours),
      minutes: Math.abs(this.minutes),
      seconds: Math.abs(this.seconds),
      milliseconds: Math.abs(this.milliseconds),
    });
  }

  /**
   * String representation
   */
  toString(): string {
    return this.toISO();
  }
}

/**
 * Duration Plugin
 */
export class DurationPlugin implements ITimeGuardPlugin {
  name = 'duration';
  version = '1.0.0';

  /**
   * Install plugin into TimeGuard
   */
  install(TimeGuardClass: typeof TimeGuard): void {
    /**
     * Create a Duration between this date and another
     */
    (
      TimeGuardClass.prototype as unknown as {
        duration: (other: TimeGuard) => Duration;
      }
    ).duration = function (other: TimeGuard): Duration {
      return Duration.between(this as unknown as TimeGuard, other);
    };

    (
      TimeGuardClass as unknown as {
        Duration: typeof Duration;
        duration: {
          fromISO: (iso: string) => Duration;
          between: (from: TimeGuard, to: TimeGuard) => Duration;
          fromMilliseconds: (ms: number) => Duration;
        };
      }
    ).Duration = Duration;

    (
      TimeGuardClass as unknown as {
        Duration: typeof Duration;
        duration: {
          fromISO: (iso: string) => Duration;
          between: (from: TimeGuard, to: TimeGuard) => Duration;
          fromMilliseconds: (ms: number) => Duration;
        };
      }
    ).duration = {
      fromISO: (iso: string): Duration => Duration.fromISO(iso),
      between: (from: TimeGuard, to: TimeGuard): Duration =>
        Duration.between(from, to),
      fromMilliseconds: (ms: number): Duration => Duration.fromMilliseconds(ms),
    };
  }

  /**
   * Reverse install() — none of these (instance `.duration()`, static
   * `Duration`/`duration`) pre-exist on TimeGuard, so undoing this is
   * just deleting them.
   */
  uninstall(TimeGuardClass: typeof TimeGuard): void {
    delete (TimeGuardClass.prototype as unknown as Record<string, unknown>)
      .duration;
    delete (TimeGuardClass as unknown as Record<string, unknown>).Duration;
    delete (TimeGuardClass as unknown as Record<string, unknown>).duration;
  }
}

/**
 * Create and export default instance
 */
export const durationPlugin = new DurationPlugin();

export default durationPlugin;
