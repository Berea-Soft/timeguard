/**
 * Locale Manager - Handle locale data and operations
 * Single Responsibility: Manage all locale-related operations
 */

import type { ILocale, ILocaleManager } from '../types';

/**
 * English locale data
 */
export const EN_LOCALE: ILocale = {
  name: 'en',
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthsShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  weekdays: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  meridiem: { am: 'AM', pm: 'PM' },
  formats: {
    iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    date: 'YYYY-MM-DD',
    time: 'HH:mm:ss',
    datetime: 'YYYY-MM-DD HH:mm:ss',
    rfc2822: 'ddd, DD MMM YYYY HH:mm:ss Z',
  },
};

/**
 * Spanish locale data (sample for i18n support)
 */
export const ES_LOCALE: ILocale = {
  name: 'es',
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthsShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  weekdays: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  weekdaysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  meridiem: { am: 'AM', pm: 'PM' },
  formats: {
    iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    date: 'DD/MM/YYYY',
    time: 'HH:mm:ss',
    datetime: 'DD/MM/YYYY HH:mm:ss',
    rfc2822: 'ddd, DD MMM YYYY HH:mm:ss Z',
  },
};

/**
 * Locale Manager - implements ILocaleManager
 */
export class LocaleManager implements ILocaleManager {
  private static instance: LocaleManager;
  private locales: Map<string, ILocale> = new Map();
  private currentLocale: string = 'en';

  /**
   * Singleton pattern
   */
  static getInstance(): LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  private constructor() {
    // Register only English by default (minimal core, like dayjs)
    this.locales.set('en', EN_LOCALE);
    this.locales.set('es', ES_LOCALE);
  }

  /**
   * Set or register a locale
   */
  setLocale(locale: string, data?: ILocale): void {
    if (data) {
      this.locales.set(locale.toLowerCase(), data);
    }
    this.currentLocale = locale.toLowerCase();
  }

  /**
   * Get locale information
   */
  getLocale(locale?: string): ILocale {
    const target = (locale || this.currentLocale).toLowerCase();
    const result = this.locales.get(target);

    if (!result) {
      console.warn(
        `Locale "${target}" is not registered. Falling back to "en".`,
      );
      return this.locales.get('en') || EN_LOCALE;
    }

    return result;
  }

  /**
   * List all registered locales
   */
  listLocales(): string[] {
    return Array.from(this.locales.keys());
  }

  /**
   * Get current locale
   */
  getCurrentLocale(): string {
    return this.currentLocale;
  }

  /**
   * Load multiple locales
   */
  loadLocales(locales: Record<string, ILocale>): void {
    Object.entries(locales).forEach(([name, data]) => {
      this.locales.set(name.toLowerCase(), data);
    });
  }
}
