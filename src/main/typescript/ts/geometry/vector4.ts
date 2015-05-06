module vector4 {
  //Constant
  var LENGTH = 4
  var IDENTITY = <IVector4>[0, 0, 0, 1]
  
  //Util
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array
  var __sqrt = Math.sqrt;
  var __arrayCreate = function (): any {
    return new Float64Array(LENGTH) 
  };
  var __arrayCopy = function (src, dest) {
    if (src !== dest) {
      dest[0] = src[0];
      dest[1] = src[1];
      dest[2] = src[2];
      dest[3] = src[3];
    }
  };
  var __arrayFill = function (a, v: number) {
    a[0] = v;
    a[1] = v;
    a[2] = v;
    a[3] = v;
  };
  
  
  export interface IVector4 { 
    length: number; 
    0: number; 
    1: number;
    2: number; 
    3: number;
  }
  
  export function add(a: IVector4, b: IVector4, dest?: IVector4): IVector4 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    return r;
  }

  export function copy(v: IVector4, dest?: IVector4): IVector4 {
    var r = dest === undefined ? __arrayCreate() : dest;
    __arrayCopy(v, r);
    return r;
  }
  
  export function create(x: number, y: number, z: number, w: number): IVector4 {
    var v = __arrayCreate();
    v[0] = x;
    v[1] = y;
    v[2] = z;
    v[3] = w;
    return v;
  }
  
  export function dot(a: IVector4, b: IVector4): number {
    var r: number;
    if (a === b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      r = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    } else {
      r = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
    }
    return r;
  }
  
  export function identity(dest?: IVector4): IVector4 {
    return copy(IDENTITY, dest);
  }
  
  export function length(q: IVector4): number {
    return __sqrt(dot(q, q));
  }
  
  export function lengthSquared(q: IVector4): number {
    return dot(q, q);
  }
  
  export function multiply(a: IVector4, b: IVector4, dest?: IVector4): IVector4 {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a0 * b3 + a3 * b0 + a1 * b2 - a2 * b1;
    r[1] = a1 * b3 + a3 * b1 + a2 * b0 - a0 * b2;
    r[2] = a2 * b3 + a3 * b2 + a0 * b1 - a1 * b0;
    r[3] = a3 * b3 - a0 * b0 - a1 * b1 - a2 * b2;
    return r;
  }
  
  export function normalize(v: IVector4, dest?: IVector4): IVector4 {
    var factor = 1 / __sqrt(dot(v, v));
    return scale(v, factor, dest);
  }
  
  export function scale(v: IVector4, n: number, dest?: IVector4) {
    var r = dest === undefined ? __arrayCreate() : dest;
    if (n === 0) {
      __arrayFill(r, 0);
    } else if (n === 1) {
      __arrayCopy(v, r);
    } else {
      r[0] = v[0] * n;
      r[1] = v[1] * n;
      r[2] = v[2] * n;
      r[3] = v[3] * n;
    }
    return r;
  }
  
  export function subtract(a: IVector4, b: IVector4, dest?: IVector4): IVector4 {
    var r = dest === undefined ? __arrayCreate() : dest;
    if (a === b) {
      __arrayFill(dest, 0);  
    } else {
      r[0] = a[0] - b[0];
      r[1] = a[1] - b[1];
      r[2] = a[2] - b[2];
      r[3] = a[3] - b[3];
    }
    return r;
  }

}
export = vector4