// Util
interface IOption<T> {
  0?: T;
  length: number;
}

// ECMA like spec
function IsOption(o: any) {
  return o instanceof Option;
}

function OptionIsNone(o: IOption<any>): boolean {
  return o.length === 0;
}

function OptionCreate<T>(v: T): Option<T> {
  return new Option(v);
}

function OptionGet<T>(o: IOption<T>): T {
  return o[0];
}

function OptionMap<T, U>(o: IOption<T>, f: (v: T) => U): Option<U> {
  return OptionIsNone(o) ? <any>o : OptionCreate(f(OptionGet(o)));
}

function OptionChain<T, U>(o: IOption<T>, f: (v: T) => Option<U>): Option<U> {
  return OptionIsNone(o) ? <any>o : f(OptionGet(o));
}

export default class Option<T> {

  static empty(): Option<any> {
    return Option.none;
  }

  static cast<S>(o: Option<S>): Option<S>
  static cast<S>(o: S): Option<S>
  static cast<S>(o: any): Option<S> {
    let returnValue: Option<S>;
    if (o === undefined || o === null) {
      returnValue = Option.none;
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
    return OptionMap(this, f);
  }

  chain<U>(f: (v: T) => Option<U>): Option<U> {
    return OptionChain(this, f);
  }

  reduce<U>(r: (acc: U, v: T) => U, initialValue?: U): U {
    return OptionIsNone(this) ? initialValue : r(initialValue, OptionGet(this));
  }

  filter(p: (v: T) => boolean): Option<T> {
    return OptionIsNone(this) || !p(OptionGet(this)) ? Option.none : this;
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
