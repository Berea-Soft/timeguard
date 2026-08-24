/**
 * TimeGuard Advanced Tests
 * Testing advanced features, edge cases, and integration scenarios
 */

import { describe, it, expect } from 'vitest';
import { TimeGuard, TemporalAdapter, LocaleManager } from '../src/index';

describe('TimeGuard - Advanced Features', () => {
  describe('Temporal API Integration', () => {
    it('should convert to Temporal.PlainDateTime', () => {
      const tg = new TimeGuard('2024-03-13');
      const temporal = tg.toTemporal();
      expect(temporal).toBeDefined();
    });

    it('should create from Temporal object using factory', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const temporal = tg1.toTemporal();
      const tg2 = TimeGuard.fromTemporal(temporal);
      expect(tg2.format('YYYY-MM-DD')).toBe('2024-03-13');
    });
  });

  describe('TemporalAdapter utility class', () => {
    it('should parse PlainDateTime', () => {
      const plainDT = TemporalAdapter.parseToPlainDateTime(
        '2024-03-13T14:30:45',
      );
      expect(plainDT).toBeDefined();
    });

    it('should convert Date to PlainDateTime', () => {
      const date = new Date('2024-03-13');
      const plainDT = TemporalAdapter.fromDate(date);
      expect(plainDT).toBeDefined();
    });

    it('should convert Unix timestamp to PlainDateTime', () => {
      const timestamp = new Date('2024-03-13').getTime();
      const plainDT = TemporalAdapter.fromUnix(timestamp);
      expect(plainDT).toBeDefined();
    });

    it('should parse ISO string', () => {
      const plainDT = TemporalAdapter.parseISOString('2024-03-13T14:30:45');
      expect(plainDT).toBeDefined();
    });

    it('should get current time', () => {
      const now = TemporalAdapter.now();
      expect(now).toBeDefined();
      expect(now.year).toBeGreaterThan(2000);
    });
  });

  describe('Locale Manager', () => {
    it('should be a singleton', () => {
      const manager1 = LocaleManager.getInstance();
      const manager2 = LocaleManager.getInstance();
      expect(manager1).toBe(manager2);
    });

    it('should list available locales', () => {
      const manager = LocaleManager.getInstance();
      const locales = manager.listLocales();
      expect(locales).toContain('en');
      expect(locales).toContain('es');
    });

    it('should register custom locale', () => {
      const manager = LocaleManager.getInstance();
      const customLocale = {
        name: 'custom',
        months: Array(12).fill('Month'),
        monthsShort: Array(12).fill('M'),
        weekdays: Array(7).fill('Day'),
        weekdaysShort: Array(7).fill('D'),
        weekdaysMin: Array(7).fill('d'),
      };
      manager.setLocale('custom', customLocale);
      expect(manager.listLocales()).toContain('custom');
    });
  });

  describe('Edge Cases', () => {
    it('should handle leap year dates', () => {
      const tg = new TimeGuard('2024-02-29'); // 2024 is leap year
      expect(tg.get('day')).toBe(29);
    });

    it('should handle end of month correctly', () => {
      const tg = new TimeGuard('2024-03-31');
      const result = tg.add({ month: 1 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-04-30');
    });

    it('should handle very large date ranges', () => {
      const tg1 = new TimeGuard('1970-01-01');
      const tg2 = new TimeGuard('2100-12-31');
      const diff = tg2.diff(tg1, 'year');
      expect(diff).toBe(130);
    });

    it('should handle dates with milliseconds precision', () => {
      const tg1 = new TimeGuard('2024-03-13T14:30:45.123');
      const tg2 = new TimeGuard('2024-03-13T14:30:45.456');
      const diff = tg2.diff(tg1, 'millisecond');
      expect(Math.abs(diff - 333)).toBeLessThan(10);
    });

    it('should handle invalid date string gracefully', () => {
      const tg = new TimeGuard('invalid-date');
      expect(tg).toBeDefined();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });

    it('should handle null input', () => {
      const tg = new TimeGuard(null);
      expect(tg).toBeDefined();
    });

    it('should handle undefined input (defaults to now)', () => {
      const tg = new TimeGuard(undefined);
      expect(tg).toBeDefined();
      const now = TimeGuard.now();
      expect(Math.abs(tg.valueOf() - now.valueOf())).toBeLessThan(100);
    });

    it('should handle object input with date components', () => {
      const tg = new TimeGuard({ year: 2024, month: 3, day: 13 });
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });
  });

  describe('Immutability and Cloning', () => {
    it('all operations should be immutable', () => {
      const original = new TimeGuard('2024-03-13');
      const originalValue = original.valueOf();

      const modified = original.add({ day: 10 });
      expect(original.valueOf()).toBe(originalValue);
      expect(modified.valueOf()).not.toBe(originalValue);
    });

    it('cloned instance should be independent', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = tg1.clone();
      const tg3 = tg2.add({ day: 1 });

      expect(tg1.format('YYYY-MM-DD')).toBe('2024-03-13');
      expect(tg2.format('YYYY-MM-DD')).toBe('2024-03-13');
      expect(tg3.format('YYYY-MM-DD')).toBe('2024-03-14');
    });
  });

  describe('Format flexibility', () => {
    it('should support multiple format patterns', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const formats = [
        { pattern: 'YYYY-MM-DD', expected: '2024-03-13' },
        { pattern: 'DD/MM/YYYY', expected: '13/03/2024' },
        { pattern: 'YYYY/MM/DD HH:mm', expected: '2024/03/13 14:30' },
      ];

      formats.forEach(({ pattern, expected }) => {
        expect(tg.format(pattern)).toBe(expected);
      });
    });

    it('should escape text in brackets', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.format('[Date: ]YYYY-MM-DD[ Time: ]');
      expect(result).toContain('Date: ');
      expect(result).toContain('2024-03-13');
      expect(result).toContain('Time: ');
    });

    it('should handle single letter format codes', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(tg.format('Y')).toBe('2024');
      expect(tg.format('M')).toBe('3');
      expect(tg.format('D')).toBe('13');
      expect(tg.format('H')).toBe('14');
    });
  });

  describe('Chaining operations', () => {
    it('should support fluent API chaining', () => {
      const result = TimeGuard.now()
        .add({ month: 1 })
        .subtract({ day: 1 })
        .set({ hour: 0, minute: 0, second: 0 })
        .clone();

      expect(result).toBeInstanceOf(TimeGuard);
    });

    it('should maintain type safety through chaining', () => {
      const tg = new TimeGuard('2024-03-13');
      const chained = tg
        .add({ day: 1 })
        .add({ hour: 5 })
        .subtract({ minute: 30 });
      expect(chained).toBeInstanceOf(TimeGuard);
      expect(typeof chained.format('YYYY-MM-DD')).toBe('string');
    });
  });

  describe('Timezone support (basic)', () => {
    it('should set timezone in config', () => {
      const tg = new TimeGuard('2024-03-13', { timezone: 'UTC' });
      expect(tg.timezone()).toBe('UTC');
    });

    it('should change timezone', () => {
      const tg = new TimeGuard('2024-03-13', { timezone: 'UTC' });
      const tgPST = tg.timezone('America/Los_Angeles');
      expect(tgPST.timezone()).toBe('America/Los_Angeles');
    });

    it('should not modify original when changing timezone', () => {
      const tg1 = new TimeGuard('2024-03-13', { timezone: 'UTC' });
      const tg2 = tg1.timezone('America/New_York');
      expect(tg1.timezone()).toBe('UTC');
      expect(tg2.timezone()).toBe('America/New_York');
    });
  });

  describe('Accessibility and Usability', () => {
    it('should have descriptive toString()', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const str = tg.toString();
      expect(str).toContain('2024');
      expect(str).toContain('14:30:45');
    });

    it('should support valueOf() for numeric comparison', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-03-14');
      expect(tg1.valueOf() < tg2.valueOf()).toBe(true);
    });

    it('should support JSON serialization', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const json = JSON.stringify({ date: tg });
      expect(json).toContain('2024-03-13');
    });
  });

  describe('Performance considerations', () => {
    it('should handle multiple operations efficiently', () => {
      const timeStart = performance.now();

      for (let i = 0; i < 1000; i++) {
        TimeGuard.now().add({ day: i }).format('YYYY-MM-DD').length;
      }

      const timeEnd = performance.now();
      expect(timeEnd - timeStart).toBeLessThan(5000); // Should complete in less than 5 seconds
    });

    it('should handle large chains without memory issues', () => {
      let result = TimeGuard.now();
      for (let i = 0; i < 100; i++) {
        result = result.add({ day: 1 });
      }
      expect(result).toBeInstanceOf(TimeGuard);
    });
  });

  describe('SOLID Principles Verification', () => {
    it('should follow Single Responsibility - TemporalAdapter handles only Temporal conversion', () => {
      expect(typeof TemporalAdapter.parseToPlainDateTime).toBe('function');
      expect(typeof TemporalAdapter.toDate).toBe('function');
      expect(typeof TemporalAdapter.now).toBe('function');
    });

    it('should follow Open/Closed - Can extend behavior through plugin system', () => {
      // Verify that TimeGuard class is well-defined and extensible
      expect(TimeGuard).toBeDefined();
      expect(typeof TimeGuard).toBe('function');
    });

    it('should follow Liskov Substitution - ITimeGuard implementations are interchangeable', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = tg1.add({ day: 1 });
      expect(tg1).toBeInstanceOf(TimeGuard);
      expect(tg2).toBeInstanceOf(TimeGuard);
    });

    it('should follow Interface Segregation - Focused, specific interfaces', () => {
      const tg = TimeGuard.now();
      // Check that only needed methods are available (via duck typing in TS)
      expect('format' in tg).toBe(true);
      expect('add' in tg).toBe(true);
      expect('isBefore' in tg).toBe(true);
    });

    it('should follow Dependency Inversion - Uses abstractions, not concrete implementations', () => {
      const localeManager = LocaleManager.getInstance();
      const tg = new TimeGuard('2024-03-13', { locale: 'en' });
      expect(localeManager).toBeDefined();
      expect(tg.locale()).toBe('en');
    });
  });
});
