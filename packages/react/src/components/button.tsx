'use client';

import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';

export function Button({ asChild, className = '', ...props }: ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp type='button' className={`dui-button ${className}`} {...props} />;
}
