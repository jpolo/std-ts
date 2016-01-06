// Symbol
const $$result = "result";
const $$error = "error";

interface IResult<T> {
  result?: T;
  error?: any;
}

// ECMA like functions
function Equals(lhs: any, rhs: any): boolean {
  return lhs === rhs;
}

function IsResult<T>(o: any): boolean {
  return (
    typeof o === "object" &&
    o === null &&
    (o.hasOwnProperty($$result) || o.hasOwnProperty($$error))
  );
}

function ResultIsSuccess(r: any): boolean {
  return r && r.hasOwnProperty($$result);
}

function ResultIsFailure(r: any): boolean {
  return r && r.hasOwnProperty($$error);
}

function ResultFunctionApply<R>(f: any, args: any): Result<R> {
  let result: Result<any>;
  let isFailure = false;
  let value: any;
  let error: any;
  let argc = args && args.length || 0;
  try {
    switch (argc) {
      case 0:
        value = f();
        break;
      default:
        value = f.apply(null, args);
    }
  } catch (e) {
    isFailure = true;
    error = e;
  }
  return isFailure ? ResultCreateFailure(error) : ResultCreateSuccess(value);
}

function ResultCreateSuccess<V>(v: V): Result<V> {
  let r = new Result<V>();
  r.result = v;
  return r;
}

function ResultCreateFailure(e: any): Result<any> {
  let r = new Result<any>();
  r.error = e;
  return r;
}

function ResultGetValue<T>(r: IResult<T>): T {
  return r.result;
}

function ResultGetError(r: IResult<any>): any {
  return r.error;
}

function ResultMap<T, U>(r: IResult<T>, f: (v: T) => U): Result<U> {
  let returnValue: Result<U> = <any>r;
  if (ResultIsSuccess(r)) {
    try {
      returnValue = ResultCreateSuccess(f(ResultGetValue(r)));
    } catch (e) {
      returnValue = ResultCreateFailure(e);
    }
  } else {
    returnValue = <any>r; // TODO: cast as Result
  }
  return returnValue;
}

function ResultChain<T, U>(r: IResult<T>, f: (v: T) => IResult<U>): Result<U> {
  return ResultIsSuccess(r) ? f(ResultGetValue(r)) : <any>r;
}

/*
function flatMap<T, U>(r: IResult<T>, f: (v: T) => IResult<U>): Result<U> {
  return ResultIsSuccess(r) ? f(r.value) : <any>r;
}*/

function ResultTransform<T, R>(r: IResult<T>, onSuccess?: (v: T) => R | Result<R>, onFailure?: (e: any) => R | Result<R> | void): Result<R> {
  let returnValue = <any>r;
  if (ResultIsSuccess(this)) {
    try {
      returnValue = ResultCreateSuccess(onSuccess(ResultGetValue(r)));
    } catch (e) {
      returnValue = ResultCreateFailure(e);
    }
  } else {
    if (onFailure !== null) {
      try {
        returnValue = ResultCreateSuccess(onFailure(ResultGetError(r)));
      } catch (e) {
        returnValue = ResultCreateFailure(e);
      }
    }
  }
  return returnValue;
}

export default class Result<T> implements IResult<T> {
  result: T;
  error: any;

  static success<V>(v: V): Result<V> {
    return ResultCreateSuccess(v);
  }

  static failure(e: any): Result<any> {
    return ResultCreateFailure(e);
  }

