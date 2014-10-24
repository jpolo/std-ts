module math {
  
  var ONE_THIRD = 1 / 3
  var RADIAN_TO_DEGREE = 180 / Math.PI
  var DEGREE_TO_RADIAN = 1 / RADIAN_TO_DEGREE
  
  var num = Number
  var isNaN = (n: number) => { return n !== n }
  var math_acos = Math.acos
  var math_asin = Math.asin
  var math_atan = Math.atan
  var math_atan2 = Math.atan2
  var math_eq = (l: number, r: number) => { return isNaN(l) === isNaN(r) && l == r }
  var math_abs = Math.abs
  var math_ceil = Math.ceil
  var math_cos = Math.cos
  var math_clz32 = function (n) { n = num(n) >>> 0; return n ? 32 - n.toString(2).length : 32 }
  var math_exp = Math.exp
  var math_expm1 = Math['expm1'] || function (n) {
    n = num(n)
    return (
      n === -Infinity ? -1 :
      (isFinite(n) || n === 0) ? n :
      math_exp(n) - 1
    )
  }
  var math_floor = Math.floor
  var math_log = Math.log
  var math_log2 = Math['log2'] || function (n) { return math_log(n) * LOG2E }
  var math_log10 = Math['log10'] || function (n) { return math_log(n) * LOG10E }
  var math_pow = Math.pow
  var math_round = Math.round
  var math_sign = Math['sign'] || function (n) { return isNaN(n) ? n : n > 0 ? 1 : n < 0 ? -1 : 0 }
  var math_sin = Math.sin
  var math_sqrt = Math.sqrt
  var math_cbrt = Math['cbrt'] || function (n) {
    n = num(n)
    return (
      n === 0 ? n :
      n < 0 ? -math_pow(-n, ONE_THIRD) :
      math_pow(n, ONE_THIRD)
    )
  }     
  var math_tan = Math.tan
  var math_trunc = Math['trunc'] || function (n) { return n > 0 ? math_floor(n) : math_ceil(n) } 
  var math_acosh = Math['acosh'] || function (n) {
    n = num(n)
    return (
      isNaN(n) || n < 1 ? NaN :
      n === 1 ? 0 :
      n === Infinity ? n :
      math_log(n + math_sqrt(n * n - 1))
    )
  }
  var math_asinh = Math['asinh'] || function (n) {
    n = num(n)
    return (
      n === 0 || !isFinite(n) ? n :
      n < 0 ? -math_asinh(-n) : 
      math_log(n + math_sqrt(n * n + 1))
    )
  }
  var math_cosh = Math['cosh'] || function (n) {
    n = num(n)
    return (
      n === 0 ? 1 :
      isNaN(n) ? n :
      !isFinite(n) ? Infinity :
      n < 0 ? math_cosh(n) :
      n > 21 ? math_exp(n) / 2 :
      math_exp(n) + math_exp(-n) / 2
    )
  }
  var math_atanh = Math['atanh'] || function (n) {
    n = num(n)
    return (
      isNaN(n) || n < -1 || n > 1 ? NaN :
      n === -1 ? -Infinity :
      n === 1 ? Infinity :
      n === 0 ? n :
      0.5 * math_log((1 + n) / (1 - n))
    )
  }
  var math_sinh = Math['sinh'] || function (n) {
    n = num(n)
    return (
      !isFinite(n) || n === 0 ? n :
      (math_exp(n) - math_exp(-n)) / 2
    )
  }
  var math_tanh = Math['tanh'] || function (n) {
    n = num(n)
    var exp, nexp
    return (
      isNaN(n) || n === 0 ? n :
      n === Infinity ? 1 :
      n === -Infinity ? -1 :
      ((exp = math_exp(n)) - (nexp = math_exp(-n))) / (exp + nexp)
    )
  }
  
  export var E = Math.E
  export var LN10 = Math.LN10
  export var LN2 = Math.LN2
  export var LOG2E = Math.LOG2E
  export var LOG10E = Math.LOG10E
  export var PI = Math.PI
  export var TAU = PI * 2
  export var PHI = (1 + math_sqrt(5)) /2
  export var SQRT1_2 = Math.SQRT1_2
  export var SQRT2 = Math.SQRT2
  export var Infinity = Infinity

  
  export function abs(n: number): number {
    return math_abs(n)
  }
  
  export function acos(n: number): number {
    return math_acos(n)
  }
  
  export function acosh(n: number): number {
    return math_acosh(n)
  }
  
  export function asin(n: number): number {
    return math_asin(n)
  }
  
  export function asinh(n: number): number {
    return math_asinh(n)
  }
  
  export function atan(n: number): number {
    return math_atan(n)
  }
  
  export function atanh(n: number): number {
    return math_atanh(n)
  }
  
  export function cbrt(n: number): number {
    return math_cbrt(n)
  }
  
  export function clz32(n: number): number {
    return math_clz32(n)
  }
  
  export function ceil(n: number): number {
    return math_ceil(n)
  }
  
  export function cos(n: number): number {
    return math_cos(n)
  }
  
  export function cosh(n: number): number {
    return math_cosh(n)
  }
  
  export function exp(n: number): number {
    return math_exp(n)
  }
  
  export function expm1(n: number): number {
    return math_expm1(n)
  }
  
  export function floor(n: number): number {
    return math_floor(n)
  }
  
  export function isEven(n: number): boolean {
    return !(n & 1)
  }
  
  export function isInteger(n: number): boolean {
    return math_round(n) == n
  }
  
  export function isNatural(n: number): boolean {
    return n >= 0 && math_round(n) == n
  }
  
  export function isOdd(n: number): boolean {
    return !!(n & 1)
  }
  
  export function isPrime(n: number): boolean {
    var returnValue = false
    if (!isNaN(n)) {
      returnValue = true
      for (var i = 2, l = math_sqrt(n); i <= l; i++) {
        if (n % i === 0) {
          returnValue = false
          break
        }
      }
    }
    return returnValue
  }
  
  export function log(n: number): number {
    return math_log(n)
  }
  
  export function log2(n: number): number {
    return math_log2(n)
  }
  
  export function log10(n: number): number {
    return math_log10(n)
  }
  
  export function mod(n: number, divisor: number): number {
    return (
      divisor > 0 ? n - divisor * math_floor(n / divisor) :
      divisor == 0 ? n :
      NaN
    )
  }
  
  export function pow(n: number, power: number): number {
    return math_pow(n, power)
  }
  
  export function round(n: number): number {
    return math_round(n)
  }
  
  export function sign(n: number): number {
    return math_sign(n)
  }
  
  export function sin(n: number): number {
    return math_sin(n)
  }
  
  export function sinh(n: number): number {
    return math_sinh(n)
  }
  
  export function sqrt(n: number): number {
    return math_sqrt(n)
  }
  
  export function tan(n: number): number {
    return math_tan(n)
  }
  
  export function tanh(n: number): number {
    return math_tanh(n)
  }
  
  export function toDegree(angleRadian: number): number {
    return angleRadian * RADIAN_TO_DEGREE
  }
  
  export function toRadian(angleDegree: number): number {
    return angleDegree * DEGREE_TO_RADIAN
  }
  
  export function trunc(n: number): number {
    return math_trunc(n)
  }
 
  

}
export = math