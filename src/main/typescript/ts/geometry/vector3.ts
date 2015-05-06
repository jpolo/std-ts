module vector3 {
  
  //Constant
  
  //Util
  type Vector3 = [number, number, number]
  //var Float32Array: any = (typeof Float32Array !== 'undefined') ? Float32Array : Array
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array;
  var __abs = Math.abs;
  var __sqrt = Math.sqrt;
  var __arrayCreate = function (): Vector3 {
    return new Float64Array(3);
  };
  var __arrayCopy = function (src: Vector3, dest: Vector3) {
    if (src !== dest) {
      dest[0] = src[0];
      dest[1] = src[1];
      dest[2] = src[2];
    }
  };
  var __arrayFill = function (a, v: number) {
    a[0] = v;
    a[1] = v;
    a[2] = v;
  };
  
  export function abs(v: Vector3, dest?: Vector3): Vector3 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = __abs(v[0]);
    r[1] = __abs(v[1]);
    r[2] = __abs(v[2]);
    return r;
  }
  
  export function add(a: Vector3, b: Vector3, dest?: Vector3): Vector3 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    return r;
  }
  
  export function copy(v: Vector3, dest?: Vector3): Vector3 {
    var r = dest === undefined ? __arrayCreate() : dest;
    __arrayCopy(v, r);
    return r;
  }

  export function create(x: number, y: number, z: number): Vector3 {
    var v = __arrayCreate();
    v[0] = x;
    v[1] = y;
    v[2] = z;
    return v;
  }
  
  export function divide(a: Vector3, b: Vector3, dest?: Vector3): Vector3 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a[0] / b[0];
    r[1] = a[1] / b[1];
    r[2] = a[2] / b[2];
    return r;
  }
  
  export function dot(a: Vector3, b: Vector3): number {
    var r = 0;
    if (a === b) { 
      var a0 = a[0], a1 = a[1], a2 = a[2]; 
      r = a0 * a0 + a1 * a1 + a2 * a2;
    } else {
      r = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    return r;
  }
  
  export function length(v: Vector3): number {
    return __sqrt(lengthSquared(v));
  }
  
  export function lengthSquared(v: Vector3): number {
    return dot(v, v);
  }
  
  export function multiply(a: Vector3, b: Vector3, dest?: Vector3): Vector3 {
    var r = dest === undefined ? __arrayCreate() : dest;
    r[0] = a[0] * b[0];
    r[1] = a[1] * b[1];
    r[2] = a[2] * b[2];
    return r;
  }
  
  export function negate(v: Vector3, dest?: Vector3): Vector3 {
    return scale(v, -1, dest);
  }
  
  export function normalize(v: Vector3, dest?: Vector3): Vector3 {
    return scale(v, 1 / length(v), dest);
  }
  
  export function scale(v: Vector3, scalar: number, dest?: Vector3): Vector3 {
    var r = dest === undefined ? __arrayCreate() : dest;
    if (scalar === 0) {
      __arrayFill(r, 0);
    } else if (scalar === 1) {
      __arrayCopy(v, r);
    } else {
      r[0] = v[0] * scalar;
      r[1] = v[1] * scalar;
      r[2] = v[2] * scalar;
    }
    return r;
  }
  
  export function subtract(a: Vector3, b: Vector3, dest?: Vector3): Vector3 {
    var r = dest === undefined ? __arrayCreate() : dest;
    if (a === b) {
      __arrayFill(r, 0);
    } else {
      r[0] = a[0] - b[0];
      r[1] = a[1] - b[1];
      r[2] = a[2] - b[2];
    }
    return r;
  }
  
}
export = vector3;