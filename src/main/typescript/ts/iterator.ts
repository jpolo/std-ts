module iterator {
  
  export interface IIterator<T> {
    next(): IIteratorResult<T>
  }
  
  export interface IIteratorResult<T> {
    value: T;
    done: boolean;
  }
  
  function _iteratorCreate<T>(next: () => IIteratorResult<T>): IIterator<T> {
    return new Iterator(next);  
  }
  
  function _iteratorResult<T>(done: boolean, value?: T): IIteratorResult<T> {
    return { done: done, value: value };  
  }
  
  class Iterator<T> {
    
    constructor(public next: () => IIteratorResult<T>, public hint = "abstract iterator") { }
    
    inspect() { return "Iterator { [" + this.hint + "] }";}
    
    toString() {
      return this.inspect();
    }
  }
  
  var EMPTY = _iteratorCreate(function () { return _iteratorResult(true); });
  
  export function empty(): IIterator<any> {
    return EMPTY;
  }
  
  export function single<T>(v: T): IIterator<T> {
    var done = false;
    var value = v;
    return _iteratorCreate(function () {
      var result = _iteratorResult(done, value);
      if (!done) {
        done = true;
        value = undefined;
      }
      return result;
    });
  }
  
  export function fill<T>(length: number, v: T): IIterator<T> {
    var i = 0;
    var done = false;
    var value = v;
    return _iteratorCreate(function () {
      if (i < length) {
        i += 1;
      } else {
        done = true;
        value = undefined;
      }
      return _iteratorResult(done, value); 
    });  
  }
  
  export function iterate<T>(start: T, f: (v: T) => T): IIterator<T> {
    var first = true;
    var acc: T;
    
    return _iteratorCreate(function () { 
      if (first) {
        acc = start;
        first = false;
      } else {
        acc = f(acc);  
      }
      return _iteratorResult(false, acc);
    });
  }
  
  export function range(start: number, end: number, step = 1): IIterator<number> {
    var index = start;
    var done = false;
    return _iteratorCreate(function () {
      var value: number;
      if (index < end) {
        value = index;
        index += step;
      } else {
        done = true;
      }
      return _iteratorResult(done, value);
    });
  }
  
  export function continually<T>(v: T): IIterator<T> {
    return _iteratorCreate(function () {
      return _iteratorResult(false, v);
    });
  }
  
  export function concat<T>(...args: IIterator<T>[]): IIterator<T> {
    var argi = 0;
    var argc = args.length;
    var current = args[argi];
    var done = false;
    
    return _iteratorCreate(function () {
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
        r = _iteratorResult(done, undefined);  
      }
      return r;
    });
  }
  
}
export = iterator;