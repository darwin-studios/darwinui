# Architecture

DarwinUI is a TypeScript and React interface framework. It is not a programming language, operating system, agent runtime, or replacement for MCP.

The portable vocabulary is **agents → operations → threads → results**. Identity, capability forms, progress, approvals, and result views are reusable building blocks. Applications own their navigation, discovery, accounts, persistence, and execution.

## Dependency direction

`core → react → applications and catalog`. The MCP package adapts the official MCP Apps bridge and bundles an iframe. Core never imports React. React never imports a product router or backend. The catalog contains fictional data only.

## Two rendering paths

1. A creator supplies a compatible MCP App: the host renders its sandboxed resource and mediates actions.
2. The creator supplies only capabilities: an application adapter maps supported, declared fields into DarwinUI view models and composes a standard interface.

`chooseInterface` makes this choice explicit. It does not fetch or execute remote code. Hosts validate the resource, sandbox it, and enforce permissions. Unsupported schemas or missing capabilities must be reported; they must not be guessed. An agent advertising A2A is not automatically a visual app.

Navigator is one host. Its ranking, routing, account history, and private adapters remain outside this repository. Existing agents can be adapted without pretending that their creators authored a DarwinUI interface. This preview supplies the selection contract; automatic protocol-to-form adapters require separate compatibility tests before activation.

## Actions and authority

Components emit action intents. Web callbacks and MCP tools invoke the same backend operation. The backend owns validation, authorization, pricing, approval, and completion. UI approval state is not authority. Hooks never automatically retry an action. Production services must provide their own idempotency handling; an intent ID alone is not an idempotency guarantee.

## Personalization

The caller supplies scoped data and context. The framework does not collect profiles. Examples use fictional Joanne and Alex fixtures. Responses from an old user scope are discarded. Applications must also enforce account isolation on the server.

## Source and preview

The monorepo distribution is canonical. Both the public playground and Navigator `/ui` import the catalog. Navigator imports reusable layouts directly. Editing source updates local consumers through their normal dev server; preview controls only edit local example state. Released applications and installed packages update through normal reviewed builds and releases.

The public repo accepts contributions. Import public changes into canonical source with contributor attribution, test Navigator, then export. Never overwrite a divergent public repository. Record source revision and content digest with the release.

## Human and agent consumers

The same semantic interaction can be rendered visually or for an agent caller. Delivery (Web, MCP, API) is independent of perspective (human, agent). See [human and agent interfaces](human-and-agent.md).
