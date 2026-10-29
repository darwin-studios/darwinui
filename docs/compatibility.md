# Compatibility

| Target | Implementation | Verification |
| --- | --- | --- |
| React 19 web apps | Shared React components and callback actions | Local unit/build tests; see CI |
| MCP Apps | Official SDK 2.0.4, standalone iframe and explicit tool dispatch | Official reference-host initialization, rendering, tool-result delivery, theme and resize checked; see validation record |
| Navigator | Shared identity, overview, task layout, and catalog | Integration under development |
| A2A | No rendering adapter | Not supported |
| A2UI / AG-UI | No adapter | Not supported |
| Native mobile | No native renderer | Not supported |

MCP host capability negotiation controls tool access. A host without `serverTools` receives a controlled unsupported-action error. Creator-provided interfaces may differ from fallback interfaces. Never equate transport support with visual support.

The example is fictional and does not book travel. Production Darwin `show_ui` remains read-only. Do not use the example's interactive tool registration to expand that production tool's authority.

Before tagging 0.1, record a named external compliant host, host version, SDK version, initialization, tool delivery, action response, resizing, theme change, error, and unsupported-capability results. A local mock bridge is not external-host verification.
