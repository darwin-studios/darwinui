# Developer-preview validation

Local validation on 2026-10-29:

- Standalone package builds, type checks, schema/action tests, and scoped-user response tests.
- Packed packages install and build in isolated Vite and Next.js consumers; React identity checked.
- Real stdio MCP initialization, resource read, action result, and invalid-input round trip.
- Official MCP Apps `examples/basic-host`, repository revision `cf599cc462406accc90ec3ca7879e3a22a9fc2a8`, SDK 2.0.4: interface initialization, a real `trail_action` result, host dark-mode propagation, and content-dependent iframe resizing were observed.
- No commercial host compatibility is claimed.

Open release gates:

- The reference host uses nested sandbox iframes. Browser automation filled input but could not deliver the in-frame submit click. The bridge dispatch unit test and actual server round trip pass separately; the full in-frame gesture-to-result path is not marked passed.
- CI desktop/mobile accessibility and interaction checks must pass on the exported source.
- npm namespace ownership and publication credentials must be verified. No npm package has been published.

This file is deliberately not `release-host-verification.md`. The release workflow requires a completed host-verification record before publishing a tag.
