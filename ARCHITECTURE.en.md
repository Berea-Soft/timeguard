# TimeGuard - Modern Date/Time Library

> 📚 **Documentation available in other languages:**
>
> 🇪🇸 [Español](ARCHITECTURE.md) | 🇬🇧 **English** (this file)

A modern, fully-typed TypeScript date/time library built using the **Temporal API**, following **SOLID principles**, and designed with **TDD/BDD** methodology.

## 🎯 Features

- ✨ **Fully TypeScript** - Complete type safety with strict mode
- 🕐 **Temporal API** - Uses JavaScript's new Temporal API for accurate date/time handling
- 🏗️ **SOLID Architecture** - Clean, maintainable, and extensible codebase
- 🧪 **TDD/BDD Tests** - Comprehensive test suite with Vitest
- 🌍 **i18n Support** - Built-in locale management (EN, ES, and extensible)
- 🔄 **Immutable** - All operations return new instances
- 🪝 **Plugin System** - Extend functionality with custom plugins
- 📦 **Modular Bundle** - Lightweight core (~8.5KB gzip), load locales/plugins/calendars on demand
- 🔋 **Zero Dependencies** - No bundled polyfill; uses the runtime's native `Temporal` (Node.js ≥26 or a modern browser)

## 📦 Installation

```bash
npm install @bereasoftware/timeguard
```

## 🚀 Quick Start

```typescript
import { TimeGuard, timeGuard } from "@bereasoftware/timeguard";

// Create instance
const now = TimeGuard.now();
const date = new TimeGuard("2024-03-13");
const aliased = timeGuard("2024-03-13");

// Format
date.format("YYYY-MM-DD"); // "2024-03-13"
date.format("MMMM D, YYYY"); // "March 13, 2024"

// Arithmetic
date.add({ day: 5 }).format("YYYY-MM-DD"); // "2024-03-18"
date.subtract({ month: 1 }).format("YYYY-MM-DD"); // "2024-02-13"

// Query
date.isBefore(new TimeGuard("2024-03-20")); // true
date.isAfter(new TimeGuard("2024-03-10")); // true

// Manipulation
date.startOf("month").format("YYYY-MM-DD"); // "2024-03-01"
date.endOf("year").format("YYYY-MM-DD"); // "2024-12-31"

// Chaining
date.add({ month: 1 }).startOf("month").format("YYYY-MM-DD"); // "2024-04-01"
```

## 🏛️ Architecture & SOLID Principles

### Single Responsibility Principle (SRP)

Each class has a single, well-defined responsibility:

```
├── TemporalAdapter      → Temporal API conversion
├── DateFormatter        → Date formatting logic
├── LocaleManager        → Locale management
└── TimeGuard            → Main facade & coordination
```

### Open/Closed Principle (OCP)

TimeGuard is open for extension through plugins:

```typescript
interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(timeGuard: typeof TimeGuard, config?: unknown): void;
}
```

### Liskov Substitution Principle (LSP)

All date/time objects implement `ITimeGuard` interface consistently:

```typescript
interface ITimeGuard extends IDateArithmetic, IDateQuery, IDateManipulation {
  // ... required methods
}
```

### Interface Segregation Principle (ISP)

Small, focused interfaces instead of large ones:

```typescript
interface IDateArithmetic {
  add(units: Partial<Record<Unit, number>>): TimeGuard;
  subtract(units: Partial<Record<Unit, number>>): TimeGuard;
  diff(other: TimeGuard): DiffResult;
  diff(other: TimeGuard, unit: Unit): number;
  diff(other: TimeGuard, options: IDiffOptions): DiffResult;
  until(other: TimeGuard, options?: IDurationOptions): DurationResult;
  since(other: TimeGuard, options?: IDurationOptions): DurationResult;
}

interface IDateQuery {
  isBefore(other: TimeGuard): boolean;
  isAfter(other: TimeGuard): boolean;
  isSame(other: TimeGuard, unit?: Unit): boolean;
  isBetween(
    start: TimeGuard,
    end: TimeGuard,
    unit?: Unit,
    inclusivity?: "[)" | "()" | "[]" | "(]",
  ): boolean;
}

interface IDateManipulation {
  clone(): TimeGuard;
  startOf(unit: Unit): TimeGuard;
  endOf(unit: Unit): TimeGuard;
  set(values: Partial<Record<Unit, number>>): TimeGuard;
}
```

