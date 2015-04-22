module quaternion {
  
  //Constant
  var LENGTH = 4
  var IDENTITY = <IQuaternion>[0, 0, 0, 1]
  
  //Util
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array
  var __sqrt = Math.sqrt;
  var __arrayCreate = function (): any {
    return new Float64Array(LENGTH) 
  };
  
  
  export interface IQuaternion { 
    length: number; 
    0: number; 
    1: number;
    2: number; 
    3: number;
  }
  
  export function add(q1: IQuaternion, q2: IQuaternion, dest?: IQuaternion): IQuaternion {
    var r = dest || __arrayCreate();
    r[0] = q1[0] + q2[0];
    r[1] = q1[1] + q2[1];
    r[2] = q1[2] + q2[2];
    r[3] = q1[3] + q2[3];
    return r;
  }

  export function conjugate(q: IQuaternion, dest?: IQuaternion): IQuaternion {
    var r = dest || __arrayCreate();
    r[0] = -q[0];
    r[1] = -q[1];
    r[2] = -q[2];
    r[3] = q[3];
    return r;
  }
  
  export function copy(q: IQuaternion, dest?: IQuaternion): IQuaternion {
    var r = dest || __arrayCreate();
    if (q !== dest) {
      r[0] = q[0];
      r[1] = q[1];
      r[2] = q[2];
      r[3] = q[3];
    }
    return r;
  }
  
  export function create(x: number, y: number, z: number, w: number): IQuaternion {
    var v = __arrayCreate();
    v[0] = x;
    v[1] = y;
    v[2] = z;
    v[3] = w;
    return v;
  }
  
  export function dot(a: IQuaternion, b: IQuaternion): number {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    return (
      a === b ? ax * ax + ay * ay + az * az + aw * aw :
      ax * b[0] + ay * b[1] + az * b[2] + aw * b[3]
    );
  }
  
  export function identity(dest?: IQuaternion): IQuaternion {
    return copy(IDENTITY, dest);
  }
  
  export function invert(q: IQuaternion, dest?: IQuaternion): IQuaternion {
    var q0 = q[0], q1 = q[1], q2 = q[2], q3 = q[3];
    var dot = q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3;
    var invDot = dot ? 1.0 / dot : 0;
    var r = dest || __arrayCreate();
    r[0] = -q0 * invDot;
    r[1] = -q1 * invDot;
    r[2] = -q2 * invDot;
    r[3] = q3 * invDot;
    return r;
  }
  
  export function length(q: IQuaternion): number {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    return __sqrt(x * x + y * y + z * z + w * w);
  }
  
  export function lengthSquared(q: IQuaternion): number {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    return x * x + y * y + z * z + w * w;
  }
  
  export function multiply(a: IQuaternion, b: IQuaternion, dest?: IQuaternion): IQuaternion {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    var r = dest || __arrayCreate();
    r[0] = ax * bw + aw * bx + ay * bz - az * by;
    r[1] = ay * bw + aw * by + az * bx - ax * bz;
    r[2] = az * bw + aw * bz + ax * by - ay * bx;
    r[3] = aw * bw - ax * bx - ay * by - az * bz;
    return r;
  }
  
  export function normalize(q: IQuaternion, dest?: IQuaternion): IQuaternion {
    var r = dest || __arrayCreate();
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var factor = 1 / __sqrt(x * x + y * y + z * z + w * w);
    r[0] = x * factor;
    r[1] = y * factor;
    r[2] = z * factor;
    r[3] = w * factor;
    return r;
  }
  
  export function scale(q: IQuaternion, n: number, dest?: IQuaternion) {
    var r = dest || __arrayCreate();
    r[0] = q[0] * n;
    r[1] = q[1] * n;
    r[2] = q[2] * n;
    r[3] = q[3] * n;
    return r;
  }
  
  export function subtract(q1: IQuaternion, q2: IQuaternion, dest?: IQuaternion): IQuaternion {
    var r = dest || __arrayCreate();
    r[0] = q1[0] - q2[0];
    r[1] = q1[1] - q2[1];
    r[2] = q1[2] - q2[2];
    r[3] = q1[3] - q2[3];
    return r;
  }

}
export = quaternion;
