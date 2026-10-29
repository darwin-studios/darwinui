'use client';

import { useEffect, useRef, useState } from 'react';
import { presentationSchema, type ActionDispatcher, type ActionIntent, type Presentation } from '@darwinui/core';

/** No automatic retries. Late responses from a previous scope are discarded. */
export function useAction(dispatch: ActionDispatcher, scope: string) {
  const [state, setState] = useState<{ pending: boolean; value?: Presentation; error?: string }>({ pending: false });
  const generation = useRef(0);
  const pending = useRef(false);
  useEffect(() => {
    generation.current++;
    pending.current = false;
    setState({ pending: false });
    return () => {
      generation.current++;
    };
  }, [scope]);
  async function run(action: ActionIntent) {
    if (pending.current) return;
    pending.current = true;
    const current = generation.current;
    setState((s) => ({ ...s, pending: true, error: undefined }));
    try {
      const value = presentationSchema.parse(await dispatch(action));
      if (current === generation.current) setState({ pending: false, value });
    } catch (error) {
      if (current === generation.current)
        setState((s) => ({
          ...s,
          pending: false,
          error: error instanceof Error ? error.message : 'The action failed',
        }));
    } finally {
      if (current === generation.current) pending.current = false;
    }
  }
  return { ...state, run };
}
