// Interface
export interface IIterator<T> {
  next(value?: any): IIteratorResult<T>;
  return?<U>(value?: U): IIteratorResult<U>;
  throw?(e?: any): IIteratorResult<T>;
}

export interface IIterableIterator<T> extends IIterator<T> {
  // TODO: symbol
}

export interface IIteratorResult<T> {
  value: T;
  done: boolean;
}

// Ecma like
function IsIterator(o: any): boolean {
  return typeof o === "object" && o !== null && typeof o.next === "function";
}

function IteratorCreate<T>(next: () => IIteratorResult<T>, hint?) {
  return new Iterator(next, hint);
}

function IteratorResultCreate<T>(done: boolean, value: T) {
  return { done: done, value: value };
}

function IteratorCreateEmpty(hint?: string): Iterator<any> {
  return IteratorCreate(function () {
    return IteratorResultCreate(true, undefined);
  }, hint);
}

function IteratorRepeat<T>(length: number, v: T, hint?: string): Iterator<T> {
  let i = 0;
  let done = false;
  let value = v;
  return (
    // Empty?
    length <= 0 ? IteratorCreateEmpty(hint) :

    // Continually?
    length === Infinity ? IteratorCreate(function () {
      return IteratorResultCreate(false, value);
    }, hint) :

    // Repeat
    IteratorCreate(function () {
      if (i < length) {
        i += 1;
      } else {
        done = true;
        value = undefined;
      }
      return IteratorResultCreate(done, value);
    }, hint)
  );
}

export class Iterator<T> implements IIterator<T> {

  static empty(): Iterator<any> {
    return IteratorCreateEmpty("empty");
  }

  static single<T>(v: T): Iterator<T> {
    return IteratorRepeat(1, v, "single");
  }

  static fill<T>(length: number, v: T): Iterator<T> {
    return IteratorRepeat(length, v, "fill");
  }

  static continually<T>(v: T): Iterator<T> {
    return IteratorRepeat(Infinity, v, "continue");
  }

  static concat<T>(...args: IIterator<T>[]): Iterator<T> {
    let argi = 0;
    let argc = args.length;
    let current = args[argi];
    let done = false;

    return IteratorCreate(function () {
      let r: IIteratorResult<T>;
      if (!done) {
        while (true) {
          if (current) {
            r = current.next();
            if (r.done) {
              args[argi] = null; // free reference;
              current = args[++argi];
            } else {
              break;
            }
          } else if (argi < argc) {
            args[argi] = null; // free reference;
            current = args[++argi];
          } else {
            done = true;
            break;
          }
        }
      } else {
        r = IteratorResultCreate(done, undefined);
      }
      return r;
    }, "concatenated");
  }

  static isIterator(o: any): boolean {
    return IsIterator(o);
  }

  static iterate<T>(start: T, f: (v: T) => T): Iterator<T> {
    let first = true;
    let acc: T;

    return IteratorCreate(function () {
      if (first) {
        acc = start;
        first = false;
      } else {
        acc = f(acc);
      }
      return IteratorResultCreate(false, acc);
    }, "iterate");
  }

  static range(start: number, end: number, step = 1): Iterator<number> {
    let index = start;
    let done = false;
    return IteratorCreate(function () {
      let value: number;
      if (index < end) {
        value = index;
        index += step;
      } else {
        done = true;
      }
      return IteratorResultCreate(done, value);
    }, "[" + start + "," + end + ")");
  }

  constructor(public next: () => IIteratorResult<T>, public hint = "abstract") { }

  inspect() { return `Iterator { [${this.hint}] }`; }

  toString() {
    return this.inspect();
  }
}

export function isIIterator(o: any): boolean {
  return IsIterator(o);
}

export function result<T>(value?: T) {
  return IteratorResultCreate(arguments.length > 0, value);
}

export function empty(): Iterator<any> {
  return Iterator.empty();
}

export function single<T>(v: T): Iterator<T> {
  return Iterator.single(v);
}

export function fill<T>(length: number, v: T): Iterator<T> {
  return Iterator.fill(length, v);
}

export function iterate<T>(start: T, f: (v: T) => T): Iterator<T> {
  return Iterator.iterate(start, f);
}

export function range(start: number, end: number, step = 1): Iterator<number> {
  return Iterator.range(start, end, step);
}

export function continually<T>(v: T): Iterator<T> {
  return Iterator.continually(v);
}

export function concat<T>(...args: IIterator<T>[]): Iterator<T> {
  return Iterator.concat.apply(null, args);
}
