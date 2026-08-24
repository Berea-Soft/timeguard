import { describe, it, expect, beforeEach } from 'vitest';
import { TimeGuard } from '../src/index';

describe('Business Days and Holidays', () => {
  beforeEach(() => {
    TimeGuard.clearHolidays();
  });

  it('should detect weekends correctly', () => {
    const monday = TimeGuard.from('2026-05-18');
    const friday = TimeGuard.from('2026-05-22');
    const saturday = TimeGuard.from('2026-05-23');
    const sunday = TimeGuard.from('2026-05-24');

    expect(monday.isWeekend()).toBe(false);
    expect(friday.isWeekend()).toBe(false);
    expect(saturday.isWeekend()).toBe(true);
    expect(sunday.isWeekend()).toBe(true);
  });

  it('should register and clear holidays', () => {
    expect(TimeGuard.getRegisteredHolidays()).toHaveLength(0);

    TimeGuard.registerHolidays(['2026-01-01', '2026-12-25']);
    const holidays = TimeGuard.getRegisteredHolidays();
    expect(holidays).toContain('2026-01-01');
    expect(holidays).toContain('2026-12-25');
    expect(holidays).toHaveLength(2);

    const christmas = TimeGuard.from('2026-12-25');
    expect(christmas.isHoliday()).toBe(true);
    expect(christmas.isBusinessDay()).toBe(false);

    TimeGuard.clearHolidays();
    expect(TimeGuard.getRegisteredHolidays()).toHaveLength(0);
    expect(christmas.isHoliday()).toBe(false);
    expect(christmas.isBusinessDay()).toBe(true); // Since Christmas 2026 is Friday
  });

  it('should evaluate isBusinessDay() correctly', () => {
    const monday = TimeGuard.from('2026-05-18');
    const sunday = TimeGuard.from('2026-05-24');

    expect(monday.isBusinessDay()).toBe(true);
    expect(sunday.isBusinessDay()).toBe(false);

    TimeGuard.registerHolidays(['2026-05-18']);
    expect(monday.isBusinessDay()).toBe(false); // Now it is holiday
  });

  it('should add business days correctly', () => {
    // 2026-05-18 is Monday. Add 3 business days -> Thursday 2026-05-21
    const monday = TimeGuard.from('2026-05-18');
    const target = monday.addBusinessDays(3);
    expect(target.format('YYYY-MM-DD')).toBe('2026-05-21');
  });

  it('should skip weekends when adding business days', () => {
    // 2026-05-22 is Friday. Add 2 business days -> Tuesday 2026-05-26
    const friday = TimeGuard.from('2026-05-22');
    const target = friday.addBusinessDays(2);
    expect(target.format('YYYY-MM-DD')).toBe('2026-05-26');
  });

  it('should skip registered holidays when adding business days', () => {
    // 2026-05-22 is Friday. Add 2 business days with Memorial Day on Monday 2026-05-25
    TimeGuard.registerHolidays(['2026-05-25']);
    const friday = TimeGuard.from('2026-05-22');
    const target = friday.addBusinessDays(2);
    expect(target.format('YYYY-MM-DD')).toBe('2026-05-27'); // Wednesday
  });

  it('should subtract business days correctly', () => {
    // 2026-05-26 is Tuesday. Subtract 2 business days -> Friday 2026-05-22
    const tuesday = TimeGuard.from('2026-05-26');
    const target = tuesday.subtractBusinessDays(2);
    expect(target.format('YYYY-MM-DD')).toBe('2026-05-22');
  });
});
