type WebStorage = Storage;

module storage {
  
  interface IStorage {
    
  
  }
  
  var TEST_KEY = "__tsStorage" + Math.random();
    
  class Storage {
    
    protected _storage: WebStorage

    
    isAvailable() {
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
    
    get(k: string): string {
      var v = this._storage.getItem(k);
      if (typeof v !== "string") {
        throw new Error("InvalidValue");
      }
      return v;
    }
    
    set(k: string, v: string): void {
      this._storage.setItem(k, v);
    }
    
    remove(k: string) {
      this._storage.removeItem(k);  
    }
    
    size() {
      return this._storage.length;  
    }
    
    clear() {
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
        result.value = storage.get(key);
      }
      return result;
    }
  }
    
 
}