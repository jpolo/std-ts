module id {
  var ID_PROPERTY = "__id__";
  var __currentId = 0;
  var __nextId = function () { return __currentId++; };
  var __registry = (!!WeakMap ? new WeakMap<any, number>() : null);
  var __descriptor: PropertyDescriptor = { value: null, enumerable: false, configurable: true, writable: false };
  var __def = Object.defineProperty
  var __get = !!__registry ? 
    function (o: any) {
      var id = __registry.get(o);
      if (id === undefined) {
        id = __nextId();
        __registry.set(o, id);
      }
      return id;
    } : 
    function (o: any) {
      var id = o[ID_PROPERTY];
      if (id === undefined) {
        id = __nextId();
        __descriptor.value = id;
        __def(o, ID_PROPERTY, __descriptor);
      }
      return id;
    };
 
  
  export function generate(): number {
    return __nextId();
  }
  
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