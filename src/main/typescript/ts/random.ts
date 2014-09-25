module random {
  //var sqrt = Math.sqrt;
  //var sin = Math.sin;
  //var cos = Math.cos;
  var floor = Math.floor;
  var log = Math.log;
  var pow = Math.pow;
  
  
  var FLOAT_MIN_VALUE = Number.MIN_VALUE;
  var FLOAT_MAX_VALUE = Number.MAX_VALUE;
  var INT_MIN_VALUE = pow(2, 31)|0;
  var INT_MAX_VALUE = (INT_MIN_VALUE - 1)|0;

  export interface IEngine {
    //generate must return value [0, 1)
    generate(): number
    next(): { done: boolean; value?: number }
  }

  export function next(ng: IEngine = engine.current) {
    return ng.generate()
  }
  
  export function nextBoolean(ng: IEngine = engine.current): boolean {
    return next(ng) > 0.5
  }
  
  export function nextNumber(min = FLOAT_MIN_VALUE, max = FLOAT_MAX_VALUE, ng: IEngine = engine.current): number {
    return (next(ng) * (max - min)) + min
  }
  
  export function nextInt(min = INT_MIN_VALUE, max = INT_MAX_VALUE, ng: IEngine = engine.current): number {
    return floor(next(ng) * (max - min + 1)) + min
  }
  
  export function nextChar(chars?: string, ng: IEngine = engine.current): string {
    chars = chars || 'abcdefghijklmnopqrstuvwxyz0123456789'
    return chars.charAt(floor(next(ng) * (chars.length + 1)))
  }
  
  /*export function nextExponential(lambda: number, ng: IEngine = engine.current): number {
    return log(1 - ng.generate()) / (-lambda)
  }*/

  export module engine {
    var mathrandom = Math.random
    
    export class Engine implements IEngine {

      name = "<anonymous>"
      
      seed(s: string) { }
      
      generate(): number {
        throw Error()
      }
      
      next() {
        return { done: false, value: this.generate() }
      }
      
      toString() {
        return 'RandomEngine(' + this.name + ')'
      }
    }
    
    export class Native extends Engine {
      name = "native"
      generate() { return mathrandom() }
    }
    
    var PSEUDO_M = 2147483647
    var PSEUDO_A = 48271
    var PSEUDO_Q = PSEUDO_M / PSEUDO_A
    var PSEUDO_R = PSEUDO_M % PSEUDO_A
    var PSEUDO_M_MINUS_ONE = PSEUDO_M - 1
    var PSEUDO_ONE_OVER_M_MINUS_ONE = 1.0 / PSEUDO_M_MINUS_ONE
    
    export class Pseudo extends Engine {
      name = "pseudo"
      
      private _state: number = 0
      
      constructor(seed?: string) {
        super()
        if (seed != undefined) {
          this.seed(seed)
        }
      }
      
      seed(str: string) {
        var state = 0        
        var hash = 0
        for (var i = 0, l = str.length; i < l; ++i) {
          hash  = (((hash << 5) - hash) + str.charCodeAt(i)) | 0
        }
        
        state = hash % PSEUDO_M_MINUS_ONE
        if (state <= 0) {
          state += PSEUDO_M_MINUS_ONE
        }
        
        this._state = state
      }
      
      generate() {
        var state = this._state
        var hi = floor(state / PSEUDO_Q)
        var lo = state % PSEUDO_Q
        var test = PSEUDO_A * lo - PSEUDO_R * hi
        this._state = test > 0 ? test : test + PSEUDO_M
    
        return (this._state - 1) * PSEUDO_ONE_OVER_M_MINUS_ONE
      }
    }

    var RC4_WIDTH = 256
    var RC4_MASK = RC4_WIDTH - 1
    var RC4_BYTES = 7; // 56 bits to make a 53-bit double
    var RC4_DENOM = (pow(2, RC4_BYTES * 8) - 1)
    export class RC4 extends Engine {
      name = "rc4"
      
      private static _getStringBytes(s: string): number[] {
        var output = []
        for (var i = 0; i < s.length; i++) {
          var c = s.charCodeAt(i)
          var bytes = []
          do {
            bytes.push(c & 0xFF)
            c = c >> 8
          } while (c > 0)
          output = output.concat(bytes.reverse())
        }
        return output
      }
      
      private static _createState() {
        var arr = new Array(RC4_WIDTH)
        for (var idx = 0; idx < RC4_WIDTH; idx++) {
          arr[idx] = idx
        }
        return arr
      }
      
      private _s: number[]
      private _i = 0
      private _j = 0
      
      constructor(seed?: string) {
        super()
        this._s = RC4._createState()
        if (seed) {
          this.seed(seed)
        }
      }
      
      seed(str: string) {
        var input = RC4._getStringBytes(str)
        var inputlen = input.length
        var j = 0
        var s = this._s
        for (var i = 0; i < RC4_WIDTH; i++) {
          j += s[i] + input[i % inputlen]
          j %= RC4_WIDTH
          swap(s, i, j)
        }
      }

      generate() {
        var output = 0
        for (var i = 0; i < RC4_BYTES; i++) {
          output *= RC4_WIDTH
          output += this._nextByte()
        }
        return output / RC4_DENOM
      }

      private _nextByte() {
        var s = this._s
        var i = this._i
        var j = this._j
        i = this._i = (i + 1) % RC4_WIDTH
        j = this._j = (j + s[i]) % RC4_WIDTH
        swap(s, i, j)
        return s[(s[i] + s[j]) % RC4_WIDTH]
      }
    }
    
    function swap(array: number[], i: number, j: number) {
      var tmp = array[i]
      array[i] = array[j]
      array[j] = tmp
    }
    
    export var pseudo = new Pseudo()
    export var native = new Native()
    export var current = native
  }
  
  /*export interface IGenerator<T> {
    (): T
    next(): { done: boolean; value?: T }
  }
  
  export var generator = (function () {
    function generator<T>(f: () => T): IGenerator<T> {
      var o = <any>f
      o.next = next
      return o
    }
    
    function next() {
      return { done: false, value: this() }
    }
    
    return generator
  }());*/
    
  /*export function exponential(lambda: number, g: IRandomEngine = engineDefault) {
    return generator(() => { return log(1 - g.generate()) / (-lambda); });
  }*/
  
  /*export function normal(mu = 0, sigma = 1, g: IRandomEngine = engineDefault) {
    var nextGaussian: number = null;

    return generator(() => { 
      var z: number = nextGaussian;
      if (z != null) {
        nextGaussian = null;
      } else {
        var s, v1, v2: number;
        do {
          v1 = 2 * g.generate() - 1; // Between -1.0 and 1.0.
          v2 = 2 * g.generate() - 1; // Between -1.0 and 1.0.
          s = v1 * v1 + v2 * v2;
        } while (s >= 1);
        var norm = sqrt(-2 * log(s) / s);
        z = v1 * norm; 
        nextGaussian = v2 * norm;
      }
      return mu + z * sigma;
    });
  }*/
  
  /*export function pareto(alpha: number, g: IRandomEngine = engineDefault) {
    //Pareto distribution.  alpha is the shape parameter.
    var alphaInv = 1 / alpha;

    return generator(() => {
      var u = 1 - g.generate();
      return 1 / pow(u, alphaInv);
    });
  }*/
  
  /*export function triangular(lower: number, upper: number, mode: number, g: IRandomEngine = engineDefault) {
    // http://en.wikipedia.org/wiki/Triangular_distribution
    var upperMinusLower = (upper - lower);
    var modeMinusLower = (mode - lower);
    var discriminant = modeMinusLower / upperMinusLower;
    var lowerFactor = upperMinusLower * modeMinusLower;
    var upperFactor = upperMinusLower * (upper - mode);
    
    return generator(() => {
      var u = g.generate();
      
      return (u <= discriminant) ? 
        lower + sqrt(u * lowerFactor):
        upper - sqrt((1 - u) * upperFactor);
    });
  }*/

  /*export function weibull(alpha: number, beta: number, g: IRandomEngine = engineDefault) {
    var betaInv = 1.0 / beta;

    return generator(() => {
      return alpha * pow(-log(1 - g.generate()), betaInv);
    });
  }*/
  

}
export = random