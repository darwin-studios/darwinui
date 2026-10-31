# DarwinUI

**Rich, interactive interfaces for agents—in your application and compatible agent clients.**

TypeScript + React. Your backend. Your branding. No Darwin account, API key, or telemetry.

> Developer preview. The 0.1 release gates are still being validated. Package names are reserved intentions, not a claim of npm availability.

## Try it

```sh
corepack enable
pnpm install
pnpm build
pnpm dev
```

Open the Vite URL. Choose **Joanne** or **Alex**, select a capability, enter a destination, and run the fictional trip planner. The same operation powers the MCP example. Nothing is booked or charged.

## Add an agent interface to my app

Once packages are published:

```sh
pnpm add @darwinui/core @darwinui/react react react-dom
```

```tsx
import { DarwinUIProvider, AgentIdentity } from '@darwinui/react';
import '@darwinui/react/styles.css';

export function MyAgent() {
  return (
    <DarwinUIProvider context={{ theme: 'light', locale: 'en' }}>
      <AgentIdentity agent={{ id: 'guide', name: 'Trail Guide' }} />
    </DarwinUIProvider>
  );
}
```

Use `CapabilityList`, `OperationForm`, `WorkProgress`, `ApprovalCard`, and `Results` to compose the interaction. Pass callbacks to your own backend. No Tailwind configuration required. See [`examples/react-agent`](examples/react-agent).

## Add an interface to my MCP server

```sh
pnpm --filter @darwinui/example-mcp build
pnpm --filter @darwinui/example-mcp start
```

The server uses stdio. Configure a compatible MCP Apps host to run the second command from this checkout. Call `trail_guide` to open the interface; `trail_action` handles its actions. See [`examples/mcp-agent/server.ts`](examples/mcp-agent/server.ts).

Import browser helpers from `@darwinui/mcp/client`, registration from `/server`, and the self-contained HTML builder from `/build`. Server code is never imported by the client entrypoint.

## Packages

| Package | Responsibility |
| --- | --- |
| `@darwinui/core` | Validated presentation models, JSON Schemas, action intents, host selection |
| `@darwinui/react` | Agent, operation, thread, approval, and result presentation |
| `@darwinui/mcp` | Official MCP Apps bridge and bundling |
| Catalog (private) | Shared documentation, fixtures, and interactive examples |

Creators author React. Agent backends can use any language. Human interfaces and agent callers invoke the same business operations. DarwinUI does not invent a language or execute arbitrary agent-supplied React code.

Threads can also change their composition at runtime using the optional OpenUI example. Read [generative threads](docs/generative-threads.md) for the data, personalization, and action boundaries.

Read [human and agent interfaces](docs/human-and-agent.md), [architecture](docs/architecture.md), [compatibility](docs/compatibility.md), [contribution workflow](CONTRIBUTING.md), and [asset licensing](docs/assets.md).

## Documentation and cookbook

The Mintlify source lives in [docs](docs/index.mdx), organized around Agents, Threads, and Operations. Start with the [quickstart](docs/quickstart.mdx) or [cookbook](cookbook/README.md). Preview the site from `docs` with `npx mint@4.2.1184 dev`.
