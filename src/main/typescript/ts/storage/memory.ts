//Constant
var ES_COMPAT = 3;

//Util
var __keys = Object.keys;
var __str = function (o) { return "" + o; };
var __defineGetter = Object.defineProperty ?
  function (o, name, getter) {
    Object.defineProperty(o, name, { get: getter, enumerable: false });
  } : null;

//Compat
if (ES_COMPAT <= 3) {
  var dontEnum = { length: 1 };
  __keys = __keys || function (o) {
    var keys = [];
    for (var key in o) {
      if (o.hasOwnProperty(key) && !dontEnum[key]) {
        keys.push(key);
      }
    }
    return keys;
  };
  __defineGetter = __defineGetter || function (o, name, getter) {
    o.__defineGetter__(name, getter);
  };
}



class MemoryStorage implements Storage {
  
  length: number;
  remainingSpace: number;
  [key: string]: any;
  
  constructor() {
    __defineGetter(this, "length", () => {
      return __keys(this).length;//remove "length" itself
    });  
  }
  
  key(i: number): string {
    return __keys(this)[i];
  }
  
  getItem(k: string): string {
    var returnValue = null;
    if (this.hasOwnProperty(k)) {
      returnValue = this[k];  
    }
    return returnValue;
  }
  
  setItem(k: string, v: any): void {
    
    this[k] = __str(v);
  }
  
  removeItem(k: string): void {
    delete this[k];
  }
  
  clear(): void {
    var keys = __keys(this);
    for (var i = 0, l = keys.length; i < l; i++) {
      delete this[keys[i]];  
    }
  }
}

var memoryStorage = new MemoryStorage();
export = memoryStorage;