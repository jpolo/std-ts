module id {
  //Constants
  var ES_COMPAT = 3;
  
  //Util
  var __global: any = typeof window !== "undefined" ? window : (function() { return this; }());
  var __sym: (s: string) => any = __global.Symbol;
  var __descriptor: PropertyDescriptor = { value: null, enumerable: false, configurable: true, writable: true };
  var __def = Object.defineProperty;
  var __set = function (o, k, v) {
    __descriptor.value = v
    __def(o, k, __descriptor);
  };
  
  //Compat
  if (ES_COMPAT <= 3) {
    __def = __def || function (o, k, d: PropertyDescriptor) { o[k] = d.value; };
  }
  if (ES_COMPAT <= 5) {
    __sym = __sym || function (s: string) { return "@@" + s; };
  }
  
  var $$id = __sym("id");
  var __currentId = 1;//Start from 1, helps not to have falsy values
  var __getId: (o: any) => number = function (o: any) {
    var id = o[$$id];
    if (id === undefined) {
      id = __currentId;
      __currentId += 1;
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
    var returnValue = __currentId;
    __currentId += 1;
    return returnValue;
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