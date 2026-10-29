# Generative threads

A thread is a continuing interaction. Its interface can change at runtime as the agent requests inputs, waits for approval, reports progress, and returns results. Personalization belongs to the caller's scoped context and available data.

DarwinUI supplies React components. An optional composition adapter decides how runtime output selects those components. The OpenUI example uses the existing OpenUI parser and a bounded catalog; it introduces no Darwin language. Importing `@darwinui/react` does not install OpenUI.

## Runtime flow

1. The backend receives a task and authorized user context.
2. It produces a composition using the host's declared catalog and records authoritative operation state separately.
3. The host validates the composition and binds operation IDs to its approved dispatcher.
4. User input invokes the actual backend operation. Progress and results update the thread, and the next composition can change.

The example starts with a personalized message and a trip form. After execution it renders recorded results and a packing-list form. Its generator is deterministic fictional code, not a claim of an LLM integration. Replace it with your model or application logic while retaining validation and capability bindings.

Generated text is never executable JavaScript. Generated UI cannot add permissions, approve itself, fabricate recorded results, or bind undeclared tools. Unknown operations show an unavailable state. Unsupported composition falls back to structured capabilities. Production streaming should commit validated revisions, preserve stable IDs and active form input, and discard stale user-scope updates. Do not render incomplete or unvalidated source as an authoritative final state.

Navigator discovery and Create remain application features. Navigator can host creator interfaces or use a standard DarwinUI fallback for declared capabilities. This does not turn every indexed agent into a creator-authored DarwinUI app.
