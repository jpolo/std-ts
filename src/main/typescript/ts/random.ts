module random {
  var __format = function (n: string, s: string) { return n + ' { ' + s + ' }' }
  //var math_sqrt = Math.sqrt;
  //var math_sin = Math.sin;
  //var math_cos = Math.cos;
  var math_floor = Math.floor
  var math_log = Math.log
  var math_pow = Math.pow
  
  
  var FLOAT_MIN_VALUE = Number.MIN_VALUE
  var FLOAT_MAX_VALUE = Number.MAX_VALUE
  var INT_MIN_VALUE = math_pow(2, 31)|0
  var INT_MAX_VALUE = (INT_MIN_VALUE - 1)|0

  export interface IEngine {
    //generate must return value [0, 1)
    generate(): number
    next(): { done: boolean; value?: number }
  }

  export function next(ng: IEngine = engine.get()): number {
    return ng.generate()
  }
  
  export function nextBoolean(ng: IEngine = engine.get()): boolean {
    return next(ng) > 0.5
  }
  
  export function nextNumber(min = FLOAT_MIN_VALUE, max = FLOAT_MAX_VALUE, ng: IEngine = engine.get()): number {
    return (next(ng) * (max - min)) + min
  }
  
  export function nextInt(min = INT_MIN_VALUE, max = INT_MAX_VALUE, ng: IEngine = engine.get()): number {
    return math_floor(next(ng) * (max - min + 1)) + min
  }
  
  export function nextChar(chars?: string, ng: IEngine = engine.get()): string {
    chars = chars || 'abcdefghijklmnopqrstuvwxyz0123456789'
    return chars.charAt(math_floor(next(ng) * (chars.length + 1)))
  }
  
  /*export function nextExponential(lambda: number, ng: IEngine = engine.current): number {
    return log(1 - ng.generate()) / (-lambda)
  }*/

  export module engine {
    var math_random = Math.random
    
    
    export class Engine implements IEngine {

      static seedDefault(): string {
        return math_random().toString(36)
      }
      
      name = "<ANONYMOUS>"
      
      constructor(seed?: string) {
        this.seed(seed == null ? Engine.seedDefault() : seed)
      }
      
      seed(str: string) { }
      
      generate(): number {
        return NaN
      }

      next(): { done: boolean; value: number; } {
        return { done: false, value: this.generate() }
      }
      
      inspect(): string {
        return __format('Engine', this.name)
      }
      
      toString(): string {
        return this.inspect()
      }
    }
    
    export class Native extends Engine {
      name = "NATIVE"
      generate(): number { 
        return math_random() 
      }
    }
    
    var PSEUDO_M = 2147483647
    var PSEUDO_A = 48271
    var PSEUDO_Q = PSEUDO_M / PSEUDO_A
    var PSEUDO_R = PSEUDO_M % PSEUDO_A
    var PSEUDO_M_MINUS_ONE = PSEUDO_M - 1
    var PSEUDO_ONE_OVER_M_MINUS_ONE = 1.0 / PSEUDO_M_MINUS_ONE
    
    export class Pseudo extends Engine {
      name = "PSEUDO"
      
      private _state: number = 0
      
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
      
      generate(): number {
        var state = this._state
        var hi = math_floor(state / PSEUDO_Q)
        var lo = state % PSEUDO_Q
        var test = PSEUDO_A * lo - PSEUDO_R * hi
        this._state = test > 0 ? test : test + PSEUDO_M
    
        return (this._state - 1) * PSEUDO_ONE_OVER_M_MINUS_ONE
      }
    }

    var RC4_WIDTH = 256
    var RC4_MASK = RC4_WIDTH - 1
    var RC4_BYTES = 7; // 56 bits to make a 53-bit double
    var RC4_DENOM = (math_pow(2, RC4_BYTES * 8) - 1)
    export class RC4 extends Engine {
      name = "RC4"
      
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
      
      seed(str: string) {
        var input = RC4._getStringBytes(str)
        var inputlen = input.length
        var j = 0
        var s = this._s || (this._s = RC4._createState())
        for (var i = 0; i < RC4_WIDTH; i++) {
          j += s[i] + input[i % inputlen]
          j %= RC4_WIDTH
          _swap(s, i, j)
        }
      }

      generate(): number {
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
        _swap(s, i, j)
        return s[(s[i] + s[j]) % RC4_WIDTH]
      }
    }
    
    function _swap(array: number[], i: number, j: number) {
      var tmp = array[i]
      array[i] = array[j]
      array[j] = tmp
    }
    
    
    /**
     * Engines
     */
    export var pseudo = new Pseudo()
    export var native = new Native()
    export var rc4 = new RC4()
    
    /**
     * Default engine 
     */
    var _instance: IEngine = native
    export function get(): IEngine {
      return _instance
    }
    
    export function set(ng: IEngine) {
      _instance = ng
    }
  }
  
  /*
  export interface IGenerator<T> {
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