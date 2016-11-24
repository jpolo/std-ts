import { IStorage } from "./storage";

// Util
function ToString(o: any) { return "" + o; }
function OwnKeys(o: any) {
  let keys: string[];
  if (Object.keys) {
    keys = Object.keys(o);
  } else {
    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
  }
  return keys;
}
function GetData(o: any): { [k: string]: string } { return o.__data__ || (o.__data__ = {}); }
function ClearData(o: any): void { o.__data__ = {}; }

export class MemoryStorage implements IStorage {

  isAvailable(): boolean {
    return true;
  }

  key(i: number): string {
    return OwnKeys(GetData(this))[i];
  }

  getItem(k: string): string {
    const data = GetData(this);
    return data.hasOwnProperty(k) ? data[k] : null;
  }

  setItem(k: string, v: string): void {
    const data = GetData(this);
    data[k] = ToString(v);
  }

  removeItem(k: string): void {
    const data = GetData(this);
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
