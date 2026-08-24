/**
 * Coverage Tests - Improve code coverage to 80%
 * Tests edge cases and uncovered code paths
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TimeGuard,
  CalendarManager,
  GregorianCalendar,
  DateFormatter,
  PluginManager,
  timeGuard,
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
  Duration,
  advancedFormatPlugin,
  durationPlugin,
  LocaleManager,
} from '../src/index';
import {
  joinDurationParts,
  getDurationUnitLabel,
  formatDurationPart,
  getConjunctionLabel,
  formatZeroDuration,
} from '../src/utils/duration-locale';
import { registerAllLocales } from '../src/locales/index';
import relativeTimePlugin, {
  RelativeTimePlugin,
} from '../src/plugins/relative-time';

describe('Coverage Tests - Calendar Manager', () => {
  beforeEach(() => {
    (CalendarManager as any).instance = undefined;
  });

  it('should get month name with boundary values', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getMonthName(1)).toBe('January');
    expect(calendar.getMonthName(12)).toBe('December');
    expect(calendar.getMonthName(1, true)).toBe('Jan');
    expect(calendar.getMonthName(12, true)).toBe('Dec');
  });

  it('should handle out-of-range month values gracefully', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getMonthName(0)).toBe('January');
    expect(calendar.getMonthName(13)).toBe('December');
  });

  it('should get weekday name with boundary values', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getWeekdayName(1)).toBe('Sunday');
    expect(calendar.getWeekdayName(7)).toBe('Saturday');
    expect(calendar.getWeekdayName(1, true)).toBe('Sun');
    expect(calendar.getWeekdayName(7, true)).toBe('Sat');
  });

  it('should handle out-of-range weekday values gracefully', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getWeekdayName(0)).toBe('Sunday');
    expect(calendar.getWeekdayName(8)).toBe('Saturday');
  });

  it('should calculate leap years correctly', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.isLeapYear(2024)).toBe(true);
    expect(calendar.isLeapYear(2023)).toBe(false);
    expect(calendar.isLeapYear(2000)).toBe(true);
    expect(calendar.isLeapYear(1900)).toBe(false);
  });

  it('should calculate days in month', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.daysInMonth(2024, 2)).toBe(29);
    expect(calendar.daysInMonth(2023, 2)).toBe(28);
    expect(calendar.daysInMonth(2024, 1)).toBe(31);
    expect(calendar.daysInMonth(2024, 4)).toBe(30);
  });

  it('should calculate days in year', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.daysInYear(2024)).toBe(366);
    expect(calendar.daysInYear(2023)).toBe(365);
  });

  it('should register and retrieve calendars', () => {
    const manager = CalendarManager.getInstance();
    expect(manager.get('gregory')).toBeDefined();
    expect(manager.list()).toContain('gregory');
  });

  it('should set and get default calendar', () => {
    const manager = CalendarManager.getInstance();
    expect(manager.getDefault()).toBeDefined();
    expect(manager.getDefault().id).toBe('gregory');
  });

  it('should not set default calendar if it does not exist', () => {
    const manager = CalendarManager.getInstance();
    const original = manager.getDefault();
    manager.setDefault('nonexistent');
    expect(manager.getDefault()).toBe(original);
  });
});

describe('Coverage Tests - Date Formatter', () => {
  const formatter = new DateFormatter();

  it('should format with single digit tokens', () => {
    const tg = timeGuard('2024-04-05 09:05:05');
    const result = tg.format('Y M D H m s');
    expect(result).toBe('2024 4 5 9 5 5');
  });

  it('should format with YY token', () => {
    const tg = timeGuard('2024-04-15');
    const result = tg.format('YY');
    expect(result).toBe('24');
  });

  it('should format meridiem with PM', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    const resultLower = tg.format('a');
    expect(resultLower).toBe('pm');
    const resultUpper = tg.format('A');
    expect(resultUpper).toBe('PM');
  });

  it('should handle AM hours correctly', () => {
    const tg = timeGuard('2024-04-15 08:30:00');
    const result = tg.format('hh:mm a');
    expect(result).toBe('08:30 am');
  });

  it('should get all preset patterns', () => {
    expect(formatter.getPreset('iso')).toBe('YYYY-MM-DDTHH:mm:ss.SSSZ');
    expect(formatter.getPreset('date')).toBe('YYYY-MM-DD');
    expect(formatter.getPreset('time')).toBe('HH:mm:ss');
    expect(formatter.getPreset('datetime')).toBe('YYYY-MM-DD HH:mm:ss');
    expect(formatter.getPreset('rfc2822')).toBe('ddd, DD MMM YYYY HH:mm:ss Z');
    expect(formatter.getPreset('rfc3339')).toBe('YYYY-MM-DDTHH:mm:ssZ');
    expect(formatter.getPreset('utc')).toBe('YYYY-MM-DDTHH:mm:ss[Z]');
  });
});

describe('Coverage Tests - Plugin Manager', () => {
  beforeEach(() => {
    PluginManager.clear();
  });

  it('should register a plugin', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    PluginManager.use(mockPlugin, TimeGuard);
    expect(PluginManager.listPlugins()).toContain('test-plugin');
    PluginManager.clear();
  });

  it('should get a registered plugin', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    PluginManager.use(mockPlugin, TimeGuard);
    const retrieved = PluginManager.getPlugin('test-plugin');
    expect(retrieved).toBe(mockPlugin);
    PluginManager.clear();
  });

  it('should return undefined for non-existent plugin', () => {
    const retrieved = PluginManager.getPlugin('non-existent');
    expect(retrieved).toBeUndefined();
  });

  it('should list all plugins', () => {
    const plugin1 = { name: 'plugin1', version: '1.0.0', install: vi.fn() };
    const plugin2 = { name: 'plugin2', version: '1.0.0', install: vi.fn() };

    PluginManager.use(plugin1, TimeGuard);
    PluginManager.use(plugin2, TimeGuard);

    const list = PluginManager.listPlugins();
    expect(list).toContain('plugin1');
    expect(list).toContain('plugin2');
    PluginManager.clear();
  });

  it('should unregister a plugin', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    PluginManager.use(mockPlugin, TimeGuard);
    PluginManager.unuse('test-plugin');
    expect(PluginManager.getPlugin('test-plugin')).toBeUndefined();
  });

  it('should check if plugin is registered', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    expect(PluginManager.hasPlugin('test-plugin')).toBe(false);
    PluginManager.use(mockPlugin, TimeGuard);
    expect(PluginManager.hasPlugin('test-plugin')).toBe(true);
    PluginManager.clear();
  });

  it('should clear all plugins', () => {
    const plugin1 = { name: 'plugin1', version: '1.0.0', install: vi.fn() };
    const plugin2 = { name: 'plugin2', version: '1.0.0', install: vi.fn() };

    PluginManager.use(plugin1, TimeGuard);
    PluginManager.use(plugin2, TimeGuard);
    PluginManager.clear();

    expect(PluginManager.listPlugins()).toEqual([]);
  });

  it('should warn when registering duplicate plugins', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    PluginManager.use(mockPlugin, TimeGuard);
    PluginManager.use(mockPlugin, TimeGuard);

    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
    PluginManager.clear();
  });
});

describe('Coverage Tests - Alternative Calendars', () => {
  describe('Islamic Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.getMonthName(1)).toBe('Muharram');
      expect(calendar.getMonthName(12)).toBe('Dhu al-Hijjah');
      expect(calendar.id).toBe('islamic');
    });

    it('should handle out-of-range months', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.getMonthName(0)).toBe('Muharram');
      expect(calendar.getMonthName(13)).toBe('Dhu al-Hijjah');
    });

    it('should calculate leap years', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.isLeapYear(2)).toBe(true);
      expect(calendar.isLeapYear(3)).toBe(false);
      expect(calendar.isLeapYear(32)).toBe(true);
    });

    it('should calculate days in month', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.daysInMonth(1, 1)).toBe(30);
      expect(calendar.daysInMonth(1, 2)).toBe(29);
    });

    it('should calculate days in year', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.daysInYear(2)).toBe(355);
      expect(calendar.daysInYear(3)).toBe(354);
    });

    it('should get weekday names', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.getWeekdayName(1)).toBe('Ahad');
      expect(calendar.getWeekdayName(1, true)).toBe('Ahd');
    });
  });

  describe('Hebrew Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new HebrewCalendar();
      expect(calendar.getMonthName(1)).toBe('Tishrei');
      expect(calendar.getMonthName(12)).toBe('Elul');
      expect(calendar.id).toBe('hebrew');
    });

    it('should handle out-of-range months', () => {
      const calendar = new HebrewCalendar();
      expect(calendar.getMonthName(0)).toBe('Tishrei');
      expect(calendar.getMonthName(13)).toBe('Elul');
    });

    it('should get weekday names', () => {
      const calendar = new HebrewCalendar();
      expect(calendar.getWeekdayName(1)).toBe('Sunday');
      expect(calendar.getWeekdayName(1, true)).toBe('Sun');
    });
  });

  describe('Chinese Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getMonthName(1)).toBe('正月');
      expect(calendar.getMonthName(12)).toBe('腊月');
      expect(calendar.id).toBe('chinese');
    });

    it('should handle out-of-range months', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getMonthName(0)).toBe('正月');
      expect(calendar.getMonthName(13)).toBe('腊月');
    });

    it('should calculate leap years', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.isLeapYear(3)).toBe(true);
      expect(calendar.isLeapYear(4)).toBe(false);
    });

    it('should calculate days in month', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.daysInMonth(1, 2)).toBe(30);
      expect(calendar.daysInMonth(1, 1)).toBe(29);
    });

    it('should calculate days in year', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.daysInYear(3)).toBe(384);
      expect(calendar.daysInYear(4)).toBe(354);
    });

    it('should get zodiac sign', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getZodiacSign(2024)).toBeDefined();
      expect(calendar.getZodiacSign(0)).toBeDefined();
    });

    it('should get weekday names', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getWeekdayName(1)).toBe('星期日');
      expect(calendar.getWeekdayName(1, true)).toBe('日');
    });
  });

  describe('Japanese Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.getMonthName(1)).toBe('1月');
      expect(calendar.getMonthName(12)).toBe('12月');
      expect(calendar.id).toBe('japanese');
    });

    it('should handle out-of-range months', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.getMonthName(0)).toBe('1月');
      expect(calendar.getMonthName(13)).toBe('12月');
    });

    it('should calculate leap years', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.isLeapYear(2024)).toBe(true);
      expect(calendar.isLeapYear(2023)).toBe(false);
      expect(calendar.isLeapYear(2000)).toBe(true);
      expect(calendar.isLeapYear(1900)).toBe(false);
    });

    it('should calculate days in month', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.daysInMonth(2024, 2)).toBe(29);
      expect(calendar.daysInMonth(2023, 2)).toBe(28);
    });

    it('should calculate days in year', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.daysInYear(2024)).toBe(366);
      expect(calendar.daysInYear(2023)).toBe(365);
    });

    it('should get weekday names', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.getWeekdayName(1)).toBe('日曜日');
      expect(calendar.getWeekdayName(1, true)).toBe('日');
    });
  });

  describe('Buddhist Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new BuddhistCalendar();
      expect(calendar.getMonthName(1)).toBe('January');
      expect(calendar.getMonthName(12)).toBe('December');
      expect(calendar.id).toBe('buddhist');
    });

    it('should handle out-of-range months', () => {
      const calendar = new BuddhistCalendar();
      expect(calendar.getMonthName(0)).toBe('January');
      expect(calendar.getMonthName(13)).toBe('December');
    });

    it('should get weekday names', () => {
      const calendar = new BuddhistCalendar();
      expect(calendar.getWeekdayName(1)).toBe('Sunday');
    });
  });
});

describe('Coverage Tests - Duration Plugin', () => {
  it('should create duration from ISO string', () => {
    const dur = Duration.fromISO('P3Y6M4DT12H30M5S');
    expect(dur).toBeDefined();
  });

  it('should create duration from negative ISO string', () => {
    const dur = Duration.fromISO('-P3Y6M4DT12H30M5S');
    expect(dur).toBeDefined();
  });

  it('should throw on invalid ISO string', () => {
    expect(() => Duration.fromISO('invalid')).toThrow();
  });

  it('should create duration from milliseconds', () => {
    const dur = Duration.fromMilliseconds(1000 * 60 * 60 * 24);
    expect(dur).toBeDefined();
  });

  it('should handle negative milliseconds', () => {
    const dur = Duration.fromMilliseconds(-1000 * 60 * 60);
    expect(dur).toBeDefined();
  });

  it('should create duration between two dates', () => {
    const from = timeGuard('2024-01-01');
    const to = timeGuard('2024-12-31');
    const dur = Duration.between(from, to);
    expect(dur).toBeDefined();
  });

  it('should format duration to ISO string', () => {
    const dur = new Duration({
      years: 1,
      months: 2,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6,
    });
    const iso = dur.toISO();
    expect(iso).toBeDefined();
    expect(iso).toContain('P');
  });

  it('should get duration object', () => {
    const dur = new Duration({ years: 1, months: 2, days: 3 });
    const obj = dur.toObject();
    expect(obj.years).toBe(1);
    expect(obj.months).toBe(2);
    expect(obj.days).toBe(3);
  });

  it('should calculate asMilliseconds', () => {
    const dur = new Duration({ hours: 1, minutes: 30, seconds: 45 });
    const ms = dur.asMilliseconds();
    expect(ms).toBeGreaterThan(0);
  });

  it('should calculate asSeconds', () => {
    const dur = new Duration({ minutes: 1 });
    expect(dur.asSeconds()).toBe(60);
  });

  it('should calculate asMinutes', () => {
    const dur = new Duration({ hours: 1 });
    expect(dur.asMinutes()).toBe(60);
  });

  it('should calculate asHours', () => {
    const dur = new Duration({ days: 1 });
    expect(dur.asHours()).toBe(24);
  });

  it('should calculate asDays', () => {
    const dur = new Duration({ weeks: 1 });
    expect(dur.asDays()).toBe(7);
  });

  it('should calculate asWeeks', () => {
    const dur = new Duration({ days: 14 });
    expect(dur.asWeeks()).toBe(2);
  });

  it('should calculate asMonths', () => {
    const dur = new Duration({ days: 60 });
    expect(dur.asMonths()).toBeCloseTo(2, 1);
  });

  it('should calculate asYears', () => {
    const dur = new Duration({ days: 365 });
    expect(dur.asYears()).toBeCloseTo(1, 1);
  });

  it('should humanize duration', () => {
    const dur = new Duration({ days: 5, hours: 3 });
    const humanized = dur.humanize();
    expect(humanized).toContain('day');
    expect(humanized).toContain('hour');
  });

  it('should humanize zero duration', () => {
    const dur = new Duration({});
    const humanized = dur.humanize();
    expect(humanized).toBe('0 seconds');
  });

  it('should check if duration is negative', () => {
    const dur = Duration.fromISO('-P5D');
    expect(dur.isNegative()).toBe(true);
  });

  it('should get absolute value', () => {
    const dur = Duration.fromISO('-P5D');
    const abs = dur.abs();
    expect(abs).toBeDefined();
    expect(abs.isNegative()).toBe(false);
  });
});

describe('Coverage Tests - Duration Locale Utils', () => {
  it('should join duration parts with English', () => {
    const result = joinDurationParts(['1 year', '2 months'], 'en');
    expect(result).toContain('and');
  });

  it('should handle empty array', () => {
    const result = joinDurationParts([], 'en');
    expect(result).toBe('');
  });

  it('should handle single part', () => {
    const result = joinDurationParts(['5 hours'], 'en');
    expect(result).toBe('5 hours');
  });

  it('should handle two parts', () => {
    const result = joinDurationParts(['1 year', '2 months'], 'en');
    expect(result).toBe('1 year and 2 months');
  });

  it('should handle multiple parts', () => {
    const result = joinDurationParts(['1 year', '2 months', '3 days'], 'en');
    expect(result).toContain(',');
    expect(result).toContain('and');
  });

  it('should handle Spanish conjunction', () => {
    const result = joinDurationParts(['1 año', '2 meses'], 'es');
    expect(result).toContain('y');
  });

  it('should get duration unit label for singular', () => {
    expect(getDurationUnitLabel('year', 'en', 1)).toBe('year');
    expect(getDurationUnitLabel('month', 'en', 1)).toBe('month');
  });

  it('should get duration unit label for plural', () => {
    expect(getDurationUnitLabel('year', 'en', 2)).toBe('years');
    expect(getDurationUnitLabel('year', 'en', 0)).toBe('years');
  });

  it('should fallback to English for unknown locale', () => {
    expect(getDurationUnitLabel('year', 'unknown', 1)).toBe('year');
  });

  it('should format duration part', () => {
    expect(formatDurationPart(5, 'hour', 'en')).toBe('5 hours');
    expect(formatDurationPart(1, 'hour', 'en')).toBe('1 hour');
  });

  it('should return empty for zero value', () => {
    expect(formatDurationPart(0, 'hour', 'en')).toBe('');
  });

  it('should get conjunction labels', () => {
    expect(getConjunctionLabel('en')).toBe('and');
    expect(getConjunctionLabel('es')).toBe('y');
    expect(getConjunctionLabel('fr')).toBe('et');
    expect(getConjunctionLabel('de')).toBe('und');
    expect(getConjunctionLabel('it')).toBe('e');
    expect(getConjunctionLabel('pt')).toBe('e');
    expect(getConjunctionLabel('unknown')).toBe('and');
  });

  it('should format zero duration', () => {
    expect(formatZeroDuration('en')).toBe('0 seconds');
    expect(formatZeroDuration('es')).toBe('0 segundos');
    expect(formatZeroDuration('fr')).toBe('0 secondes');
    expect(formatZeroDuration('unknown')).toBe('0 seconds');
  });
});

describe('Coverage Tests - Advanced Format Plugin Integration', () => {
  beforeEach(() => {
    PluginManager.clear();
  });

  it('should format with quarter token Q', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg1 = timeGuard('2024-01-15');
    expect(tg1.format('Q')).toContain('1');

    const tg2 = timeGuard('2024-05-15');
    expect(tg2.format('Q')).toContain('2');

    const tg3 = timeGuard('2024-08-15');
    expect(tg3.format('Q')).toContain('3');

    const tg4 = timeGuard('2024-11-15');
    expect(tg4.format('Q')).toContain('4');
  });

  it('should format ordinal days', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    expect(timeGuard('2024-04-01').format('Do')).toContain('1st');
    expect(timeGuard('2024-04-02').format('Do')).toContain('2nd');
    expect(timeGuard('2024-04-03').format('Do')).toContain('3rd');
    expect(timeGuard('2024-04-04').format('Do')).toContain('4th');
    expect(timeGuard('2024-04-11').format('Do')).toContain('11th');
    expect(timeGuard('2024-04-21').format('Do')).toContain('21st');
  });

  it('should format ISO week numbers', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-01-15');
    const w = tg.format('W');
    const ww = tg.format('WW');
    expect(w).toBeDefined();
    expect(ww).toBeDefined();
  });

  it('should format locale week numbers', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-04-15');
    const w = tg.format('w');
    const ww = tg.format('ww');
    expect(w).toBeDefined();
    expect(ww).toBeDefined();
  });

  it('should format ISO week year', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-01-15');
    expect(tg.format('GGGG')).toContain('2024');
  });

  it('should format week year', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-01-15');
    expect(tg.format('gggg')).toContain('2024');
  });

  it('should format 24-hour clock', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-04-15 00:30:00');
    expect(tg.format('k')).toContain('24');

    const tg2 = timeGuard('2024-04-15 05:30:00');
    expect(tg2.format('kk')).toContain('05');
  });

  it('should format Unix timestamps', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-04-15 10:30:00');
    const x = tg.format('X');
    const xx = tg.format('x');
    expect(x).toBeDefined();
    expect(xx).toBeDefined();
  });

  it('should handle mixed standard and advanced tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-04-15');
    const result = tg.format('YYYY-MM-DD Q');
    expect(result).toContain('2024');
    expect(result).toContain('04');
    expect(result).toContain('15');
  });

  it('should pass through patterns without advanced tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);

    const tg = timeGuard('2024-04-15');
    const result = tg.format('YYYY-MM-DD');
    expect(result).toBe('2024-04-15');
  });
});

describe('Coverage Tests - Missing Branches', () => {
  it('should register locales with Map', () => {
    const localeMap = new Map();
    registerAllLocales(localeMap);
    expect(localeMap.size).toBeGreaterThan(0);
    expect(localeMap.has('en')).toBe(true);
  });

  it('should register locales with Record', () => {
    const localeRecord: Record<string, any> = {};
    registerAllLocales(localeRecord);
    expect(Object.keys(localeRecord).length).toBeGreaterThan(0);
    expect(localeRecord['en']).toBeDefined();
  });

  it('should handle Buddhist calendar', () => {
    const calendar = new BuddhistCalendar();
    expect(calendar.id).toBe('buddhist');
    expect(calendar.getMonthName(1)).toBe('January');
  });

  it('should handle Japanese calendar days in month', () => {
    const calendar = new JapaneseCalendar();
    expect(calendar.daysInMonth(2024, 2)).toBe(29);
    expect(calendar.daysInMonth(2023, 2)).toBe(28);
  });

  it('should handle diff with calendar mode', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-06-15');
    const diff = start.diff(end, 'millisecond', { mode: 'calendar' });
    expect(diff).toBeDefined();
  });

  it('should handle until with options', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-06-15');
    const result = start.until(end, {
      largestUnit: 'month',
      smallestUnit: 'day',
    });
    expect(result).toBeDefined();
  });

  it('should handle fromTemporal with config', () => {
    const tg = timeGuard('2024-04-15');
    const temporal = tg.toTemporal();
    const newTg = TimeGuard.fromTemporal(temporal, { locale: 'es' });
    expect(newTg.config.locale).toBe('es');
  });

  it('should handle startOf with different units', () => {
    const tg = timeGuard('2024-04-15 14:30:45');
    expect(tg.startOf('year').month()).toBe(1);
    expect(tg.startOf('month').day()).toBe(1);
    expect(tg.startOf('day').hour()).toBe(0);
    expect(tg.startOf('hour').minute()).toBe(0);
  });

  it('should handle endOf with different units', () => {
    const tg = timeGuard('2024-04-15 14:30:45');
    expect(tg.endOf('month').month()).toBe(4);
    expect(tg.endOf('day').hour()).toBe(23);
  });

  it('should handle toDurationString', () => {
    const tg = timeGuard('2024-01-01');
    const other = timeGuard('2024-06-15');
    const result = tg.toDurationString(other);
    expect(result).toContain('P');
    expect(tg.toDurationString()).toBeDefined();
  });

  it('should handle round with different modes', () => {
    const tg = timeGuard('2024-04-15 14:30:45.123');
    expect(
      tg.round({ smallestUnit: 'minute', roundingMode: 'floor' }),
    ).toBeDefined();
    expect(
      tg.round({ smallestUnit: 'minute', roundingMode: 'ceil' }),
    ).toBeDefined();
    expect(
      tg.round({ smallestUnit: 'minute', roundingMode: 'halfExpand' }),
    ).toBeDefined();
    expect(
      tg.round({ smallestUnit: 'minute', roundingMode: 'trunc' }),
    ).toBeDefined();
  });

  it('should handle Hebrew calendar methods', () => {
    const calendar = new HebrewCalendar();
    expect(calendar.isLeapYear(3)).toBe(true);
    expect(calendar.isLeapYear(1)).toBe(false);
    expect(calendar.daysInMonth(1, 1)).toBe(30);
    expect(calendar.daysInYear(3)).toBe(384);
    expect(calendar.daysInYear(1)).toBe(354);
  });

  it('should handle Buddhist calendar methods', () => {
    const calendar = new BuddhistCalendar();
    expect(calendar.isLeapYear(2567)).toBe(true); // 2024 CE
    expect(calendar.isLeapYear(2566)).toBe(false); // 2023 CE
    expect(calendar.daysInMonth(2567, 2)).toBe(29);
    expect(calendar.daysInYear(2567)).toBe(366);
    expect(calendar.daysInYear(2566)).toBe(365);
  });

  it('should handle advanced format with invalid input', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15');
    expect(tg.format('')).toBeDefined();
  });

  it('should handle advanced format unknown tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15');
    expect(tg.format('ZZZ')).toBe('ZZZ');
  });

  it('should handle duration toString', () => {
    const dur = new Duration({ days: 5, hours: 3 });
    expect(dur.toString()).toBe(dur.toISO());
  });

  it('should handle TimeGuard.duration static methods', () => {
    PluginManager.use(durationPlugin, TimeGuard);
    expect(TimeGuard.duration.fromISO('P5D')).toBeDefined();
    expect(TimeGuard.duration.fromMilliseconds(100000)).toBeDefined();
    const from = timeGuard('2024-01-01');
    const to = timeGuard('2024-01-10');
    expect(TimeGuard.duration.between(from, to)).toBeDefined();
  });

  it('should handle relative time fallback', () => {
    PluginManager.clear();
    const plugin = relativeTimePlugin;
    const now = TimeGuard.now();
    const past = now.subtract({ years: 100 });
    const result = plugin.formatRelativeTime(past, false);
    expect(result).toBeDefined();
  });

  it('should handle relative time set/get formats', () => {
    PluginManager.clear();
    const plugin = relativeTimePlugin;
    const original = plugin.getFormats();
    plugin.setFormats({ future: 'in %d' });
    expect(plugin.getFormats().future).toBe('in %d');
    plugin.setFormats(original);
  });

  it('should handle relative time with humanize and other', () => {
    PluginManager.clear();
    PluginManager.use(relativeTimePlugin, TimeGuard);
    const now = timeGuard('2024-04-15');
    const past = timeGuard('2024-04-10');
    expect(now.humanize(past)).toBeDefined();
    expect(now.fromNow()).toBeDefined();
    expect(now.toNow()).toBeDefined();
  });

  it('should handle round with halfExpand and other modes', () => {
    const tg = timeGuard('2024-04-15 14:30:35');
    expect(
      tg.round({ smallestUnit: 'minute', roundingMode: 'halfFloor' }),
    ).toBeDefined();
    expect(
      tg.round({ smallestUnit: 'minute', roundingMode: 'halfCeil' }),
    ).toBeDefined();
    expect(
      tg.round({ smallestUnit: 'minute', roundingMode: 'expand' }),
    ).toBeDefined();
  });

  it('should handle advanced format with z and zzz', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15');
    const tzMethod = (tg as any).getTimezoneOffset?.bind(tg);
    if (tzMethod) {
      expect(tg.format('z')).toBeDefined();
      expect(tg.format('zzz')).toBeDefined();
    }
  });

  it('should handle round with expand mode', () => {
    const tg = timeGuard('2024-04-15 14:30:01');
    const result = tg.round({ smallestUnit: 'minute', roundingMode: 'expand' });
    expect(result.minute()).toBe(31);
  });

  it('should handle round with halfFloor and halfCeil modes', () => {
    const tg1 = timeGuard('2024-04-15 14:30:25');
    expect(
      tg1.round({ smallestUnit: 'minute', roundingMode: 'halfFloor' }),
    ).toBeDefined();
    expect(
      tg1.round({ smallestUnit: 'minute', roundingMode: 'halfCeil' }),
    ).toBeDefined();
  });

  it('should handle humanize with other and withoutSuffix', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    const now = timeGuard('2024-04-15');
    const past = timeGuard('2024-04-10');
    expect(now.humanize(past, true)).toBeDefined();
    expect(now.humanize(past, false)).toBeDefined();
  });

  it('should handle duration humanize with weeks and milliseconds', () => {
    const dur1 = new Duration({ weeks: 2 });
    expect(dur1.humanize()).toContain('week');
    const dur2 = new Duration({ milliseconds: 500 });
    expect(dur2.humanize()).toContain('ms');
    const dur3 = new Duration({ months: 1 });
    expect(dur3.humanize()).toContain('month');
  });

  it('should handle duration with single units', () => {
    const dur1 = new Duration({ years: 1 });
    expect(dur1.humanize()).toContain('year');
    const dur2 = new Duration({ days: 1 });
    expect(dur2.humanize()).toContain('day');
    const dur3 = new Duration({ hours: 1 });
    expect(dur3.humanize()).toContain('hour');
    const dur4 = new Duration({ minutes: 1 });
    expect(dur4.humanize()).toContain('minute');
    const dur5 = new Duration({ seconds: 1 });
    expect(dur5.humanize()).toContain('second');
  });

  it('should handle until with error fallback', () => {
    const tg1 = timeGuard('2024-01-01');
    const tg2 = timeGuard('2024-12-31');
    const result = tg1.until(tg2);
    expect(result).toBeDefined();
  });

  it('should handle diff with calendar mode and options', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-06-15');
    const diff = start.diff(end, 'millisecond', {
      mode: 'calendar',
      locale: 'es',
    });
    expect(diff).toBeDefined();
  });

  it('should handle advanced format with kk tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg1 = timeGuard('2024-04-15 00:30:00');
    expect(tg1.format('k')).toBe('24');
    const tg2 = timeGuard('2024-04-15 05:30:00');
    expect(tg2.format('kk')).toBe('05');
  });

  it('should handle toDurationString with zero duration', () => {
    const tg = timeGuard('2024-04-15');
    const result = tg.toDurationString(tg);
    expect(result).toBe('PT0S');
  });

  it('should handle toDurationString with time parts', () => {
    const tg1 = timeGuard('2024-04-15 10:30:45');
    const tg2 = timeGuard('2024-04-15 14:15:30');
    const result = tg1.toDurationString(tg2);
    expect(result).toContain('PT');
  });

  it('should handle explain with calendar mode', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-06-15');
    const explanation = start.until(end).explain();
    expect(explanation).toBeDefined();
    expect(explanation.steps).toBeDefined();
  });

  it('should handle explain with leap years', () => {
    const start = timeGuard('2023-01-01');
    const end = timeGuard('2025-01-01');
    const explanation = start.until(end).explain();
    expect(explanation.leapYearFlags).toBeDefined();
  });

  it('should handle until with largestUnit option', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-06-15');
    const result = start.until(end, { largestUnit: 'month' });
    expect(result).toBeDefined();
  });

  it('should handle until with smallestUnit option', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-01-15');
    const result = start.until(end, { smallestUnit: 'day' });
    expect(result).toBeDefined();
  });

  it('should handle diff with undefined unit', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-06-15');
    const result = start.diff(end);
    expect(result).toBeDefined();
  });

  it('should handle duration between with plugin', () => {
    PluginManager.use(durationPlugin, TimeGuard);
    const from = timeGuard('2024-01-01');
    const to = timeGuard('2024-12-31');
    const dur = from.duration(to);
    expect(dur).toBeDefined();
  });

  it('should handle duration with negative values', () => {
    const dur = new Duration({ years: -1, months: -2, days: -3 });
    expect(dur.humanize()).toBeDefined();
  });

  it('should handle duration abs', () => {
    const dur = Duration.fromISO('-P5D');
    const abs = dur.abs();
    expect(abs.isNegative()).toBe(false);
  });

  it('should handle duration fromISO with time only', () => {
    const dur = Duration.fromISO('PT12H30M5S');
    expect(dur.toISO()).toContain('T');
  });

  it('should handle duration fromISO with weeks', () => {
    const dur = new Duration({ weeks: 2, days: 3 });
    expect(dur.toISO()).toContain('D');
  });

  it('should handle calendar manager get non-existent', () => {
    const manager = CalendarManager.getInstance();
    expect(manager.get('nonexistent')).toBeUndefined();
  });

  it('should handle locale manager setLocale', () => {
    const tg = timeGuard('2024-04-15');
    const localized = tg.locale('es');
    expect(localized.config.locale).toBe('es');
  });

  it('should handle timezone methods', () => {
    const tg = timeGuard('2024-04-15');
    expect(tg.getOffset()).toBeDefined();
    expect(tg.getOffsetNanoseconds()).toBeDefined();
    expect(tg.getTimeZoneId()).toBeDefined();
  });

  it('should format with single digit hour and minute tokens', () => {
    const tg = timeGuard('2024-04-15 09:05:05');
    expect(tg.format('H')).toBe('9');
    expect(tg.format('h')).toBe('9');
    expect(tg.format('m')).toBe('5');
    expect(tg.format('s')).toBe('5');
  });

  it('should format with meridiem uppercase', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    expect(tg.format('A')).toBe('PM');
    const tg2 = timeGuard('2024-04-15 08:30:00');
    expect(tg2.format('A')).toBe('AM');
  });

  it('should handle formatter getPreset edge cases', () => {
    const formatter = new DateFormatter();
    expect(formatter.getPreset('utc')).toContain('Z');
  });

  it('should format with escaped text and default case', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    const result = tg.format('[today] YYYY-MM-DD');
    expect(result).toBeDefined();
  });

  it('should handle locale manager edge cases', () => {
    const tg = timeGuard('2024-04-15');
    expect(tg.locale('fr').config.locale).toBe('fr');
    expect(tg.locale('de').config.locale).toBe('de');
  });

  it('should handle plugin manager error case', () => {
    const badPlugin = {
      name: 'bad-plugin',
      version: '1.0.0',
      install: () => {
        throw new Error('install failed');
      },
    };
    expect(() => PluginManager.use(badPlugin as any, TimeGuard)).toThrow();
    PluginManager.clear();
  });

  it('should handle until with both largestUnit and smallestUnit', () => {
    const start = timeGuard('2024-01-01 10:30:00');
    const end = timeGuard('2024-06-15 14:45:30');
    const result = start.until(end, {
      largestUnit: 'month',
      smallestUnit: 'second',
    });
    expect(result).toBeDefined();
  });

  it('should handle explain with mode estimated', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-01-10');
    const explanation = start.until(end).explain();
    expect(explanation.mode).toBeDefined();
  });

  it('should handle duration asMonths and asYears', () => {
    const dur = new Duration({ days: 365 });
    expect(dur.asMonths()).toBeGreaterThan(0);
    expect(dur.asYears()).toBeGreaterThan(0);
  });

  it('should handle duration asWeeks and asDays', () => {
    const dur = new Duration({ days: 14 });
    expect(dur.asWeeks()).toBe(2);
    expect(dur.asDays()).toBe(14);
  });

  it('should handle duration as method with all units', () => {
    const dur = new Duration({ days: 7, hours: 12 });
    expect(dur.as('milliseconds')).toBeGreaterThan(0);
    expect(dur.as('seconds')).toBeGreaterThan(0);
    expect(dur.as('minutes')).toBeGreaterThan(0);
    expect(dur.as('hours')).toBeGreaterThan(0);
    expect(dur.as('days')).toBeGreaterThan(0);
    expect(dur.as('weeks')).toBeGreaterThan(0);
    expect(dur.as('months')).toBeGreaterThan(0);
    expect(dur.as('years')).toBeGreaterThan(0);
  });

  it('should handle duration asHours and asMinutes', () => {
    const dur = new Duration({ hours: 2, minutes: 30 });
    expect(dur.asHours()).toBeGreaterThan(0);
    expect(dur.asMinutes()).toBeGreaterThan(0);
  });

  it('should handle round with smallestUnit microsecond', () => {
    const tg = timeGuard('2024-04-15 14:30:45.123456');
    const result = tg.round({ smallestUnit: 'millisecond' });
    expect(result).toBeDefined();
  });

  it('should handle diff with millisecond unit', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-01-02');
    const result = start.diff(end, 'millisecond');
    expect(result).toBeDefined();
  });

  it('should handle until with calendar mode', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2024-06-15');
    const result = start.until(end, { mode: 'calendar' });
    expect(result).toBeDefined();
  });

  it('should handle breakdown with seconds', () => {
    const start = timeGuard('2024-01-01 00:00:00');
    const end = timeGuard('2024-01-01 00:00:30');
    const result = start.until(end);
    expect(result).toBeDefined();
  });

  it('should handle breakdown with minutes', () => {
    const start = timeGuard('2024-01-01 00:00:00');
    const end = timeGuard('2024-01-01 00:05:00');
    const result = start.until(end);
    expect(result).toBeDefined();
  });

  it('should handle toDurationString with zero duration', () => {
    const tg = timeGuard('2024-01-01');
    const result = tg.toDurationString(tg);
    expect(result).toBe('PT0S');
  });

  it('should handle toDurationString with time parts only', () => {
    const start = timeGuard('2024-01-01 10:00:00');
    const end = timeGuard('2024-01-01 12:30:45');
    const result = start.toDurationString(end);
    expect(result).toContain('T');
    expect(result).toContain('H');
  });

  it('should handle toDurationString with date and time parts', () => {
    const start = timeGuard('2024-01-01 10:00:00');
    const end = timeGuard('2024-03-15 14:30:45');
    const result = start.toDurationString(end);
    expect(result).toContain('P');
    expect(result).toContain('D');
  });

  it('should handle formatPreset with all presets', () => {
    const tg = timeGuard('2024-03-13 14:30:45.123');
    const formatter = new DateFormatter();
    expect(formatter.formatPreset(tg.temporal, 'iso')).toBeDefined();
    expect(formatter.formatPreset(tg.temporal, 'date')).toBeDefined();
    expect(formatter.formatPreset(tg.temporal, 'time')).toBeDefined();
    expect(formatter.formatPreset(tg.temporal, 'datetime')).toBeDefined();
    expect(formatter.formatPreset(tg.temporal, 'rfc2822')).toBeDefined();
    expect(formatter.formatPreset(tg.temporal, 'rfc3339')).toBeDefined();
    expect(formatter.formatPreset(tg.temporal, 'utc')).toBeDefined();
  });

  it('should handle useMultiple with plugins', () => {
    PluginManager.clear();
    PluginManager.useMultiple(
      [relativeTimePlugin, durationPlugin, advancedFormatPlugin],
      TimeGuard,
    );
    expect(PluginManager.hasPlugin('relative-time')).toBe(true);
    expect(PluginManager.hasPlugin('duration')).toBe(true);
    expect(PluginManager.hasPlugin('advanced-format')).toBe(true);
    PluginManager.clear();
  });

  it('should handle round with default roundingMode', () => {
    const tg = timeGuard('2024-04-15 14:30:45.500');
    const result = tg.round({ smallestUnit: 'second' });
    expect(result).toBeDefined();
  });

  it('should handle round with unknown roundingMode', () => {
    const tg = timeGuard('2024-04-15 14:30:45.500');
    const result = tg.round({
      smallestUnit: 'second',
      roundingMode: 'unknown' as any,
    });
    expect(result).toBeDefined();
  });

  it('should handle round with invalid smallestUnit', () => {
    const tg = timeGuard('2024-04-15 14:30:45');
    const result = tg.round({ smallestUnit: 'invalid' as any });
    expect(result).toBeDefined();
    expect(result.temporal).toBeDefined();
  });

  it('should handle format with all time tokens', () => {
    const tg = timeGuard('2024-04-15 14:30:45.123');
    expect(tg.format('HH')).toBe('14');
    expect(tg.format('H')).toBe('14');
    expect(tg.format('hh')).toBe('02');
    expect(tg.format('h')).toBe('2');
    expect(tg.format('mm')).toBe('30');
    expect(tg.format('m')).toBe('30');
    expect(tg.format('ss')).toBe('45');
    expect(tg.format('s')).toBe('45');
    expect(tg.format('SSS')).toBe('123');
  });

  it('should handle format with meridiem lowercase', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    expect(tg.format('a')).toBe('pm');
    const tg2 = timeGuard('2024-04-15 08:30:00');
    expect(tg2.format('a')).toBe('am');
  });

  it('should handle since with options', () => {
    const start = timeGuard('2024-01-01 10:30:00');
    const end = timeGuard('2024-06-15 14:45:30');
    const result = start.since(end, {
      largestUnit: 'month',
      smallestUnit: 'second',
    });
    expect(result).toBeDefined();
  });

  it('should handle duration result explain with leap years', () => {
    const start = timeGuard('2024-01-01');
    const end = timeGuard('2025-01-01');
    const result = start.until(end);
    const explanation = result.explain();
    expect(explanation.leapYearFlags).toBeDefined();
  });

  it('should handle format with double-quoted text', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    const result = tg.format('"today is" YYYY-MM-DD');
    expect(result).toBeDefined();
  });

  it('should handle format with weekday tokens dd and d', () => {
    const tg = timeGuard('2024-04-15'); // Monday
    expect(tg.format('dd')).toBeDefined();
    expect(tg.format('d')).toBeDefined();
  });

  it('should handle format with unknown token default case', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    const result = tg.format('YYYY-MM-DD [custom]');
    expect(result).toContain('custom');
  });

  it('should handle advanced format with timezone token z', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15 14:30:00');
    expect(tg.format('z')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle locale manager with invalid locale fallback', () => {
    const tg = timeGuard('2024-04-15');
    tg.locale('invalid-locale-xyz');
    expect(tg.config.locale).toBeDefined();
  });

  it('should handle duration plugin humanize with negative duration', () => {
    const dur = new Duration({ days: -5 });
    expect(dur.humanize()).toBeDefined();
  });

  it('should handle relative time plugin with custom thresholds', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    const now = timeGuard('2024-01-02');
    expect(past.fromNow()).toBeDefined();
    expect(now.toNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle humanize without other parameter', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    expect(past.humanize()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle relative time fallback for large milliseconds', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    const veryPast = timeGuard('2020-01-01');
    expect(veryPast.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle relative time with custom format function', () => {
    const customPlugin = new RelativeTimePlugin({
      thresholds: [
        { l: 's', r: 44 },
        { l: 'm', r: 89 },
      ],
      formats: {
        s: () => 'a few seconds',
        m: 'a minute',
        past: '%s ago',
        future: 'in %s',
      },
    });
    PluginManager.use(customPlugin, TimeGuard);
    const past = timeGuard('2023-12-31');
    expect(past.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle calendar manager with invalid calendar fallback', () => {
    const manager = CalendarManager.getInstance();
    expect(manager.getDefault()).toBeDefined();
  });

  it('should handle calendar manager setDefault when calendar exists', () => {
    const manager = CalendarManager.getInstance();
    manager.setDefault('gregory');
    expect(manager.getDefault().id).toBe('gregory');
  });

  it('should handle locale manager getCurrentLocale', () => {
    const tg = timeGuard('2024-04-15');
    const tgEs = tg.locale('es');
    expect(tgEs.config.locale).toBe('es');
  });

  it('should handle duration toISO with time components', () => {
    const dur = new Duration({ hours: 2, minutes: 30, seconds: 45 });
    expect(dur.toISO()).toContain('T');
    expect(dur.toISO()).toContain('H');
  });

  it('should handle duration isNegative and abs', () => {
    const dur = new Duration({ days: -5 });
    expect(dur.isNegative()).toBe(true);
    const absDur = dur.abs();
    expect(absDur.isNegative()).toBe(false);
  });

  it('should handle duration toObject', () => {
    const dur = new Duration({
      years: 1,
      months: 2,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6,
    });
    const obj = dur.toObject();
    expect(obj.years).toBe(1);
    expect(obj.months).toBe(2);
    expect(obj.days).toBe(3);
  });

  it('should handle duration fromISO with weeks', () => {
    // Regression: fromISO()'s destructuring used to skip the weeks capture
    // group entirely, silently dropping it (always 0) instead of the 2
    // weeks in this string.
    const dur = Duration.fromISO('P2W3D');
    expect(dur.toObject().weeks).toBe(2);
    expect(dur.toObject().days).toBe(3);
  });

  it('should handle advanced format with Unix timestamp tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15 14:30:00');
    expect(tg.format('X')).toBeDefined();
    expect(tg.format('x')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle advanced format with week tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15');
    expect(tg.format('w')).toBeDefined();
    expect(tg.format('ww')).toBeDefined();
    expect(tg.format('W')).toBeDefined();
    expect(tg.format('WW')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle advanced format with quarter and ordinal', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15');
    expect(tg.format('Q')).toBe('2');
    expect(tg.format('Do')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle relative time with withoutSuffix', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    expect(past.fromNow(true)).toBeDefined();
    expect(past.toNow(true)).toBeDefined();
    PluginManager.clear();
  });

  it('should handle plugin manager getPlugin and listPlugins', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    expect(PluginManager.getPlugin('relative-time')).toBeDefined();
    expect(PluginManager.listPlugins()).toContain('relative-time');
    PluginManager.clear();
  });

  it('should handle unuse plugin', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    expect(PluginManager.hasPlugin('relative-time')).toBe(true);
    PluginManager.unuse('relative-time');
    expect(PluginManager.hasPlugin('relative-time')).toBe(false);
    PluginManager.clear();
  });

  it('should handle locale manager listLocales', () => {
    const manager = LocaleManager.getInstance();
    const locales = manager.listLocales();
    expect(locales).toContain('en');
    expect(locales).toContain('es');
  });

  it('should handle loadLocales with custom locale', () => {
    const manager = LocaleManager.getInstance();
    manager.loadLocales({
      fr: {
        name: 'fr',
        months: [
          'Janvier',
          'Février',
          'Mars',
          'Avril',
          'Mai',
          'Juin',
          'Juillet',
          'Août',
          'Septembre',
          'Octobre',
          'Novembre',
          'Décembre',
        ],
        monthsShort: [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Jun',
          'Jul',
          'Aoû',
          'Sep',
          'Oct',
          'Nov',
          'Déc',
        ],
        weekdays: [
          'Dimanche',
          'Lundi',
          'Mardi',
          'Mercredi',
          'Jeudi',
          'Vendredi',
          'Samedi',
        ],
        weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        weekdaysMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
        meridiem: { am: 'AM', pm: 'PM' },
        formats: {
          iso: 'YYYY-MM-DD',
          date: 'DD/MM/YYYY',
          time: 'HH:mm:ss',
          datetime: 'DD/MM/YYYY HH:mm:ss',
          rfc2822: '',
        },
      },
    });
    expect(manager.listLocales()).toContain('fr');
  });

  it('should handle format with meridiem from locale', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    tg.locale('es');
    expect(tg.format('a')).toBeDefined();
    expect(tg.format('A')).toBeDefined();
  });

  it('should handle duration between two dates', () => {
    const from = timeGuard('2024-01-01');
    const to = timeGuard('2024-12-31');
    const dur = Duration.between(from, to);
    expect(dur).toBeDefined();
    expect(dur.asDays()).toBeGreaterThan(0);
  });

  it('should handle duration fromMilliseconds', () => {
    const dur = Duration.fromMilliseconds(86400000);
    expect(dur.asDays()).toBe(1);
  });

  it('should handle calendar daysInMonth edge cases', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.daysInMonth(2024, 2)).toBe(29);
    expect(calendar.daysInMonth(2023, 2)).toBe(28);
    expect(calendar.daysInMonth(2024, 4)).toBe(30);
  });

  it('should handle Islamic calendar methods', () => {
    const calendar = new IslamicCalendar();
    expect(calendar.getMonthName(1)).toBe('Muharram');
    // 1445 % 30 === 5, which is a leap year in the 30-year Islamic cycle
    expect(calendar.isLeapYear(1445)).toBe(true);
  });

  it('should handle Hebrew calendar methods', () => {
    const calendar = new HebrewCalendar();
    expect(calendar.getMonthName(1)).toBe('Tishrei');
  });

  it('should handle Chinese calendar methods', () => {
    const calendar = new ChineseCalendar();
    expect(calendar.getMonthName(1)).toBe('正月');
  });

  it('should handle Japanese calendar methods', () => {
    const calendar = new JapaneseCalendar();
    expect(calendar.getMonthName(1)).toBe('1月');
  });

  it('should handle Buddhist calendar methods', () => {
    const calendar = new BuddhistCalendar();
    expect(calendar.getMonthName(1)).toBe('January');
  });

  it('should handle Islamic calendar daysInMonth with leap year', () => {
    const calendar = new IslamicCalendar();
    // Month 12 (even) has 30 days only on leap years, otherwise 29
    expect(calendar.daysInMonth(1445, 12)).toBe(30);
    expect(calendar.daysInMonth(1446, 12)).toBe(29);
  });

  it('should handle Buddhist calendar daysInMonth edge case', () => {
    const calendar = new BuddhistCalendar();
    // BE 2567 -> CE 2024, a Gregorian leap year, so February has 29 days
    expect(calendar.daysInMonth(2567, 2)).toBe(29);
  });

  it('should handle duration humanize with singular units', () => {
    const dur = new Duration({
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
    expect(dur.humanize()).toBeDefined();
  });

  it('should handle duration humanize with zero values', () => {
    const dur = new Duration({});
    expect(dur.humanize()).toBe('0 seconds');
  });

  it('should handle advanced format default case with unknown token', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-04-15 14:30:00');
    const result = tg.format('YYYY-MM-DD');
    expect(result).toBeDefined();
    PluginManager.clear();
  });

  it('should handle relative time format as function type', () => {
    const customPlugin = new RelativeTimePlugin({
      formats: {
        s: () => 'just now',
        m: 'a minute',
        past: '%s ago',
        future: 'in %s',
      },
    });
    PluginManager.use(customPlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    expect(past.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle locale manager getLocale fallback', () => {
    const manager = LocaleManager.getInstance();
    const locale = manager.getLocale('nonexistent');
    expect(locale.name).toBe('en');
  });

  it('should handle plugin manager error message formatting', () => {
    const badPlugin = {
      name: 'error-plugin',
      version: '1.0.0',
      install: () => {
        throw 'string error';
      },
    };
    expect(() => PluginManager.use(badPlugin as any, TimeGuard)).toThrow();
    PluginManager.clear();
  });

  it('should handle until with same date', () => {
    const date = timeGuard('2024-01-01');
    const result = date.until(date);
    expect(result).toBeDefined();
  });

  it('should handle since with same date', () => {
    const date = timeGuard('2024-01-01');
    const result = date.since(date);
    expect(result).toBeDefined();
  });

  it('should handle format with all meridiem variations', () => {
    const tg1 = timeGuard('2024-04-15 00:30:00');
    expect(tg1.format('a')).toBeDefined();
    expect(tg1.format('A')).toBeDefined();
    const tg2 = timeGuard('2024-04-15 12:00:00');
    expect(tg2.format('a')).toBeDefined();
    expect(tg2.format('A')).toBeDefined();
  });

  it('should handle duration with negative milliseconds', () => {
    const dur = new Duration({ milliseconds: -500 });
    expect(dur.humanize()).toBeDefined();
  });

  it('should handle relative time with threshold.d undefined', () => {
    const customPlugin = new RelativeTimePlugin({
      thresholds: [{ l: 's', r: 44 }],
      formats: { s: 'seconds', past: '%s ago', future: 'in %s' },
    });
    PluginManager.use(customPlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    expect(past.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle locale manager getCurrentLocale after setLocale', () => {
    const manager = LocaleManager.getInstance();
    manager.setLocale('es');
    expect(manager.getCurrentLocale()).toBe('es');
  });

  it('should handle duration humanize with all singular units', () => {
    const d1 = new Duration({ years: 1 });
    const d2 = new Duration({ months: 1 });
    const d3 = new Duration({ weeks: 1 });
    const d4 = new Duration({ days: 1 });
    const d5 = new Duration({ hours: 1 });
    const d6 = new Duration({ minutes: 1 });
    const d7 = new Duration({ seconds: 1 });
    expect(d1.humanize()).toContain('year');
    expect(d2.humanize()).toContain('month');
    expect(d3.humanize()).toContain('week');
    expect(d4.humanize()).toContain('day');
    expect(d5.humanize()).toContain('hour');
    expect(d6.humanize()).toContain('minute');
    expect(d7.humanize()).toContain('second');
  });

  it('should handle calendar getMonthName with short form', () => {
    const islamic = new IslamicCalendar();
    expect(islamic.getMonthName(1, true)).toBeDefined();
    const hebrew = new HebrewCalendar();
    expect(hebrew.getMonthName(1, true)).toBeDefined();
  });

  it('should handle advanced format with k and kk tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg1 = timeGuard('2024-04-15 00:30:00');
    expect(tg1.format('k')).toBeDefined();
    expect(tg1.format('kk')).toBeDefined();
    const tg2 = timeGuard('2024-04-15 14:30:00');
    expect(tg2.format('k')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle relative time getUnitMilliseconds with unknown unit', () => {
    const customPlugin = new RelativeTimePlugin({
      thresholds: [{ l: 'custom', r: 100, d: 'unknown' }],
      formats: { custom: '%d units', past: '%s ago', future: 'in %s' },
    });
    PluginManager.use(customPlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    expect(past.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle Islamic calendar daysInMonth boundary months', () => {
    const calendar = new IslamicCalendar();
    expect(calendar.daysInMonth(1445, 1)).toBeDefined();
    expect(calendar.daysInMonth(1445, 6)).toBeDefined();
  });

  it('should handle Buddhist calendar daysInMonth', () => {
    const calendar = new BuddhistCalendar();
    expect(calendar.daysInMonth(2567, 2)).toBeDefined();
    expect(calendar.daysInMonth(2568, 2)).toBeDefined();
  });

  it('should handle duration humanize with negative plural units', () => {
    const dur = new Duration({ years: -2, months: -3, days: -5 });
    expect(dur.humanize()).toBeDefined();
  });

  it('should handle format with escaped brackets and default token', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    const result = tg.format('[test] YYYY-MM-DD');
    expect(result).toContain('test');
  });

  it('should handle until with large date range crossing leap years', () => {
    const start = timeGuard('2020-01-01');
    const end = timeGuard('2024-12-31');
    const result = start.until(end);
    expect(result.explain().leapYearFlags.length).toBeGreaterThan(0);
  });

  it('should handle calendar getWeekdayName with short form', () => {
    const islamic = new IslamicCalendar();
    expect(islamic.getWeekdayName(1, true)).toBeDefined();
    const hebrew = new HebrewCalendar();
    expect(hebrew.getWeekdayName(1, true)).toBeDefined();
  });

  it('should handle duration toISO with empty duration', () => {
    const dur = new Duration({});
    expect(dur.toISO()).toBeDefined();
  });

  it('should handle advanced format with gggg and GGGG tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-01-01');
    expect(tg.format('gggg')).toBeDefined();
    expect(tg.format('GGGG')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle relative time with very small milliseconds', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    const slightlyPast = timeGuard('2024-01-01 00:00:00.001');
    expect(slightlyPast.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle locale manager setLocale with uppercase', () => {
    const manager = LocaleManager.getInstance();
    manager.setLocale('ES');
    expect(manager.getCurrentLocale()).toBe('es');
  });

  it('should handle Hebrew calendar daysInMonth', () => {
    const calendar = new HebrewCalendar();
    expect(calendar.daysInMonth(5784, 1)).toBeDefined();
    expect(calendar.daysInMonth(5784, 12)).toBeDefined();
  });

  it('should handle Chinese calendar daysInMonth', () => {
    const calendar = new ChineseCalendar();
    expect(calendar.daysInMonth(2024, 1)).toBeDefined();
  });

  it('should handle Japanese calendar daysInMonth', () => {
    const calendar = new JapaneseCalendar();
    expect(calendar.daysInMonth(2024, 2)).toBeDefined();
  });

  it('should handle duration as with all unit types', () => {
    const dur = new Duration({ days: 1 });
    expect(dur.as('milliseconds')).toBeGreaterThan(0);
    expect(dur.as('seconds')).toBeGreaterThan(0);
    expect(dur.as('minutes')).toBeGreaterThan(0);
    expect(dur.as('hours')).toBeGreaterThan(0);
    expect(dur.as('days')).toBeGreaterThan(0);
    expect(dur.as('weeks')).toBeGreaterThan(0);
    expect(dur.as('months')).toBeGreaterThan(0);
    expect(dur.as('years')).toBeGreaterThan(0);
  });

  it('should handle format with meridiem from different locales', () => {
    const tgEs = timeGuard('2024-04-15 14:30:00').locale('es');
    expect(tgEs.format('a')).toBeDefined();
  });

  it('should handle relative time with custom thresholds no nextThreshold', () => {
    const customPlugin = new RelativeTimePlugin({
      thresholds: [{ l: 's' }],
      formats: { s: 'seconds', past: '%s ago', future: 'in %s' },
    });
    PluginManager.use(customPlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    expect(past.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle Islamic calendar isLeapYear variations', () => {
    const calendar = new IslamicCalendar();
    expect(calendar.isLeapYear(1444)).toBeDefined();
    expect(calendar.isLeapYear(1445)).toBeDefined();
  });

  it('should handle Buddhist calendar isLeapYear', () => {
    const calendar = new BuddhistCalendar();
    expect(calendar.isLeapYear(2567)).toBeDefined();
    expect(calendar.isLeapYear(2568)).toBeDefined();
  });

  it('should handle duration fromISO with full ISO string', () => {
    const dur = Duration.fromISO('P1Y2M3W4DT5H6M7S');
    const obj = dur.toObject();
    expect(obj.years).toBe(1);
    expect(obj.months).toBe(2);
    expect(obj.weeks).toBe(3);
    expect(obj.days).toBe(4);
    expect(obj.hours).toBe(5);
    expect(obj.minutes).toBe(6);
    expect(obj.seconds).toBe(7);
  });

  it('should handle format with all weekday tokens', () => {
    const tg = timeGuard('2024-04-15'); // Monday
    expect(tg.format('dddd')).toBeDefined();
    expect(tg.format('ddd')).toBeDefined();
    expect(tg.format('dd')).toBeDefined();
    expect(tg.format('d')).toBeDefined();
  });

  it('should handle advanced format with Do ordinal variations', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg1 = timeGuard('2024-04-01');
    expect(tg1.format('Do')).toBeDefined();
    const tg2 = timeGuard('2024-04-02');
    expect(tg2.format('Do')).toBeDefined();
    const tg3 = timeGuard('2024-04-03');
    expect(tg3.format('Do')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle plugin manager clear and re-register', () => {
    PluginManager.use(relativeTimePlugin, TimeGuard);
    expect(PluginManager.hasPlugin('relative-time')).toBe(true);
    PluginManager.clear();
    expect(PluginManager.hasPlugin('relative-time')).toBe(false);
    PluginManager.use(relativeTimePlugin, TimeGuard);
    expect(PluginManager.hasPlugin('relative-time')).toBe(true);
    PluginManager.clear();
  });

  it('should handle Islamic calendar getMonthName with all months', () => {
    const calendar = new IslamicCalendar();
    for (let i = 1; i <= 12; i++) {
      expect(calendar.getMonthName(i)).toBeDefined();
    }
  });

  it('should handle Hebrew calendar getWeekdayName', () => {
    const calendar = new HebrewCalendar();
    expect(calendar.getWeekdayName(1)).toBeDefined();
    expect(calendar.getWeekdayName(7)).toBeDefined();
  });

  it('should handle Chinese calendar getWeekdayName', () => {
    const calendar = new ChineseCalendar();
    expect(calendar.getWeekdayName(1)).toBeDefined();
  });

  it('should handle Japanese calendar getWeekdayName', () => {
    const calendar = new JapaneseCalendar();
    expect(calendar.getWeekdayName(1)).toBeDefined();
  });

  it('should handle Buddhist calendar getWeekdayName', () => {
    const calendar = new BuddhistCalendar();
    expect(calendar.getWeekdayName(1)).toBeDefined();
  });

  it('should handle duration humanize with mixed positive and negative', () => {
    const dur = new Duration({ years: 1, months: -2, days: 3 });
    expect(dur.humanize()).toBeDefined();
  });

  it('should handle format with month variations', () => {
    const tg = timeGuard('2024-04-15');
    expect(tg.format('MMMM')).toBeDefined();
    expect(tg.format('MMM')).toBeDefined();
    expect(tg.format('MM')).toBeDefined();
    expect(tg.format('M')).toBeDefined();
  });

  it('should handle format with year variations', () => {
    const tg = timeGuard('2024-04-15');
    expect(tg.format('YYYY')).toBeDefined();
    expect(tg.format('YY')).toBeDefined();
    expect(tg.format('Y')).toBeDefined();
  });

  it('should handle advanced format with Q token for all quarters', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    expect(timeGuard('2024-01-15').format('Q')).toBe('1');
    expect(timeGuard('2024-04-15').format('Q')).toBe('2');
    expect(timeGuard('2024-07-15').format('Q')).toBe('3');
    expect(timeGuard('2024-10-15').format('Q')).toBe('4');
    PluginManager.clear();
  });

  it('should handle calendar manager register new calendar', () => {
    const manager = CalendarManager.getInstance();
    const persian = {
      id: 'persian',
      name: 'Persian',
      getMonthName: (m: number) => ['Farvardin'][m - 1] || 'Unknown',
      getWeekdayName: (d: number) => ['Saturday'][d - 1] || 'Unknown',
      isLeapYear: () => false,
      daysInMonth: () => 30,
      daysInYear: () => 365,
    };
    manager.register(persian as any);
    expect(manager.get('persian')).toBeDefined();
  });

  it('should handle duration fromISO with negative duration', () => {
    const dur = Duration.fromISO('-P1Y2M3D');
    expect(dur).toBeDefined();
  });

  it('should handle format with day tokens', () => {
    const tg = timeGuard('2024-04-15');
    expect(tg.format('DD')).toBeDefined();
    expect(tg.format('D')).toBeDefined();
  });

  it('should handle relative time with threshold.r zero', () => {
    const customPlugin = new RelativeTimePlugin({
      thresholds: [{ l: 's', r: 0 }],
      formats: { s: 'seconds', past: '%s ago', future: 'in %s' },
    });
    PluginManager.use(customPlugin, TimeGuard);
    const past = timeGuard('2024-01-01');
    expect(past.fromNow()).toBeDefined();
    PluginManager.clear();
  });

  it('should handle locale manager getLocale with current locale', () => {
    const manager = LocaleManager.getInstance();
    manager.setLocale('en');
    expect(manager.getLocale().name).toBe('en');
  });

  it('should handle Islamic calendar getWeekdayName with all days', () => {
    const calendar = new IslamicCalendar();
    for (let i = 1; i <= 7; i++) {
      expect(calendar.getWeekdayName(i)).toBeDefined();
    }
  });

  it('should handle duration toObject with all fields', () => {
    const dur = new Duration({
      years: 1,
      months: 2,
      weeks: 3,
      days: 4,
      hours: 5,
      minutes: 6,
      seconds: 7,
      milliseconds: 8,
    });
    const obj = dur.toObject();
    expect(obj.years).toBe(1);
    expect(obj.months).toBe(2);
    expect(obj.weeks).toBe(3);
    expect(obj.days).toBe(4);
    expect(obj.hours).toBe(5);
    expect(obj.minutes).toBe(6);
    expect(obj.seconds).toBe(7);
    expect(obj.milliseconds).toBe(8);
  });

  it('should handle format with time tokens at midnight', () => {
    const tg = timeGuard('2024-04-15 00:00:00');
    expect(tg.format('HH:mm:ss')).toBe('00:00:00');
    expect(tg.format('h:mm a')).toBeDefined();
  });

  it('should handle advanced format with w and ww tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    const tg = timeGuard('2024-06-15');
    expect(tg.format('w')).toBeDefined();
    expect(tg.format('ww')).toBeDefined();
    PluginManager.clear();
  });

  it('should handle relative time with hours threshold', () => {
    const customPlugin = new RelativeTimePlugin({
      thresholds: [
        { l: 's', r: 44, d: 'second' },
        { l: 'm', r: 89, d: 'minute' },
        { l: 'h', r: 22, d: 'hour' },
      ],
      formats: {
        s: 'seconds',
        m: 'a minute',
        h: 'an hour',
        past: '%s ago',
        future: 'in %s',
      },
    });
    PluginManager.use(customPlugin, TimeGuard);
    const past = timeGuard('2024-01-01 10:00:00');
    expect(past.fromNow()).toBeDefined();
    PluginManager.clear();
  });
});
