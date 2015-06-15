type WebStorage = Storage;

module storage {
  
  //Util
  var __check = function (storage: WebStorage) {
    var testKey = 'storageTest' + Math.random();
    var returnValue = false;
    try {
      //Safari in private mode can throw error
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      returnValue = true;
    } catch (e) {
    }
    return returnValue;
  };
  
  
  export interface IStorage {
    clear(): void
    isAvailable(): boolean
    key(i: number): string
    getItem(k: string): string
    removeItem(k: string): void
    setItem(k: string, v: string): void
    size(): number
  }
  
    
  class Storage implements IStorage {
    
    protected _storage: WebStorage
    protected _isAvailable = true

    constructor(storage: WebStorage) {
      this._isAvailable = __check(storage);
      this._storage = storage;
    }
    
    isAvailable(): boolean {
      return this._isAvailable;
    }
    
    key(i: number): string {
      return this._storage.key(i);  
    }
    
    getItem(k: string): string {
      var v = this._storage.getItem(k);
      if (typeof v !== "string") {
        throw new Error("InvalidValue");
      }
      return v;
    }
    
    setItem(k: string, v: string): void {
      this._storage.setItem(k, v);
    }
    
    removeItem(k: string): void {
      this._storage.removeItem(k);  
    }
    
    size(): number {
      return this._storage.length;  
    }
    
    clear(): void {
      this._storage.clear();
    }
  }
  
  class StorageIterator {
    
    private _index = 0
    
    constructor(private _storage: IStorage) {}
    
    next() {
      var index = this._index;
      var storage = this._storage;
      var result = { done: true, value: "" };
      if (index < storage.size()) {
        var key = storage.key(index);
        result.done = false;
        result.value = storage.getItem(key);
      }
      return result;
    }
  }
}
export = storage