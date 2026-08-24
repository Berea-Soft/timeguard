<p align="center">
  <img src="https://raw.githubusercontent.com/Berea-Soft/timeguard/refs/heads/main/src/assets/logo.png" alt="timeguard Logo" />
  <h1 align="center">timeguard</h1>
  <p align="center">
    La edición <strong>100% nativa</strong> de TimeGuard: una biblioteca moderna y de nivel producción para manipulación de fechas/horas construida con <strong>TypeScript</strong>, la <strong>Temporal API nativa</strong> y <strong>SOLID principles</strong>. Cero dependencias en runtime, sin polyfill — misma API y funcionalidades que <a href="https://github.com/Berea-Soft/time-guard"><strong>@bereasoftware/time-guard</strong></a>, para entornos que ya exponen <code>Temporal</code> de forma nativa.
  </p>
</p>
<br/>
<br/>

> ℹ️ **¿timeguard o time-guard?** Son dos paquetes hermanos con **idéntica funcionalidad** (comparten la misma implementación central):
> - [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard) — carga automáticamente el polyfill de Temporal. Funciona en cualquier runtime moderno (Node 18+, cualquier navegador), a cambio de ~35KB gzip extra.
> - `@bereasoftware/timeguard` (este paquete) — **cero dependencias en runtime**, asume que `Temporal` ya existe de forma nativa (Node.js ≥26, o un navegador reciente). ~5KB gzip.
>
> Si no estás seguro de qué runtime tienen tus usuarios, usa `time-guard`. Si controlas el entorno de ejecución (backend propio, runtime moderno garantizado), `timeguard` te da el mismo poder con menos peso.

> 📚 **Documentación disponible en otros idiomas:**
>
> - 🇪🇸 **Español** (este archivo - README.md)
> - 🇬🇧 [English](README.en.md)

<br/>
<br/>

