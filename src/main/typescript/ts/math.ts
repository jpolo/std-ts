//Constant
const ES_COMPAT = 3;

//Util
const ONE_THIRD = 1 / 3
const RADIAN_TO_DEGREE = 180 / Math.PI
const DEGREE_TO_RADIAN = 1 / RADIAN_TO_DEGREE

const __num = Number;
const __isNaN = (n: number) => { return n !== n; };
const __isFinite = isFinite;
var math_acos = Math.acos;
var math_asin = Math.asin;
var math_atan = Math.atan;
var math_atan2 = Math.atan2;
var math_eq = (l: number, r: number) => { return __isNaN(l) === __isNaN(r) && l == r }
var math_abs = Math.abs;
var math_ceil = Math.ceil;
var math_cos = Math.cos; 
var math_clz32 = Math['clz32'];
var math_exp = Math.exp;
var math_expm1 = Math['expm1'];
var math_floor = Math.floor;
var math_hypot = Math['hypot'];
var math_imul = Math['imul'];
var math_log = Math.log;
var math_log2 = Math['log2'];
var math_log10 = Math['log10'];
var math_log1p = Math['log1p'];
var math_pow = Math.pow;
var math_round = Math.round;
var math_sign = Math['sign'];
var math_sin = Math.sin;
var math_sqrt = Math.sqrt;
var math_cbrt = Math['cbrt'];    
var math_tan = Math.tan;
var math_trunc = Math['trunc'];
var math_acosh = Math['acosh'];
var math_asinh = Math['asinh'];
var math_cosh = Math['cosh'];
var math_atanh = Math['atanh'];
var math_sinh = Math['sinh'];
var math_tanh = Math['tanh'];

//Compat
if (ES_COMPAT <= 3) {
  //nothing
}
if (ES_COMPAT <= 5) {
  math_cbrt = math_cbrt || function (n) {
    n = __num(n);
    return (
      n === 0 ? n :
      n < 0 ? -math_pow(-n, ONE_THIRD) :
      math_pow(n, ONE_THIRD)
    );
  };
  math_clz32 = math_clz32 || function (n) { 
    n = __num(n) >>> 0; 
    return n ? 32 - n.toString(2).length : 32 
  };
  math_expm1 = math_expm1 || function (n) {
    n = __num(n);
    return (
      n === -Infinity ? -1 :
      (__isFinite(n) || n === 0) ? n :
      math_exp(n) - 1
    );
  };
  math_imul = math_imul || function (a, b) {
    //polyfill from mozilla
    a = a >>> 0;
    b = b >>> 0;
    var ah = (a >>> 16) & 0xffff;
    var al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff;
    var bl = b & 0xffff;
    // the shift by 0 fixes the sign on the high part
    // the final |0 converts the unsigned value into a signed value
    return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
  };
  math_log2 = math_log2 || function (n) { return math_log(n) * LOG2E };
  math_log10 = math_log10 || function (n) { return math_log(n) * LOG10E };
  math_log1p = math_log1p || function (n) { return math_log(1 + n); };
  math_sign = math_sign || function (n) { return __isNaN(n) ? n : n > 0 ? 1 : n < 0 ? -1 : 0 };
  math_trunc = math_trunc || function (n) { return n > 0 ? math_floor(n) : math_ceil(n); };
  math_acosh = math_acosh || function (n) {
    n = __num(n);
    return (
      __isNaN(n) || n < 1 ? NaN :
      n === 1 ? 0 :
      n === Infinity ? n :
      math_log(n + math_sqrt(n * n - 1))
    );
  };
  math_asinh = math_asinh || function (n) {
    n = __num(n);
    return (
      n === 0 || !__isFinite(n) ? n :
      n < 0 ? -math_asinh(-n) : 
      math_log(n + math_sqrt(n * n + 1))
    );
  };
  math_cosh = math_cosh || function (n) {
    n = __num(n);
    return (
      n === 0 ? 1 :
      __isNaN(n) ? n :
      !__isFinite(n) ? Infinity :
      n < 0 ? math_cosh(n) :
      n > 21 ? math_exp(n) / 2 :
      math_exp(n) + math_exp(-n) / 2
    );
  };
  math_atanh = math_atanh || function (n) {
    n = __num(n);
    return (
      __isNaN(n) || n < -1 || n > 1 ? NaN :
      n === -1 ? -Infinity :
      n === 1 ? Infinity :
      n === 0 ? n :
      0.5 * math_log((1 + n) / (1 - n))
    );
  };
  math_sinh = math_sinh || function (n) {
    n = __num(n);
    return (
      !__isFinite(n) || n === 0 ? n :
      (math_exp(n) - math_exp(-n)) / 2
    );
  };
  math_tanh = math_tanh || function (n) {
    n = __num(n);
    var exp, nexp;
    return (
      __isNaN(n) || n === 0 ? n :
      n === Infinity ? 1 :
      n === -Infinity ? -1 :
      ((exp = math_exp(n)) - (nexp = math_exp(-n))) / (exp + nexp)
    );
  };
}


export const E = Math.E
export const LN10 = Math.LN10
export const LN2 = Math.LN2
export const LOG2E = Math.LOG2E
export const LOG10E = Math.LOG10E
export const PI = Math.PI
export const TAU = PI * 2
export const PHI = (1 + math_sqrt(5)) /2
export const SQRT1_2 = Math.SQRT1_2
export const SQRT2 = Math.SQRT2
export const Infinity = Infinity

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

export function hypot(...args: number[]): number {
  // See: http://mzl.la/1HDi6xP
  var n = 0;
  for (let arg of args) {
    if (arg === Infinity || arg === -Infinity) {
      return Infinity;
    }
    n += arg * arg;
  }
  return math_sqrt(n);
}

export function isEven(n: number): boolean {
  return (n % 2) === 0;
}

export function isInteger(n: number): boolean {
  return math_round(n) == n
}

export function imul(a: number, b: number): number {
  return math_imul(a, b);
}

export function isNaN(n: number): boolean {
  return __isNaN(n);  
}

export function isNatural(n: number): boolean {
  return n >= 0 && math_round(n) == n
}

export function isOdd(n: number): boolean {
  return !__isNaN(n) && __isFinite(n) && ((n % 2) !== 0);
}

export function isPrime(n: number): boolean {
  var returnValue = false
  if (!__isNaN(n)) {
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

export function log1p(n: number): number {
  return math_log1p(n);
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