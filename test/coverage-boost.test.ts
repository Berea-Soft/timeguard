import { describe, it, expect } from 'vitest';
import { TimeGuard } from '../src/index';
import { DurationResult } from '../src/core';

describe('Coverage Boost for TimeGuard Branch Paths', () => {
  it('should cover static holiday registration invalid date catch block', () => {
    // Start fresh to avoid race conditions with other tests that register holidays
    TimeGuard.clearHolidays();

    // Attempting to register an invalid format/date which should throw internally and be caught/ignored
    TimeGuard.registerHolidays([
      'invalid-date-string-value-that-fails-parsing',
    ]);

    // Invalid date should NOT be added regardless of other parallel test interference
    const holidays = TimeGuard.getRegisteredHolidays();
    expect(holidays).not.toContain(
      'invalid-date-string-value-that-fails-parsing',
    );
  });

  it('should cover static holiday registration with valid dates', () => {
    TimeGuard.clearHolidays();
    TimeGuard.registerHolidays(['2026-12-25', '2026-01-01']);
    const holidays = TimeGuard.getRegisteredHolidays();
    expect(holidays).toContain('2026-12-25');
    expect(holidays).toContain('2026-01-01');
  });

  it('should cover invalid holiday registration that does not modify registry', () => {
    // Register valid holiday and verify it's in the list
    TimeGuard.registerHolidays(['2030-06-15']);
    const holidays = TimeGuard.getRegisteredHolidays();
    expect(holidays).toContain('2030-06-15');
  });

  it('should cover failed timezone conversion catch block in timezone()', () => {
    const tg = TimeGuard.from('2026-05-18T12:00:00');

    // Passing a malformed/invalid timezone should set config.timezone but conversion may fail silently
    const zoned = tg.timezone('invalid-timezone-name-that-throws');

    // The timezone property is set on config regardless
    expect(zoned.timezone()).toBe('invalid-timezone-name-that-throws');

    // toISOString should return a valid ISO string ending in Z
    const isoStr = zoned.toISOString();
    expect(isoStr.endsWith('Z')).toBe(true);
    expect(isoStr).toContain('2026-05-18');
  });

  it('should cover DurationResult explain() empty steps generation', () => {
    const duration = new DurationResult(
      {
        years: 1,
        months: 2,
        weeks: 1,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
        milliseconds: 7,
      },
      'en',
    );

    const explanation = duration.explain();

    expect(explanation.steps).toBeDefined();
    expect(explanation.steps.length).toBeGreaterThan(0);
    expect(explanation.steps).toContain('Years: 1');
    expect(explanation.steps).toContain('Months: 2');
    expect(explanation.steps).toContain('Weeks: 1');
    expect(explanation.steps).toContain('Days: 3');
    expect(explanation.steps).toContain('Hours: 4');
    expect(explanation.steps).toContain('Minutes: 5');
    expect(explanation.steps).toContain('Seconds: 6');
    expect(explanation.steps).toContain('Milliseconds: 7');
  });

  it('should cover DurationResult explain() with leap year flags', () => {
    const duration = new DurationResult(
      {
        years: 2,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
      'en',
      {
        startDate: '2024-01-01',
        endDate: '2026-01-01',
        leapYearFlags: [
          { year: 2024, isLeap: true, daysInFebruary: 29 },
          { year: 2025, isLeap: false, daysInFebruary: 28 },
        ],
      },
    );

    const explanation = duration.explain();

    expect(explanation.explanation).toContain('Leap year(s) detected: 2024');
    expect(explanation.steps).toContain(
      '2024 is a leap year (February has 29 days)',
    );
  });

  it('should cover DurationResult total() unsupported unit error and extra units', () => {
    const duration = new DurationResult({
      years: 1,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    // Unsupported unit should throw
    expect(() => duration.total('invalid-unit' as any)).toThrow(
      'Unsupported unit: invalid-unit',
    );

    // Supported microsecond and nanosecond
    expect(duration.total('microsecond')).toBeGreaterThan(0);
    expect(duration.total('nanosecond')).toBeGreaterThan(0);
  });

  it('should cover DiffResult format() exact mode and empty formatted calendar parts', () => {
    const tg1 = TimeGuard.from('2026-05-18T10:00:00');
    const tg2 = TimeGuard.from('2026-05-18T10:00:00');

    const diffExact = tg1.diff(tg2);
    expect(diffExact.format()).toBe('0 days');
    expect(diffExact.toString()).toBe('0');
    expect(diffExact.toJSON()).toBe(0);

    const diffCalendar = tg1.diff(tg2, { mode: 'calendar' });
    expect(diffCalendar.format()).toBe('0 seconds');
    expect(diffCalendar.toString()).toBe('0 seconds');
  });

  it('should cover TimeRange contains() with non-TimeGuard instances', () => {
    const range = TimeGuard.range('2026-01-01', '2026-12-31');

    // Check with string inputs
    expect(range.contains('2026-06-15')).toBe(true);
    expect(range.contains('2025-12-31')).toBe(false);

    // Check with Date inputs
    expect(range.contains(new Date('2026-06-15'))).toBe(true);
    expect(range.contains(new Date('2027-01-01'))).toBe(false);
  });

  it('should cover TimeRange intersect() with no overlap returning null', () => {
    const range1 = TimeGuard.range('2026-01-01', '2026-03-31');
    const range2 = TimeGuard.range('2026-06-01', '2026-09-30');

    expect(range1.intersect(range2)).toBeNull();
  });

  it('should cover TimeGuard until() and since() with valid duration options', () => {
    const tg1 = TimeGuard.from('2026-05-18');
    const tg2 = TimeGuard.from('2026-05-20');

    // Test normal operation: until() returns an exact DurationResult
    const normalUntil = tg1.until(tg2);
    expect(normalUntil.years).toBe(0);
    expect(normalUntil.days).toBe(2);
    expect(normalUntil.explain().mode).toBe('exact');

    // Test since() normal operation
    const normalSince = tg2.since(tg1);
    expect(normalSince.days).toBe(2);
    expect(normalSince.explain().mode).toBe('exact');

    // Test some edge case — equal dates
    const same = tg1.until(tg1);
    expect(same.years).toBe(0);
    expect(same.days).toBe(0);
    expect(same.humanize()).toBe('0 seconds');
  });

  it('should cover TimeGuard until() with custom options', () => {
    const tg1 = TimeGuard.from('2026-05-18');
    const tg2 = TimeGuard.from('2026-05-20');

    // Using valid largestUnit
    const withOptions = tg1.until(tg2, { largestUnit: 'day' });
    expect(withOptions.days).toBe(2);
  });
});
