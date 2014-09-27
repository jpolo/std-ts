import macro = require('ts/macro')

module geometry {
  
  var math_sqrt = Math.sqrt


  export interface IVector { length: number; 0: number; 1: number; }
  export interface IVector2 extends IVector {}
  export interface IVector3 extends IVector2 { 2: number }
  export interface IVector4 extends IVector3 { 3: number }
  
  export interface IQuaternion extends IVector4 { }
  
  export interface IMatrix { length: number; 0: number; 1: number; 2: number; 3: number; }
  export interface IMatrix2 extends IMatrix { }
  export interface IMatrix3 extends IMatrix2 { 4: number; 5: number; 6: number; 7: number; 8: number; }
  export interface IMatrix4 extends IMatrix3 { 9: number; 10: number; 11: number; 12: number; 13: number; 14: number; 15: number; }
  
 
  export module angle {
  
  }
  
  export module quaternion {
    var LENGTH = 4
    var IDENTITY = [0, 0, 0, 1]
    
    export function add(q1: IQuaternion, q2: IQuaternion, dest?: IQuaternion): IQuaternion {
      return array_add(q1, q2, dest || array_create(LENGTH))
    }
    
    export function conjugate(q: IQuaternion, dest?: IQuaternion): IQuaternion {
      dest = dest || array_create(LENGTH)
      dest[0] = -q[0]
      dest[1] = -q[1]
      dest[2] = -q[2]
      dest[3] = q[3]
      return dest;
    }
    
    export function copy(q: IQuaternion, dest?: IQuaternion): IQuaternion {
      return array_copy(q, dest || array_create(LENGTH))
    }
    
    export function dot(q1: IQuaternion, q2: IQuaternion): number {
      return array_dot(q1, q2)
    }
    
    export function identity(dest?: IQuaternion): IQuaternion {
      return array_copy(IDENTITY, dest || array_create(LENGTH))
    }
    
    export function invert(q: IQuaternion, dest?: IQuaternion): IQuaternion {
      var q0 = q[0], q1 = q[1], q2 = q[2], q3 = q[3]
      var dot = q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3
      var invDot = dot ? 1.0/dot : 0
      
      // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
      dest = dest || array_create(LENGTH)
      dest[0] = -q0 * invDot
      dest[1] = -q1 * invDot
      dest[2] = -q2 * invDot
      dest[3] = q3 * invDot
      return dest
    }
    
    export function length(q: IQuaternion): number {
      return array_frob(q)
    }
    
    export function lengthSquared(q: IQuaternion): number {
      return array_frob_squared(q)
    }
    
    export function multiply(a: IQuaternion, b: IQuaternion, dest?: IQuaternion): IQuaternion {
      var ax = a[0], ay = a[1], az = a[2], aw = a[3]
      var bx = b[0], by = b[1], bz = b[2], bw = b[3]
  
      dest = dest || array_create(4)
      dest[0] = ax * bw + aw * bx + ay * bz - az * by
      dest[1] = ay * bw + aw * by + az * bx - ax * bz
      dest[2] = az * bw + aw * bz + ax * by - ay * bx
      dest[3] = aw * bw - ax * bx - ay * by - az * bz
      return dest
    }
    
    export function normalize(q: IQuaternion, dest?: IQuaternion): IQuaternion {
      return array_normalize(q, dest || array_create(LENGTH))
    }
    
    export function subtract(q1: IQuaternion, q2: IQuaternion, dest?: IQuaternion): IQuaternion {
      return array_subtract(q1, q2, dest || array_create(LENGTH))
    }
  }
  
  export module vector {
  
    export function create2(x: number, y: number): IVector2 {
      var v = array_create(2)
      v[0] = x
      v[1] = y
      return v
    }
    
  
    export function add<T extends IVector>(v1: T, v2: T, dest?: T): T {
      return array_add(v1, v2, dest || array_create(v1.length))
    }
    
    export function copy<T extends IVector>(v: T, dest?: T): T {
      return array_copy(v, dest || array_create(v.length))
    }
    
    export function divide<T extends IVector>(v1: T, v2: T, dest?: T): T {
      return array_divide(v1, v2, dest || array_create(v1.length))
    }
    
    export function dot<T extends IVector>(v1: T, v2: T): number {
      return array_dot(v1, v2)
    }
  
    export function length<T extends IVector>(v: T): number {
      return array_frob(v)
    }
    
    export function lengthSquared<T extends IVector>(v: T): number {
      return array_frob_squared(v)
    }
    
    export function multiply<T extends IVector>(v1: T, v2: T, dest?: T): T {
      return array_multiply(v1, v2, dest || array_create(v1.length))
    }
  
    export function negate<T extends IVector>(v: T, dest?: T): T {
      return array_negate(v, dest || array_create(v.length))
    }
  
    export function normalize<T extends IVector>(v: T, dest?: T): T {
      return array_normalize(v, dest || array_create(v.length))
    }
    
