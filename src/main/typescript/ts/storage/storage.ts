type WebStorage = Storage;

module storage {
  
  //Util
  var __str = function (o) { return "" + o; };
  var __keys = Object.keys;
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
  
  var __memoryStorage = function () {
    var memoryStorage: WebStorage = <any>{};
    var _data = {};
    
    function _onchange() {
      memoryStorage.length = __keys(_data).length;
    }
    
    memoryStorage.length = 0;
    
    memoryStorage.remainingSpace = Infinity;
    
    memoryStorage.getItem = function (k: string): any { 
      return _data[k]; 
    };
    
    memoryStorage.setItem = function (k: string, v: any) { 
      _data[k] = __str(v); 
      _onchange();
    };
    
    memoryStorage.removeItem = function (k: string) {
      if (_data.hasOwnProperty(k)) {
        delete _data[k];
        _onchange();
      }
    }
    
    memoryStorage.clear = function () { 
      var keys = __keys(_data);
      for (var i = 0, l = keys.length; i < l; i++) {
          delete _data[keys[i]];
      }
      _onchange();
    };
    return memoryStorage;
  };
  
  
    
  class Storage implements IStorage {
    
    protected _storage: WebStorage
    protected _isAvailable = true

    constructor(storage: WebStorage) {
      if (storage === null) {
        storage = __memoryStorage();
      }
      var isAvailable = __check(storage);
      
      this._isAvailable = isAvailable;
      this._storage = isAvailable ? storage : __memoryStorage();
    }
    
    isAvailable(): boolean {
      return this._isAvailable;
    }
    
    key(i: number): string {
      return this._storage.key(i);  
    }
    
    getItem(k: string): string {
      return this._storage.getItem(k);
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