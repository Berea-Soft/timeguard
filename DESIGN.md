# DESIGN

Overview of the library architecture and design decisions.

## Design Philosophy

### 1. Temporal-First
TimeGuard is built from the ground up to be a wrapper around the **native Temporal API**. This package (`@bereasoftware/timeguard`) assumes the runtime already exposes `Temporal` — see the sibling package `@bereasoftware/time-guard` if you need the polyfill auto-loaded instead.
- **Immutability**: All operations return a new instance.
- **Precision**: Support for nanoseconds and precise durations.
- **Timezones**: First-class support for IANA timezones without external data files (using Intl).

### 2. Lightweight Core vs. Plugins
To keep the bundle size small for simple use cases, TimeGuard follows a "Pay for what you use" model:
- **Core**: Contains only essential arithmetic, parsing, and formatting.
- **Plugins**: Advanced features like `RelativeTime`, `Duration` objects, and `AdvancedFormat` are opt-in.
- **Bundles**: Multiple build targets (`lite`, `full`, `umd`) provide flexibility for different environments.

### 3. Developer Experience (DX)
The API is designed to be familiar to users of Moment.js or Day.js, easing the transition to modern Temporal-based logic.
- **Fluent API**: Chainable methods for manipulation.
- **Explainable Math**: The `explain()` method in durations provides transparency for debugging.

## Architectural Patterns

### Facade Pattern
The `TimeGuard` class acts as a facade, providing a unified interface to the underlying adapters, formatters, and managers.

### Adapter Pattern
The `TemporalAdapter` abstracts the interaction with the Temporal API — it only ever reads `globalThis.Temporal`, never imports or loads one itself, so this package works unchanged whether that global comes from the runtime natively or from a polyfill the consumer assigned themselves.

### Strategy Pattern
Parsing and formatting logic are implemented as strategies, allowing for different implementations (e.g., custom parsers) to be plugged in.

### Plugin Manager
A central `PluginManager` handles the lifecycle of plugins, ensuring they are correctly installed onto the `TimeGuard` prototype.

## High-level components
- **Core**: `src/index.ts` — Main class and entry point.
- **Adapters**: `src/adapters/temporal.adapter.ts` — Bridge to Temporal.
- **Locales**: `src/locales/` — Dictionary-based i18n system.
- **Plugins**: `src/plugins/` — Isolated feature extensions.
- **Formatters**: `src/formatters/date.formatter.ts` — Pattern-based string generation.

## Extensibility

### Plugin System

#### ITimeGuardPlugin Interface

Every plugin must implement the `ITimeGuardPlugin` interface:

```typescript
interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(timeGuardClass: typeof TimeGuard, config?: unknown): void;
}
```

#### Plugin Lifecycle

1. **Registration**: `PluginManager.use(plugin, TimeGuard)` calls `plugin.install()`.
2. **Installation**: The plugin extends `TimeGuard.prototype` with new methods.
3. **Usage**: All TimeGuard instances now have access to the plugin methods.
4. **Unregistration**: `PluginManager.unuse(name)` removes the plugin (methods remain on prototype but are no longer tracked).

#### Creating a Custom Plugin

```typescript
import type { ITimeGuardPlugin, TimeGuard } from "@bereasoftware/timeguard";

export class MyPlugin implements ITimeGuardPlugin {
  name = "my-plugin";
  version = "1.0.0";

  install(TimeGuardClass: typeof TimeGuard): void {
    // Store reference to original methods if needed
    const originalFormat = TimeGuardClass.prototype.format;

    // Add new method
    (TimeGuardClass.prototype as any).myMethod = function(
      this: InstanceType<typeof TimeGuardClass>,
      arg: string
    ): string {
      return `Custom: ${this.format("YYYY-MM-DD")} - ${arg}`;
    };
  }
}
```

#### Registering and Using Plugins

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import { MyPlugin } from "./my-plugin";

// Register single plugin
PluginManager.use(new MyPlugin(), TimeGuard);

// Register multiple plugins
PluginManager.useMultiple([plugin1, plugin2, plugin3], TimeGuard);

// Check if plugin is registered
PluginManager.hasPlugin("my-plugin"); // true

// List all registered plugins
PluginManager.listPlugins(); // ['my-plugin']

// Get plugin instance
PluginManager.getPlugin("my-plugin");

