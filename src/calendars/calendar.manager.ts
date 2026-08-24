/**
 * Calendar Manager - Support for multiple calendar systems
 * Implements extensible calendar system following SOLID principles
 */

import type { ICalendarSystem, ICalendarManager } from '../types';

/**
 * Gregorian Calendar System (ISO 8601 default)
 */
export class GregorianCalendar implements ICalendarSystem {
  readonly id = 'gregory';
  readonly name = 'Gregorian Calendar';
  readonly locale = 'en';

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

  private monthNamesShort = [
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
  ];

  private weekdayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  private weekdayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  getMonthName(month: number, short: boolean = false): string {
    const names = short ? this.monthNamesShort : this.monthNames;
    return names[Math.max(0, Math.min(11, month - 1))];
  }

  getWeekdayName(day: number, short: boolean = false): string {
    const names = short ? this.weekdayNamesShort : this.weekdayNames;
    return names[Math.max(0, Math.min(6, day - 1))];
  }

  isLeapYear(year: number): boolean {
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
 * Calendar Manager - Singleton for managing calendar systems
 */
export class CalendarManager implements ICalendarManager {
  private static instance: CalendarManager;
  private calendars: Map<string, ICalendarSystem> = new Map();
  private defaultCalendar: string = 'gregory';

  private constructor() {
    // Register default Gregorian calendar
    this.register(new GregorianCalendar());
  }

  /**
   * Get singleton instance
   */
  static getInstance(): CalendarManager {
    if (!CalendarManager.instance) {
      CalendarManager.instance = new CalendarManager();
    }
    return CalendarManager.instance;
  }

  /**
   * Register a new calendar system
   */
  register(calendar: ICalendarSystem): void {
    if (this.calendars.has(calendar.id)) {
      console.warn(
        `Calendar "${calendar.id}" is already registered. Overwriting...`,
      );
    }
    this.calendars.set(calendar.id, calendar);
  }

  /**
   * Get calendar by ID
   */
  get(id: string): ICalendarSystem | undefined {
    return this.calendars.get(id);
  }

  /**
   * List all available calendars
   */
  list(): string[] {
    return Array.from(this.calendars.keys());
  }

  /**
   * Set default calendar
   */
  setDefault(id: string): void {
    if (!this.calendars.has(id)) {
      console.warn(
        `Calendar "${id}" is not registered. Keeping "${this.defaultCalendar}" as default.`,
      );
      return;
    }
    this.defaultCalendar = id;
  }

  /**
   * Get default calendar
   */
  getDefault(): ICalendarSystem {
    const calendar = this.calendars.get(this.defaultCalendar);
    if (!calendar) {
      throw new Error(`Default calendar '${this.defaultCalendar}' not found`);
    }
    return calendar;
  }
}

// Export singleton instance
export const calendarManager = CalendarManager.getInstance();
