import { Storage } from './storage';

export class LocalStorage extends Storage {
  protected _getStorage() {
    return localStorage;
  }
}

export default new LocalStorage();
