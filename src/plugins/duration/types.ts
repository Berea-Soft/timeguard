/**
 * Duration Plugin Types
 */

export type DurationUnit =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

export interface DurationInput {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface DurationObject {
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
 * Duration class for ISO 8601 durations
 */
export interface IDuration {
  /**
   * Get duration in specific unit
   */
  as(unit: DurationUnit): number;

  /**
   * Get duration as milliseconds
   */
  asMilliseconds(): number;

  /**
   * Get duration as seconds
   */
  asSeconds(): number;

  /**
   * Get duration as minutes
   */
  asMinutes(): number;

  /**
   * Get duration as hours
   */
  asHours(): number;

  /**
   * Get duration as days
   */
  asDays(): number;

  /**
   * Get duration as weeks
   */
  asWeeks(): number;

  /**
   * Get duration as months
   */
  asMonths(): number;

  /**
   * Get duration as years
   */
  asYears(): number;

  /**
   * Get all components
   */
  toObject(): DurationObject;

  /**
   * Get ISO 8601 string representation
   */
  toISO(): string;

  /**
   * Get human-readable string
   */
  humanize(): string;

  /**
   * Check if duration is negative
   */
  isNegative(): boolean;

  /**
   * Get absolute duration
   */
  abs(): IDuration;
}
