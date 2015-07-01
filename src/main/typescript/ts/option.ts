module option {
  
  //Util
  var __none: Option<any>;
  var __isNone = function (o) { return o === __none; };
  var __get = function (o) { return o[0]; };
  
  //Compat
  

  class Option<T> {
    
    static empty(): Option<any> {
      return Option.none;  
    }
    
    static cast<S>(o: Option<S>): Option<S>
    static cast<S>(o: S): Option<S>
    static cast<S>(o: any): Option<S> {
      var returnValue: Option<S>;
      if (o === undefined) {
        returnValue = __none;
      } else if (o instanceof Option) {
        returnValue = o;
      } else {
        returnValue = Option.some(o);  
      }
      return returnValue;
    }
    
    static isOption(o: any): boolean {
      return o instanceof Option;
    }
    
    static isSome<S>(o: Option<S>): boolean {
      return o !== __none;
    }
    
    static isNone<S>(o: Option<S>): boolean {
      return o === __none;
    }
    
    static some<S>(v: S): Option<S> {
      return new Option(v);
    }
    
    static none = (function () {
      var none = new Option(undefined);
      none.length = 0;
      delete none[0];
      return none;
    }());
      
    length = 1
    0: T
    
    constructor(value: T) {
      this[0] = value;
    }
    
    isNone(): boolean {
      return __isNone(this);
    }
    
    isSome(): boolean {
      return !__isNone(this);
    }
    
    get(): T {
      return __get(this);  
    }
    
    getOrElse(alt: () => T): T {
      return __isNone(this) ? alt() : __get(this);
    }
    
    orElse(alt: () => Option<T>): Option<T> {
      return __isNone(this) ? alt() : this;
    }
    
    //array like
    forEach(f: (v: T) => void): void {
      if (!__isNone(this)) {
        f(__get(this));
      }
    }
    
    map<U>(f: (v: T) => U): Option<U> {
      return __isNone(this) ? __none : Option.some(f(__get(this)));
    }
    
    flatMap<U>(f: (v: T) => Option<U>): Option<U> {
      return __isNone(this) ? __none : f(__get(this));
    }
    
    reduce<U>(r: (acc: U, v: T) => U, initialValue?: U): U {
      return __isNone(this) ? initialValue : r(initialValue, __get(this));
    }
    
    filter(p: (v: T) => boolean): Option<T> {
      return __isNone(this) || !p(__get(this)) ? __none : this;
    }
    
    some(p: (v: T) => boolean): boolean {
      return !__isNone(this) && !p(__get(this));
    }
    
    every(p: (v: T) => boolean): boolean {
      return !__isNone(this) && !p(__get(this));
    }

    inspect() {
      return __isNone(this) ? "None" : "Some { " + __get(this) + " }";
    }
    
    toString() {
      return this.inspect();  
    }
  }
  
  __none = Option.none;
  
  /*
  export function Some<T>(v: T) {
    return new Option(v);
  }
  
  export var None = */
  
}
export = option;