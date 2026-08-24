/**
 * Plugin System Tests
 * Tests for all TimeGuard plugins
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TimeGuard, PluginManager } from '../src/index';
import relativeTimePlugin from '../src/plugins/relative-time';
import { Duration, durationPlugin } from '../src/plugins/duration';
import advancedFormatPlugin from '../src/plugins/advanced-format';

describe('Plugin System', () => {
  describe('PluginManager', () => {
    beforeEach(() => {
      PluginManager.clear();
    });

    it('should register a plugin', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      expect(PluginManager.hasPlugin('relative-time')).toBe(true);
    });

    it('should list registered plugins', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      PluginManager.use(durationPlugin, TimeGuard);

      const plugins = PluginManager.listPlugins();
      expect(plugins).toContain('relative-time');
      expect(plugins).toContain('duration');
    });

    it('should get plugin by name', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      const plugin = PluginManager.getPlugin('relative-time');
      expect(plugin).toBeDefined();
      expect(plugin?.name).toBe('relative-time');
    });

    it('should unregister a plugin', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      expect(PluginManager.hasPlugin('relative-time')).toBe(true);

      PluginManager.unuse('relative-time');
      expect(PluginManager.hasPlugin('relative-time')).toBe(false);
    });

    it('should clear all plugins', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      PluginManager.use(durationPlugin, TimeGuard);

      PluginManager.clear();
      expect(PluginManager.listPlugins()).toHaveLength(0);
    });

    it('should remove prototype members added by a plugin on unuse()', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      expect(typeof (TimeGuard.prototype as any).fromNow).toBe('function');

      PluginManager.unuse('relative-time');
      expect((TimeGuard.prototype as any).fromNow).toBeUndefined();
    });

    it('should restore the original format() on clear(), not stack a wrapper', () => {
      // Regression: clear()/unuse() used to only forget the plugin in the
      // manager's bookkeeping Map, never actually undoing install()'s
      // prototype patch — re-registering the same plugin after a clear()
      // wrapped format() a second time on top of the first, and once 2+
      // layers were stacked, escaped `[...]` literal text containing a
      // token-trigger letter (e.g. the "k" in a timezone id) got corrupted
      // by the inner layer's own token regex.
      PluginManager.use(advancedFormatPlugin, TimeGuard);
      PluginManager.clear();
      PluginManager.use(advancedFormatPlugin, TimeGuard);
      PluginManager.clear();
      PluginManager.use(advancedFormatPlugin, TimeGuard);

      const date = TimeGuard.from('2024-03-13').timezone('Europe/Paris');
      expect(date.format('zzz')).toBe('Europe/Paris');
    });
  });

  describe('RelativeTimePlugin', () => {
    beforeEach(() => {
      PluginManager.clear();
      PluginManager.use(relativeTimePlugin, TimeGuard);
    });

    it('should add fromNow method', () => {
      const date = TimeGuard.now();
      expect(typeof (date as any).fromNow).toBe('function');
    });

    it('should add toNow method', () => {
      const date = TimeGuard.now();
      expect(typeof (date as any).toNow).toBe('function');
    });

    it('should add humanize method', () => {
      const date = TimeGuard.now();
      expect(typeof (date as any).humanize).toBe('function');
    });

    it('should format past dates relative to now', () => {
      const pastDate = TimeGuard.from('2024-01-01');
      const result = (pastDate as any).fromNow();
      expect(result).toContain('ago');
    });

    it('should format future dates relative to now', () => {
      const futureDate = TimeGuard.from('2099-12-31');
      const result = (futureDate as any).toNow();
      expect(result).toContain('in');
    });

    it('should support withoutSuffix option', () => {
      const pastDate = TimeGuard.from('2024-01-01');
      const result = (pastDate as any).fromNow(true);
      expect(result).not.toContain('ago');
    });

    it('should pick the "hh" (hours) threshold, not fall back to seconds, for a multi-hour gap', () => {
      // Regression test: getRelativeTimeString() used to compare `r`
      // (interpreted in the wrong unit) with an inverted condition, so any
      // gap bigger than 44s matched the smallest ('a few seconds') bucket
      // instead of the correct one.
      const pastDate = TimeGuard.now().subtract({ hour: 5 }) as any;
      expect(pastDate.fromNow()).toBe('5 hours ago');
    });

    it('should pick the "dd" (days) threshold for a multi-day gap', () => {
      const pastDate = TimeGuard.now().subtract({ day: 2 }) as any;
      expect(pastDate.fromNow()).toBe('2 days ago');
    });

    it('should pick the "hh" threshold for a future multi-hour gap via toNow()', () => {
      const futureDate = TimeGuard.now().add({ hour: 5 }) as any;
      expect(futureDate.toNow()).toBe('in 5 hours');
    });
  });

  describe('DurationPlugin', () => {
    beforeEach(() => {
      PluginManager.clear();
      PluginManager.use(durationPlugin, TimeGuard);
    });

    it('should add duration method to TimeGuard', () => {
      const date = TimeGuard.now();
      expect(typeof (date as any).duration).toBe('function');
    });

    it('should add Duration class to TimeGuard', () => {
      expect((TimeGuard as any).Duration).toBeDefined();
      expect((TimeGuard as any).Duration).toBe(Duration);
    });

    it('should create duration between two dates', () => {
      const start = TimeGuard.from('2024-03-13');
      const end = TimeGuard.from('2024-03-20');
      const duration = (start as any).duration(end);

      expect(duration).toBeDefined();
      expect(duration.asDays()).toBe(7);
    });

    it('should parse ISO 8601 duration', () => {
      const duration = Duration.fromISO('P2Y3M4DT5H6M7S');
      expect(duration.toObject()).toEqual({
        years: 2,
        months: 3,
        weeks: 0,
        days: 4,
        hours: 5,
        minutes: 6,
        seconds: 7,
        milliseconds: 0,
      });
    });

    it('should convert duration to ISO 8601', () => {
      const duration = new Duration({
        years: 2,
        months: 3,
        days: 4,
        hours: 5,
        minutes: 6,
        seconds: 7,
      });

      const iso = duration.toISO();
      expect(iso).toContain('P');
      expect(iso).toContain('2Y');
      expect(iso).toContain('3M');
      expect(iso).toContain('4D');
    });

    it('should calculate duration in different units', () => {
      const duration = Duration.fromMilliseconds(1000 * 60 * 60 * 24 * 7); // 7 days

      expect(duration.asDays()).toBe(7);
      expect(duration.asWeeks()).toBe(1);
      expect(duration.asHours()).toBe(168);
    });

    it('should humanize duration', () => {
      const duration = new Duration({ days: 7 });
      const humanized = duration.humanize();
      expect(humanized).toContain('7 day');
    });

    it('should detect negative durations', () => {
      const positive = new Duration({ days: 5 });
      const negative = new Duration({ days: -5 });

      expect(positive.isNegative()).toBe(false);
      expect(negative.isNegative()).toBe(true);
    });

    it('should get absolute duration', () => {
      const negative = new Duration({ days: -5, hours: -3 });
      const absolute = negative.abs();
      expect(absolute.isNegative()).toBe(false);
    });
  });

  describe('AdvancedFormatPlugin', () => {
    beforeEach(() => {
      PluginManager.clear();
      PluginManager.use(advancedFormatPlugin, TimeGuard);
    });

    it('should support Q token for quarter', () => {
      const date = TimeGuard.from('2024-03-13');
      const result = date.format('Q');
      expect(result).toBe('1');

      const dateQ3 = TimeGuard.from('2024-09-13');
      const resultQ3 = dateQ3.format('Q');
      expect(resultQ3).toBe('3');
    });

    it('should support Do token for ordinal day', () => {
      const date = TimeGuard.from('2024-03-13');
      const result = date.format('Do');
      expect(result).toBe('13th');

      const date1st = TimeGuard.from('2024-03-01');
      const result1st = date1st.format('Do');
      expect(result1st).toBe('1st');

      const date21st = TimeGuard.from('2024-03-21');
      const result21st = date21st.format('Do');
      expect(result21st).toBe('21st');

      const date2nd = TimeGuard.from('2024-03-02');
      const result2nd = date2nd.format('Do');
      expect(result2nd).toBe('2nd');
    });

    it('should support k token for 24-hour format', () => {
      const date = TimeGuard.from('2024-03-13 14:30:45');
      const result = date.format('k:mm:ss');
      expect(result).toContain('14');
    });

    it('should support X token for Unix seconds', () => {
      const date = TimeGuard.from('2024-03-13 00:00:00');
      const result = date.format('X');
      expect(parseInt(result, 10)).toBeGreaterThan(0);
    });

    it('should support x token for Unix milliseconds', () => {
      const date = TimeGuard.from('2024-03-13 00:00:00');
      const result = date.format('x');
      expect(parseInt(result, 10)).toBeGreaterThan(0);
    });

    it('should support z token for the UTC-style offset', () => {
      // Regression: 'z' used to call a nonexistent getTimezoneOffset()
      // method and throw; the regex (`zzz?`) also never matched a lone
      // 'z' in the first place (required 2+ z's).
      const date = TimeGuard.from('2024-03-13').timezone('Europe/Paris');
      expect(date.format('z')).toBe('+01:00');
    });

    it('should support zzz token for the IANA zone id', () => {
      // Regression: 'zzz' used to call a nonexistent
      // getTimezoneOffsetLong() method and throw.
      const date = TimeGuard.from('2024-03-13').timezone('Europe/Paris');
      expect(date.format('zzz')).toBe('Europe/Paris');
    });

    it('should combine advanced tokens with standard format', () => {
      const date = TimeGuard.from('2024-03-13');
      const result = date.format('Do MMMM YYYY');
      expect(result).toContain('13th');
      expect(result).toContain('March');
      expect(result).toContain('2024');
    });

    it('should not corrupt literal [...] text that happens to contain a token letter', () => {
      // Regression: the token regex used to scan the raw pattern before
      // the base formatter got a chance to protect [...]/"..." literals,
      // so a token letter inside an escaped literal (the 'k' in "Tokyo")
      // was replaced too — date.format('[Asia/Tokyo]') produced garbage
      // like "Asia/To[24yo]" instead of the literal text.
      const date = TimeGuard.from('2024-03-13').timezone('Asia/Tokyo');
      expect(date.format('[Asia/Tokyo]')).toBe('Asia/Tokyo');
      expect(date.format('"week" w')).toBe('week 3');
    });

    it('should still resolve real tokens next to a protected literal', () => {
      const date = TimeGuard.from('2024-03-13').timezone('Asia/Tokyo');
      expect(date.format('Q[quarter]')).toBe('1quarter');
    });
  });

  describe('Plugin Integration', () => {
    beforeEach(() => {
      PluginManager.clear();
    });

    it('should use multiple plugins together', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      PluginManager.use(durationPlugin, TimeGuard);
      PluginManager.use(advancedFormatPlugin, TimeGuard);

      const date = TimeGuard.from('2024-03-13 14:30:45');

      // Test relative time
      expect(typeof (date as any).fromNow).toBe('function');

      // Test duration
      expect(typeof (date as any).duration).toBe('function');

      // Test advanced format - quotes should be protected and not processed as tokens
      const formatted = date.format('Q ["Q"] YYYY - Do MMMM');
      expect(formatted).toContain('13th');
      expect(formatted).toContain('2024');
      expect(formatted).toMatch(/\d+/); // Should have at least one digit
    });

    it('should not interfere with core functionality', () => {
      PluginManager.use(relativeTimePlugin, TimeGuard);
      PluginManager.use(durationPlugin, TimeGuard);
      PluginManager.use(advancedFormatPlugin, TimeGuard);

      const date = TimeGuard.from('2024-03-13');

      // Core methods should still work
      expect(date.get('year')).toBe(2024);
      expect(date.get('month')).toBe(3);
      expect(date.get('day')).toBe(13);
      expect(date.format('YYYY-MM-DD')).toBe('2024-03-13');
    });
  });
});
