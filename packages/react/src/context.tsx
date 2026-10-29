'use client';

import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import type { PresentationContext } from '@darwinui/core';

const Context = createContext<PresentationContext>({ theme: 'light', locale: 'en', density: 'comfortable' });
export function DarwinUIProvider({
  children,
  context = {},
  style,
  className = '',
}: {
  children: ReactNode;
  context?: PresentationContext;
  style?: CSSProperties & Record<`--dui-${string}`, string>;
  className?: string;
}) {
  return (
    <Context.Provider value={context}>
      <div
        className={`dui ${className}`}
        data-theme={context.theme ?? 'light'}
        data-density={context.density ?? 'comfortable'}
        lang={context.locale ?? 'en'}
        style={style}
      >
        {children}
      </div>
    </Context.Provider>
  );
}
export function useDarwinUI() {
  return useContext(Context);
}
