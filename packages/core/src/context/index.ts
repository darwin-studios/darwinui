export interface PresentationContext {
  theme?: 'light' | 'dark';
  locale?: string;
  density?: 'comfortable' | 'compact';
  user?: { id: string; displayName?: string };
  host?: { name?: string; canCallTools?: boolean };
}
