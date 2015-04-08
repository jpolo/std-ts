module id {
  //Constants
  var ES3_COMPAT = true;
  var ES5_COMPAT = ES3_COMPAT || true;
  
  //Util
  var __global: any = typeof window !== "undefined" ? window : (function() { return this; }());
  var __sym: (o: any) => any = __global.Symbol;
  var __descriptor = { value: null, enumerable: false, configurable: true, writable: true };
  var __def = Object.defineProperty;
  var __set = function (o, k, v) {
    __descriptor.value = v
    __def(o, k, __descriptor);
  };
  
  //Compat
  if (ES3_COMPAT) {
    __def = __def || function (o, k, d) { o[k] = d.value; };
  }
  if (ES5_COMPAT) {
    __sym = __sym || function (o) { return "@@" + o; };
  }
  
  var $$id = __sym("id");
  var __currentId = 1;//Start from 1, helps not to have falsy values
  var __nextId = function () { return __currentId++; };
  var __getId: (o: any) => number = function (o: any) {
    var id = o[$$id];
    if (id === undefined) {
      id = __nextId();
      __set(o, $$id, id);
    }
    return id;
  };
  

  /**
   * Return new generated id
   *
   * @return {number}
   */ 
  export function generate(): number {
    return __nextId();
  }
  
  /**
   * Return true if o can have and id (object or function)
   * 
   * @param o the object
   */
  export function hasId(o: any): boolean {
    var t = typeof o;
    return t === "function" || (o !== null && t === "object");
  }
  
  /**
   * Return the corresponding id if able
   * 
   * @param o the object
   */
  export function id(o: any): number {
    var returnValue = NaN;
    switch (typeof o) {
      case 'object':
        if (o !== null) {
          returnValue = __getId(o);
        }
        break;
      case 'function':
        returnValue = __getId(o);
        break;
    }
    return returnValue;
  }
}
export = id;