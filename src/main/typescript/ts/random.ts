import { IIteratorResult, IIterator } from "./iterator";

declare function require(s: string): any; // nodejs
declare let process: any;

const FLOAT_MIN_VALUE = Number.MIN_VALUE;
const FLOAT_MAX_VALUE = Number.MAX_VALUE;
const INT_MIN_VALUE = Math.pow(2, 31) | 0;
const INT_MAX_VALUE = (INT_MIN_VALUE - 1) | 0;
const NODEJS = typeof process !== "undefined";
const BROWSER = typeof window !== "undefined";

type IGenerator<T> = IIterator<T>;

export interface IRandomGeneratorAdapter {
  isSupported(): boolean;
  new(seed: string): IGenerator<number>;
}

// ECMA like spec
const Floor = Math.floor;
const Ceil = Math.ceil;
const Random = Math.random;

function ArraySwap(array: number[], i: number, j: number) {
  let tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}
/*
function GeneratorCreate<T>(f: () => T) {
  return new Generator(function () {
    return { done: false, value: f() };
  });
}*/

function GeneratorNext<T>(rg: IGenerator<T>, v?: any) {
  return rg.next(v);
}

function GeneratorGet<T>(rg: IGenerator<T>, v?: any) {
  return GeneratorNext(rg, v).value;
}
/*
function GeneratorMap<T, U>(rg: IGenerator<T>, f: (v: T) => U) {
  return Generator.map(rg, function (v?: T) {
    return { done: false, value: f(v) };
  });
}

function GeneratorChain<T, U>(rg: IGenerator<T>, f: (v: T) => IGenerator<U>) {
  return GeneratorCreate(function () {
    return GeneratorNext(f(GeneratorNext(rg).value));
  });
}*/

function GenerateBoolean(rg: IGenerator<number>): boolean {
  return 2 * GeneratorGet(rg) > 1;
}

function GenerateNumber(rg: IGenerator<number>, min: number, max: number): number {
  return (GeneratorGet(rg) * (max - min)) + min;
}

function GenerateInt(rg: IGenerator<number>, min: number, max: number): number {
  return Floor(GeneratorGet(rg) * (max - min + 1)) + min;
}

function GenerateChar(rg: IGenerator<number>, chars: string): string {
  return chars.charAt(Floor(GeneratorGet(rg) * (chars.length + 1)));
}

function GenerateString(rng: IGenerator<number>, length: number, chars: string): string {
  let returnValue = "";
  for (let i = 0; i < length; i++) {
    returnValue += GenerateChar(rng, chars);
  }
  return returnValue;
}

const AdapterRegistry: { [name: string]: IRandomGeneratorAdapter } = {};

export function Adapter<F extends IRandomGeneratorAdapter>(name: string) {
  return function (target: F) {
    if (AdapterRegistry[name]) {
      throw new Error(`"${name}" is already registered`);
    }
    AdapterRegistry[name] = target;
  };
}

class RandomGeneratorAdapter implements IGenerator<number> {
  constructor(protected _next: { (v?: any): number }, public hint = "abstract") {}

  next(v?: any) {
    return { done: false, value: this._next(v) };
  }

  return(v?: any) {
    return { done: false, value: v };
  }

  throw(error: any): any {
    throw error;
  }

  inspect() {
    return `RandomGenerator { [${this.hint}] }`;
  }

  toString() {
    return this.inspect();
  }
}

export class RandomGenerator extends RandomGeneratorAdapter {

  static adapterDefault = "rc4";

  protected _adapter: IGenerator<number>;

  constructor(type?: string, seed = "") {
    let Constructor = AdapterRegistry[type];
    if (!Constructor) {
      throw new ReferenceError(type + " is not a valid adapter");
    }
    let adapter = new Constructor(seed);
    super((v) => {
      return GeneratorNext(adapter, v).value;
    });
  }

  generate() {
    return GeneratorNext(this._adapter).value;
  }
}


