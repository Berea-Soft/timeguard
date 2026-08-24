# TimeGuard Locales

All translations are organized in separate files by language family for better maintainability.

## 📁 File Structure

### Locales by Region

```
src/locales/
├── index.ts                      # Main index that aggregates all locales
├── locale.manager.ts             # Locale manager (singleton)
├── english.locale.ts             # English - 4 variants (en, en-au, en-gb, en-ca)
├── spanish.locale.ts             # Spanish - 3 variants (es, es-mx, es-us)
├── romance.locale.ts             # French, Italian, Portuguese - 5 variants
├── slavic.locale.ts              # Russian, Polish, Czech, Slovak - 4 variants
├── nordic.locale.ts              # Swedish, Norwegian, Danish, Finnish - 4 variants
├── asian.locale.ts               # Japanese, Chinese, Korean, Thai, Vietnamese, Indonesian - 7 variants
├── european.locale.ts            # German, Dutch, Greek, Hungarian, Basque, Catalan, Turkish - 7 variants
└── middle-eastern.locale.ts      # Arabic, Hebrew, Hindi - 3 variants
```

## 🌍 Available Locales (40+)

### English (4)

- `en` - English (US)
- `en-au` - Australian English
- `en-gb` - British English
- `en-ca` - Canadian English

### Spanish (3)

- `es` - Spanish
- `es-mx` - Mexican Spanish
- `es-us` - US Spanish

### Romance Languages (5)

- `fr` - French
- `it` - Italian
- `pt` - Portuguese
- `pt-br` - Brazilian Portuguese
- `ro` - Romanian

### Slavic Languages (4)

- `ru` - Russian
- `pl` - Polish
- `cs` - Czech
- `sk` - Slovak

### Nordic Languages (4)

- `sv` - Swedish
- `nb` - Norwegian Bokmål
- `da` - Danish
- `fi` - Finnish

### Asian Languages (7)

- `ja` - Japanese
- `zh-cn` - Simplified Chinese
- `zh-tw` - Traditional Chinese
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

## 🛠️ Usage

### Import from public API

```typescript
import {
  ALL_LOCALES,
  getAvailableLocales,
  LOCALES_COUNT,
  registerAllLocales,
} from "@bereasoftware/timeguard";

// Access specific locale
const englishLocale = ALL_LOCALES["en"];
const spanishLocale = ALL_LOCALES["es"];
```

### Use with TimeGuard

```typescript
import {
  TimeGuard,
  getAvailableLocales,
  LOCALES_COUNT,
} from "@bereasoftware/timeguard";

// View all available locales
const locales = getAvailableLocales();
console.log(`Total locales: ${LOCALES_COUNT}`); // 40+

// Use different locales
const date = TimeGuard.from("2024-03-13");

// English
date.locale("en").format("MMMM DD, YYYY"); // "March 13, 2024"

// Spanish
date.locale("es").format("DD [de] MMMM [de] YYYY"); // "13 de marzo de 2024"

// French
date.locale("fr").format("DD MMMM YYYY"); // "13 mars 2024"

// German
date.locale("de").format("DD.MM.YYYY"); // "13.03.2024"

// Japanese
date.locale("ja").format("YYYY年MM月DD日"); // "2024年3月13日"

// Chinese
date.locale("zh-cn").format("YYYY-MM-DD"); // "2024-03-13"

// Russian
date.locale("ru").format("DD.MM.YYYY"); // "13.03.2024"

// Arabic
date.locale("ar").format("DD/MM/YYYY"); // "13/03/2024"

// Thai
date.locale("th").format("DD/MM/YYYY"); // "13/03/2024"

// Hindi
date.locale("hi").format("DD/MM/YYYY"); // "13/03/2024"
```

## 📦 Locale Aggregation

The `src/locales/index.ts` file aggregates all locales:

```typescript
export const ALL_LOCALES: Record<string, ILocale> = {
  ...ENGLISH_LOCALES,
  ...SPANISH_LOCALES,
  ...ROMANCE_LOCALES,
  ...SLAVIC_LOCALES,
  ...NORDIC_LOCALES,
  ...ASIAN_LOCALES,
  ...EUROPEAN_LOCALES,
  ...MIDDLE_EASTERN_LOCALES,
};
```

## 🎯 Benefits of Separate Structure

1. **Modularity** - Each language family is in its own file
2. **Maintainability** - Easy to find and update specific translations
3. **Performance** - Allows tree-shaking to import only what you need
4. **Scalability** - Easy to add new language families
5. **Testing** - Region/language-specific tests

## 🔄 LocaleManager

> **Breaking change in v3:** by default, `LocaleManager` only registers `en`/`es` on init (it used to register all ~47 locales). This keeps the main import lightweight. To restore the old behavior, call `loadAllLocales()` once at app startup:
>
> ```typescript
> import { loadAllLocales } from "@bereasoftware/timeguard";
> loadAllLocales();
> ```

```typescript
const manager = LocaleManager.getInstance();
manager.setLocale("es");
manager.listLocales(); // Returns the registered locales (en/es by default)
```

## 📝 Adding New Locales

To add new locales:

1. Create a new `new.locale.ts` file in `src/locales/`
2. Export the locale data
3. Update `src/locales/index.ts` to import
4. Locales will be automatically loaded

Example:

```typescript
// new-family.locale.ts
import type { ILocale } from '../types';

export const NEW_LOCALE_DATA: ILocale = {
  name: 'xx',
  months: [...],
  weekdays: [...],
  // ...
};

export const NEW_FAMILY_LOCALES: Record<string, ILocale> = {
  'xx': NEW_LOCALE_DATA,
};
```

Then in `index.ts`:

```typescript
import { NEW_FAMILY_LOCALES } from "./new-family.locale";

export const ALL_LOCALES: Record<string, ILocale> = {
  ...EXISTING_LOCALES,
  ...NEW_FAMILY_LOCALES, // ← Add here
};
```
