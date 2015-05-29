module matrix4 {
  
  //Util
  type Matrix4 = [number, number, number, number]
  type Matrix4Constructor =  { new(n: number): Matrix4 }
  
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array;
  var __constructor = function (o: Matrix4): Matrix4Constructor { return o.constructor || Float64Array; };
  var __arrayCreate = function (Constructor: Matrix4Constructor): Matrix4 {
    return new Constructor(2);
  };
  var __arrayCreateFrom = function (o: Matrix4) {
    return __arrayCreate(__constructor(o));
  };
  var __arrayCopy = function (src: Matrix4, dest: Matrix4) {
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
      dest[9] = src[9];
      dest[10] = src[10];
      dest[11] = src[11];
      dest[12] = src[12];
      dest[13] = src[13];
      dest[14] = src[14];
      dest[15] = src[15];
    }
  };
  var __arrayFill = function (a: Matrix4, v: number) {
    a[0] = v;
    a[1] = v;
    a[2] = v;
    a[3] = v;
    a[4] = v;
    a[5] = v;
    a[6] = v;
    a[7] = v;
    a[8] = v;
    a[9] = v;
    a[10] = v;
    a[11] = v;
    a[12] = v;
    a[13] = v;
    a[14] = v;
    a[15] = v;
  };
  
  
  export function copy(m: Matrix4, dest?: Matrix4): Matrix4 {
    var r = dest === undefined ? __arrayCreateFrom(m) : dest;
    __arrayCopy(m, r);
    return r;
  }
  
  export function determinant(m: Matrix4): number {
    var m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
    var m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
    var m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
    var m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
    var
    b00 = m00 * m11 - m01 * m10,
    b01 = m00 * m12 - m02 * m10,
    b02 = m00 * m13 - m03 * m10,
    b03 = m01 * m12 - m02 * m11,
    b04 = m01 * m13 - m03 * m11,
    b05 = m02 * m13 - m03 * m12,
    b06 = m20 * m31 - m21 * m30,
    b07 = m20 * m32 - m22 * m30,
    b08 = m20 * m33 - m23 * m30,
    b09 = m21 * m32 - m22 * m31,
    b10 = m21 * m33 - m23 * m31,
    b11 = m22 * m33 - m23 * m32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06  
  }
  
  export function identity(dest?: Matrix4): Matrix4 {
    var r = dest === undefined ? __arrayCreate(Float64Array) : dest;
    r[0] = 1;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    
    r[4] = 0;
    r[5] = 1;
    r[6] = 0;
    r[7] = 0;
    
    r[4] = 0;
    r[5] = 0;
    r[6] = 1;
    r[7] = 0;
    
    r[4] = 0;
    r[5] = 0;
    r[6] = 0;
    r[7] = 1;
    return r;  
  }
  
  export function transpose(m: Matrix4, dest?: Matrix4): Matrix4 {
    var r = dest === undefined ? __arrayCreateFrom(m) : dest;
    if (m === dest) {
      var m01 = m[1], m02 = m[2], m03 = m[3],
          m12 = m[6], m13 = m[7],
          m23 = m[11];

      r[1] = m[4];
      r[2] = m[8];
      r[3] = m[12];
      r[4] = m01;
      r[6] = m[9];
      r[7] = m[13];
      r[8] = m02;
      r[9] = m12;
      r[11] = m[14];
      r[12] = m03;
      r[13] = m13;
      r[14] = m23;
    } else {
      r[0] = m[0];
      r[1] = m[4];
      r[2] = m[8];
      r[3] = m[12];
      r[4] = m[1];
      r[5] = m[5];
      r[6] = m[9];
      r[7] = m[13];
      r[8] = m[2];
      r[9] = m[6];
      r[10] = m[10];
      r[11] = m[14];
      r[12] = m[3];
      r[13] = m[7];
      r[14] = m[11];
      r[15] = m[15];
    }
    
    return r;
  };
}
export = matrix4