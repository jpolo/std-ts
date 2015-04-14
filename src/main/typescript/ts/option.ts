module option {
  
  //Util
  var __none: Option<any>;
  var __isNone = function (o) { return o === __none };
  var __get = function (o) { return o[0]; };
  
  //Compat
  
  
  class Option<T> {
    
    static empty(): Option<any> {
      return __none;  
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
        returnValue = new Option(o);  
      }
      return returnValue;
    }
    
    
    length = 1
    
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
      return __isNone(this) ? __none : new Option(f(__get(this)));
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
  

  
  export function some<T>(v: T) {
    return new Option(v);
  }
  
  export var none = __none = new Option(undefined);
  __none.length = 0;
  
}
export = option;