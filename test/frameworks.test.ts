import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import * as Vue from 'vue';
import { ChangeDetectorRef, inject as angularInject } from '@angular/core';

// Mock React with a fully functional Context Provider simulation
vi.mock('react', () => {
  const useState = vi.fn((init) => {
    const val = typeof init === 'function' ? init() : init;
    const setVal = vi.fn();
    return [val, setVal];
  });
  const useEffect = vi.fn((effect) => {
    const cleanup = effect();
    if (typeof cleanup === 'function') {
      cleanup();
    }
  });
  const createContext = vi.fn((init) => {
    const ctx = {
      Provider: ({ value, children }: any) => {
        ctx._currentValue = value;
        return children;
      },
      _currentValue: init,
    };
    return ctx;
  });
  const useContext = vi.fn((ctx) => {
    return ctx._currentValue;
  });
  const createElement = vi.fn((type: any, props: any, ...children: any[]) => {
    if (type && type.Provider) {
      type.Provider({ value: props?.value, children });
    }
    return { type, props, children };
  });

  return {
    useState,
    useEffect,
    createContext,
    useContext,
    createElement,
    default: { createElement },
  };
});

// Mock Vue with full configuration injection tracking
vi.mock('vue', () => {
  const ref = vi.fn((init) => {
    return {
      value: init,
    };
  });
  const watch = vi.fn((_deps, cb) => {
    cb();
  });
  const onUnmounted = vi.fn((cb) => {
    cb();
  });
  let injectedConfig: any = undefined;
  const inject = vi.fn((_key, def) => {
    return injectedConfig !== undefined ? injectedConfig : def;
  });
  const provide = vi.fn((_key, val) => {
    injectedConfig = val;
  });
  return { ref, watch, onUnmounted, inject, provide };
});

vi.mock('@angular/core', () => {
  return {
    Pipe: () => () => {},
    Injectable: () => () => {},
    InjectionToken: class {
      constructor(public desc: string) {}
    },
    inject: vi.fn(),
    NgZone: class {
      runOutsideAngular(fn: () => any) {
        return fn();
      }
      run(fn: () => any) {
        return fn();
      }
    },
    ChangeDetectorRef: class {
      markForCheck() {}
    },
  };
});

import {
  useRelativeTime as useReactRelativeTime,
  useTimeRange as useReactTimeRange,
  TimeGuardProvider,
} from '../src/react';
import {
  useRelativeTime as useVueRelativeTime,
  vTimeGuard,
  TimeGuardVuePlugin,
} from '../src/vue';
import {
  TimeGuardFormatPipe,
  TimeGuardRelativePipe,
  TimeGuardService,
  TimeGuardLiveFormatPipe,
} from '../src/angular';
import { TimeGuard, TimeRange } from '../src/core';

