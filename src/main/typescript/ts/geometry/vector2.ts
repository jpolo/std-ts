module vector {
  
  //Constant
  var LENGTH = 2;
  
  //Util
  //var Float32Array: any = (typeof Float32Array !== 'undefined') ? Float32Array : Array
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array;
  var __abs = Math.abs;
  var __sqrt = Math.sqrt;
  var __arrayCreate = function (): any {
    return new Float64Array(LENGTH);
  };
  var __arrayCopy = function (src, dest) {
    if (src !== dest) {
      dest[0] = src[0];
      dest[1] = src[1];
    }
  };
  var __arrayFill = function (a, v: number) {
    a[0] = v;
    a[1] = v;
  };
  
  export interface IVector2 { 0: number; 1: number; }
  
  export function abs(v: IVector2, dest?: IVector2): IVector2 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = __abs(v[0]);
    r[1] = __abs(v[1]);
    return r;
  }
  
  export function add(a: IVector2, b: IVector2, dest?: IVector2): IVector2 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return r;
  }
  
  export function copy(v: IVector2, dest?: IVector2): IVector2 {
    var r = dest === undefined ? __arrayCreate() : dest;
    __arrayCopy(v, r);
    return r;
  }

  export function create(x: number, y: number): [number, number] {
    var v = __arrayCreate();
    v[0] = x;
    v[1] = y;
    return v;
  }
  
  export function divide(a: IVector2, b: IVector2, dest?: IVector2): IVector2 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a[0] / b[0];
    r[1] = a[1] / b[1];
    return r;
  }
  
  export function dot(a: IVector2, b: IVector2): number {
    var r = 0;
    if (a === b) {
      var a0 = a[0], a1 = a[1]; 
      r = a0 * a0 + a1 * a1;
    } else {
      r = a[0] * b[0] + a[1] * b[1];
    }
    return r;
  }
  
  export function length(v: IVector2): number {
    return __sqrt(lengthSquared(v));
  }
  
  export function lengthSquared(v: IVector2): number {
    return dot(v, v);
  }
  
  export function multiply(a: IVector2, b: IVector2, dest?: IVector2): IVector2 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a[0] * b[0];
    r[1] = a[1] * b[1];
    return r;
  }
  
  export function negate(v: IVector2, dest?: IVector2): IVector2 {
    return scale(v, -1, dest);
  }
  
  export function normalize(v: IVector2, dest?: IVector2): IVector2 {
    return scale(v, 1 / length(v), dest);
  }
  
  export function scale(v: IVector2, scalar: number, dest?: IVector2): IVector2 {
    var r = dest === undefined ? __arrayCreate() : dest;
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
  
  export function subtract(a: IVector2, b: IVector2, dest?: IVector2): IVector2 {
    var r = dest === undefined ? __arrayCreate() : dest;
    if (a === b) {
      __arrayFill(r, 0);
    } else {
      r[0] = a[0] - b[0];
      r[1] = a[1] - b[1];
    }
    return r;
  }
  
}
export = vector;