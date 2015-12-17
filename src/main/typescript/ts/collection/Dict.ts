// Interfaces
export interface IDictLike<T> {
  clear(): void;
  key(i: number): string;
  getItem(key: string): T;
  length: number;
  setItem(key: string, value: T): void;
  removeItem(key: string): void;
}

export interface IDict<T> {
   [key: string]: T;
}

// ECMA like spec
function IsObject(o: any) {
  return typeof o === "object";
}

function IsNumber(o: any) {
  return typeof o === "number";
}

function IsFunction(o: any) {
  return typeof o === "function";
}

function IsDictLike(o) {
  return IsObject(o) && IsFunction(o.getItem) && IsFunction(o.setItem) && IsNumber(o.length);
}

function OwnKeys(o: any): string[] {
  let keys: string[];
  if (Object.keys) {
    keys = Object.keys(o);
  } else {
    keys = [];
    for (let prop in o) { if (o.hasOwnProperty(prop)) { keys.push(prop); } };
  }
  return keys;
}

function HasOwn(o: {}, property: string) {
  return o.hasOwnProperty(property);
}

export default class Dict<T> {

  static clear<S>(d: IDictLike<S>): void
  static clear<S>(d: IDict<S>): void
  static clear<S>(d: any): void {
    if (IsDictLike(d)) {
      d.clear();
    } else {
      let keys = OwnKeys(d);
      for (let key of keys) {
        delete d[key];
      }
    }
  }

  static has<S>(d: IDictLike<S>, key: string): boolean
  static has<S>(d: IDict<S>, key: string): boolean
  static has<S>(d: any, key: string): boolean {
    return IsObject(d) && (IsDictLike(d) ? d.getItem(key) !== undefined : HasOwn(d, key));
  }

  static get<S>(d: IDictLike<S>, key: string): S
  static get<S>(d: IDict<S>, key: string): S
  static get<S>(d: any, key: string): S {
    return IsObject(d) && (IsDictLike(d) ? d.getItem(key) : d[key]);
  }

  static isDict<S>(d: any): boolean {
    return (d instanceof Dict) || IsDictLike(d);
  }

  static iterator<S>(d: IDictLike<S>): DictIterator<S>
  static iterator<S>(d: IDict<S>): DictIterator<S>
  static iterator<S>(d: any): DictIterator<S> {
    return new DictIterator(d);
  }

  static key<S>(d: IDictLike<S>, index: number): string
  static key<S>(d: IDict<S>, index: number): string
  static key<S>(d: any, index: number): string {
    return IsObject(d) && (IsDictLike(d) ? d.key(index) : OwnKeys(d)[index]);
  }

  static set<S>(d: IDictLike<S>, key: string, value: S): void
  static set<S>(d: IDict<S>, key: string, value: S): void
  static set<S>(d: any, key: string, value: S): void {
    if (IsObject(d)) {
      if (IsDictLike(d)) {
        d.setItem(d, key);
      } else {
        d[key] = value;
      }
    }
  }

  static setDefault<S>(d: IDictLike<S>, key: string, defaultValue?: S): S
  static setDefault<S>(d: IDict<S>, key: string, defaultValue?: S): S
  static setDefault<S>(d: any, key: string, defaultValue?: S): S {
    let returnValue = defaultValue;
    if (IsObject(d)) {
      if (IsDictLike(d)) {
        if (d.getItem(key) !== undefined) {
          returnValue = d.getItem(key);
        } else {
          d.setItem(key, defaultValue);
        }
      } else {
        if (HasOwn(d, key)) {
          returnValue = d[key];
        } else {
          d[key] = defaultValue;
        }
      }
    }
    return returnValue;
  }

  static size<S>(d: IDictLike<S>): number
  static size<S>(d: IDict<S>): number
  static size<S>(d: any): number {
    let length: number;
    return (
      !IsObject(d) ? NaN :
      IsNumber(length = d.length) ? length :
      OwnKeys(d).length
    );
  }

  static update<S>(d: IDict<S>|IDictLike<S>, ext: IDict<S>|IDictLike<S>): void
  static update<S>(d: any, ext: any): void {
    let iter = Dict.iterator(ext);
    let iterResult;
    while (!(iterResult = iter.next()).done) {
      let [key, value] = iterResult.value;
      Dict.set(d, key, value);
    }
  }

  static toArray<S>(d: IDictLike<S>): [string, S][]
  static toArray<S>(d: IDict<S>): [string, S][]
  static toArray<S>(d: any): [string, S][] {
    let returnValue = [];
    let iter = Dict.iterator(d);
    let iterResult;
    while (!(iterResult = iter.next()).done) {
      returnValue.push(iterResult.value);
    }
    return returnValue;
  }

  // [key: string]: T

  protected _dict = {};

  clear() {
    this._dict = {};
  }

  key(index: number): string {
    return OwnKeys(this._dict)[index];
  }

  getItem(key: string): T {
    return this._dict[key];
  }

  setItem(key: string, value: T): void {
    this._dict[key] = value;
  }

  removeItem(key: string): void {
    delete this._dict[key];
  }

  get length(): number {
    return OwnKeys(this._dict).length;
  }

  /*has(key: string) {
    return Dict.has(this, key);
  }*/


  toArray() {
    return Dict.toArray(this);
  }
}

export class DictIterator<T> {

  private _dict: any;
  private _length: number;
  private _index = 0;

  constructor(_d: Dict<T>)
  constructor(_d: IDict<T>)
  constructor(_d: IDictLike<T>)
  constructor(_d: any) {
    this._dict = _d;
    this._length = Dict.size(_d);
  }

  next() {
    let dict = this._dict;
    let index = this._index;
    let returnValue = { done: true, value: undefined };
    if (index < this._length) {
      let key = Dict.key(dict, index);
      returnValue.done = false;
      returnValue.value = [key, Dict.get(dict, key)];
    }
    return returnValue;
  }

}
