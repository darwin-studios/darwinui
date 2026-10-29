import { z } from 'zod';

const id = z.string().min(1).max(200);
export const safeUrlSchema = z.url({ protocol: /^https?$/ });
export const agentSchema = z.object({
  id,
  name: z.string().min(1),
  description: z.string().optional(),
  avatarUrl: safeUrlSchema.optional(),
});
export const fieldSchema = z
  .object({
    name: id,
    label: z.string(),
    type: z.enum(['text', 'number', 'select']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    minimum: z.number().optional(),
    maximum: z.number().optional(),
  })
  .superRefine((f, ctx) => {
    if (f.type === 'select' && !f.options?.length)
      ctx.addIssue({ code: 'custom', message: 'Select fields require options' });
  });
export const operationSchema = z.object({
  id,
  name: z.string(),
  description: z.string().optional(),
  fields: z.array(fieldSchema).default([]),
});
export const actionSchema = z.object({
  id,
  operationId: id,
  input: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
});
export const stepSchema = z.object({
  id,
  title: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
});
export const resultSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({ type: z.literal('fields'), fields: z.record(z.string(), z.string()) }),
  z.object({ type: z.literal('file'), name: z.string(), url: safeUrlSchema }),
  z.object({ type: z.literal('image'), name: z.string(), url: safeUrlSchema }),
  z.object({ type: z.literal('video'), name: z.string(), url: safeUrlSchema }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);
export const approvalSchema = z.object({
  id,
  title: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  details: z.record(z.string(), z.string()).optional(),
});
export const presentationSchema = z.object({
  version: z.literal('0.1'),
  agent: agentSchema,
  operations: z.array(operationSchema).default([]),
  steps: z.array(stepSchema).default([]),
  results: z.array(resultSchema).default([]),
  approval: approvalSchema.optional(),
});
export type Agent = z.infer<typeof agentSchema>;
export type Field = z.infer<typeof fieldSchema>;
export type Operation = z.infer<typeof operationSchema>;
export type ActionIntent = z.infer<typeof actionSchema>;
export type WorkStep = z.infer<typeof stepSchema>;
export type Result = z.infer<typeof resultSchema>;
export type Approval = z.infer<typeof approvalSchema>;
export type Presentation = z.infer<typeof presentationSchema>;
export type ActionDispatcher = (action: ActionIntent) => Promise<Presentation>;
export function validateInput(operation: Operation, input: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of operation.fields) {
    const value = input[f.name];
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      if (f.required) errors[f.name] = `${f.label} is required`;
      continue;
    }
    if (
      f.type === 'number' &&
      (typeof value !== 'number' ||
        !Number.isFinite(value) ||
        (f.minimum !== undefined && value < f.minimum) ||
        (f.maximum !== undefined && value > f.maximum))
    )
      errors[f.name] = `${f.label} is outside the allowed range`;
    if (f.type === 'select' && !f.options?.includes(String(value)))
      errors[f.name] = `Choose a valid ${f.label.toLowerCase()}`;
    if (f.type === 'text' && typeof value !== 'string') errors[f.name] = `${f.label} must be text`;
  }
  return errors;
}

export const threadSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  status: z.enum(['idle', 'running', 'waiting', 'completed', 'failed']),
  messages: z.array(z.object({ id: z.string().min(1), author: z.string(), text: z.string() })).default([]),
});
export type Thread = z.infer<typeof threadSchema>;
