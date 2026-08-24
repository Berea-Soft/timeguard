# TimeGuard - Librería Moderna de Fecha/Hora

> 📚 **Documentación disponible en otros idiomas:**
>
> 🇪🇸 **Español** (este archivo) | 🇬🇧 [English](ARCHITECTURE.en.md)

Una librería moderna y completamente tipada en TypeScript para manejo de fecha/hora, construida usando la **API Temporal**, siguiendo principios **SOLID** y diseñada con metodología **TDD/BDD**.

## 🎯 Características

- ✨ **TypeScript Completo** - Seguridad de tipos completa con modo estricto
- 🕐 **API Temporal** - Usa el nuevo API Temporal de JavaScript para manejo preciso de fecha/hora
- 🏗️ **Arquitectura SOLID** - Código limpio, mantenible y extensible
- 🧪 **Pruebas TDD/BDD** - Suite completa de pruebas con Vitest
- 🌍 **Soporte i18n** - Gestión de locales integrada (EN, ES, y extensible)
- 🔄 **Inmutable** - Todas las operaciones devuelven nuevas instancias
- 🪝 **Sistema de Plugins** - Extiende funcionalidad con plugins personalizados
- 📦 **Bundle Modular** - Core ligero (~5KB gzip), carga locales/plugins/calendarios bajo demanda
- 🔋 **Cero Dependencias** - Ningún polyfill embebido; usa el `Temporal` nativo del runtime (Node.js ≥26 o navegador moderno)

## 📦 Instalación

```bash
npm install @bereasoftware/timeguard
```

## 🚀 Inicio Rápido

```typescript
import { TimeGuard, timeGuard } from "@bereasoftware/timeguard";

// Crear instancia
const now = TimeGuard.now();
const date = new TimeGuard("2024-03-13");
const aliased = timeGuard("2024-03-13");

// Formatear
date.format("YYYY-MM-DD"); // "2024-03-13"
date.format("MMMM D, YYYY"); // "13 de Marzo de 2024"

// Aritmética
date.add({ day: 5 }).format("YYYY-MM-DD"); // "2024-03-18"
date.subtract({ month: 1 }).format("YYYY-MM-DD"); // "2024-02-13"

// Consultas
date.isBefore(new TimeGuard("2024-03-20")); // true
date.isAfter(new TimeGuard("2024-03-10")); // true

// Manipulación
date.startOf("month").format("YYYY-MM-DD"); // "2024-03-01"
date.endOf("year").format("YYYY-MM-DD"); // "2024-12-31"

// Encadenamiento
date.add({ month: 1 }).startOf("month").format("YYYY-MM-DD"); // "2024-04-01"
```

## 🏛️ Arquitectura y Principios SOLID

### Principio de Responsabilidad Única (SRP)

Cada clase tiene una única responsabilidad bien definida:

```
├── TemporalAdapter      → Conversión del API Temporal
├── DateFormatter        → Lógica de formateo de fechas
├── LocaleManager        → Gestión de locales
└── TimeGuard            → Fachada principal y coordinación
```

### Principio Abierto/Cerrado (OCP)

TimeGuard está abierto a extensión a través de plugins:

```typescript
interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(timeGuard: typeof TimeGuard, config?: unknown): void;
}
```

### Principio de Sustitución de Liskov (LSP)

Todos los objetos de fecha/hora implementan la interfaz `ITimeGuard` consistentemente:

```typescript
interface ITimeGuard extends IDateArithmetic, IDateQuery, IDateManipulation {
  // ... métodos requeridos
}
```

### Principio de Segregación de Interfaz (ISP)

Interfaces pequeñas y enfocadas en lugar de interfaces grandes:

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

### Principio de Inversión de Dependencias (DIP)

Depende de abstracciones, no de implementaciones concretas:

```typescript
// Los módulos de bajo nivel dependen de abstracciones
class TimeGuard implements ITimeGuard {
  private localeManager: LocaleManager; // Abstracción singleton
  private formatter: DateFormatter; // Inyección de dependencias
  private temporal: Temporal.PlainDateTime | Temporal.ZonedDateTime;
}
```

## 🧪 Estrategia de Pruebas (TDD/BDD)

Las pruebas se organizan alrededor de comportamientos del usuario (estilo BDD):

