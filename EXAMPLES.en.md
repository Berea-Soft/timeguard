# TimeGuard Usage Examples

> 📚 **Documentation available in other languages:**
>
> 🇪🇸 [Español](EXAMPLES.md) | 🇬🇧 **English** (this file)

Comprehensive examples showing common use cases and usage patterns of the TimeGuard library.

## 1. Basic Usage

Creating TimeGuard instances:

```typescript
import { TimeGuard, timeGuard } from "@bereasoftware/timeguard";

// Create instances
const now = TimeGuard.now();
const specificDate = TimeGuard.from("2024-03-13");
const fromTimestamp = TimeGuard.from(Date.now());
const withConfig = TimeGuard.from("2024-03-13", { locale: "es" });

console.log("Basic Usage:");
console.log(now.toString()); // Current date/time
console.log(specificDate.format("YYYY-MM-DD HH:mm:ss")); // 2024-03-13 00:00:00
```

## 2. Arithmetic Operations

Adding and subtracting time:

```typescript
const date = TimeGuard.from("2024-03-13");

console.log("\nArithmetic:");
console.log("Add 5 days:", date.add({ day: 5 }).format("YYYY-MM-DD"));
console.log("Add 1 month:", date.add({ month: 1 }).format("YYYY-MM-DD"));
console.log(
  "Subtract 2 weeks:",
  date.subtract({ week: 2 }).format("YYYY-MM-DD"),
);
console.log(
  "Complex:",
  date
    .add({
      year: 1,
      month: 2,
      day: 5,
      hour: 3,
      minute: 30,
    })
    .format("YYYY-MM-DD HH:mm:ss"),
);
```

## 3. Formatting

Various output formats:

```typescript
const dateTime = TimeGuard.from("2024-03-13T14:30:45.123");

console.log("\nFormatting:");
console.log("ISO:", dateTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
console.log("US Format:", dateTime.format("MM/DD/YYYY"));
console.log("EU Format:", dateTime.format("DD.MM.YYYY"));
console.log("With time:", dateTime.format("YYYY-MM-DD HH:mm:ss"));
console.log("Full text:", dateTime.format("dddd, MMMM D, YYYY"));
console.log("Escaped text:", dateTime.format("[Date: ]YYYY-MM-DD[ at ]HH:mm"));

// Presets
console.log("Preset ISO:", dateTime.format("iso"));
console.log("Preset date:", dateTime.format("date"));
console.log("Preset time:", dateTime.format("time"));
```

## 4. Query Operations

Comparison between dates:

```typescript
const date1 = TimeGuard.from("2024-03-13");
const date2 = TimeGuard.from("2024-03-20");
const date3 = TimeGuard.from("2024-03-13");

console.log("\nQuery Operations:");
console.log("date1 < date2:", date1.isBefore(date2)); // true
console.log("date2 > date1:", date2.isAfter(date1)); // true
console.log("date1 == date3:", date1.isSame(date3)); // true
console.log("Same month:", date1.isSame(date2, "month")); // true
console.log("Same year:", date1.isSame(date2, "year")); // true

// Check if between
const start = TimeGuard.from("2024-03-01");
const middle = TimeGuard.from("2024-03-15");
const end = TimeGuard.from("2024-03-31");
console.log("Is between:", middle.isBetween(start, end)); // true
```

## 5. Manipulation

Date manipulation operations:

```typescript
const original = TimeGuard.from("2024-03-13T14:30:45");

console.log("\nManipulation:");
console.log("Original:", original.format("YYYY-MM-DD HH:mm:ss"));
console.log("Clone:", original.clone().format("YYYY-MM-DD HH:mm:ss"));
console.log(
  "Start of year:",
  original.startOf("year").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "Start of month:",
  original.startOf("month").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "Start of day:",
  original.startOf("day").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "End of month:",
  original.endOf("month").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "Set values:",
  original.set({ month: 12, day: 25 }).format("YYYY-MM-DD"),
);
```

## 6. Differences & Calculations

Calculate differences between dates:

```typescript
const pastDate = TimeGuard.from("2024-01-01");
const futureDate = TimeGuard.from("2024-12-31");

console.log("\nDifferences:");
console.log("Days between:", futureDate.diff(pastDate, "day"));
console.log("Months between:", futureDate.diff(pastDate, "month"));
console.log("Years between:", futureDate.diff(pastDate, "year"));
console.log("Hours between:", futureDate.diff(pastDate, "hour"));
```

## 7. Locale Support

Using different languages:

```typescript
const englishDate = TimeGuard.from("2024-03-13", { locale: "en" });
const spanishDate = englishDate.locale("es");

console.log("\nLocale Support:");
console.log("English:", englishDate.format("MMMM D, YYYY"));
console.log("Spanish:", spanishDate.format("MMMM D, YYYY"));
console.log("Weekday EN:", englishDate.format("dddd"));
console.log("Weekday ES:", spanishDate.format("dddd"));
```

## 8. Conversion Methods

Conversions to different formats:

