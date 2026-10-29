import { writeFile } from 'node:fs/promises';

import { agentViewJsonSchema, actionJsonSchema, presentationJsonSchema } from '../packages/core/dist/index.js';

for (const [name, schema] of Object.entries({ action: actionJsonSchema, presentation: presentationJsonSchema, 'agent-view': agentViewJsonSchema }))
  await writeFile(
    new URL(`../packages/core/dist/schemas/${name}.schema.json`, import.meta.url),
    JSON.stringify(schema, null, 2) + '\n',
  );