```typescript
describe("TimeGuard - Funcionalidad Principal", () => {
  describe("Crear instancias", () => {
    it("debe crear una instancia de TimeGuard con la fecha actual cuando no se proporciona argumento", () => {
      const tg = new TimeGuard();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });
  });

  describe("Formateo", () => {
    it("debe formatear con patrón YYYY-MM-DD", () => {
      const tg = new TimeGuard("2024-03-13T14:30:45.123");
      expect(tg.format("YYYY-MM-DD")).toBe("2024-03-13");
    });
  });

  // ... más pruebas
});
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Modo watch
npm run test:watch

# Reporte de cobertura
npm run test:coverage
```

## 📖 Referencia de API

### Crear Instancias

```typescript
// Fecha/hora actual
TimeGuard.now();

// Desde varias entradas
new TimeGuard("2024-03-13");
new TimeGuard(new Date());
new TimeGuard(1710340800000); // Timestamp Unix (ms)
new TimeGuard({ year: 2024, month: 3, day: 13 });

// Con configuración
new TimeGuard("2024-03-13", { locale: "es", timezone: "UTC" });

// Función factory
timeGuard("2024-03-13");
```

### Formateo

```typescript
const tg = new TimeGuard("2024-03-13T14:30:45");

// Patrones personalizados
tg.format("YYYY-MM-DD"); // "2024-03-13"
tg.format("DD/MM/YYYY"); // "13/03/2024"
tg.format("MMMM D, YYYY"); // "13 de Marzo de 2024"
tg.format("dddd"); // "Miércoles"
tg.format("[Fecha: ]YYYY-MM-DD"); // "Fecha: 2024-03-13"

// Presets
tg.format("iso"); // ISO 8601
tg.format("date"); // Solo fecha
tg.format("time"); // Solo hora
tg.format("datetime"); // Fecha y hora
tg.format("rfc2822"); // RFC 2822
tg.format("utc"); // Formato UTC
```

### Operaciones Aritméticas

```typescript
const tg = new TimeGuard("2024-03-13");

tg.add({ day: 5 });
tg.add({ month: 1, day: 15 });
tg.add({ year: 1, hour: 5, minute: 30 });

tg.subtract({ day: 5 });
tg.subtract({ month: 1, year: 1 });

// Diferencia entre fechas
tg.diff(new TimeGuard("2024-03-20"), "day"); // -7
tg.diff(new TimeGuard("2024-04-13"), "month"); // -1
```

### Operaciones de Consulta

```typescript
const tg1 = new TimeGuard("2024-03-13");
const tg2 = new TimeGuard("2024-03-20");

tg1.isBefore(tg2); // true
tg1.isAfter(tg2); // false
tg1.isSame(tg1.clone()); // true
tg1.isSame(tg2, "month"); // true

tg1.isBetween(new TimeGuard("2024-03-01"), new TimeGuard("2024-03-31")); // true
```

### Operaciones de Manipulación

```typescript
const tg = new TimeGuard("2024-03-13T14:30:45");

tg.clone(); // Nueva instancia
tg.startOf("year"); // 2024-01-01 00:00:00
tg.startOf("month"); // 2024-03-01 00:00:00
tg.startOf("day"); // 2024-03-13 00:00:00

tg.endOf("year"); // 2024-12-31 23:59:59
tg.endOf("month"); // 2024-03-31 23:59:59

tg.set({ month: 12, day: 25 }); // 2024-12-25 14:30:45
tg.set({ hour: 0, minute: 0 }); // 2024-03-13 00:00:00
```

### Operaciones de Conversión

```typescript
const tg = new TimeGuard("2024-03-13T14:30:45");

tg.toDate(); // Objeto JavaScript Date
tg.toISOString(); // "2024-03-13T14:30:45Z"
tg.valueOf(); // Timestamp Unix (ms)
tg.unix(); // Timestamp Unix (segundos)
tg.toJSON(); // String compatible con JSON
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

### Operaciones de Locale

```typescript
const tg = new TimeGuard("2024-03-13");

tg.locale(); // "en"
tg.locale("es").locale(); // "es"

tg.locale("es").format("MMMM"); // "Marzo"
tg.locale("en").format("MMMM"); // "March"

// Registrar locale personalizado
const manager = LocaleManager.getInstance();
manager.setLocale("custom", {
  /* datos del locale */
});
```

### Operaciones de Zona Horaria

```typescript
const tg = new TimeGuard("2024-03-13", { timezone: "UTC" });

