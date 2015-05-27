module matrix2 {
  
  //Util
  type Matrix2 = [number, number, number, number]
  type Matrix2Constructor =  { new(n: number): Matrix2 }
  
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array;
  var __constructor = function (o: Matrix2): Matrix2Constructor { return o.constructor || Float64Array; };
  var __arrayCreate = function (Constructor: Matrix2Constructor): Matrix2 {
    return new Constructor(2);
  };
  var __arrayCreateFrom = function (o: Matrix2) {
    return __arrayCreate(__constructor(o));
  };
  var __arrayCopy = function (src: Matrix2, dest: Matrix2) {
    if (src !== dest) {
      dest[0] = src[0];
      dest[1] = src[1];
      dest[2] = src[2];
      dest[3] = src[3];
    }
  };
  var __arrayFill = function (a: Matrix2, v: number) {
    a[0] = v;
    a[1] = v;
    a[2] = v;
    a[3] = v;
  };
  
  
  export function copy(m: Matrix2, dest?: Matrix2): Matrix2 {
    var r = dest === undefined ? __arrayCreateFrom(m) : dest;
    __arrayCopy(m, r);
    return r;
  }
  
  export function create(
    m00: number, m01: number, 
    m10: number, m11: number
  ): Matrix2 {
    var m = __arrayCreate(Float64Array);
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
    var r = dest === undefined ? __arrayCreateFrom(dest) : dest;
    //TODO assign
    return r;
  }
}