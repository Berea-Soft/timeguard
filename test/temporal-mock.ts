/**
 * Temporal API Mock for Testing
 * Enhanced version with proper date arithmetic and calculations
 */

function buildMockTemporal() {
  class Duration {
    years = 0;
    months = 0;
    weeks = 0;
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    microseconds = 0;
    nanoseconds = 0;

    constructor(
      years = 0,
      months = 0,
      weeks = 0,
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0,
      microseconds = 0,
      nanoseconds = 0,
    ) {
      this.years = years;
      this.months = months;
      this.weeks = weeks;
      this.days = days;
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      this.milliseconds = milliseconds;
      this.microseconds = microseconds;
      this.nanoseconds = nanoseconds;
    }

    static from(input: any): Duration {
      if (input instanceof Duration) return input;
      return new Duration(
        input.years || 0,
        input.months || 0,
        input.weeks || 0,
        input.days || 0,
        input.hours || 0,
        input.minutes || 0,
        input.seconds || 0,
        input.milliseconds || 0,
        input.microseconds || 0,
        input.nanoseconds || 0,
      );
    }

    toString(): string {
      let result = 'P';
      if (this.years) result += `${this.years}Y`;
      if (this.months) result += `${this.months}M`;
      if (this.days) result += `${this.days}D`;
      if (this.hours || this.minutes || this.seconds || this.milliseconds) {
        result += 'T';
        if (this.hours) result += `${this.hours}H`;
        if (this.minutes) result += `${this.minutes}M`;
        if (this.seconds || this.milliseconds) {
          const sec =
            this.seconds + (this.milliseconds ? this.milliseconds / 1000 : 0);
          result += `${sec}S`;
        }
      }
      return result || 'PT0S';
    }
  }

  class PlainDateTime {
    dayOfWeek = 0;
    dayOfYear = 0;
    weekOfYear = 0;
    calendarId = 'iso8601';
    microsecond = 0;
    nanosecond = 0;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;

    constructor(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
      millisecond: number,
    ) {
      this.year = year;
      this.month = month;
      this.day = day;
      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.millisecond = millisecond;
      this.updateDerivedFields();
    }

    private updateDerivedFields(): void {
      const date = new Date(this.year, this.month - 1, this.day);
      this.dayOfWeek = date.getDay() || 7;

      const startOfYear = new Date(this.year, 0, 1);
      this.dayOfYear =
        Math.floor(
          (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
        ) + 1;

      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - (date.getDay() || 7) + 1);
      this.weekOfYear =
        Math.ceil(
          (date.getTime() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000),
        ) + 1;
    }

    static from(input: any): PlainDateTime {
      if (input instanceof PlainDateTime) return input;
      if (typeof input === 'string') {
        const match =
          /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?)?/.exec(
            input,
          );
        if (match) {
          return new PlainDateTime(
            parseInt(match[1]),
            parseInt(match[2]),
            parseInt(match[3]),
            match[4] ? parseInt(match[4]) : 0,
            match[5] ? parseInt(match[5]) : 0,
            match[6] ? parseInt(match[6]) : 0,
            match[7] ? parseInt(match[7]) : 0,
          );
        }
      }
      if (input instanceof Date) {
        return new PlainDateTime(
          input.getFullYear(),
          input.getMonth() + 1,
          input.getDate(),
          input.getHours(),
          input.getMinutes(),
          input.getSeconds(),
          input.getMilliseconds(),
        );
      }
      // Handle plain object with date/time properties
      if (typeof input === 'object' && input !== null) {
        return new PlainDateTime(
          input.year || 2000,
          input.month || 1,
          input.day || 1,
          input.hour || 0,
          input.minute || 0,
          input.second || 0,
          input.millisecond || 0,
        );
      }
      return new PlainDateTime(2000, 1, 1, 0, 0, 0, 0);
    }

    add(duration: any): PlainDateTime {
      const d = Duration.from(duration);

      // Start with current date
      let year = this.year;
      let month = this.month;
      let day = this.day;
      let hour = this.hour;
      let minute = this.minute;
      let second = this.second;
      let millisecond = this.millisecond;

      // Add years and months first
      year += d.years || 0;
      month += d.months || 0;

      // Normalize months
      while (month > 12) {
        month -= 12;
        year += 1;
      }
      while (month < 1) {
        month += 12;
        year -= 1;
      }

      // Ensure day is valid for target month
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      if (day > lastDayOfMonth) {
        day = lastDayOfMonth;
      }

      // Now create date and add days/time components
      const result = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        millisecond,
      );

      if (d.days) result.setDate(result.getDate() + d.days);
      if (d.hours) result.setHours(result.getHours() + d.hours);
      if (d.minutes) result.setMinutes(result.getMinutes() + d.minutes);
      if (d.seconds) result.setSeconds(result.getSeconds() + d.seconds);
      if (d.milliseconds)
        result.setMilliseconds(result.getMilliseconds() + d.milliseconds);

      return new PlainDateTime(
        result.getFullYear(),
        result.getMonth() + 1,
        result.getDate(),
        result.getHours(),
        result.getMinutes(),
        result.getSeconds(),
        result.getMilliseconds(),
      );
    }

    subtract(duration: any): PlainDateTime {
      const d = Duration.from(duration);
      return this.add(
        new Duration(
          -(d.years || 0),
          -(d.months || 0),
          -(d.weeks || 0),
          -(d.days || 0),
          -(d.hours || 0),
          -(d.minutes || 0),
          -(d.seconds || 0),
          -(d.milliseconds || 0),
        ),
      );
    }

    compare(other: PlainDateTime): number {
      const t1 = new Date(
        this.year,
        this.month - 1,
        this.day,
        this.hour,
        this.minute,
        this.second,
        this.millisecond,
      ).getTime();
      const t2 = new Date(
        other.year,
        other.month - 1,
        other.day,
        other.hour,
        other.minute,
        other.second,
        other.millisecond,
      ).getTime();
      return t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
    }

    equals(other: PlainDateTime): boolean {
      return this.compare(other) === 0;
    }

    since(other: PlainDateTime): Duration {
      // Calculate years and months
      let years = this.year - other.year;
      let months = this.month - other.month;

      if (this.day < other.day) {
        months--;
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      // For days/time, calculate from same month/year point
      const refDate = new Date(
        other.year,
        other.month - 1,
        other.day,
        other.hour,
        other.minute,
        other.second,
        other.millisecond,
      );
      refDate.setFullYear(refDate.getFullYear() + years);
      refDate.setMonth(refDate.getMonth() + months);

      const thisTime = new Date(
        this.year,
        this.month - 1,
        this.day,
        this.hour,
        this.minute,
        this.second,
        this.millisecond,
      );
      const totalMs = thisTime.getTime() - refDate.getTime();

      // For days, use calendar days (at midnight), not time-aware days
      const thisMidnight = new Date(this.year, this.month - 1, this.day);
      const refMidnight = new Date(
        refDate.getFullYear(),
        refDate.getMonth(),
        refDate.getDate(),
      );
      const dayDiff = Math.floor(
        (thisMidnight.getTime() - refMidnight.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      // For time components, use remainder after subtracting days
      const daysMs = dayDiff * 24 * 60 * 60 * 1000;
      const remainingMs = totalMs - daysMs;

      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainMs2 = remainingMs % (1000 * 60 * 60);
      const minutes = Math.floor(remainMs2 / (1000 * 60));
      const remainMs3 = remainMs2 % (1000 * 60);
      const seconds = Math.floor(remainMs3 / 1000);
      const milliseconds = Math.abs(remainMs3 % 1000);

      return new Duration(
        years,
        months,
        0,
        dayDiff,
        hours,
        minutes,
        seconds,
        milliseconds,
      );
    }

    until(other: PlainDateTime): Duration {
      return other.since(this);
    }

    with(values: any): PlainDateTime {
      return new PlainDateTime(
        values.year ?? this.year,
        values.month ?? this.month,
        values.day ?? this.day,
        values.hour ?? this.hour,
        values.minute ?? this.minute,
        values.second ?? this.second,
        values.millisecond ?? this.millisecond,
      );
    }

    round(options: any): PlainDateTime {
      const { smallestUnit = 'millisecond', roundingMode = 'halfExpand' } =
        options;

      let rounded = new PlainDateTime(
        this.year,
        this.month,
        this.day,
        this.hour,
        this.minute,
        this.second,
        this.millisecond,
      );

      switch (smallestUnit) {
        case 'second':
          rounded.millisecond = 0;
          break;
        case 'minute':
          if (this.second >= 30 && roundingMode === 'ceil') {
            rounded.minute += 1;
          }
          rounded.second = 0;
          rounded.millisecond = 0;
          break;
        case 'hour':
          if (this.minute >= 30 && roundingMode === 'ceil') {
            rounded.hour += 1;
          }
          rounded.minute = 0;
          rounded.second = 0;
          rounded.millisecond = 0;
          break;
        case 'day':
          if (this.hour >= 12 && roundingMode === 'ceil') {
            rounded.day += 1;
          }
          rounded.hour = 0;
          rounded.minute = 0;
          rounded.second = 0;
          rounded.millisecond = 0;
          break;
      }

      // Handle day overflow
      const testDate = new Date(
        rounded.year,
        rounded.month - 1,
        rounded.day,
        rounded.hour,
        rounded.minute,
        rounded.second,
        rounded.millisecond,
      );
      return new PlainDateTime(
        testDate.getFullYear(),
        testDate.getMonth() + 1,
        testDate.getDate(),
        testDate.getHours(),
        testDate.getMinutes(),
        testDate.getSeconds(),
        testDate.getMilliseconds(),
      );
    }

    toZonedDateTime(timezone: string): any {
      const zdt: any = Object.create(Object.getPrototypeOf(this));
      Object.assign(zdt, this);
      zdt.timeZoneId = timezone;
      zdt.offset = '+00:00';
      zdt.offsetNanoseconds = 0;
      return zdt;
    }

    toPlainDate(): any {
      return {
        year: this.year,
        month: this.month,
        day: this.day,
        dayOfWeek: this.dayOfWeek,
      };
    }

    toPlainTime(): any {
      return {
        hour: this.hour,
        minute: this.minute,
        second: this.second,
        millisecond: this.millisecond,
      };
    }

    toString(): string {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${this.year}-${pad(this.month)}-${pad(this.day)}T${pad(this.hour)}:${pad(this.minute)}:${pad(this.second)}.${String(this.millisecond).padStart(3, '0')}`;
    }
  }

  class PlainDate {
    year: number;
    month: number;
    day: number;

    constructor(year: number, month: number, day: number) {
      this.year = year;
      this.month = month;
      this.day = day;
    }

    static from(input: any): PlainDate {
      if (input instanceof PlainDate) return input;
      if (typeof input === 'string') {
        const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
        if (match) {
          return new PlainDate(
            parseInt(match[1]),
            parseInt(match[2]),
            parseInt(match[3]),
          );
        }
      }
      return new PlainDate(2000, 1, 1);
    }

    toPlainDateTime(time?: any): PlainDateTime {
      return new PlainDateTime(
        this.year,
        this.month,
        this.day,
        time?.hour || 0,
        time?.minute || 0,
        time?.second || 0,
        time?.millisecond || 0,
      );
    }

    toString(): string {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${this.year}-${pad(this.month)}-${pad(this.day)}`;
    }
  }

  class Now {
    static instant(): any {
      return { epochNanoseconds: BigInt(Date.now() * 1000000) };
    }

    static plainDateTimeISO(): PlainDateTime {
      const d = new Date();
      return new PlainDateTime(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds(),
      );
    }

    static zonedDateTimeISO(timezone?: string): any {
      const dt = this.plainDateTimeISO();
      return dt.toZonedDateTime(timezone || 'UTC');
    }
  }

  return {
    Duration,
    PlainDateTime,
    PlainDate,
    Now,
    Instant: class Instant {
      epochNanoseconds: bigint;

      constructor(epochNanoseconds: bigint = BigInt(0)) {
        this.epochNanoseconds = epochNanoseconds;
      }

      get epochMilliseconds() {
        return Number(this.epochNanoseconds) / 1000000;
      }

      static from(input: any): any {
        return new Instant(input.epochNanoseconds || BigInt(0));
      }

      static fromEpochMilliseconds(ms: number): any {
        return new Instant(BigInt(ms * 1000000));
      }

      static fromEpochNanoseconds(ns: bigint): any {
        return new Instant(ns);
      }
    },
  };
}

// Install mock if real Temporal is not available
if (!globalThis.Temporal) {
  (globalThis as any).Temporal = buildMockTemporal();
}

export {};