[![Pruebas](https://img.shields.io/badge/Pruebas-530%2B-green?style=for-the-badge)](#testing)
[![Locales](https://img.shields.io/badge/Locales-40%2B-orange?style=for-the-badge)](#locales-soportadas)
[![Calendarios](https://img.shields.io/badge/Calendarios-6+-blue?style=for-the-badge)](#sistemas-de-calendario)
[![Versión NPM](https://img.shields.io/npm/v/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![Tamaño bundle](https://img.shields.io/bundlephobia/minzip/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![Descargas NPM](https://img.shields.io/npm/dm/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![CI](https://img.shields.io/github/actions/workflow/status/Berea-Soft/timeguard/ci.yml?style=for-the-badge)](https://github.com/Berea-Soft/timeguard/actions/workflows/ci.yml)
[![Node](https://img.shields.io/node/v/@bereasoftware/timeguard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/timeguard)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge)](https://www.typescriptlang.org/)
[![Licencia](https://img.shields.io/github/license/Berea-Soft/timeguard?style=for-the-badge)](https://github.com/Berea-Soft/timeguard/blob/main/LICENSE)
[![Último commit](https://img.shields.io/github/last-commit/Berea-Soft/timeguard?style=for-the-badge)](https://github.com/Berea-Soft/timeguard/commits/main)
[![Repositorio](https://img.shields.io/badge/github-repo-blue?logo=github&style=for-the-badge)](https://github.com/Berea-Soft/timeguard)
[![Cobertura](https://img.shields.io/badge/coverage-91%25-orange?style=for-the-badge)](https://github.com/Berea-Soft/timeguard)

---

## 🎯 Características

- ✨ **JavaScript Moderno** - Construido sobre Temporal API (estándar TC39)
- 🏛️ **Principios SOLID** - Arquitectura limpia, mantenible y extensible
- 🌍 **40+ Locales** - Soporte completo de internacionalización
- 📦 **TypeScript** - Seguridad de tipos completa con modo estricto
- 🧪 **530+ Tests** - Cobertura completa BDD/TDD
- 🎨 **Múltiples Formatos** - ISO, RFC2822, RFC3339, UTC y patrones personalizados
- ⚡ **Tree-Shakeable** - Estructura modular para tamaño óptimo del bundle
- 📚 **Bien Documentado** - Guías extensas, ejemplos y referencia API
- 🔌 **Sistema de Plugins** - Extiende con plugins opcionales (tiempo relativo, duración, formato avanzado)
- 📅 **Múltiples Calendarios** - Gregoriano, Islámico, Hebreo, Chino, Japonés, Budista y más
- ⏱️ **Precisión de Nanosegundos** - Soporte completo de Temporal API
- 🔄 **API de Duración** - Métodos `until()` y `round()` para cálculos avanzados

---

## 📋 Tabla de Contenidos

- [Inicio Rápido](#inicio-rápido)
- [Instalación](#instalación)
- [Conceptos Clave](#conceptos-clave)
- [Accesores de Componentes](#accesores-de-componentes)
- [Cálculos Avanzados](#cálculos-avanzados)
- [Sistemas de Calendario](#sistemas-de-calendario)
- [Plugins](#plugins)
- [Integración con Frameworks](#integración-con-frameworks)
- [Documentación](#documentación)
- [Locales Soportadas](#locales-soportadas)
- [Referencia API](#referencia-api)
- [Testing](#testing)
- [Arquitectura](#arquitectura)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## 🚀 Inicio Rápido
<a id="inicio-rápido"></a><a id="inicio-rapido"></a>

```typescript
import { TimeGuard } from '@bereasoftware/timeguard';

// Crear una fecha
const now = TimeGuard.now();
const date = TimeGuard.from('2024-03-13');

// Manipular fechas
const tomorrow = date.add(1, 'day');
const nextMonth = date.add(1, 'month');

// Formatear con locales
const spanish = date.locale('es').format('dddd, DD MMMM YYYY');
// Resultado: miércoles, 13 marzo 2024

const japanese = date.locale('ja').format('YYYY年M月D日');
// Resultado: 2024年3月13日

// Obtener componentes
console.log(date.year()); // 2024
console.log(date.month()); // 3
console.log(date.day()); // 13
console.log(date.dayOfWeek()); // 3 (miércoles)

// Comparar fechas
console.log(date.isBefore(tomorrow)); // true
console.log(date.isSame(date.clone())); // true
console.log(date.isAfter(new Date('2020-01-01'))); // true
```

---

## 📦 Instalación
<a id="instalación"></a><a id="instalacion"></a>

```bash
npm install @bereasoftware/timeguard
# o
yarn add @bereasoftware/timeguard
# o
pnpm add @bereasoftware/timeguard
```

### Requisitos

timeguard es un **único entry point, 100% nativo** — no hay una versión "con polyfill" dentro de este paquete (para eso está [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard)). Necesitas uno de estos runtimes:

| Runtime | Soporte de Temporal |
| --- | --- |
| Node.js **≥26.0.0** | Habilitado por defecto, sin flag, desde el 5 de mayo de 2026 |
| Chrome / Edge **≥144** | Nativo |
| Firefox **≥139** | Nativo |
| Cualquier otro runtime | Debes asignar tu propio polyfill a `globalThis.Temporal` **antes** de importar `timeguard` |

Safari aún no soporta Temporal de forma estable. Node.js 24/25 lo tienen detrás de un flag experimental de V8 (no oficialmente soportado por este paquete). Si no puedes garantizar ninguno de estos runtimes, usa [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard) en su lugar — misma API, carga el polyfill automáticamente.

En un runtime sin `Temporal`, cualquier método de `TimeGuard` lanza un error inmediato y explícito en vez de fallar en silencio.

- **Cero dependencias** — `@js-temporal/polyfill` no aparece ni en `dependencies` ni en `devDependencies` de este paquete. Los tipos de `Temporal` los provee TypeScript directamente (`lib: ["ESNext.Temporal"]`, disponible desde TypeScript 6.0)
- **TypeScript** 6.0+ (necesario para los tipos ambientales de `Temporal`; opcional pero recomendado)

### 🚀 Uso en Node.js / Backend

timeguard **nunca carga un polyfill** — usa el `Temporal` que ya expone tu runtime:

```typescript
// Node.js >=26: Temporal ya está disponible globalmente, sin nada que configurar
import { TimeGuard } from '@bereasoftware/timeguard';

const now = TimeGuard.now();
```

**¿Tu runtime todavía no tiene Temporal nativo?** Asigna un polyfill tú mismo antes de importar (timeguard no instala ninguno — este es solo un ejemplo, cualquier polyfill de Temporal sirve; tú decides si instalarlo):
```typescript
// Solo necesario si tu runtime NO tiene Temporal nativo todavía.
// npm install @js-temporal/polyfill (o el polyfill que prefieras) — timeguard
// nunca lo instala por ti, ni siquiera como devDependency.
import { Temporal } from '@js-temporal/polyfill';
(globalThis as any).Temporal = Temporal;

import { TimeGuard } from '@bereasoftware/timeguard';
```

### Bundle Modular

timeguard usa la misma arquitectura modular que `time-guard`. El **core** (TimeGuard, formatter, EN/ES, Gregoriano) pesa ~5KB gzip — y como este paquete nunca incluye un polyfill, el bundle completo del entry por defecto se queda en esos ~5KB. Locales, plugins y calendarios se cargan bajo demanda:

```typescript
// Entry por defecto (~5KB gzip): core, cero dependencias en runtime
import { TimeGuard } from '@bereasoftware/timeguard';

// Módulos bajo demanda
import { ALL_LOCALES } from '@bereasoftware/timeguard/locales';
import { IslamicCalendar } from '@bereasoftware/timeguard/calendars';
import relativeTimePlugin from '@bereasoftware/timeguard/plugins/relative-time';
import { Duration } from '@bereasoftware/timeguard/plugins/duration';
import advancedFormatPlugin from '@bereasoftware/timeguard/plugins/advanced-format';

// UMD para CDN / <script>
// <script src="unpkg.com/@bereasoftware/timeguard/dist/timeguard.umd.js"></script>

// Nota: los archivos UMD/IIFE son solo para CDN o <script>, no para importarlos como subpaths del paquete.
```

---

## 🏗️ Conceptos Clave
<a id="conceptos-clave"></a>

### 1. Inmutabilidad

Todas las instancias de TimeGuard son inmutables. Cada operación devuelve una nueva instancia:

```typescript
const date = TimeGuard.from('2024-03-13');
const modified = date.add(1, 'day');

console.log(date.day()); // 13 (sin cambios)
console.log(modified.day()); // 14 (nueva instancia)
```

### 2. Soporte de Zonas Horarias

Maneja zonas horarias con soporte completo de Temporal API:

```typescript
const date = TimeGuard.from('2024-03-13 10:30:00');

// Set timezone
const inNYC = date.timezone('America/New_York');
const inTokyo = date.timezone('Asia/Tokyo');

console.log(inNYC.format('YYYY-MM-DD HH:mm:ss Z'));
console.log(inTokyo.format('YYYY-MM-DD HH:mm:ss Z'));
```

### 3. Localización

Soporte para 40+ idiomas y locales. El core solo trae `en`/`es` registrados; llama `loadAllLocales()` una vez (o registra solo los que uses vía `/locales`, ver [Bundle Modular](#bundle-modular)):

```typescript
import { TimeGuard, loadAllLocales } from '@bereasoftware/timeguard';

loadAllLocales(); // una sola vez, al iniciar tu app

const date = TimeGuard.from('2024-03-13');

date.locale('en').format('MMMM DD, YYYY'); // March 13, 2024
date.locale('es').format('DD MMMM YYYY'); // 13 marzo 2024
date.locale('fr').format('DD MMMM YYYY'); // 13 mars 2024
date.locale('de').format('DD. MMMM YYYY'); // 13. März 2024
date.locale('ja').format('YYYY年M月D日'); // 2024年3月13日
date.locale('zh-cn').format('YYYY年M月D日'); // 2024年3月13日
date.locale('ar').format('DD MMMM YYYY'); // 13 مارس 2024
```

### 4. Estrategias de Formato

Múltiples formatos preestablecidos y patrones personalizados:

```typescript
const date = TimeGuard.from('2024-03-13 14:30:45');

// Preestablecidos
date.format('iso'); // 2024-03-13T14:30:45
date.format('date'); // 2024-03-13
date.format('time'); // 14:30:45
date.format('datetime'); // 2024-03-13 14:30:45
date.format('rfc2822'); // Wed, 13 Mar 2024 14:30:45 GMT
date.format('rfc3339'); // 2024-03-13T14:30:45Z
date.format('utc'); // 2024-03-13T14:30:45Z

// Patrones personalizados
date.format('YYYY-MM-DD HH:mm:ss');
date.format('dddd, MMMM DD, YYYY');
date.format('MM/DD/YYYY');
```

---

## 🎯 Accesores de Componentes
<a id="accesores-de-componentes"></a>

Acceso rápido a componentes individuales de la fecha:

```typescript
const date = TimeGuard.from('2024-03-13 14:30:45.123');

// Componentes individuales
console.log(date.year()); // 2024
console.log(date.month()); // 3
console.log(date.day()); // 13
console.log(date.hour()); // 14
console.log(date.minute()); // 30
console.log(date.second()); // 45
console.log(date.millisecond()); // 123

// Información de la semana
console.log(date.dayOfWeek()); // 3 (Mié: 1=Dom, 7=Sáb)
console.log(date.dayOfYear()); // 73
console.log(date.weekOfYear()); // 11

// Información de mes/año
console.log(date.daysInMonth()); // 31
console.log(date.daysInYear()); // 366 (año bisiesto)
console.log(date.inLeapYear()); // true
```

---

## ⏱️ Cálculos Avanzados
<a id="cálculos-avanzados"></a><a id="calculos-avanzados"></a>

### 🎯 API Semántica: `between()` - Sin Carga Mental

La forma **más semántica y clara** para calcular diferencias de tiempo. ¡No necesitas pensar en `until()` vs `since()`!

```typescript
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-03-20');

// Lectura simple y directa
TimeGuard.between(start, end).humanize();
// "2 months and 5 days"

// El orden NO importa - siempre positivo
TimeGuard.between(end, start).humanize();
// "2 months and 5 days" (¡idéntico!)

// Acceso a propiedades DurationParts
TimeGuard.between(start, end).months; // 2
TimeGuard.between(start, end).days; // 5

// Todas las opciones de humanize() disponibles
TimeGuard.between(start, end).humanize({ locale: 'es', fullBreakdown: true });
// "2 meses y 5 días"
```

**Comparación semántica:**

```typescript
// ❌ Confuso: ¿cuál es cuál?
start.until(end); // ¿es positivo?
end.since(start); // ¿es diferente?

// ✅ Claro: no necesitas pensar
TimeGuard.between(start, end); // siempre positivo, sin confusión
TimeGuard.between(end, start); // mismo resultado, order no importa
```

### 🔗 API Fluente: `range()` - Naming Killer

**Marketing técnico puro:** La API más intuitiva para rangos de fechas con **method chaining fluent**:

```typescript
// Sintaxis limpia y directa
TimeGuard.range('2024-01-15', '2024-03-20').humanize();
// "2 months and 5 days"

TimeGuard.range('2024-01-15', '2024-03-20').inMonths();
// 2.1355 (valor decimal preciso)

TimeGuard.range('2024-01-15', '2024-03-20').toDuration();
// DurationResult: acceso completo a propiedades
```

**Casos de uso empresariales:**

```typescript
// 📅 Período de alquiler
const checkIn = new TimeGuard('2024-06-15');
const checkOut = new TimeGuard('2024-06-22');

const rentalDays = TimeGuard.range(checkIn, checkOut).in('day');
const rentalCost = rentalDays * 100; // $100 por día
console.log(rentalCost); // $700

// 💳 Cálculo de mora
const invoiceDate = new TimeGuard('2024-01-01');
const paymentDate = new TimeGuard('2024-02-15');

const lateFeePerDay = 10;
const lateFee =
  TimeGuard.range(invoiceDate, paymentDate).in('day') * lateFeePerDay;
console.log(lateFee); // Cálculo exacto con promediado de meses

// 📊 Analítica de sesiones
const sessionStart = new TimeGuard('2024-03-15T10:00:00');
const sessionEnd = new TimeGuard('2024-03-15T10:35:42');

const engagementMinutes = TimeGuard.range(sessionStart, sessionEnd).in(
  'minute',
);
console.log(engagementMinutes); // Para métricas de usuarios
```

**Soporte de Locales:**

```typescript
// El orden de fechas NO importa
TimeGuard.range('2024-03-20', '2024-01-15').humanize({ locale: 'es' });
// "2 meses y 5 días" (resultado idéntico)

// Diferentes idiomas
TimeGuard.range('2024-01-15', '2024-03-20').humanize({ locale: 'fr' });
// "2 mois et 5 jours"

TimeGuard.range('2024-01-15', '2024-03-20').humanize({ locale: 'de' });
// "2 Monate und 5 Tage"

// Desglose completo
TimeGuard.range('2024-01-15', '2024-03-20').humanize({
  locale: 'es',
  fullBreakdown: true,
});
// "2 meses y 5 días"
```

**Métodos disponibles en `TimeRange`:**

| Método                | Retorna          | Descripción                                         |
| --------------------- | ---------------- | --------------------------------------------------- |
| `.toDuration()`       | `DurationResult` | Objeto de duración completo con todos los métodos   |
| `.inMonths()`         | `number`         | Rango en meses (decimal: 2.1355)                    |
| `.humanize(options?)` | `string`         | Texto legible: "2 meses y 5 días"                   |
| `.in(unit)`           | `number`         | Rango en cualquier unidad (day, hour, minute, etc.) |

### Duración: Calcular tiempo entre fechas

```typescript
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-03-20');

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

### Humanize: Duración Legible para Usuarios 📝

Convierte duraciones a texto natural y legible con soporte multiidioma:

```typescript
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-03-20');

// Estilo simple (Intl.RelativeTimeFormat)
const duration = start.until(end);
console.log(duration.humanize());
// "2 months"

// Desglose completo con múltiples unidades
console.log(duration.humanize({ fullBreakdown: true }));
// "2 months and 5 days"

// Con locale específico
console.log(duration.humanize({ locale: 'es' }));
// "2 meses"

console.log(duration.humanize({ locale: 'es', fullBreakdown: true }));
// "2 meses y 5 días"

// Con locale francés
console.log(duration.humanize({ locale: 'fr' }));
// "2 mois"

console.log(duration.humanize({ locale: 'fr', fullBreakdown: true }));
// "2 mois et 5 jours"
```

#### Uso de Locales Heredadas

```typescript
// TimeGuard hereda configuración de locale
const start = TimeGuard.from('2024-01-15', { locale: 'es' });
const end = TimeGuard.from('2024-03-20');

const duration = start.until(end);

// Usa automáticamente el locale de la instancia
console.log(duration.humanize());
// "2 meses"

console.log(duration.humanize({ fullBreakdown: true }));
// "2 meses y 5 días"
```

#### Opciones de Humanize

| Opción          | Tipo               | Default       | Descripción                                     |
| --------------- | ------------------ | ------------- | ----------------------------------------------- |
| `locale`        | string             | del TimeGuard | Código de locale ('en', 'es', 'fr', etc.)       |
| `fullBreakdown` | boolean            | false         | Mostrar desglose completo vs. unidad más grande |
| `numeric`       | 'always' \| 'auto' | 'always'      | Formato numérico para Intl API                  |

#### Locales Soportados

Humanize automáticamente soporta:

- 🇬🇧 **en** - English
- 🇪🇸 **es** - Español
- 🇫🇷 **fr** - Français (French)
- 🇩🇪 **de** - Deutsch (German)
- 🇮🇹 **it** - Italiano (Italian)
- 🇵🇹 **pt** - Português (Portuguese)

Y muchos más a través de `Intl.RelativeTimeFormat`.

### 💥 Explain Mode: Debugging Brutal y Educación

**Feature killer para debugging y enseñanza** - Obtén una explicación detallada de cómo se calculó cada duración.

Perfecto para:

- 🐛 **Debugging** - Entender exactamente cómo se calculó la duración
- 📚 **Educación** - Enseñar matemáticas de fechas
- 📋 **Auditoría** - Verificar lógica de negocio basada en fechas
- ✅ **Validación** - Confirmar que los cálculos son correctos

```typescript
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-03-20');
const duration = start.until(end);

// Explicación detallada del cálculo
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

#### Casos de Uso

Debugging de lógica de fechas:

```typescript
// ¿Por qué el cálculo de mora es diferente?
const invoiceDate = TimeGuard.from('2024-01-05');
const paymentDate = TimeGuard.from('2024-02-15');
const lateFee = invoiceDate.until(paymentDate);

// Obtén la explicación completa
const debug = lateFee.explain();

console.log('Pasos del cálculo:', debug.steps);
console.log('Febrero es bisiesto:', debug.leapYearFlags);
console.log('Desglose:', debug.breakdown);
// Ahora sabes exactamente qué sucedió!
```

Educación - Enseñar cálculos de fechas:

```typescript
// Mostrar a estudiantes cómo funciona
const start = TimeGuard.from('2024-02-15'); // Enero
const end = TimeGuard.from('2024-04-15'); // Abril
const duration = start.until(end);

const explanation = duration.explain();

// Mostrar todos los pasos
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

#### Propiedades de Explanation

| Propiedad        | Tipo                     | Descripción                   |
| ---------------- | ------------------------ | ----------------------------- |
| `input`          | `string[]`               | Fechas de entrada parseadas   |
| `steps`          | `string[]`               | Pasos del cálculo legibles    |
| `breakdown`      | `DurationParts`          | Desglose por componentes      |
| `mode`           | `'exact' \| 'estimated'` | Tipo de cálculo realizado     |
| `explanation`    | `string`                 | Resumen en texto natural      |
| `locale`         | `string`                 | Idioma de la explicación      |
| `leapYearFlags?` | `Array`                  | Información de años bisiestos |
| `metadata?`      | `Object`                 | Rendimiento y precisión       |

```typescript
const date = TimeGuard.from('2024-03-13 14:35:47.654');

// Redondear a diferentes unidades
date.round({ smallestUnit: 'second' }); // 2024-03-13 14:35:48
date.round({ smallestUnit: 'minute' }); // 2024-03-13 14:36:00
date.round({ smallestUnit: 'hour' }); // 2024-03-13 15:00:00
date.round({ smallestUnit: 'day' }); // 2024-03-14 00:00:00

// Modos de redondeo: 'ceil', 'floor', 'trunc', 'half' (predeterminado)
date.round({
  smallestUnit: 'minute',
  roundingMode: 'ceil',
});
```

---

## 📅 Sistemas de Calendario
<a id="sistemas-de-calendario"></a>

TimeGuard incluye soporte para múltiples sistemas de calendario, extensible a través del gestor de calendarios:

### Calendarios Soportados

```typescript
import { TimeGuard, CalendarManager } from '@bereasoftware/timeguard';
import {
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
} from '@bereasoftware/timeguard/calendars';

// Get calendar manager
const calendarMgr = CalendarManager.getInstance();

// List available calendars
console.log(calendarMgr.list());
// ['gregory', 'islamic', 'hebrew', 'chinese', 'japanese', 'buddhist']

// Register custom calendar
const islamic = new IslamicCalendar();
calendarMgr.register(islamic);

// Get calendar info
const gregorian = calendarMgr.get('gregory');
console.log(gregorian.getMonthName(3)); // "March"
console.log(gregorian.getMonthName(3, true)); // "Mar"
console.log(gregorian.getWeekdayName(1)); // "Sunday"
console.log(gregorian.isLeapYear(2024)); // true
```

### Objetos de Calendario

#### Calendario Gregoriano

```typescript
import { GregorianCalendar } from '@bereasoftware/timeguard/calendars';

const calendar = new GregorianCalendar();
console.log(calendar.daysInMonth(2024, 2)); // 29 (leap year)
console.log(calendar.daysInYear(2024)); // 366
```

#### Calendario Islámico (Hijri)

```typescript
import { IslamicCalendar } from '@bereasoftware/timeguard/calendars';

const calendar = new IslamicCalendar();
console.log(calendar.getMonthName(9)); // "Ramadan"
console.log(calendar.isLeapYear(1445)); // true
```

#### Calendario Hebreo

```typescript
import { HebrewCalendar } from '@bereasoftware/timeguard/calendars';

const calendar = new HebrewCalendar();
console.log(calendar.getMonthName(1)); // "Tishrei"
console.log(calendar.isLeapYear(5784)); // true
```

#### Calendario Chino

```typescript
import { ChineseCalendar } from '@bereasoftware/timeguard/calendars';

const calendar = new ChineseCalendar();
const zodiac = calendar.getZodiacSign(2024); // "龙" (Dragon)
```

#### Calendario Japonés

```typescript
import { JapaneseCalendar } from '@bereasoftware/timeguard/calendars';

const calendar = new JapaneseCalendar();
console.log(calendar.getMonthName(3)); // "3月"
```

#### Calendario Budista

```typescript
import { BuddhistCalendar } from '@bereasoftware/timeguard/calendars';

const calendar = new BuddhistCalendar();
// Year 2567 BE = 2024 CE
console.log(calendar.isLeapYear(2567)); // true
```

---

<a id="plugins"></a>
## 🔌 Plugins

TimeGuard incluye un sistema de plugins opcional para funcionalidad extendida:

### Plugins Disponibles

1. **Plugin de Tiempo Relativo** - Diferencias de tiempo legibles para humanos

   ```typescript
   import { TimeGuard, PluginManager } from '@bereasoftware/timeguard';
   import relativeTimePlugin from '@bereasoftware/timeguard/plugins/relative-time';

   PluginManager.use(relativeTimePlugin, TimeGuard);

   TimeGuard.from('2024-01-01').fromNow(); // "2 months ago"
   TimeGuard.from('2024-04-01').toNow(); // "in 19 days"
   ```

2. **Plugin de Duración** - Soporte de duración ISO 8601

   ```typescript
   import { Duration } from '@bereasoftware/timeguard/plugins/duration';

   const duration = Duration.fromISO('P2Y3M4D');
   duration.humanize(); // "2 years, 3 months, 4 days"
   duration.asDays(); // 1159
   ```

3. **Plugin de Formato Avanzado** - Tokens de formato extendidos

   ```typescript
   import advancedFormatPlugin from '@bereasoftware/timeguard/plugins/advanced-format';

   PluginManager.use(advancedFormatPlugin, TimeGuard);

   date.format('Do MMMM YYYY'); // "13th March 2024"
   date.format('Q [Q] YYYY'); // "1 Q 2024"
   ```

**📖 Full Details:** See [PLUGINS.md](PLUGINS.md) for complete plugin documentation.

---

<a id="documentación"></a><a id="documentacion"></a>
## 📚 Documentación

### Archivos de Documentación Principal

| Documento                             | Propósito                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [📖 ARCHITECTURE.md](ARCHITECTURE.md) | Deep dive into design patterns, SOLID principles, and system architecture | Inmersión profunda en patrones de diseño, principios SOLID y arquitectura |
| [💡 EXAMPLES.md](EXAMPLES.md)         | Real-world usage examples and common scenarios                            |
| [🌍 LOCALES.md](LOCALES.md)           | Complete guide to localization and supported languages                    |
| [� PLUGINS.md](PLUGINS.md)            | Plugin system documentation and usage guide                               |
| [�📖 API Reference](#api-overview)    | Quick API reference (below)                                               |

### Navegación Rápida

- **Inicio** → Comienza con [Inicio Rápido](#inicio-r%C3%A1pido) arriba
- **Uso Avanzado** → Ver [EXAMPLES.md](EXAMPLES.md)
- **Localización** → Ver [LOCALES.md](LOCALES.md)
- **Arquitectura** → Ver [ARCHITECTURE.md](ARCHITECTURE.md)

## 🌍 Locales Soportadas
<a id="locales-soportadas"></a>

TimeGuard proporciona **más de 40 idiomas y variantes regionales** con soporte completo de internacionalización. Los locales se organizan por familia de idiomas para facilitar el descubrimiento.

### Formato de Código de Locale

Los códigos de locale siguen el patrón estándar `[language]-[region]`:

- `en` - Forma predeterminada (se usa si no se especifica variante de región)
- `en-gb` - Variante de región específica (Gran Bretaña)
- `es-mx` - Variante española para México
- `zh-cn` - Chino simplificado

### Locales Disponibles por Familia

####-🇬🇧 Inglés (4 variantes)

- `en` - Inglés (US)
- `en-au` - Inglés (Australia)
- `en-gb` - Inglés (Gran Bretaña)
- `en-ca` - Inglés (Canadá)

### Español (3 variantes)

- `es` - Español (España)
- `es-mx` - Español (México)
- `es-us` - Español (US)

### Idiomas Románicos (5)

- `fr` - Francés
- `it` - Italiano
- `pt` - Portugués (Portugal)
- `pt-br` - Portugués (Brasil)
- `ro` - Rumano

### Idiomas Eslavos (4)

- `ru` - Ruso
- `pl` - Polaco
- `cs` - Checo
- `sk` - Eslovaco

### Idiomas Nórdicos (4)

- `sv` - Sueco
- `nb` - Noruego (Bokmål)
- `da` - Danés
- `fi` - Finlandés

### Idiomas Asiáticos (7)

- `ja` - Japonés
- `zh-cn` - Chino (Simplificado)
- `zh-tw` - Chino (Tradicional)
- `ko` - Coreano
- `th` - Thai
- `vi` - Vietnamita
- `id` - Indonesio

### Idiomas Europeos (7)

- `de` - Alemán
- `nl` - Holandés
- `el` - Griego
- `hu` - Húngaro
- `eu` - Euskera
- `ca` - Catalán
- `tr` - Turco

### Oriente Medio y Asia del Sur (3)

- `ar` - Árabe
- `he` - Hebreo
- `hi` - Hindi

---

### Guía de Uso de Locales

#### Configuración de Locales

```typescript
import { TimeGuard } from '@bereasoftware/timeguard';

const date = TimeGuard.from('2024-03-13 14:30:00');

// Get current locale
const currentLocale = date.locale(); // "en"

// Change locale (returns new instance)
const spanish = date.locale('es');
const french = date.locale('fr');
const japanese = date.locale('ja');
const arabic = date.locale('ar');

// Chain operations
date.locale('es').format('dddd, DD MMMM YYYY'); // miércoles, 13 marzo 2024

// Or use constructor config
TimeGuard.from('2024-03-13', { locale: 'de' });
TimeGuard.now({ locale: 'ja' });
```

#### Formateo en Diferentes Locales

```typescript
const date = TimeGuard.from('2024-03-13');

// English variants
date.locale('en').format('MMMM DD, YYYY'); // March 13, 2024
date.locale('en-gb').format('DD MMMM YYYY'); // 13 March 2024
date.locale('en-au').format('DD/MM/YYYY'); // 13/03/2024
date.locale('en-ca').format('YYYY-MM-DD'); // 2024-03-13

// Spanish variants
date.locale('es').format('DD MMMM YYYY'); // 13 marzo 2024
date.locale('es-mx').format('DD/MM/YYYY'); // 13/03/2024
date.locale('es-us').format('MMMM D'); // marzo 13

// Romance languages
date.locale('fr').format('dddd D MMMM YYYY'); // mercredi 13 mars 2024
date.locale('it').format('dddd, D MMMM YYYY'); // mercoledì, 13 marzo 2024
date.locale('pt').format('dddd, D MMMM YYYY'); // quarta-feira, 13 de março de 2024
date.locale('pt-br').format('DD/MM/YYYY'); // 13/03/2024
date.locale('ro').format('DD MMMM YYYY'); // 13 martie 2024

// Slavic languages
date.locale('ru').format('DD MMMM YYYY'); // 13 марта 2024
date.locale('pl').format('DD MMMM YYYY'); // 13 marca 2024
date.locale('cs').format('DD. MMMM YYYY'); // 13. března 2024
date.locale('sk').format('DD. MMMM YYYY'); // 13. marca 2024

// Nordic languages
date.locale('sv').format('DD MMMM YYYY'); // 13 mars 2024
date.locale('nb').format('DD. MMMM YYYY'); // 13. mars 2024
date.locale('da').format('DD. MMMM YYYY'); // 13. marts 2024
date.locale('fi').format('DD. MMMM YYYY'); // 13. maaliskuuta 2024

// Asian languages
date.locale('ja').format('YYYY年M月D日'); // 2024年3月13日
date.locale('zh-cn').format('YYYY年M月D日'); // 2024年3月13日
date.locale('zh-tw').format('YYYY年M月D日'); // 2024年3月13日
date.locale('ko').format('YYYY년 M월 D일'); // 2024년 3월 13일
date.locale('th').format('DD MMMM YYYY'); // 13 มีนาคม 2567 (BE)
date.locale('vi').format('DD/MM/YYYY'); // 13/03/2024
date.locale('id').format('DD MMMM YYYY'); // 13 Maret 2024

// European languages
date.locale('de').format('DD. MMMM YYYY'); // 13. März 2024
date.locale('nl').format('DD MMMM YYYY'); // 13 maart 2024
date.locale('el').format('DD MMMM YYYY'); // 13 Μαρτίου 2024
date.locale('hu').format('YYYY. MMMM DD.'); // 2024. március 13.
date.locale('eu').format('YYYY[ko] MMMM[ren] DD'); // 2024ko martsaren 13
date.locale('ca').format('DD MMMM YYYY'); // 13 de març de 2024
date.locale('tr').format('DD MMMM YYYY'); // 13 Mart 2024

// Middle Eastern & South Asian
date.locale('ar').format('DD MMMM YYYY'); // 13 مارس 2024
date.locale('he').format('DD.MM.YYYY'); // 13.03.2024
date.locale('hi').format('DD MMMM YYYY'); // 13 मार्च 2024
```

#### Nombres de Día y Mes

```typescript
// Get localized day names
date.locale('es').format('dddd'); // miércoles
date.locale('es').format('ddd'); // mié
date.locale('fr').format('dddd'); // mercredi
date.locale('de').format('dddd'); // Mittwoch
date.locale('ja').format('dddd'); // 水曜日

// Get localized month names
date.locale('es').format('MMMM'); // marzo
date.locale('es').format('MMM'); // mar
date.locale('fr').format('MMMM'); // mars
date.locale('de').format('MMMM'); // März
date.locale('ru').format('MMMM'); // марта
```

#### Aplicaciones Multilocale

```typescript
// Switch language at runtime (user preference)
let currentLocale = 'en';

function formatUserDate(
  date: TimeGuard,
  locale: string = currentLocale,
): string {
  return date.locale(locale).format('dddd, MMMM D, YYYY [at] HH:mm');
}

const date = TimeGuard.now();

// English user
console.log(formatUserDate(date, 'en')); // Wednesday, March 13, 2024 at 14:30

// Spanish user
currentLocale = 'es';
console.log(formatUserDate(date, 'es')); // miércoles, 13 de marzo de 2024 a las 14:30

// French user
console.log(formatUserDate(date, 'fr')); // mercredi, 13 mars 2024 à 14:30

// Japanese user
console.log(formatUserDate(date, 'ja')); // 水曜日、2024年3月13日 14:30
```

#### Obtener Locales Disponibles Programáticamente

```typescript
import { getAvailableLocales } from "@bereasoftware/timeguard";

// Get all available locales
const locales = getAvailableLocales();
// Returns: ['en', 'en-au', 'en-gb', 'en-ca', 'es', 'es-mx', 'es-us', ...]

// Filter by prefix
const englishLocales = locales.filter((l) => l.startsWith('en'));
const spanishLocales = locales.filter((l) => l.startsWith('es'));
const asianLocales = locales.filter((l) =>
  ['ja', 'zh-cn', 'zh-tw', 'ko'].includes(l),
);

// Create locale selector UI
function createLocaleSelector() {
  const locales = getAvailableLocales();
  return locales.map((locale) => ({
    code: locale,
    label: new Intl.DisplayNames('en', { type: 'language' }).of(locale),
  }));
}
```

**📖 Full Details:** See [LOCALES.md](LOCALES.md) for locale-specific usage and characteristics.

---

## 🔌 Plugins - Complete Guide

TimeGuard includes a powerful plugin system for extending functionality. Plugins follow SOLID principles and are fully optional.

### Plugin Manager

```typescript
import { TimeGuard, PluginManager } from '@bereasoftware/timeguard';

// Use a plugin
PluginManager.use(myPlugin, TimeGuard);

// Check if plugin is installed
PluginManager.isInstalled(pluginName);

// List installed plugins
PluginManager.listInstalled();
```

### 1️⃣ Plugin de Tiempo Relativo

Añade diferencias de tiempo legibles como "hace 2 horas" o "en 3 días".

```typescript
import { TimeGuard, PluginManager } from '@bereasoftware/timeguard';
import relativeTimePlugin from '@bereasoftware/timeguard/plugins/relative-time';

// Install plugin once
PluginManager.use(relativeTimePlugin, TimeGuard);

// Now use relative time methods
const date = TimeGuard.from('2024-01-15');

// Relative to now
date.fromNow(); // "2 months ago"
date.toNow(); // "in 2 months"

// Without suffix
date.fromNow(true); // "2 months"
date.toNow(true); // "2 months"

// Relative to another date
const other = TimeGuard.from('2024-02-15');
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

### 2️⃣ Plugin de Duración

Soporte de duración ISO 8601 con cálculos avanzados.

```typescript
import { TimeGuard } from '@bereasoftware/timeguard';
import {
  Duration,
  durationPlugin,
} from '@bereasoftware/timeguard/plugins/duration';
import { PluginManager } from '@bereasoftware/timeguard';

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
const duration2 = Duration.fromISO('P3Y6M4DT12H30M5S');
// P = Period marker
// 3Y = 3 years
// 6M = 6 months
// 4D = 4 days
// T = Time marker
// 12H = 12 hours
// 30M = 30 minutes
// 5S = 5 seconds

// From TimeGuard dates
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-05-20');
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
duration1.humanize('es'); // Spanish: "2 años, 3 meses..."
duration1.humanize('fr'); // French: "2 ans, 3 mois..."

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
Duration.fromISO('P1Y'); // 1 year
Duration.fromISO('P3M'); // 3 months
Duration.fromISO('P1W'); // 1 week (7 days)
Duration.fromISO('P1D'); // 1 day
Duration.fromISO('PT1H'); // 1 hour
Duration.fromISO('PT30M'); // 30 minutes
Duration.fromISO('PT45S'); // 45 seconds
Duration.fromISO('P1Y2M3DT4H5M6S'); // Complex: 1 year, 2 months, ...
Duration.fromISO('-P1D'); // Negative: -1 day
```

---

### 3️⃣ Plugin de Formato Avanzado

Tokens de formato extendidos para necesidades de formateo especializadas.

```typescript
import { TimeGuard, PluginManager } from '@bereasoftware/timeguard';
import advancedFormatPlugin from '@bereasoftware/timeguard/plugins/advanced-format';

// Install plugin
PluginManager.use(advancedFormatPlugin, TimeGuard);

const date = TimeGuard.from('2024-03-13 14:30:00');

// Advanced tokens become available
date.format('Do MMMM YYYY'); // "13th March 2024"
date.format('Q [Q] YYYY'); // "1 Q 2024"
date.format('[Week] w, YYYY'); // "Week 11, 2024"
date.format('W [of] ww'); // "11 of 11"
date.format('gggg-[W]ww'); // "2024-W11" (ISO week)
date.format('GGGG-[W]WW'); // 2024-W11 (alternative)

// Timezone abbreviation
date.format('HH:mm zzz'); // "14:30 UTC"

// 24-hour (k = 1-24 instead of 0-23)
date.format('k:mm'); // "14:30"

// Unix timestamps
date.format('X'); // Unix seconds
date.format('x'); // Unix milliseconds
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

### Arquitectura de Plugins

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
import { TimeGuard } from '@bereasoftware/timeguard';
import type { ITimeGuardPlugin } from '@bereasoftware/timeguard/types';

class MyCustomPlugin implements ITimeGuardPlugin {
  name = 'my-plugin';
  version = '1.0.0';

  install(TimeGuardClass: typeof TimeGuard): void {
    // Add method to TimeGuard prototype
    (TimeGuardClass.prototype as any).myMethod = function () {
      return 'Hello from my plugin!';
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

## 🎯 Referencia API
<a id="referencia-api"></a>

### Factory Methods

```typescript
// Create current date/time
TimeGuard.now();
TimeGuard.now({ locale: 'es', timezone: 'America/Mexico_City' });

// Create from various inputs
TimeGuard.from('2024-03-13');
TimeGuard.from('2024-03-13T14:30:00');
TimeGuard.from(new Date());
TimeGuard.from(1234567890000); // milliseconds
TimeGuard.from(1234567890, { timezone: 'UTC' }); // seconds
TimeGuard.from('2024-03-13', { locale: 'es' });

// Create from Temporal object
TimeGuard.fromTemporal(temporalPlainDateTime, config);
```

### 🔄 Conversion Methods

```typescript
const date = TimeGuard.from('2024-03-13 14:30:45');

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
const date = TimeGuard.from('2024-03-13 14:30:00');

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
date.startOf('year'); // 2024-01-01 00:00:00
date.startOf('month'); // 2024-03-01 00:00:00
date.startOf('day'); // 2024-03-13 00:00:00
date.startOf('hour'); // 2024-03-13 14:00:00
date.endOf('year'); // 2024-12-31 23:59:59
date.endOf('month'); // 2024-03-31 23:59:59

date.clone(); // Create independent copy
```

### 🔍 Component Accessors (Getters)

```typescript
const date = TimeGuard.from('2024-03-13 14:30:45.123');

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
const date1 = TimeGuard.from('2024-03-13');
const date2 = TimeGuard.from('2024-03-20');

// Direct comparison
date1.isBefore(date2); // true
date1.isAfter(date2); // false
date1.isSame(date1); // true

// Unit-specific comparison
date1.isSame(date2, 'month'); // true (same month)
date1.isSame(date2, 'year'); // true (same year)
date1.isSame(date2, 'day'); // false (different day)

// Range checking
date1.isBetween(date1, date2); // true
date1.isBetween(date1, date2, undefined, '[]'); // inclusive both ends
date1.isBetween(date1, date2, undefined, '()'); // exclusive both ends
date1.isBetween(date1, date2, 'month', '[]'); // granular range

// Calculate difference - Traditional API (backward compatible)
date1.diff(date2, 'days'); // -7
date1.diff(date2, 'millisecond'); // difference in ms
date1.diff(date2, 'months'); // -0

// Calculate difference - Modern Calendar-Aware API
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-03-20');

// Exact mode (default) - precise time difference
const exactDiff = start.diff(end, { mode: 'exact' });
console.log(exactDiff.as('day')); // 65 days

// Calendar mode - human-readable breakdown
const calendarDiff = start.diff(end, { mode: 'calendar' });
console.log(calendarDiff.format('en')); // "2 months and 5 days"
console.log(calendarDiff.format('es')); // "2 meses y 5 días"
console.log(calendarDiff.breakdown()); // { years: 0, months: 2, weeks: 0, days: 5, ... }

// Fluent API for unit conversion
const diff = start.diff(end);
console.log(diff.as('day')); // 65
console.log(diff.as('hour')); // 1560
console.log(diff.valueOf()); // milliseconds
```

### 📊 Advanced Calculations

```typescript
const date = TimeGuard.from('2024-01-15');
const future = TimeGuard.from('2024-05-20');

// Duration: Get complete breakdown
const duration = date.until(future);
// { years: 0, months: 4, days: 5, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }

// Rounding: Precision control
date.round({ smallestUnit: 'millisecond' }); // Default, no change
date.round({ smallestUnit: 'second' }); // Removes milliseconds
date.round({ smallestUnit: 'minute' }); // 2024-03-13 14:30:00
date.round({ smallestUnit: 'hour' }); // 2024-03-13 14:00:00
date.round({ smallestUnit: 'day' }); // 2024-03-13 00:00:00

// Rounding modes
date.round({
  smallestUnit: 'minute',
  roundingMode: 'halfExpand', // Default: round to nearest
});

date.round({
  smallestUnit: 'minute',
  roundingMode: 'ceil', // Always round up
});
```

### 🌍 Locale & Timezone

```typescript
const date = TimeGuard.from('2024-03-13 14:30:00');

// Get/Set locale
date.locale(); // Returns current locale: 'en'
date.locale('es'); // Set locale, returns new instance

// Format in different locales
date.format('YYYY-MM-DD'); // 2024-03-13
date.locale('es').format('DD MMMM YYYY'); // 13 marzo 2024
date.locale('es-mx').format('DD/MM/YYYY'); // 13/03/2024
date.locale('fr').format('dddd, DD MMMM YYYY'); // mercredi, 13 mars 2024
date.locale('de').format('DD. MMMM YYYY'); // 13. März 2024
date.locale('ja').format('YYYY年M月D日'); // 2024年3月13日
date.locale('zh-cn').format('YYYY年M月D日'); // 2024年3月13日
date.locale('ar').format('DD MMMM YYYY'); // 13 مارس 2024

// Get/Set timezone
date.timezone(); // Returns current timezone: 'UTC'
const inNYC = date.timezone('America/New_York');
const inTokyo = date.timezone('Asia/Tokyo');
const inDubai = date.timezone('Asia/Dubai');

// Format with timezone info
inNYC.format('YYYY-MM-DD HH:mm:ss Z'); // 2024-03-13 10:30:00 -04:00
inTokyo.format('YYYY-MM-DD HH:mm:ss Z'); // 2024-03-13 23:30:00 +09:00

// Get all available locales
import { getAvailableLocales } from "@bereasoftware/timeguard";
getAvailableLocales(); // Array of 40+ locale codes
```

### 🎨 Format Patterns

#### Format Presets

```typescript
const date = TimeGuard.from('2024-03-13 14:30:45.123');

// Built-in presets
date.format('iso'); // 2024-03-13T14:30:45.123Z
date.format('date'); // 2024-03-13
date.format('time'); // 14:30:45
date.format('datetime'); // 2024-03-13 14:30:45
date.format('rfc2822'); // Wed, 13 Mar 2024 14:30:45 +0000
date.format('rfc3339'); // 2024-03-13T14:30:45Z
date.format('utc'); // 2024-03-13T14:30:45.123Z
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
date.format('YYYY-MM-DD'); // 2024-03-13
date.format('DD/MM/YYYY'); // 13/03/2024
date.format('MMMM D, YYYY'); // March 13, 2024
date.format('dddd, MMMM D, YYYY'); // Wednesday, March 13, 2024
date.format('DD-MMMM-YY'); // 13-Mar-24
date.format('h:mm A'); // 2:30 PM
date.format('HH:mm:ss'); // 14:30:45
date.format('[Today is] dddd'); // Today is Wednesday
date.format('HH:mm [UTC]'); // 14:30 UTC
date.format('DD/MM/YYYY "at" HH:mm'); // 13/03/2024 at 14:30
```

**📖 Complete Format Guide:** See [EXAMPLES.md](EXAMPLES.md) for more patterns and use cases.

### ⏱️ Calendar-Aware Difference Calculations

One of TimeGuard's most powerful features is its **calendar-aware diff mode**, which solves a fundamental problem with date libraries: months and years have variable lengths.

#### Understanding Two Approaches

```typescript
// Problem: How much time between Jan 15 and Mar 20?
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-03-20');

// ❌ Naive approach: Just count days
// Result: "65 days" (technically correct but not user-friendly)

// ✅ Calendar-aware approach: Break into meaningful units
// Result: "2 months and 5 days" (how humans think about time)
```

#### API Modes

```typescript
const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2024-03-20');

// ==== EXACT MODE (default) ====
// Precise time difference in specified unit
const exactDiff = start.diff(end, { mode: 'exact' });

// Returns normalized difference
exactDiff.as('day'); // 65 days
exactDiff.as('hour'); // 1560 hours
exactDiff.as('week'); // 9 weeks
exactDiff.valueOf(); // milliseconds

// ==== CALENDAR MODE ====
// Human-readable breakdown with automatic localization
const calendarDiff = start.diff(end, { mode: 'calendar' });

// Get structured breakdown
calendarDiff.breakdown();
// {
//   years: 0,
//   months: 2,
//   weeks: 0,
//   days: 5,
//   hours: 0,
//   minutes: 0,
//   seconds: 0,
//   milliseconds: 0
// }

// Format in any locale
calendarDiff.format('en'); // "2 months and 5 days"
calendarDiff.format('es'); // "2 meses y 5 días"
calendarDiff.format('fr'); // "2 mois et 5 jours"
calendarDiff.format('de'); // "2 Monate und 5 Tage"
```

#### Backward Compatibility

```typescript
// Traditional API still works perfectly
const tg1 = TimeGuard.from('2024-01-15');
const tg2 = TimeGuard.from('2024-03-20');

tg1.diff(tg2, 'day'); // 65 (returns number)
tg1.diff(tg2, 'month'); // 2
tg1.diff(tg2, 'millisecond'); // raw milliseconds
```

#### Advanced Usage

```typescript
const start = TimeGuard.from('2024-01-15 10:30:00');
const end = TimeGuard.from('2024-03-20 15:45:00');

// Fluent API for unit conversion
const diff = start.diff(end);
diff.as('day'); // Get as days
diff.as('hour'); // Get as hours
diff.as('minute'); // Get as minutes
diff.valueOf(); // Implicit number conversion (milliseconds)

// Locale-specific formatting
const spanishDiff = start.diff(end, {
  mode: 'calendar',
  locale: 'es',
});
console.log(spanishDiff.format()); // Uses Spanish locale

// Query the mode used
diff.getMode(); // "exact"
calendarDiff.getMode(); // "calendar"

// String representation
spanishDiff.toString(); // "2 meses y 5 días" (nice for display)
exactDiff.toString(); // "432000000" (milliseconds)
```

**💡 Key Insight:** Calendar mode handles month/year variations automatically using Temporal API's built-in month normalization, ensuring accurate results across different month lengths and leap years.

---

## 🔌 Integración con Frameworks
<a id="integración-con-frameworks"></a><a id="integracion-con-frameworks"></a>

TimeGuard incluye integraciones nativas y optimizadas de alto rendimiento para **React**, **Vue** y **Angular** a través de subrutas específicas. Estas integraciones están diseñadas bajo los principios SOLID, con mitigación de fugas de memoria y optimizaciones de ciclo de renderizado.

### 📦 Instalación de Dependencias Opcionales

Dado que las integraciones con frameworks son opcionales, debes asegurarte de tener instaladas las dependencias del framework correspondiente en tu proyecto.

```bash
# Para React
npm install react react-dom

# Para Vue
npm install vue

# Para Angular
npm install @angular/core rxjs
```

---

### ⚛️ React (`@bereasoftware/timeguard/react`)

La integración con React proporciona un sistema de contexto global para la configuración y hooks reactivos de alta fidelidad.

#### 1. Contexto Global: `TimeGuardProvider`
Permite propagar una configuración predeterminada (como el idioma o zona horaria) a todos los hooks dentro del árbol de componentes.

```tsx
import React from 'react';
import { TimeGuardProvider } from '@bereasoftware/timeguard/react';

export function App() {
  return (
    <TimeGuardProvider config={{ locale: 'es', timezone: 'America/Mexico_City' }}>
      <MyComponent />
    </TimeGuardProvider>
  );
}
```

#### 2. Hooks Reactivos

*   **`useTimeGuard(input, config?)`**:
    Crea una instancia reactiva de `TimeGuard` que se actualiza automáticamente cuando el valor de entrada o la configuración cambian. Hereda la configuración del contexto de forma transparente.
    ```tsx
    import { useTimeGuard } from '@bereasoftware/timeguard/react';

    function DateDisplay({ dateString }) {
      const tg = useTimeGuard(dateString);
      return <p>Fecha: {tg.format('LL')}</p>;
    }
    ```

*   **`useCurrentTime(options?)`**:
    Retorna una instancia reactiva del tiempo actual que se actualiza automáticamente según el intervalo indicado (por defecto `1000ms`).
    ```tsx
    import { useCurrentTime } from '@bereasoftware/timeguard/react';

    function LiveClock() {
      const now = useCurrentTime({ interval: 1000 });
      return <h2>Hora actual: {now.format('HH:mm:ss')}</h2>;
    }
    ```

*   **`useRelativeTime(date, options?)`**:
    Retorna un string dinámico de tiempo relativo (ej. *"hace 5 minutos"*) que se recalcula de forma periódica e inalterable en intervalos regulares (por defecto cada `60000ms`).
    ```tsx
    import { useRelativeTime } from '@bereasoftware/timeguard/react';

    function CommentTime({ createdAt }) {
      const relative = useRelativeTime(createdAt, { interval: 30000 }); // actualiza cada 30s
      return <span>Publicado {relative}</span>;
    }
    ```

*   **`useTimeRange(start, end, config?)`**:
    Crea y gestiona una instancia reactiva de `TimeRange` que responde a cambios en los límites de inicio y fin.
    ```tsx
    import { useTimeRange } from '@bereasoftware/timeguard/react';

    function EventRange({ start, end }) {
      const range = useTimeRange(start, end);
      return (
        <div>
          <p>Duración total: {range.duration().humanize()}</p>
          <p>¿Está ocurriendo ahora?: {range.contains('now') ? 'Sí' : 'No'}</p>
        </div>
      );
    }
    ```

---

### 🟢 Vue (`@bereasoftware/timeguard/vue`)

La integración con Vue 3 ofrece compatibilidad completa con la Composition API, un Plugin global y una directiva personalizada reactiva altamente configurable.

#### 1. Registro del Plugin: `TimeGuardVuePlugin`
Registra la directiva `v-timeguard` de forma global y provee la configuración por defecto mediante `provide`/`inject`.

```typescript
import { createApp } from 'vue';
import { TimeGuardVuePlugin } from '@bereasoftware/timeguard/vue';
import App from './App.vue';

const app = createApp(App);

// Registrar plugin con opciones por defecto
app.use(TimeGuardVuePlugin, {
  locale: 'es',
});

app.mount('#app');
```

#### 2. Directiva Reactiva Dinámica: `v-timeguard`
Permite formatear y mostrar fechas reactivamente de forma declarativa directamente en las plantillas. Soporta intervalos de actualización automática para evitar fugas de memoria al desmontar el elemento.

```html
<!-- Formateo estándar -->
<span v-timeguard:format="fecha" data-pattern="DD MMMM YYYY"></span>

<!-- Tiempo relativo automático (actualiza cada minuto por defecto) -->
<span v-timeguard:relative="fecha"></span>

<!-- Reloj en tiempo real (actualización cada segundo) -->
<span v-timeguard:format="'now'" data-pattern="HH:mm:ss" data-live="true" data-interval="1000"></span>
```

#### 3. Composables de la Composition API
*   **`useTimeGuard(input, config?)`**: Retorna una `Ref<TimeGuard>` reactiva.
*   **`useCurrentTime(options?)`**: Retorna una `Ref<TimeGuard>` del tiempo actual con limpieza automática del intervalo en `onUnmounted`.
*   **`useRelativeTime(date, options?)`**: Retorna una `Ref<string>` con el tiempo relativo actualizado periódicamente con watch profundo incorporado.

```html
<script setup>
import { useCurrentTime, useRelativeTime } from '@bereasoftware/timeguard/vue';

const now = useCurrentTime({ interval: 1000 });
const relative = useRelativeTime('2026-05-20T08:00:00');
</script>

<template>
  <div>
    <p>Hora actual: {{ now.format('HH:mm:ss') }}</p>
    <p>Publicado hace: {{ relative }}</p>
  </div>
</template>
```

---

### 🅰️ Angular (`@bereasoftware/timeguard/angular`)

La integración con Angular está optimizada para la detección de cambios (`ChangeDetectionStrategy.OnPush`), utilizando servicios inyectables y pipes puros/impuros que ejecutan temporizadores fuera de la zona de Angular (`NgZone.runOutsideAngular`) para maximizar el rendimiento.

#### 1. Configuración Global: `TIME_GUARD_CONFIG`
Registra la configuración en el módulo o a nivel de root mediante Dependency Injection (DI).

```typescript
import { NgModule } from '@angular/core';
import { TIME_GUARD_CONFIG } from '@bereasoftware/timeguard/angular';

@NgModule({
  providers: [
    {
      provide: TIME_GUARD_CONFIG,
      useValue: { locale: 'es' }
    }
  ]
})
export class AppModule {}
```

#### 2. Pipes Disponibles

*   **`TimeGuardFormatPipe` (`timeGuardFormat`)**:
    Pipe puro diseñado para formatear valores de fecha/hora de forma ultra-rápida sin sobrecargar la detección de cambios.
    ```html
    <p>{{ createdDate | timeGuardFormat:'DD/MM/YYYY' }}</p>
    ```

*   **`TimeGuardRelativePipe` (`timeGuardRelative`)**:
    Pipe impuro para mostrar la representación humanizada relativa de una fecha.
    ```html
    <p>Publicado {{ createdDate | timeGuardRelative }}</p>
    ```

*   **`TimeGuardLiveFormatPipe` (`timeGuardLiveFormat`)**:
    Pipe impuro de alto rendimiento optimizado con `ChangeDetectorRef` para crear relojes o actualizaciones dinámicas en tiempo real en plantillas sin redibujar todo el árbol.
    ```html
    <!-- Reloj digital en vivo actualizándose cada segundo -->
    <h2>Hora actual: {{ 'now' | timeGuardLiveFormat:'HH:mm:ss':1000 }}</h2>

    <!-- Fecha estática actualizando su formato dinámicamente -->
    <p>Actualizado: {{ updateDate | timeGuardLiveFormat:'YYYY-MM-DD HH:mm:ss':5000 }}</p>
    ```

#### 3. Servicio Reactivo: `TimeGuardService`
Provee acceso inyectable a flujos reactivos basados en **RxJS**.
El método `getCurrentTime()` emite el tiempo actual en base a un intervalo. Internamente corre **fuera de la zona de Angular** (`runOutsideAngular`) y solo reingresa a la zona (`NgZone.run`) para emitir valores, lo que evita disparar ciclos de renderizado y disminuye drásticamente el consumo de CPU en aplicaciones SPA de gran escala.

```typescript
import { Component, OnInit } from '@angular/core';
import { TimeGuardService } from '@bereasoftware/timeguard/angular';
import { Observable } from 'rxjs';
import { TimeGuard } from '@bereasoftware/timeguard';

@Component({
  selector: 'app-clock',
  template: `
    <div *ngIf="time$ | async as time">
      Hora: {{ time.format('HH:mm:ss') }}
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
<a id="testing"></a>

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

## 🏛️ Arquitectura
<a id="arquitectura"></a>

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

### Estructura del Proyecto

```
timeguard/
├── src/
│   ├── core.ts                  # Implementación completa (~5KB gzip, EN/ES) — sin efectos secundarios
│   ├── index.ts                 # Único entry point: re-exporta core, asume `globalThis.Temporal` nativo
│   ├── adapters/
│   │   └── temporal.adapter.ts  # Wrapper del API Temporal (nunca importa un polyfill)
│   ├── calendars/               # 6 sistemas de calendario
│   ├── formatters/
│   │   └── date.formatter.ts    # Estrategias de formateo
│   ├── locales/                 # 40+ archivos de locale
│   ├── plugins/                 # 3 plugins (relative-time, duration, advanced-format)
│   └── types/                   # Definiciones de tipos
├── test/
│   ├── time-guard.test.ts       # Pruebas de la clase TimeGuard
│   ├── advanced.test.ts         # Pruebas avanzadas
│   ├── comprehensive.test.ts    # Pruebas de integración
│   ├── locales.test.ts          # Pruebas de locales
│   ├── plugins.test.ts          # Pruebas de plugins
│   └── bundle-size.test.ts      # Tamaño de bundle + prueba real de que el
│                                 #   paquete falla sin Temporal preexistente
│                                 #   (cero polyfill embebido)
└── vite.config.ts               # Config unificada (3 modos de build)
```

---

## 🤝 Contribuir
<a id="contribuir"></a>

¡Bienvenidas las contribuciones! Por favor:

1. Sigue los principios SOLID y patrones de código existentes
2. Escribe pruebas para nuevas funcionalidades
3. Actualiza la documentación
4. Asegúrate de que todas las pruebas pasen (`npm test`)
5. Verifica que los tipos pasen (`npx tsc --noEmit`)

---

## 📄 Licencia
<a id="licencia"></a>

Licencia MIT © 2024 Berea-Soft

Ver archivo [LICENSE](LICENSE) para detalles.

---

## 🔗 Enlaces Rápidos

- 📖 [Referencia API Completa](EXAMPLES.md)
- 🏛️ [Guía de Arquitectura](ARCHITECTURE.md)
- 🌍 [Guía de Localización](LOCALES.md)
- 🐛 [Rastreador de Problemas](https://github.com/bereasoftware/timeguard/issues)
- 💬 [Discusiones](https://github.com/bereasoftware/timeguard/discussions)

---

## 🤝 Contribuidores

¡Gracias a todos los que han contribuido!

<a href="https://github.com/Berea-Soft/timeguard/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Berea-Soft/timeguard" alt="contribuidores" />
</a>

---

## 📞 Soporte

Para preguntas, problemas o solicitudes de funciones:

- Abre un problema en GitHub
- Inicia una discusión
- Consulta la documentación existente

---

Construído con ❤️ por Berea-Soft

Una librería moderna de fecha/hora con principios SOLID y TypeScript
