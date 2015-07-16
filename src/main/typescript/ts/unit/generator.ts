import { IIterator, IIteratorResult, Iterator } from "../iterator"

//Constant
const SIZE = 10;
const LN2 = Math.log(2);

const __max = Math.max;
const __log = Math.log;
const __floor = Math.floor;
const __round = Math.round;
const __log2 = function (n: number): number {
  return __log(n) / LN2;
};
const __paramLogSize = function (params: Params) {
  let r = __round(__log2(params.size + 1));
  return r >= 0 ? r : 0;
};

//helper
type Params = {
  size: number
  random: () => number
}

//ECMA like
function ParamsCreate(p: { size?: number; random?: () => number }): Params {
  let random = p.random;
  let size = p.size;
  return {
    size: size === undefined ? SIZE : size,
    random: random === undefined ? Math.random : random
  };
}

function ParamsRandom(p: Params, min: number, max: number): number {
  return __floor(p.random() * (max - min)) + min;
}

function GeneratorCreate<Result>(f: (params: Params) => Result): IGenerator<Result> {
  const g = <IGenerator<Result>> function (params: Params): Result {
    return f(params);
  };
  
  g.map = function (f) {
    return GeneratorCreate(function (params: Params) {
      return g(f(params));
    })
  };
  
  g.next = function (p: { size?: number; random?: () => number }): Result {
    return f(ParamsCreate(p));
  };
  
  return g;
}


export interface IGenerator<Result> {
  (p: Params): Result
  map<U>(f: (v: Result) => U)
  next(p: { size?: number; random?: () => number }): Result
}

export function constant<T>(k: T): IGenerator<T> {
  return GeneratorCreate(function (p: Params) {
    return k;
  });
}

export function oneOf<T>(gens: IGenerator<T>[]): IGenerator<T> {
  const length = gens.length;
  return GeneratorCreate(function (p: Params) {
    let params = p;//ParamsCreate(p);
    let index = ParamsRandom(params, 0, length);
    return gens[index](params);
  });
}

export function array<T>(genValue: IGenerator<T>, genSize = size()): IGenerator<T[]> {
  return GeneratorCreate(function (p: Params) {
    let params = p;//ParamsCreate(p);
    let size =  ParamsRandom(params, 0, genSize(params));
    let length = ParamsRandom(params, 0, size);
    let returnValue: T[] = new Array(length);
    for (let i = 0; i < length; i++) {
      returnValue[i] = genValue(params);
    }
    return returnValue;
  });
}

export function bind<A, B, C, R>(f: (a: A, b: B, c: C) => R, args: [IGenerator<A>, IGenerator<B>, IGenerator<C>]): IGenerator<R>
export function bind<A, B, R>(f: (a: A, b: B) => R, args: [IGenerator<A>, IGenerator<B>]): IGenerator<R>
export function bind<A, R>(f: (a: A) => R, args: [IGenerator<A>]): IGenerator<R>
export function bind<R>(f: () => R, args?: any): IGenerator<R>
export function bind(f: Function, args: any): any {
  const gentuple = tuple(args);
  return GeneratorCreate(function (p: Params) {
    let params = p;//ParamsCreate(p);
    let t = gentuple(params);
    return f.apply(this, t);
  });
}

/*
function recursive<T>(gen: IGenerator<T>, loop: (g: IGenerator<T>) => IGenerator<T>, genSize = size()): IGenerator<T> {
  function rec(n: number, p: Params) {
    return (
      //Trivial case
      n <= 0 || __paramRand(p, 0, 3) === 0 ? gen(p) :
      
      //Recursion
      loop(function (paramsq: Params) {
        return rec(n - 1, paramsq);
      })(p)
    );
  }
  
  return GeneratorCreate(function (p: Params) {
    let params = __paramsDefault(p);
    let size = genSize(params);
    return rec(size, params);
  });
}*/

function size(): IGenerator<number> {
  return GeneratorCreate(__paramLogSize);
}

export function tuple<A, B, C, D, E, F, G, H>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>, IGenerator<H>] ): IGenerator<[A, B, C, D, E, F, G, H]>
export function tuple<A, B, C, D, E, F, G>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>, IGenerator<G>] ): IGenerator<[A, B, C, D, E, F, G]>
export function tuple<A, B, C, D, E, F>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>, IGenerator<F>] ): IGenerator<[A, B, C, D, E, F]>
export function tuple<A, B, C, D, E>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>, IGenerator<E>] ): IGenerator<[A, B, C, D, E]>
export function tuple<A, B, C, D>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>, IGenerator<D>] ): IGenerator<[A, B, C, D]>
export function tuple<A, B, C>(gens: [IGenerator<A>, IGenerator<B>, IGenerator<C>] ): IGenerator<[A, B, C]>
export function tuple<A, B>(gens: [IGenerator<A>, IGenerator<B>] ): IGenerator<[A, B]>
export function tuple(gens: any[]): IGenerator<any> {
  const length = gens.length;
  
  return GeneratorCreate(function (p: Params) {
    let params = p;//ParamsCreate(p);
    let returnValue: any[] = new Array(length);
    for (let i = 0; i < length; i++) {
      returnValue[i] = gens[i](params);
    }
    return returnValue;
  });
}
  
function object<V>(genKey: IGenerator<number>, genValue: IGenerator<V>, genSize?: IGenerator<number>): IGenerator<{[key: number]: V}>;
function object<V>(genKey: IGenerator<string>, genValue: IGenerator<V>, genSize?: IGenerator<number>): IGenerator<{[key: string]: V}>;
function object<V>(genKey: IGenerator<any>, genValue: IGenerator<V>, genSize = size()): IGenerator<any> {
  return GeneratorCreate(function (p: Params) {
    let params = p;//ParamsCreate(p);
    let size = genSize(params);
    let returnValue = {};
    for (let i = 0; i < size; i++) {
      let key = genKey(params);
      let value = genValue(params);
      returnValue[key] = value;
    }
    return returnValue;
  });
}
