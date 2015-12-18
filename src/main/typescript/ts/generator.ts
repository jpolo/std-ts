import { IIterableIterator, IIteratorResult } from "./iterator";


export interface IGenerator<Yield> extends IIterableIterator<Yield> {
  // next(n?: Next): IIteratorResult<Yield | Return>;
}

function GeneratorCreate<T>(f: (v: any) => T): IGenerator<T> {
  return {
    next(v?: any) {
      return this.return(f(v));
    },
    return<T>(v: T) {
      return { done: false, value: v };
    },
    throw(e: any): any {
      throw e;
    }
  };
}

function GeneratorGet<T>(rg: IGenerator<T>, v?: any): T {
  return rg.next(v).value;
}

function GeneratorMap<T, U>(rg: IGenerator<T>, f: (v: T) => U) {
  return GeneratorCreate(function (v: any) {
    return f(GeneratorGet(rg, v));
  });
}

function GeneratorChain<T, U>(rg: IGenerator<T>, f: (v: T) => IGenerator<U>) {
  return GeneratorCreate(function () {
    return GeneratorGet(f(GeneratorGet(rg)));
  });
}