### Dependency Inversion Principle (DIP)

Depends on abstractions, not concrete implementations:

```typescript
// Low-level modules depend on abstractions
class TimeGuard implements ITimeGuard {
  private localeManager: LocaleManager; // Singleton abstraction
  private formatter: DateFormatter; // Dependency injection
  private temporal: Temporal.PlainDateTime | Temporal.ZonedDateTime;
}
```

## 🧪 Testing Strategy (TDD/BDD)

Tests are organized around user behaviors (BDD style):

```typescript
describe("TimeGuard - Core Functionality", () => {
  describe("Creating instances", () => {
    it("should create a TimeGuard instance with current date when no argument provided", () => {
      const tg = new TimeGuard();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });
  });

  describe("Formatting", () => {
    it("should format with YYYY-MM-DD pattern", () => {
      const tg = new TimeGuard("2024-03-13T14:30:45.123");
      expect(tg.format("YYYY-MM-DD")).toBe("2024-03-13");
    });
  });

  // ... more tests
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📖 API Reference

### Creating Instances

```typescript
// Current date/time
TimeGuard.now();

// From various inputs
new TimeGuard("2024-03-13");
new TimeGuard(new Date());
new TimeGuard(1710340800000); // Unix timestamp (ms)
new TimeGuard({ year: 2024, month: 3, day: 13 });

// With configuration
new TimeGuard("2024-03-13", { locale: "es", timezone: "UTC" });

// Factory function
timeGuard("2024-03-13");
```

### Formatting

```typescript
const tg = new TimeGuard("2024-03-13T14:30:45");

// Custom patterns
tg.format("YYYY-MM-DD"); // "2024-03-13"
tg.format("DD/MM/YYYY"); // "13/03/2024"
tg.format("MMMM D, YYYY"); // "March 13, 2024"
tg.format("dddd"); // "Wednesday"
tg.format("[Date: ]YYYY-MM-DD"); // "Date: 2024-03-13"

// Presets
tg.format("iso"); // ISO 8601
tg.format("date"); // Date only
tg.format("time"); // Time only
tg.format("datetime"); // Date and time
tg.format("rfc2822"); // RFC 2822
tg.format("utc"); // UTC format
```

### Arithmetic Operations

```typescript
const tg = new TimeGuard("2024-03-13");

tg.add({ day: 5 });
tg.add({ month: 1, day: 15 });
tg.add({ year: 1, hour: 5, minute: 30 });

tg.subtract({ day: 5 });
tg.subtract({ month: 1, year: 1 });

// Difference between dates
tg.diff(new TimeGuard("2024-03-20"), "day"); // -7
tg.diff(new TimeGuard("2024-04-13"), "month"); // -1
```

### Query Operations

```typescript
const tg1 = new TimeGuard("2024-03-13");
const tg2 = new TimeGuard("2024-03-20");

tg1.isBefore(tg2); // true
tg1.isAfter(tg2); // false
tg1.isSame(tg1.clone()); // true
tg1.isSame(tg2, "month"); // true

tg1.isBetween(new TimeGuard("2024-03-01"), new TimeGuard("2024-03-31")); // true
```

### Manipulation Operations

```typescript
const tg = new TimeGuard("2024-03-13T14:30:45");

tg.clone(); // New instance
tg.startOf("year"); // 2024-01-01 00:00:00
tg.startOf("month"); // 2024-03-01 00:00:00
tg.startOf("day"); // 2024-03-13 00:00:00

tg.endOf("year"); // 2024-12-31 23:59:59
tg.endOf("month"); // 2024-03-31 23:59:59

tg.set({ month: 12, day: 25 }); // 2024-12-25 14:30:45
tg.set({ hour: 0, minute: 0 }); // 2024-03-13 00:00:00
```

### Conversion Operations

```typescript
const tg = new TimeGuard("2024-03-13T14:30:45");

tg.toDate(); // JavaScript Date object
tg.toISOString(); // "2024-03-13T14:30:45Z"
tg.valueOf(); // Unix timestamp (ms)
tg.unix(); // Unix timestamp (seconds)
tg.toJSON(); // JSON-compatible string
tg.toString(); // "2024-03-13 14:30:45"
tg.toTemporal(); // Temporal.PlainDateTime
```

### Getters

```typescript
const tg = new TimeGuard("2024-03-13T14:30:45.123");