describe('Premium Framework Integration Enhancements', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-21T12:30:30Z'));
    // TimeGuard.now() usa Temporal.Now que NO respeta vi.useFakeTimers()
    // Mock para que devuelva la misma fecha fija en todos los tests
    vi.spyOn(TimeGuard, 'now').mockReturnValue(
      TimeGuard.from('2026-05-21T12:30:30'),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('React Enhancements', () => {
    it('TimeGuardProvider should populate Context and hooks should inherit values', () => {
      // Setup global configuration context
      TimeGuardProvider({
        config: { locale: 'es' },
        children: null,
      });

      // Hook should inherit locale 'es' from Context
      const relative = useReactRelativeTime(
        TimeGuard.from('2026-05-21T10:30:30'),
      );
      expect(typeof relative).toBe('string');
      expect(React.useState).toHaveBeenCalled();
      expect(React.useEffect).toHaveBeenCalled();
    });

    it('useTimeRange should create a reactive TimeRange instance', () => {
      const start = '2026-05-18T10:00:00';
      const end = '2026-05-18T12:00:00';
      const range = useReactTimeRange(start, end);

      expect(range).toBeInstanceOf(TimeRange);
      expect(range.start.toISOString()).toBe('2026-05-18T10:00:00.000Z');
      expect(range.end.toISOString()).toBe('2026-05-18T12:00:00.000Z');
      expect(React.useState).toHaveBeenCalled();
      expect(React.useEffect).toHaveBeenCalled();
    });
  });

  describe('Vue Enhancements', () => {
    it('TimeGuardVuePlugin and Injection fallback should function correctly', () => {
      const mockApp = {
        provide: vi.fn((key, val) => {
          (Vue.provide as any)(key, val);
        }),
        directive: vi.fn(),
      } as any;

      TimeGuardVuePlugin.install(mockApp, { locale: 'es' });

      expect(mockApp.provide).toHaveBeenCalled();
      expect(mockApp.directive).toHaveBeenCalledWith('timeguard', vTimeGuard);

      const relativeRef = useVueRelativeTime(
        TimeGuard.from('2026-05-21T12:00:00'),
        { locale: 'es' },
      );
      expect(typeof relativeRef.value).toBe('string');
    });

    it('vTimeGuard directive should format element contents reactively', () => {
      const mockElement = {
        textContent: '',
        getAttribute: vi.fn((name) => {
          if (name === 'data-pattern') return 'YYYY-MM-DD';
          if (name === 'data-locale') return 'es';
          return null;
        }),
      } as unknown as HTMLElement;

      const mockBinding = {
        value: '2026-05-18T10:30:00',
        arg: 'format',
      };

      vTimeGuard.mounted!(
        mockElement,
        mockBinding as any,
        null as any,
        null as any,
      );
      expect(mockElement.textContent).toBe('2026-05-18');
    });
  });

  describe('Angular Enhancements', () => {
    beforeEach(() => {
      vi.mocked(angularInject).mockReset();
    });

    it('Pipes and Services should support Injection Tokens via DI constructor', () => {
      const globalConfig = { locale: 'es' };

      // inject() is called once for each class: formatPipe gets config, relativePipe gets config
      vi.mocked(angularInject).mockReturnValue(globalConfig);

      const formatPipe = new TimeGuardFormatPipe();
      const relativePipe = new TimeGuardRelativePipe();

      const formatted = formatPipe.transform(
        '2026-05-18T10:30:00',
        'dddd, DD MMMM YYYY',
      );
      const relative = relativePipe.transform(
        TimeGuard.from('2026-05-21T11:45:00'),
      );

      expect(formatted).toBe('Lunes, 18 Mayo 2026');
      expect(typeof relative).toBe('string');
    });

    it('TimeGuardLiveFormatPipe should dynamically tick and update current time format', () => {
      const mockCdr = {
        markForCheck: vi.fn(),
      } as unknown as ChangeDetectorRef;

      const mockNgZoneInstance = {
        runOutsideAngular: vi.fn((fn: () => any) => fn()),
        run: vi.fn((fn: () => any) => fn()),
      };

      // inject() call order: NgZone, config, Cdr, TimeGuardService, config (5 calls)
      vi.mocked(angularInject)
        .mockReturnValueOnce(mockNgZoneInstance) // NgZone for TimeGuardService
        .mockReturnValueOnce({ locale: 'es' }) // config for TimeGuardService
        .mockReturnValueOnce(mockCdr) // ChangeDetectorRef for LiveFormatPipe
        .mockReturnValueOnce(new TimeGuardService()) // TimeGuardService for LiveFormatPipe
        .mockReturnValueOnce({ locale: 'es' }); // config for LiveFormatPipe

      const livePipe = new TimeGuardLiveFormatPipe();

      // Connect ticking relative clock
      const clockStr = livePipe.transform('now', 'HH:mm:ss', 1000);
      expect(clockStr).toBeDefined();
      expect(mockCdr.markForCheck).toHaveBeenCalled();

      // Tick fake time
      vi.advanceTimersByTime(1000);
      expect(mockCdr.markForCheck).toHaveBeenCalledTimes(2);

      livePipe.ngOnDestroy();
    });
  });
});