    export function scale<T extends IVector>(v: T, scalar: number, dest?: T): T {
      return array_scale(v, scalar, dest || array_create(v.length))
    }
    
    export function subtract<T extends IVector>(v1: T, v2: T, dest?: T): T {
      return array_subtract(v1, v2, dest || array_create(v1.length))
    }
    
    
  }
  
  export module matrix {
    var IDENTITY4 = [1, 0, 0, 1]
    var IDENTITY9 = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  
    export function copy<T extends IMatrix>(m: T, dest?: T): T {
      return array_copy(m, dest)
    }
    
    export function determinant<T extends IMatrix>(m: T): number {
      var returnValue = NaN
      switch(m.length) {
        case 4:
          returnValue = m[0] * m[3] - m[2] * m[1]
          break
          
        case 9:
          var m00 = m[0], m01 = m[1], m02 = m[2]
          var m10 = m[3], m11 = m[4], m12 = m[5]
          var m20 = m[6], m21 = m[7], m22 = m[8]

          returnValue = m00 * (m22 * m11 - m12 * m21) + m01 * (-m22 * m10 + m12 * m20) + m02 * (m21 * m10 - m11 * m20)
          break
        default:
          throw new TypeError()
      }
      return returnValue
    }
     
    export function frob<T extends IMatrix>(m: T): number {
      return array_frob(m)
    }
    
    export function identity<T extends IMatrix>(dest: T): T {
      switch(dest.length) {
        case 4: 
          array_copy(IDENTITY4, dest)
          break
        case 9:
          array_copy(IDENTITY9, dest)
          break
        default:
          for (var i = 0, l = dest.length; i < l; ++i) {
          
          }
          throw new TypeError()
      }
      return dest;
    }

    export function invert<T extends IMatrix>(m: T, dest?: T): T {
      dest = dest || array_create(m.length)
        
      switch(dest.length) {
        case 4:
          var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3]
          var det = m0 * m3 - m2 * m1
          if (!det) {
            return null;
          }
          det = 1.0 / det;
          
          dest[0] =  m3 * det;
          dest[1] = -m1 * det;
          dest[2] = -m2 * det;
          dest[3] =  m0 * det;
          break
        default:
          throw new TypeError()
      }
      return dest;
    }
    
    function multiply<T extends IMatrix>(a: T, b: T, dest?: T): T {
      dest = dest || array_create(a.length)
        
      switch(a.length) {
        case 4:
          var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
          var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
          dest[0] = a0 * b0 + a2 * b1
          dest[1] = a1 * b0 + a3 * b1
          dest[2] = a0 * b2 + a2 * b3
          dest[3] = a1 * b2 + a3 * b3
          break
        default:
          throw new TypeError()
      }
      
      return dest;
    }
    
    function rotate<T extends IMatrix>(m: T, rad: number, dest?: T): T {
      dest = dest || array_create(m.length)
        
      switch(m.length) {
        case 4:
          var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3]
          var sin = Math.sin(rad)
          var cos = Math.cos(rad)
          dest[0] = m0 *  cos + m2 * sin
          dest[1] = m1 *  cos + m3 * sin
          dest[2] = m0 * -sin + m2 * cos
          dest[3] = m1 * -sin + m3 * cos
          break
        default:
          throw new TypeError()
      }
          