tg.get("year"); // 2024
tg.get("month"); // 3
tg.get("day"); // 13
tg.get("hour"); // 14
tg.get("minute"); // 30
tg.get("second"); // 45
tg.get("millisecond"); // 123
```

### Locale Operations

```typescript
const tg = new TimeGuard("2024-03-13");

tg.locale(); // "en"
tg.locale("es").locale(); // "es"

tg.locale("es").format("MMMM"); // "Marzo"
tg.locale("en").format("MMMM"); // "March"

// Register custom locale
const manager = LocaleManager.getInstance();
manager.setLocale("custom", {
  /* locale data */
});
```

### Timezone Operations

```typescript
const tg = new TimeGuard("2024-03-13", { timezone: "UTC" });

tg.timezone(); // "UTC"
tg.timezone("America/New_York"); // New instance with different timezone
```

## 🔧 Development

### Project Structure

```
src/
├── core.ts                     # Implementation (TimeGuard, DurationResult, TimeRange) — no side effects
├── index.ts                    # Single entry point (~10KB gzip with core+EN/ES): re-exports core, assumes native `globalThis.Temporal`
├── react.ts / vue.ts / angular.ts / svelte.ts / solid.ts / qwik.ts  # Per-framework integrations
├── adapters/
│   └── temporal.adapter.ts     # Temporal API adapter (never imports a polyfill)
├── calendars/
│   ├── index.ts                # Exports all calendar systems
│   └── calendar.manager.ts     # Manager + Gregorian (core)
├── formatters/
│   └── date.formatter.ts       # Date formatting strategy
├── locales/
│   ├── index.ts                # Exports all 40+ locales
│   └── locale.manager.ts       # Singleton manager (EN/ES in core)
├── plugins/
│   ├── manager.ts              # Plugin manager
│   ├── relative-time/          # Relative time plugin
│   ├── duration/                # ISO 8601 duration plugin
│   └── advanced-format/        # Advanced format plugin
├── utils/
│   └── duration-locale.ts      # Duration localization helpers
└── types/                      # TypeScript interfaces & types

test/
├── time-guard.test.ts          # TimeGuard class tests
├── advanced.test.ts            # Advanced features tests
├── comprehensive.test.ts       # Integration tests
├── locales.test.ts             # Locale tests
├── plugins.test.ts             # Plugin tests
├── bundle-size.test.ts         # Bundle size + real-runtime proof that the package
│                                #   fails without a pre-existing Temporal (zero
│                                #   baked-in polyfill anywhere)
└── setup.ts                    # Vitest global setup — without native Temporal
                                 #   (Node <26), loads temporal-mock.ts: a dependency-
                                 #   free, hand-rolled mock, not @js-temporal/polyfill
```

`core.ts` is the only module that implements TimeGuard's logic, and it is **the exact same code** (byte-for-byte) used by the sibling package [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard) — there, `index.ts` auto-loads the polyfill before re-exporting `core.ts`; here, `index.ts` simply re-exports `core.ts`, assuming `Temporal` already exists. This guarantees, by construction, that both packages have **identical API surface and functionality**; the only difference is the runtime contract (auto-polyfilled vs. native). See [Requirements](README.en.md#requirements) for the Node.js/browser versions needed.

### Modular Build System

The build runs in 2 steps:

```bash
# npm run build executes:
vite build                  # Submodules (ES + CJS)
vite build --mode umd       # Core + submodules (UMD + IIFE + ES + CJS + types)
```

**Subpath exports** in `package.json`:

```typescript
import { TimeGuard } from '@bereasoftware/timeguard'              // Lightweight core, zero dependencies
import { ALL_LOCALES } from '@bereasoftware/timeguard/locales'    // On-demand locales
import { IslamicCalendar } from '@bereasoftware/timeguard/calendars'
import relativeTimePlugin from '@bereasoftware/timeguard/plugins/relative-time'
import { Duration } from '@bereasoftware/timeguard/plugins/duration'
import { useTimeGuard } from '@bereasoftware/timeguard/react'      // React hooks & Context Provider
import { useTimeGuard } from '@bereasoftware/timeguard/vue'        // Vue composables, directives & plugins
import { TimeGuardService } from '@bereasoftware/timeguard/angular' // Angular service, pipes, DI Token & live pipes
```

### Build Commands

```bash
# Development
npm run dev

# Build
npm run build

# Build watch
npm run build:watch

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

