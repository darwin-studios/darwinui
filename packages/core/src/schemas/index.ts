import { z } from 'zod';

import { actionSchema, presentationSchema } from '../contracts/index.js';

export const presentationJsonSchema = z.toJSONSchema(presentationSchema);
export const actionJsonSchema = z.toJSONSchema(actionSchema);
