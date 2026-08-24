/**
 * Alternative Calendar Systems
 * Extended calendar support for international use
 */

import type { ICalendarSystem } from '../types';

/**
 * Islamic Calendar (Hijri)
 * @experimental Uses simplified calculations. May not be accurate for all dates.
 */
export class IslamicCalendar implements ICalendarSystem {
  readonly id = 'islamic';
  readonly name = 'Islamic Calendar (Hijri)';
  readonly locale = 'ar';

  private monthNames = [
    'Muharram',
    'Safar',
    'Rabi al-awwal',
    'Rabi al-thani',
    'Jumada al-awwal',
    'Jumada al-thani',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhu al-Qi'dah",
    'Dhu al-Hijjah',
  ];

  getMonthName(month: number): string {
    return this.monthNames[Math.max(0, Math.min(11, month - 1))];
  }

  getWeekdayName(day: number, short: boolean = false): string {
    const weekdays = short
      ? ['Ahd', 'Ith', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']
      : ['Ahad', 'Ithnayn', 'Salasa', 'Rabi', 'Khamis', 'Jumah', 'Sabt'];
    return weekdays[Math.max(0, Math.min(6, day - 1))];
  }

  isLeapYear(year: number): boolean {
    // Islamic leap year: years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 in 30-year cycle
    return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(year % 30);
  }

  daysInMonth(year: number, month: number): number {
    // Islamic months: odd months have 30 days, even months have 29 days
    // except last month which has 30 on leap years
    if (month % 2 === 1) {
      return 30;
    }
    if (month === 12 && this.isLeapYear(year)) {
      return 30;
    }
    return 29;
  }

  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 355 : 354;
  }
}

/**
 * Hebrew Calendar
 * @experimental Uses simplified calculations. May not be accurate for all dates.
 */
export class HebrewCalendar implements ICalendarSystem {
  readonly id = 'hebrew';
  readonly name = 'Hebrew Calendar';
  readonly locale = 'he';

  private monthNames = [
    'Tishrei',
    'Cheshvan',
    'Kislev',
    'Tevet',
    'Shevat',
    'Adar',
    'Nisan',
    'Iyar',
    'Sivan',
    'Tammuz',
    'Av',
    'Elul',
  ];

  getMonthName(month: number): string {
    return this.monthNames[Math.max(0, Math.min(11, month - 1))];
  }

  getWeekdayName(day: number, short: boolean = false): string {
    const weekdays = short
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
    return weekdays[Math.max(0, Math.min(6, day - 1))];
  }

  isLeapYear(year: number): boolean {
    // Hebrew leap year: years 3, 6, 8, 11, 14, 17, 19 in 19-year cycle
    return [3, 6, 8, 11, 14, 17, 19].includes(year % 19);
  }

  daysInMonth(_year: number, month: number): number {
    // Simplified version - actual Hebrew calendar is more complex
    const daysPerMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    return daysPerMonth[Math.max(0, Math.min(11, month - 1))];
  }

  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 384 : 354;
  }
}

/**
 * Chinese Calendar
 * @experimental Uses simplified calculations. May not be accurate for all dates.
 */
export class ChineseCalendar implements ICalendarSystem {
  readonly id = 'chinese';
  readonly name = 'Chinese Calendar';
  readonly locale = 'zh';

  private monthNames = [
    '正月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '冬月',
    '腊月',
  ];

  private terrestrialBranches = [
    '子',
    '丑',
    '寅',
    '卯',
    '辰',
    '巳',
    '午',
    '未',
    '申',
    '酉',
    '戌',
    '亥',
  ];

  getMonthName(month: number): string {
    return this.monthNames[Math.max(0, Math.min(11, month - 1))];
  }

  getWeekdayName(day: number, short: boolean = false): string {
    const weekdays = short
      ? ['日', '一', '二', '三', '四', '五', '六']
      : ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[Math.max(0, Math.min(6, day - 1))];
  }

  isLeapYear(year: number): boolean {
    // Chinese leap year follows a different cycle
    return year % 3 === 0;
  }

  daysInMonth(_year: number, month: number): number {
    return month % 2 === 0 ? 30 : 29;
  }

  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 384 : 354;
  }

  /**
   * Get zodiac sign for year
   */
  getZodiacSign(year: number): string {
    return this.terrestrialBranches[year % 12];
  }
}

/**
 * Japanese Calendar
 * @experimental Uses Gregorian rules post-1873. Historical dates may not be accurate.
 */
export class JapaneseCalendar implements ICalendarSystem {
  readonly id = 'japanese';
  readonly name = 'Japanese Calendar';
  readonly locale = 'ja';

  private monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];

  getMonthName(month: number): string {
    return this.monthNames[Math.max(0, Math.min(11, month - 1))];
  }

  getWeekdayName(day: number, short: boolean = false): string {
    const weekdays = short
      ? ['日', '月', '火', '水', '木', '金', '土']
      : ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
    return weekdays[Math.max(0, Math.min(6, day - 1))];
  }

  isLeapYear(year: number): boolean {
    // Japanese calendar adopted Gregorian calendar in 1873
    // Uses same leap year rules as Gregorian
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  daysInMonth(year: number, month: number): number {
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && this.isLeapYear(year)) {
      return 29;
    }
    return daysPerMonth[Math.max(0, Math.min(11, month - 1))];
  }

  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
}

/**
 * Buddhist Calendar
 * @experimental Uses Gregorian rules with BE year offset (CE + 543).
 */
export class BuddhistCalendar implements ICalendarSystem {
  readonly id = 'buddhist';
  readonly name = 'Buddhist Calendar';
  readonly locale = 'th';

  private monthNames = [
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
  ];

  getMonthName(month: number): string {
    return this.monthNames[Math.max(0, Math.min(11, month - 1))];
  }

  getWeekdayName(day: number): string {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][Math.max(0, Math.min(6, day - 1))];
  }

  isLeapYear(year: number): boolean {
    // Buddhist Era = CE + 543
    const ceYear = year - 543;
    return (ceYear % 4 === 0 && ceYear % 100 !== 0) || ceYear % 400 === 0;
  }

  daysInMonth(year: number, month: number): number {
    // Same as Gregorian
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && this.isLeapYear(year)) {
      return 29;
    }
    return daysPerMonth[Math.max(0, Math.min(11, month - 1))];
  }

  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
}
