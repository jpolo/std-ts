import vector4 = require("ts/geometry/vector4")

module quaternion {
  
  //Constant
  var IDENTITY: Quaternion = [0, 0, 0, 1]
  
  //Util
  type Quaternion = [number, number, number, number]
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array
  var __sqrt = Math.sqrt;
  var __arrayCreate = function (): any {
    return new Float64Array(4) 
  };

  export var add = vector4.add;

  export function conjugate(q: Quaternion, dest?: Quaternion): Quaternion {
    var r = dest || __arrayCreate();
    r[0] = -q[0];
    r[1] = -q[1];
    r[2] = -q[2];
    r[3] = q[3];
    return r;
  }
  
  export var copy = vector4.copy;
  
  export var create = vector4.create;
  
  export var dot = vector4.dot;
  
  export function identity(dest?: Quaternion): Quaternion {
    return copy(IDENTITY, dest);
  }
  
  export function invert(q: Quaternion, dest?: Quaternion): Quaternion {
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
  
  export var length = vector4.length;
  
  export var lengthSquared = vector4.lengthSquared;
  
  export var multiply = vector4.multiply;
  
  export var negate = vector4.negate;
  
  export var normalize = vector4.normalize;
  
  export var scale = vector4.scale;
  
  export var subtract = vector4.subtract;

}
export = quaternion;
