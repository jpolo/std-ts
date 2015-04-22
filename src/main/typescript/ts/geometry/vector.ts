module vector {
  
  //Constant
  
  //Util
  var Float64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array
  var __sqrt = Math.sqrt;
  var __arrayCreate = function (l: number): any {
    return new Float64Array(l);
  };
  
  
  export interface IVector { length: number; 0: number; 1: number; }
  export interface IVector2 extends IVector {}
  export interface IVector3 extends IVector2 { 2: number }
  export interface IVector4 extends IVector3 { 3: number }
  
  
  export function create(x: number, y: number): IVector2
  export function create(x: number, y: number, z: number): IVector3
  export function create(x: number, y: number, z: number, w: number): IVector4
  export function create(): any {
    var argc = arguments.length;
    var v = __arrayCreate(argc);

    switch(argc) {
      case 2:
        v[0] = arguments[0];
        v[1] = arguments[1];
        break
      case 3:
        v[0] = arguments[0];
        v[1] = arguments[1];
        v[2] = arguments[2];
        break
      case 4:
        v[0] = arguments[0];
        v[1] = arguments[1];
        v[2] = arguments[2];
        v[3] = arguments[3];
        break
      default:
        for (var i = 0; i < argc; ++i) {
          v[i] = arguments[i];
        }
    }
    return v;
  }
  
}
export = vector;