module iterator {
  
  export interface IIterator<T> {
    next(): IIteratorResult<T>
  }
  
  export interface IIteratorResult<T> {
    value: T;
    done: boolean;
  }
  
  function $iteratorFactory<T>(next: () => IIteratorResult<T>, hint?) {
    return new Iterator(next, hint);  
  }
  
  function $iteratorResultFactory<T>(done: boolean, value: T) {
    return { done: done, value: value };  
  }
  
  export class Iterator<T> implements IIterator<T> {
    
    constructor(public next: () => IIteratorResult<T>, public hint = "abstract") { }
    
    inspect() { return "Iterator { [" + this.hint + "] }";}
    
    toString() {
      return this.inspect();
    }
  }
  
  var EMPTY: Iterator<any> = $iteratorFactory(function () { 
    return $iteratorResultFactory(true, undefined); 
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
    return $iteratorFactory(function () {
      var result = $iteratorResultFactory(done, value);
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
    return $iteratorFactory(function () {
      if (i < length) {
        i += 1;
      } else {
        done = true;
        value = undefined;
      }
      return $iteratorResultFactory(done, value); 
    });  
  }
  
  export function iterate<T>(start: T, f: (v: T) => T): Iterator<T> {
    var first = true;
    var acc: T;
    
    return $iteratorFactory(function () { 
      if (first) {
        acc = start;
        first = false;
      } else {
        acc = f(acc);  
      }
      return $iteratorResultFactory(false, acc);
    }, "iterate");
  }
  
  export function range(start: number, end: number, step = 1): Iterator<number> {
    var index = start;
    var done = false;
    return $iteratorFactory(function () {
      var value: number;
      if (index < end) {
        value = index;
        index += step;
      } else {
        done = true;
      }
      return $iteratorResultFactory(done, value);
    }, "[" + start + "," + end + ")");
  }
  
  export function continually<T>(v: T): Iterator<T> {
    return $iteratorFactory(function () {
      return $iteratorResultFactory(false, v);
    }, "continue");
  }
  
  export function concat<T>(...args: IIterator<T>[]): Iterator<T> {
    var argi = 0;
    var argc = args.length;
    var current = args[argi];
    var done = false;
    
    return $iteratorFactory(function () {
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
        r = $iteratorResultFactory(done, undefined);  
      }
      return r;
    }, "concatenated");
  }
  
}
export = iterator;