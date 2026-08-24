# Guía de Plugins TimeGuard

> 📚 **Documentación disponible en otros idiomas:**
>
> - 🇪🇸 **Español** (este archivo - PLUGINS.md)
> - 🇬🇧 [English](PLUGINS.en.md)

## Resumen General

TimeGuard incluye un sistema de plugins opcional que extiende la funcionalidad principal sin aumentar el tamaño de la biblioteca. Todos los plugins siguen principios SOLID y están diseñados para ser componibles.

## Inicio Rápido

### Uso Básico de Plugins

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";
import durationPlugin from "@bereasoftware/timeguard/plugins/duration";

// Registrar plugins
PluginManager.use(relativeTimePlugin, TimeGuard);
PluginManager.use(durationPlugin, TimeGuard);

// Ahora usa las características del plugin
const date = TimeGuard.from("2024-03-13T10:30:00");
console.log(date.fromNow()); // "hace unos segundos"
console.log(date.toNow()); // "en 3 segundos"
```

---

## 📦 Plugins Disponibles

### 1. Plugin de Tiempo Relativo

Añade diferencias de tiempo legibles para humanos.

#### Instalación

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";

PluginManager.use(relativeTimePlugin, TimeGuard);
```

#### Métodos

**`.fromNow(withoutSuffix?: boolean): string`**
Devuelve la diferencia de tiempo desde ahora en el pasado.

```typescript
const pastDate = TimeGuard.from("2024-03-10");
console.log(pastDate.fromNow()); // "hace 3 días"
console.log(pastDate.fromNow(true)); // "3 días"
```

**`.toNow(withoutSuffix?: boolean): string`**
Devuelve la diferencia de tiempo hacia el futuro.

```typescript
const futureDate = TimeGuard.from("2024-03-20");
console.log(futureDate.toNow()); // "en 7 días"
console.log(futureDate.toNow(true)); // "7 días"
```

**`.humanize(other?: TimeGuard, withoutSuffix?: boolean): string`**
Obtiene la duración legible entre dos fechas.

```typescript
const date1 = TimeGuard.from("2024-03-13");
const date2 = TimeGuard.from("2024-03-20");
console.log(date1.humanize(date2)); // "en 7 días"
```

#### Ejemplos

```typescript
// Eventos pasados
TimeGuard.from("2024-01-01").fromNow(); // "hace 2 meses"
TimeGuard.from("2024-03-13 14:00").fromNow(); // "hace 30 minutos"

// Eventos futuros
TimeGuard.from("2024-04-01").toNow(); // "en 19 días"
TimeGuard.from("2024-03-14").toNow(); // "en 1 día"

// Sin sufijo
TimeGuard.from("2024-03-10").fromNow(true); // "3 días"
TimeGuard.from("2024-03-20").toNow(true); // "7 días"
```

#### Personalización

```typescript
import { RelativeTimePlugin } from "@bereasoftware/timeguard/plugins/relative-time";

const customPlugin = new RelativeTimePlugin({
  rounding: Math.floor, // Usar floor en lugar de round
  thresholds: [
    { l: "s", r: 44, d: "second" },
    { l: "m", r: 89 },
    { l: "mm", r: 44, d: "minute" },
    // ... umbrales personalizados
  ],
});

PluginManager.use(customPlugin, TimeGuard);

// Personalizar formatos
customPlugin.setFormats({
  past: "{0} atrás",
  future: "en {0}",
  s: "hace un segundo",
  m: "hace un minuto",
});
```

---

### 2. Plugin de Duración

Implementa soporte de duración ISO 8601 para intervalos de tiempo y cálculos.

#### Instalación

```typescript
import { TimeGuard, PluginManager, Duration } from "@bereasoftware/timeguard";
import durationPlugin from "@bereasoftware/timeguard/plugins/duration";

PluginManager.use(durationPlugin, TimeGuard);
```

#### Métodos

**`Duration.fromISO(iso: string): Duration`**
Crea una duración a partir de una cadena ISO 8601.

```typescript
const duration = Duration.fromISO("P3Y6M4DT12H30M5S");
console.log(duration.humanize()); // "3 años, 6 meses, 4 días, 12 horas, 30 minutos, 5 segundos"
```

**`Duration.between(from: TimeGuard, to: TimeGuard): Duration`**
Obtiene la duración entre dos fechas.

```typescript
const from = TimeGuard.from("2024-01-01");
const to = TimeGuard.from("2024-12-31");
const duration = Duration.between(from, to);

console.log(duration.asDays()); // 364
console.log(duration.toISO()); // "P364D"
```

**`Duration.fromMilliseconds(ms: number): Duration`**
Crea una duración desde milisegundos.

