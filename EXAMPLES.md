# Ejemplos de Uso de TimeGuard

> 📚 **Documentación disponible en otros idiomas:**
>
> 🇪🇸 **Español** (este archivo) | 🇬🇧 [English](EXAMPLES.en.md)

Ejemplos comprensivos mostrando casos de uso comunes y patrones de uso de la librería TimeGuard.

## 1. Uso Básico

Crear instancias de TimeGuard:

```typescript
import { TimeGuard, timeGuard } from "@bereasoftware/timeguard";

// Crear instancias
const now = TimeGuard.now();
const specificDate = TimeGuard.from("2024-03-13");
const fromTimestamp = TimeGuard.from(Date.now());
const withConfig = TimeGuard.from("2024-03-13", { locale: "es" });

console.log("Uso Básico:");
console.log(now.toString()); // Fecha/hora actual
console.log(specificDate.format("YYYY-MM-DD HH:mm:ss")); // 2024-03-13 00:00:00
```

## 2. Operaciones Aritméticas

Agregar y restar tiempo:

```typescript
const date = TimeGuard.from("2024-03-13");

console.log("\nAritmética:");
console.log("Agregar 5 días:", date.add({ day: 5 }).format("YYYY-MM-DD"));
console.log("Agregar 1 mes:", date.add({ month: 1 }).format("YYYY-MM-DD"));
console.log(
  "Restar 2 semanas:",
  date.subtract({ week: 2 }).format("YYYY-MM-DD"),
);
console.log(
  "Complejo:",
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

## 3. Formateo

Varios formatos de salida:

```typescript
const dateTime = TimeGuard.from("2024-03-13T14:30:45.123");

