import { z } from 'zod';

import { agentViewSchema } from '../contracts/agent-view.js';
import { actionSchema, presentationSchema } from '../contracts/index.js';

export const presentationJsonSchema = z.toJSONSchema(presentationSchema);
export const actionJsonSchema = z.toJSONSchema(actionSchema);

export const agentViewJsonSchema = z.toJSONSchema(agentViewSchema);
