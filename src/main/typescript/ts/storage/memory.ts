import { IStorage } from "./storage";

// Util
function ToString(o) { return "" + o; }
function OwnKeys(o) {
  let keys: string[];
  if (Object.keys) {
    keys = Object.keys(o);
  } else {
    for (let key in o) {
      if (o.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
  }
  return keys;
}
function GetData(o): { [k: string]: string } { return o.__data__ || (o.__data__ = {}); }
function ClearData(o): void { o.__data__ = {}; }

class MemoryStorage implements IStorage {

  constructor() { }

  isAvailable(): boolean {
    return true;
  }

  key(i: number): string {
    return OwnKeys(GetData(this))[i];
  }

  getItem(k: string): string {
    let data = GetData(this);
    return data.hasOwnProperty(k) ? data[k] : null;
  }

  setItem(k: string, v: string): void {
    let data = GetData(this);
    data[k] = ToString(v);
  }

  removeItem(k: string): void {
    let data = GetData(this);
    delete data[k];
  }

  size(): number {
    return OwnKeys(GetData(this)).length;
  }

  clear(): void {
    ClearData(this);
  }
}

export default new MemoryStorage();
