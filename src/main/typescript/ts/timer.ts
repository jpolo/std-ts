//Util
const __global: Window = typeof window !== "undefined" ? window : (function() { return this; }());
const __setTimeout = __global.setTimeout;
const __clearTimeout = __global.clearTimeout;
const __setInterval = __global.setInterval;
const __clearInterval = __global.clearInterval;
const __setImmediate = __global.setImmediate || function (f) { return __setTimeout(f, 0); };
const __clearImmediate = __global.clearImmediate || function (id) { return __clearTimeout(id); };


export function setTimeout(f: () => void, milliseconds: number = 0): number {
  return __setTimeout(f, milliseconds);
}

export function clearTimeout(id: number): void {
  return __clearTimeout(id);
}

export function setInterval(f: () => void, milliseconds: number = 0): number {
  return __setInterval(f, milliseconds);
}

export function clearInterval(id: number): void {
  return __clearInterval(id);
}

export function setImmediate(f: () => void): number {
  return __setImmediate(f);
}

export function clearImmediate(id: number): void {
  return __clearImmediate(id);
}