      return dest;
    }

    function scale<IMatrix4>(m: IMatrix4, v: IVector4, dest?: IMatrix3): IMatrix3
    function scale<IMatrix3>(m: IMatrix3, v: IVector3, dest?: IMatrix3): IMatrix3
    function scale<IMatrix2>(m: IMatrix2, v: IVector2, dest?: IMatrix2): IMatrix2
    function scale(m: any, v: any, dest?: any): any {
      dest = dest || array_create(m.length)
      
      switch(m.length) {
        case 4:
          var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3]
          var v0 = v[0], v1 = v[1]
          dest[0] = m0 * v0
          dest[1] = m1 * v0
          dest[2] = m2 * v1
          dest[3] = m3 * v1
          break
        default:
          throw new TypeError()
      }
      return dest;
    }
    
    function transpose<T extends IMatrix>(m: T, dest?: T): T {
      dest = dest || array_create(m.length)
        
      switch(m.length) {
        case 4:
          // If we are transposing ourselves we can skip a few steps but have to cache some values
          if (dest === m) {
            var m1 = m[1]
            dest[1] = m[2]
            dest[2] = m1
          } else {
            dest[0] = m[0]
            dest[1] = m[2]
            dest[2] = m[1]
            dest[3] = m[3]
          }
          break
        default:
          throw new TypeError()
      }
      return dest
    }
  }
  
  //array util
  var Float32Array: any = (typeof Float32Array !== 'undefined') ? Float32Array : Array
    
  var $context: {[key:string]: any} = {
    "math_sqrt": math_sqrt
  }
  var $if = macro.$if
  var $else = macro.$else
  var $assign = macro.$assign
  var $attr = macro.$attr
  var $fora = function (arrayExpr: string, each: (i: string, l: string) => string): string {
    var l = $name('l')
    var returnValue = $var(l, arrayExpr + '.length') 
    var forDefault = macro.$fori("0", l, "1", (i) => { return each(i, l) })
    var unrollValues = [2, 3, 4, 9, 16]
    if (unrollValues) {
      returnValue += macro.$switch(
        l, 
        unrollValues.map((l) => {
          var lenExpr = String(l)
          var caseExpr = ''
          for (var current = 0; current < l; ++current) {
            caseExpr += each(String(current), lenExpr)
          }
          return macro.$case(lenExpr, caseExpr)
        }),
        forDefault
      )
    } else {
      returnValue = forDefault
    }
    return returnValue
  }

  var $indent = macro.$indent
  var $op = macro.$op
  var $name = macro.$name
  var $return = macro.$return
  var $var = macro.$var

  
  function $object_assign(objectExpr, attrExpr, valueExpr) {
    return $assign($attr(objectExpr, attrExpr), valueExpr)
  }

  //specific
  function $array_op(op: string, a: string, b: string, dest: string): string {
    return (
      $fora(a, (i: string, l: string) => {
        return $object_assign(dest, i, $op($attr(a, i), op, $attr(b, i)))
      }) //length expression
    )
  }
  
  function $array_copy(a: string, ret: string): string {
    return (
      $if($op(a, '!==', ret),
        $fora(a, (i: string, l: string) => {
          return $object_assign(ret, i, $attr(a, i))
        })
      )
    )
  }
  
  function $array_frob_squared(a: string, ret: string): string {
    var val = $name(a + '_')
    return (
      $var(val) + 
      $assign(ret, '0') +
      $fora(a, (i: string, l: string) => {
        return (
          $assign(val, $attr(a, i)) + 
          '\n' + $op(ret, '+=', $op(val, '*', val)) + ';'
        )
      })
    )
  }
  
  function $array_frob(a: string, ret: string): string {
    return (
      $array_frob_squared(a, ret) +
      $assign(ret, 'math_sqrt(' + ret + ')')
    )
  }
  
  function $array_dot(a: string, b: string, ret: string): string {
    return (
      $assign(ret, '0') +
      $if($op(a, '===', b), $array_frob_squared(a, ret)) +
      $else(
        $fora(a, (i: string, l: string) => {
          return '\n' + $op(ret, '+=', $op($attr(a, i), '*', $attr(b, i))) + ';'
        })
      )
    )
  }
  
  function $array_negate(a: string, ret: string): string {
    return $array_scale(a, '-1', ret)
  }
  
  function $array_normalize(a: string, ret: string): string {
    var len = $name()
    return (
      $var(len) +
      $array_frob(a, len) + 
      $assign(len, $op('1', '/', len)) +
      $array_scale(a, len, ret)
    )
  }
  
  function $array_scale(a: string, scalar: string, ret: string): string {
    return (
      $fora(a, (i: string, l: string) => {
        return $object_assign(ret, i, $op($attr(a, i), '*', scalar))
      })
    )
  }
  
  function array_create(l: number) {
    return new Float32Array(l)
  }

  var array_add = macro.compile((a, b, r) => { return $array_op('+', a, b, r) + $return(r) }, $context)
  var array_cmp = macro.compile((a, b) => { 
    var r = $name()
    
    return (
      $fora(a, (i: string, l: string) => {
        //return '||'  + $op($attr(a, i), '-', $attr(b, i))
        
        
        return (
          $assign(r, $op($attr(a, i), '-', $attr(b, i))) +
          $if($op(r, '==', '0'), 'break')
        )
      }) + 
      $return(r)
    )
  }, $context)
  var array_multiply = macro.compile((a, b, r) => { return $array_op('*', a, b, r) + $return(r) }, $context)
  var array_subtract = macro.compile((a, b, r) => { return $array_op('-', a, b, r) + $return(r) }, $context)
  var array_divide = macro.compile((a, b, r) => { return $array_op('/', a, b, r) + $return(r) }, $context)
  var array_copy: (a, dest) => any = macro.compile((a, r) => { return $array_copy(a, r) + $return(r) }, $context)
  
  var array_dot = macro.compile((a, b) => { return $array_dot(a, b, 'r') + $return('r') }, $context)
  var array_frob_squared = macro.compile((a) => { return $var('r') + $array_frob_squared(a, 'r') + $return('r') }, $context)
  var array_frob = macro.compile((a) => { return $var('r') + $array_frob(a, 'r') + $return('r') }, $context)
  var array_normalize = macro.compile((a, r) => { return $array_normalize(a, r) + $return(r) }, $context)
  var array_negate = macro.compile((a, r) => { return $array_negate(a, r) + $return(r) }, $context)
  var array_scale = macro.compile((a, scalar, r) => { return $array_scale(a, scalar, r) + $return(r) }, $context)

}
export = geometry