//Util
const Now = Date.now || function () { return new Date().getTime() }

export interface ITimeModule {
  now: typeof now
}

export function now(): number {
  return Now()
}
