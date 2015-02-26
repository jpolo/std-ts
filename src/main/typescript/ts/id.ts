module id {
  var __currentId = 1;
  var __nextId = function () { return __currentId++; };
  var __get: (o: any) => number;
  
  if (typeof WeakMap !== "undefined") {
    //weakmap implementation
    var __registry = new WeakMap<any, number>();
    __get = function (o: any) {
      var id = __registry.get(o);
      if (id === undefined) {
        id = __nextId();
        __registry.set(o, id);
      }
      return id;
    };
  } else {
    var ID_PROPERTY = "@@id";//TODO use Symbol if existing ?
    var __descriptor: PropertyDescriptor = { value: null, enumerable: false, configurable: true, writable: false };
    var __def = Object.defineProperty;
    //default implementation
    __get = function (o: any) {
      var id = o[ID_PROPERTY];
      if (id === undefined) {
        id = __nextId();
        __descriptor.value = id;
        __def(o, ID_PROPERTY, __descriptor);
      }
      return id;
    };
  }

  /**
   * Return new generated id
   *
   * @return {number}
   */ 
  export function generate(): number {
    return __nextId();
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
          returnValue = __get(o);
        }
        break;
      case 'function':
        returnValue = __get(o);
        break;
    }
    return returnValue;
  }
}
export = id;