tg.timezone(); // "UTC"
tg.timezone("America/New_York"); // Nueva instancia con diferente zona horaria
```

## 🔧 Desarrollo

### Estructura del Proyecto

```
src/
├── core.ts                     # Implementación (TimeGuard, DurationResult, TimeRange) — sin efectos secundarios
├── index.ts                    # Único entry point (~5KB gzip): re-exporta core, asume `globalThis.Temporal` nativo
├── react.ts / vue.ts / angular.ts / svelte.ts / solid.ts / qwik.ts  # Integraciones por framework
├── adapters/
│   └── temporal.adapter.ts     # Adaptador del API Temporal (nunca importa un polyfill)
├── calendars/
│   ├── index.ts                # Exporta todos los calendarios
│   └── calendar.manager.ts     # Gestor + Gregoriano (core)
├── formatters/
│   └── date.formatter.ts       # Estrategia de formateo de fechas
├── locales/
│   ├── index.ts                # Exporta los 40+ locales
│   └── locale.manager.ts       # Gestor singleton (EN/ES en core)
├── plugins/
│   ├── manager.ts              # Gestor de plugins
│   ├── relative-time/          # Plugin de tiempo relativo
│   ├── duration/                # Plugin de duración ISO 8601
│   └── advanced-format/        # Plugin de formato avanzado
├── utils/
│   └── duration-locale.ts      # Helpers de localización de duraciones
└── types/                      # Interfaces y tipos de TypeScript

test/
├── time-guard.test.ts          # Pruebas de la clase TimeGuard
├── advanced.test.ts            # Pruebas de características avanzadas
├── comprehensive.test.ts       # Pruebas de integración
├── locales.test.ts             # Pruebas de locales
├── plugins.test.ts             # Pruebas de plugins
├── bundle-size.test.ts         # Tamaño de bundle + prueba en runtime real de que
│                                #   el paquete falla sin Temporal preexistente
│                                #   (cero polyfill embebido en ningún lado)
└── setup.ts                    # Configuración global de Vitest — sin Temporal nativo
                                 #   (Node <26), carga temporal-mock.ts: un mock propio,
                                 #   sin dependencias, no @js-temporal/polyfill
```

`core.ts` es el único módulo que implementa la lógica de TimeGuard, y es **exactamente el mismo código** (byte a byte) que usa el paquete hermano [`@bereasoftware/time-guard`](https://github.com/Berea-Soft/time-guard) — ahí `index.ts` auto-carga el polyfill antes de reexportar `core.ts`; aquí `index.ts` simplemente reexporta `core.ts` asumiendo que `Temporal` ya existe. Esto garantiza por construcción que ambos paquetes tengan **idéntica superficie de API y funcionalidades**; la única diferencia es el contrato de runtime (polyfill automático vs. nativo). Ver [Requisitos](README.md#requisitos) para las versiones de Node.js/navegador necesarias.

### Sistema de Build Modular

El build se ejecuta en 2 pasos:

```bash
# npm run build ejecuta:
vite build                  # Submódulos (ES + CJS)
vite build --mode umd       # Core + submódulos (UMD + IIFE + ES + CJS + tipos)
```

**Subpath exports** en `package.json`:

```typescript
import { TimeGuard } from '@bereasoftware/timeguard'              // Core ligero, cero dependencias
import { ALL_LOCALES } from '@bereasoftware/timeguard/locales'    // Locales bajo demanda
import { IslamicCalendar } from '@bereasoftware/timeguard/calendars'
import relativeTimePlugin from '@bereasoftware/timeguard/plugins/relative-time'
import { Duration } from '@bereasoftware/timeguard/plugins/duration'
import { useTimeGuard } from '@bereasoftware/timeguard/react'      // React hooks & Context Provider
import { useTimeGuard } from '@bereasoftware/timeguard/vue'        // Vue composables, directivas & plugins
import { TimeGuardService } from '@bereasoftware/timeguard/angular' // Angular service, pipes, DI Token & live pipes
```

### Comandos de Build

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Build watch
npm run build:watch

# Verificación de tipos
npm run type-check

# Lint
npm run lint

# Formatear
npm run format
```

## 🎨 Patrones de Diseño Utilizados

1. **Patrón Fachada** - `TimeGuard` proporciona interfaz unificada a múltiples subsistemas
2. **Patrón Adaptador** - `TemporalAdapter` convierte entre APIs
3. **Patrón Estrategia** - `DateFormatter` encapsula estrategias de formateo
4. **Patrón Singleton** - `LocaleManager` asegura una única instancia
5. **Patrón Factory** - Métodos estáticos para crear instancias
6. **Patrón Inmutable** - Todas las operaciones devuelven nuevas instancias

## 🌍 Locales Soportados