// Unregister plugin
PluginManager.unuse("my-plugin");

// Clear all plugins
PluginManager.clear();
```

#### Plugin Best Practices

1. **Namespace your methods**: Prefix method names to avoid collisions.
2. **Store originals**: Keep references to original methods if wrapping them.
3. **Use types**: Cast with `as unknown as` to maintain type safety.
4. **Keep it isolated**: Plugins should not depend on each other.
5. **Lazy load**: Only register plugins when needed to minimize bundle size.

### Calendar System

#### ICalendarSystem Interface

Calendars implement the `ICalendarSystem` interface:

```typescript
interface ICalendarSystem {
  id: string;
  name: string;
  getMonthName(month: number, short?: boolean): string;
  getWeekdayName(day: number, short?: boolean): string;
  isLeapYear(year: number): boolean;
  daysInMonth(year: number, month: number): number;
  daysInYear(year: number): number;
}
```

#### Built-in Calendars

| Calendar | ID | Description | Accuracy |
|----------|----|-------------|----------|
| Gregorian | `gregory` | Standard international calendar | Exact (ISO 8601) |
| Islamic | `islamic` | Hijri calendar for Islamic dates | ⚠️ Experimental — simplified 30-year cycle approximation |
| Hebrew | `hebrew` | Jewish calendar | ⚠️ Experimental — simplified approximation, not astronomically accurate |
| Chinese | `chinese` | Traditional Chinese calendar | ⚠️ Experimental — simplified approximation, does **not** implement the real lunisolar leap-month cycle |
| Japanese | `japanese` | Japanese imperial calendar | Uses Gregorian rules post-1873; historical dates may not be accurate |
| Buddhist | `buddhist` | Buddhist Era calendar | Gregorian rules with a CE + 543 year offset |

> **Note:** Islamic, Hebrew, and Chinese calendars use simplified date math for `isLeapYear`/`daysInMonth` (see the `@experimental` annotations in `src/calendars/index.ts`) and should not be relied on for authoritative religious or civil dates. They're suitable for display/labeling purposes, not precise historical or liturgical calculations.

#### Creating a Custom Calendar

```typescript
import type { ICalendarSystem } from "@bereasoftware/timeguard";

export class PersianCalendar implements ICalendarSystem {
  id = "persian";
  name = "Persian (Jalali)";
  months = [
    "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
    "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"
  ];

  getMonthName(month: number, short = false): string {
    const idx = Math.max(0, Math.min(11, month - 1));
    return short ? this.months[idx].slice(0, 3) : this.months[idx];
  }

  getWeekdayName(day: number, short = false): string {
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const idx = Math.max(0, Math.min(6, day - 1));
    return short ? days[idx].slice(0, 3) : days[idx];
  }

  isLeapYear(year: number): boolean {
    // Persian leap year calculation
    return ((year % 2820 + 474) % 2820) % 128 < 31;
  }

  daysInMonth(year: number, month: number): number {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return this.isLeapYear(year) ? 30 : 29;
  }

  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
}
```

#### Registering a Calendar

```typescript
import { CalendarManager } from "@bereasoftware/timeguard";
import { PersianCalendar } from "./persian-calendar";

const manager = CalendarManager.getInstance();

// Register calendar
manager.register(new PersianCalendar());

// Set as default
manager.setDefault("persian");

// Get calendar
const persian = manager.get("persian");

// List all calendars
manager.list(); // ['gregory', 'islamic', 'hebrew', 'chinese', 'japanese', 'buddhist', 'persian']
```

### Locale System

#### ILocale Interface

```typescript
interface ILocale {
  name: string;
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  meridiem: { am: string; pm: string };
  formats: {
    iso: string;
    date: string;
    time: string;
    datetime: string;
    rfc2822: string;
  };
}
```

#### Adding a Locale

```typescript
import { LocaleManager } from "@bereasoftware/timeguard";

const manager = LocaleManager.getInstance();

// Set locale with data
manager.setLocale("fr", frenchLocaleData);

// Load multiple locales
manager.loadLocales({
  "de": germanLocaleData,
  "it": italianLocaleData,
});

// List all locales
manager.listLocales(); // ['en', 'es', 'fr', 'de', 'it']
```

See `ARCHITECTURE.md` for a more technical breakdown of the class hierarchy and internal data flow.
