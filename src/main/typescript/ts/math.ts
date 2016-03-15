// Util
const global: any = typeof window !== "undefined" ? window : (function() { return this; }());
const ONE_THIRD = 1 / 3;
const RADIAN_TO_DEGREE = 180 / Math.PI;
const DEGREE_TO_RADIAN = 1 / RADIAN_TO_DEGREE;

function ToNumber(o: any) { return Number(o); }
function IsNaN(n: number) { return n !== n; };
function IsFinite(o: any) { return global.isFinite(o); }
const math_acos = Math.acos;
const math_asin = Math.asin;
const math_atan = Math.atan;
const math_atan2 = Math.atan2;
// const math_eq = (l: number, r: number) => { return IsNaN(l) === IsNaN(r) && l == r }
const math_abs = Math.abs;
const math_ceil = Math.ceil;
const math_cos = Math.cos;
const math_clz32 = Math["clz32"] || function (n) {
  n = ToNumber(n) >>> 0;
  return n ? 32 - n.toString(2).length : 32;
};
const math_exp = Math.exp;
const math_expm1 = Math["expm1"] || function (n) {
  n = ToNumber(n);
  return (
    n === -Infinity ? -1 :
    (IsFinite(n) || n === 0) ? n :
    math_exp(n) - 1
  );
};
const math_floor = Math.floor;
const math_hypot = Math["hypot"];
const math_imul = Math["imul"] || function (a, b) {
  // polyfill from mozilla
  a = a >>> 0;
  b = b >>> 0;
  let ah = (a >>> 16) & 0xffff;
  let al = a & 0xffff;
  let bh = (b >>> 16) & 0xffff;
  let bl = b & 0xffff;
  // the shift by 0 fixes the sign on the high part
  // the final |0 converts the unsigned value into a signed value
  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
};
const math_log = Math.log;
const math_log2 = Math["log2"] || function (n) { return math_log(n) * LOG2E; };
const math_log10 = Math["log10"] || function (n) { return math_log(n) * LOG10E; };
const math_log1p = Math["log1p"] || function (n) { return math_log(1 + n); };
const math_pow = Math.pow;
const math_round = Math.round;
const math_sign = Math["sign"] || function (n) { return IsNaN(n) ? n : n > 0 ? 1 : n < 0 ? -1 : 0; };
const math_sin = Math.sin;
const math_sqrt = Math.sqrt;
const math_cbrt = Math["cbrt"] || function (n) {
  n = ToNumber(n);
  return (
    n === 0 ? n :
    n < 0 ? -math_pow(-n, ONE_THIRD) :
    math_pow(n, ONE_THIRD)
  );
};
const math_tan = Math.tan;
const math_trunc = Math["trunc"] || function (n) { return n > 0 ? math_floor(n) : math_ceil(n); };
const math_acosh = Math["acosh"] || function (n) {
  n = ToNumber(n);
  return (
    IsNaN(n) || n < 1 ? NaN :
    n === 1 ? 0 :
    n === Infinity ? n :
    math_log(n + math_sqrt(n * n - 1))
  );
};
const math_asinh = Math["asinh"] || function (n) {
  n = ToNumber(n);
  return (
    n === 0 || !IsFinite(n) ? n :
    n < 0 ? -math_asinh(-n) :
    math_log(n + math_sqrt(n * n + 1))
  );
};
const math_cosh = Math["cosh"] || function (n) {
  n = ToNumber(n);
  return (
    n === 0 ? 1 :
    IsNaN(n) ? n :
    !IsFinite(n) ? Infinity :
    n < 0 ? math_cosh(n) :
    n > 21 ? math_exp(n) / 2 :
    math_exp(n) + math_exp(-n) / 2
  );
};
const math_atanh = Math["atanh"] || function (n) {
  n = ToNumber(n);
  return (
    IsNaN(n) || n < -1 || n > 1 ? NaN :
    n === -1 ? -Infinity :
    n === 1 ? Infinity :
    n === 0 ? n :
    0.5 * math_log((1 + n) / (1 - n))
  );
};
const math_sinh = Math["sinh"] || function (n) {
  n = ToNumber(n);
  return (
    !IsFinite(n) || n === 0 ? n :
    (math_exp(n) - math_exp(-n)) / 2
  );
};
const math_tanh = Math["tanh"] || function (n) {
  n = ToNumber(n);
  let exp, nexp;
  return (
    IsNaN(n) || n === 0 ? n :
    n === Infinity ? 1 :
    n === -Infinity ? -1 :
    ((exp = math_exp(n)) - (nexp = math_exp(-n))) / (exp + nexp)
  );
};