**40+ locales incluidos** organizados por familia: inglés (4), español (3), románicos (5), eslavos (4), nórdicos (4), asiáticos (7), europeos (7), Medio Oriente/Asia del Sur (3), y más.

El **core** incluye solo EN y ES para mantener el bundle ligero. Los demás se cargan bajo demanda:

```typescript
// Core: solo EN/ES disponibles
import { TimeGuard } from '@bereasoftware/timeguard';

// Cargar todos los locales bajo demanda
import { ALL_LOCALES, registerAllLocales } from '@bereasoftware/timeguard/locales';
import { LocaleManager } from '@bereasoftware/timeguard';
LocaleManager.getInstance().loadLocales(ALL_LOCALES);

// O importar directamente desde el entry principal
import { TimeGuard } from '@bereasoftware/timeguard';
```

Agregar locales personalizados:

```typescript
import { LocaleManager } from '@bereasoftware/timeguard';

const manager = LocaleManager.getInstance();
manager.setLocale('custom', {
  name: 'custom',
  months: ['Enero', 'Febrero', ...],
  monthsShort: ['Ene', 'Feb', ...],
  weekdays: ['Domingo', 'Lunes', ...],
  weekdaysShort: ['Dom', 'Lun', ...],
  weekdaysMin: ['D', 'L', ...],
});
```

## 📝 Unidades Soportadas

Unidades disponibles para aritmética y formateo:

- `year` / `Y`
- `month` / `MMM` / `MMMM`
- `week` / `W`
- `day` / `D` / `DD`
- `hour` / `H` / `HH`
- `minute` / `m` / `mm`
- `second` / `s` / `ss`
- `millisecond` / `ms`

## 🧠 Detalles Clave de Implementación

### Inmutabilidad

Todas las operaciones devuelven nuevas instancias, asegurando inmutabilidad:

```typescript
const original = new TimeGuard("2024-03-13");
const modified = original.add({ day: 1 });

console.log(original.format("YYYY-MM-DD")); // "2024-03-13"
console.log(modified.format("YYYY-MM-DD")); // "2024-03-14"
```

### Seguridad de Tipos

Soporte completo de TypeScript con modo estricto:

```typescript
// Todo está tipado
const tg: TimeGuard = new TimeGuard("2024-03-13");
const formatted: string = tg.format("YYYY-MM-DD");
const diff: number = tg.diff(TimeGuard.now(), "day");
```

### API Temporal

Usa el API nativo Temporal para operaciones precisas de fecha/hora:

```typescript
// Internamente usa Temporal.PlainDateTime
const temporal = tg.toTemporal();
```

## 🚀 Rendimiento

- **Core ~5KB gzip** — solo lo esencial (TimeGuard, formatter, EN/ES, Gregoriano)
- Sobrecarga mínima a través del patrón adaptador
- Evaluación perezosa donde es posible
- Caché eficiente de locales
- **Cero dependencias, ni siquiera de desarrollo** — `@js-temporal/polyfill` no aparece en `dependencies` ni en `devDependencies`. Los tipos de `Temporal` vienen del lib ambiental de TypeScript (`ESNext.Temporal`, ver `tsconfig.json`), y los tests en Node <26 usan un mock propio sin dependencias (`test/temporal-mock.ts`)

## 📄 Licencia

Licencia MIT - Ver archivo LICENSE para detalles

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor asegúrate de:

1. Todas las pruebas pasan
2. Las nuevas características incluyen pruebas (TDD)
3. El código sigue principios SOLID
4. Cumple con modo estricto de TypeScript
5. La documentación se actualiza

## 📚 Referencias

- [Propuesta del API Temporal](https://tc39.es/proposal-temporal/)
- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Metodología BDD/TDD](https://en.wikipedia.org/wiki/Behavior-driven_development)

## 🎯 Roadmap

- [x] 40+ locales (EN, ES, FR, DE, IT, JA, ZH, KO, AR, etc.)
- [x] Sistema de plugins (relative-time, duration, advanced-format)
- [x] 6 sistemas de calendario (Gregoriano, Islámico, Hebreo, Chino, Japonés, Budista)
- [x] Build UMD/IIFE para CDN y `<script>`
- [x] Arquitectura modular (core ~5KB gzip + carga bajo demanda)
- [ ] Soporte avanzado de zona horaria (conversiones DST)
- [ ] Optimizaciones de rendimiento
- [ ] Patrones de recurrencia de fechas

## 📧 Soporte

Para problemas, preguntas o sugerencias, por favor abre un issue en GitHub.

---

**Construido con ❤️ por Berea-Soft**
