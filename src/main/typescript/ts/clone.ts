module clone {
  
  export interface IClone {
    clone(): void
  }
  
  function isIClone(o: any): boolean {
    return o && (typeof o.clone === "function");  
  }
  
  function clone<T>(o: T): T {
    var returnValue: T = o;
    switch (typeof o) {
    case "object":
      break;
    case "function":
      break;
    default://keep value
    }
    return returnValue;
  }
  
  
  
}
export = clone