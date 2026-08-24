# TimeGuard Plugins Guide

## Overview

TimeGuard includes an optional plugin system that extends the core functionality without bloating the main library. All plugins follow SOLID principles and are designed to be composable.

## Quick Start

### Basic Plugin Usage

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";
import durationPlugin from "@bereasoftware/timeguard/plugins/duration";

// Register plugins
PluginManager.use(relativeTimePlugin, TimeGuard);
PluginManager.use(durationPlugin, TimeGuard);

// Now use plugin features
const date = TimeGuard.from("2024-03-13T10:30:00");
console.log(date.fromNow()); // "a few seconds ago"
console.log(date.toNow()); // "in 3 seconds"
```

---

## 📦 Available Plugins

### 1. Relative Time Plugin

Adds human-readable time differences.

#### Installation

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";

PluginManager.use(relativeTimePlugin, TimeGuard);
```

#### Methods

**`.fromNow(withoutSuffix?: boolean): string`**
Returns time difference from now in the past.

```typescript
const pastDate = TimeGuard.from("2024-03-10");
console.log(pastDate.fromNow()); // "3 days ago"
console.log(pastDate.fromNow(true)); // "3 days"
```

**`.toNow(withoutSuffix?: boolean): string`**
Returns time difference to future.

```typescript
const futureDate = TimeGuard.from("2024-03-20");
console.log(futureDate.toNow()); // "in 7 days"
console.log(futureDate.toNow(true)); // "7 days"
```

**`.humanize(other?: TimeGuard, withoutSuffix?: boolean): string`**
Get human-readable duration between two dates.

```typescript
const date1 = TimeGuard.from("2024-03-13");
const date2 = TimeGuard.from("2024-03-20");
console.log(date1.humanize(date2)); // "in 7 days"
```

#### Examples

```typescript
// Past events
TimeGuard.from("2024-01-01").fromNow(); // "2 months ago"
TimeGuard.from("2024-03-13 14:00").fromNow(); // "30 minutes ago"

// Future events
TimeGuard.from("2024-04-01").toNow(); // "in 19 days"
TimeGuard.from("2024-03-14").toNow(); // "in 1 day"

// Without suffix
TimeGuard.from("2024-03-10").fromNow(true); // "3 days"
TimeGuard.from("2024-03-20").toNow(true); // "7 days"
```

#### Customization

```typescript
import { RelativeTimePlugin } from "@bereasoftware/timeguard/plugins/relative-time";

const customPlugin = new RelativeTimePlugin({
  rounding: Math.floor, // Use floor instead of round
  thresholds: [
    { l: "s", r: 44, d: "second" },
    { l: "m", r: 89 },
    { l: "mm", r: 44, d: "minute" },
    // ... custom thresholds
  ],
});

PluginManager.use(customPlugin, TimeGuard);

// Customize formats
customPlugin.setFormats({
  past: "{0} atrás",
  future: "en {0}",
  s: "hace un segundo",
  m: "hace un minuto",
});
```

---

### 2. Duration Plugin

Implements ISO 8601 duration support for time spans and calculations.

#### Installation

```typescript
import { TimeGuard, PluginManager, Duration } from "@bereasoftware/timeguard";
import durationPlugin from "@bereasoftware/timeguard/plugins/duration";

PluginManager.use(durationPlugin, TimeGuard);
```

#### Methods

**`Duration.fromISO(iso: string): Duration`**
Create duration from ISO 8601 string.

```typescript
const duration = Duration.fromISO("P3Y6M4DT12H30M5S");
console.log(duration.humanize()); // "3 years, 6 months, 4 days, 12 hours, 30 minutes, 5 seconds"
```

**`Duration.between(from: TimeGuard, to: TimeGuard): Duration`**
Get duration between two dates.

```typescript
const from = TimeGuard.from("2024-01-01");
const to = TimeGuard.from("2024-12-31");
const duration = Duration.between(from, to);

console.log(duration.asDays()); // 364
console.log(duration.toISO()); // "P364D"
```

**`Duration.fromMilliseconds(ms: number): Duration`**
Create duration from milliseconds.

```typescript
const duration = Duration.fromMilliseconds(86400000);
console.log(duration.asDays()); // 1
```

#### Duration Methods