console.log("\nFormateo:");
console.log("ISO:", dateTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
console.log("Formato US:", dateTime.format("MM/DD/YYYY"));
console.log("Formato EU:", dateTime.format("DD.MM.YYYY"));
console.log("Con hora:", dateTime.format("YYYY-MM-DD HH:mm:ss"));
console.log("Texto completo:", dateTime.format("dddd, MMMM D, YYYY"));
console.log(
  "Texto escapado:",
  dateTime.format("[Fecha: ]YYYY-MM-DD[ a las ]HH:mm"),
);

// Presets
console.log("Preset ISO:", dateTime.format("iso"));
console.log("Preset fecha:", dateTime.format("date"));
console.log("Preset hora:", dateTime.format("time"));
```

## 4. Operaciones de Consulta

Comparación entre fechas:

```typescript
const date1 = TimeGuard.from("2024-03-13");
const date2 = TimeGuard.from("2024-03-20");
const date3 = TimeGuard.from("2024-03-13");

console.log("\nOperaciones de Consulta:");
console.log("date1 < date2:", date1.isBefore(date2)); // true
console.log("date2 > date1:", date2.isAfter(date1)); // true
console.log("date1 == date3:", date1.isSame(date3)); // true
console.log("Mismo mes:", date1.isSame(date2, "month")); // true
console.log("Mismo año:", date1.isSame(date2, "year")); // true

// Verificar si está entre
const start = TimeGuard.from("2024-03-01");
const middle = TimeGuard.from("2024-03-15");
const end = TimeGuard.from("2024-03-31");
console.log("Está entre:", middle.isBetween(start, end)); // true
```

## 5. Manipulación

Operaciones de manipulación de fechas:

```typescript
const original = TimeGuard.from("2024-03-13T14:30:45");

console.log("\nManipulación:");
console.log("Original:", original.format("YYYY-MM-DD HH:mm:ss"));
console.log("Clon:", original.clone().format("YYYY-MM-DD HH:mm:ss"));
console.log(
  "Inicio del año:",
  original.startOf("year").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "Inicio del mes:",
  original.startOf("month").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "Inicio del día:",
  original.startOf("day").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "Fin del mes:",
  original.endOf("month").format("YYYY-MM-DD HH:mm:ss"),
);
console.log(
  "Establecer valores:",
  original.set({ month: 12, day: 25 }).format("YYYY-MM-DD"),
);
```

## 6. Diferencias y Cálculos

Calcular diferencias entre fechas:

```typescript
const pastDate = TimeGuard.from("2024-01-01");
const futureDate = TimeGuard.from("2024-12-31");

console.log("\nDiferencias:");
console.log("Días entre:", futureDate.diff(pastDate, "day"));
console.log("Meses entre:", futureDate.diff(pastDate, "month"));
console.log("Años entre:", futureDate.diff(pastDate, "year"));
console.log("Horas entre:", futureDate.diff(pastDate, "hour"));
```

## 7. Soporte de Locales

Usar diferentes idiomas:

```typescript
const englishDate = TimeGuard.from("2024-03-13", { locale: "en" });
const spanishDate = englishDate.locale("es");

console.log("\nSoporte de Locales:");
console.log("Inglés:", englishDate.format("MMMM D, YYYY"));
console.log("Español:", spanishDate.format("MMMM D, YYYY"));
console.log("Día semana EN:", englishDate.format("dddd"));
console.log("Día semana ES:", spanishDate.format("dddd"));
```

## 8. Métodos de Conversión

Conversiones a diferentes formatos:

```typescript
const testDate = TimeGuard.from("2024-03-13T14:30:45.123");

console.log("\nConversión:");
console.log("A Date:", testDate.toDate());
console.log("A ISO:", testDate.toISOString());
console.log("A Unix (ms):", testDate.valueOf());
console.log("A Unix (s):", testDate.unix());
console.log("A JSON:", testDate.toJSON());
console.log("A String:", testDate.toString());
```

## 9. Getters

Obtener componentes de una fecha:

```typescript
const fullDate = TimeGuard.from("2024-03-13T14:30:45.789");

console.log("\nGetters:");
console.log("Año:", fullDate.get("year"));
console.log("Mes:", fullDate.get("month"));
console.log("Día:", fullDate.get("day"));
console.log("Hora:", fullDate.get("hour"));
console.log("Minuto:", fullDate.get("minute"));
console.log("Segundo:", fullDate.get("second"));
console.log("Milisegundo:", fullDate.get("millisecond"));
```

## 10. Encadenamiento de Operaciones

API fluida para múltiples operaciones:

```typescript
console.log("\nEncadenamiento:");
const result = TimeGuard.from("2024-03-13")
  .add({ month: 1 })
  .add({ day: 5 })
  .startOf("day")
  .set({ hour: 12 })
  .format("YYYY-MM-DD HH:mm:ss");

console.log("Resultado encadenado:", result);
```

## 11. Casos de Uso del Mundo Real

### Programación de Reuniones

```typescript
const meetingDate = TimeGuard.from("2024-03-15T09:00:00");
const nextWeekMeeting = meetingDate.add({ week: 1 });
const recurringMeeting = meetingDate.add({ week: 2 });

console.log("Primera reunión:", meetingDate.format("dddd, MMMM D a las HH:mm"));
console.log(
  "Próxima semana:",
  nextWeekMeeting.format("dddd, MMMM D a las HH:mm"),
);
console.log(
  "Recurrente (2 semanas):",
  recurringMeeting.format("dddd, MMMM D a las HH:mm"),
);
```

### Cálculo de Edad

```typescript
const birthDate = TimeGuard.from("1990-05-15");
const today = TimeGuard.now();
const age = today.diff(birthDate, "year");
console.log(`Nacido: ${birthDate.format("MMMM D, YYYY")}`);
console.log(`Edad: ${age} años`);
```

### Plazos de Proyecto

```typescript
const projectStart = TimeGuard.from("2024-03-01");
const milestone1 = projectStart.add({ month: 1 });
const milestone2 = milestone1.add({ month: 1 });
const deadline = projectStart.add({ month: 3 });

console.log("Inicio:", projectStart.format("YYYY-MM-DD"));
console.log("Hito 1:", milestone1.format("YYYY-MM-DD"));
console.log("Hito 2:", milestone2.format("YYYY-MM-DD"));
console.log("Plazo final:", deadline.format("YYYY-MM-DD"));
```

### Operaciones Comerciales

```typescript
const now_check = TimeGuard.now();
const quarterEnd = now_check.endOf("quarter");
const monthEnd = now_check.endOf("month");

console.log("Trimestre actual finaliza:", quarterEnd.format("YYYY-MM-DD"));
console.log("Mes finaliza:", monthEnd.format("YYYY-MM-DD"));
```

### Verificación de Expiración

```typescript
const subscriptionDate = TimeGuard.from("2024-03-13");
const expirationDate = subscriptionDate.add({ year: 1 });
const isExpired = TimeGuard.now().isAfter(expirationDate);
const daysUntilExpiry = expirationDate.diff(TimeGuard.now(), "day");

console.log("Fecha de suscripción:", subscriptionDate.format("YYYY-MM-DD"));
console.log("Fecha de expiración:", expirationDate.format("YYYY-MM-DD"));
console.log("¿Ha expirado?:", isExpired);
console.log("Días hasta expiración:", daysUntilExpiry);
```

### Consultas de Rango de Fechas

```typescript
const quarterStart = TimeGuard.from("2024-01-01");
const quarterEnd_check = TimeGuard.from("2024-03-31");
const testDate_check = TimeGuard.from("2024-02-15");

const isInQuarter = testDate_check.isBetween(quarterStart, quarterEnd_check);
console.log(
  `Q1 2024: ${quarterStart.format("YYYY-MM-DD")} a ${quarterEnd_check.format("YYYY-MM-DD")}`,
);
console.log(`¿2024-02-15 está en Q1?: ${isInQuarter}`);
```

## 12. Inmutabilidad

TimeGuard es inmutable - las operaciones devuelven nuevas instancias:

```typescript
const original_check = TimeGuard.from("2024-03-13");
const modified = original_check.add({ day: 5 });

console.log("Original sin cambios:", original_check.format("YYYY-MM-DD"));
console.log("Nueva instancia:", modified.format("YYYY-MM-DD"));
console.log("¿Son lo mismo?", original_check === modified);
```

## 13. Seguridad de Tipos

Todas las operaciones están completamente tipadas en TypeScript:

```typescript
const tg: TimeGuard = TimeGuard.from("2024-03-13");
const formatted: string = tg.format("YYYY-MM-DD");
const diff: number = tg.diff(TimeGuard.now(), "day");
const isBefore: boolean = tg.isBefore(TimeGuard.now());

console.log("Formateado (string):", formatted, typeof formatted);
console.log("Diferencia (number):", diff, typeof diff);
console.log("EsAntes (boolean):", isBefore, typeof isBefore);
```
