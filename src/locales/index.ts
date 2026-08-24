/**
 * Locale Registry - Index of all available locales
 * This file aggregates all locale data from separate modules
 */

import type { ILocale } from '../types';
import { LocaleManager } from './locale.manager';
import { ENGLISH_LOCALES } from './english.locale';
import { SPANISH_LOCALES } from './spanish.locale';
import { ROMANCE_LOCALES } from './romance.locale';
import { SLAVIC_LOCALES } from './slavic.locale';
import { NORDIC_LOCALES } from './nordic.locale';
import { ASIAN_LOCALES } from './asian.locale';
import { EUROPEAN_LOCALES } from './european.locale';
import { MIDDLE_EASTERN_LOCALES } from './middle-eastern.locale';
import { ADDITIONAL_LOCALES } from './additional.locale';
import { AFRICAN_LOCALES } from './african.locale';
import { SOUTH_AMERICAN_LOCALES } from './south-american.locale';

/**
 * Aggregated locale data from all modules
 */
export const ALL_LOCALES: Record<string, ILocale> = {
  ...ENGLISH_LOCALES,
  ...SPANISH_LOCALES,
  ...ROMANCE_LOCALES,
  ...SLAVIC_LOCALES,
  ...NORDIC_LOCALES,
  ...ASIAN_LOCALES,
  ...EUROPEAN_LOCALES,
  ...MIDDLE_EASTERN_LOCALES,
  ...ADDITIONAL_LOCALES,
  ...AFRICAN_LOCALES,
  ...SOUTH_AMERICAN_LOCALES,
};

/**
 * Register all locales into a locale map
 */
export function registerAllLocales(
  localeMap: Map<string, ILocale> | Record<string, ILocale>,
): void {
  if (localeMap instanceof Map) {
    Object.entries(ALL_LOCALES).forEach(([code, data]) => {
      localeMap.set(code, data);
    });
  } else {
    Object.entries(ALL_LOCALES).forEach(([code, data]) => {
      localeMap[code] = data;
    });
  }
}

/**
 * Registers every bundled locale into the global `LocaleManager`.
 * Since v3, the main entry only registers `en`/`es` by default to keep the
 * import lightweight — call this once (or import `./locales` for a
 * standalone lazy-loadable entry) to restore the old "all locales" behavior.
 *
 * @example
 * import { loadAllLocales } from '@bereasoftware/timeguard';
 * loadAllLocales();
 */
export function loadAllLocales(): void {
  LocaleManager.getInstance().loadLocales(ALL_LOCALES);
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): string[] {
  return Object.keys(ALL_LOCALES);
}

/**
 * Total locales count
 */
export const LOCALES_COUNT = Object.keys(ALL_LOCALES).length;
