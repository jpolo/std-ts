import { IIterator, IIteratorResult, Iterator } from "../iterator"

//Constant
const SIZE = 100
const LN2 = Math.log(2)

const __log = Math.log
const __floor = Math.floor
const __round = Math.round
const __log2 = function (n: number): number {
  return __log(n) / LN2
}

//helper
type Params = {
  size: number
  random: () => number
}

//ECMA like
function Call(f: Function, thisp: any, args: any[]) {
  let argc = args && args.length || 0
  switch (argc) {
    case 0: return thisp ? f.call(thisp) : f()
    case 1: return thisp ? f.call(thisp, args[0]) : f(args[0])
    case 2: return thisp ? f.call(thisp, args[0], args[1]) : f(args[0], args[1])
    default: return f.apply(thisp, args)
  }
}

function ParamsCreate(p?: { size?: number; random?: () => number }): Params {
  let random = p && p.random
  let size = p && p.size
  return {
    size: size === undefined ? SIZE : size,
    random: random === undefined ? Math.random : random
  }
}

function ParamsRandom(p: Params, min = 0, max = 1): number {
  let n = p.random()
  if (n < 0 || n >= 1) {
    throw new RangeError("Params.random() must belongs to [0, 1)")
  }
  let clamped = (n * (max - min)) + min
  return clamped
}

function ParamsRandomInt(p: Params, min: number, max: number): number {
  return __floor(ParamsRandom(p) * (max - min)) + min
}

function ParamsSize(p: Params): number {
  let r = __round(__log2(p.size + 1))
  return r >= 0 ? r : 0
}

function IsGenerator(o: any): boolean {
  return typeof o === "function" && typeof o.next === "function"
}

function GeneratorCreate<Result>(f: (params: Params) => Result): IGenerator<Result> {
  const g = <IGenerator<Result>> function (params: Params): Result {
    return f(params)
  }

  g.map = function (f) {
    return GeneratorMap(g, f)
  }

  g.flatMap = function (f) {
    return GeneratorCreate(function (params: Params) {
      return f(GeneratorGet(g, params))(params)
    })
  }

  g.next = function (p?: { size?: number; random?: () => number }): Result {
    return f(ParamsCreate(p))
  }

  return g
}

function GeneratorFrom<T>(o: any): IGenerator<T> {
  return IsGenerator(o) ? o : GeneratorCreate(function (params: Params) {
    return o
  })
}

function GeneratorGet<T>(gen: IGenerator<T>, p: Params): T {
  return gen.next(p)
}

function GeneratorMap<T, U>(gen: IGenerator<T>, f: (v: T) => U): IGenerator<U> {
  return GeneratorCreate(function (params: Params) {
    return f(GeneratorGet(gen, params))
  })
}

export interface IGenerator<Result> {
  (p: Params): Result
  map<U>(f: (v: Result) => U): IGenerator<U>
  flatMap<U>(f: (v: Result) => IGenerator<U>): IGenerator<U>
  next(p?: { size?: number; random?: () => number }): Result
}

export function constant<T>(k: T): IGenerator<T> {
  return GeneratorCreate(function (p: Params) { return k })
}

export function oneOf<T>(gens: IGenerator<T>[]): IGenerator<T>
export function oneOf<T>(gens: T[]): IGenerator<T>
export function oneOf(gens: any[]): IGenerator<any> {
  const length = gens.length
  const generators: IGenerator<any>[] = new Array(length)
  for (let i = 0; i < length; i++) {
    generators[i] = GeneratorFrom(gens[i])
  }
  return GeneratorCreate(function (params: Params) {
    let index = ParamsRandomInt(params, 0, length)
    return GeneratorGet(generators[index], params)
  })
}

export function array<T>(genValue: IGenerator<T>, genSize = size()): IGenerator<T[]> {
  return GeneratorCreate(function (params: Params) {
    let length = GeneratorGet(genSize, params)
    let returnValue: T[] = new Array(length)
    for (let i = 0; i < length; i++) {
      returnValue[i] = GeneratorGet(genValue, params)
    }
    return returnValue
  })
}

