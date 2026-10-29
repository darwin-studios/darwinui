# Human and agent interfaces

DarwinUI has two representations of the same interaction:

- **Human:** React components for identity, operation inputs, progress, approvals, threads, and results.
- **Agent:** a validated semantic view with the same data, available action bindings, required inputs, and blockers. It renders without React or a browser.

The caller and delivery channel are independent. A web application can contain an agent orchestrator. An MCP client can either act on structured output or offer a visual interface to a human. An API request does not imply an autonomous caller, and showing an interface never grants authority.

```ts
import { presentationForAgent, renderAgentView } from '@darwinui/core';

const agentView = presentationForAgent(presentation, thread);
const modelInput = renderAgentView(agentView);
```

Use the same `presentation` for the React components. The agent view retains input constraints, recorded status, approval state, text, structured fields, and media references. Decorative layout, colors, and spacers do not need invented agent capabilities.

A catalog operation alone does not authorize a call. `presentationForAgent` reports the declared operation but leaves execution unavailable until the embedding application's adapter supplies a currently authorized binding. `createAgentView` accepts those adapter-provided semantic components. The backend must still revalidate any attempted action, including approvals and prices. Neither renderer executes actions automatically.

Use JSON for lossless structured inspection. Applications may supply a `text` representation alongside component data and request `renderAgentView(view, 'text')` for model-readable evidence. Text is a presentation of evidence, never a replacement for the authoritative operation record.

## Orchestrators and direct use

An orchestrator uses the agent-facing interface and the application's existing operation dispatcher. A person opening the same thread sees its human-facing representation. Both refer to the same operations and results; neither should screen-scrape the other interface.

For example, Navigator execution calls Act and reads recorded agent responses through the DarwinUI agent renderer. Direct Act card responses expose a semantic `agentView` alongside the existing cards and Markdown. MCP can return that structured information without opening an iframe; `show_ui` remains a separate, read-only visual choice.

A provider need not adopt DarwinUI for an application to adapt its declared capabilities and recorded results. Such a view is a host-provided fallback, not a claim that the provider supplies a DarwinUI interface. Do not invent missing input schemas, execution permissions, or media contents.

## Personalization and runtime composition

Both representations receive the same caller-scoped data. The framework does not fetch profiles or grant access. A generative thread can change its composition at runtime, while its agent view continues to expose recorded state and capabilities. Generated visual text cannot create backend facts or permissions.

The catalog's Human/Agent switch preserves completed example results. Changing the example user discards previous user state. A future production adapter must apply the same isolation on its server.
