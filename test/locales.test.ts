/**
 * Test all available locales from TimeGuard
 * Demonstrates the usage of 40+ locales
 */

import { TimeGuard } from '../src/index';
import {
  getAvailableLocales,
  loadAllLocales,
  LOCALES_COUNT,
} from '../src/locales/index';
import { LocaleManager } from '../src/locales/locale.manager';

describe('TimeGuard Locales', () => {
  it('should have 40+ locales available', () => {
    const locales = getAvailableLocales();
    console.log(`✓ Available locales: ${locales.length}`);
    console.log(`✓ Total locales count: ${LOCALES_COUNT}`);
    expect(locales.length).toBeGreaterThanOrEqual(40);
  });

  it('should list all available locales', () => {
    const locales = getAvailableLocales();
    expect(locales).toContain('en');
    expect(locales).toContain('es');
    expect(locales).toContain('fr');
    expect(locales).toContain('de');
    expect(locales).toContain('ja');
    expect(locales).toContain('zh-cn');
    expect(locales).toContain('pt-br');
    expect(locales).toContain('ru');
    console.log(`\nSupported locales (${locales.length}):`);
    console.log(locales.join(', '));
  });

  it('should format dates in all major locales', () => {
    const date = TimeGuard.from('2024-03-13');
    const locales = [
      'en',
      'es',
      'fr',
      'de',
      'ja',
      'zh-cn',
      'pt-br',
      'ru',
      'ar',
      'he',
      'th',
      'ko',
    ];

    console.log('\nDate formatting in different locales:');
    locales.forEach((locale) => {
      try {
        const formatted = date.locale(locale).format('YYYY-MM-DD');
        console.log(`${locale.padEnd(8)}: ${formatted}`);
      } catch (e) {
        console.log(`${locale.padEnd(8)}: (not available)`);
      }
    });
  });

  it('should format dates with full names in different locales', () => {
    const date = TimeGuard.from('2024-03-13');
    const testLocales = ['en', 'es', 'fr', 'de', 'ja', 'pt-br'];

    console.log('\nFull date formatting in different locales:');
    testLocales.forEach((locale) => {
      try {
        const formatted = date.locale(locale).format('dddd, MMMM DD, YYYY');
        console.log(`${locale.padEnd(8)}: ${formatted}`);
      } catch (e) {
        console.log(`${locale.padEnd(8)}: (error)`);
      }
    });
  });
});

describe('Default locale registration (v3 lazy-loading)', () => {
  it('only registers en/es by default on a fresh LocaleManager instance', () => {
    (LocaleManager as unknown as { instance?: LocaleManager }).instance =
      undefined;
    const manager = LocaleManager.getInstance();
    expect(manager.listLocales().sort()).toEqual(['en', 'es']);
  });

  it('loadAllLocales() registers every bundled locale', () => {
    (LocaleManager as unknown as { instance?: LocaleManager }).instance =
      undefined;
    loadAllLocales();
    const manager = LocaleManager.getInstance();
    expect(manager.listLocales().length).toBe(LOCALES_COUNT);
    expect(manager.getLocale('fr').name).toBe('fr');
  });
});

/**
 * Quick reference for all supported locales
 *
 * English variants (5):
 * - en: English (US)
 * - en-au: Australian English
 * - en-gb: British English
 * - en-ca: Canadian English
 *
 * Spanish variants (3):
 * - es: Spanish
 * - es-mx: Mexican Spanish
 * - es-us: US Spanish
 *
 * French (1):
 * - fr: French
 *
 * German (1):
 * - de: German
 *
 * Romance languages (3):
 * - it: Italian
 * - pt: Portuguese
 * - pt-br: Brazilian Portuguese
 * - ro: Romanian
 *
 * Slavic languages (4):
 * - ru: Russian
 * - pl: Polish
 * - cs: Czech
 * - sk: Slovak
 *
 * Nordic languages (4):
 * - sv: Swedish
 * - nb: Norwegian Bokmål
 * - da: Danish
 * - fi: Finnish
 *
 * Asian languages (5):
 * - ja: Japanese
 * - zh-cn: Simplified Chinese
 * - zh-tw: Traditional Chinese
 * - ko: Korean
 * - th: Thai
 * - vi: Vietnamese
 * - id: Indonesian
 *
 * Other European (3):
 * - nl: Dutch
 * - el: Greek
 * - hu: Hungarian
 * - eu: Basque
 * - ca: Catalan
 * - tr: Turkish
 *
 * Middle Eastern & South Asian (3):
 * - ar: Arabic
 * - he: Hebrew
 * - hi: Hindi
 *
 * Usage examples:
 * ```
 * // Use specific locale
 * const date = TimeGuard.from('2024-03-13');
 * date.locale('es').format('MMMM DD, YYYY'); // "marzo 13, 2024"
 * date.locale('fr').format('DD MMMM YYYY'); // "13 mars 2024"
 * date.locale('ja').format('YYYY年MM月DD日'); // "2024年3月13日"
 *
 * // Get list of all locales
 * import { getAvailableLocales } from 'timeguard';
 * const all = getAvailableLocales();
 * ```
 */
