/**
 * Date Formatter - Strategy Pattern for formatting
 * Single Responsibility: Handle all date formatting operations
 */

import type { IDateFormatter, FormatPreset } from '../types';
import { LocaleManager } from '../locales/locale.manager';

/**
 * Date Formatter implementation
 */
export class DateFormatter implements IDateFormatter {
  private localeManager: LocaleManager;

  constructor() {
    this.localeManager = LocaleManager.getInstance();
  }

  /**
   * Format date with pattern and locale
   */
  format(
    date: Temporal.PlainDateTime,
    pattern: string,
    locale?: string,
  ): string {
    const localeData = this.localeManager.getLocale(locale);

    // First, protect escaped text in brackets
    const escapedParts: string[] = [];
    let escapedPattern = pattern.replace(
      /\[([^\[\]]*)\]/g,
      (_match, content) => {
        escapedParts.push(content);
        return `~${escapedParts.length - 1}~`;
      },
    );

    // Protect quoted text by escaping quotes
    escapedPattern = escapedPattern.replace(
      /"([^"\\]*(?:\\.[^"\\]*)*)"/g,
      (_match, content) => {
        escapedParts.push(content);
        return `~${escapedParts.length - 1}~`;
      },
    );

    // Then apply token replacements
    const formatted = escapedPattern.replace(
      /Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|SSS/g,
      (match) => {
        switch (match) {
          case 'YYYY':
            return String(date.year).padStart(4, '0');
          case 'YY':
            return String(date.year).slice(-2);
          case 'Y':
            return String(date.year);
          case 'MMMM':
            return localeData.months[date.month - 1];
          case 'MMM':
            return localeData.monthsShort[date.month - 1];
          case 'MM':
            return String(date.month).padStart(2, '0');
          case 'M':
            return String(date.month);
          case 'DD':
            return String(date.day).padStart(2, '0');
          case 'D':
            return String(date.day);
          case 'dddd':
            return localeData.weekdays[date.dayOfWeek % 7];
          case 'ddd':
            return localeData.weekdaysShort[date.dayOfWeek % 7];
          case 'dd':
            return localeData.weekdaysMin[date.dayOfWeek % 7];
          case 'd':
            return String(date.dayOfWeek);
          case 'HH':
            return String(date.hour).padStart(2, '0');
          case 'H':
            return String(date.hour);
          case 'hh':
            return String(date.hour % 12 || 12).padStart(2, '0');
          case 'h':
            return String(date.hour % 12 || 12);
          case 'mm':
            return String(date.minute).padStart(2, '0');
          case 'm':
            return String(date.minute);
          case 'ss':
            return String(date.second).padStart(2, '0');
          case 's':
            return String(date.second);
          case 'SSS':
            return String(date.millisecond).padStart(3, '0');
          case 'a':
          case 'A':
            const meridiem = localeData.meridiem || { am: 'am', pm: 'pm' };
            const isPM = date.hour >= 12;
            const value = isPM ? meridiem.pm : meridiem.am;
            return match === 'a' ? value.toLowerCase() : value.toUpperCase();
          default:
            return match;
        }
      },
    );

    // Finally, restore escaped parts
    let result = formatted;
    escapedParts.forEach((content, index) => {
      result = result.replace(`~${index}~`, content);
    });

    return result;
  }

  /**
   * Get format pattern for preset
   */
  getPreset(preset: FormatPreset): string {
    const presets: Record<FormatPreset, string> = {
      iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
      date: 'YYYY-MM-DD',
      time: 'HH:mm:ss',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      rfc2822: 'ddd, DD MMM YYYY HH:mm:ss Z',
      rfc3339: 'YYYY-MM-DDTHH:mm:ssZ',
      utc: 'YYYY-MM-DDTHH:mm:ss[Z]',
    };

    return presets[preset] || presets.iso;
  }

  /**
   * Format with preset
   */
  formatPreset(
    date: Temporal.PlainDateTime,
    preset: FormatPreset,
    locale?: string,
  ): string {
    const pattern = this.getPreset(preset);
    return this.format(date, pattern, locale);
  }
}
