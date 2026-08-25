# timeguard 🕐

The **100% native** edition of TimeGuard: a modern, production-grade date/time manipulation library built with **TypeScript**, the **native Temporal API**, and **SOLID principles**. Zero runtime dependencies, no polyfill — same API and functionality as [**@bereasoftware/time-guard**](https://github.com/Berea-Soft/time-guard), for environments that already expose `Temporal` natively.

> ℹ️ **timeguard or time-guard?** These are two sibling packages with **identical functionality** (they share the same core implementation):
> - [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard) — auto-loads the Temporal polyfill. Works on any modern runtime (Node 18+, any browser), at the cost of ~52KB gzip for the default entry (~54KB as a CDN `<script>`).
> - `@bereasoftware/timeguard` (this package) — **zero runtime dependencies**, assumes `Temporal` already exists natively (Node.js ≥26, or a recent browser). **~11KB gzip** imported as a module, or **~9KB** as a self-contained CDN `<script>`.
>
> If you're not sure what runtime your users have, use `time-guard`. If you control the execution environment (your own backend, a guaranteed modern runtime), `timeguard` gives you the same power with less weight.

[![Tests](https://img.shields.io/badge/Tests-530%2B-green?style=for-the-badge)](#testing)
[![Locales](https://img.shields.io/badge/Locales-40%2B-orange?style=for-the-badge)](#supported-locales)
[![Calendars](https://img.shields.io/badge/Calendars-6+-blue?style=for-the-badge)](#calendar-systems)
[![NPM version](https://img.shields.io/npm/v/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![NPM downloads](https://img.shields.io/npm/dm/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![CI](https://img.shields.io/github/actions/workflow/status/Berea-Soft/timeguard/ci.yml?style=for-the-badge)](https://github.com/Berea-Soft/timeguard/actions/workflows/ci.yml)
[![Node](https://img.shields.io/node/v/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/Berea-Soft/timeguard?style=for-the-badge)](https://github.com/Berea-Soft/timeguard/blob/main/LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/Berea-Soft/timeguard?style=for-the-badge)](https://github.com/Berea-Soft/timeguard/commits/main)
[![Repository](https://img.shields.io/badge/github-repo-blue?logo=github&style=for-the-badge)](https://github.com/Berea-Soft/timeguard)
[![Coverage](https://img.shields.io/badge/coverage-91%25-orange?style=for-the-badge)](https://github.com/Berea-Soft/timeguard)

---

## 🎯 Features

- ✨ **Modern JavaScript** - Built on Temporal API (TC39 standard)
- 🏛️ **SOLID Principles** - Clean, maintainable, extensible architecture
- 🌍 **40+ Locales** - Comprehensive internationalization support
- 📦 **TypeScript** - Full type safety with strict mode enabled
- 🧪 **530+ Tests** - Complete BDD/TDD test coverage
- 🎨 **Multiple Formats** - ISO, RFC2822, RFC3339, UTC, and custom patterns
- ⚡ **Tree-Shakeable** - Modular structure for optimal bundle size
- 📚 **Well-Documented** - Extensive guides, examples, and API reference
- 🔌 **Plugin System** - Extend with optional plugins (relative time, duration, advanced formatting)
- 📅 **Multiple Calendars** - Gregorian, Islamic, Hebrew, Chinese, Japanese, Buddhist, and more
- ⏱️ **Nanosecond Precision** - Full Temporal API nanosecond support
- 🔄 **Duration API** - `until()`, `round()` methods for advanced calculations

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
- [Component Accessors](#component-accessors)
- [Advanced Calculations](#advanced-calculations)
- [Calendar Systems](#calendar-systems)
- [Plugins](#plugins)
- [Framework Integrations](#framework-integrations)
- [Documentation](#documentation)
- [Supported Locales](#supported-locales)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Quick Start

```typescript
import { TimeGuard } from "@bereasoftware/timeguard";

// Create a date
const now = TimeGuard.now();
const date = TimeGuard.from("2024-03-13");

// Manipulate dates
const tomorrow = date.add(1, "day");
const nextMonth = date.add(1, "month");

// Format with locales
const spanish = date.locale("es").format("dddd, DD MMMM YYYY");
// Output: miércoles, 13 marzo 2024

const japanese = date.locale("ja").format("YYYY年M月D日");
// Output: 2024年3月13日

// Get date components
console.log(date.year()); // 2024
console.log(date.month()); // 3
console.log(date.day()); // 13
console.log(date.dayOfWeek()); // 3 (Wednesday)

// Compare dates
console.log(date.isBefore(tomorrow)); // true
console.log(date.isSame(date.clone())); // true
console.log(date.isAfter(new Date("2020-01-01"))); // true
```

---

## 📦 Installation

```bash
npm install @bereasoftware/timeguard
# or
yarn add @bereasoftware/timeguard
# or
pnpm add @bereasoftware/timeguard
```

### Requirements

timeguard is a **single, 100% native entry point** — there's no "with polyfill" flavor inside this package (that's what [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard) is for). You need one of these runtimes:

| Runtime | Temporal support |
| --- | --- |
| Node.js **≥26.0.0** | Enabled by default, unflagged, since May 5, 2026 |
| Chrome / Edge **≥144** | Native |
| Firefox **≥139** | Native |
| Any other runtime | You must assign your own polyfill to `globalThis.Temporal` **before** importing `timeguard` |

Safari doesn't support Temporal stably yet. Node.js 24/25 have it behind an experimental V8 flag (not officially supported by this package). If you can't guarantee any of these runtimes, use [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard) instead — same API, auto-loads the polyfill.

On a runtime with no `Temporal`, every `TimeGuard` method throws an immediate, explicit error instead of failing silently.

- **Zero dependencies** — `@js-temporal/polyfill` appears in neither `dependencies` nor `devDependencies` of this package. `Temporal` types are provided directly by TypeScript (`lib: ["ESNext.Temporal"]`, available since TypeScript 6.0)
- **TypeScript** 6.0+ (needed for the ambient `Temporal` types; optional but recommended)

### 🚀 Usage in Node.js / Backend

timeguard **never loads a polyfill** — it uses whatever `Temporal` your runtime already exposes:

```typescript
// Node.js >=26: Temporal is already available globally, nothing to configure
import { TimeGuard } from '@bereasoftware/timeguard';

const now = TimeGuard.now();
```

**Runtime doesn't have native Temporal yet?** Assign a polyfill yourself before importing (timeguard doesn't install one for you — this is just an example, any Temporal polyfill works; it's entirely your call whether to add it):
```typescript
// Only needed if your runtime does NOT have native Temporal yet.
// npm install @js-temporal/polyfill (or whichever polyfill you prefer) —
// timeguard never installs it for you, not even as a devDependency.
import { Temporal } from '@js-temporal/polyfill';
(globalThis as any).Temporal = Temporal;

import { TimeGuard } from '@bereasoftware/timeguard';
```

### Modular Bundle

timeguard uses the same modular architecture as `time-guard`. The default entry is a ~1.6KB gzip stub that imports two shared chunks (TimeGuard/formatter/Gregorian ~8.5KB + LocaleManager/EN/ES ~1KB) — since this package never bundles a polyfill, using just `TimeGuard` stays at **~11KB gzip** total. It used to also give away the full implementation of all 40+ locales, all 5 non-Gregorian calendars, and all 3 plugins for free from `core.ts`, inflating this same entry to ~24KB whether or not you used any of them. They now live **only** in their own subpaths, so the default entry no longer pays for them. The effect is most visible in the self-contained `<script>`/CDN build (which can't resolve subpaths at runtime): it dropped from ~19KB to **~9KB gzip**. Extra locales, plugins, and calendars remain available on demand:

```typescript
// Default entry (~11KB gzip; zero runtime dependencies)
import { TimeGuard } from "@bereasoftware/timeguard";

// On-demand modules (not included in the default entry)
import { ALL_LOCALES } from "@bereasoftware/timeguard/locales";
import { IslamicCalendar } from "@bereasoftware/timeguard/calendars";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";
import { Duration } from "@bereasoftware/timeguard/plugins/duration";
import advancedFormatPlugin from "@bereasoftware/timeguard/plugins/advanced-format";

// UMD for CDN / <script> (~9KB gzip, self-contained)
// <script src="unpkg.com/@bereasoftware/timeguard/dist/timeguard.umd.js"></script>

// Note: UMD/IIFE files are only for CDN or <script> usage, not for package subpath imports.
```

---

## 🏗️ Core Concepts

### 1. Immutability

All TimeGuard instances are immutable. Every operation returns a new instance:

```typescript
const date = TimeGuard.from("2024-03-13");
const modified = date.add(1, "day");

console.log(date.day()); // 13 (unchanged)
console.log(modified.day()); // 14 (new instance)
```

### 2. Timezone Support

Handle timezones with full Temporal API support:

```typescript
const date = TimeGuard.from("2024-03-13 10:30:00");

// Set timezone
const inNYC = date.timezone("America/New_York");
const inTokyo = date.timezone("Asia/Tokyo");

console.log(inNYC.format("YYYY-MM-DD HH:mm:ss Z"));
console.log(inTokyo.format("YYYY-MM-DD HH:mm:ss Z"));
```

### 3. Localization

Support for 40+ languages and locales. The core only registers `en`/`es` by default — call `loadAllLocales()` once (or register just the ones you use via `/locales`, see [Modular Bundle](#modular-bundle)):

```typescript
import { TimeGuard, loadAllLocales } from "@bereasoftware/timeguard";

loadAllLocales(); // once, at app startup

const date = TimeGuard.from("2024-03-13");

date.locale("en").format("MMMM DD, YYYY"); // March 13, 2024
date.locale("es").format("DD MMMM YYYY"); // 13 marzo 2024
date.locale("fr").format("DD MMMM YYYY"); // 13 mars 2024
date.locale("de").format("DD. MMMM YYYY"); // 13. März 2024
date.locale("ja").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-cn").format("YYYY年M月D日"); // 2024年3月13日
date.locale("ar").format("DD MMMM YYYY"); // 13 مارس 2024
```

### 4. Format Strategies

Multiple preset formats and custom patterns:

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45");

// Presets
date.format("iso"); // 2024-03-13T14:30:45
date.format("date"); // 2024-03-13
date.format("time"); // 14:30:45
date.format("datetime"); // 2024-03-13 14:30:45
date.format("rfc2822"); // Wed, 13 Mar 2024 14:30:45 GMT
date.format("rfc3339"); // 2024-03-13T14:30:45Z
date.format("utc"); // 2024-03-13T14:30:45.000Z

// Custom patterns
date.format("YYYY-MM-DD HH:mm:ss");
date.format("dddd, MMMM DD, YYYY");
date.format("MM/DD/YYYY");
```

---

## 🎯 Component Accessors

Quick access to individual date components:

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45.123");

// Individual components
console.log(date.year()); // 2024
console.log(date.month()); // 3
console.log(date.day()); // 13
console.log(date.hour()); // 14
console.log(date.minute()); // 30
console.log(date.second()); // 45
console.log(date.millisecond()); // 123

// Week information
console.log(date.dayOfWeek()); // 3 (Wed: 1=Sun, 7=Sat)
console.log(date.dayOfYear()); // 73
console.log(date.weekOfYear()); // 11

// Month/Year information
console.log(date.daysInMonth()); // 31
console.log(date.daysInYear()); // 366 (leap year)
console.log(date.inLeapYear()); // true
```

---

## ⏱️ Advanced Calculations

### 🎯 Semantic API: `between()` - Zero Mental Load

The **most semantic and clear** way to calculate time differences. No need to think about `until()` vs `since()`!

```typescript
const start = TimeGuard.from("2024-01-15");
const end = TimeGuard.from("2024-03-20");

// Simple and direct reading
TimeGuard.between(start, end).humanize();
// "2 months and 5 days"

// Order doesn't matter - always positive
TimeGuard.between(end, start).humanize();
// "2 months and 5 days" (identical!)

// Access DurationParts properties
TimeGuard.between(start, end).months; // 2
TimeGuard.between(start, end).days; // 5

// All humanize() options available
TimeGuard.between(start, end).humanize({ locale: "es", fullBreakdown: true });
// "2 meses y 5 días"
```

**Semantic comparison:**

```typescript
// ❌ Confusing: which is which?
start.until(end); // is it positive?
end.since(start); // is it different?

// ✅ Clear: no thinking required
TimeGuard.between(start, end); // always positive, no confusion
TimeGuard.between(end, start); // same result, order doesn't matter
```

### 🔗 Fluent API: `range()` - Naming Killer

**Pure technical marketing:** The most intuitive API for date ranges with **fluent method chaining**:

```typescript
// Clean and straightforward syntax
TimeGuard.range("2024-01-15", "2024-03-20").humanize();
// "2 months and 5 days"

TimeGuard.range("2024-01-15", "2024-03-20").inMonths();
// 2.1355 (precise decimal value)

TimeGuard.range("2024-01-15", "2024-03-20").toDuration();
// DurationResult: complete property access
```

**Business use cases:**

```typescript
// 📅 Rental period
const checkIn = new TimeGuard("2024-06-15");
const checkOut = new TimeGuard("2024-06-22");

const rentalDays = TimeGuard.range(checkIn, checkOut).in("day");
const rentalCost = rentalDays * 100; // $100 per day
console.log(rentalCost); // $700

// 💳 Late fee calculation
const invoiceDate = new TimeGuard("2024-01-01");
const paymentDate = new TimeGuard("2024-02-15");

const lateFeePerDay = 10;
const lateFee =
  TimeGuard.range(invoiceDate, paymentDate).in("day") * lateFeePerDay;
console.log(lateFee); // Exact calculation with month averaging

// 📊 Session analytics
const sessionStart = new TimeGuard("2024-03-15T10:00:00");
const sessionEnd = new TimeGuard("2024-03-15T10:35:42");

const engagementMinutes = TimeGuard.range(sessionStart, sessionEnd).in(
  "minute",
);
console.log(engagementMinutes); // For user metrics
```

**Locale support:**

```typescript
// Date order doesn't matter
TimeGuard.range("2024-03-20", "2024-01-15").humanize({ locale: "es" });
// "2 meses y 5 días" (identical result)

// Different languages
TimeGuard.range("2024-01-15", "2024-03-20").humanize({ locale: "fr" });
// "2 mois et 5 jours"

TimeGuard.range("2024-01-15", "2024-03-20").humanize({ locale: "de" });
// "2 Monate und 5 Tage"

// Full breakdown
TimeGuard.range("2024-01-15", "2024-03-20").humanize({
  locale: "es",
  fullBreakdown: true,
});
// "2 meses y 5 días"
```

**Available methods on `TimeRange`:**

| Method                | Returns          | Description                                 |
| --------------------- | ---------------- | ------------------------------------------- |
| `.toDuration()`       | `DurationResult` | Complete duration object with all methods   |
| `.inMonths()`         | `number`         | Range in months (decimal: 2.1355)           |
| `.humanize(options?)` | `string`         | Human-readable text: "2 months and 5 days"  |
| `.in(unit)`           | `number`         | Range in any unit (day, hour, minute, etc.) |

### Duration: Calculate time between dates

```typescript
const start = TimeGuard.from("2024-01-15");
const end = TimeGuard.from("2024-03-20");

const duration = start.until(end);

console.log(duration);
// {
//   years: 0,
//   months: 2,
//   days: 5,
//   hours: 0,
//   minutes: 0,
//   seconds: 0,
//   milliseconds: 0
// }
```

### Humanize: Human-Readable Duration 📝

Convert durations to natural, user-friendly text with multi-language support:

```typescript
const start = TimeGuard.from("2024-01-15");
const end = TimeGuard.from("2024-03-20");

// Simple style (Intl.RelativeTimeFormat)
const duration = start.until(end);
console.log(duration.humanize());
// "2 months"

// Full breakdown with multiple units
console.log(duration.humanize({ fullBreakdown: true }));
// "2 months and 5 days"

// With specific locale
console.log(duration.humanize({ locale: "es" }));
// "2 meses"

console.log(duration.humanize({ locale: "es", fullBreakdown: true }));
// "2 meses y 5 días"

// With French locale
console.log(duration.humanize({ locale: "fr" }));
// "2 mois"

console.log(duration.humanize({ locale: "fr", fullBreakdown: true }));
// "2 mois et 5 jours"
```

#### Using Inherited Locales

```typescript
// TimeGuard inherits locale configuration
const start = TimeGuard.from("2024-01-15", { locale: "es" });
const end = TimeGuard.from("2024-03-20");

const duration = start.until(end);

// Automatically uses the instance's locale
console.log(duration.humanize());
// "2 meses"

console.log(duration.humanize({ fullBreakdown: true }));
// "2 meses y 5 días"
```

#### Humanize Options

| Option          | Type               | Default        | Description                               |
| --------------- | ------------------ | -------------- | ----------------------------------------- |
| `locale`        | string             | from TimeGuard | Locale code ('en', 'es', 'fr', etc.)      |
| `fullBreakdown` | boolean            | false          | Show full breakdown vs. largest unit only |
| `numeric`       | 'always' \| 'auto' | 'always'       | Numeric format for Intl API               |

#### Supported Locales

Humanize automatically supports:

- 🇬🇧 **en** - English
- 🇪🇸 **es** - Español
- 🇫🇷 **fr** - Français (French)
- 🇩🇪 **de** - Deutsch (German)
- 🇮🇹 **it** - Italiano (Italian)
- 🇵🇹 **pt** - Português (Portuguese)

And many more through `Intl.RelativeTimeFormat`.

### 💥 Explain Mode: Brutal Debugging and Education

**Killer feature for debugging and teaching** - Get a detailed explanation of how each duration was calculated.

Perfect for:

- 🐛 **Debugging** - Understand exactly how duration was calculated
- 📚 **Education** - Teach date math to students
- 📋 **Auditing** - Verify date-based business logic
- ✅ **Validation** - Confirm calculations are correct

```typescript
const start = TimeGuard.from("2024-01-15");
const end = TimeGuard.from("2024-03-20");
const duration = start.until(end);

// Get detailed explanation of the calculation
const explanation = duration.explain();

console.log(explanation);
// {
//   input: [
//     '2024-01-15T00:00:00',
//     '2024-03-20T00:00:00'
//   ],
//   steps: [
//     'Parsed dates: 2024-01-15 (day 15 of 365) to 2024-03-20 (day 80 of 365)',
//     '2024 is a leap year (February has 29 days)',
//     'Years: 0',
//     'Months: 2',
//     'Days: 5',
//     'Total: 2m 5d'
//   ],
//   breakdown: {
//     years: 0,
//     months: 2,
//     weeks: 0,
//     days: 5,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//     milliseconds: 0
//   },
//   mode: 'exact',
//   explanation: 'Calculated 2024-01-15 to 2024-03-20. 2024 is a leap year. Breakdown: 0 year(s), 2 month(s), 5 day(s). Mode: exact calculation',
//   locale: 'en',
//   leapYearFlags: [
//     { year: 2024, isLeap: true, daysInFebruary: 29 }
//   ],
//   metadata: {
//     calculationTimeMs: 0.5,
//     precision: 'day'
//   }
// }
```

#### Use Cases

Debugging date logic:

```typescript
// Why is the late fee calculation different?
const invoiceDate = TimeGuard.from("2024-01-05");
const paymentDate = TimeGuard.from("2024-02-15");
const lateFee = invoiceDate.until(paymentDate);

// Get the complete explanation
const debug = lateFee.explain();

console.log("Calculation steps:", debug.steps);
console.log("February is leap:", debug.leapYearFlags);
console.log("Breakdown:", debug.breakdown);
// Now you know exactly what happened!
```

Education - Teaching date calculations:

```typescript
// Show students how it works
const start = TimeGuard.from("2024-02-15");
const end = TimeGuard.from("2024-04-15");
const duration = start.until(end);

const explanation = duration.explain();

// Print all steps
explanation.steps.forEach((step, i) => {
  console.log(`${i + 1}. ${step}`);
});
// 1. Parsed dates: ...
// 2. 2024 is a leap year...
// 3. Years: 0
// 4. Months: 2
// 5. Days: 0
// 6. Total: 2m
```

#### Explanation Properties

| Property         | Type                     | Description                      |
| ---------------- | ------------------------ | -------------------------------- |
| `input`          | `string[]`               | Parsed input dates               |
| `steps`          | `string[]`               | Human-readable calculation steps |
| `breakdown`      | `DurationParts`          | Component breakdown              |
| `mode`           | `'exact' \| 'estimated'` | Calculation type                 |
| `explanation`    | `string`                 | Natural language summary         |
| `locale`         | `string`                 | Explanation language             |
| `leapYearFlags?` | `Array`                  | Leap year information            |
| `metadata?`      | `Object`                 | Performance and precision        |

### Round: Precision control

```typescript
const date = TimeGuard.from("2024-03-13 14:35:47.654");

// Round to different units
date.round({ smallestUnit: "second" }); // 2024-03-13 14:35:48
date.round({ smallestUnit: "minute" }); // 2024-03-13 14:36:00
date.round({ smallestUnit: "hour" }); // 2024-03-13 15:00:00
date.round({ smallestUnit: "day" }); // 2024-03-14 00:00:00

// Rounding modes: 'ceil', 'floor', 'trunc', 'half' (default)
date.round({
  smallestUnit: "minute",
  roundingMode: "ceil",
});
```

---

## 📅 Calendar Systems

TimeGuard includes support for multiple calendar systems, extendable via the calendar manager:

### Supported Calendars

```typescript
import { TimeGuard, CalendarManager } from "@bereasoftware/timeguard";
import {
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
} from "@bereasoftware/timeguard/calendars";

// Get calendar manager
const calendarMgr = CalendarManager.getInstance();

// List available calendars
console.log(calendarMgr.list());
// ['gregory', 'islamic', 'hebrew', 'chinese', 'japanese', 'buddhist']

// Register custom calendar
const islamic = new IslamicCalendar();
calendarMgr.register(islamic);

// Get calendar info
const gregorian = calendarMgr.get("gregory");
console.log(gregorian.getMonthName(3)); // "March"
console.log(gregorian.getMonthName(3, true)); // "Mar"
console.log(gregorian.getWeekdayName(1)); // "Sunday"
console.log(gregorian.isLeapYear(2024)); // true
```

---

## 🔌 Plugins

TimeGuard includes an optional plugin system for extended functionality:

### Available Plugins

1. **Relative Time Plugin** - Human-readable time differences

   ```typescript
   import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
   import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";

   PluginManager.use(relativeTimePlugin, TimeGuard);

   TimeGuard.from("2024-01-01").fromNow(); // "2 months ago"
   TimeGuard.from("2024-04-01").toNow(); // "in 19 days"
   ```

2. **Duration Plugin** - ISO 8601 duration support

   ```typescript
   import { Duration } from "@bereasoftware/timeguard/plugins/duration";

   const duration = Duration.fromISO("P2Y3M4D");
   duration.humanize(); // "2 years, 3 months, 4 days"
   duration.asDays(); // 1159
   ```

3. **Advanced Format Plugin** - Extended format tokens

   ```typescript
   import advancedFormatPlugin from "@bereasoftware/timeguard/plugins/advanced-format";

   PluginManager.use(advancedFormatPlugin, TimeGuard);

   date.format("Do MMMM YYYY"); // "13th March 2024"
   date.format("Q [Q] YYYY"); // "1 Q 2024"
   ```

**📖 Full Details:** See [PLUGINS.md](PLUGINS.md) for complete plugin documentation.

---

## 📚 Documentation

### Main Documentation Files

| Document                              | Purpose                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------- |
| [📖 ARCHITECTURE.md](ARCHITECTURE.md) | Deep dive into design patterns, SOLID principles, and system architecture |
| [💡 EXAMPLES.md](EXAMPLES.md)         | Real-world usage examples and common scenarios                            |
| [🌍 LOCALES.md](LOCALES.md)           | Complete guide to localization and supported languages                    |
| [🔌 PLUGINS.md](PLUGINS.md)           | Plugin system documentation and usage guide                               |
| [📖 API Reference](#api-overview)     | Quick API reference (below)                                               |

### Quick Navigation

- **Getting Started** → Start with [Quick Start](#quick-start) above
- **Advanced Usage** → See [EXAMPLES.md](EXAMPLES.md)
- **Localization** → See [LOCALES.md](LOCALES.md)
- **Architecture** → See [ARCHITECTURE.md](ARCHITECTURE.md)

## 🌍 Supported Locales - Complete Guide

TimeGuard provides **40+ languages and regional variants** with full internationalization support. Locales are organized by language family for easy discovery.

### Locale Code Format

Locale codes follow the standard `[language]-[region]` pattern:

- `en` - Default form (used if region variant not specified)
- `en-gb` - Specific region variant (Great Britain)
- `es-mx` - Spanish variant for Mexico
- `zh-cn` - Simplified Chinese

### Available Locales by Family

#### 🇬🇧 English (4 variants)

- `en` - English (US)
- `en-au` - English (Australia)
- `en-gb` - English (Great Britain)
- `en-ca` - English (Canada)

### Spanish (3 variants)

- `es` - Spanish (Spain)
- `es-mx` - Spanish (Mexico)
- `es-us` - Spanish (US)

### Romance Languages (5)

- `fr` - French
- `it` - Italian
- `pt` - Portuguese (Portugal)
- `pt-br` - Portuguese (Brazil)
- `ro` - Romanian

### Slavic Languages (4)

- `ru` - Russian
- `pl` - Polish
- `cs` - Czech
- `sk` - Slovak

### Nordic Languages (4)

- `sv` - Swedish
- `nb` - Norwegian (Bokmål)
- `da` - Danish
- `fi` - Finnish

### Asian Languages (7)

- `ja` - Japanese
- `zh-cn` - Chinese (Simplified)
- `zh-tw` - Chinese (Traditional)
- `ko` - Korean
- `th` - Thai
- `vi` - Vietnamese
- `id` - Indonesian

### European Languages (7)

- `de` - German
- `nl` - Dutch
- `el` - Greek
- `hu` - Hungarian
- `eu` - Basque
- `ca` - Catalan
- `tr` - Turkish

### Middle Eastern & South Asian (3)

- `ar` - Arabic
- `he` - Hebrew
- `hi` - Hindi

---

### Locale Usage Guide

#### Setting Locales

```typescript
import { TimeGuard } from "@bereasoftware/timeguard";

const date = TimeGuard.from("2024-03-13 14:30:00");

// Get current locale
const currentLocale = date.locale(); // "en"

// Change locale (returns new instance)
const spanish = date.locale("es");
const french = date.locale("fr");
const japanese = date.locale("ja");
const arabic = date.locale("ar");

// Chain operations
date.locale("es").format("dddd, DD MMMM YYYY"); // miércoles, 13 marzo 2024

// Or use constructor config
TimeGuard.from("2024-03-13", { locale: "de" });
TimeGuard.now({ locale: "ja" });
```

#### Formatting in Different Locales

```typescript
const date = TimeGuard.from("2024-03-13");

// English variants
date.locale("en").format("MMMM DD, YYYY"); // March 13, 2024
date.locale("en-gb").format("DD MMMM YYYY"); // 13 March 2024
date.locale("en-au").format("DD/MM/YYYY"); // 13/03/2024
date.locale("en-ca").format("YYYY-MM-DD"); // 2024-03-13

// Spanish variants
date.locale("es").format("DD MMMM YYYY"); // 13 marzo 2024
date.locale("es-mx").format("DD/MM/YYYY"); // 13/03/2024
date.locale("es-us").format("MMMM D"); // marzo 13

// Romance languages
date.locale("fr").format("dddd D MMMM YYYY"); // mercredi 13 mars 2024
date.locale("it").format("dddd, D MMMM YYYY"); // mercoledì, 13 marzo 2024
date.locale("pt").format("dddd, D MMMM YYYY"); // quarta-feira, 13 de março de 2024
date.locale("pt-br").format("DD/MM/YYYY"); // 13/03/2024
date.locale("ro").format("DD MMMM YYYY"); // 13 martie 2024

// Slavic languages
date.locale("ru").format("DD MMMM YYYY"); // 13 марта 2024
date.locale("pl").format("DD MMMM YYYY"); // 13 marca 2024
date.locale("cs").format("DD. MMMM YYYY"); // 13. března 2024
date.locale("sk").format("DD. MMMM YYYY"); // 13. marca 2024

// Nordic languages
date.locale("sv").format("DD MMMM YYYY"); // 13 mars 2024
date.locale("nb").format("DD. MMMM YYYY"); // 13. mars 2024
date.locale("da").format("DD. MMMM YYYY"); // 13. marts 2024
date.locale("fi").format("DD. MMMM YYYY"); // 13. maaliskuuta 2024

// Asian languages
date.locale("ja").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-cn").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-tw").format("YYYY年M月D日"); // 2024年3月13日
date.locale("ko").format("YYYY년 M월 D일"); // 2024년 3월 13일
date.locale("th").format("DD MMMM YYYY"); // 13 มีนาคม 2567 (BE)
date.locale("vi").format("DD/MM/YYYY"); // 13/03/2024
date.locale("id").format("DD MMMM YYYY"); // 13 Maret 2024

// European languages
date.locale("de").format("DD. MMMM YYYY"); // 13. März 2024
date.locale("nl").format("DD MMMM YYYY"); // 13 maart 2024
date.locale("el").format("DD MMMM YYYY"); // 13 Μαρτίου 2024
date.locale("hu").format("YYYY. MMMM DD."); // 2024. március 13.
date.locale("eu").format("YYYY[ko] MMMM[ren] DD"); // 2024ko martsaren 13
date.locale("ca").format("DD MMMM YYYY"); // 13 de març de 2024
date.locale("tr").format("DD MMMM YYYY"); // 13 Mart 2024

// Middle Eastern & South Asian
date.locale("ar").format("DD MMMM YYYY"); // 13 مارس 2024
date.locale("he").format("DD.MM.YYYY"); // 13.03.2024
date.locale("hi").format("DD MMMM YYYY"); // 13 मार्च 2024
```

#### Day and Month Names

```typescript
// Get localized day names
date.locale("es").format("dddd"); // miércoles
date.locale("es").format("ddd"); // mié
date.locale("fr").format("dddd"); // mercredi
date.locale("de").format("dddd"); // Mittwoch
date.locale("ja").format("dddd"); // 水曜日

// Get localized month names
date.locale("es").format("MMMM"); // marzo
date.locale("es").format("MMM"); // mar
date.locale("fr").format("MMMM"); // mars
date.locale("de").format("MMMM"); // März
date.locale("ru").format("MMMM"); // марта
```

#### Multi-Locale Applications

```typescript
// Switch language at runtime (user preference)
let currentLocale = "en";

function formatUserDate(
  date: TimeGuard,
  locale: string = currentLocale,
): string {
  return date.locale(locale).format("dddd, MMMM D, YYYY [at] HH:mm");
}

const date = TimeGuard.now();

// English user
console.log(formatUserDate(date, "en")); // Wednesday, March 13, 2024 at 14:30

// Spanish user
currentLocale = "es";
console.log(formatUserDate(date, "es")); // miércoles, 13 de marzo de 2024 a las 14:30

// French user
console.log(formatUserDate(date, "fr")); // mercredi, 13 mars 2024 à 14:30

// Japanese user
console.log(formatUserDate(date, "ja")); // 水曜日、2024年3月13日 14:30
```

#### Getting Available Locales Programmatically

```typescript
import { getAvailableLocales } from "@bereasoftware/timeguard";

// Get all available locales
const locales = getAvailableLocales();
// Returns: ['en', 'en-au', 'en-gb', 'en-ca', 'es', 'es-mx', 'es-us', ...]

// Filter by prefix
const englishLocales = locales.filter((l) => l.startsWith("en"));
const spanishLocales = locales.filter((l) => l.startsWith("es"));
const asianLocales = locales.filter((l) =>
  ["ja", "zh-cn", "zh-tw", "ko"].includes(l),
);

// Create locale selector UI
function createLocaleSelector() {
  const locales = getAvailableLocales();
  return locales.map((locale) => ({
    code: locale,
    label: new Intl.DisplayNames("en", { type: "language" }).of(locale),
  }));
}
```

**📖 Full Details:** See [LOCALES.md](LOCALES.md) for locale-specific usage and characteristics.

---

## 🔌 Plugins - Complete Guide

TimeGuard includes a powerful plugin system for extending functionality. Plugins follow SOLID principles and are fully optional.

### Plugin Manager

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";

// Use a plugin
PluginManager.use(myPlugin, TimeGuard);

// Check if plugin is installed
PluginManager.isInstalled(pluginName);

// List installed plugins
PluginManager.listInstalled();
```

### 1️⃣ Relative Time Plugin

Adds human-readable time differences like "2 hours ago" or "in 3 days".

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";

// Install plugin once
PluginManager.use(relativeTimePlugin, TimeGuard);

// Now use relative time methods
const date = TimeGuard.from("2024-01-15");

// Relative to now
date.fromNow(); // "2 months ago"
date.toNow(); // "in 2 months"

// Without suffix
date.fromNow(true); // "2 months"
date.toNow(true); // "2 months"

// Relative to another date
const other = TimeGuard.from("2024-02-15");
date.from(other); // "a month ago"
date.to(other); // "in a month"

// Humanize duration
date.humanize(other); // "a month"
date.humanize(other, true); // "a month" (exact mode)
```

**Supported Relative Time Formats:**

```
"a few seconds ago"             // Very recent
"a minute ago" / "2 minutes ago"
"an hour ago" / "3 hours ago"
"a day ago" / "5 days ago"
"a month ago" / "2 months ago"
"a year ago" / "3 years ago"
"in a few seconds"              // Future
"in a minute" / "in 2 minutes"
"in an hour" / "in 3 hours"
"in a day" / "in 5 days"
"in a month" / "in 2 months"
"in a year" / "in 3 years"
```

---

### 2️⃣ Duration Plugin

ISO 8601 duration support with advanced calculations.

```typescript
import { TimeGuard } from "@bereasoftware/timeguard";
import {
  Duration,
  durationPlugin,
} from "@bereasoftware/timeguard/plugins/duration";
import { PluginManager } from "@bereasoftware/timeguard";

// Install plugin
PluginManager.use(durationPlugin, TimeGuard);

// ===== Create Durations =====

// From object
const duration1 = new Duration({
  years: 2,
  months: 3,
  days: 4,
  hours: 12,
  minutes: 30,
});

// From ISO 8601 string
const duration2 = Duration.fromISO("P3Y6M4DT12H30M5S");
// P = Period marker
// 3Y = 3 years
// 6M = 6 months
// 4D = 4 days
// T = Time marker
// 12H = 12 hours
// 30M = 30 minutes
// 5S = 5 seconds

// From TimeGuard dates
const start = TimeGuard.from("2024-01-15");
const end = TimeGuard.from("2024-05-20");
const between = Duration.between(start, end);
// { years: 0, months: 4, days: 5, ... }

// ===== Duration Operations =====

// Get ISO string
duration1.toISO(); // "P2Y3M4DT12H30M"

// Get total in different units
duration1.asDays(); // Total days
duration1.asHours(); // Total hours
duration1.asSeconds(); // Total seconds
duration1.asMilliseconds(); // Total milliseconds

// Humanize
duration1.humanize(); // "2 years, 3 months, 4 days, 12 hours, 30 minutes"
duration1.humanize("es"); // Spanish: "2 años, 3 meses..."
duration1.humanize("fr"); // French: "2 ans, 3 mois..."

// Get components
duration1.years;
duration1.months;
duration1.days;
duration1.hours;
duration1.minutes;
duration1.seconds;
duration1.milliseconds;

// Clone
const copy = duration1.clone();

// Arithmetic
duration1.add(new Duration({ days: 5 }));
duration1.subtract(new Duration({ hours: 2 }));
duration1.multiply(2); // Double the duration
duration1.negate(); // Reverse direction
```

**ISO 8601 Duration Examples:**

```typescript
Duration.fromISO("P1Y"); // 1 year
Duration.fromISO("P3M"); // 3 months
Duration.fromISO("P1W"); // 1 week (7 days)
Duration.fromISO("P1D"); // 1 day
Duration.fromISO("PT1H"); // 1 hour
Duration.fromISO("PT30M"); // 30 minutes
Duration.fromISO("PT45S"); // 45 seconds
Duration.fromISO("P1Y2M3DT4H5M6S"); // Complex: 1 year, 2 months, ...
Duration.fromISO("-P1D"); // Negative: -1 day
```

---

### 3️⃣ Advanced Format Plugin

Extended format tokens for specialized formatting needs.

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import advancedFormatPlugin from "@bereasoftware/timeguard/plugins/advanced-format";

// Install plugin
PluginManager.use(advancedFormatPlugin, TimeGuard);

const date = TimeGuard.from("2024-03-13 14:30:00");

// Advanced tokens become available
date.format("Do MMMM YYYY"); // "13th March 2024"
date.format("Q [Q] YYYY"); // "1 Q 2024"
date.format("[Week] w, YYYY"); // "Week 11, 2024"
date.format("W [of] ww"); // "11 of 11"
date.format("gggg-[W]ww"); // "2024-W11" (ISO week)
date.format("GGGG-[W]WW"); // 2024-W11 (alternative)

// Timezone abbreviation
date.format("HH:mm zzz"); // "14:30 UTC"

// 24-hour (k = 1-24 instead of 0-23)
date.format("k:mm"); // "14:30"

// Unix timestamps
date.format("X"); // Unix seconds
date.format("x"); // Unix milliseconds
```

**Advanced Format Tokens:**

```
Q                               // Quarter (1, 2, 3, 4)
Do                              // Ordinal day (1st, 2nd, 3rd, etc.)
w                               // Week of year (no padding)
ww                              // Week of year (zero-padded)
W                               // ISO week number
gggg                            // ISO week year
GGGG                            // Alternative ISO week year
k / kk                          // 24-hour format (1-24)
X                               // Unix seconds
x                               // Unix milliseconds
zzz                             // Timezone abbreviation (UTC, EST, etc.)
```

---

### Plugin Architecture

All plugins implement `ITimeGuardPlugin`:

```typescript
interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(TimeGuardClass: typeof TimeGuard): void;
}
```

### Creating Custom Plugins

```typescript
import { TimeGuard } from "@bereasoftware/timeguard";
import type { ITimeGuardPlugin } from "@bereasoftware/timeguard/types";

class MyCustomPlugin implements ITimeGuardPlugin {
  name = "my-plugin";
  version = "1.0.0";

  install(TimeGuardClass: typeof TimeGuard): void {
    // Add method to TimeGuard prototype
    (TimeGuardClass.prototype as any).myMethod = function () {
      return "Hello from my plugin!";
    };
  }
}

// Use it
const plugin = new MyCustomPlugin();
PluginManager.use(plugin, TimeGuard);

// Now available
const date = TimeGuard.now();
date.myMethod(); // "Hello from my plugin!"
```

**📖 Full Plugin Details:** See [PLUGINS.md](PLUGINS.md) for extended documentation.

---

## 🎯 Complete API Reference

### Factory Methods

```typescript
// Create current date/time
TimeGuard.now();
TimeGuard.now({ locale: "es", timezone: "America/Mexico_City" });

// Create from various inputs
TimeGuard.from("2024-03-13");
TimeGuard.from("2024-03-13T14:30:00");
TimeGuard.from(new Date());
TimeGuard.from(1234567890000); // milliseconds
TimeGuard.from(1234567890, { timezone: "UTC" }); // seconds
TimeGuard.from("2024-03-13", { locale: "es" });

// Create from Temporal object
TimeGuard.fromTemporal(temporalPlainDateTime, config);
```

### 🔄 Conversion Methods

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45");

date.toDate(); // Convert to JavaScript Date
date.toTemporal(); // Get underlying Temporal object
date.toISOString(); // ISO 8601: "2024-03-13T14:30:45Z"
date.toJSON(); // JSON serialization (ISO string)
date.toString(); // Human readable: "2024-03-13 14:30:45"

date.valueOf(); // Milliseconds since epoch
date.unix(); // Seconds since epoch
```

### ➕ Manipulation Methods

```typescript
const date = TimeGuard.from("2024-03-13 14:30:00");

// Add time - accepts partial record of units
date.add({ days: 5 });
date.add({ months: 1, days: 5 });
date.add({ years: 1, hours: 2, minutes: 30 });

// Subtract time - same syntax as add
date.subtract({ days: 5 });
date.subtract({ months: 1 });

// Set specific component(s)
date.set({ day: 15 }); // Keep other components
date.set({ hour: 10, minute: 0 });
date.set({ year: 2025, month: 1, day: 1 });

// Start/End of period
date.startOf("year"); // 2024-01-01 00:00:00
date.startOf("month"); // 2024-03-01 00:00:00
date.startOf("day"); // 2024-03-13 00:00:00
date.startOf("hour"); // 2024-03-13 14:00:00
date.endOf("year"); // 2024-12-31 23:59:59
date.endOf("month"); // 2024-03-31 23:59:59

date.clone(); // Create independent copy
```

### 🔍 Component Accessors (Getters)

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45.123");

// Date components
date.year(); // 2024
date.month(); // 3 (January = 1, December = 12)
date.day(); // 13
date.quarter(); // 1 (Q1, Q2, Q3, or Q4)

// Time components
date.hour(); // 14
date.minute(); // 30
date.second(); // 45
date.millisecond(); // 123

// Week/Day information
date.dayOfWeek(); // 3 (1=Sunday, 7=Saturday)
date.dayOfYear(); // 73
date.weekOfYear(); // 11

// Month/Year information
date.daysInMonth(); // 31
date.daysInYear(); // 366 (leap year)
date.inLeapYear(); // true
```

### ⚖️ Comparison Methods

```typescript
const date1 = TimeGuard.from("2024-03-13");
const date2 = TimeGuard.from("2024-03-20");

// Direct comparison
date1.isBefore(date2); // true
date1.isAfter(date2); // false
date1.isSame(date1); // true

// Unit-specific comparison
date1.isSame(date2, "month"); // true (same month)
date1.isSame(date2, "year"); // true (same year)
date1.isSame(date2, "day"); // false (different day)

// Range checking
date1.isBetween(date1, date2); // true
date1.isBetween(date1, date2, undefined, "[]"); // inclusive both ends
date1.isBetween(date1, date2, undefined, "()"); // exclusive both ends
date1.isBetween(date1, date2, "month", "[]"); // granular range

// Calculate difference
date1.diff(date2, "days"); // -7
date1.diff(date2, "millisecond"); // difference in ms
date1.diff(date2, "months"); // -0
```

### 📊 Advanced Calculations

```typescript
const date = TimeGuard.from("2024-01-15");
const future = TimeGuard.from("2024-05-20");

// Duration: Get complete breakdown
const duration = date.until(future);
// { years: 0, months: 4, days: 5, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }

// Rounding: Precision control
date.round({ smallestUnit: "millisecond" }); // Default, no change
date.round({ smallestUnit: "second" }); // Removes milliseconds
date.round({ smallestUnit: "minute" }); // 2024-03-13 14:30:00
date.round({ smallestUnit: "hour" }); // 2024-03-13 14:00:00
date.round({ smallestUnit: "day" }); // 2024-03-13 00:00:00

// Rounding modes
date.round({
  smallestUnit: "minute",
  roundingMode: "halfExpand", // Default: round to nearest
});

date.round({
  smallestUnit: "minute",
  roundingMode: "ceil", // Always round up
});
```

### 🌍 Locale & Timezone

```typescript
const date = TimeGuard.from("2024-03-13 14:30:00");

// Get/Set locale
date.locale(); // Returns current locale: 'en'
date.locale("es"); // Set locale, returns new instance

// Format in different locales
date.format("YYYY-MM-DD"); // 2024-03-13
date.locale("es").format("DD MMMM YYYY"); // 13 marzo 2024
date.locale("es-mx").format("DD/MM/YYYY"); // 13/03/2024
date.locale("fr").format("dddd, DD MMMM YYYY"); // mercredi, 13 mars 2024
date.locale("de").format("DD. MMMM YYYY"); // 13. März 2024
date.locale("ja").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-cn").format("YYYY年M月D日"); // 2024年3月13日
date.locale("ar").format("DD MMMM YYYY"); // 13 مارس 2024

// Get/Set timezone
date.timezone(); // Returns current timezone: 'UTC'
const inNYC = date.timezone("America/New_York");
const inTokyo = date.timezone("Asia/Tokyo");
const inDubai = date.timezone("Asia/Dubai");

// Format with timezone info
inNYC.format("YYYY-MM-DD HH:mm:ss Z"); // 2024-03-13 10:30:00 -04:00
inTokyo.format("YYYY-MM-DD HH:mm:ss Z"); // 2024-03-13 23:30:00 +09:00

// Get all available locales
import { getAvailableLocales } from "@bereasoftware/timeguard";
getAvailableLocales(); // Array of 40+ locale codes
```

### 🎨 Format Patterns

#### Format Presets

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45.123");

// Built-in presets
date.format("iso"); // 2024-03-13T14:30:45.123Z
date.format("date"); // 2024-03-13
date.format("time"); // 14:30:45
date.format("datetime"); // 2024-03-13 14:30:45
date.format("rfc2822"); // Wed, 13 Mar 2024 14:30:45 +0000
date.format("rfc3339"); // 2024-03-13T14:30:45Z
date.format("utc"); // 2024-03-13T14:30:45.123Z
```

#### Format Tokens

```typescript
// Year
'YYYY'                          // 2024 (4-digit)
'YY'                            // 24 (2-digit)

// Month
'MMMM'                          // March
'MMM'                           // Mar
'MM'                            // 03 (zero-padded)
'M'                             // 3 (no padding)

// Day
'DDDD' or 'DDD'                 // Monday (full day name)
'ddd'                           // Mon (abbreviated)
'DD'                            // 13 (zero-padded)
'D'                             // 13 (no padding)

// Hours, minutes, seconds
'HH'                            // 14 (24-hour, zero-padded)
'H'                             // 14
'hh'                            // 02 (12-hour, zero-padded)
'h'                             // 2
'mm'                            // 30
'm'                             // 30
'ss'                            // 45
's'                             // 45
'A'                             // AM or PM
'a'                             // am or pm

// Milliseconds & Week
'SSS'                           // 123 (milliseconds)
'SS'                            // 12
'S'                             // 1
'ww'                            // 11 (week with padding)
'w'                             // 11 (week no padding)

// Escaped text
'[text]'                        // Protects text: [UTC]
'"text"'                        // Alternative protection: "o'clock"
```

#### Custom Format Examples

```typescript
date.format("YYYY-MM-DD"); // 2024-03-13
date.format("DD/MM/YYYY"); // 13/03/2024
date.format("MMMM D, YYYY"); // March 13, 2024
date.format("dddd, MMMM D, YYYY"); // Wednesday, March 13, 2024
date.format("DD-MMMM-YY"); // 13-Mar-24
date.format("h:mm A"); // 2:30 PM
date.format("HH:mm:ss"); // 14:30:45
date.format("[Today is] dddd"); // Today is Wednesday
date.format("HH:mm [UTC]"); // 14:30 UTC
date.format('DD/MM/YYYY "at" HH:mm'); // 13/03/2024 at 14:30
```

**📖 Complete Format Guide:** See [EXAMPLES.md](EXAMPLES.md) for more patterns and use cases.

---

## 🔌 Framework Integrations
<a id="framework-integrations"></a>

TimeGuard includes high-performance, native integrations for **React**, **Vue**, and **Angular** packaged under specific subpath exports. These integrations are built following SOLID principles and optimized to prevent memory leaks and unnecessary change detection/rendering cycles.

### 📦 Installing Optional Peer Dependencies

Since framework integrations are optional, ensure you have the respective framework packages installed in your project:

```bash
# For React
npm install react react-dom

# For Vue
npm install vue

# For Angular
npm install @angular/core rxjs
```

---

### ⚛️ React (`@bereasoftware/timeguard/react`)

The React integration exposes custom reactive hooks backed by a global context configuration provider.

#### 1. Global Context: `TimeGuardProvider`
Provides a default configuration (such as locale or timezone) down the React component tree.

```tsx
import React from 'react';
import { TimeGuardProvider } from '@bereasoftware/timeguard/react';

export function App() {
  return (
    <TimeGuardProvider config={{ locale: 'en', timezone: 'America/New_York' }}>
      <MyComponent />
    </TimeGuardProvider>
  );
}
```

#### 2. Reactive Hooks

*   **`useTimeGuard(input, config?)`**:
    Creates a reactive `TimeGuard` instance that automatically updates when input or configuration changes. Inherits configuration from the global context provider as a fallback.
    ```tsx
    import { useTimeGuard } from '@bereasoftware/timeguard/react';

    function DateDisplay({ dateString }) {
      const tg = useTimeGuard(dateString);
      return <p>Date: {tg.format('LL')}</p>;
    }
    ```

*   **`useCurrentTime(options?)`**:
    Returns a reactive `TimeGuard` representing the current time, ticking automatically at the specified interval (defaults to `1000ms`).
    ```tsx
    import { useCurrentTime } from '@bereasoftware/timeguard/react';

    function LiveClock() {
      const now = useCurrentTime({ interval: 1000 });
      return <h2>Current Time: {now.format('HH:mm:ss')}</h2>;
    }
    ```

*   **`useRelativeTime(date, options?)`**:
    Returns a dynamic relative time string (e.g. *"5 minutes ago"*) that is periodically updated at a regular interval (defaults to `60000ms`).
    ```tsx
    import { useRelativeTime } from '@bereasoftware/timeguard/react';

    function CommentTime({ createdAt }) {
      const relative = useRelativeTime(createdAt, { interval: 30000 }); // updates every 30s
      return <span>Published {relative}</span>;
    }
    ```

*   **`useTimeRange(start, end, config?)`**:
    Creates and manages a reactive `TimeRange` instance that updates when start, end, or configuration options change.
    ```tsx
    import { useTimeRange } from '@bereasoftware/timeguard/react';

    function EventRange({ start, end }) {
      const range = useTimeRange(start, end);
      return (
        <div>
          <p>Total duration: {range.duration().humanize()}</p>
          <p>Is happening now?: {range.contains('now') ? 'Yes' : 'No'}</p>
        </div>
      );
    }
    ```

---

### 🟢 Vue (`@bereasoftware/timeguard/vue`)

The Vue integration supports Vue 3 Composition API composables, a global setup plugin, and a custom directive.

#### 1. Registering the Plugin: `TimeGuardVuePlugin`
Registers the `v-timeguard` directive globally and configures defaults via `provide`/`inject`.

```typescript
import { createApp } from 'vue';
import { TimeGuardVuePlugin } from '@bereasoftware/timeguard/vue';
import App from './App.vue';

const app = createApp(App);

// Register plugin with default options
app.use(TimeGuardVuePlugin, {
  locale: 'en',
});

app.mount('#app');
```

#### 2. Custom Directive: `v-timeguard`
A declarative and highly reactive directive for rendering formatted or relative dates directly in templates. Automatically cleans up polling intervals to prevent memory leaks when components unmount.

```html
<!-- Standard formatting -->
<span v-timeguard:format="date" data-pattern="DD MMMM YYYY"></span>

<!-- Live relative time (recalculates every minute by default) -->
<span v-timeguard:relative="date"></span>

<!-- Real-time clock (updates every second) -->
<span v-timeguard:format="'now'" data-pattern="HH:mm:ss" data-live="true" data-interval="1000"></span>
```

#### 3. Composition API Composables
*   **`useTimeGuard(input, config?)`**: Returns a reactive `Ref<TimeGuard>`.
*   **`useCurrentTime(options?)`**: Returns a reactive `Ref<TimeGuard>` of the current time, with automatic interval cleanup on unmount.
*   **`useRelativeTime(date, options?)`**: Returns a reactive `Ref<string>` containing the relative time representation, with built-in deep watching.

```html
<script setup>
import { useCurrentTime, useRelativeTime } from '@bereasoftware/timeguard/vue';

const now = useCurrentTime({ interval: 1000 });
const relative = useRelativeTime('2026-05-20T08:00:00');
</script>

<template>
  <div>
    <p>Current Time: {{ now.format('HH:mm:ss') }}</p>
    <p>Published: {{ relative }}</p>
  </div>
</template>
```

---

### 🅰️ Angular (`@bereasoftware/timeguard/angular`)

The Angular integration is optimized for highly reactive Change Detection strategies (like `OnPush`). It provides dependency-injectable services and pure/impure pipes that run polling intervals outside Angular's Zone to maximize rendering performance.

#### 1. Global Setup Injection Token: `TIME_GUARD_CONFIG`
Registers a global configuration at module or root level.

```typescript
import { NgModule } from '@angular/core';
import { TIME_GUARD_CONFIG } from '@bereasoftware/timeguard/angular';

@NgModule({
  providers: [
    {
      provide: TIME_GUARD_CONFIG,
      useValue: { locale: 'en' }
    }
  ]
})
export class AppModule {}
```

#### 2. Provided Pipes

*   **`TimeGuardFormatPipe` (`timeGuardFormat`)**:
    A pure pipe designed for lightning-fast date-time formatting in templates.
    ```html
    <p>{{ createdDate | timeGuardFormat:'DD/MM/YYYY' }}</p>
    ```

*   **`TimeGuardRelativePipe` (`timeGuardRelative`)**:
    An impure pipe for showing humanized relative time representations.
    ```html
    <p>Published {{ createdDate | timeGuardRelative }}</p>
    ```

*   **`TimeGuardLiveFormatPipe` (`timeGuardLiveFormat`)**:
    An optimized impure pipe utilizing `ChangeDetectorRef` to update live ticking clocks or dates without re-evaluating the entire component tree.
    ```html
    <!-- Real-time clock updating every second -->
    <h2>Current Time: {{ 'now' | timeGuardLiveFormat:'HH:mm:ss':1000 }}</h2>

    <!-- Dynamic format updater for static date -->
    <p>Last update: {{ updateDate | timeGuardLiveFormat:'YYYY-MM-DD HH:mm:ss':5000 }}</p>
    ```

#### 3. Reactive Observable Service: `TimeGuardService`
Exposes an injectable service featuring RxJS streams.
`getCurrentTime()` returns an observable current time. Crucially, the polling ticks run **outside Angular's zone** (`runOutsideAngular`) and only re-enter Angular's zone (`NgZone.run`) when emitting values, reducing change detection churn and CPU usage in large-scale applications.

```typescript
import { Component, OnInit } from '@angular/core';
import { TimeGuardService } from '@bereasoftware/timeguard/angular';
import { Observable } from 'rxjs';
import { TimeGuard } from '@bereasoftware/timeguard';

@Component({
  selector: 'app-clock',
  template: `
    <div *ngIf="time$ | async as time">
      Time: {{ time.format('HH:mm:ss') }}
    </div>
  `
})
export class ClockComponent implements OnInit {
  time$!: Observable<TimeGuard>;

  constructor(private timeGuardService: TimeGuardService) {}

  ngOnInit() {
    this.time$ = this.timeGuardService.getCurrentTime(1000);
  }
}
```

---

## 🧪 Testing

TimeGuard includes **530+ comprehensive tests** covering:

- ✅ Core functionality (creation, manipulation, querying)
- ✅ Advanced features (timezones, locales, formatting)
- ✅ Edge cases (leap years, month boundaries, DST)
- ✅ SOLID principle validation
- ✅ Type safety verification

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- locales.test.ts

# Watch mode
npm test -- --watch
```

### Test Coverage

```
Core functionality:        65+ tests
Advanced features:        50+ tests
Locale support:          100+ tests
Integration scenarios:   250+ tests
Edge cases:              65+ tests
```

---

## 🏛️ Architecture

TimeGuard is built on **SOLID principles** ensuring clean, maintainable, and extensible code:

### Key Principles

- **Single Responsibility** - Each class has one reason to change
- **Open/Closed** - Open for extension, closed for modification
- **Liskov Substitution** - Proper interface contracts
- **Interface Segregation** - Minimal, focused interfaces
- **Dependency Inversion** - Depend on abstractions, not concretions

### Design Patterns

- **Factory Pattern** - Date creation and parsing
- **Adapter Pattern** - Temporal API abstraction
- **Strategy Pattern** - Multiple formatting strategies
- **Singleton Pattern** - Locale manager
- **Facade Pattern** - Simple public API
- **Immutable Pattern** - Safe data handling

**📖 Deep Dive:** See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture explanation.

---

## 🔧 Development

### Build

```bash
# Build for production
npm run build

# Watch mode for development
npm run dev
```

### Project Structure

```
timeguard/
├── src/
│   ├── core.ts                  # Full implementation (~8.5KB gzip, EN/ES) — no side effects
│   ├── index.ts                 # Single entry point: re-exports core, assumes native `globalThis.Temporal`
│   ├── adapters/
│   │   └── temporal.adapter.ts  # Temporal API wrapper (never imports a polyfill)
│   ├── calendars/               # 6 calendar systems
│   ├── formatters/
│   │   └── date.formatter.ts    # Format strategies
│   ├── locales/                 # 40+ locale files
│   ├── plugins/                 # 3 plugins (relative-time, duration, advanced-format)
│   └── types/                   # Type definitions
├── test/
│   ├── time-guard.test.ts       # TimeGuard class tests
│   ├── advanced.test.ts         # Advanced tests
│   ├── comprehensive.test.ts    # Integration tests
│   ├── locales.test.ts          # Locale tests
│   ├── plugins.test.ts          # Plugin tests
│   └── bundle-size.test.ts      # Bundle size validation
└── vite.config.ts               # Unified config (3 build modes)
```

---

## 🤝 Contributing

We welcome contributions! Please:

1. Follow SOLID principles and existing code patterns
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass (`npm test`)
5. Check types pass (`npx tsc --noEmit`)

---

## 📄 License

MIT License © 2024 Berea-Soft

See [LICENSE](LICENSE) file for details.

---

## 🔗 Quick Links

- 📖 [Full API Reference](EXAMPLES.md)
- 🏛️ [Architecture Guide](ARCHITECTURE.md)
- 🌍 [Localization Guide](LOCALES.md)
- 🐛 [Issue Tracker](https://github.com/bereasoftware/timeguard/issues)
- 💬 [Discussions](https://github.com/bereasoftware/timeguard/discussions)

---

## 🤝 Contributors

Thanks to all contributors!

<a href="https://github.com/Berea-Soft/timeguard/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Berea-Soft/timeguard" alt="contributors" />
</a>

---

## 📞 Support

For questions, issues, or feature requests:

- Open an issue on GitHub
- Start a discussion
- Check existing documentation

---

## Built with ❤️ by Berea-Soft

A modern date/time library with SOLID principles and TypeScript
