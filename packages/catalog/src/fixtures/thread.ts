/** Fictional runtime composition: a backend can replace this function with model generation using the exported catalog. */
export function composeDemoThread(profile: { name: string; location: string }, completed: boolean): string {
  const greeting =
    profile.name === 'Default'
      ? 'Where would you like to go?'
      : `Hello ${profile.name}. Plan an escape from ${profile.location}.`;
  return completed
    ? 'root = Thread([Message("Trail Guide", "Your plan is ready. Here is the recorded result."), Progress(), Output(), OperationInput("packing-list")])'
    : `root = Thread([Message("Trail Guide", ${JSON.stringify(greeting)}), OperationInput("plan-trip"), Progress()])`;
}
