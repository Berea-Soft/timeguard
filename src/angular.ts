import {
  Pipe,
  type PipeTransform,
  Injectable,
  NgZone,
  InjectionToken,
  inject,
  type OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, type Subscription, shareReplay } from 'rxjs';
import { TimeGuard, type FormatPreset, type ITimeGuardConfig } from './core';

/**
 * Angular Injection Token to register global/default TimeGuard configurations.
 */
export const TIME_GUARD_CONFIG = new InjectionToken<ITimeGuardConfig>(
  'TIME_GUARD_CONFIG',
);

/**
 * Angular Pipe to format a date/time using TimeGuard.
 * Supports global configuration overrides via DI.
 * Usage: `{{ date | timeGuardFormat:'YYYY-MM-DD':'es' }}`
 */
export class TimeGuardFormatPipe implements PipeTransform {
  private globalConfig = inject<ITimeGuardConfig>(TIME_GUARD_CONFIG, {
    optional: true,
  });

  transform(
    value: unknown,
    pattern: string | FormatPreset = 'YYYY-MM-DD HH:mm:ss',
    locale?: string,
  ): string {
    if (!value) {
      return '';
    }
    try {
      const tg = TimeGuard.from(value);
      const activeLocale = locale || this.globalConfig?.locale;
      if (activeLocale) {
        return tg.locale(activeLocale).format(pattern);
      }
      return tg.format(pattern);
    } catch {
      return String(value);
    }
  }
}

/**
 * Angular Pipe for dynamic relative time humanization.
 * Supports global configuration overrides via DI.
 * Usage: `{{ date | timeGuardRelative:'es':'auto' }}`
 */
export class TimeGuardRelativePipe implements PipeTransform {
  private globalConfig = inject<ITimeGuardConfig>(TIME_GUARD_CONFIG, {
    optional: true,
  });

  transform(
    value: unknown,
    locale?: string,
    numeric?: 'always' | 'auto',
  ): string {
    if (!value) {
      return '';
    }
    try {
      const tg = TimeGuard.from(value);
      const now = TimeGuard.now();
      const activeLocale = locale || this.globalConfig?.locale;
      return tg.since(now).humanize({ locale: activeLocale, numeric });
    } catch {
      return String(value);
    }
  }
}

/**
 * Injectable Service to interact with TimeGuard.
 * Provides a high-performance reactive Observable of the current time
 * running outside Angular zone to optimize change detection ticks.
 * Supports global configuration overrides via DI.
 */
export class TimeGuardService {
  private ngZone = inject(NgZone);
  private globalConfig = inject<ITimeGuardConfig>(TIME_GUARD_CONFIG, {
    optional: true,
  });

  /**
   * Get an Observable of the current time, ticking on the specified interval.
   */
  getCurrentTime(
    intervalMs: number = 1000,
    config?: ITimeGuardConfig,
  ): Observable<TimeGuard> {
    // inject() returns T | null with optional:true; normalize to undefined
    const activeConfig = config ?? this.globalConfig ?? undefined;
    return new Observable<TimeGuard>((subscriber) => {
      // Run outside Angular's zone to prevent change detection triggering on every tick
      return this.ngZone.runOutsideAngular(() => {
        subscriber.next(TimeGuard.now(activeConfig));

        const intervalId = setInterval(() => {
          this.ngZone.run(() => {
            subscriber.next(TimeGuard.now(activeConfig));
          });
        }, intervalMs);

        return () => {
          clearInterval(intervalId);
        };
      });
    }).pipe(shareReplay(1));
  }
}

/**
 * Angular Pipe to dynamically tick and format dates at a custom interval.
 * Highly optimized, impure pipe utilizing TimeGuardService and ChangeDetectorRef.
 * Usage:
 * - Real-time clock: `{{ 'now' | timeGuardLiveFormat:'HH:mm:ss':1000 }}`
 * - Ticking static date: `{{ date | timeGuardLiveFormat:'YYYY-MM-DD HH:mm:ss':5000 }}`
 */
@Pipe({
  name: 'timeGuardLiveFormat',
  pure: false,
})
export class TimeGuardLiveFormatPipe implements PipeTransform, OnDestroy {
  private latestValue: string = '';
  private subscription?: Subscription;
  private lastInput?: unknown;
  private lastPattern?: string | FormatPreset;
  private lastInterval?: number;
  private lastLocale?: string;

  private cdr = inject(ChangeDetectorRef);
  private timeGuardService = inject(TimeGuardService);
  private globalConfig = inject<ITimeGuardConfig>(TIME_GUARD_CONFIG, {
    optional: true,
  });

  transform(
    value: unknown,
    pattern: string | FormatPreset = 'YYYY-MM-DD HH:mm:ss',
    intervalMs: number = 1000,
    locale?: string,
  ): string {
    if (!value) {
      return '';
    }

    // Recreate subscription if parameters change
    if (
      value !== this.lastInput ||
      pattern !== this.lastPattern ||
      intervalMs !== this.lastInterval ||
      locale !== this.lastLocale
    ) {
      this.ngOnDestroy();
      this.lastInput = value;
      this.lastPattern = pattern;
      this.lastInterval = intervalMs;
      this.lastLocale = locale;

      const activeLocale = locale || this.globalConfig?.locale;

      if (value === 'now') {
        this.subscription = this.timeGuardService
          .getCurrentTime(intervalMs)
          .subscribe((now) => {
            this.latestValue = activeLocale
              ? now.locale(activeLocale).format(pattern)
              : now.format(pattern);
            this.cdr.markForCheck();
          });
      } else {
        // Ticking format updates for a static date (handles locale/config changes safely)
        this.subscription = this.timeGuardService
          .getCurrentTime(intervalMs)
          .subscribe(() => {
            try {
              const tg = TimeGuard.from(value);
              this.latestValue = activeLocale
                ? tg.locale(activeLocale).format(pattern)
                : tg.format(pattern);
              this.cdr.markForCheck();
            } catch {
              this.latestValue = String(value);
            }
          });
      }
    }

    return this.latestValue;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}

// ── Apply Angular decorators (function-call pattern for Rolldown compatibility) ──
// Note: inject() replaces @Inject/@Optional parameter decorators entirely.

Pipe({
  name: 'timeGuardFormat',
  pure: true,
})(TimeGuardFormatPipe);

Pipe({
  name: 'timeGuardRelative',
  pure: false,
})(TimeGuardRelativePipe);

Injectable({
  providedIn: 'root',
})(TimeGuardService);

Pipe({
  name: 'timeGuardLiveFormat',
  pure: false,
})(TimeGuardLiveFormatPipe);
