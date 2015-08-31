//Symbol
const $$value = "value"
const $$error = "error"

interface IResult<T> {
  value?: T
  error?: any
}

//ECMA like functions
function Equals(lhs: any, rhs: any): boolean {
  return lhs === rhs
}

function IsResult<T>(r: any): boolean {
  return r instanceof Result
}

function ResultIsSuccess<T>(r: IResult<T>): boolean {
  return r && r.hasOwnProperty($$value)
}

function ResultIsFailure<T>(r: IResult<T>): boolean {
  return r && r.hasOwnProperty($$error)
}

function ResultFunctionApply<R>(f: any, args: any): Result<R> {
  let result: Result<any>
  let isFailure = false
  let value: any
  let error: any
  let argc = args && args.length || 0
  try {
    switch (argc) {
      case 0:
        value = f()
        break
      default:
        value = f.apply(null, args)
    }
  } catch (e) {
    isFailure = true
    error = e
  }
  return isFailure ? ResultCreateFailure(error) : ResultCreateSuccess(value)
}

function ResultCreateSuccess<V>(v: V): Result<V> {
  let r = new Result<V>()
  r.value = v
  return r
}

function ResultCreateFailure(e: any): Result<any> {
  let r = new Result<any>()
  r.error = e
  return r
}

function ResultGet<T>(r: IResult<T>): T {
  if (ResultIsSuccess(r)) {
    return r.value
  } else {
    throw r.error
  }
}

/*
function flatMap<T, U>(r: IResult<T>, f: (v: T) => IResult<U>): Result<U> {
  return ResultIsSuccess(r) ? f(r.value) : <any>r;
}*/

function ResultTransform<T, R>(r: IResult<T>, onSuccess?: (v: T) => R | Result<R>, onFailure?: (e: any) => R | Result<R> | void): Result<R> {
  let returnValue = <any>r
  if (ResultIsSuccess(this)) {
    try {
      returnValue = ResultCreateSuccess(onSuccess(r.value))
    } catch (e) {
      returnValue = ResultCreateFailure(e)
    }
  } else {
    if (onFailure !== null) {
      try {
        returnValue = ResultCreateSuccess(onFailure(r.error))
      } catch (e) {
        returnValue = ResultCreateFailure(e)
      }
    }
  }
  return returnValue
}

export default class Result<T> implements IResult<T> {
  value: T
  error: any

  static success<V>(v: V): Result<V> {
    return ResultCreateSuccess(v)
  }

  static failure(e: any): Result<any> {
    return ResultCreateFailure(e)
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
    return ResultFunctionApply(fn, args)
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
    return ResultFunctionApply(f, args)
  }

  static isResult<S>(r: any): boolean {
    return IsResult(r)
  }

  static isSuccess<S>(r: IResult<S>): boolean {
    return ResultIsSuccess(r)
  }

  static isFailure<S>(r: IResult<S>): boolean {
    return ResultIsFailure(r)
  }

  isSuccess(): boolean {
    return ResultIsSuccess(this)
  }

  isFailure(): boolean {
    return ResultIsFailure(this)
  }

  equals(o: any): boolean {
    return IsResult(o) && (ResultIsSuccess(this) ? Equals(this.value, o.value) : Equals(this.error, o.error))
  }

  /*
  filter(p: (v: T) => boolean): Result<T> {
    let returnValue = this;
    if (this.isSuccess()) {

    }

    return filter(this, p);
  }*/

  map<U>(f: (v: T) => U): Result<U> {
    return ResultIsSuccess(this) ? ResultCreateSuccess(f(this.value)) : <any>this
  }

  /*
  flatMap<U>(f: (v: T) => Result<U>): Result<U> {
    return this._isSuccess ? f(this.failure) : <any>this
  }*/

  get(): T {
    return ResultGet(this)
  }

  then<R>(onSuccess?: (value: T) => R | Result<R>, onFailure?: (error: any) => R | Result<R> | void): Result<R> {
    return ResultTransform(this, onSuccess, onFailure)
  }

  catch<R>(onFailure: (error: any) => R | Result<R>): Result<R> {
    return ResultTransform(this, null, onFailure)
  }

  inspect() {
    return ResultIsSuccess(this) ?
      "Success { " + this.value + " }" :
      "Failure { " + this.error + " }"
  }

  toString() {
    return this.inspect()
  }
}
