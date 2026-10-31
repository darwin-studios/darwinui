# DarwinUI website

The informational website at https://darwinui.com uses the framework's real React components. Its interactive travel example runs locally; it does not contact a provider or make bookings.

From the repository root:

```sh
pnpm install
pnpm dev:web
```

Open http://localhost:3012. Edit `packages/website/src/index.tsx` and `styles.css`; Vite updates the page immediately. The catalog's Website preview renders this same component. Navigator's local design library embeds port 3012 and offers a Published source option.

```sh
pnpm --filter @darwinui/web... build
pnpm check-types
pnpm test
```

Vercel builds from the repository root using `vercel.json`. The homepage is prerendered for immediate content and then hydrated for interaction. `/docs` and its subpaths proxy the repo-backed Mintlify project. Documentation source lives in `docs/`; update it there rather than in the dashboard.
