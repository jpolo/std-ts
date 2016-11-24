/* tslint:disable:no-bitwise */

// Constants
export const E = Math.E;
export const LN10 = Math.LN10;
export const LN2 = Math.LN2;
export const LOG2E = Math.LOG2E;
export const LOG10E = Math.LOG10E;
export const PI = Math.PI;
export const TAU = PI * 2;
export const PHI = (1 + Math.sqrt(5)) / 2;
export const SQRT1_2 = Math.SQRT1_2;
export const SQRT2 = Math.SQRT2;
// export const Infinity = window.Infinity;

// Util
const global: any = typeof window !== "undefined" ? window : (function() { return this; }());
const ONE_THIRD = 1 / 3;
const RADIAN_TO_DEGREE = 180 / Math.PI;
const DEGREE_TO_RADIAN = 1 / RADIAN_TO_DEGREE;

function ToNumber(o: any) { return Number(o); }
function IsNaN(n: number) { return n !== n; };
function IsFinite(o: any) { return global.isFinite(o); }
const MathAcos = Math.acos;
const MathAsin = Math.asin;
const MathAtan = Math.atan;
const MathAtan2 = Math.atan2;
// const Math_eq = (l: number, r: number) => { return IsNaN(l) === IsNaN(r) && l == r }
const MathAbs = Math.abs;
const MathCeil = Math.ceil;
const MathCos = Math.cos;
const MathClz32 = Math["clz32"] || function (n: number) {
  n = ToNumber(n) >>> 0;
  return n ? 32 - n.toString(2).length : 32;
};
const MathExp = Math.exp;
const MathExpm1 = Math["expm1"] || function (n: number) {
  n = ToNumber(n);
  return (
    n === -Infinity ? -1 :
    (IsFinite(n) || n === 0) ? n :
    MathExp(n) - 1
  );
};
const Math_floor = Math.floor;
const Math_imul = Math["imul"] || function (a: number, b: number) {
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
const MathLog = Math.log;
const MathLog2 = Math["log2"] || function (n: number) { return MathLog(n) * LOG2E; };
const MathLog10 = Math["log10"] || function (n: number) { return MathLog(n) * LOG10E; };
const MathLog1p = Math["log1p"] || function (n: number) { return MathLog(1 + n); };
const Math_pow = Math.pow;
const Math_round = Math.round;
const Math_sign = Math["sign"] || function (n: number) { return IsNaN(n) ? n : n > 0 ? 1 : n < 0 ? -1 : 0; };
const MathSin = Math.sin;
const MathSqrt = Math.sqrt;
const MathCbrt = Math["cbrt"] || function (n: number) {
  n = ToNumber(n);
  return (
    n === 0 ? n :
    n < 0 ? -Math_pow(-n, ONE_THIRD) :
    Math_pow(n, ONE_THIRD)
  );
};
const MathTan = Math.tan;
const MathTrunc = Math["trunc"] || function (n: number) { return n > 0 ? Math_floor(n) : MathCeil(n); };
const MathAcosh = Math["acosh"] || function (n: number) {
  n = ToNumber(n);
  return (
    IsNaN(n) || n < 1 ? NaN :
    n === 1 ? 0 :
    n === Infinity ? n :
    MathLog(n + MathSqrt(n * n - 1))
  );
};
const MathAsinh = Math["asinh"] || function (n: number) {
  n = ToNumber(n);
  return (
    n === 0 || !IsFinite(n) ? n :
    n < 0 ? -MathAsinh(-n) :
    MathLog(n + MathSqrt(n * n + 1))
  );
};
const MathCosh = Math["cosh"] || function (n: number) {
  n = ToNumber(n);
  return (
    n === 0 ? 1 :
    IsNaN(n) ? n :
    !IsFinite(n) ? Infinity :
    n < 0 ? MathCosh(n) :
    n > 21 ? MathExp(n) / 2 :
    MathExp(n) + MathExp(-n) / 2
  );
};
const MathAtanh = Math["atanh"] || function (n: number) {
  n = ToNumber(n);
  return (
    IsNaN(n) || n < -1 || n > 1 ? NaN :
    n === -1 ? -Infinity :
    n === 1 ? Infinity :
    n === 0 ? n :
    0.5 * MathLog((1 + n) / (1 - n))
  );
};
const MathSinh = Math["sinh"] || function (n: number) {
  n = ToNumber(n);
  return (
    !IsFinite(n) || n === 0 ? n :
    (MathExp(n) - MathExp(-n)) / 2
  );
};
const MathTanh = Math["tanh"] || function (n: number) {
  n = ToNumber(n);
  let exp, nexp;
  return (
    IsNaN(n) || n === 0 ? n :
    n === Infinity ? 1 :
    n === -Infinity ? -1 :
    ((exp = MathExp(n)) - (nexp = MathExp(-n))) / (exp + nexp)
  );
};

export function abs(n: number): number {
  return MathAbs(n);
}

export function acos(n: number): number {
  return MathAcos(n);
}

export function acosh(n: number): number {
  return MathAcosh(n);
}

export function asin(n: number): number {
  return MathAsin(n);
}

export function asinh(n: number): number {
  return MathAsinh(n);
}

export function atan(n: number): number {
  return MathAtan(n);
}

export function atan2(y: number, x: number): number {
  return MathAtan2(y, x);
}

export function atanh(n: number): number {
  return MathAtanh(n);
}

export function cbrt(n: number): number {
  return MathCbrt(n);
}

export function clz32(n: number): number {
  return MathClz32(n);
}

export function ceil(n: number): number {
  return MathCeil(n);
}

export function cos(n: number): number {
  return MathCos(n);
}

export function cosh(n: number): number {
  return MathCosh(n);
}

export function exp(n: number): number {
  return MathExp(n);
}

export function expm1(n: number): number {
  return MathExpm1(n);
}

export function floor(n: number): number {
  return Math_floor(n);
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
  return MathSqrt(n);
}

export function isEven(n: number): boolean {
  return (n % 2) === 0;
}

export function isInteger(n: number): boolean {
  return Math_round(n) == n;
}

export function imul(a: number, b: number): number {
  return Math_imul(a, b);
}

export function isNaN(n: number): boolean {
  return IsNaN(n);
}

export function isNatural(n: number): boolean {
  return n >= 0 && Math_round(n) == n;
}

export function isOdd(n: number): boolean {
  return !IsNaN(n) && IsFinite(n) && ((n % 2) !== 0);
}

export function isPrime(n: number): boolean {
  let returnValue = false;
  if (!IsNaN(n)) {
    returnValue = true;
    for (let i = 2, l = MathSqrt(n); i <= l; i++) {
      if (n % i === 0) {
        returnValue = false;
        break;
      }
    }
  }
  return returnValue;
}

export function log(n: number): number {
  return MathLog(n);
}

export function log2(n: number): number {
  return MathLog2(n);
}

export function log10(n: number): number {
  return MathLog10(n);
}

export function log1p(n: number): number {
  return MathLog1p(n);
}

export function mod(n: number, divisor: number): number {
  return (
    divisor > 0 ? n - divisor * Math_floor(n / divisor) :
    divisor == 0 ? n :
    NaN
  );
}

export function pow(n: number, power: number): number {
  return Math_pow(n, power);
}

export function round(n: number): number {
  return Math_round(n);
}

export function sign(n: number): number {
  return Math_sign(n);
}

export function sin(n: number): number {
  return MathSin(n);
}

export function sinh(n: number): number {
  return MathSinh(n);
}

export function sqrt(n: number): number {
  return MathSqrt(n);
}

export function tan(n: number): number {
  return MathTan(n);
}

export function tanh(n: number): number {
  return MathTanh(n);
}

export function toDegree(angleRadian: number): number {
  return angleRadian * RADIAN_TO_DEGREE;
}

export function toRadian(angleDegree: number): number {
  return angleDegree * DEGREE_TO_RADIAN;
}

export function trunc(n: number): number {
  return MathTrunc(n);
}
