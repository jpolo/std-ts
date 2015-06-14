type WebStorage = Storage;

module storage {
  
  export interface IStorage {
    clear(): void
    isAvailable(): boolean
    key(i: number): string
    getItem(k: string): string
    removeItem(k: string): void
    setItem(k: string, v: string): void
    size(): number
  }
  
  var TEST_KEY = "__tsStorage" + Math.random();
    
  class Storage implements IStorage {
    
    protected _storage: WebStorage

    
    isAvailable(): boolean {
      var storage = this._storage;
      var returnValue = false;
      if (storage) {
        try {
          storage.setItem(TEST_KEY, '1');
          storage.removeItem(TEST_KEY);
          returnValue = true;
        } catch (e) {
        }
      }
      return returnValue;
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
    
    constructor(private _storage: Storage) {}
    
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