# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.2.x   | :white_check_mark: |
| < 2.2   | :x:                |

## Reporting a Vulnerability

We take the security of TimeGuard seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** create a public GitHub issue

Publicly disclosing a vulnerability before it's fixed can put users at risk.

### 2. Email us directly

Send details to: **security@bereasoft.com**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### 3. What to expect

- **Acknowledgment**: We'll confirm receipt within 48 hours
- **Assessment**: We'll investigate and determine the severity
- **Fix timeline**: Critical vulnerabilities are typically addressed within 7 days
- **Disclosure**: We'll coordinate with you on responsible disclosure timing

## Security Best Practices for Users

When using TimeGuard:

1. **Keep updated**: Always use the latest version
2. **Validate input**: Sanitize user-provided date/time strings before passing to TimeGuard
3. **Use strict mode**: Enable `strict: true` in configuration for additional validation
4. **Monitor dependencies**: We regularly audit our dependencies for vulnerabilities

## Security Features

- ✅ No use of `eval()` or `Function()`
- ✅ No external network requests
- ✅ Input validation in strict mode
- ✅ Immutable objects prevent accidental mutation
- ✅ Type-safe API catches errors at compile time

## Past Security Advisories

For a list of past security advisories, see our [GitHub Security Advisories](https://github.com/Berea-Soft/timeguard/security/advisories).

---

Thank you for helping keep TimeGuard secure! 🙏
