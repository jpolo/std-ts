
// Util
let __none: Option<any>;

// ECMA like spec
function IsOption(o: any) {
  return o instanceof Option;
}

function OptionIsNone(o: Option<any>): boolean {
  return o === __none;
}

function OptionCreate<T>(v: T): Option<T> {
  return new Option(v);
}

function OptionGet<T>(o: Option<T>): T {
  return o[0];
}

export default class Option<T> {

  static empty(): Option<any> {
    return __none;
  }

  static cast<S>(o: Option<S>): Option<S>
  static cast<S>(o: S): Option<S>
  static cast<S>(o: any): Option<S> {
    let returnValue: Option<S>;
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
    return IsOption(o);
  }

  static isSome<S>(o: Option<S>): boolean {
    return !OptionIsNone(o);
  }

  static isNone<S>(o: Option<S>): boolean {
    return OptionIsNone(o);
  }

  static some<S>(v: S): Option<S> {
    return new Option(v);
  }

  static none = (function () {
    let none = new Option(undefined);
    none.length = 0;
    delete none[0];
    return none;
  }());

  length = 1;
  0: T;

  constructor(value: T) {
    this[0] = value;
  }

  isNone(): boolean {
    return OptionIsNone(this);
  }

  isSome(): boolean {
    return !OptionIsNone(this);
  }

  get(): T {
    return OptionGet(this);
  }

  getOrElse(alt: () => T): T {
    return OptionIsNone(this) ? alt() : OptionGet(this);
  }

  orElse(alt: () => Option<T>): Option<T> {
    return OptionIsNone(this) ? alt() : this;
  }

  // array like
  forEach(f: (v: T) => void): void {
    if (!OptionIsNone(this)) {
      f(OptionGet(this));
    }
  }

  map<U>(f: (v: T) => U): Option<U> {
    return OptionIsNone(this) ? __none : Option.some(f(OptionGet(this)));
  }

  flatMap<U>(f: (v: T) => Option<U>): Option<U> {
    return OptionIsNone(this) ? __none : f(OptionGet(this));
  }

  reduce<U>(r: (acc: U, v: T) => U, initialValue?: U): U {
    return OptionIsNone(this) ? initialValue : r(initialValue, OptionGet(this));
  }

  filter(p: (v: T) => boolean): Option<T> {
    return OptionIsNone(this) || !p(OptionGet(this)) ? __none : this;
  }

  some(p: (v: T) => boolean): boolean {
    return !OptionIsNone(this) && !p(OptionGet(this));
  }

  every(p: (v: T) => boolean): boolean {
    return !OptionIsNone(this) && !p(OptionGet(this));
  }

  inspect() {
    return OptionIsNone(this) ? "None" : "Some { " + OptionGet(this) + " }";
  }

  toString() {
    return this.inspect();
  }
}

__none = Option.none;