@Adapter("nodejs")
class RandomGeneratorNodeJS extends RandomGeneratorAdapter {
  static isSupported(): boolean {
    try {
      require("crypto");
      return true;
    } catch (e) {
      return false;
    }
  }

  constructor(seed?: string) {
    const numBytes = 4;
    const crypto = require("crypto");
    super(function () {
      let returnValue = NaN;
      if (crypto) {
        let bytes;
        // Try to get cryptographically strong randomness. Fall back to
        // non-cryptographically strong if not available.
        try {
          bytes = crypto.randomBytes(numBytes);
        } catch (e) {
          // XXX should re-throw any error except insufficient entropy
          bytes = crypto.pseudoRandomBytes(numBytes);
        }
        let result = bytes.toString("hex");
        // If the number of digits is odd, we'll have generated an extra 4 bits
        // of randomness, so we need to trim the last digit.
        returnValue = parseInt(result.substring(0, 8), 16);
        returnValue *= 2.3283064365386963e-10; // 2^-32
      }
      return returnValue;
    }, "nodejs");
  }
}

@Adapter("browser")
class RandomGeneratorBrowser extends RandomGeneratorAdapter {
  static isSupported(): boolean {
    return !!(typeof window !== "undefined" ? window.crypto : null);
  }

  constructor(seed?: string) {
    const buffer = new Uint32Array(1);
    const crypto = window.crypto;
    super(() => {
      let returnValue = NaN;
      if (crypto) {
        crypto.getRandomValues(buffer);
        returnValue = buffer[0] * 2.3283064365386963e-10; // 2^-32
      } else {
        returnValue = Random();
      }
      return returnValue;
    }, "browser");
  }
}

@Adapter("rc4")
export class RandomGeneratorRC4 extends RandomGeneratorAdapter  {

  private static _getStringBytes(s: string): number[] {
    let output = [];
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      let bytes = [];
      do {
        bytes.push(c & 0xFF);
        c = c >> 8;
      } while (c > 0);
      output = output.concat(bytes.reverse());
    }
    return output;
  }

  private static _createState(width: number) {
    let arr = new Array(width);
    for (let idx = 0; idx < width; idx++) {
      arr[idx] = idx;
    }
    return arr;
  }

  static isSupported(): boolean {
    return true;
  }

  constructor(seed?: string) {
    const RC4_WIDTH = 256;
    const RC4_MASK = RC4_WIDTH - 1;
    const RC4_BYTES = 7; // 56 bits to make a 53-bit double
    const RC4_DENOM = (Math.pow(2, RC4_BYTES * 8) - 1);
    let _state = RandomGeneratorRC4._createState(RC4_WIDTH);
    let _i = 0;
    let _j = 0;

    super(function () {
      let output = 0;
      for (let i = 0; i < RC4_BYTES; i++) {
        output *= RC4_WIDTH;
        output += _nextByte();
      }
      return output / RC4_DENOM;
    }, "rc4");

    function _nextByte() {
      _i = (_i + 1) % RC4_WIDTH;
      _j = (_j + _state[_i]) % RC4_WIDTH;
      ArraySwap(_state, _i, _j);
      return _state[(_state[_i] + _state[_j]) % RC4_WIDTH];
    }

    function _seed(str: string) {
      let input = RandomGeneratorRC4._getStringBytes(str);
      let inputlen = input.length;
      let j = 0;
      for (let i = 0; i < RC4_WIDTH; i++) {
        j += _state[i] + input[i % inputlen];
        j %= RC4_WIDTH;
        ArraySwap(_state, i, j);
      }
    }

    // init seed
    _seed(seed || Random().toString(36));
  }
}

const randomGenerator = new RandomGenerator();

export function next(rg: IGenerator<number> = randomGenerator): number {
  return GeneratorNext(rg).value;
}

export function nextBoolean(rng: IGenerator<number> = randomGenerator): boolean {
  return GenerateBoolean(rng);
}

export function nextNumber(min = FLOAT_MIN_VALUE, max = FLOAT_MAX_VALUE, rng: IGenerator<number> = randomGenerator): number {
  return GenerateNumber(rng, min, max);
}

