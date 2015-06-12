import memory = require("./memory")

var __supported = (function () {
  var testKey = 'storageTest' + Math.random();
  var storage;
  var returnValue = false;
  try {
    //Safari in private mode can throw error
    sessionStorage.setItem(testKey, "1");
    sessionStorage.removeItem(testKey);
    returnValue = true;
  } catch (e) {
  }
  return returnValue;
}());

var MemoryStorage: any = memory.constructor;
var storage = __supported ? sessionStorage : new MemoryStorage();
export = storage;