import vector = require("./vector")
 
module matrix {
  var MATRIX_SIZE = [4, 9, 16]
  var __cos = Math.cos
  var __floor = Math.floor
  var __sin = Math.sin
  var __sqrt = Math.sqrt
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array 
  var __arrayCreate = function (l: number): any {
    return new Float64Array(l);
  };
  var __arrayCopy = function (src, dest, l: number) {
    if (src !== dest) {
      switch (l) {
        case 16:
          dest[15] = src[15];
          dest[14] = src[14];
          dest[13] = src[13];
          dest[12] = src[12];
          dest[11] = src[11];
          dest[10] = src[10];
          dest[9] = src[9];
        case 9: 
          dest[8] = src[8];
          dest[7] = src[7];
          dest[6] = src[6];
          dest[5] = src[5];
          dest[4] = src[4];
        case 4: 
          dest[3] = src[3];
          dest[2] = src[2];
          dest[1] = src[1];
          dest[0] = src[0];
        case 0: break;
        default:
          for (var i = 0; i < l; ++i) {
            dest[i] = src[i];
          }
      }
    }
  };
  
  export interface IMatrix { length: number; [k: number]: number }
  export interface IMatrix2 { length: number; 0: number; 1: number; 2: number; 3: number; }
  export interface IMatrix3 extends IMatrix2 { 4: number; 5: number; 6: number; 7: number; 8: number; }
  export interface IMatrix4 extends IMatrix3 { 9: number; 10: number; 11: number; 12: number; 13: number; 14: number; 15: number; }
  
  
  export function create(
    _0: number, _1: number, 
    _2: number, _3: number
  ): IMatrix2
  export function create(
    _0: number, _1: number, _2: number, 
    _3: number, _4: number, _5: number, 
    _6: number, _7: number, _8: number
  ): IMatrix3
  export function create(
     _0: number,  _1: number,  _2: number,  _3: number,
     _4: number,  _5: number,  _6: number,  _7: number, 
     _8: number,  _9: number, _10: number, _11: number,
    _12: number, _13: number, _14: number, _15: number
  ): IMatrix4
  export function create(): any {
    var l = arguments.length;
    var r = __arrayCreate(l);
    switch (l) {
      case 4://2x2
        r[3] = arguments[3];
        r[2] = arguments[2];
        r[1] = arguments[1];
        r[0] = arguments[0];
        break;
      case 0: break;
      default:
        for (var i = 0; i < l; ++i) {
          r[i] = arguments[i];
        }
    }
    return r;
  }

  export function copy<T extends IMatrix>(m: T, dest?: T): T {
    var l = m.length;
    dest = dest || __arrayCreate(l);
    __arrayCopy(m, dest, l);
    return dest;
  }
  
  export function determinant(a: IMatrix2): number 
  export function determinant(a: IMatrix3): number
  export function determinant(a: IMatrix4): number
  export function determinant(a: any): number {
    var returnValue = NaN
    switch(a.length) {
      case 4:
        returnValue = a[0] * a[3] - a[2] * a[1]
        break
        
      case 9:
        var a00 = a[0], a01 = a[1], a02 = a[2]
        var a10 = a[3], a11 = a[4], a12 = a[5]
        var a20 = a[6], a21 = a[7], a22 = a[8]

        returnValue = a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20)
        break
      case 16:
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
        var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
        var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]
        var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15]
        var
        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        returnValue = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
   
  export function frob<T extends IMatrix>(m: T): number {
    return null;//array_frob(m)
  }
  
  export function identity<T extends IMatrix>(dest: T): T {
    return null;//mat_identity(dest)
  }

  export function invert<T extends IMatrix>(m: T, dest?: T): T {
    /*dest = dest || array_create(m.length)
      
    switch(dest.length) {
      case 4:
        var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3]
        var det = m0 * m3 - m2 * m1
        if (!det) {
          return null
        }
        det = 1.0 / det
        
        dest[0] =  m3 * det
        dest[1] = -m1 * det
        dest[2] = -m2 * det
        dest[3] =  m0 * det
        break
      case 9:
        break
      default:
        throw new TypeError()
    }
    return dest;*/
    return null;
  }
  
  export function multiply<T extends IMatrix>(a: T, b: T, dest?: T): T {
    return null;//mat_multiply(a, b, dest || array_create(a.length))
  }
  
  function rotate<T extends IMatrix>(m: T, rad: number, dest?: T): T {
    /*dest = dest || array_create(m.length)
      
    switch(m.length) {
      case 4:
        var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3]
        var sin = math_sin(rad)
        var cos = math_cos(rad)
        dest[0] = m0 *  cos + m2 * sin
        dest[1] = m1 *  cos + m3 * sin
        dest[2] = m0 * -sin + m2 * cos
        dest[3] = m1 * -sin + m3 * cos
        break
      default:
        throw new TypeError()
    }
        
    return dest;*/
    return null;
  }

  export function scale<IMatrix4>(m: IMatrix4, v: vector.IVector4, dest?: IMatrix4): IMatrix4
  export function scale<IMatrix3>(m: IMatrix3, v: vector.IVector3, dest?: IMatrix3): IMatrix3
  export function scale<IMatrix2>(m: IMatrix2, v: vector.IVector2, dest?: IMatrix2): IMatrix2
  export function scale(m: any, v: any, dest?: any): any {
    var l = m.length;
    dest = dest || __arrayCreate(l);
    //TODO
    switch (l) { 
      case 0: break;
      case 4:
        var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
        var v0 = v[0], v1 = v[1];
        dest[0] = m0 * v0;
        dest[1] = m1 * v0;
        dest[2] = m2 * v1;
        dest[3] = m3 * v1;
        break;
      case 9:
        var v0 = v[0], v1 = v[1];

        dest[0] = v0 * m[0];
        dest[1] = v0 * m[1];
        dest[2] = v0 * m[2];
    
        dest[3] = v1 * m[3];
        dest[4] = v1 * m[4];
        dest[5] = v1 * m[5];
    
        dest[6] = m[6];
        dest[7] = m[7];
        dest[8] = m[8];
        break;
      case 16:
        var v0 = v[0], v1 = v[1], v2 = v[2];

        dest[0] = v0 * m[0];
        dest[1] = v0 * m[1];
        dest[2] = v0 * m[2];
        dest[3] = v0 * m[3];
    
        dest[4] = v1 * m[4];
        dest[5] = v1 * m[5];
        dest[6] = v1 * m[6];
        dest[7] = v1 * m[7];
        
        dest[8] = v2 * m[8];
        dest[9] = v2 * m[9];
        dest[10] = v2 * m[10];
        dest[11] = v2 * m[11];
    
        dest[12] = m[12];
        dest[13] = m[13];
        dest[14] = m[14];
        dest[15] = m[15];
        break;
      default:
    }
    return dest;
  }
  
  export function transpose<T extends IMatrix>(m: T, dest?: T): T {
    return null;//mat_transpose(m, dest || array_create(m.length));
  }
  
  /*function _index(col: number, row: number, size: number) {
    return (row * size + col)
  }*/
}
  

export = matrix