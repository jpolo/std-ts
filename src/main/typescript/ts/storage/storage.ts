type WebStorage = Storage;

module storage {
  
  //Constant
  var ES_COMPAT = 3;
  var TEST_KEY = 'storageTest' + Math.random();
  
  //Util
  var __str = function (o) { return "" + o; };
  var __keys = Object.keys;
  var __check = function (storage: WebStorage) {
    var returnValue = false;
    try {
      //Safari in private mode can throw error
      storage.setItem(TEST_KEY, "1");
      storage.removeItem(TEST_KEY);
      returnValue = true;
    } catch (e) {
    }
    return returnValue;
  };
  var __defineGetter = Object.defineProperty ?
    function (o, name, getter) {
      Object.defineProperty(o, name, {get: getter});
    } : null;
  
  
  //Compat
  if (ES_COMPAT <= 3) {
    __keys = __keys || function (o) {
      var keys = [];
      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys;
    };
    __defineGetter = __defineGetter || function (o, name, getter) {
      o.__defineGetter__(name, getter);
    };
  }
  
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
  
  
    
  export class Storage implements IStorage {
    
    length: number;
    
    private _storage: WebStorage
    private _isAvailable = true

    constructor() {
      var isAvailable: boolean;
      var storage: WebStorage;
      try {
        storage = this._getStorage();
        isAvailable = __check(storage);
      } catch (e) {
        isAvailable = false;
      }
      storage = isAvailable ? storage : this._getStorageFallback();

      this._isAvailable = isAvailable;
      this._storage = storage;
      __defineGetter(this, "length", () => {
        return this.size();
      });
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
    
    protected _getStorage(): WebStorage {
      return null;
    }
    
    protected _getStorageFallback(): WebStorage {
      return __memoryStorage();
    }
  }
  
}
export = storage