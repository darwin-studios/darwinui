/** Host selection is explicit. A transport advertising tools is not proof it can render UI. */
export type InterfaceOffer = { kind: 'mcp-app'; resourceUri: string };
export type RenderChoice =
  | { kind: 'creator'; resourceUri: string }
  | { kind: 'standard'; reason: string }
  | { kind: 'unavailable'; reason: string };
export function chooseInterface(options: {
  offer?: InterfaceOffer;
  supportsMcpApps: boolean;
  hasPresentation: boolean;
}): RenderChoice {
  if (options.offer?.kind === 'mcp-app' && options.supportsMcpApps && options.offer.resourceUri.startsWith('ui://'))
    return { kind: 'creator', resourceUri: options.offer.resourceUri };
  if (options.hasPresentation)
    return {
      kind: 'standard',
      reason: options.offer
        ? 'The host cannot render the offered interface. Showing declared capabilities.'
        : 'The agent did not provide an interface. Showing declared capabilities.',
    };
  return { kind: 'unavailable', reason: 'No compatible interface or supported capability description is available.' };
}