```typescript
const testDate = TimeGuard.from("2024-03-13T14:30:45.123");

console.log("\nConversion:");
console.log("To Date:", testDate.toDate());
console.log("To ISO:", testDate.toISOString());
console.log("To Unix (ms):", testDate.valueOf());
console.log("To Unix (s):", testDate.unix());
console.log("To JSON:", testDate.toJSON());
console.log("To String:", testDate.toString());
```

## 9. Getters

Retrieving date components:

```typescript
const fullDate = TimeGuard.from("2024-03-13T14:30:45.789");

console.log("\nGetters:");
console.log("Year:", fullDate.get("year"));
console.log("Month:", fullDate.get("month"));
console.log("Day:", fullDate.get("day"));
console.log("Hour:", fullDate.get("hour"));
console.log("Minute:", fullDate.get("minute"));
console.log("Second:", fullDate.get("second"));
console.log("Millisecond:", fullDate.get("millisecond"));
```

## 10. Chaining Operations

Fluid API for multiple operations:

```typescript
console.log("\nChaining:");
const result = TimeGuard.from("2024-03-13")
  .add({ month: 1 })
  .add({ day: 5 })
  .startOf("day")
  .set({ hour: 12 })
  .format("YYYY-MM-DD HH:mm:ss");

console.log("Chained result:", result);
```

## 11. Real-World Use Cases

### Meeting Scheduling

```typescript
const meetingDate = TimeGuard.from("2024-03-15T09:00:00");
const nextWeekMeeting = meetingDate.add({ week: 1 });
const recurringMeeting = meetingDate.add({ week: 2 });

console.log("First meeting:", meetingDate.format("dddd, MMMM D at HH:mm"));
console.log("Next week:", nextWeekMeeting.format("dddd, MMMM D at HH:mm"));
console.log(
  "Recurring (2 weeks):",
  recurringMeeting.format("dddd, MMMM D at HH:mm"),
);
```

### Age Calculation

```typescript
const birthDate = TimeGuard.from("1990-05-15");
const today = TimeGuard.now();
const age = today.diff(birthDate, "year");
console.log(`Born: ${birthDate.format("MMMM D, YYYY")}`);
console.log(`Age: ${age} years`);
```

### Project Deadlines

```typescript
const projectStart = TimeGuard.from("2024-03-01");
const milestone1 = projectStart.add({ month: 1 });
const milestone2 = milestone1.add({ month: 1 });
const deadline = projectStart.add({ month: 3 });

console.log("Start:", projectStart.format("YYYY-MM-DD"));
console.log("Milestone 1:", milestone1.format("YYYY-MM-DD"));
console.log("Milestone 2:", milestone2.format("YYYY-MM-DD"));
console.log("Deadline:", deadline.format("YYYY-MM-DD"));
```

### Business Operations

```typescript
const now_check = TimeGuard.now();
const quarterEnd = now_check.endOf("quarter");
const monthEnd = now_check.endOf("month");

console.log("Current quarter ends:", quarterEnd.format("YYYY-MM-DD"));
console.log("Month ends:", monthEnd.format("YYYY-MM-DD"));
```

### Expiration Checks

```typescript
const subscriptionDate = TimeGuard.from("2024-03-13");
const expirationDate = subscriptionDate.add({ year: 1 });
const isExpired = TimeGuard.now().isAfter(expirationDate);
const daysUntilExpiry = expirationDate.diff(TimeGuard.now(), "day");

console.log("Subscription date:", subscriptionDate.format("YYYY-MM-DD"));
console.log("Expiration date:", expirationDate.format("YYYY-MM-DD"));
console.log("Is expired:", isExpired);
console.log("Days until expiry:", daysUntilExpiry);
```

### Date Range Queries

```typescript
const quarterStart = TimeGuard.from("2024-01-01");
const quarterEnd_check = TimeGuard.from("2024-03-31");
const testDate_check = TimeGuard.from("2024-02-15");

const isInQuarter = testDate_check.isBetween(quarterStart, quarterEnd_check);
console.log(
  `Q1 2024: ${quarterStart.format("YYYY-MM-DD")} to ${quarterEnd_check.format("YYYY-MM-DD")}`,
);
console.log(`Is 2024-02-15 in Q1: ${isInQuarter}`);
```

## 12. Immutability

TimeGuard is immutable - operations return new instances:

```typescript
const original_check = TimeGuard.from("2024-03-13");
const modified = original_check.add({ day: 5 });

console.log("Original unchanged:", original_check.format("YYYY-MM-DD"));
console.log("New instance:", modified.format("YYYY-MM-DD"));
console.log("Are they the same?", original_check === modified);
```

## 13. Type Safety

All operations are fully typed in TypeScript:

```typescript
const tg: TimeGuard = TimeGuard.from("2024-03-13");
const formatted: string = tg.format("YYYY-MM-DD");
const diff: number = tg.diff(TimeGuard.now(), "day");
const isBefore: boolean = tg.isBefore(TimeGuard.now());

console.log("Formatted (string):", formatted, typeof formatted);
console.log("Diff (number):", diff, typeof diff);
console.log("IsBefore (boolean):", isBefore, typeof isBefore);
```
