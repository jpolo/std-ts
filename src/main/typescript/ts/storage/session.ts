import storage = require("./storage")
import IStorage = storage.IStorage

class SessionStorage extends storage.Storage {
  protected _getStorage() {
    return sessionStorage;
  }
}

var storageImpl = new SessionStorage();
export = storageImpl;