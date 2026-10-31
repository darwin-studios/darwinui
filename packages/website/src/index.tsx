"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  Sun,
  Moon,
  Check,
  Copy,
  Code2,
  Layers,
  MessageSquare,
} from "lucide-react";
import {
  DarwinUIProvider,
  AgentIdentity,
  CapabilityList,
  OperationForm,
  Results,
  WorkProgress,
  ConversationMessage,
  useAction,
} from "@darwinui/react";
import {
  presentationSchema,
  actionSchema,
  validateInput,
  type ActionIntent,
} from "@darwinui/core";

const github = "https://github.com/darwin-studios/darwinui";
const presentation = presentationSchema.parse({
  version: "0.1",
  agent: {
    id: "trail-guide",
    name: "Trail Guide",
    description: "A little room for adventure.",
  },
  operations: [
    {
      id: "plan",
      name: "Plan a trip",
      description: "An itinerary for your next escape.",
      fields: [
        {
          name: "destination",
          label: "Destination",
          type: "text",
          required: true,
        },
        {
          name: "days",
          label: "Days",
          type: "number",
          minimum: 1,
          maximum: 14,
          required: true,
        },
      ],
    },
    {
      id: "pack",
      name: "Make a packing list",
      description: "Bring what matters. Leave the rest.",
      fields: [
        {
          name: "destination",
          label: "Destination",
          type: "text",
          required: true,
        },
      ],
    },
  ],
});
async function run(raw: ActionIntent) {
  const action = actionSchema.parse(raw);
  const op = presentation.operations.find((o) => o.id === action.operationId);
  if (!op) throw Error("Unknown operation");
  const errors = validateInput(op, action.input);
  if (Object.keys(errors).length) throw Error(Object.values(errors).join(". "));
  return presentationSchema.parse({
    ...presentation,
    steps: [
      { id: "ready", title: "Your sample is ready", status: "completed" },
    ],
    results: [
      {
        type: "text",
        text:
          action.operationId === "pack"
            ? `For ${action.input.destination}: walking shoes, a rain jacket, water, and a day bag.`
            : `${action.input.days} days in ${action.input.destination}. Start with a morning walk, take the scenic route, and leave an afternoon open to explore.`,
      },
    ],
  });
}
const concepts = [
  {
    name: "Agents",
    title: "Give your agent a familiar face.",
    body: "Bring identity, capabilities, and ongoing work together. Compose an entire agent page or use just the pieces you need.",
    href: "agents/overview",
    icon: Layers,
  },
  {
    name: "Threads",
    title: "Keep the work together.",
    body: "Messages, progress, approvals, and results belong in one place. Render the state your backend provides as the work unfolds.",
    href: "threads/overview",
    icon: MessageSquare,
  },
  {
    name: "Operations",
    title: "Turn intent into a clear next step.",
    body: "Describe inputs once. Render forms, validate details, and connect actions to your own backend.",
    href: "operations/overview",
    icon: Code2,
  },
];
const install = `git clone https://github.com/darwin-studios/darwinui.git
cd darwinui
pnpm install && pnpm dev`;
export function DarwinUIWebsite({
  docsBase = "/docs",
  initialTheme = "light",
}: {
  docsBase?: string;
  initialTheme?: "light" | "dark";
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [active, setActive] = useState(0);
  const [operationId, setOperationId] = useState("plan");
  const [copied, setCopied] = useState(false);
  const state = useAction(run, "website-demo");
  const operation = presentation.operations.find((o) => o.id === operationId)!;
  const concept = concepts[active];
  return (
    <DarwinUIProvider context={{ theme }} className="dui-site">
      <a className="site-skip" href="#content">
        Skip to content
      </a>
      <header className="site-nav">
        <a className="site-brand" href="#">
          DarwinUI
        </a>
        <nav aria-label="Main navigation">
          <a href="#concepts">Overview</a>
          <a href={docsBase}>Documentation</a>
          <a href={github}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <button
            className="site-icon"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>
      </header>
      <main id="content">
        <section className="site-hero">
          <h1>
            Interfaces for
            <br />
            the agentic web.
          </h1>
          <p>
            Build agents people and software can work with.
            <br className="site-desktop" /> Open-source components. Your
            backend. Your interface.
          </p>
          <div className="site-actions">
            <a className="site-primary" href={`${docsBase}/quickstart`}>
              Get started <ArrowRight size={18} />
            </a>
            <a href={github}>
              View on GitHub <ArrowRight size={18} />
            </a>
          </div>
        </section>
        <section
          className="site-demo"
          aria-label="Interactive DarwinUI example"
        >
          <aside className="site-demo-identity">
            <AgentIdentity
              headingLevel={2}
              agent={presentation.agent}
              avatar={<div className="site-orb" aria-hidden="true" />}
            />
            <div className="site-demo-note">
              <span className="site-dot" />
              Interactive example
              <p>
                Built with DarwinUI.
                <br />
                Try an operation to see a result.
              </p>
            </div>
            <a href={`${docsBase}/rendering/react`}>
              See how it’s built <ArrowRight size={16} />
            </a>
          </aside>
          <div className="site-demo-form">
            <h2>What would you like to do?</h2>
            <CapabilityList
              operations={presentation.operations}
              selectedId={operationId}
              onSelect={setOperationId}
            />
            <OperationForm
              key={operationId}
              operation={operation}
              initialValues={{ destination: "Scottish Highlands", days: 3 }}
              pending={state.pending}
              onSubmit={state.run}
            />
          </div>
          <div className="site-demo-result">
            <div className="site-demo-label">
              Your thread <MessageSquare size={16} />
            </div>
            <ConversationMessage author="Trail Guide">
              Let’s make room for a change of scenery. Where would you like to
              go?
            </ConversationMessage>
            <div aria-live="polite">
              <WorkProgress steps={state.value?.steps ?? []} />
              <Results results={state.value?.results ?? []} />
              {state.error && <p role="alert">{state.error}</p>}
            </div>
            <p className="site-demo-disclaimer">
              Local example. No bookings or charges.
            </p>
          </div>
        </section>
        <section id="concepts" className="site-concepts">
          <div className="site-tabs" role="tablist" aria-label="Core concepts">
            {concepts.map((c, i) => (
              <button
                key={c.name}
                role="tab"
                id={`tab-${i}`}
                aria-controls="concept-panel"
                aria-selected={active === i}
                onClick={() => setActive(i)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div
            className="site-concept-body"
            role="tabpanel"
            id="concept-panel"
            aria-labelledby={`tab-${active}`}
          >
            <div>
              <h2>{concept.title}</h2>
              <p>{concept.body}</p>
              <a href={`${docsBase}/${concept.href}`}>
                Explore {concept.name.toLowerCase()} <ArrowRight size={18} />
              </a>
            </div>
            <div className="site-principles">
              <article>
                <Layers size={22} />
                <div>
                  <h3>Compose with React.</h3>
                  <p>
                    Use the same components in a full page or a smaller embedded
                    view.
                  </p>
                </div>
              </article>
              <article>
                <Code2 size={22} />
                <div>
                  <h3>Keep your own runtime.</h3>
                  <p>
                    You own execution, accounts, and permissions. DarwinUI
                    presents the work.
                  </p>
                </div>
              </article>
              <article>
                <MessageSquare size={22} />
                <div>
                  <h3>Meet people where they work.</h3>
                  <p>
                    Render on the web, connect compatible MCP hosts, or expose a
                    structured agent view.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="site-start">
          <div>
            <h2>Start with your agent.</h2>
            <p>
              Explore the source. Run the examples.
              <br />
              Make the interface your own.
            </p>
          </div>
          <div className="site-code">
            <div>
              <span>Run locally</span>
              <button
                className="site-icon"
                aria-label="Copy installation commands"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(install);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <pre>
              <code>{install}</code>
            </pre>
          </div>
          <div className="site-resources">
            <a href={docsBase}>
              Documentation <ArrowRight size={16} />
            </a>
            <a href={`${docsBase}/cookbook`}>
              Cookbook <ArrowRight size={16} />
            </a>
            <a href={`${docsBase}/installation`}>
              Installation <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>
          <strong>DarwinUI</strong> An open-source agent interface framework.
        </span>
        <nav aria-label="Footer">
          <a href={github}>GitHub</a>
          <a href={`${github}/blob/main/LICENSE`}>Apache 2.0</a>
          <a href="https://darwin.so">Built by Darwin ↗</a>
        </nav>
      </footer>
    </DarwinUIProvider>
  );
}
