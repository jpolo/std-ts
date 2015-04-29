import vector = require('ts/geometry/vector')
import matrix_ = require('ts/geometry/matrix')
import codegen = require('ts/codegen')
import cc = codegen.compile
import $if = codegen.$if
import $else = codegen.$else
import $assign = codegen.$assign
import $attr = codegen.$attr
import $case = codegen.$case
import $indent = codegen.$indent
import $op = codegen.$op
import $name = codegen.$name
import $return = codegen.$return
import $switch = codegen.$switch
import $var = codegen.$var

module geometry {
  var SIZES = [2, 3, 4, 9, 16]
  var math_cos = Math.cos
  var math_floor = Math.floor
  var math_sin = Math.sin
  var math_sqrt = Math.sqrt
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array    
  var $context: {[key:string]: any} = {
    "math_cos": math_cos,
    "math_floor": math_floor,
    "math_sin": math_sin,
    "math_sqrt": math_sqrt
  }
  
  export interface IMatrix { length: number; 0: number; 1: number; 2: number; 3: number; }
  export interface IMatrix2 extends IMatrix { }
  export interface IMatrix3 extends IMatrix2 { 4: number; 5: number; 6: number; 7: number; 8: number; }
  export interface IMatrix4 extends IMatrix3 { 9: number; 10: number; 11: number; 12: number; 13: number; 14: number; 15: number; }
  
  export module matrix {
    var MATRIX_SIZE = [4, 9, 16]
    
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
      var argc = arguments.length
      var v = array_create(argc)
      for (var i = 0; i < argc; ++i) {
        v[i] = arguments[i]
      }
      return v
    }
  
    export var copy = matrix_.copy;
    export var determinant = matrix_.determinant;

    export function frob<T extends IMatrix>(m: T): number {
      return array_frob(m)
    }
    
    export function identity<T extends IMatrix>(dest: T): T {
      return mat_identity(dest)
    }

    export function invert<T extends IMatrix>(m: T, dest?: T): T {
      dest = dest || array_create(m.length)
        
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
      return dest;
    }
    
    export function multiply<T extends IMatrix>(a: T, b: T, dest?: T): T {
      return mat_multiply(a, b, dest || array_create(a.length))
    }
    
    function rotate<T extends IMatrix>(m: T, rad: number, dest?: T): T {
      dest = dest || array_create(m.length)
        
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
          
      return dest;
    }

    export function scale<IMatrix4>(m: IMatrix4, v: vector.IVector4, dest?: IMatrix4): IMatrix4
    export function scale<IMatrix3>(m: IMatrix3, v: vector.IVector3, dest?: IMatrix3): IMatrix3
    export function scale<IMatrix2>(m: IMatrix2, v: vector.IVector2, dest?: IMatrix2): IMatrix2
    export function scale(m: any, v: any, dest?: any): any {
      return mat_scale(m, v, dest || array_create(m.length))
    }
    
    export function transpose<T extends IMatrix>(m: T, dest?: T): T {
      return mat_transpose(m, dest || array_create(m.length));
    }
    
    function _index(col: number, row: number, size: number) {
      return (row * size + col)
    }
    
    /*function $mat_det(m: string, size: number): string {
      switch(size) {
        case 2:
          return m[0] * m[3] - m[2] * m[1]
        //case 3:
          var m00 = m[0], m01 = m[1], m02 = m[2]
          var m10 = m[3], m11 = m[4], m12 = m[5]
          var m20 = m[6], m21 = m[7], m22 = m[8]

          returnValue = m00 * (m22 * m11 - m12 * m21) + m01 * (-m22 * m10 + m12 * m20) + m02 * (m21 * m10 - m11 * m20)
      }
      return ''
    }*/
    
    function $mat_gen(
      m: string, 
      f: (size?: number) => any
    ) {
      var l = $name('l')

      return (
        $var(l, m + '.length') +
        $switch(l, MATRIX_SIZE.map((l) => 
          $case(String(l), f(math_sqrt(l)))
        ))
      )
    }
    
    function $mat_identity(ret: string) {
      return $mat_gen(ret, (size: number) => {
        var returnValue = ''
        for (var row = 0; row < size; ++row) {
          for (var col = 0; col < size; ++col) {
            var i = _index(col, row, size)
            returnValue += $assign($attr(ret, String(i)), col === row ? '1' : '0') 
          }
        }
        return returnValue
      })
    }
    
    function $mat_multiply(a: string, b: string, ret: string) {
      return $mat_gen(a, (size: number) => {
        var length = size * size
        var head = ''
        var body = ''
          
        for (var i = 0; i < length; ++i) {
          head += $var(a + '_' + i, $attr(a, String(i)))
          head += $var(b + '_' + i, $attr(b, String(i)))
        }
        
        for (var row = 0; row < size; ++row) {
          for (var col = 0; col < size; ++col) {
            var index = _index(col, row, size)
            var parts = []
            for (var lambda = 0; lambda < size; ++lambda) {
              var ai = lambda * size + col
              var bi = row * size + lambda
              parts.push($op(a + '_' + ai, '*', b + '_' + bi))
            }
            
            body += $assign($attr(ret, String(index)), parts.join(' + '))
          }
        }
        
        return head + body
      })
    }
    
