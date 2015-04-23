module vector {
  
  //Constant
  
  //Util
  //var Float32Array: any = (typeof Float32Array !== 'undefined') ? Float32Array : Array
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array;
  var __sqrt = Math.sqrt;
  var __arrayCreate = function (l: number): any {
    return new Float64Array(l);
  };
  var __arrayCopy = function (src, dest, l: number) {
    if (src !== dest) {
      switch (l) {
        case 4: dest[3] = src[3];
        case 3: dest[2] = src[2];
        case 2: dest[1] = src[1];
        case 1: dest[0] = src[0];
        case 0: break;
        default:
          for (var i = 0; i < l; ++i) {
            dest[i] = src[i];
          }
      }
    }
  };
  var __arrayFill = function (a, v: number) {
    var l = a.length;
    switch (l) {
      case 4: a[3] = v;
      case 3: a[2] = v;
      case 2: a[1] = v;
      case 1: a[0] = v;
      case 0: break;
      default:
        for (var i = 0; i < l; ++i) {
          a[i] = v;
        }
    }
  };
  
  
  export interface IVector { length: number; 0: number; 1: number; }
  export interface IVector2 extends IVector {}
  export interface IVector3 extends IVector2 { 2: number }
  export interface IVector4 extends IVector3 { 3: number }
  
  export function add<T extends IVector>(v1: T, v2: T, dest?: T): T {
    var l = v1.length;
    var r = dest || __arrayCreate(l);
    switch (l) {
      case 4: r[3] = v1[3] + v2[3];
      case 3: r[2] = v1[2] + v2[2];
      case 2: r[1] = v1[1] + v2[1];
      case 1: r[0] = v1[0] + v2[0];
      case 0: break;
      default:
        for (var i = 0; i < l; ++i) {
          r[i] = v1[i] + v2[i];
        }
    }
    return r;
  }
  
  export function copy<T extends IVector>(v: T, dest?: T): T {
    var l = v.length;
    var r = dest || __arrayCreate(l);
    __arrayCopy(v, r, l);
    return r;
  }

  export function create(x: number, y: number): IVector2
  export function create(x: number, y: number, z: number): IVector3
  export function create(x: number, y: number, z: number, w: number): IVector4
  export function create(): any {
    var argc = arguments.length;
    var v = __arrayCreate(argc);
    switch(argc) {
      case 4: v[3] = arguments[3];
      case 3: v[2] = arguments[2];
      case 2: v[1] = arguments[1];
      case 1: v[0] = arguments[0];
      case 0: break;
      default:
        for (var i = 0; i < argc; ++i) {
          v[i] = arguments[i];
        }
    }
    return v;
  }
  
  export function length<T extends IVector>(v: T): number {
    return __sqrt(lengthSquared(v));
  }
  
  export function lengthSquared<T extends IVector>(v: T): number {
    var x, y, z, w;
    var l = v.length;
    var r = 0;
    switch (l) {
      case 0: break;
      case 1: x = v[0]; r = x * x; break;
      case 2: x = v[0]; y = v[1]; r = x * x + y * y; break;
      case 3: x = v[0]; y = v[1]; z = v[2]; r = x * x + y * y + z * z; break;
      case 4: x = v[0]; y = v[1]; z = v[2]; w = v[3]; r = x * x + y * y + z * z + w * w; break;
      default:
        var tmp;
        for (var i = 0; i < l; ++i) {
          tmp = v[i];
          r += tmp * tmp;
        }
    }
    return r;
  }
  
  export function normalize<T extends IVector>(v: T, dest?: T): T {
    return scale(v, 1 / length(v), dest);
  }
  
  export function scale<T extends IVector>(v: T, scalar: number, dest?: T): T {
    var l = v.length;
    var r = dest || __arrayCreate(l);
    if (scalar === 0) {
      __arrayFill(r, 0);
    } else if (scalar === 1) {
      __arrayCopy(v, r, l);
    } else {
      switch (l) {
        case 4: r[3] = v[3] * scalar;
        case 3: r[2] = v[2] * scalar;
        case 2: r[1] = v[1] * scalar;
        case 1: r[0] = v[0] * scalar;
        case 0: break;
        default:
          for (var i = 0; i < l; ++i) {
            r[i] = v[i] * scalar;
          }
      }
    }
    return r;
  }
  
  export function subtract<T extends IVector>(v1: T, v2: T, dest?: T): T {
    var l = v1.length;
    var r = dest || __arrayCreate(l);
    if (v1 === v2) {
      __arrayFill(r, 0);
    } else {
      switch (l) {
        case 4: r[3] = v1[3] - v2[3];
        case 3: r[2] = v1[2] - v2[2];
        case 2: r[1] = v1[1] - v2[1];
        case 1: r[0] = v1[0] - v2[0];
        case 0: break;
        default:
          for (var i = 0; i < l; ++i) {
            r[i] = v1[i] - v2[i];
          }
      }
    }
    return r;
  }
  
}
export = vector;