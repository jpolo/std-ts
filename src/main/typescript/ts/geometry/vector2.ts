// Util
export type Vector2 = [number, number];
type Vector2Constructor =  { new(n: number): Vector2 };

// let Float32Array: any = (typeof Float32Array !== 'undefined') ? Float32Array : Array
const Float64Array: any = Array;
const __abs = Math.abs;
const __sqrt = Math.sqrt;
function GetConstructor(o: Vector2): Vector2Constructor { return o.constructor || Float64Array; }
function ArrayCreate(Constructor: Vector2Constructor): Vector2 {
  return new Constructor(2);
}
function ArrayCreateFrom(o: Vector2) {
  return ArrayCreate(GetConstructor(o));
}
function ArrayCopy(src: Vector2, dest: Vector2) {
  if (src !== dest) {
    dest[0] = src[0];
    dest[1] = src[1];
  }
}
function ArrayFill(a: Vector2, v: number) {
  a[0] = v;
  a[1] = v;
}

export function abs(v: Vector2, dest?: Vector2): Vector2 {
  const r = dest === undefined ? ArrayCreateFrom(v) : dest;
  r[0] = __abs(v[0]);
  r[1] = __abs(v[1]);
  return r;
}

export function add(a: Vector2, b: Vector2, dest?: Vector2): Vector2 {
  const r = dest === undefined ? ArrayCreateFrom(a) : dest;
  r[0] = a[0] + b[0];
  r[1] = a[1] + b[1];
  return r;
}

export function copy(v: Vector2, dest?: Vector2): Vector2 {
  const r = dest === undefined ? ArrayCreateFrom(v) : dest;
  ArrayCopy(v, r);
  return r;
}

export function create(x: number, y: number): Vector2 {
  const v = ArrayCreate(Float64Array);
  v[0] = x;
  v[1] = y;
  return v;
}

export function divide(a: Vector2, b: Vector2, dest?: Vector2): Vector2 {
  const r = dest === undefined ? ArrayCreateFrom(a) : dest;
  r[0] = a[0] / b[0];
  r[1] = a[1] / b[1];
  return r;
}

export function dot(a: Vector2, b: Vector2): number {
  let r = 0;
  if (a === b) {
    const a0 = a[0], a1 = a[1];
    r = a0 * a0 + a1 * a1;
  } else {
    r = a[0] * b[0] + a[1] * b[1];
  }
  return r;
}

export function length(v: Vector2): number {
  return __sqrt(lengthSquared(v));
}

export function lengthSquared(v: Vector2): number {
  return dot(v, v);
}

export function multiply(a: Vector2, b: Vector2, dest?: Vector2): Vector2 {
  const r = dest === undefined ? ArrayCreateFrom(a) : dest;
  r[0] = a[0] * b[0];
  r[1] = a[1] * b[1];
  return r;
}

export function negate(v: Vector2, dest?: Vector2): Vector2 {
  return scale(v, -1, dest);
}

export function normalize(v: Vector2, dest?: Vector2): Vector2 {
  return scale(v, 1 / length(v), dest);
}

export function scale(v: Vector2, scalar: number, dest?: Vector2): Vector2 {
  const r = dest === undefined ? ArrayCreateFrom(v) : dest;
  if (scalar === 0) {
    ArrayFill(r, 0);
  } else if (scalar === 1) {
    ArrayCopy(v, r);
  } else {
    r[0] = v[0] * scalar;
    r[1] = v[1] * scalar;
  }
  return r;
}

export function subtract(a: Vector2, b: Vector2, dest?: Vector2): Vector2 {
  const r = dest === undefined ? ArrayCreateFrom(a) : dest;
  if (a === b) {
    ArrayFill(r, 0);
  } else {
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
  }
  return r;
}
