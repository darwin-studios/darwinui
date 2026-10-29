import { z } from 'zod';

import { presentationSchema, threadSchema, type Presentation, type Thread } from './index.js';

/** Semantic output for an agent caller. Transport and caller identity are independent. */
export const agentComponentSchema = z.object({
  id: z.string().min(1),
  kind: z.string().min(1),
  title: z.string(),
  data: z.json(),
  text: z.string().optional(),
  actions: z
    .array(
      z.object({
        label: z.string(),
        available: z.boolean(),
        requiredInputs: z.array(z.string()),
        approval: z.string(),
        binding: z.object({ name: z.string(), arguments: z.record(z.string(), z.json()) }).optional(),
        reason: z.string().optional(),
      }),
    )
    .default([]),
});
export const agentViewSchema = z.object({
  version: z.literal('darwinui-agent-v1'),
  components: z.array(agentComponentSchema),
  incomplete: z.array(z.string()).default([]),
});
export type AgentComponent = z.infer<typeof agentComponentSchema>;
export type AgentView = z.infer<typeof agentViewSchema>;

/** No HTML, React props, hidden UI state, or inferred permission enters this view. */
export function createAgentView(components: AgentComponent[], incomplete: string[] = []): AgentView {
  return agentViewSchema.parse({ version: 'darwinui-agent-v1', components, incomplete });
}
export function renderAgentView(view: AgentView, format: 'json' | 'text' = 'json'): string {
  const parsed = agentViewSchema.parse(view);
  if (format === 'text')
    return [...parsed.components.map((c) => c.text ?? JSON.stringify(c.data)), ...parsed.incomplete].join('\n');
  // JSON is the lossless agent representation; visual summaries never replace evidence.
  return JSON.stringify(parsed, null, 2);
}

/** The same view models used by human components, projected without a browser. */
export function presentationForAgent(raw: Presentation, thread?: Thread): AgentView {
  const p = presentationSchema.parse(raw);
  const components: AgentComponent[] = [
    { id: p.agent.id, kind: 'identity', title: p.agent.name, data: p.agent, actions: [] },
  ];
  for (const op of p.operations)
    components.push({
      id: op.id,
      kind: 'operation',
      title: op.name,
      data: op,
      // Presence in a catalog describes a capability, not permission to execute it.
      actions: [
        {
          label: op.name,
          available: false,
          requiredInputs: op.fields.filter((f) => f.required).map((f) => f.name),
          approval: 'backend',
          reason: 'The embedding application must supply an authorized action binding.',
        },
      ],
    });
  if (thread) {
    const t = threadSchema.parse(thread);
    components.push({ id: t.id, kind: 'thread', title: t.title, data: t, actions: [] });
  }
  for (const step of p.steps)
    components.push({ id: step.id, kind: 'progress', title: step.title, data: step, actions: [] });
  if (p.approval)
    components.push({ id: p.approval.id, kind: 'approval', title: p.approval.title, data: p.approval, actions: [] });
  p.results.forEach((result, index) =>
    components.push({
      id: `result-${index}`,
      kind: `result.${result.type}`,
      title: 'Result',
      data: result,
      actions: [],
    }),
  );
  return createAgentView(components);
}
