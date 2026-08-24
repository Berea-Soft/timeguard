/**
 * TimeGuard Advanced Format Plugin
 * Adds advanced format tokens: Q (quarter), Do (ordinal), w (week), etc.
 * Follows SOLID principles and extends core formatting capabilities
 */

import type { ITimeGuardPlugin } from '../../types';
import type { TimeGuard } from '../../index';

export class AdvancedFormatPlugin implements ITimeGuardPlugin {
  name = 'advanced-format';
  version = '1.0.0';

  // Keyed by class (not just one field) in case this plugin instance is
  // ever installed on more than one TimeGuard-like class — each install()
  // call must restore exactly the format() it wrapped, not some other
  // class's.
  private originalFormats = new WeakMap<
    typeof TimeGuard,
    typeof TimeGuard.prototype.format
  >();

  /**
   * Install plugin into TimeGuard
   */
  install(TimeGuardClass: typeof TimeGuard): void {
    // Store original format method so uninstall() can restore it — this
    // is what makes clear() + re-registering safe instead of stacking a
    // new wrapper on top of this one.
    const originalFormat = TimeGuardClass.prototype.format;
    this.originalFormats.set(TimeGuardClass, originalFormat);

    (
      TimeGuardClass.prototype as unknown as {
        format: (pattern: string) => string;
      }
    ).format = function (pattern: string) {
      if (!pattern || typeof pattern !== 'string') {
        return originalFormat.call(this, pattern);
      }

      // Protect literal [...]/"..." text before scanning for advanced
      // tokens — otherwise a token letter that merely appears inside a
      // user's escaped literal (e.g. the "k" in "[Asia/Tokyo]") gets
      // replaced too, corrupting text the user asked to keep verbatim.
      // Mirrors DateFormatter's own escape handling so the two stay
      // consistent instead of fighting over the same bracket syntax.
      const escapedAdvancedParts: string[] = [];
      const protectedPattern = pattern.replace(
        /\[([^[\]]*)\]|"([^"\\]*(?:\\.[^"\\]*)*)"/g,
        (match) => {
          escapedAdvancedParts.push(match);
          return `\u0000${escapedAdvancedParts.length - 1}\u0000`;
        },
      );

      if (!/Q|Do|w|W|gggg|GGGG|k{1,2}|X|x|zzz|z/.test(protectedPattern)) {
        return originalFormat.call(this, pattern);
      }

      const temporal = (
        this as unknown as {
          toTemporal(): Temporal.PlainDateTime | Temporal.ZonedDateTime;
        }
      ).toTemporal();
      const temporal_dt =
        'toPlainDateTime' in temporal
          ? (temporal as Temporal.ZonedDateTime).toPlainDateTime()
          : (temporal as Temporal.PlainDateTime);

      const ordinalFn = (n: number) => {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
      };
      const padFn = (n: number, length: number) =>
        String(n).padStart(length, '0');
      const getISOWeek = (temporal: Temporal.PlainDateTime) => {
        const jan4 = new Date(temporal.year, 0, 4);
        const week1Start = new Date(jan4);
        week1Start.setDate(
          jan4.getDate() - jan4.getDay() + (jan4.getDay() === 0 ? -6 : 1),
        );
        const currentDate = new Date(
          temporal.year,
          temporal.month - 1,
          temporal.day,
        );
        const weekNum =
          Math.floor(
            (currentDate.getTime() - week1Start.getTime()) /
              (7 * 24 * 60 * 60 * 1000),
          ) + 1;
        return Math.max(1, weekNum);
      };
      const getWeekOfYear = (temporal: Temporal.PlainDateTime) => {
        const weekNum = Math.ceil(
          (temporal.day +
            new Date(temporal.year, temporal.month - 1, 1).getDay()) /
            7,
        );
        return Math.max(1, weekNum);
      };
      const getISOWeekYear = (temporal: Temporal.PlainDateTime) => {
        const currentDate = new Date(
          temporal.year,
          temporal.month - 1,
          temporal.day,
        );
        const yearAdjust =
          currentDate.getTime() < new Date(temporal.year, 0, 1).getTime()
            ? -1
            : currentDate.getTime() >=
                new Date(temporal.year + 1, 0, 1).getTime()
              ? 1
              : 0;
        return temporal.year + yearAdjust;
      };
      const getWeekYear = (temporal: Temporal.PlainDateTime) => {
        const yearAdjust =
          temporal.month === 1 && temporal.day < 4
            ? -1
            : temporal.month === 12 && temporal.day > 28
              ? 1
              : 0;
        return temporal.year + yearAdjust;
      };

      // Replace advanced tokens - wrap results in brackets to protect from standard formatter
      const result = protectedPattern.replace(
        /Q|Do|w|W|gggg|GGGG|k{1,2}|X|x|zzz|z/g,
        (match) => {
          let replacement = '';
          switch (match) {
            // Quarter
            case 'Q':
              replacement = String(Math.ceil(temporal_dt.month / 3));
              break;

            // Ordinal day
            case 'Do':
              replacement = ordinalFn(temporal_dt.day);
              break;

            // Week of year (ISO)
            case 'W':
            case 'WW':
              replacement = padFn(
                getISOWeek(temporal_dt),
                match === 'W' ? 1 : 2,
              );
              break;

            // Week of year (locale)
            case 'w':
            case 'ww':
              replacement = padFn(
                getWeekOfYear(temporal_dt),
                match === 'w' ? 1 : 2,
              );
              break;

            // ISO week year
            case 'GGGG':
              replacement = String(getISOWeekYear(temporal_dt));
              break;

            // Week year
            case 'gggg':
              replacement = String(getWeekYear(temporal_dt));
              break;

            // Hour (1-24)
            case 'k':
            case 'kk':
              const hour = temporal_dt.hour === 0 ? 24 : temporal_dt.hour;
              replacement = padFn(hour, match === 'k' ? 1 : 2);
              break;

            // Unix seconds timestamp
            case 'X':
              replacement = String(
                Math.floor(
                  (this as unknown as { valueOf(): number }).valueOf() / 1000,
                ),
              );
              break;

            case 'x':
              replacement = String(
                (this as unknown as { valueOf(): number }).valueOf(),
              );
              break;

            // Offset, e.g. "+09:00"
            case 'z':
              replacement = (
                this as unknown as { getOffset(): string }
              ).getOffset();
              break;

            // IANA zone id, e.g. "Asia/Tokyo" (empty if the instance has no
            // zone attached — it's a PlainDateTime, not a ZonedDateTime)
            case 'zzz':
              replacement =
                (
                  this as unknown as { getTimeZoneId(): string | null }
                ).getTimeZoneId() ?? '';
              break;

            default:
              return match;
          }
          // Wrap in brackets to protect from standard formatter
          return `[${replacement}]`;
        },
      );

      // Restore the protected literal text now that token scanning is done
      let restored = result;
      escapedAdvancedParts.forEach((original, index) => {
        restored = restored.replace(`\u0000${index}\u0000`, original);
      });

      // Apply standard format to the result
      return originalFormat.call(this, restored);
    };
  }

  /**
   * Reverse install() — restores format() to exactly what it was before
   * this plugin wrapped it, instead of leaving the wrapper in place
   * (which is what caused re-registration after clear() to stack a
   * second wrapper on top of the first).
   */
  uninstall(TimeGuardClass: typeof TimeGuard): void {
    const original = this.originalFormats.get(TimeGuardClass);
    if (original) {
      TimeGuardClass.prototype.format = original;
      this.originalFormats.delete(TimeGuardClass);
    }
  }
}

/**
 * Create and export default instance
 */
export default new AdvancedFormatPlugin();
