/**
 * @file lint-staged configuration
 * @see https://github.com/lint-staged/lint-staged
 *
 * Uses function syntax to handle docs-app files with proper `cwd`,
 * since lint-staged v15 removed the object `{ command, cwd }` format.
 *
 * Handles Windows absolute paths with spaces (e.g., D:/Users/.../Dev Frameworks/...)
 * by quoting filenames and changing directory to docs-app/ for ESLint.
 */

const projectRoot = process.cwd().replace(/\\/g, '/');

/**
 * Strip the project root prefix and the 'docs-app/' prefix from absolute paths,
 * so ESLint receives paths relative to the docs-app/ directory.
 */
function getRelativeDocsAppPaths(filenames) {
  return filenames.map((f) => {
    const norm = f.replace(/\\/g, '/');
    // Remove project root prefix (handles Windows absolute paths)
    const rel = norm.startsWith(projectRoot + '/')
      ? norm.slice(projectRoot.length + 1)
      : norm;
    return rel.replace(/^docs-app\//, '');
  });
}

export default {
  'src/**/*.ts': [
    'prettier --write',
    'eslint --fix --max-warnings=0',
  ],
  'test/**/*.ts': 'prettier --write',
  'docs-app/src/**/*.{ts,js,vue,css,json}': [
    'prettier --write',
    (filenames) => {
      const relative = getRelativeDocsAppPaths(filenames);
      // Quote each path to handle spaces in directory names (common on Windows)
      const quoted = relative.map((f) => `"${f}"`).join(' ');
      // Use pnpm exec to run eslint from within docs-app/ WITHOUT requiring a shell
      // pnpm --prefix changes the working directory, then `exec` finds eslint in docs-app/
      return `pnpm --prefix docs-app exec eslint --fix --max-warnings=0 --no-warn-ignored ${quoted}`;
    },
  ],
  'docs-app/*.{json,js}': 'prettier --write',
};
