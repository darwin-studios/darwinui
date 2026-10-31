# Release readiness — 2026-10-30

## Verified locally

- npm returns 404 for @darwinui/core and @darwinui/react.
- Public repository source install, build, type checks, 15 unit tests, and packed Vite/Next consumer checks pass. Build emits existing sourcemap and use-client warnings.
- Mintlify 4.2.1184 validates all 22 new pages; internal link checks pass.
- Python cookbook output passes the real presentationSchema parser.

## Release sequence

1. Reconcile the public package with reviewed monorepo changes, especially shared session presentation; do not wholesale copy private host code.
2. Test member/owner authorization, reconnect, revocation, and concurrent requests in the host backend. UI fixtures do not implement these.
3. Complete the named external MCP host verification required by the release workflow.
4. Publish versioned npm packages using the existing release workflow and npm credentials; verify clean registry installation.
5. Update installation docs only after registry packages are available.
6. Connect the separate Mintlify darwinui project to darwin-studios/darwinui, branch main, directory docs.
7. Configure darwinui.com with /docs base path. Obtain actual DNS records and verify TLS and route loading. If another app owns the root domain, use its reverse proxy rather than replacing root DNS.

No PyPI package is necessary for the current React renderer. Python integrations can use the JSON contract; add a Python SDK only if there is reusable transport/validation behavior to maintain.
