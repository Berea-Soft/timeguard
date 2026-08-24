# Contributing to TimeGuard

Thank you for your interest in contributing to TimeGuard! We welcome contributions from the community.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/timeguard.git
   cd timeguard
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Workflow

### Running Tests

```bash
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
npm run test:ui    # Run tests with UI
```

### Building the Project

```bash
npm run build      # Build all distribution files
npm run build:all  # Same as build
```

### Code Quality

```bash
npm run lint        # Type-check only
npm run lint:fix    # Fix type errors
npm run format      # Format code with Prettier
npm run format:check # Check formatting
```

### Before Submitting

1. **Run all tests**: `npm test`
2. **Ensure build passes**: `npm run build`
3. **Format your code**: `npm run format`
4. **Type-check**: `npm run lint`

## 🎯 Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated semantic releases:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature (triggers minor version bump)
- `fix`: Bug fix (triggers patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring (no feature changes)
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Build/tooling changes
- `ci`: CI/CD changes
- `revert`: Reverting previous commits

### Examples

```
feat(locales): add Japanese locale
fix(duration): correct leap year calculation
docs: update API reference
test(timeguard): add edge case tests for diff()
chore(deps): update vite to v8
```

## 📋 Pull Request Process

1. **Update documentation** if you're changing behavior
2. **Add tests** for new features or bug fixes
3. **Ensure CI passes** before requesting review
4. **Reference issues** in your PR description
5. **Request review** from maintainers

## 🧪 Testing Guidelines

- Write tests for all new features and bug fixes
- Aim for >80% code coverage
- Test edge cases and error conditions
- Use descriptive test names: `should handle leap years correctly`

## 📚 Code Style

- **TypeScript strict mode** enabled
- **Prettier** for formatting (auto-applied via `npm run format`)
- **No `any` types** - use proper TypeScript types
- **JSDoc comments** for public APIs
- **Single responsibility** per function/class

## 🐛 Reporting Issues

When reporting bugs, include:

- **Node.js version** (`node --version`)
- **TimeGuard version**
- **Minimal reproduction** code
- **Expected vs actual** behavior
- **Error messages** and stack traces

## 💡 Feature Requests

For feature requests, please:

1. Check existing issues first
2. Describe the **use case** and **benefits**
3. Provide **examples** of the proposed API

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TimeGuard! 🎉
