declare var Symbol: any;

//Util
const __sym: (s: string) => any = typeof Symbol !== "undefined" ? Symbol : function (s: string) { return "@@" + s; };
const __descriptor: PropertyDescriptor = { value: null, enumerable: false, configurable: true, writable: true };
const __def = Object.defineProperty || function (o, k, d: PropertyDescriptor) { o[k] = d.value; };
const __set = function (o, k, v) {
  __descriptor.value = v
  __def(o, k, __descriptor);
};

const $$id = __sym("id");
let __currentId = 1;//Start from 1, helps not to have falsy values
const __getId: (o: any) => number = function (o: any) {
  let id = o[$$id];
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
 */ 
export function generate(): number {
  let returnValue = __currentId;
  __currentId += 1;
  return returnValue;
}

/**
 * Return true if o can have and id (object or function)
 * 
 */
export function hasId(o: any): boolean {
  let t = typeof o;
  return t === "function" || (o !== null && t === "object");
}

/**
 * Return the corresponding id if able
 * 
 */
export function getId(o: any): number {
  let returnValue = NaN;
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
