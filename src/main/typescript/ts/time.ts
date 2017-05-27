// Util
export interface TimeModule {
  now: typeof now
}

/**
 * Return the current timestamp
 *
 * @return the current timestamp
 */
export function now (): number {
  return Date.now ? Date.now() : new Date().getTime()
}
