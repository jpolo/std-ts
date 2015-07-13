

//Util
type Matrix2 = [number, number, number, number]
type Matrix2Constructor =  { new(n: number): Matrix2 }

const NumberArray: any = Array;
const __constructor = function (o: Matrix2): Matrix2Constructor { return o.constructor || NumberArray; };
const __arrayCreate = function (Constructor: Matrix2Constructor): Matrix2 {
  return new Constructor(4);
};
const __arrayCreateFrom = function (o: Matrix2) {
  return __arrayCreate(__constructor(o));
};
const __arrayCopy = function (src: Matrix2, dest: Matrix2) {
  if (src !== dest) {
    dest[0] = src[0];
    dest[1] = src[1];
    dest[2] = src[2];
    dest[3] = src[3];
  }
};
const __arrayFill = function (a: Matrix2, v: number) {
  a[0] = v;
  a[1] = v;
  a[2] = v;
  a[3] = v;
};


export function copy(m: Matrix2, dest?: Matrix2): Matrix2 {
  let r = dest === undefined ? __arrayCreateFrom(m) : dest;
  __arrayCopy(m, r);
  return r;
}

export function create(
  m00: number, m01: number, 
  m10: number, m11: number
): Matrix2 {
  let m = __arrayCreate(NumberArray);
  m[0] = m00;
  m[1] = m01;
  m[2] = m10;
  m[3] = m11;
  return m;
}

export function determinant(m: Matrix2): number {
  return m[0] * m[3] - m[2] * m[1];  
}

export function identity(dest?: Matrix2): Matrix2 {
  let r = dest === undefined ? __arrayCreate(NumberArray) : dest;
  r[0] = 1;
  r[1] = 0;
  r[2] = 0;
  r[3] = 1;
  return r;  
}

export function transpose(m: Matrix2, dest?: Matrix2): Matrix2 {
  let r = dest === undefined ? __arrayCreateFrom(m) : dest;
  if (dest === m) {
    let m1 = m[1];
    r[1] = m[2];
    r[2] = m1;
  } else {
    r[0] = m[0];
    r[1] = m[2];
    r[2] = m[1];
    r[3] = m[3];
  }
  return r;
}
