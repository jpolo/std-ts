/*tslint:disable:max-line-length */
import { IIterator, IIteratorResult } from '../iterator';
import { Call } from './util';

// Constant
const SIZE = 100;
const LN2 = Math.log(2);

const Floor = Math.floor;
const Round = Math.round;
const Log = Math.log;
const Log2 = function(n: number): number { return Log(n) / LN2; };
const genSize = GeneratorCreate(function(params: IGeneratorParams) {
  return IteratorResultCreate(false, ParamsRandomInt(params, 0, ParamsSize(params)));
});

// helper
export interface IGenerator<T> extends IIterator<T> {}
export interface IGeneratorParams {
  size?: number;
  random?: () => number;
}

// ECMA like
function IteratorResultCreate<T>(done: boolean, value: T): IIteratorResult<T> {
  return { done: done, value: value };
}

function ParamsCreate(p?: { size?: number; random?: () => number }): IGeneratorParams {
  const hasRandom = p && p.random;
  const hasSize = p && p.size;
  return {
    size: hasSize ? p.size : SIZE,
    random() {
      return hasRandom ? p.random() : Math.random();
    }
  };
}

function ParamsRandom(p: IGeneratorParams, min = 0, max = 1): number {
  const n = p.random();
  if (typeof n !== 'number' || n < 0 || n >= 1 || n !== n) {
    throw new RangeError('Params.random() must belongs to [0, 1) but got ' + n);
  }
  return (n * (max - min)) + min;
}

function ParamsRandomInt(p: IGeneratorParams, min: number, max: number): number {
  return Floor(ParamsRandom(p) * (max - min + 1)) + min;
}

function ParamsSize(p: IGeneratorParams): number {
  const r = Round(Log2(p.size + 1));
  return r >= 0 ? r : 0;
}

function IsIGenerator(o: any): o is IGenerator<any> {
  return o !== null && typeof o === 'object' && typeof o.next === 'function';
}

function GeneratorCreate<T>(f: {(params: IGeneratorParams): IIteratorResult<T>}): IGenerator<T> {
  return {
    next(params?: IGeneratorParams): IIteratorResult<T> {
      params = ParamsCreate(params);
      return f(params);
    }
  };
}

function GeneratorFrom<T>(o: IGenerator<T>): IGenerator<T>;
function GeneratorFrom<T>(o: T): IGenerator<T>;
function GeneratorFrom(o: any): IGenerator<any> {
  return IsIGenerator(o) ? o : GeneratorCreate(function(params: IGeneratorParams) {
    return IteratorResultCreate(false, o);
  });
}

function GeneratorNext<T>(gen: IGenerator<T>, p: IGeneratorParams) {
  return gen.next(p);
}

/**
 * Create a generator that always generates ```k```
 *
 * @param the value
 * @return the constant generator
 */
export function constant<T>(k: T): IGenerator<T> {
  return GeneratorCreate(function(p: IGeneratorParams) { return IteratorResultCreate(false, k); });
}

/**
 * Create a generator that randomly generates a value in ```gens```
 *
 * @param choices the array of possible values or generators
 * @return the value generator
 */
export function oneOf<T>(choices: IGenerator<T>[]): IGenerator<T>;
export function oneOf<T>(choices: T[]): IGenerator<T>;
export function oneOf<T>(choices: any[]): IGenerator<T> {
  const length = choices.length;
  const generators: IGenerator<T>[] = new Array(length);
  for (let i = 0; i < length; i++) {
    generators[i] = GeneratorFrom(choices[i]);
  }
  return GeneratorCreate(function(params: IGeneratorParams) {
    const index = ParamsRandomInt(params, 0, length);
    return GeneratorNext(generators[index], params);
  });
}

/**
 * Create a generator that generates array of ```n * genValue```
 *
 * @param value the values of the array
 * @param size the size value or generator of the array
 * @return the array generator
 */
export function array<T>(value: IGenerator<T>, size: number|IGenerator<number>): IGenerator<T[]>;
export function array<T>(value: IGenerator<T>, size = genSize): IGenerator<T[]> {
  const _genSize = GeneratorFrom<number>(size);
  return GeneratorCreate(function(params: IGeneratorParams) {
    const lengthResult = GeneratorNext(_genSize, params);
    const length = lengthResult.done ? 0 : lengthResult.value;
    const returnValue: T[] = new Array(length);
    for (let i = 0; i < length; i++) {
      returnValue[i] = GeneratorNext(value, params).value;
    }
    return IteratorResultCreate(false, returnValue);
  });
}

