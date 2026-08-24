# TimeGuard Locales

> 📚 **Documentación disponible en otros idiomas:**
>
> - 🇪🇸 **Español** (este archivo - LOCALES.md)
> - 🇬🇧 [English](LOCALES.en.md)

Todas las traducciones están organizadas en archivos separados por familia de idiomas para mejor mantenibilidad.

## 📁 Estructura de Archivos

### Locales por Región

```
src/locales/
├── index.ts                      # Índice principal que agrega todos los locales
├── locale.manager.ts             # Gestor de locales (singleton)
├── english.locale.ts             # Inglés - 4 variantes (en, en-au, en-gb, en-ca)
├── spanish.locale.ts             # Español - 3 variantes (es, es-mx, es-us)
├── romance.locale.ts             # Francés, Italiano, Portugués - 5 variantes
├── slavic.locale.ts              # Ruso, Polaco, Checo, Eslovaco - 4 variantes
├── nordic.locale.ts              # Sueco, Noruego, Danés, Finlandés - 4 variantes
├── asian.locale.ts               # Japonés, Chino, Coreano, Thai, Vietnamita, Indonesio - 7 variantes
├── european.locale.ts            # Alemán, Holandés, Griego, Húngaro, Euskera, Catalán, Turco - 7 variantes
└── middle-eastern.locale.ts      # Árabe, Hebreo, Hindi - 3 variantes
```

## 🌍 Locales Disponibles (40+)

### Inglés (4)

- `en` - Inglés (US)
- `en-au` - Inglés Australiano
- `en-gb` - Inglés Británico
- `en-ca` - Inglés Canadiense

### Español (3)

- `es` - Español
- `es-mx` - Español Mexicano
- `es-us` - Español US

### Idiomas Románicos (5)

- `fr` - French
- `it` - Italian
- `pt` - Portuguese
- `pt-br` - Brazilian Portuguese
- `ro` - Romanian

### Idiomas Eslavos (4)

- `ru` - Russian
- `pl` - Polish
- `cs` - Czech
- `sk` - Slovak

### Idiomas Nórdicos (4)

- `sv` - Swedish
- `nb` - Norwegian Bokmål
- `da` - Danish
- `fi` - Finnish

### Idiomas Asiáticos (7)

- `ja` - Japanese
- `zh-cn` - Simplified Chinese
- `zh-tw` - Traditional Chinese
- `ko` - Korean
- `th` - Thai
- `vi` - Vietnamese
- `id` - Indonesian

### Idiomas Europeos (7)

- `de` - German
- `nl` - Dutch
- `el` - Greek
- `hu` - Hungarian
- `eu` - Basque
- `ca` - Catalan
- `tr` - Turkish

### Oriente Medio y Asia del Sur (3)

- `ar` - Arabic
- `he` - Hebrew
- `hi` - Hindi

## 🛠️ Uso

### Importar desde la API pública

```typescript
import {
  ALL_LOCALES,
  getAvailableLocales,
  LOCALES_COUNT,
  registerAllLocales,
} from "@bereasoftware/timeguard";

// Acceder a un locale específico
const englishLocale = ALL_LOCALES["en"];
const spanishLocale = ALL_LOCALES["es"];
```

### Usar con TimeGuard

```typescript
import {
  TimeGuard,
  getAvailableLocales,
  LOCALES_COUNT,
} from "@bereasoftware/timeguard";

// Ver todas las locales disponibles
const locales = getAvailableLocales();
console.log(`Total locales: ${LOCALES_COUNT}`); // 40+

// Usar diferentes locales
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

## 📦 Agregación de Locales

El archivo `src/locales/index.ts` agrega todos los locales:

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

## 🎯 Ventajas de la Estructura Separada

1. **Modularidad** - Cada familia de idiomas está en su propio archivo
2. **Mantenibilidad** - Fácil encontrar y actualizar traducciones específicas
3. **Rendimiento** - Permite tree-shaking para importar solo lo necesario
4. **Escalabilidad** - Fácil agregar nuevas familias de idiomas
5. **Testing** - Pruebas específicas por región/idioma

## 🔄 LocaleManager

> **Cambio en v3:** por defecto, `LocaleManager` solo registra `en`/`es` al inicializarse (antes registraba los ~47 locales). Esto mantiene el import principal liviano. Para restaurar el comportamiento anterior, llama `loadAllLocales()` una vez al arrancar tu app:
>
> ```typescript
> import { loadAllLocales } from "@bereasoftware/timeguard";
> loadAllLocales();
> ```

```typescript
const manager = LocaleManager.getInstance();
manager.setLocale("es");
manager.listLocales(); // Retorna las locales registradas (en/es por defecto)
```

## 📝 Agregar nuevas locales

Para agregar nuevas locales:

1. Crear un archivo `nuevo.locale.ts` en `src/locales/`
2. Exportar los datos de locales
3. Actualizar `src/locales/index.ts` para importar
4. Los locales se cargarán automáticamente

Ejemplo:

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

Luego en `index.ts`:

```typescript
import { NEW_FAMILY_LOCALES } from "./new-family.locale";

export const ALL_LOCALES: Record<string, ILocale> = {
  ...EXISTING_LOCALES,
  ...NEW_FAMILY_LOCALES, // ← Agregar aquí
};
```
