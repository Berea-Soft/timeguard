import { describe, it, expect } from 'vitest';
import { TimeGuard } from '../src/index';
import { getAvailableLocales } from '../src/locales/index';

describe('African & South American Locales', () => {
  it('should register all 10 new locales', () => {
    const locales = getAvailableLocales();

    // African locales
    expect(locales).toContain('sw');
    expect(locales).toContain('af');
    expect(locales).toContain('zu');
    expect(locales).toContain('am');
    expect(locales).toContain('yo');

    // South American locales
    expect(locales).toContain('es-419');
    expect(locales).toContain('qu');
    expect(locales).toContain('gn');
    expect(locales).toContain('ay');
    expect(locales).toContain('arn');
  });

  it('should format months and weekdays correctly in Swahili (sw)', () => {
    const date = TimeGuard.from('2026-01-04'); // Sunday

    expect(date.locale('sw').format('MMMM')).toBe('Januari');
    expect(date.locale('sw').format('dddd')).toBe('Jumapili');
  });

  it('should format months and weekdays correctly in Afrikaans (af)', () => {
    const date = TimeGuard.from('2026-05-20'); // Wednesday

    expect(date.locale('af').format('MMMM')).toBe('Mei');
    expect(date.locale('af').format('dddd')).toBe('Woensdag');
  });

  it('should format months and weekdays correctly in Zulu (zu)', () => {
    const date = TimeGuard.from('2026-12-25'); // Friday

    expect(date.locale('zu').format('MMMM')).toBe('uZibandlela');
    expect(date.locale('zu').format('dddd')).toBe('uLwesihlanu');
  });

  it('should format months and weekdays correctly in Quechua (qu)', () => {
    const date = TimeGuard.from('2026-06-21'); // Sunday

    expect(date.locale('qu').format('MMMM')).toBe('Inti raymi');
    expect(date.locale('qu').format('dddd')).toBe('Intichaw');
  });

  it('should format months and weekdays correctly in Guarani (gn)', () => {
    const date = TimeGuard.from('2026-01-01'); // Thursday (dayOfWeek=4)

    expect(date.locale('gn').format('MMMM')).toBe('Jasyteĩ');
    expect(date.locale('gn').format('dddd')).toBe('Arapo'); // index 4 = Thursday (Arapo)
  });
});
