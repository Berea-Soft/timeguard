import { defineConfig, type UserConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, readFileSync, rmSync } from 'fs';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pack = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8'),
);

const banner = `/*! timeguard v${
  pack.version
} | (c) ${new Date().getFullYear()} Berea-Soft | MIT License | https://github.com/Berea-Soft/timeguard */`;

const distTypesSrcDir = resolve(__dirname, 'dist', 'types', 'src');

const fileName = (format: string, entryName: string) =>
  format === 'cjs' ? `${entryName}.cjs` : `${entryName}.${format}.js`;

function getEntries(isUmd: boolean, buildMode: string) {
  if (isUmd) {
    return resolve(__dirname, 'src/index.ts');
  }
  const entries: Record<string, string> = {
    timeguard: resolve(__dirname, 'src/index.ts'),
    'react/index': resolve(__dirname, 'src/react.ts'),
    'vue/index': resolve(__dirname, 'src/vue.ts'),
    'svelte/index': resolve(__dirname, 'src/svelte.ts'),
    'solid/index': resolve(__dirname, 'src/solid.ts'),
    'qwik/index': resolve(__dirname, 'src/qwik.ts'),
    'locales/index': resolve(__dirname, 'src/locales/index.ts'),
    'calendars/index': resolve(__dirname, 'src/calendars/index.ts'),
    'plugins/relative-time': resolve(
      __dirname,
      'src/plugins/relative-time/index.ts',
    ),
    'plugins/duration': resolve(
      __dirname,
      'src/plugins/duration/index.ts',
    ),
    'plugins/advanced-format': resolve(
      __dirname,
      'src/plugins/advanced-format/index.ts',
    ),
  };
  // Angular uses TypeScript decorators not supported by Rolldown — built separately
  if (buildMode === 'angular') {
    entries['angular/index'] = resolve(__dirname, 'src/angular.ts');
  }
  return entries;
}

export default defineConfig(({ mode }): UserConfig => {
  const shared = {
    define: { __VERSION__: JSON.stringify(pack.version) },
  };

  const isUmd = mode === 'umd';
  const isAngular = mode === 'angular';

  return {
    ...shared,
    // Angular build uses esbuild (supports decorators) instead of Rolldown
    // Rolldown (Vite 8 default) no soporta decoradores legacy de TypeScript
    // Para Angular usamos esbuild como builder
    builder: isAngular ? 'esbuild' : undefined,
    esbuild: isAngular
      ? {
          tsconfigRaw: JSON.stringify({
            compilerOptions: {
              experimentalDecorators: true,
            },
          }),
        }
      : undefined,
    build: {
      lib: {
        entry: getEntries(isUmd, mode),
        name: 'BereasoftTimeguard',
        fileName: isUmd
          ? (format: string) =>
              format === 'cjs' ? 'timeguard.cjs' : `timeguard.${format}.js`
          : fileName,
        formats: isUmd ? ['umd', 'iife', 'es', 'cjs'] : ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['react', 'vue', '@angular/core', 'rxjs', 'svelte', 'solid-js', '@builder.io/qwik'],
        output: {
          banner,
          exports: 'named' as const,
        },
      },
      emptyOutDir: isUmd || isAngular ? false : true,
      sourcemap: false,
      minify: true,
      reportCompressedSize: true,
    },
    plugins: [
      dts({
        rollupTypes: false,
        insertTypesEntry: true,
        copyDtsFiles: true,
        entryRoot: resolve(__dirname, 'src'),
        outDir: resolve(__dirname, 'dist/types'),
        strictOutput: true,
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        beforeWriteFile: (filePath, content) => {
          const normalizedPath = filePath.replace(
            /([\\/])dist\1types\1src(?=[\\/])/,
            '$1dist$1types',
          );
          return { filePath: normalizedPath, content };
        },
        afterBuild: () => {
          if (existsSync(distTypesSrcDir)) {
            rmSync(distTypesSrcDir, { recursive: true, force: true });
          }
        },
      }),
    ],
  };
});