import { describe, it, expect } from 'vitest';
import { TimeGuard } from '../src/index';

describe('Advanced TimeRange Operations', () => {
  it('should expose start and end boundaries', () => {
    const start = TimeGuard.from('2026-01-01');
    const end = TimeGuard.from('2026-01-10');
    const range = TimeGuard.range(start, end);

    expect(range.start.toISOString()).toBe(start.toISOString());
    expect(range.end.toISOString()).toBe(end.toISOString());
  });

  it('should evaluate contains() correctly', () => {
    const range = TimeGuard.range('2026-01-01', '2026-01-10');

    expect(range.contains('2026-01-05')).toBe(true);
    expect(range.contains('2026-01-01')).toBe(true);
    expect(range.contains('2026-01-10')).toBe(true);
    expect(range.contains('2026-01-11')).toBe(false);
    expect(range.contains('2025-12-31')).toBe(false);
  });

  it('should evaluate contains() correctly for unordered range', () => {
    const range = TimeGuard.range('2026-01-10', '2026-01-01');

    expect(range.contains('2026-01-05')).toBe(true);
    expect(range.contains('2026-01-01')).toBe(true);
    expect(range.contains('2026-01-10')).toBe(true);
    expect(range.contains('2026-01-11')).toBe(false);
  });

  it('should evaluate overlaps() correctly', () => {
    const range1 = TimeGuard.range('2026-01-01', '2026-01-10');
    const range2 = TimeGuard.range('2026-01-05', '2026-01-15');
    const range3 = TimeGuard.range('2026-01-11', '2026-01-20');

    expect(range1.overlaps(range2)).toBe(true);
    expect(range2.overlaps(range1)).toBe(true);
    expect(range1.overlaps(range3)).toBe(false);
    expect(range3.overlaps(range1)).toBe(false);
  });

  it('should calculate intersect() correctly', () => {
    const range1 = TimeGuard.range('2026-01-01', '2026-01-10');
    const range2 = TimeGuard.range('2026-01-05', '2026-01-15');
    const range3 = TimeGuard.range('2026-01-12', '2026-01-20');

    const intersection = range1.intersect(range2);
    expect(intersection).not.toBeNull();
    expect(intersection!.start.format('YYYY-MM-DD')).toBe('2026-01-05');
    expect(intersection!.end.format('YYYY-MM-DD')).toBe('2026-01-10');

    expect(range1.intersect(range3)).toBeNull();
  });

  it('should calculate union() correctly', () => {
    const range1 = TimeGuard.range('2026-01-01', '2026-01-10');
    const range2 = TimeGuard.range('2026-01-05', '2026-01-15');

    const union = range1.union(range2);
    expect(union.start.format('YYYY-MM-DD')).toBe('2026-01-01');
    expect(union.end.format('YYYY-MM-DD')).toBe('2026-01-15');
  });
});
