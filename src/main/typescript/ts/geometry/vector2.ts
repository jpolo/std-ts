//Util
type Vector2 = [number, number]
type Vector2Constructor =  { new(n: number): Vector2 }

//let Float32Array: any = (typeof Float32Array !== 'undefined') ? Float32Array : Array
const Float64Array: any = Array;
const __abs = Math.abs;
const __sqrt = Math.sqrt;
const __constructor = function (o: Vector2): Vector2Constructor { return o.constructor || Float64Array; };
const __arrayCreate = function (Constructor: Vector2Constructor): Vector2 {
  return new Constructor(2);
};
const __arrayCreateFrom = function (o: Vector2) {
  return __arrayCreate(__constructor(o));
};
const __arrayCopy = function (src: Vector2, dest: Vector2) {
  if (src !== dest) {
    dest[0] = src[0];
    dest[1] = src[1];
  }
};
const __arrayFill = function (a: Vector2, v: number) {
  a[0] = v;
  a[1] = v;
};

export function abs(v: Vector2, dest?: Vector2): Vector2 {
  let r = dest === undefined ? __arrayCreateFrom(v) : dest;
  r[0] = __abs(v[0]);
  r[1] = __abs(v[1]);
  return r;
}

export function add(a: Vector2, b: Vector2, dest?: Vector2): Vector2 {
  let r = dest === undefined ?__arrayCreateFrom(a) : dest;
  r[0] = a[0] + b[0];
  r[1] = a[1] + b[1];
  return r;
}

export function copy(v: Vector2, dest?: Vector2): Vector2 {
  let r = dest === undefined ? __arrayCreateFrom(v) : dest;
  __arrayCopy(v, r);
  return r;
}

export function create(x: number, y: number): Vector2 {
  let v = __arrayCreate(Float64Array);
  v[0] = x;
  v[1] = y;
  return v;
}

export function divide(a: Vector2, b: Vector2, dest?: Vector2): Vector2 {
  let r = dest === undefined ? __arrayCreateFrom(a) : dest;
  r[0] = a[0] / b[0];
  r[1] = a[1] / b[1];
  return r;
}

export function dot(a: Vector2, b: Vector2): number {
  let r = 0;
  if (a === b) {
    let a0 = a[0], a1 = a[1]; 
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
  let r = dest === undefined ? __arrayCreateFrom(a) : dest;
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
  let r = dest === undefined ? __arrayCreateFrom(v) : dest;
  if (scalar === 0) {
    __arrayFill(r, 0);
  } else if (scalar === 1) {
    __arrayCopy(v, r);
  } else {
    r[0] = v[0] * scalar;
    r[1] = v[1] * scalar;
  }
  return r;
}

export function subtract(a: Vector2, b: Vector2, dest?: Vector2): Vector2 {
  let r = dest === undefined ? __arrayCreateFrom(a) : dest;
  if (a === b) {
    __arrayFill(r, 0);
  } else {
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
  }
  return r;
}