```typescript
const duration = Duration.fromMilliseconds(86400000);
console.log(duration.asDays()); // 1
```

#### Métodos de Duración

```typescript
const duration = Duration.fromISO("P2Y3M4DT5H6M7S");

// Obtener en unidades específicas
duration.as("years"); // ~2.25
duration.asYears(); // ~2.25
duration.asMonths(); // ~27
duration.asDays(); // ~824
duration.asHours(); // ~19776
duration.asMinutes(); // ~1186560
duration.asSeconds(); // ~71193607

// Obtener componentes
duration.toObject();
// {
//   years: 2,
//   months: 3,
//   days: 4,
//   hours: 5,
//   minutes: 6,
//   seconds: 7,
// }

// Formatear
duration.toISO(); // "P2Y3M4DT5H6M7S"
duration.humanize(); // "2 años, 3 meses, 4 días, 5 horas, 6 minutos, 7 segundos"

// Verificar
duration.isNegative(); // false
duration.abs(); // Devuelve duración absoluta
```

#### Ejemplos

```typescript
// Calcular duraciones
const birthday = TimeGuard.from("1990-03-13");
const today = TimeGuard.now();
const age = Duration.between(birthday, today);

console.log(age.asYears()); // ~34.algo

// Comparar duraciones
const projectStart = TimeGuard.from("2024-01-01");
const projectEnd = TimeGuard.from("2024-06-30");
const projectDuration = Duration.between(projectStart, projectEnd);

console.log(projectDuration.asDays()); // 182
console.log(projectDuration.humanize()); // "6 meses, 4 días"

// Analizar ISO 8601
const sprint = Duration.fromISO("P2W3D");
console.log(sprint.asDays()); // 17
console.log(sprint.humanize()); // "2 semanas, 3 días"
```

---

### 3. Plugin de Formato Avanzado

Añade tokens de formato avanzado para necesidades de formato especializadas.

#### Instalación

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import advancedFormatPlugin from "@bereasoftware/timeguard/plugins/advanced-format";

PluginManager.use(advancedFormatPlugin, TimeGuard);
```

#### Tokens Avanzados

| Token  | Descripción                         | Ejemplo                   |
| ------ | ----------------------------------- | ------------------------- |
| `Q`    | Trimestre                           | 1, 2, 3, 4                |
| `Do`   | Día ordinal                         | 13º, 21º, 2º              |
| `w`    | Semana del año                      | 1, 2, ..., 52             |
| `ww`   | Semana del año (relleno)            | 01, 02, ..., 52           |
| `W`    | Semana ISO                          | 1, 2, ..., 53             |
| `WW`   | Semana ISO (relleno)                | 01, 02, ..., 53           |
| `gggg` | Año de la semana                    | 2024                      |
| `GGGG` | Año de la semana ISO                | 2024                      |
| `k`    | Hora (1-24)                         | 1, 2, ..., 24             |
| `kk`   | Hora (1-24, relleno)                | 01, 02, ..., 24           |
| `X`    | Marca de tiempo Unix (segundos)     | 1710337800                |
| `x`    | Marca de tiempo Unix (milisegundos) | 1710337800000             |
| `z`    | Zona horaria corta                  | UTC, EST                  |
| `zzz`  | Zona horaria larga                  | Hora Universal Coordinada |

#### Ejemplos

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45");

// Trimestre
date.format("Q"); // "1"
date.format("[Q]Q YYYY"); // "Q1 2024"

// Día ordinal
date.format("Do MMMM YYYY"); // "13º marzo 2024"

// Números de semana
date.format("w [semana]"); // "11 semana"
date.format("[Semana ISO] W"); // "Semana ISO 11"
date.format("GGGG-WW"); // "2024-11"

// Formatos de hora
date.format("k:mm:ss"); // "14:30:45"
date.format("X"); // Segundos Unix
date.format("x"); // Milisegundos Unix

// Zona horaria
date.format("YYYY-MM-DD HH:mm:ss z");
// "2024-03-13 14:30:45 UTC"

// Patrones complejos
date.format("[Q]Q YYYY, dddd [semana] w, [Día] Do");
// "Q1 2024, miércoles semana 11, Día 13º"
```

---

## 🔧 Gestión de Plugins

### Registrando Plugins

```typescript
// Registrar un plugin
PluginManager.use(relativeTimePlugin, TimeGuard);

// Registrar múltiples plugins
PluginManager.useMultiple(
  [relativeTimePlugin, durationPlugin, advancedFormatPlugin],
  TimeGuard,
);
```

### Verificando Plugins

