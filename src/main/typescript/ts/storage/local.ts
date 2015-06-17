import storage = require("./storage")
import IStorage = storage.IStorage

class LocalStorage extends storage.Storage {
  protected _getStorage() {
    return localStorage;
  }
}

var storageImpl = new LocalStorage();
export = storageImpl;