export function bind<A, B, C, R>(f: (a: A, b: B, c: C) => R, args: [IGenerator<A>, IGenerator<B>, IGenerator<C>]): IGenerator<R>
export function bind<A, B, R>(f: (a: A, b: B) => R, args: [IGenerator<A>, IGenerator<B>]): IGenerator<R>
export function bind<A, R>(f: (a: A) => R, args: [IGenerator<A>]): IGenerator<R>
export function bind<R>(f: () => R, args?: any): IGenerator<R>
export function bind(f: Function, args: any): any {
  const gentuple = tuple(args)
  return GeneratorCreate(function (p: Params) {
    return Call(f, this, GeneratorGet(gentuple, p))
  })
}

export function filter<T>(gen: IGenerator<T>, p: (v: T) => boolean): IGenerator<T> {
  return GeneratorCreate(function (params: Params) {
    let value = GeneratorGet(gen, params)
    return p(value) ? value : undefined
  })
}

export function from<T>(f: (params: Params) => T): IGenerator<T> {
  return GeneratorCreate(f)
}

/*
function recursive<T>(gen: IGenerator<T>, loop: (g: IGenerator<T>) => IGenerator<T>, genSize = size()): IGenerator<T> {
  function rec(n: number, p: Params) {
    return (
      //Trivial case
      n <= 0 || __paramRand(p, 0, 3) === 0 ? gen(p) :

      //Recursion
      loop(function (paramsq: Params) {
        return rec(n - 1, paramsq)
      })(p)
    )
  }

  return GeneratorCreate(function (p: Params) {
    let params = __paramsDefault(p)
    let size = genSize(params)
    return rec(size, params)
  })
}*/

export function random(min: number|IGenerator<number>, max: number|IGenerator<number>): IGenerator<number> {
  const genMin = GeneratorFrom<number>(min)
  const genMax = GeneratorFrom<number>(max)
  return GeneratorCreate(function (params: Params) {
    let minValue = GeneratorGet(genMin, params)
    let maxValue = GeneratorGet(genMax, params)
    return ParamsRandom(params, minValue, maxValue)
  })
}

function size(): IGenerator<number> {
  return GeneratorCreate(function (params: Params) {
    return ParamsRandomInt(params, 0, ParamsSize(params))
  })
}

export function tuple<A, B, C, D, E, F, G, H, I>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>, IGenerator<H>, IGenerator<I>] ): IGenerator<[A, B, C, D, E, F, G, H, I]>
export function tuple<A, B, C, D, E, F, G, H>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>, IGenerator<H>] ): IGenerator<[A, B, C, D, E, F, G, H]>
export function tuple<A, B, C, D, E, F, G>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>] ): IGenerator<[A, B, C, D, E, F, G]>
export function tuple<A, B, C, D, E, F>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>] ): IGenerator<[A, B, C, D, E, F]>
export function tuple<A, B, C, D, E>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>] ): IGenerator<[A, B, C, D, E]>
export function tuple<A, B, C, D>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>] ): IGenerator<[A, B, C, D]>
export function tuple<A, B, C>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>] ): IGenerator<[A, B, C]>
export function tuple<A, B>(gens: [IGenerator<A>, IGenerator<B>] ): IGenerator<[A, B]>
export function tuple(gens: any[]): IGenerator<any> {
  const arity = gens.length

  return GeneratorCreate(function (params: Params) {
    let returnValue: any[] = new Array(arity)
    for (let i = 0; i < arity; i++) {
      returnValue[i] = GeneratorGet(gens[i], params)
    }
    return returnValue
  })
}

export function object<V>(genKey: IGenerator<number>, genValue: IGenerator<V>, genSize?: IGenerator<number>): IGenerator<{[key: number]: V}>
export function object<V>(genKey: IGenerator<string>, genValue: IGenerator<V>, genSize?: IGenerator<number>): IGenerator<{[key: string]: V}>
export function object<V>(genKey: IGenerator<any>, genValue: IGenerator<V>, genSize = size()): IGenerator<any> {
  return GeneratorCreate(function (params: Params) {
    let keyCount = GeneratorGet(genSize, params)
    let returnValue = {}
    for (let i = 0; i < keyCount; i++) {
      returnValue[GeneratorGet(genKey, params)] = GeneratorGet(genValue, params)
    }
    return returnValue
  })
}
