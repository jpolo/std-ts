module iterator {
  
  export interface IIterator<T> {
    next(): IIteratorResult<T>
  }
  
  export interface IIteratorResult<T> {
    value: T;
    done: boolean;
  }
  
  function iteratorCreate<T>(next: () => IIteratorResult<T>): IIterator<T> {
    return { next: next };  
  }
  
  function iteratorResult<T>(done: boolean, value?: T): IIteratorResult<T> {
    return { done: done, value: value };  
  }
  
  var EMPTY = iteratorCreate(function () { return iteratorResult(true); });
  
  export function empty(): IIterator<any> {
    return EMPTY;
  }
  
  export function single<T>(v: T): IIterator<T> {
    var done = false;
    var value = v;
    return iteratorCreate(function () {
      var result = iteratorResult(done, value);
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
    return iteratorCreate(function () {
      if (i < length) {
        i += 1;
      } else {
        done = true;
        value = undefined;
      }
      return iteratorResult(done, value); 
    });  
  }
  
  export function iterate<T>(start: T, f: (v: T) => T): IIterator<T> {
    var first = true;
    var acc: T;
    
    return iteratorCreate(function () { 
      if (first) {
        acc = start;
        first = false;
      } else {
        acc = f(acc);  
      }
      return iteratorResult(false, acc);
    });
  }
  
  function range(start: number, end: number, step = 1): IIterator<number> {
    var index = start;
    var done = false;
    return iteratorCreate(function () {
      var value = NaN;
      if (index < end) {
        value = index;
        index += step;
      } else {
        done = true;
      }
      return iteratorResult(done, value);
    });
  }
  
  function continually<T>(v: T): IIterator<T> {
    return iteratorCreate(function () {
      return iteratorResult(false, v);
    });
  }
  
}
export = iterator;