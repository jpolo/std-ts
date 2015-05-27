module matrix3 {
  
  //Util
  type Matrix3 = [number, number, number, number]
  type Matrix3Constructor =  { new(n: number): Matrix3 }
  
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array;
  var __constructor = function (o: Matrix3): Matrix3Constructor { return o.constructor || Float64Array; };
  var __arrayCreate = function (Constructor: Matrix3Constructor): Matrix3 {
    return new Constructor(2);
  };
  var __arrayCreateFrom = function (o: Matrix3) {
    return __arrayCreate(__constructor(o));
  };
  var __arrayCopy = function (src: Matrix3, dest: Matrix3) {
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
  };
  var __arrayFill = function (a: Matrix3, v: number) {
    a[0] = v;
    a[1] = v;
    a[2] = v;
    a[3] = v;
    a[4] = v;
    a[5] = v;
    a[6] = v;
    a[7] = v;
    a[8] = v;
  };
  
  export function create(
    m00: number, m01: number, m02: number, 
    m10: number, m11: number, m12: number,
    m20: number, m21: number, m22: number
  ): Matrix3 {
    var m = __arrayCreate(Float64Array);
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
    var r = dest === undefined ? __arrayCreateFrom(m) : dest;
    __arrayCopy(m, r);
    return r;
  }
  
  export function determinant(m: Matrix3): number {
    var m00 = m[0], m01 = m[1], m02 = m[2];
    var m10 = m[3], m11 = m[4], m12 = m[5];
    var m20 = m[6], m21 = m[7], m22 = m[8];
    return m00 * (m22 * m11 - m12 * m21) + m01 * (-m22 * m10 + m12 * m20) + m02 * (m21 * m10 - m11 * m20);  
  }
}