```typescript
// Verificar si un plugin está registrado
if (PluginManager.hasPlugin("relative-time")) {
  console.log("El plugin de tiempo relativo está activo");
}

// Listar plugins registrados
const plugins = PluginManager.listPlugins();
console.log(plugins); // ['relative-time', 'duration', 'advanced-format']

// Obtener instancia del plugin
const plugin = PluginManager.getPlugin("duration");
```

### Desregistrando Plugins

```typescript
// Desregistrar un plugin
PluginManager.unuse("relative-time");

// Limpiar todos los plugins
PluginManager.clear();
```

---

## 📝 Uso Avanzado

### Usando Múltiples Plugins Juntos

```typescript
import { TimeGuard, PluginManager, Duration } from "@bereasoftware/timeguard";
import {
  relativeTimePlugin,
  durationPlugin,
  advancedFormatPlugin,
} from "@bereasoftware/timeguard/plugins";

// Registrar todos los plugins
PluginManager.use(relativeTimePlugin, TimeGuard);
PluginManager.use(durationPlugin, TimeGuard);
PluginManager.use(advancedFormatPlugin, TimeGuard);

// Ahora usa características combinadas
const projectStart = TimeGuard.from("2024-01-01 10:00:00");
const today = TimeGuard.now();

console.log(projectStart.fromNow()); // "hace 2 meses, 12 días"
console.log(Duration.between(projectStart, today).asDays()); // 72.42...
console.log(projectStart.format("[Q]Q YYYY")); // "Q1 2024"
console.log(today.format("Do MMMM YYYY")); // "13º marzo 2024"
```

### Creando Configuración Personalizada

```typescript
import { RelativeTimePlugin } from "@bereasoftware/timeguard/plugins/relative-time";
import { DurationPlugin } from "@bereasoftware/timeguard/plugins/duration";

// Tiempo relativo personalizado
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

## ⚡ Consideraciones de Rendimiento

- Los plugins son **cargados perezosamente** - sin sobrecarga hasta registrarse
- Usa **composición** - solo registra plugins necesarios
- **Tree-shakeable** - los bundlers eliminan plugins no utilizados
- Cada plugin se ejecuta en **ámbito aislado** - sin contaminación

---

## 🐛 Resolución de Problemas

### Los métodos del plugin no están disponibles

**Problema:** Los métodos como `.fromNow()` no están definidos

**Solución:** Asegúrate de registrar el plugin antes de usarlo:

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/timeguard";
import relativeTimePlugin from "@bereasoftware/timeguard/plugins/relative-time";

// Registrar PRIMERO
PluginManager.use(relativeTimePlugin, TimeGuard);

// Luego usar
const date = TimeGuard.now();
console.log(date.fromNow()); // ¡Ahora funciona!
```

### Confusión de múltiples instancias

**Problema:** Un plugin afecta a todas las instancias de TimeGuard

**Solución:** Las modificaciones del plugin son **globales** - afectan a todas las instancias una vez registradas:

```typescript
const plugin = new RelativeTimePlugin({
  /* config */
});
PluginManager.use(plugin, TimeGuard);

// Todas las instancias de TimeGuard ahora tienen .fromNow(), .toNow(), .humanize()
const date1 = TimeGuard.now();
const date2 = TimeGuard.from("2024-01-01");
console.log(date1.fromNow()); // Funciona
console.log(date2.fromNow()); // También funciona
```

---

## 📝 Creando Plugins Personalizados

Para crear un plugin personalizado, implementa la interfaz `ITimeGuardPlugin`:

```typescript
import type { ITimeGuardPlugin } from "@bereasoftware/timeguard";
import type { TimeGuard } from "@bereasoftware/timeguard";

export class MyPlugin implements ITimeGuardPlugin {
  name = "my-plugin";
  version = "1.0.0";

  install(TimeGuardClass: typeof TimeGuard): void {
    // Extender el prototipo de TimeGuard
    (TimeGuardClass.prototype as any).myMethod = function() {
      return "Hello from my plugin!";
    };
  }
}
```

Luego registra tu plugin:

```typescript
PluginManager.use(new MyPlugin(), TimeGuard);
```

---

## 📖 Referencia API

Referencia API completa para cada plugin:

- **RelativeTimePlugin**: `.fromNow()`, `.toNow()`, `.humanize()`
- **DurationPlugin**: `Duration.fromISO()`, `Duration.between()`, `Duration.fromMilliseconds()`
- **AdvancedFormatPlugin**: Tokens de formato avanzado (Q, Do, w, W, etc.)

---

## 🎯 Próximos Pasos

- Intenta combinar plugins para operaciones poderosas de fecha/hora
- Crea plugins personalizados para necesidades específicas del dominio
- Consulta [ejemplos](../EXAMPLES.md) para uso en el mundo real