export function bind<A, B, C, R>(f: (a: A, b: B, c: C) => R, args: [IGenerator<A>, IGenerator<B>, IGenerator<C>]): IGenerator<R>;
export function bind<A, B, R>(f: (a: A, b: B) => R, args: [IGenerator<A>, IGenerator<B>]): IGenerator<R>;
export function bind<A, R>(f: (a: A) => R, args: [IGenerator<A>]): IGenerator<R>;
export function bind<R>(f: () => R, args?: any): IGenerator<R>;
export function bind(f: Function, args: any): any {
  const gentuple = tuple(args);
  return GeneratorCreate(function(p: IGeneratorParams) {
    const iterResult = GeneratorNext(gentuple, p);
    return Call(f, this, iterResult.value);
  });
}

export function filter<T>(gen: IGenerator<T>, p: (v: T) => boolean): IGenerator<T> {
  return GeneratorCreate(function(params: IGeneratorParams) {
    const iterResult = GeneratorNext(gen, params);
    const { done, value } = iterResult;
    return done ? iterResult : p(value) ? iterResult : { done: true, value: undefined };
  });
}

export function from<T>(f: (params: IGeneratorParams) => T): IGenerator<T> {
  return GeneratorCreate(function(params: IGeneratorParams) { return IteratorResultCreate(false, f(params)); });
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

/**
 * Create a generator that generates random values between [min, max)
 *
 * @param min the mininum value or generator
 * @param max the maximum value or generator
 * @return the random generator
 */
export function random(min: number|IGenerator<number> = 0, max: number|IGenerator<number> = 1): IGenerator<number> {
  const genMin = GeneratorFrom<number>(min as any);
  const genMax = GeneratorFrom<number>(max as any);
  return GeneratorCreate(function(params: IGeneratorParams) {
    const minResult = GeneratorNext(genMin, params);
    const maxResult = GeneratorNext(genMax, params);
    return (
      minResult.done || maxResult.done ? { done: true, value: undefined } :
      { done: false, value: ParamsRandom(params, minResult.value, maxResult.value) }
    );
  });
}

/**
 * Create a generator of tuple
 *
 * @return the tuple generator
 */
export function tuple<A, B, C, D, E, F, G, H, I>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>, IGenerator<H>, IGenerator<I>] ): IGenerator<[A, B, C, D, E, F, G, H, I]>;
export function tuple<A, B, C, D, E, F, G, H>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>, IGenerator<H>] ): IGenerator<[A, B, C, D, E, F, G, H]>;
export function tuple<A, B, C, D, E, F, G>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>] ): IGenerator<[A, B, C, D, E, F, G]>;
export function tuple<A, B, C, D, E, F>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>] ): IGenerator<[A, B, C, D, E, F]>;
export function tuple<A, B, C, D, E>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>] ): IGenerator<[A, B, C, D, E]>;
export function tuple<A, B, C, D>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>] ): IGenerator<[A, B, C, D]>;
export function tuple<A, B, C>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>] ): IGenerator<[A, B, C]>;
export function tuple<A, B>(gens: [IGenerator<A>, IGenerator<B>] ): IGenerator<[A, B]>;
export function tuple(gens: any[]): IGenerator<any> {
  const arity = gens.length;

  return GeneratorCreate(function(params: IGeneratorParams) {
    const returnValue: any[] = new Array(arity);
    for (let i = 0; i < arity; i++) {
      returnValue[i] = GeneratorNext(gens[i], params).value;
    }
    return IteratorResultCreate(false, returnValue);
  });
}

/**
 * Create a generator of literal object { [key]: value }
 *
 * @param key the key generator
 * @param value the value generator
 * @return the object generator
 */
export function object<V>(key: IGenerator<number>, value: IGenerator<V>, size?: number|IGenerator<number>): IGenerator<{[key: number]: V}>;
export function object<V>(key: IGenerator<string>, value: IGenerator<V>, size?: number|IGenerator<number>): IGenerator<{[key: string]: V}>;
export function object<V>(key: IGenerator<any>, value: IGenerator<V>, size = genSize): IGenerator<any> {
  const _genSize = GeneratorFrom(size);
  return GeneratorCreate(function(params: IGeneratorParams) {
    const keyCountResult = GeneratorNext(_genSize, params);
    const keyCount = keyCountResult.done ? 0 : keyCountResult.value;
    const returnValue = {};
    for (let i = 0; i < keyCount; i++) {
      const keyResult = GeneratorNext(key, params);
      const valueResult = GeneratorNext(value, params);
      if (!keyResult.done && !valueResult.done) {
        returnValue[keyResult.value] = valueResult.value;
      }
    }
    return IteratorResultCreate(false, returnValue);
  });
}
