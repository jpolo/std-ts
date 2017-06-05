
// Util
export type Matrix3 = [number, number, number, number];
type Matrix3Constructor =  { new(n: number): Matrix3 };

const Float64Array: any = Array;
function GetConstructor(o: Matrix3): Matrix3Constructor { return o.constructor || Float64Array; }
function ArrayCreate(Constructor: Matrix3Constructor): Matrix3 {
  return new Constructor(9);
}
function ArrayCreateFrom(o: Matrix3) {
  return ArrayCreate(GetConstructor(o));
}
function ArrayCopy(src: Matrix3, dest: Matrix3) {
  if (src !== dest) {
    dest[0] = src[0];
    dest[1] = src[1];
    dest[2] = src[2];
    dest[3] = src[3];
    dest[4] = src[4];
    dest[5] = src[5];
    dest[6] = src[6];
    dest[7] = src[7];
    dest[8] = src[8];
  }
}
function ArrayFill(a: Matrix3, v: number) {
  a[0] = v;
  a[1] = v;
  a[2] = v;
  a[3] = v;
  a[4] = v;
  a[5] = v;
  a[6] = v;
  a[7] = v;
  a[8] = v;
}

export function create(
  m00: number, m01: number, m02: number,
  m10: number, m11: number, m12: number,
  m20: number, m21: number, m22: number
): Matrix3 {
  const m = ArrayCreate(Float64Array);
  m[0] = m00;
  m[1] = m01;
  m[2] = m02;

  m[3] = m10;
  m[4] = m11;
  m[5] = m12;

  m[6] = m20;
  m[7] = m21;
  m[8] = m22;
  return m;
}

export function copy(m: Matrix3, dest?: Matrix3): Matrix3 {
  const r = dest === undefined ? ArrayCreateFrom(m) : dest;
  ArrayCopy(m, r);
  return r;
}

export function determinant(m: Matrix3): number {
  const m00 = m[0], m01 = m[1], m02 = m[2];
  const m10 = m[3], m11 = m[4], m12 = m[5];
  const m20 = m[6], m21 = m[7], m22 = m[8];
  return m00 * (m22 * m11 - m12 * m21) + m01 * (-m22 * m10 + m12 * m20) + m02 * (m21 * m10 - m11 * m20);
}

export function identity(dest?: Matrix3): Matrix3 {
  const r = dest === undefined ? ArrayCreate(Float64Array) : dest;
  r[0] = 1;
  r[1] = 0;
  r[2] = 0;

  r[3] = 0;
  r[4] = 1;
  r[5] = 0;

  r[6] = 0;
  r[7] = 0;
  r[8] = 1;
  return r;
}

export function transpose(m: Matrix3, dest?: Matrix3): Matrix3 {
  const r = dest === undefined ? ArrayCreateFrom(m) : dest;
  if (dest === m) {
    const m01 = m[1], m02 = m[2], m12 = m[5];
    r[1] = m[3];
    r[2] = m[6];
    r[3] = m01;
    r[5] = m[7];
    r[6] = m02;
    r[7] = m12;
  } else {
    r[0] = m[0];
    r[1] = m[3];
    r[2] = m[6];
    r[3] = m[1];
    r[4] = m[4];
    r[5] = m[7];
    r[6] = m[2];
    r[7] = m[5];
    r[8] = m[8];
  }
  return r;
}
