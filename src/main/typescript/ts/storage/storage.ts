// Util
const __str = function (o) { return "" + o; };
const __keys = Object.keys || function (o) {
  let keys = [];
  for (let key in o) {
    if (o.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
};
const __check = function (storage: WebStorage) {
  let testKey = "storageTest" + Math.random();
  let returnValue = false;
  try {
    // Safari in private mode can throw error
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    returnValue = true;
  } catch (e) {
  }
  return returnValue;
};
const __defineGetter = Object.defineProperty ?
  function (o, name, getter) {
    Object.defineProperty(o, name, {get: getter});
  } :
  function (o, name, getter) {
    o.__defineGetter__(name, getter);
  };


interface WebStorage {
  length: number;
  clear(): void;
  key(i: number): string;
  getItem(key: string);
  setItem(key: string, value: any): void;
  removeItem(key: string);
};

export interface IStorage {
  clear(): void;
  isAvailable(): boolean;
  key(i: number): string;
  getItem(k: string): string;
  removeItem(k: string): void;
  setItem(k: string, v: string): void;
  size(): number;
}

const __memoryStorage = function () {
  let memoryStorage: WebStorage = <any>{};
  let _data = {};

  function _onchange() {
    memoryStorage.length = __keys(_data).length;
  }

  memoryStorage.length = 0;

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
  };

  memoryStorage.clear = function () {
    let keys = __keys(_data);
    for (let i = 0, l = keys.length; i < l; i++) {
      delete _data[keys[i]];
    }
    _onchange();
  };
  return memoryStorage;
};



export class Storage implements IStorage {

  length: number;

  private _storage: WebStorage;
  private _isAvailable = true;

  constructor() {
    let isAvailable: boolean;
    let storage: WebStorage;
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
