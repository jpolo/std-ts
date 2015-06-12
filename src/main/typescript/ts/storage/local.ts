import memory = require("./memory")

var __supported = (function () {
  var testKey = 'storageTest' + Math.random();
  var storage;
  var returnValue = false;
  try {
    //Safari in private mode can throw error
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    returnValue = true;
  } catch (e) {
  }
  return returnValue;
}());

var MemoryStorage: any = memory.constructor;
var storage = __supported ? localStorage : new MemoryStorage();
export = storage;