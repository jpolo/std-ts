import { IStorage, Storage } from "./storage";

class LocalStorage extends Storage {
  protected _getStorage() {
    return localStorage;
  }
}

export default new LocalStorage();
