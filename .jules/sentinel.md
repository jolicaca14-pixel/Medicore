# Sentinel's Journal - Critical Security Learnings

This journal is for documenting CRITICAL, codebase-specific security vulnerabilities, learnings, and prevention strategies as outlined in Sentinel's core directives.

---
## 2024-07-25 - Stored XSS in UserForm.tsx

**Vulnerability:** Stored Cross-Site Scripting (XSS) in `UserForm.tsx`. User-provided input in fields like `firstName`, `lastName`, and `username` was not being sanitized before being saved to the application's state.

**Learning:** An attacker could inject malicious scripts (e.g., `<script>alert('XSS')</script>`) into user data. When this data was rendered on other pages, such as the admin user list, the scripts would execute in the context of the user's browser, potentially leading to session hijacking, data theft, or phishing attacks. The root cause was the lack of an input sanitization mechanism for user-controlled data.

**Prevention:** All user-provided input that will be rendered in the UI must be sanitized. For this fix, a basic sanitization function was introduced to strip HTML tags. For future development, a more robust library like DOMPurify should be implemented and applied consistently across all user input fields to provide comprehensive XSS protection.
