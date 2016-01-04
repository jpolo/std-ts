import { IIterableIterator, IIteratorResult } from "./iterator";


export interface IGenerator<Yield, Next> extends IIterableIterator<Yield> {
  next(value?: Next): IIteratorResult<Yield>;
  return(value?: any): IIteratorResult<Yield>;
  throw(error: any): IIteratorResult<Yield>;
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

function GeneratorCreate<T, Next>(f: { (v?: Next): IIteratorResult<T> }): Generator<T, Next> {
  return new Generator(f);
}

function GeneratorNext<T, Next>(gen: IGenerator<T, Next>, v?: Next): IIteratorResult<T> {
  return gen.next(v);
}

function GeneratorMap<T, U, Next>(gen: IGenerator<T, Next>, f: (v: T) => IIteratorResult<U>): Generator<U, Next> {
  return GeneratorCreate(function (v?: Next) {
    let iterResult = GeneratorNext(gen, v);
    let iterMapped: IIteratorResult<U> = iterResult.done ? <any>iterResult : f(iterResult.value);
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

export class Generator<Yield, Next> implements IGenerator<Yield, Next> {
  protected _done = false;

  static isGenerator(o: any): boolean {
    return IsGenerator(o);
  }

  static map<T, U, Next>(gen: IGenerator<T, Next>, f: (v: T) => IIteratorResult<U>): Generator<U, Next> {
    return GeneratorMap(gen, f);
  }
/*
  static chain<T, U>(gen: IGenerator<T>, f: (v: T) => IGenerator<U>): Generator<U> {
    return GeneratorChain(gen, f);
  }*/

  constructor(
    protected _next: { (v?: Next): IIteratorResult<Yield> }
  ) {

  }

  next(v?: Next): IIteratorResult<Yield> {
    let done = this._done;
    return IteratorResultCreate(done, done ? undefined : this._next(v).value);
  }

  return(v: Yield): IIteratorResult<Yield> {
    let done = this._done;
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
