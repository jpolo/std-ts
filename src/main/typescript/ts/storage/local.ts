import storage = require("./storage")
import IStorage = storage.IStorage
import memory = require("./memory")

var __storage = typeof localStorage !== "undefined" ? localStorage : null;
var __check = function (storage: Storage) {
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
var __supported = __check(__storage);

var MemoryStorage: any = memory.constructor;
var __storageImpl: IStorage = __supported ? __storage : new MemoryStorage();
export = __storageImpl;