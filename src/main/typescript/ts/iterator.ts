//Ecma like
function IteratorCreate<T>(next: () => IIteratorResult<T>, hint?) {
  return new Iterator(next, hint);  
}

function IteratorResultCreate<T>(done: boolean, value: T) {
  return { done: done, value: value };  
}

export interface IIterator<T> {
  next(): IIteratorResult<T>
}

export interface IIteratorResult<T> {
  value: T;
  done: boolean;
}


export class Iterator<T> implements IIterator<T> {
  
  constructor(public next: () => IIteratorResult<T>, public hint = "abstract") { }
  
  inspect() { return "Iterator { [" + this.hint + "] }";}
  
  toString() {
    return this.inspect();
  }
}

var EMPTY: Iterator<any> = IteratorCreate(function () { 
  return IteratorResultCreate(true, undefined); 
}, "empty");

export function isIIterator(o: any): boolean {
  return !!o && typeof o.next === "function";
}

export function result<T>(value?: T) {
  return { done: arguments.length > 0, value: value };  
}

export function empty(): Iterator<any> {
  return EMPTY;
}

export function single<T>(v: T): Iterator<T> {
  var done = false;
  var value = v;
  return IteratorCreate(function () {
    var result = IteratorResultCreate(done, value);
    if (!done) {
      done = true;
      value = undefined;
    }
    return result;
  }, "single");
}

export function fill<T>(length: number, v: T): Iterator<T> {
  var i = 0;
  var done = false;
  var value = v;
  return IteratorCreate(function () {
    if (i < length) {
      i += 1;
    } else {
      done = true;
      value = undefined;
    }
    return IteratorResultCreate(done, value); 
  });  
}

export function iterate<T>(start: T, f: (v: T) => T): Iterator<T> {
  var first = true;
  var acc: T;
  
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

export function range(start: number, end: number, step = 1): Iterator<number> {
  var index = start;
  var done = false;
  return IteratorCreate(function () {
    var value: number;
    if (index < end) {
      value = index;
      index += step;
    } else {
      done = true;
    }
    return IteratorResultCreate(done, value);
  }, "[" + start + "," + end + ")");
}

export function continually<T>(v: T): Iterator<T> {
  return IteratorCreate(function () {
    return IteratorResultCreate(false, v);
  }, "continue");
}

export function concat<T>(...args: IIterator<T>[]): Iterator<T> {
  var argi = 0;
  var argc = args.length;
  var current = args[argi];
  var done = false;
  
  return IteratorCreate(function () {
    var r: IIteratorResult<T>;
    if (!done) {
      while (true) {
        if (current) {
          r = current.next();
          if (r.done) {
            args[argi] = null;//free reference;
            current = args[++argi];
          } else {
            break;
          }
        } else if (argi < argc) {
          args[argi] = null;//free reference;
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