```typescript
const duration = Duration.fromISO("P2Y3M4DT5H6M7S");

// Get in specific units
duration.as("years"); // ~2.25
duration.asYears(); // ~2.25
duration.asMonths(); // ~27
duration.asDays(); // ~824
duration.asHours(); // ~19776
duration.asMinutes(); // ~1186560
duration.asSeconds(); // ~71193607

// Get components
duration.toObject();
// {
//   years: 2,
//   months: 3,
//   days: 4,
//   hours: 5,
//   minutes: 6,
//   seconds: 7,
// }

// Format
duration.toISO(); // "P2Y3M4DT5H6M7S"
duration.humanize(); // "2 years, 3 months, 4 days, 5 hours, 6 minutes, 7 seconds"

// Check
duration.isNegative(); // false
duration.abs(); // Returns absolute duration
```

#### Examples

```typescript
// Calculate durations
const birthday = TimeGuard.from("1990-03-13");
const today = TimeGuard.now();
const age = Duration.between(birthday, today);

console.log(age.asYears()); // ~34.something

// Compare durations
const projectStart = TimeGuard.from("2024-01-01");
const projectEnd = TimeGuard.from("2024-06-30");
const projectDuration = Duration.between(projectStart, projectEnd);

console.log(projectDuration.asDays()); // 182
console.log(projectDuration.humanize()); // "6 months, 4 days"

// Parse ISO 8601
const sprint = Duration.fromISO("P2W3D");
console.log(sprint.asDays()); // 17
console.log(sprint.humanize()); // "2 weeks, 3 days"
```

---

### 3. Advanced Format Plugin

Adds advanced format tokens for specialized formatting needs.

#### Installation

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import advancedFormatPlugin from "@bereasoftware/timeguard/plugins/advanced-format";

PluginManager.use(advancedFormatPlugin, TimeGuard);
```

#### Advanced Tokens

| Token  | Description                   | Example                    |
| ------ | ----------------------------- | -------------------------- |
| `Q`    | Quarter                       | 1, 2, 3, 4                 |
| `Do`   | Ordinal day                   | 13th, 21st, 2nd            |
| `w`    | Week of year                  | 1, 2, ..., 52              |
| `ww`   | Week of year (padded)         | 01, 02, ..., 52            |
| `W`    | ISO week                      | 1, 2, ..., 53              |
| `WW`   | ISO week (padded)             | 01, 02, ..., 53            |
| `gggg` | Week year                     | 2024                       |
| `GGGG` | ISO week year                 | 2024                       |
| `k`    | Hour (1-24)                   | 1, 2, ..., 24              |
| `kk`   | Hour (1-24, padded)           | 01, 02, ..., 24            |
| `X`    | Unix timestamp (seconds)      | 1710337800                 |
| `x`    | Unix timestamp (milliseconds) | 1710337800000              |
| `z`    | Timezone short                | UTC, EST                   |
| `zzz`  | Timezone long                 | Coordinated Universal Time |

#### Examples

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45");

// Quarter
date.format("Q"); // "1"
date.format("[Q]Q YYYY"); // "Q1 2024"

// Ordinal day
date.format("Do MMMM YYYY"); // "13th March 2024"

// Week numbers
date.format("w [week]"); // "11 week"
date.format("[ISO week] W"); // "ISO week 11"
date.format("GGGG-WW"); // "2024-11"

// Time formats
date.format("k:mm:ss"); // "14:30:45"
date.format("X"); // Unix seconds
date.format("x"); // Unix milliseconds

// Timezone
date.format("YYYY-MM-DD HH:mm:ss z");
// "2024-03-13 14:30:45 UTC"

// Complex patterns
date.format("[Q]Q YYYY, dddd [week] w, [Day] Do");
// "Q1 2024, Wednesday week 11, Day 13th"
```

---

## 🔧 Plugin Management

### Registering Plugins

```typescript
// Register single plugin
PluginManager.use(relativeTimePlugin, TimeGuard);

// Register multiple plugins
PluginManager.useMultiple(
  [relativeTimePlugin, durationPlugin, advancedFormatPlugin],
  TimeGuard,
);
```

### Checking Plugins

```typescript
// Check if plugin is registered
if (PluginManager.hasPlugin("relative-time")) {
  console.log("Relative time plugin is active");
}

// List registered plugins
const plugins = PluginManager.listPlugins();
console.log(plugins); // ['relative-time', 'duration', 'advanced-format']

// Get plugin instance
const plugin = PluginManager.getPlugin("duration");
```

