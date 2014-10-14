module math {

  var isNaN = (n: number) => { return n !== n }
  var math_atan2 = Math.atan2
  var math_eq = (l: number, r: number) => { return isNaN(l) === isNaN(r) && l == r }
  var math_abs = Math.abs
  var math_ceil = Math.ceil
  var math_cos = Math.cos
  var math_exp = Math.exp
  var math_fix = (n: number) => { return n > 0 ? math_floor(n) : math_ceil(n) }
  var math_floor = Math.floor
  var math_log = Math.log
  var math_pow = Math.pow
  var math_round = Math.round
  var math_sign = (n: number) => { return n > 0 ? 1 : n < 0 ? -1 : 0 }
  var math_sin = Math.sin
  var math_sqrt = Math.sqrt
    
  enum NumType { Number, Complex, Unknown }
  
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
  
  export function abs(n: number): number
  export function abs(n: Complex): Complex
  export function abs(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex: 
        var re = n.re
        var im = n.im
        returnValue = new Complex(math_sqrt(re * re + im * im), 0)
        break
      case NumType.Number: //Number
        returnValue = math_abs(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function ceil(n: number): number
  export function ceil(n: Complex): Complex 
  export function ceil(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex: 
        returnValue = new Complex(math_ceil(n.re), math_ceil(n.im))
        break
      case NumType.Number: //Number
        returnValue = math_ceil(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function exp(n: number): number
  export function exp(n: Complex): Complex
  export function exp(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex:
        var re = n.re
        var im = n.im
        var r = math_exp(re);
        returnValue = new Complex(r * math_cos(im), r * math_sin(im))
        break
      case NumType.Number: //Number
        returnValue = math_exp(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function fix(n: number): number
  export function fix(n: Complex): Complex
  export function fix(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex:
        returnValue = new Complex(math_fix(n.re), math_fix(n.im))
        break
      case NumType.Number: //Number
        returnValue = math_fix(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }

  export function floor(n: number): number
  export function floor(n: Complex): Complex
  export function floor(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex:
        returnValue = new Complex(math_floor(n.re), math_floor(n.im))
        break
      case NumType.Number: //Number
        returnValue = math_floor(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function log(n: number): number
  export function log(n: Complex): Complex
  export function log(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex:
        var re = n.re
        var im = n.im
        returnValue = new Complex(
          math_log(math_sqrt(re * re + im * im)),
          Math.atan2(im, re)
        )
        break
      case NumType.Number: //Number
        returnValue = math_log(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function mod(n: number, divisor: number) {
    var returnValue = NaN
    if (divisor > 0) {
      returnValue = n - divisor * math_floor(n / divisor)
    } else if (divisor == 0) {
      returnValue = n
    } else { // y < 0
      throw new Error('Cannot calculate mod for a negative divisor');
    }
    return returnValue
  }
  
  export function pow(n: number, power: number): number
  export function pow(n: any, power: any): any {
    var returnValue
    switch (numType(n)) {
      /*case NumType.Complex:
        
        break*/
      case NumType.Number: //Number
        returnValue = math_pow(n, power)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function sign(n: number): number
  export function sign(n: Complex): Complex
  export function sign(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex:
        var re = n.re
        var im = n.im
        var abs = math_sqrt(re * re + im * im)
        returnValue = new Complex(re / abs, im / abs)
        break
      case NumType.Number: //Number
        returnValue = math_sign(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function round(n: number): number
  export function round(n: Complex): Complex
  export function round(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex:
        returnValue = new Complex(math_round(n.re), math_round(n.im))
        break
      case NumType.Number: //Number
        returnValue = math_round(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export function sqrt(n: number): number
  export function sqrt(n: Complex): Complex
  export function sqrt(n: any): any {
    var returnValue
    switch (numType(n)) {
      case NumType.Complex:
        var re = n.re
        var im = n.im
        var r = math_sqrt(re * re + im * im)
        var nre, nim
        if (re >= 0) {
          nre = 0.5 * math_sqrt(2.0 * (r + re));
        } else {
          nre = math_abs(im) / math_sqrt(2 * (r - re));
        }
  
        if (re <= 0) {
          nim = 0.5 * math_sqrt(2.0 * (r - re));
        } else {
          nim = math_abs(im) / math_sqrt(2 * (r + re));
        }
        returnValue = new Complex(nre, nim >= 0 ? nim : -nim)
        break
      case NumType.Number: //Number
        returnValue = math_sqrt(n)
        break
      default:
        throw new TypeError()
    }
    return returnValue
  }
  
  export class Complex {
  
    static cast(o: any): Complex {
      var returnValue: Complex
      if (o != null) {
        if (o instanceof Complex) {
          returnValue = o
        } else {
          switch (typeof o) {
            case 'boolean':
            case 'number':
              returnValue = new Complex(+o)
              break
            case 'string':
              returnValue = Complex.fromString(o)
              break
            
          }
        }
      }
      return returnValue
    }
    
    static fromString(s: string) {
      throw new Error()
      return new Complex()
    }
    
    static fromObject(o: { re: number; im: number }) {
      return new Complex(o.re, o.im)
    }
    
    constructor(
      public re: number = 0, 
      public im: number = 0
    ) {}
    
    equals(other: any): boolean {
      return (other instanceof Complex) && math_eq(this.re, other.re) && math_eq(this.im, other.im)
    }
    
    inspect() {
      return 'Complex(' + this + ')'
    }
    
    toJSON() {
      var returnValue: any = {};
      var re = this.re
      var im = this.im
         
      returnValue.re = re
      if (im != 0) {
        returnValue.im = im
      }
      return returnValue
    }
   
    toString(options?: any) {
      var str = '';
      var re = this.re
      var im = this.im
      //var strRe = number.format(re, options);
      //var strIm = number.format(im, options);
      var strRe = String(re);
      var strIm = String(im);

      if (im == 0) {
        // real value
        str = strRe;
      } else if (re == 0) {
        // purely complex value
        if (im == 1) {
          str = 'i';
        } else if (im == -1) {
          str = '-i';
        } else {
          str = strIm + 'i';
        }
      } else {
        // complex value
        if (im > 0) {
          if (im == 1) {
            str = strRe + ' + i';
          } else {
            str = strRe + ' + ' + strIm + 'i';
          }
        } else {
          if (im == -1) {
            str = strRe + ' - i';
          } else {
            str = strRe + ' - ' + strIm.substring(1) + 'i';
          }
        }
      }
    
      return str;
    }

    valueOf() {
      return this.toString()
    }
  }
  
  function numType(o: any): NumType {
    var returnValue = NumType.Unknown
    switch (typeof o) {
      case 'number':
        returnValue = NumType.Number
        break
      case 'object':
        if (o != null) {
          switch (o.constructor) {
            case Number:
              returnValue = NumType.Number
              break
            case Complex: 
              returnValue = NumType.Complex
              break
          }
        }
        break
      default:
        //left unknown
     }  
    return returnValue
  }
  

}
export = math