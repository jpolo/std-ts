// Util
function ToString (o: any) { return '' + o }
function OwnKeys (o: any): string[] {
  let keys: string[]
  if (Object.keys) {
    keys = Object.keys(o)
  } else {
    keys = []
    for (const prop in o) { if (o.hasOwnProperty(prop)) { keys.push(prop) } }
  }
  return keys
}
function CheckStorage (storage: IWebStorage) {
  const testKey = 'storageTest' + Math.random()
  try {
    // Safari in private mode can throw error
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}
function CreateMemoryStorage () {
  const memoryStorage: IWebStorage = {} as any
  const _data = {}

  function _onchange () {
    memoryStorage.length = OwnKeys(_data).length
  }

  memoryStorage.length = 0

  memoryStorage.getItem = function (k: string): any {
    return _data[k]
  }

  memoryStorage.setItem = function (k: string, v: any) {
    _data[k] = ToString(v)
    _onchange()
  }

  memoryStorage.removeItem = function (k: string) {
    if (_data.hasOwnProperty(k)) {
      delete _data[k]
      _onchange()
    }
  }

  memoryStorage.clear = function () {
    const keys = OwnKeys(_data)
    for (let i = 0, l = keys.length; i < l; i++) {
      delete _data[keys[i]]
    }
    _onchange()
  }
  return memoryStorage
}
function DefineGetter<V> (o: any, k: string, getter: () => V) {
  const def = Object.defineProperty
  if (def) {
    def(o, k, { get: getter })
  } else {
    o.__defineGetter__(name, getter)
  }
}

export interface IWebStorage {
  length: number
  clear (): void
  key (i: number): string
  getItem (key: string): string
  setItem (key: string, value: any): void
  removeItem (key: string): void
}

export interface IStorage {
  clear (): void
  isAvailable (): boolean
  key (i: number): string
  getItem (k: string): string
  removeItem (k: string): void
  setItem (k: string, v: string): void
  size (): number
}

export class Storage implements IStorage {

  length: number

  private _storage: IWebStorage
  private _isAvailable = true

  constructor () {
    let isAvailable: boolean
    let storage: IWebStorage
    try {
      storage = this._getStorage()
      isAvailable = CheckStorage(storage)
    } catch (e) {
      isAvailable = false
    }
    storage = isAvailable ? storage : this._getStorageFallback()

    this._isAvailable = isAvailable
    this._storage = storage
    DefineGetter(this, 'length', () => {
      return this.size()
    })
  }

  isAvailable (): boolean {
    return this._isAvailable
  }

  key (i: number): string {
    return this._storage.key(i)
  }

  getItem (k: string): string {
    return this._storage.getItem(k)
  }

  setItem (k: string, v: string): void {
    this._storage.setItem(k, v)
  }

  removeItem (k: string): void {
    this._storage.removeItem(k)
  }

  size (): number {
    return this._storage.length
  }

  clear (): void {
    this._storage.clear()
  }

  protected _getStorage (): IWebStorage {
    return this._getStorageFallback()
  }

  protected _getStorageFallback (): IWebStorage {
    return CreateMemoryStorage()
  }
}