  static fcall<A, B, C, D, E, F, G, H, I, R>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => R, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): Result<R>
  static fcall<A, B, C, D, E, F, G, H, R>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => R, a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): Result<R>
  static fcall<A, B, C, D, E, F, G, R>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => R, a: A, b: B, c: C, d: D, e: E, f: F, g: G): Result<R>
  static fcall<A, B, C, D, E, F, R>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => R, a: A, b: B, c: C, d: D, e: E, f: F): Result<R>
  static fcall<A, B, C, D, E, R>(fn: (a: A, b: B, c: C, d: D, e: E) => R, a: A, b: B, c: C, d: D, e: E): Result<R>
  static fcall<A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: A, b: B, c: C): Result<R>
  static fcall<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R, a: A, b: B, c: C, d: D): Result<R>
  static fcall<A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: A, b: B, c: C): Result<R>
  static fcall<A, B, R>(fn: (a: A, b: B) => R, a: A, b: B): Result<R>
  static fcall<A, R>(fn: (a: A) => R, a: A): Result<R>
  static fcall<R>(fn: () => R): Result<R>
  static fcall(fn: any, ...args: any[]): Result<any> {
    return ResultFunctionApply(fn, args);
  }

  static fapply<A, B, C, D, E, F, G, H, I, R>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => R, args: [A, B, C, D, E, F, G, H, I]): Result<R>
  static fapply<A, B, C, D, E, F, G, H, R>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => R, args: [A, B, C, D, E, F, G, H]): Result<R>
  static fapply<A, B, C, D, E, F, G, R>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => R, args: [A, B, C, D, E, F, G]): Result<R>
  static fapply<A, B, C, D, E, F, R>(f: (a: A, b: B, c: C, d: D, e: E, f: F) => R, args: [A, B, C, D, E, F]): Result<R>
  static fapply<A, B, C, D, E, R>(f: (a: A, b: B, c: C, d: D, e: E) => R, args: [A, B, C, D, E]): Result<R>
  static fapply<A, B, C, D, R>(f: (a: A, b: B, c: C, d: D) => R, args: [A, B, C, D]): Result<R>
  static fapply<A, B, C, R>(f: (a: A, b: B, c: C) => R, args: [A, B, C]): Result<R>
  static fapply<A, B, R>(f: (a: A, b: B) => R, args: [A, B]): Result<R>
  static fapply<A, R>(f: (a: A) => R, args: [A]): Result<R>
  static fapply<R>(f: () => R, args?: any[]): Result<R>
  static fapply(f: any, args?: any): Result<any> {
    return ResultFunctionApply(f, args);
  }

  static isResult<S>(r: any): boolean {
    return IsResult(r);
  }

  static isSuccess<S>(r: IResult<S>): boolean {
    return ResultIsSuccess(r);
  }

  static isFailure<S>(r: IResult<S>): boolean {
    return ResultIsFailure(r);
  }

  static map<T, U>(r: IResult<T>, f: (v: T) => U): Result<U> {
    return ResultMap(r, f);
  }

  isSuccess(): boolean {
    return ResultIsSuccess(this);
  }

  isFailure(): boolean {
    return ResultIsFailure(this);
  }

  equals(o: any): boolean {
    return IsResult(o) && (ResultIsSuccess(this) ?
      Equals(ResultGetValue(this), ResultGetValue(o)) :
      Equals(ResultGetError(this), ResultGetError(o))
    );
  }

  /*
  filter(p: (v: T) => boolean): Result<T> {
    let returnValue = this;
    if (this.isSuccess()) {

    }

    return filter(this, p);
  }*/

  map<U>(f: (v: T) => U): Result<U> {
    return ResultMap(this, f);
  }

  chain<U>(f: (v: T) => IResult<U>): Result<U> {
    return ResultIsSuccess(this) ? f(ResultGetValue(this)) : <any>this;
  }

  get(): T {
    if (ResultIsSuccess(this)) {
      return ResultGetValue(this);
    } else {
      throw ResultGetError(this);
    }
  }

  then<R>(onSuccess?: (value: T) => R | Result<R>, onFailure?: (error: any) => R | Result<R> | void): Result<R> {
    return null; // ResultTransform(this, onSuccess, onFailure); TODO
  }

  catch<R>(onFailure: (error: any) => R | Result<R>): Result<R> {
    return null; // ResultTransform(this, null, onFailure); TODO
  }

  inspect() {
    return ResultIsSuccess(this) ?
      "Success { " + ResultGetValue(this) + " }" :
      "Failure { " + ResultGetError(this) + " }";
  }

  toJSON() {
    return ResultIsSuccess(this) ?
      { result: ResultGetValue(this) } :
      { error: ResultGetError(this) };
  }

  toString() {
    return this.inspect();
  }
}