## 🎨 Design Patterns Used

1. **Facade Pattern** - `TimeGuard` provides unified interface to multiple subsystems
2. **Adapter Pattern** - `TemporalAdapter` converts between APIs
3. **Strategy Pattern** - `DateFormatter` encapsulates formatting strategies
4. **Singleton Pattern** - `LocaleManager` ensures single instance
5. **Factory Pattern** - Static methods for creating instances
6. **Immutable Pattern** - All operations return new instances

## 🌍 Supported Locales

**40+ locales included** organized by family: English (4), Spanish (3), Romance (5), Slavic (4), Nordic (4), Asian (7), European (7), Middle Eastern/South Asian (3), and more.

The **core** includes only EN and ES to keep the bundle lightweight. Others are loaded on demand:

```typescript
// Core: only EN/ES available
import { TimeGuard } from '@bereasoftware/timeguard';

// Load all locales on demand
import { ALL_LOCALES, registerAllLocales } from '@bereasoftware/timeguard/locales';
import { LocaleManager } from '@bereasoftware/timeguard';
LocaleManager.getInstance().loadLocales(ALL_LOCALES);

// Or import directly from the main entry
import { TimeGuard } from '@bereasoftware/timeguard';
```

Add custom locales:

```typescript
import { LocaleManager } from '@bereasoftware/timeguard';

const manager = LocaleManager.getInstance();
manager.setLocale('custom', {
  name: 'custom',
  months: ['January', 'February', ...],
  monthsShort: ['Jan', 'Feb', ...],
  weekdays: ['Sunday', 'Monday', ...],
  weekdaysShort: ['Sun', 'Mon', ...],
  weekdaysMin: ['S', 'M', ...],
});
```

## 📝 Units Supported

Available units for arithmetic and formatting:

- `year` / `Y`
- `month` / `MMM` / `MMMM`
- `week` / `W`
- `day` / `D` / `DD`
- `hour` / `H` / `HH`
- `minute` / `m` / `mm`
- `second` / `s` / `ss`
- `millisecond` / `ms`

## 🧠 Key Implementation Details

### Immutability

All operations return new instances, ensuring immutability:

```typescript
const original = new TimeGuard("2024-03-13");
const modified = original.add({ day: 1 });

console.log(original.format("YYYY-MM-DD")); // "2024-03-13"
console.log(modified.format("YYYY-MM-DD")); // "2024-03-14"
```

### Type Safety

Complete TypeScript support with strict mode:

```typescript
// Everything is typed
const tg: TimeGuard = new TimeGuard("2024-03-13");
const formatted: string = tg.format("YYYY-MM-DD");
const diff: number = tg.diff(TimeGuard.now(), "day");
```

### Temporal API

Uses the native Temporal API for accurate date/time operations:

```typescript
// Internally uses Temporal.PlainDateTime
const temporal = tg.toTemporal();
```

## 🚀 Performance

- **Core ~8.5KB gzip** — only the essentials (TimeGuard, formatter, EN/ES, Gregorian)
- Minimal overhead through adapter pattern
- Lazy evaluation where possible
- Efficient locale caching
- **Zero dependencies, not even dev ones** — `@js-temporal/polyfill` appears in neither `dependencies` nor `devDependencies`. `Temporal` types come from TypeScript's own ambient lib (`ESNext.Temporal`, see `tsconfig.json`), and tests on Node <26 use a dependency-free, hand-rolled mock (`test/temporal-mock.ts`)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass
2. New features include tests (TDD)
3. Code follows SOLID principles
4. TypeScript strict mode compliance
5. Documentation is updated

## 📚 References

- [Temporal API Proposal](https://tc39.es/proposal-temporal/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [BDD/TDD Methodology](https://en.wikipedia.org/wiki/Behavior-driven_development)

## 🎯 Roadmap

- [x] 40+ locales (EN, ES, FR, DE, IT, JA, ZH, KO, AR, etc.)
- [x] Plugin system (relative-time, duration, advanced-format)
- [x] 6 calendar systems (Gregorian, Islamic, Hebrew, Chinese, Japanese, Buddhist)
- [x] UMD/IIFE builds for CDN and `<script>`
- [x] Modular architecture (core ~8.5KB gzip + on-demand loading)
- [ ] Advanced timezone support (DST conversions)
- [ ] Performance optimizations
- [ ] Date recurrence patterns

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ by Berea-Soft**
