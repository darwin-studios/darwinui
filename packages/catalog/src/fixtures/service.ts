import { actionSchema, presentationSchema, validateInput, type ActionIntent, type Presentation } from '@darwinui/core';

export const profiles = [
  { id: 'default', name: 'Default', location: '', destination: '' },
  { id: 'joanne', name: 'Joanne', location: 'Arkansas', destination: 'Ozark Mountains' },
  { id: 'alex', name: 'Alex', location: 'London', destination: 'Scottish Highlands' },
] as const;
export const initialPresentation: Presentation = presentationSchema.parse({
  version: '0.1',
  agent: { id: 'trail-guide', name: 'Trail Guide', description: 'Plan a short escape with a fictional travel agent.' },
  operations: [
    {
      id: 'plan-trip',
      name: 'Plan a trip',
      description: 'Create a sample itinerary. No bookings or charges.',
      fields: [
        { name: 'destination', label: 'Destination', type: 'text', required: true },
        { name: 'days', label: 'Days', type: 'number', required: true, minimum: 1, maximum: 14 },
      ],
    },
    {
      id: 'packing-list',
      name: 'Make a packing list',
      description: 'Prepare for your next adventure.',
      fields: [{ name: 'destination', label: 'Destination', type: 'text', required: true }],
    },
  ],
});
/** Same deterministic fictional business operation for web and MCP. No external services. */
export async function executeDemo(raw: ActionIntent): Promise<Presentation> {
  const action = actionSchema.parse(raw);
  const op = initialPresentation.operations.find((o) => o.id === action.operationId);
  if (!op) throw new Error('Unknown operation');
  const errors = validateInput(op, action.input);
  if (Object.keys(errors).length) throw new Error(Object.values(errors).join('. '));
  const destination = String(action.input.destination).trim();
  if (!destination) throw new Error('Destination is required');
  return presentationSchema.parse({
    ...initialPresentation,
    steps: [{ id: 'plan', title: 'Prepare your plan', status: 'completed' }],
    results: [
      {
        type: 'text',
        text:
          action.operationId === 'packing-list'
            ? `For ${destination}: pack walking shoes, a rain jacket, water, and a reusable day bag.`
            : `Your ${action.input.days}-day trip to ${destination}: explore local trails, leave time for a relaxed lunch, and end the day with a scenic walk.`,
      },
      { type: 'fields', fields: { Destination: destination, Status: 'Sample only — nothing booked' } },
    ],
  });
}
