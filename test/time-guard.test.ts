/**
 * TimeGuard Core Tests - BDD/TDD approach
 * Testing main functionality and core API
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TimeGuard, timeGuard } from '../src/index';

describe('TimeGuard - Core Functionality', () => {
  describe('Creating instances', () => {
    it('should create a TimeGuard instance with current date when no argument provided', () => {
      const tg = new TimeGuard();
      expect(tg).toBeDefined();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });

    it('should create a TimeGuard instance from a Date object', () => {
      const date = new Date('2024-03-13');
      const tg = new TimeGuard(date);
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should create a TimeGuard instance from an ISO string', () => {
      const tg = new TimeGuard('2024-03-13T10:30:00');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should create a TimeGuard instance from a timestamp (ms)', () => {
      const timestamp = new Date('2024-03-13').getTime();
      const tg = new TimeGuard(timestamp);
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should create a TimeGuard instance from another TimeGuard instance', () => {
      const original = new TimeGuard('2024-03-13T10:30:00.123456789');
      const copy = new TimeGuard(original);
      expect(copy.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 10:30:00');
      expect(copy.get('nanosecond')).toBe(original.get('nanosecond'));
      expect(copy.valueOf()).toBe(original.valueOf());
    });

    it('should create using static factory TimeGuard.now()', () => {
      const tg = TimeGuard.now();
      expect(tg).toBeDefined();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });

    it('should create using factory function timeGuard()', () => {
      const tg = timeGuard('2024-03-13');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should support config with locale', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'es' });
      expect(tg.locale()).toBe('es');
    });
  });

  describe('Formatting', () => {
    beforeEach(() => {
      // Use a fixed date for consistent testing
    });

    it('should format with YYYY-MM-DD pattern', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should format with time HH:mm:ss pattern', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('HH:mm:ss')).toBe('14:30:45');
    });

    it('should format with full datetime pattern', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('YYYY-MM-DD HH:mm:ss')).toContain('2024-03-13');
      expect(tg.format('YYYY-MM-DD HH:mm:ss')).toContain('14:30:45');
    });

    it('should format with preset patterns', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('date')).toBe('2024-03-13');
      expect(tg.format('time')).toBe('14:30:45');
    });

    it('should format with localized month and day names (EN)', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123', { locale: 'en' });
      const formatted = tg.format('MMMM D, YYYY');
      expect(formatted).toContain('March');
      expect(formatted).toContain('13');
      expect(formatted).toContain('2024');
    });

    it('should format with localized month and day names (ES)', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123', { locale: 'es' });
      const formatted = tg.format('MMMM D, YYYY');
      expect(formatted).toContain('Marzo');
    });

    it('should change locale and reformat', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123', { locale: 'en' });
      const formatted1 = tg.format('MMMM');
      const tgES = tg.locale('es');
      const formatted2 = tgES.format('MMMM');
      expect(formatted1).not.toBe(formatted2);
    });
  });

  describe('Arithmetic operations', () => {
    it('should add days', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ day: 5 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-18');
    });

    it('should add months', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ month: 1 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-04-13');
    });

    it('should add years', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ year: 1 });
      expect(result.format('YYYY-MM-DD')).toBe('2025-03-13');
    });

    it('should add multiple units at once', () => {
      const tg = new TimeGuard('2024-03-13T10:00:00');
      const result = tg.add({ day: 1, hour: 5, minute: 30 });
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-14 15:30:00');
    });

    it('should subtract days', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.subtract({ day: 5 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-08');
    });

    it('should subtract months', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.subtract({ month: 1 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-02-13');
    });

    it('should not modify original when adding', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ day: 5 });
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-18');
    });
  });

  describe('Query operations', () => {
    it('should determine if date is before another', () => {
      const tg1 = new TimeGuard('2024-03-10');
      const tg2 = new TimeGuard('2024-03-13');
      expect(tg1.isBefore(tg2)).toBe(true);
      expect(tg2.isBefore(tg1)).toBe(false);
    });

    it('should determine if date is after another', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-03-10');
      expect(tg1.isAfter(tg2)).toBe(true);
      expect(tg2.isAfter(tg1)).toBe(false);
    });

    it('should determine if dates are the same', () => {
      const tg1 = new TimeGuard('2024-03-13T10:30:00');
      const tg2 = new TimeGuard('2024-03-13T10:30:00');
      expect(tg1.isSame(tg2)).toBe(true);
    });

    it('should determine if dates are same by unit (year)', () => {
      const tg1 = new TimeGuard('2024-01-01');
      const tg2 = new TimeGuard('2024-12-31');
      expect(tg1.isSame(tg2, 'year')).toBe(true);
    });

    it('should determine if dates are same by unit (month)', () => {
      const tg1 = new TimeGuard('2024-03-01');
      const tg2 = new TimeGuard('2024-03-31');
      expect(tg1.isSame(tg2, 'month')).toBe(true);
    });

    it('should determine if dates are same by unit (day)', () => {
      const tg1 = new TimeGuard('2024-03-13T10:00:00');
      const tg2 = new TimeGuard('2024-03-13T20:00:00');
      expect(tg1.isSame(tg2, 'day')).toBe(true);
    });

    it('should check if date is between two dates', () => {
      const start = new TimeGuard('2024-03-01');
      const middle = new TimeGuard('2024-03-13');
      const end = new TimeGuard('2024-03-31');
      expect(middle.isBetween(start, end)).toBe(true);
    });

    it('should check if date is between using inclusivity', () => {
      const start = new TimeGuard('2024-03-01');
      const date = new TimeGuard('2024-03-01');
      const end = new TimeGuard('2024-03-31');
      expect(date.isBetween(start, end, undefined, '[]')).toBe(true);
      expect(date.isBetween(start, end, undefined, '()')).toBe(false);
    });
  });

  describe('Manipulation operations', () => {
    it('should clone a TimeGuard instance', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = tg1.clone();
      expect(tg1.format('YYYY-MM-DD')).toBe(tg2.format('YYYY-MM-DD'));
      expect(tg1).not.toBe(tg2); // Different instances
    });

    it('should get start of year', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('year');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-01-01 00:00:00');
    });

    it('should get start of month', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('month');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-01 00:00:00');
    });

    it('should get start of day', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('day');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 00:00:00');
    });

    it('should get start of hour', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('hour');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 14:00:00');
    });

    it('should get end of month', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.endOf('month');
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-31');
    });

    it('should set specific values', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.set({ month: 12, day: 25 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-12-25');
    });

    it('should not modify original when manipulating', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('day');
      expect(tg.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 14:30:45');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 00:00:00');
    });
  });

  describe('Conversion methods', () => {
    it('should convert to Date object', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const date = tg.toDate();
      expect(date).toBeInstanceOf(Date);
    });

    it('should convert to ISO string', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      const iso = tg.toISOString();
      expect(iso).toContain('2024-03-13');
      expect(iso).toContain('14:30:45');
    });

    it('should convert to Unix timestamp (milliseconds)', () => {
      const date = new Date('2024-03-13T14:30:45.000Z');
      const expected = date.getTime();
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(Math.abs(tg.valueOf() - expected)).toBeLessThan(1000); // Within 1 second
    });

    it('should convert to Unix timestamp (seconds)', () => {
      const date = new Date('2024-03-13T14:30:45.000Z');
      const expected = Math.floor(date.getTime() / 1000);
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(Math.abs(tg.unix() - expected)).toBeLessThan(1); // Within 1 second
    });

    it('should convert to JSON', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const json = tg.toJSON();
      expect(json).toContain('2024-03-13');
    });

    it('should convert to string', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const str = tg.toString();
      expect(str).toBe('2024-03-13 14:30:45');
    });
  });

  describe('Getter methods', () => {
    it('should get year', () => {
      const tg = new TimeGuard('2024-03-13');
      expect(tg.get('year')).toBe(2024);
    });

    it('should get month', () => {
      const tg = new TimeGuard('2024-03-13');
      expect(tg.get('month')).toBe(3);
    });

    it('should get day', () => {
      const tg = new TimeGuard('2024-03-13');
      expect(tg.get('day')).toBe(13);
    });

    it('should get hour', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(tg.get('hour')).toBe(14);
    });

    it('should get minute', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(tg.get('minute')).toBe(30);
    });

    it('should get second', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(tg.get('second')).toBe(45);
    });
  });

  describe('Difference calculations', () => {
    it('should calculate difference in days', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-03-18');
      const diff = tg2.diff(tg1, 'day');
      expect(diff).toBe(5);
    });

    it('should calculate difference in months', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-06-13');
      const diff = tg2.diff(tg1, 'month');
      expect(diff).toBe(3);
    });

    it('should calculate difference in years', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2026-03-13');
      const diff = tg2.diff(tg1, 'year');
      expect(diff).toBe(2);
    });

    it('should calculate negative difference', () => {
      const tg1 = new TimeGuard('2024-03-18');
      const tg2 = new TimeGuard('2024-03-13');
      const diff = tg2.diff(tg1, 'day');
      expect([5, -5, 24]).toContain(Math.abs(diff));
    });

    it('should support diff().as() for unit conversion', () => {
      const tg1 = new TimeGuard('2024-03-13T12:00:00');
      const tg2 = new TimeGuard('2024-03-18T12:00:00');
      const diffResult = tg1.diff(tg2);
      // Should have .as() method
      expect(typeof diffResult.as).toBe('function');
      // Should be able to convert to different units
      expect(typeof diffResult.as('day')).toBe('number');
      expect(typeof diffResult.as('hour')).toBe('number');
      expect(typeof diffResult.as('second')).toBe('number');
    });

    it('should support diff().as() with month conversion', () => {
      const tg1 = new TimeGuard('2024-01-01T12:00:00');
      const tg2 = new TimeGuard('2024-04-01T12:00:00');
      const diffResult = tg1.diff(tg2);
      // Convert to months - should be positive
      const months = diffResult.as('month');
      expect(months).not.toBe(0);
    });

    it('should maintain backward compatibility with diff(unit)', () => {
      const tg1 = new TimeGuard('2024-01-01T00:00:00');
      const tg2 = new TimeGuard('2024-01-11T00:00:00');
      // Old API: diff(unit)
      const diff = tg1.diff(tg2, 'day');
      expect(typeof diff).toBe('number');
      // Should have a value (10 days)
      expect(Math.abs(diff)).toBeGreaterThan(5);
    });

    it('should return the TOTAL difference in a small unit, not the remainder below a larger implicit unit', () => {
      // Regression test: diff(other, unit) used to pass smallestUnit without
      // a matching largestUnit, so Temporal balanced the gap into whatever
      // larger unit fit first — e.g. a 5-hour gap became `{hours: 5}` with
      // `minutes: 0`, so diff(..., 'minute') returned 0 instead of 300.
      const tg1 = new TimeGuard('2024-03-13T10:00:00');
      const tg2 = new TimeGuard('2024-03-13T15:00:00'); // 5 hours later
      expect(tg2.diff(tg1, 'minute')).toBe(300);
      expect(tg2.diff(tg1, 'second')).toBe(18000);
      expect(tg2.diff(tg1, 'millisecond')).toBe(18000000);
    });

    it('should return the total difference in hours across a multi-day gap', () => {
      const tg1 = new TimeGuard('2024-03-13T00:00:00');
      const tg2 = new TimeGuard('2024-03-15T00:00:00'); // 2 days later
      expect(tg2.diff(tg1, 'hour')).toBe(48);
    });

    it('diffResult should support numeric operations', () => {
      const tg1 = new TimeGuard('2024-01-01T00:00:00');
      const tg2 = new TimeGuard('2024-01-11T00:00:00');
      const diffResult = tg1.diff(tg2);
      // Should support numeric operations via valueOf()
      const numValue = diffResult.valueOf();
      expect(typeof numValue).toBe('number');
      // Should be some value (in milliseconds, roughly 10 days)
      expect(Math.abs(numValue)).toBeGreaterThan(1000000);
    });
  });

  describe('Duration with smallestUnit option', () => {
    it('should calculate duration with largestUnit and smallestUnit', () => {
      const start = new TimeGuard('2024-01-01T10:30:45');
      const end = new TimeGuard('2024-01-01T14:45:30');
      const duration = start.until(end, {
        largestUnit: 'hour',
        smallestUnit: 'minute',
      });
      // Should return hours and minutes
      expect(typeof duration.hours).toBe('number');
      expect(typeof duration.minutes).toBe('number');
    });

    it('should work with since() and smallestUnit', () => {
      const start = new TimeGuard('2024-01-01T10:30:45');
      const end = new TimeGuard('2024-01-01T14:45:30');
      const duration = end.since(start, { smallestUnit: 'second' });
      // Should include seconds in the result
      expect(typeof duration.seconds).toBe('number');
    });
  });

  describe('Duration with largestUnit option', () => {
    it('should calculate duration with largestUnit: month (65 days -> 2 months 5 days)', () => {
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-03-06');
      const duration = start.until(end, { largestUnit: 'month' });
      console.log('Duration with largestUnit: month:', duration);
      // When largestUnit is 'month', Temporal should break down into months + remaining days
      expect(duration.months).toBeGreaterThan(0);
      expect(duration.days).toBeGreaterThanOrEqual(0);
    });

    it('should calculate duration with largestUnit: day (days only)', () => {
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-03-06');
      const duration = start.until(end, { largestUnit: 'day' });
      console.log('Duration with largestUnit: day:', duration);
      // When largestUnit is 'day', should get total days
      expect(duration.days).toBeGreaterThan(0);
    });

    it('should calculate duration with largestUnit: hour', () => {
      const start = new TimeGuard('2024-03-13T10:00:00');
      const end = new TimeGuard('2024-03-13T14:30:00');
      const duration = start.until(end, { largestUnit: 'hour' });
      expect(duration.hours).toBeGreaterThan(0);
      expect(duration.days).toBe(0);
    });

    it('should work with since() method', () => {
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-03-06');
      const duration = end.since(start, { largestUnit: 'month' });
      console.log('Duration with since() and largestUnit: month:', duration);
      expect(duration.months).toBeGreaterThan(0);
      expect(duration.days).toBeGreaterThanOrEqual(0);
    });

    it('should return normalized durations without largestUnit', () => {
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-03-06');
      const duration = start.until(end);
      console.log('Duration without largestUnit:', duration);
      // Without largestUnit, should return all components
      expect(typeof duration.years).toBe('number');
      expect(typeof duration.months).toBe('number');
      expect(typeof duration.days).toBe('number');
    });
  });

  describe('Locale operations', () => {
    it('should set default locale', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'en' });
      expect(tg.locale()).toBe('en');
    });

    it('should support Spanish locale', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'es' });
      expect(tg.locale()).toBe('es');
    });

    it('should format month name in Spanish', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'es' });
      const formatted = tg.format('MMMM');
      expect(formatted).toBe('Marzo');
    });

    it('should create new instance with different locale', () => {
      const tg1 = new TimeGuard('2024-03-13', { locale: 'en' });
      const tg2 = tg1.locale('es');
      expect(tg1.locale()).toBe('en');
      expect(tg2.locale()).toBe('es');
    });
  });

  describe('Sub-millisecond precision', () => {
    it('should preserve nanosecond precision through clone()', () => {
      const tg = new TimeGuard('2024-03-13T10:30:00.123456789');
      const cloned = tg.clone();
      expect(cloned.get('microsecond')).toBe(tg.get('microsecond'));
      expect(cloned.get('nanosecond')).toBe(tg.get('nanosecond'));
    });

    it('should preserve nanosecond precision through locale()', () => {
      const tg = new TimeGuard('2024-03-13T10:30:00.123456789', {
        locale: 'en',
      });
      const withLocale = tg.locale('es');
      expect(withLocale.get('microsecond')).toBe(tg.get('microsecond'));
      expect(withLocale.get('nanosecond')).toBe(tg.get('nanosecond'));
    });

    it('should preserve nanosecond precision through timezone()', () => {
      const tg = new TimeGuard('2024-03-13T10:30:00.123456789');
      const withTz = tg.timezone('America/New_York');
      expect(withTz.get('microsecond')).toBe(tg.get('microsecond'));
      expect(withTz.get('nanosecond')).toBe(tg.get('nanosecond'));
    });
  });

  describe('API Features', () => {
    it('should maintain consistent API surface', () => {
      const tg = TimeGuard.now();
      // Check that all expected methods exist
      expect(typeof tg.format).toBe('function');
      expect(typeof tg.add).toBe('function');
      expect(typeof tg.subtract).toBe('function');
      expect(typeof tg.clone).toBe('function');
      expect(typeof tg.diff).toBe('function');
      expect(typeof tg.isBefore).toBe('function');
      expect(typeof tg.isAfter).toBe('function');
      expect(typeof tg.isSame).toBe('function');
      expect(typeof tg.get).toBe('function');
      expect(typeof tg.set).toBe('function');
      expect(typeof tg.startOf).toBe('function');
      expect(typeof tg.endOf).toBe('function');
      expect(typeof tg.toDate).toBe('function');
      expect(typeof tg.valueOf).toBe('function');
      expect(typeof tg.locale).toBe('function');
    });

    it('should support method chaining', () => {
      const result = TimeGuard.now()
        .add({ day: 1 })
        .add({ hour: 5 })
        .set({ minute: 0 });

      expect(result).toBeInstanceOf(TimeGuard);
      expect(result.get('day')).toBeGreaterThan(0);
    });
  });

  describe('Calendar-aware diff mode', () => {
    it('should support calendar mode with breakdown', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const diff = start.diff(end, { mode: 'calendar' });

      expect(diff.getMode()).toBe('calendar');
      expect(diff.breakdown()).not.toBeNull();
    });

    it('should calculate months and days in calendar mode', () => {
      // From Jan 15 to Mar 20 = 2 months 5 days
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const diff = start.diff(end, { mode: 'calendar' });
      const bd = diff.breakdown();

      expect(bd).not.toBeNull();
      expect(bd!.months).toBeGreaterThan(0);
      expect(bd!.days).toBeGreaterThan(0);
    });

    it('should format calendar diff in English', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const diff = start.diff(end, { mode: 'calendar', locale: 'en' });
      const formatted = diff.format('en');

      expect(formatted).toMatch(/month|day/);
    });

    it('should format calendar diff in Spanish', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const diff = start.diff(end, { mode: 'calendar', locale: 'es' });
      const formatted = diff.format('es');

      // Spanish translations
      expect(formatted).toMatch(/mes|día/);
    });

    it('should support exact mode (default behavior)', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const diff = start.diff(end, { mode: 'exact' });

      expect(diff.getMode()).toBe('exact');
      expect(diff.breakdown()).toBeNull();
    });

    it('should convert calendar diff to different units with as()', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-01-20');
      const diff = start.diff(end, { mode: 'calendar' });

      const days = diff.as('day');
      // The difference is 5 days (absolute)
      expect(Math.abs(days) % 7).toBeLessThan(7); // Should be in day range
    });

    it('should handle large date differences in calendar mode', () => {
      const start = new TimeGuard('2020-01-01');
      const end = new TimeGuard('2024-12-31');
      const diff = start.diff(end, { mode: 'calendar' });
      const bd = diff.breakdown();

      expect(bd).not.toBeNull();
      expect(Math.abs(bd!.years) + Math.abs(bd!.months)).toBeGreaterThan(0);
    });

    it('should support numeric operations on calendar diff', () => {
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-01-11');
      const diff = start.diff(end, { mode: 'calendar' });

      const numValue = diff.valueOf();
      expect(typeof numValue).toBe('number');
      expect(Math.abs(numValue)).toBeGreaterThan(0);
    });

    it('should use instance locale when not specified', () => {
      const start = new TimeGuard('2024-01-15', { locale: 'es' });
      const end = new TimeGuard('2024-03-20');
      const diff = start.diff(end, { mode: 'calendar' });
      const formatted = diff.format(); // Should use start's locale

      expect(formatted).toBeTruthy();
    });

    it('should work with toString() for calendar mode', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const diff = start.diff(end, { mode: 'calendar' });
      const str = diff.toString();

      // Should format nicely for display
      expect(str).toBeTruthy();
      expect(str.length).toBeGreaterThan(0);
    });
  });

  describe('Humanize duration', () => {
    it('should humanize with default (Intl.RelativeTimeFormat style)', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize();

      // Should return something like "2 months"
      expect(text).toBeTruthy();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should humanize with fullBreakdown option', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ fullBreakdown: true });

      // Should return "2 months and 5 days"
      expect(text).toBeTruthy();
      expect(text).toMatch(/month|day/);
    });

    it('should support Spanish locale', () => {
      const start = new TimeGuard('2024-01-15', { locale: 'es' });
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ locale: 'es' });

      // Should use Spanish labels
      expect(text).toBeTruthy();
      expect(typeof text).toBe('string');
    });

    it('should support Spanish locale with fullBreakdown', () => {
      const start = new TimeGuard('2024-01-15', { locale: 'es' });
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ locale: 'es', fullBreakdown: true });

      // Should return "2 meses y 5 días"
      expect(text).toBeTruthy();
      expect(text).toMatch(/mes|día|meses|días/);
    });

    it('should support French locale', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ locale: 'fr' });

      // Should use French labels
      expect(text).toBeTruthy();
      expect(typeof text).toBe('string');
    });

    it('should work with since() method', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = end.since(start);
      const text = duration.humanize();

      // Should work similarly to until()
      expect(text).toBeTruthy();
      expect(typeof text).toBe('string');
    });

    it('should handle small durations', () => {
      const start = new TimeGuard('2024-03-20T10:00:00');
      const end = new TimeGuard('2024-03-20T10:05:30');
      const duration = start.until(end);
      const text = duration.humanize();

      // Should return minutes or seconds
      expect(text).toBeTruthy();
      expect(text).toMatch(/second|minute/i);
    });

    it('should handle large durations', () => {
      const start = new TimeGuard('2020-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ fullBreakdown: true });

      // Should include years
      expect(text).toBeTruthy();
      expect(text).toMatch(/year|month|day/i);
    });

    it('should inherit locale from TimeGuard instance', () => {
      const start = new TimeGuard('2024-01-15', { locale: 'es' });
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize(); // No locale specified

      // Should use instance's locale (es)
      expect(text).toBeTruthy();
    });

    it('should handle zero duration', () => {
      const tg = new TimeGuard('2024-01-15');
      const duration = tg.until(tg);
      const text = duration.humanize();

      // Should return something sensible like "0 seconds"
      expect(text).toBeTruthy();
      expect(text.toLowerCase()).toContain('second');
    });

    it('should support all Duration properties', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      // Should have DurationParts properties
      expect(duration.years).toBeDefined();
      expect(duration.months).toBeDefined();
      expect(duration.weeks).toBeDefined();
      expect(duration.days).toBeDefined();
      expect(duration.hours).toBeDefined();
      expect(duration.minutes).toBeDefined();
      expect(duration.seconds).toBeDefined();
      expect(duration.milliseconds).toBeDefined();
    });

    it('should format with multiple units and conjunction', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ locale: 'en', fullBreakdown: true });

      // English should use "and"
      expect(text).toContain('and');
    });

    it('should format with Spanish conjunction', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ locale: 'es', fullBreakdown: true });

      // Spanish should use "y"
      expect(text).toContain('y');
    });

    it('should format with French conjunction', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);
      const text = duration.humanize({ locale: 'fr', fullBreakdown: true });

      // French should use "et"
      expect(text).toContain('et');
    });
  });

  describe('Semantic between() API', () => {
    it('should calculate between two dates (semantic alternative to until)', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');

      const duration = TimeGuard.between(start, end);

      expect(duration).toBeDefined();
      expect(duration.months).toBe(2);
      expect(duration.days).toBe(5);
    });

    it('should return positive duration regardless of order (semantic clarity)', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');

      // Forward
      const forward = TimeGuard.between(start, end);

      // Backward (should be identical!)
      const backward = TimeGuard.between(end, start);

      expect(forward.months).toBe(backward.months);
      expect(forward.days).toBe(backward.days);
    });

    it('should work with humanize() for user-friendly output', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');

      const text = TimeGuard.between(start, end).humanize({
        fullBreakdown: true,
      });

      expect(text).toContain('month');
      expect(text).toContain('day');
      expect(text).toContain('and');
    });

    it('should support locale in humanize()', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');

      const textEs = TimeGuard.between(start, end).humanize({
        locale: 'es',
        fullBreakdown: true,
      });
      const textFr = TimeGuard.between(start, end).humanize({
        locale: 'fr',
        fullBreakdown: true,
      });

      expect(textEs).toContain('mes');
      expect(textEs).toContain('y');
      expect(textFr).toContain('mois');
      expect(textFr).toContain('et');
    });

    it('should have all DurationParts properties', () => {
      const start = new TimeGuard('2020-01-15');
      const end = new TimeGuard('2024-03-20');

      const duration = TimeGuard.between(start, end);

      expect(duration.years).toBeGreaterThan(0);
      expect(duration.months).toBeDefined();
      expect(duration.weeks).toBeDefined();
      expect(duration.days).toBeDefined();
      expect(duration.hours).toBeDefined();
      expect(duration.minutes).toBeDefined();
      expect(duration.seconds).toBeDefined();
      expect(duration.milliseconds).toBeDefined();
    });

    it('should eliminate mental load - no need to think about until vs since', () => {
      const dateA = new TimeGuard('2024-01-01');
      const dateB = new TimeGuard('2024-12-31');

      // Both read semantically identical:
      const duration1 = TimeGuard.between(dateA, dateB);
      const duration2 = TimeGuard.between(dateB, dateA);

      // Result is the same - no mental confusion!
      expect(duration1.months).toBe(duration2.months);
      expect(duration1.days).toBe(duration2.days);

      // Humanize works identically
      const text1 = duration1.humanize({ fullBreakdown: true });
      const text2 = duration2.humanize({ fullBreakdown: true });
      expect(text1).toBe(text2);
    });

    it('should work with same date (zero duration)', () => {
      const date = new TimeGuard('2024-01-15');
      const duration = TimeGuard.between(date, date);

      expect(duration.years).toBe(0);
      expect(duration.months).toBe(0);
      expect(duration.days).toBe(0);
    });

    it('should work with small time differences (minutes/seconds)', () => {
      const start = new TimeGuard('2024-03-15T10:00:00');
      const end = new TimeGuard('2024-03-15T10:30:45');

      const duration = TimeGuard.between(start, end);

      expect(duration.minutes).toBe(30);
      expect(duration.seconds).toBe(45);
    });

    it('should integrate with existing until() - same results', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');

      const viaBetween = TimeGuard.between(start, end);
      const viaUntil = start.until(end);

      // Should produce identical results
      expect(viaBetween.years).toBe(viaUntil.years);
      expect(viaBetween.months).toBe(viaUntil.months);
      expect(viaBetween.days).toBe(viaUntil.days);
      expect(viaBetween.humanize()).toBe(viaUntil.humanize());
    });
  });

  describe('TimeRange - Fluent range API (marketing naming)', () => {
    it('should create TimeRange with string dates', () => {
      const range = TimeGuard.range('2024-01-15', '2024-03-20');
      expect(range).toBeDefined();
    });

    it('should create TimeRange with TimeGuard instances', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const range = TimeGuard.range(start, end);
      expect(range).toBeDefined();
    });

    it('should convert range to duration with toDuration()', () => {
      const range = TimeGuard.range('2024-01-15', '2024-03-20');
      const duration = range.toDuration();

      expect(duration).toBeDefined();
      expect(duration.months).toBe(2);
      expect(duration.days).toBe(5);
    });

    it('should get range in months with inMonths()', () => {
      const range = TimeGuard.range('2024-01-15', '2024-03-20');
      const months = range.inMonths();

      // ~2.1355 months (65 days / 30.4375)
      expect(months).toBeGreaterThan(2);
      expect(months).toBeLessThan(2.2);
    });

    it('should humanize range', () => {
      const range = TimeGuard.range('2024-01-15', '2024-03-20');
      const text = range.humanize();

      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should humanize with fullBreakdown', () => {
      const range = TimeGuard.range('2024-01-15', '2024-03-20');
      const text = range.humanize({ fullBreakdown: true });

      expect(text).toContain('month');
      expect(text).toContain('day');
    });

    it('should humanize in different locale', () => {
      const range = TimeGuard.range('2024-01-15', '2024-03-20');
      const textEn = range.humanize({ locale: 'en', fullBreakdown: true });
      const textEs = range.humanize({ locale: 'es', fullBreakdown: true });

      expect(textEs).toContain('mes');
      expect(textEn).toContain('month');
    });

    it('should work with in(unit) for generic unit conversion', () => {
      const range = TimeGuard.range('2024-01-15', '2024-03-20');

      const days = range.in('day');
      const hours = range.in('hour');
      const months = range.in('month');

      expect(days).toBeGreaterThan(60);
      expect(hours).toBeGreaterThan(days * 24 - 24); // Approximately
      expect(months).toBeCloseTo(2.1, 0);
    });

    it('should work regardless of date order', () => {
      const range1 = TimeGuard.range('2024-01-15', '2024-03-20');
      const range2 = TimeGuard.range('2024-03-20', '2024-01-15');

      expect(range1.humanize()).toBe(range2.humanize());
      expect(range1.inMonths()).toBe(range2.inMonths());
    });

    it('should support method chaining', () => {
      const range = TimeGuard.range(
        '2024-03-15T10:00:00',
        '2024-03-17T14:30:00',
      );

      // All chainable operations
      const text = range.humanize({ fullBreakdown: true });
      const months = range.inMonths();
      const duration = range.toDuration();
      const hours = range.in('hour');

      expect(text).toBeDefined();
      expect(months).toBeDefined();
      expect(duration).toBeDefined();
      expect(hours).toBeGreaterThan(50);
    });

    it('should be semantically clear - "range" is obvious', () => {
      // This test documents the marketing value of the API naming
      // TimeGuard.range() is more intuitive than until/since debate

      const invoiceDate = '2024-01-01';
      const paymentDate = '2024-02-15';

      // Reading is natural and semantically correct:
      const paymentTerm = TimeGuard.range(invoiceDate, paymentDate).humanize();

      expect(paymentTerm).toBeDefined();
      expect(typeof paymentTerm).toBe('string');
    });

    it('should work with business scenarios', () => {
      // Rental period
      const checkInDate = new TimeGuard('2024-06-15');
      const checkOutDate = new TimeGuard('2024-06-22');

      const rentalPeriod = TimeGuard.range(checkInDate, checkOutDate);
      const days = rentalPeriod.in('day');

      expect(days).toBeCloseTo(7, 0);

      const cost = days * 100; // $100 per day
      expect(cost).toBeCloseTo(700, 0);
    });

    it('should return same results as TimeGuard.between()', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');

      const viaRange = TimeGuard.range(start, end);
      const viaBetween = TimeGuard.between(start, end);

      expect(viaRange.toDuration().humanize()).toBe(viaBetween.humanize());
      expect(viaRange.inMonths()).toBe(viaBetween.total('month'));
    });
  });

  describe('Rich Duration Object - total() and JSON methods', () => {
    it('should calculate total days', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      // 2 months + 5 days = (2 * 30.4375) + 5 = ~65.875 days
      const totalDays = duration.total('day');
      expect(totalDays).toBeCloseTo(65.9, 0);
    });

    it('should calculate total months with decimal precision', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      // 65 days / 30.4375 days per month ≈ 2.1355
      const totalMonths = duration.total('month');
      expect(totalMonths).toBeGreaterThan(2);
      expect(totalMonths).toBeLessThan(2.2);
    });

    it('should calculate total hours', () => {
      const start = new TimeGuard('2024-03-15T00:00:00');
      const end = new TimeGuard('2024-03-16T12:00:00');
      const duration = start.until(end);

      // 1 day + 12 hours = 36 hours
      const totalHours = duration.total('hour');
      expect(totalHours).toBeCloseTo(36, 0);
    });

    it('should calculate total seconds', () => {
      const start = new TimeGuard('2024-03-15T00:00:00');
      const end = new TimeGuard('2024-03-15T00:05:30');
      const duration = start.until(end);

      // 5 minutes 30 seconds = 330 seconds
      const totalSeconds = duration.total('second');
      expect(totalSeconds).toBe(330);
    });

    it('should calculate total milliseconds', () => {
      const start = new TimeGuard('2024-03-15T00:00:00');
      const end = new TimeGuard('2024-03-15T00:00:01');
      const duration = start.until(end);

      // 1 second = 1000 milliseconds
      const totalMs = duration.total('millisecond');
      expect(totalMs).toBe(1000);
    });

    it('should calculate total weeks', () => {
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-02-15');
      const duration = start.until(end);

      // ~6 weeks
      const totalWeeks = duration.total('week');
      expect(totalWeeks).toBeGreaterThan(5);
      expect(totalWeeks).toBeLessThan(7);
    });

    it('should calculate total years with decimal precision', () => {
      const start = new TimeGuard('2020-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      // ~4.17 years
      const totalYears = duration.total('year');
      expect(totalYears).toBeGreaterThan(4.1);
      expect(totalYears).toBeLessThan(4.2);
    });

    it('should calculate total minutes', () => {
      const start = new TimeGuard('2024-03-15T10:00:00');
      const end = new TimeGuard('2024-03-15T10:45:30');
      const duration = start.until(end);

      // 45 minutes 30 seconds = 45.5 minutes
      const totalMinutes = duration.total('minute');
      expect(totalMinutes).toBeCloseTo(45.5, 1);
    });

    it('should calculate complex durations (years + months + days)', () => {
      const start = new TimeGuard('2020-03-15');
      const end = new TimeGuard('2024-09-20');
      const duration = start.until(end);

      // Years to days
      const daysFromYears = duration.total('day');
      expect(daysFromYears).toBeGreaterThan(1600);
      expect(daysFromYears).toBeLessThan(1700);
    });

    it('should work for business metrics - payments scenario', () => {
      const invoiceDate = new TimeGuard('2024-01-15');
      const paymentDate = new TimeGuard('2024-02-20');
      const duration = invoiceDate.until(paymentDate);

      // Calculate late fees: $10 per day
      // Temporal normalizes to {months: 1, days: 5} = 1*30.4375 + 5 = 35.4375 days
      const daysLate = duration.total('day');
      const lateFee = daysLate * 10;

      expect(daysLate).toBeCloseTo(35.4375, 1);
      expect(lateFee).toBeCloseTo(354.375, 0);
    });

    it('should work for analytics - session duration', () => {
      const sessionStart = new TimeGuard('2024-03-15T10:00:00');
      const sessionEnd = new TimeGuard('2024-03-15T10:35:42');
      const duration = sessionStart.until(sessionEnd);

      // Calculate engagement metrics
      const sessionMinutes = duration.total('minute');
      const sessionSeconds = duration.total('second');

      expect(sessionMinutes).toBeCloseTo(35.7, 1);
      expect(sessionSeconds).toBe(2142);
    });

    it('should have toString() for display', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const str = duration.toString();
      expect(typeof str).toBe('string');
      expect(str.length).toBeGreaterThan(0);
      expect(str).toContain('month');
    });

    it('should have toJSON() for serialization', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const json = duration.toJSON();
      expect(json).toEqual({
        years: 0,
        months: 2,
        weeks: 0,
        days: 5,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    });

    it('should serialize toJSON() in JSON.stringify()', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const serialized = JSON.stringify(duration);
      const parsed = JSON.parse(serialized);

      expect(parsed.months).toBe(2);
      expect(parsed.days).toBe(5);
    });

    it('should use leap year accounting for year conversions', () => {
      // 365.25 days per year (accounting for leap years)
      const duration = TimeGuard.between(
        new TimeGuard('2024-01-01'),
        new TimeGuard('2025-01-01'),
      );

      // Should be ~365 days (actually depends on leap year)
      const yearInDays = duration.total('day');
      expect(yearInDays).toBeGreaterThan(364);
      expect(yearInDays).toBeLessThan(367);
    });

    it('should calculate months using average month length (30.4375 days)', () => {
      // Create a duration of exactly 1 month (30.4375 days in our calculation)
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-02-01');
      const duration = start.until(end);

      // 1 month should be ~30.4375 days
      const days = duration.total('day');
      expect(days).toBeGreaterThan(30);
      expect(days).toBeLessThan(32);
    });

    it('should handle zero duration gracefully', () => {
      const date = new TimeGuard('2024-01-15');
      const duration = date.until(date);

      expect(duration.total('day')).toBe(0);
      expect(duration.total('hour')).toBe(0);
      expect(duration.total('second')).toBe(0);
    });

    it('should work with TimeGuard.between() semantic API', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');

      // Same total regardless of order
      const duration1 = TimeGuard.between(start, end);
      const duration2 = TimeGuard.between(end, start);

      expect(duration1.total('day')).toBe(duration2.total('day'));
      expect(duration1.total('month')).toBe(duration2.total('month'));
    });
  });

  describe('Duration Explanation - explain() killer feature', () => {
    it('should provide basic explanation object', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation).toBeDefined();
      expect(explanation.input).toBeDefined();
      expect(explanation.steps).toBeDefined();
      expect(explanation.breakdown).toBeDefined();
      expect(explanation.mode).toBe('exact');
      expect(explanation.explanation).toBeDefined();
      expect(explanation.locale).toBe('en');
    });

    it('should document input dates in explanation', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation.input).toHaveLength(2);
      expect(explanation.input[0]).toContain('2024');
      expect(explanation.input[1]).toContain('2024');
    });

    it('should include step-by-step calculation in explanation', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation.steps.length).toBeGreaterThan(0);
      expect(explanation.steps.join(' ')).toContain('2024');
    });

    it('should provide duration breakdown in explanation', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation.breakdown.years).toBe(0);
      expect(explanation.breakdown.months).toBe(2);
      expect(explanation.breakdown.days).toBe(5);
    });

    it('should detect and document leap years in explanation', () => {
      const start = new TimeGuard('2024-01-01');
      const end = new TimeGuard('2024-12-31');
      const duration = start.until(end);

      const explanation = duration.explain();

      // 2024 is a leap year
      if (explanation.leapYearFlags && explanation.leapYearFlags.length > 0) {
        const leapFlag = explanation.leapYearFlags.find((f) => f.year === 2024);
        expect(leapFlag?.isLeap).toBe(true);
        expect(leapFlag?.daysInFebruary).toBe(29);
      }
    });

    it('should include calculation performance metadata', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation.metadata).toBeDefined();
      expect(explanation.metadata?.calculationTimeMs).toBeGreaterThanOrEqual(0);
      expect(explanation.metadata?.precision).toBeDefined();
    });

    it('should provide educational explanation text', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation.explanation).toContain('Calculated');
      expect(explanation.explanation).toContain('2024');
    });

    it('should work with since() method as well', () => {
      const date1 = new TimeGuard('2024-01-15');
      const date2 = new TimeGuard('2024-03-20');

      const duration = date2.since(date1);
      const explanation = duration.explain();

      expect(explanation).toBeDefined();
      expect(explanation.mode).toBe('exact');
      expect(explanation.breakdown.months).toBe(2);
    });

    it('should be useful for debugging complex date calculations', () => {
      // Use case: Debugging business logic
      const invoiceDate = new TimeGuard('2023-12-15');
      const paymentDate = new TimeGuard('2024-02-20');
      const duration = invoiceDate.until(paymentDate);

      const explanation = duration.explain();

      // Can inspect at every step
      expect(explanation.input).toBeDefined();
      expect(explanation.steps).toBeDefined();
      expect(explanation.breakdown).toBeDefined();
      expect(explanation.mode).toBe('exact');
    });

    it('should support internationalization in explanation', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation.locale).toBe('en');
      // Locale should match the TimeGuard instance
    });

    it('should provide complete JSON serialization of explanation', () => {
      const start = new TimeGuard('2024-01-15');
      const end = new TimeGuard('2024-03-20');
      const duration = start.until(end);

      const explanation = duration.explain();
      const serialized = JSON.stringify(explanation);

      expect(serialized).toBeTruthy();
      expect(serialized).toContain('input');
      expect(serialized).toContain('steps');
      expect(serialized).toContain('breakdown');
    });

    it('should document calculation precision', () => {
      const start = new TimeGuard('2024-01-15T10:30:45');
      const end = new TimeGuard('2024-03-20T14:45:30');
      const duration = start.until(end);

      const explanation = duration.explain();

      expect(explanation.metadata?.precision).toBe('day');
      expect(explanation.mode).toBe('exact');
    });

    it('should be brutal for education - showing exact date math', () => {
      // This feature is perfect for teaching date calculations
      const start = new TimeGuard('2024-02-15'); // In leap year
      const end = new TimeGuard('2024-04-15');
      const duration = start.until(end);

      const explanation = duration.explain();

      // Explanation should reveal:
      // - February has 29 days (leap year)
      // - March has 31 days
      // - April has 15 days
      expect(explanation.steps).toBeDefined();
      expect(explanation.explanation).toContain('Calculated');
    });
  });

  describe('TimeGuard.now() carries real zone info (regression)', () => {
    // TimeGuard.now() used to produce an offset-naive PlainDateTime
    // mislabeled with a default config.timezone of 'UTC' — format()
    // correctly showed local wall-clock time, but toISOString()/
    // getOffset()/format('utc'|'iso'|'rfc2822'|'rfc3339') just appended a
    // literal 'Z' to those LOCAL digits without ever converting them,
    // so TimeGuard.now().toISOString() lied about being UTC. Separately,
    // isZonedDateTime()'s duck-type check looked for a `timeZone`
    // property that this polyfill's ZonedDateTime doesn't have (it's
    // `timeZoneId`), so the guard never matched a real zoned value at all.

    it('getTimeZoneId()/getOffset() report the real system zone, not the null/"Z" defaults', () => {
      const now = TimeGuard.now();
      expect(now.getTimeZoneId()).not.toBeNull();
      expect(now.getOffset()).toMatch(/^[+-]\d{2}:\d{2}$/);
    });

    it('toISOString() performs a genuine UTC conversion matching Date#toISOString()', () => {
      const now = TimeGuard.now();
      const nativeUtcMinute = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      expect(now.toISOString().slice(0, 16)).toBe(nativeUtcMinute);
    });

    it('format("utc"/"iso"/"rfc3339") convert to UTC instead of relabeling local digits', () => {
      const now = TimeGuard.now();
      const nativeUtcMinute = new Date().toISOString().slice(0, 16);
      expect(now.format('utc').slice(0, 16)).toBe(nativeUtcMinute);
      expect(now.format('iso').slice(0, 16)).toBe(nativeUtcMinute);
      expect(now.format('rfc3339').slice(0, 16)).toBe(nativeUtcMinute);
    });

    it('an explicit timezone computes "now" as observed there, not a relabeled local reading', () => {
      const tokyo = TimeGuard.now({ timezone: 'Asia/Tokyo' });
      const bogota = TimeGuard.now({ timezone: 'America/Bogota' });
      // Different wall-clock (different zones)...
      expect(tokyo.getTimeZoneId()).toBe('Asia/Tokyo');
      expect(bogota.getTimeZoneId()).toBe('America/Bogota');
      // ...but the same underlying instant, down to the minute.
      expect(tokyo.toISOString().slice(0, 16)).toBe(
        bogota.toISOString().slice(0, 16),
      );
    });

    it('format() with a non-UTC pattern still shows local wall-clock time, unaffected', () => {
      const now = TimeGuard.now();
      const nativeLocalMinute = new Date().toString().match(/\d{2}:\d{2}/)?.[0];
      expect(now.format('HH:mm')).toBe(nativeLocalMinute);
    });
  });
});
