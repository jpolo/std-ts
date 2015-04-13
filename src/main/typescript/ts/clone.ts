module clone {
  
  //Util
  var __create = Object.create;
  var __protoOf = Object.getPrototypeOf;
  var __descriptors = function (o: any): { [k: string]: PropertyDescriptor } {
    var descriptors: any = {};
    var props = Object.getOwnPropertyNames(o);
    var getDescriptor = Object.getOwnPropertyDescriptor;
    for (var i = 0, l = props.length; i < l; ++i) {
      var prop = props[i];
      descriptors[prop] = getDescriptor(o, prop);
    }
    return descriptors;
  };
  
  //Compat
  
  export interface IClone {
    clone(): any
  }
  
  export function isIClone(o: any): boolean {
    return o && (typeof o.clone === "function");  
  }
  
  export function clone<T>(o: T): T {
    var returnValue: T = o;
    switch (typeof o) {
    case "object":
      if (o !== null) {
        returnValue = isIClone(o)? (<any> o).clone() : __create(__protoOf(o), __descriptors(o));
      }  
      break;
    case "function":
      var f: any = (<any> returnValue).__cloned__ = (<any>o).__cloned__ || o;
      returnValue = <any> function () {
        var r: any;
        var t = this;
        var argc = arguments.length;

        switch (argc) {
          case 0: r = t ? f() : f.call(t); break;
          case 1: r = t ? f(arguments[0]): f.call(t, arguments[0]); break;
          case 2: r = t ? f(arguments[0], arguments[1]): f.call(t, arguments[0], arguments[1]); break;
          case 3: r = t ? f(arguments[0], arguments[1], arguments[2]): f.call(t, arguments[0], arguments[1], arguments[2]); break;
          case 4: r = t ? f(arguments[0], arguments[1], arguments[2], arguments[3]): f.call(t, arguments[0], arguments[1], arguments[2], arguments[3]); break;
          default: r = f.apply(t, arguments);
        }
        return r;
      };
        
      break;
    default://keep value
    }
    return returnValue;
  }
  
  
  
}
export = clone