    function $mat_scale(m: string, v, ret: string) {
      return $mat_gen(m, (size: number) => {
        var head = ''
        var body = ''
          
        for (var i = 0; i < size; ++i) {
          head += $var(v + '_' + i, $attr(v, String(i)))
        }
        
        for (var row = 0; row < size; ++row) {
          for (var col = 0; col < size; ++col) {
            var index = _index(col, row, size)
            var indexStr = String(index)
            body += $assign(
              $attr(ret, indexStr), 
              $op($attr(ret, indexStr), '*', v + '_' + row)
            )
          }
        }
        return head + body
      })
    }
    
    function $mat_transpose(m: string, ret: string) {
      var tmp = $name('tmp')
      
      function gen(isEqual: boolean) {
        return function (size: number) {
          var returnValue = ''
          for (var row = 0; row < size; ++row) {
            for (var col = 0; col < size; ++col) {
              var index = _index(col, row, size)
              var transIndex = _index(row, col, size)
              var indexStr = String(index)
              var transIndexStr = String(transIndex)
              
              if (row < col) {                
                returnValue += $assign(tmp, $attr(m, indexStr))
                returnValue += $assign($attr(ret, indexStr), $attr(m, transIndexStr))
                returnValue += $assign($attr(ret, transIndexStr), tmp)
              } else if (!isEqual && row === col) {
                returnValue += $assign($attr(ret, indexStr), $attr(m, indexStr))
              }
            }
          }   
          return returnValue
        }
      }
      
      return (
        $var(tmp) +
        $if($op(m, '===', ret), $mat_gen(ret, gen(true))) +
        $else($mat_gen(ret, gen(false)))
      )
    }
    
    var mat_identity = cc((r) => $mat_identity(r) + $return(r))
    var mat_multiply = cc((a, b, r) => $mat_multiply(a, b, r) + $return(r))
    var mat_scale = cc((m, v, r) => $mat_scale(m, v, r) + $return(r))
    var mat_transpose = cc((m, r) => $mat_transpose(m, r) + $return(r))
    
//console.warn(mat_multiply.toString())
  }
  

  function $forArray(arrayExpr: string, each: (i: string, l?: string) => string): string {
    var l = $name('l')

    return (
      $var(l, arrayExpr + '.length') +
      $switch(
        l, 
        SIZES.map((l) => {
          var lenExpr = String(l)
          var caseExpr = ''
          for (var current = 0; current < l; ++current) {
            caseExpr += each(String(current), lenExpr)
          }
          return $case(lenExpr, caseExpr)
        }),
        codegen.$forRange("0", l, "1", (i) => { return each(i, l) })
      )
    )
  }
  
  //specific
  function $array_op(op: string, a: string, b: string, dest: string): string {
    return $forArray(a, (i: string) => $assign($attr(dest, i), $op($attr(a, i), op, $attr(b, i)))) //length expression
  }
  
  function $array_copy(a: string, ret: string): string {
    return $if($op(a, '!==', ret), $forArray(a, (i: string) => $assign($attr(ret, i), $attr(a, i))))
  }
  
  function $array_frob_squared(a: string, ret: string): string {
    var val = $name(a + '_')
    return (
      $var(val) + 
      $assign(ret, '0') +
      $forArray(a, (i: string) => {
        return (
          $assign(val, $attr(a, i)) + 
          '\n' + $op(ret, '+=', $op(val, '*', val)) + ';'
        )
      })
    )
  }
  
  function $array_frob(a: string, ret: string): string {
    return $array_frob_squared(a, ret) + $assign(ret, 'math_sqrt(' + ret + ')')
  }
  
  function $array_dot(a: string, b: string, ret: string): string {
    return (
      $assign(ret, '0') +
      $if($op(a, '===', b), $array_frob_squared(a, ret)) +
      $else(
        $forArray(a, (i: string) => {
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
    return $forArray(a, (i: string) => $assign($attr(ret, i), $op($attr(a, i), '*', scalar)))
  }
  
  function array_create(l: number) {
    return new Float64Array(l)
  }
  
  
  
  var array_add = cc((a, b, r) => $array_op('+', a, b, r) + $return(r), $context)
  var array_cmp = cc((a, b) => { 
    var r = $name()
    
    return (
      $forArray(a, (i: string) => {
        return (
          $assign(r, $op($attr(a, i), '-', $attr(b, i))) +
          $if($op(r, '!==', '0'), 'break')
        )
      }) + 
      $return(r)
    )
  }, $context)
  var array_multiply = cc((a, b, r) => $array_op('*', a, b, r) + $return(r), $context)
  var array_subtract = cc((a, b, r) => $array_op('-', a, b, r) + $return(r), $context)
  var array_divide = cc((a, b, r) => $array_op('/', a, b, r) + $return(r), $context)
  var array_copy: (a, dest) => any = cc((a, r) => $array_copy(a, r) + $return(r), $context)
  var array_dot = cc((a, b) => $var('r') + $array_dot(a, b, 'r') + $return('r'), $context)
  var array_frob_squared = cc((a) => $var('r') + $array_frob_squared(a, 'r') + $return('r'), $context)
  var array_frob = cc((a) => $var('r') + $array_frob(a, 'r') + $return('r'), $context)
  var array_normalize = cc((a, r) => $array_normalize(a, r) + $return(r), $context)
  var array_negate = cc((a, r) => $array_negate(a, r) + $return(r), $context)
  var array_scale = cc((a, scalar, r) => $array_scale(a, scalar, r) + $return(r), $context)
  
  
  
}
export = geometry