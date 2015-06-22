import storage = require("./storage")
import IStorage = storage.IStorage

//Util
var __str = function (o) { return "" + o };
var __keys = Object.keys;
var __getData = function (o): { [k: string]: string } { return o.__data__ || (o.__data__ = {}); };
var __clearData = function (o): void { o.__data__ = {}; };

class MemoryStorage implements IStorage {
  
  constructor() { }
  
  isAvailable(): boolean {
    return true;
  }
  
  key(i: number): string {
    return __keys(__getData(this))[i];  
  }
  
  getItem(k: string): string {
    var data = __getData(this);
    return data.hasOwnProperty(k) ? data[k] : null;
  }
  
  setItem(k: string, v: string): void {
    var data = __getData(this);
    data[k] = __str(v);
  }
  
  removeItem(k: string): void {
    var data = __getData(this);
    delete data[k];
  }
  
  size(): number {
    return __keys(__getData(this)).length;  
  }
  
  clear(): void {
    __clearData(this);
  }
}

var storageImpl = new MemoryStorage();
export = storageImpl;