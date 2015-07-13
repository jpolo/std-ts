import { IStorage, Storage } from "./storage"

class SessionStorage extends Storage {
  protected _getStorage() {
    return sessionStorage;
  }
}

export default new SessionStorage();