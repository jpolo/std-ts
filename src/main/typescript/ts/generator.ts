import { IIterableIterator, IIteratorResult } from "./iterator";

export interface IGeneratorResult<T> extends IIteratorResult<T> {

}

export interface IGenerator<Yield> extends IIterableIterator<Yield> {
  next(value?: any): IGeneratorResult<Yield>;
  return(value?: any): IGeneratorResult<Yield>;
  throw(error: any): IGeneratorResult<Yield>;
}

function IteratorResultCreate<T>(done: boolean, value: T): IIteratorResult<T> {
  return { done: done, value: value };
}

function IsGenerator(o: any): boolean {
  return (
    o !== null &&
    typeof o === "object" &&
    typeof o.next === "function" &&
    typeof o.return === "function" &&
    typeof o.throw === "function"
  );
}

function GeneratorCreate<T>(f: (v?: any) => IIteratorResult<T>): Generator<T> {
  return new Generator(f);
}

function GeneratorNext<T, Next>(gen: IGenerator<T>, v?: any): IIteratorResult<T> {
  return gen.next(v);
}

function GeneratorMap<T, U>(gen: IGenerator<T>, f: (v: T) => U): Generator<U> {
  return GeneratorCreate(function (v?: any) {
    const iterResult = GeneratorNext(gen, v);
    const iterMapped: IIteratorResult<U> = iterResult.done ? <any> iterResult : IteratorResultCreate(false, f(iterResult.value));
    return iterMapped;
  });
}

/*
function GeneratorChain<T, U, Next>(gen: IGenerator<T>, f: (v: T) => IGenerator<U>): Generator<U> {
  return GeneratorCreate(function (v: Next) {
    let iterResult = GeneratorNext(gen, v);
    return iterResult.done ? <any>iterResult : f(iterResult.value).next();
  });
}*/

export class Generator<Yield> implements IGenerator<Yield> {
  protected _done = false;

  static isGenerator(o: any): boolean {
    return IsGenerator(o);
  }

  static map<T, U>(gen: IGenerator<T>, f: (v: T) => U): Generator<U> {
    return GeneratorMap(gen, f);
  }
/*
  static chain<T, U>(gen: IGenerator<T>, f: (v: T) => IGenerator<U>): Generator<U> {
    return GeneratorChain(gen, f);
  }*/

  constructor(
    protected _next: (v?: any) => IIteratorResult<Yield>
  ) {

  }

  next(v?: any): IIteratorResult<Yield> {
    const done = this._done;
    return IteratorResultCreate(done, done ? undefined : this._next(v).value);
  }

  return(v: Yield): IIteratorResult<Yield> {
    const done = this._done;
    let value: Yield;
    if (!done) {
      this._done = true;
      value = v;
    }
    return IteratorResultCreate(done, value);
  }

  throw(e: any): IIteratorResult<Yield> {
    throw e;
  }
}