### Unregistering Plugins

```typescript
// Unregister a plugin
PluginManager.unuse("relative-time");

// Clear all plugins
PluginManager.clear();
```

---

## 📝 Advanced Usage

### Using Multiple Plugins Together

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import {
  relativeTimePlugin,
  durationPlugin,
  advancedFormatPlugin,
} from "@bereasoftware/timeguard/plugins";

// Register all plugins
PluginManager.use(relativeTimePlugin, TimeGuard);
PluginManager.use(durationPlugin, TimeGuard);
PluginManager.use(advancedFormatPlugin, TimeGuard);

// Now use combined features
const projectStart = TimeGuard.from("2024-01-01 10:00:00");
const today = TimeGuard.now();

console.log(projectStart.fromNow()); // "2 months, 12 days ago"
console.log(projectStart.duration(today).asDays()); // 72.42...
console.log(projectStart.format("[Q]Q YYYY")); // "Q1 2024"
console.log(today.format("Do MMMM YYYY")); // "13th March 2024"
```

### Creating Custom Configuration

```typescript
import { RelativeTimePlugin } from "@bereasoftware/timeguard/plugins/relative-time";
import { DurationPlugin } from "@bereasoftware/timeguard/plugins/duration";

// Custom relative time
const customRelative = new RelativeTimePlugin({
  rounding: Math.floor,
  thresholds: [
    { l: "s", r: 60, d: "second" },
    { l: "min", r: 60, d: "minute" },
    { l: "h", r: 24, d: "hour" },
    { l: "d", r: 30, d: "day" },
  ],
});

customRelative.setFormats({
  future: "Dentro de %s",
  past: "Hace %s",
  s: "unos segundos",
  m: "un minuto",
  mm: "%d minutos",
  h: "una hora",
  hh: "%d horas",
  d: "un día",
  dd: "%d días",
});

PluginManager.use(customRelative, TimeGuard);
```

---

## ⚡ Performance Considerations

- Plugins are **lazy-loaded** - no overhead until registered
- Use **composition** - only register needed plugins
- **Tree-shakeable** - bundlers remove unused plugins
- Each plugin runs in **isolated scope** - no pollution

---

## 🐛 Troubleshooting

### Plugin methods not available

**Problem:** Methods like `.fromNow()` are undefined

**Solution:** Make sure to register the plugin before using it:

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";

// Register FIRST
PluginManager.use(relativeTimePlugin, TimeGuard);

// Then use
const date = TimeGuard.now();
console.log(date.fromNow()); // Now works!
```

### Multiple instances confusion

**Problem:** One plugin affects all TimeGuard instances

**Solution:** Plugin modifications are **global** - they affect all instances once registered:

```typescript
const plugin = new RelativeTimePlugin({
  /* config */
});
PluginManager.use(plugin, TimeGuard);

// All TimeGuard instances now have .fromNow(), .toNow(), .humanize()
const date1 = TimeGuard.now();
const date2 = TimeGuard.from("2024-01-01");
console.log(date1.fromNow()); // Works
console.log(date2.fromNow()); // Also works
```

---

## 📚 Creating Custom Plugins

To create a custom plugin, implement the `ITimeGuardPlugin` interface:

```typescript
import type { ITimeGuardPlugin } from "@bereasoftware/timeguard";
import type { TimeGuard } from "@bereasoftware/timeguard";

export class MyPlugin implements ITimeGuardPlugin {
  name = "my-plugin";
  version = "1.0.0";

  install(TimeGuardClass: typeof TimeGuard): void {
    (TimeGuardClass.prototype as any).myMethod = function() {
      return "Hello from my plugin!";
    };
  }
}
```

Then register:

```typescript
PluginManager.use(new MyPlugin(), TimeGuard);
```

---

## 📖 API Reference

Full API reference for each plugin:

- **RelativeTimePlugin**: `.fromNow()`, `.toNow()`, `.humanize()`
- **DurationPlugin**: `Duration.fromISO()`, `Duration.between()`, `Duration.fromMilliseconds()`
- **AdvancedFormatPlugin**: Advanced format tokens (Q, Do, w, W, etc.)

---

## 🎯 Next Steps

- Try combining plugins for powerful date/time operations
- Create custom plugins for domain-specific needs
- Check [examples](../EXAMPLES.md) for real-world usage
