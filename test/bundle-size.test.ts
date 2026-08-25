import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { gzipSync } from 'zlib';
import { execFileSync, execSync } from 'child_process';

describe('Bundle Size Report', () => {
  it('should produce a clean build with no shared chunks', () => {
    const root = join(__dirname, '..');
    const distDir = join(root, 'dist');

    // Clean dist/ completely before rebuilding
    rmSync(distDir, { recursive: true, force: true });

    // Run current build steps (angular is built separately with esbuild)
    execSync('npx vite build', { cwd: root, stdio: 'pipe', timeout: 60000 });
    execSync('npx vite build --mode umd', {
      cwd: root,
      stdio: 'pipe',
      timeout: 60000,
    });

    const allDistFiles = readdirSync(distDir, { recursive: true })
      .map((f) => f.toString().replace(/\\/g, '/'))
      .filter((f) => !f.startsWith('types'));

    // ── No shared chunks or stale artifacts ──
    // Allow: locales-xxxx.js, locale.manager-xxxx.js (shared i18n chunks)
    // and core-xxxx.js (Vite shared chunks). Now that core.ts no longer
    // re-exports the full locales/calendars/plugins barrels (see core.ts),
    // Rolldown splits locale.manager.ts into its own shared chunk since
    // it's imported both by core.ts and by the /locales subpath.
    const unwanted = allDistFiles.filter(
      (f) =>
        f.includes('locales.esm') ||
        f.includes('locales2') ||
        f.includes('_internal') ||
        // Bare .js at root level that isn't timeguard.* or core-xxxx or locales-xxxx
        (/^(?!timeguard\.).*\.js$/.test(f.split('/').pop() || '') &&
          !f.includes('.es.') &&
          !f.includes('.umd.') &&
          !f.includes('.iife.') &&
          !f.includes('/') &&
          !/locales-[A-Za-z0-9_-]+\.(js|cjs)$/.test(f) &&
          !/^locale\.manager-[A-Za-z0-9_-]+\.(js|cjs)$/.test(
            f.split('/').pop() || '',
          ) &&
          !/^core-[A-Za-z0-9_-]+\.js$/.test(f.split('/').pop() || '')),
    );
    expect(
      unwanted,
      `Unexpected files in dist: ${unwanted.join(', ')}`,
    ).toEqual([]);

    // ── All expected files are present ──
    // Angular se build aparte (vite build --mode angular), no en el build normal
    // No `/native` entry here: the whole package IS the native, zero-polyfill
    // edition — see sibling package `@bereasoftware/timeguard` for the
    // auto-polyfilled default entry + its own `/native` subpath.
    const expected = [
      'timeguard.es.js',
      'timeguard.cjs',
      'timeguard.umd.js',
      'timeguard.iife.js',
      'react/index.es.js',
      'react/index.cjs',
      'vue/index.es.js',
      'vue/index.cjs',
      'svelte/index.es.js',
      'svelte/index.cjs',
      'solid/index.es.js',
      'solid/index.cjs',
      'qwik/index.es.js',
      'qwik/index.cjs',
      'locales/index.es.js',
      'locales/index.cjs',
      'calendars/index.es.js',
      'calendars/index.cjs',
      'plugins/relative-time.es.js',
      'plugins/relative-time.cjs',
      'plugins/duration.es.js',
      'plugins/duration.cjs',
      'plugins/advanced-format.es.js',
      'plugins/advanced-format.cjs',
    ];
    for (const file of expected) {
      expect(allDistFiles, `Missing expected file: ${file}`).toContain(file);
    }

    // ── Runtime behavior check: zero baked-in polyfill ──
    // This package must never bundle @js-temporal/polyfill — it only ever
    // reads globalThis.Temporal. Prove it by importing the built bundle in
    // a clean `node` subprocess (vitest's own globalThis is already
    // polluted with Temporal by test/setup.ts, so it can't be used here)
    // and confirming it fails fast with no pre-existing Temporal instead of
    // silently working (which would mean a polyfill got bundled in).
    //
    // This suite may itself be running on Node >=26, where the spawned
    // subprocess would otherwise have genuine native Temporal too — `delete
    // globalThis.Temporal` right before calling TimeGuard.now() forces the
    // "no Temporal" scenario deterministically regardless of host Node
    // version. Import statements are hoisted and evaluate before any other
    // top-level code, so placing the delete after the `import` line still
    // runs it before TimeGuard.now() is ever called.
    const mainEntryUrl = pathToFileURL(join(distDir, 'timeguard.es.js')).href;
    const mainStdout = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { TimeGuard } from ${JSON.stringify(mainEntryUrl)};` +
          `delete globalThis.Temporal;` +
          `try { TimeGuard.now(); console.log('unexpected-success'); }` +
          `catch (err) { console.log(err instanceof Error ? err.message : 'unknown-error'); }`,
      ],
      { encoding: 'utf-8' },
    ).trim();
    expect(
      mainStdout,
      'Package must not bundle the polyfill: it should fail fast with no pre-existing globalThis.Temporal',
    ).toContain('Temporal API not found on globalThis');

    // ── Size sanity check (zero-polyfill: should stay lightweight) ──
    // core.ts no longer re-exports the full locales/calendars/plugins
    // barrels (see core.ts), so `import { TimeGuard } from 'timeguard'`
    // now only pulls in this stub plus whichever shared chunks it actually
    // imports (currently just core-*.js + locale.manager-*.js — no
    // locales/calendars/plugins). Sum those instead of just the stub file,
    // so this assertion reflects the real minimum weight of using
    // TimeGuard at all, not just the glue code around it.
    const mainFile = readFileSync(join(distDir, 'timeguard.es.js'), 'utf-8');
    const importedChunks = [...mainFile.matchAll(/from ["']\.\/([^"']+)["']/g)]
      .map((m) => m[1])
      .filter((f) => f.endsWith('.js'));
    const totalGzip =
      gzipSync(Buffer.from(mainFile)).length +
      importedChunks.reduce(
        (sum, f) => sum + gzipSync(readFileSync(join(distDir, f))).length,
        0,
      );
    // Measured at ~11KB (stub + core + locale.manager, EN/ES included).
    // 15KB leaves headroom without masking a real regression — e.g. a
    // locales/calendars/plugins re-export leaking back into core.ts would
    // jump this well past 20KB.
    expect(totalGzip).toBeLessThan(15 * 1024);
  }, 180000);

  it('should build Angular separately with esbuild', () => {
    const root = join(__dirname, '..');
    const distDir = join(root, 'dist');

    // Build angular separately with esbuild mode
    execSync('npx vite build --mode angular', {
      cwd: root,
      stdio: 'pipe',
      timeout: 60000,
    });

    const allDistFiles = readdirSync(distDir, { recursive: true })
      .map((f) => f.toString().replace(/\\/g, '/'))
      .filter((f) => !f.startsWith('types'));

    expect(allDistFiles).toContain('angular/index.es.js');
    expect(allDistFiles).toContain('angular/index.cjs');
  }, 60000);
});