export const E = Math.E;
export const LN10 = Math.LN10;
export const LN2 = Math.LN2;
export const LOG2E = Math.LOG2E;
export const LOG10E = Math.LOG10E;
export const PI = Math.PI;
export const TAU = PI * 2;
export const PHI = (1 + math_sqrt(5)) / 2;
export const SQRT1_2 = Math.SQRT1_2;
export const SQRT2 = Math.SQRT2;
// export const Infinity = window.Infinity;

export function abs(n: number): number {
  return math_abs(n);
}

export function acos(n: number): number {
  return math_acos(n);
}

export function acosh(n: number): number {
  return math_acosh(n);
}

export function asin(n: number): number {
  return math_asin(n);
}

export function asinh(n: number): number {
  return math_asinh(n);
}

export function atan(n: number): number {
  return math_atan(n);
}

export function atanh(n: number): number {
  return math_atanh(n);
}

export function cbrt(n: number): number {
  return math_cbrt(n);
}

export function clz32(n: number): number {
  return math_clz32(n);
}

export function ceil(n: number): number {
  return math_ceil(n);
}

export function cos(n: number): number {
  return math_cos(n);
}

export function cosh(n: number): number {
  return math_cosh(n);
}

export function exp(n: number): number {
  return math_exp(n);
}

export function expm1(n: number): number {
  return math_expm1(n);
}

export function floor(n: number): number {
  return math_floor(n);
}

export function hypot(...args: number[]): number {
  // See: http://mzl.la/1HDi6xP
  let n = 0;
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
  return math_round(n) == n;
}

export function imul(a: number, b: number): number {
  return math_imul(a, b);
}

export function isNaN(n: number): boolean {
  return IsNaN(n);
}

export function isNatural(n: number): boolean {
  return n >= 0 && math_round(n) == n;
}

export function isOdd(n: number): boolean {
  return !IsNaN(n) && IsFinite(n) && ((n % 2) !== 0);
}

export function isPrime(n: number): boolean {
  let returnValue = false;
  if (!IsNaN(n)) {
    returnValue = true;
    for (let i = 2, l = math_sqrt(n); i <= l; i++) {
      if (n % i === 0) {
        returnValue = false;
        break;
      }
    }
  }
  return returnValue;
}

export function log(n: number): number {
  return math_log(n);
}

export function log2(n: number): number {
  return math_log2(n);
}

export function log10(n: number): number {
  return math_log10(n);
}

export function log1p(n: number): number {
  return math_log1p(n);
}

export function mod(n: number, divisor: number): number {
  return (
    divisor > 0 ? n - divisor * math_floor(n / divisor) :
    divisor == 0 ? n :
    NaN
  );
}

export function pow(n: number, power: number): number {
  return math_pow(n, power);
}

export function round(n: number): number {
  return math_round(n);
}

export function sign(n: number): number {
  return math_sign(n);
}

export function sin(n: number): number {
  return math_sin(n);
}

export function sinh(n: number): number {
  return math_sinh(n);
}

export function sqrt(n: number): number {
  return math_sqrt(n);
}

export function tan(n: number): number {
  return math_tan(n);
}

export function tanh(n: number): number {
  return math_tanh(n);
}

export function toDegree(angleRadian: number): number {
  return angleRadian * RADIAN_TO_DEGREE;
}

export function toRadian(angleDegree: number): number {
  return angleDegree * DEGREE_TO_RADIAN;
}

export function trunc(n: number): number {
  return math_trunc(n);
}