export function nextInt(min = INT_MIN_VALUE, max = INT_MAX_VALUE, rng: IGenerator<number> = randomGenerator): number {
  return GenerateInt(rng, min, max);
}

export function nextChar(chars?: string, rng: IGenerator<number> = randomGenerator): string {
  return GenerateChar(rng, chars || "abcdefghijklmnopqrstuvwxyz0123456789");
}

/*export function nextExponential(lambda: number, ng: IEngine = engine.current): number {
  return log(1 - ng.generate()) / (-lambda)
}*/
/*
export module engine {
  let math_random = Math.random


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

    generateBoolean(trueWeight: number = 2): boolean {
      return __bool(this.generate(), trueWeight)
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

  let PSEUDO_M = 2147483647
  let PSEUDO_A = 48271
  let PSEUDO_Q = PSEUDO_M / PSEUDO_A
  let PSEUDO_R = PSEUDO_M % PSEUDO_A
  let PSEUDO_M_MINUS_ONE = PSEUDO_M - 1
  let PSEUDO_ONE_OVER_M_MINUS_ONE = 1.0 / PSEUDO_M_MINUS_ONE

  export class Pseudo extends Engine {
    name = "PSEUDO"

    private _state: number = 0

    seed(str: string) {
      let state = 0
      let hash = 0
      for (let i = 0, l = str.length; i < l; ++i) {
        hash  = (((hash << 5) - hash) + str.charCodeAt(i)) | 0
      }

      state = hash % PSEUDO_M_MINUS_ONE
      if (state <= 0) {
        state += PSEUDO_M_MINUS_ONE
      }

      this._state = state
    }

    generate(): number {
      let state = this._state
      let hi = math_floor(state / PSEUDO_Q)
      let lo = state % PSEUDO_Q
      let test = PSEUDO_A * lo - PSEUDO_R * hi
      this._state = test > 0 ? test : test + PSEUDO_M

      return (this._state - 1) * PSEUDO_ONE_OVER_M_MINUS_ONE
    }
  }





/*
export interface IGenerator<T> {
  (): T
  next(): { done: boolean; value?: T }
}

export let generator = (function () {
  function generator<T>(f: () => T): IGenerator<T> {
    let o = <any>f
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
  let nextGaussian: number = null;

  return generator(() => {
    let z: number = nextGaussian;
    if (z != null) {
      nextGaussian = null;
    } else {
      let s, v1, v2: number;
      do {
        v1 = 2 * g.generate() - 1; // Between -1.0 and 1.0.
        v2 = 2 * g.generate() - 1; // Between -1.0 and 1.0.
        s = v1 * v1 + v2 * v2;
      } while (s >= 1);
      let norm = sqrt(-2 * log(s) / s);
      z = v1 * norm;
      nextGaussian = v2 * norm;
    }
    return mu + z * sigma;
  });
}*/

/*export function pareto(alpha: number, g: IRandomEngine = engineDefault) {
  //Pareto distribution.  alpha is the shape parameter.
  let alphaInv = 1 / alpha;

  return generator(() => {
    let u = 1 - g.generate();
    return 1 / pow(u, alphaInv);
  });
}*/

/*export function triangular(lower: number, upper: number, mode: number, g: IRandomEngine = engineDefault) {
  // http://en.wikipedia.org/wiki/Triangular_distribution
  let upperMinusLower = (upper - lower);
  let modeMinusLower = (mode - lower);
  let discriminant = modeMinusLower / upperMinusLower;
  let lowerFactor = upperMinusLower * modeMinusLower;
  let upperFactor = upperMinusLower * (upper - mode);

  return generator(() => {
    let u = g.generate();

    return (u <= discriminant) ?
      lower + sqrt(u * lowerFactor):
      upper - sqrt((1 - u) * upperFactor);
  });
}*/

/*export function weibull(alpha: number, beta: number, g: IRandomEngine = engineDefault) {
  let betaInv = 1.0 / beta;

  return generator(() => {
    return alpha * pow(-log(1 - g.generate()), betaInv);
  });
}*/
