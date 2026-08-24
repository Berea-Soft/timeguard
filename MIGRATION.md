# MIGRATION

Guidelines and checklist for performing migrations (breaking changes, major version upgrades, build-system or publishing changes).

## Breaking changes

### v3.0.0 — Main entry no longer auto-registers all locales

Previously, `import { TimeGuard } from '@bereasoftware/timeguard'` eagerly registered
all ~47 bundled locales into `LocaleManager` as a module side effect, even if the
app only ever used one or two of them. This ran on every import regardless of
`"sideEffects": false`, and blocked real lazy-loading of locale data.

As of v3.0.0, the main entry only registers `en`/`es` by default (same as before
for the *built-in* locales, unrelated to this change). If your app relies on other
locales being available without extra setup, call `loadAllLocales()` once at startup:

```typescript
import { loadAllLocales } from '@bereasoftware/timeguard';
loadAllLocales();
```

Or register only the locales you actually use, from the standalone `/locales`
entry (so unused locale data can still be tree-shaken by your bundler):

```typescript
import { LocaleManager } from '@bereasoftware/timeguard';
import { ALL_LOCALES } from '@bereasoftware/timeguard/locales';
LocaleManager.getInstance().loadLocales({ fr: ALL_LOCALES.fr, de: ALL_LOCALES.de });
```

Nothing else changes: `TimeGuard`, plugins, and calendars behave exactly as
before — only the locale auto-registration moved from implicit (import side
effect) to explicit (opt-in function call).

## Migrating from other libraries

### From date-fns
`date-fns` uses a functional approach with pure functions. `TimeGuard` uses a more object-oriented, chainable API similar to Day.js but powered by Temporal.

| Feature | date-fns | TimeGuard |
|---------|----------|-----------|
| Create | `new Date()` | `timeGuard()` |
| Parse | `parseISO('2024-01-01')` | `timeGuard('2024-01-01')` |
| Add | `addDays(date, 7)` | `tg.add({ day: 7 })` |
| Diff | `differenceInDays(d1, d2)` | `tg1.diff(tg2, 'day')` |
| Format | `format(date, 'yyyy-MM-dd')` | `tg.format('YYYY-MM-DD')` |

### From Day.js
Migration from Day.js is straightforward as the API is very similar.

| Feature | Day.js | TimeGuard |
|---------|--------|-----------|
| Create | `dayjs()` | `timeGuard()` |
| Plugin | `dayjs.extend(relativeTime)` | `PluginManager.use(relativeTimePlugin, TimeGuard)` |
| Start of | `dayjs().startOf('month')` | `timeGuard().startOf('month')` |
| Is Before | `d1.isBefore(d2)` | `tg1.isBefore(tg2)` |
| Humanize | `duration.humanize()` | `tg1.until(tg2).humanize()` |

### From Luxon
Luxon uses `DateTime` objects. TimeGuard's `TimeGuard` class is the equivalent.

| Feature | Luxon | TimeGuard |
|---------|-------|-----------|
| Create | `DateTime.now()` | `TimeGuard.now()` |
| Timezone | `dt.setZone('UTC')` | `tg.timezone('UTC')` |
| Duration | `Interval.fromDateTimes(s, e).toDuration()` | `TimeGuard.range(s, e).toDuration()` |
| Object | `dt.toObject()` | `tg.toPlainDate()` |

## Migration checklist
- [ ] Create an upgrade branch and link an issue describing the migration goal.
- [ ] Update `CHANGELOG.md` and `ARCHITECTURE.md` as appropriate.
- [ ] Run the full test suite: `npm test` / `npm run test`.
- [ ] Run builds: `npx vite build --mode full && npx vite build --mode umd`.
- [ ] Verify package exports using the repository `verify-package-exports-*` tasks.
- [ ] Update `package.json` `exports` and `types` fields if required.
- [ ] Publish from CI or a release agent; follow the release checklist.

## Notes
- For TypeScript version upgrades follow the `typescript-upgrade` workflow and validate generated types.
- Record migration steps and any compatibility shims here so future migrations are easier.
