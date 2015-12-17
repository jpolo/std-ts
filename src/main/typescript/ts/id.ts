declare var Symbol: any;

// ECMA like
const idPropertyDescriptor: PropertyDescriptor = {
  value: null,
  enumerable: false,
  configurable: true,
  writable: false
};
function IsFunction(o: any) { return typeof o === "function"; }
function IsObject(o: any) { return typeof o === "object" && o !== null; }
function SymbolCreate(s: string): any { return typeof Symbol !== "undefined" ? Symbol(s) : "@@" + s; }
function DefinePropertyOrThrow(o: any, k: string, d: PropertyDescriptor) {
  let def = Object.defineProperty;
  if (def) {
    def(o, k, d);
  } else {
    o[k] = d.value;
  }
}
function DefineValue(o: any, k: string, v: any): void {
  idPropertyDescriptor.value = v;
  DefinePropertyOrThrow(o, k, idPropertyDescriptor);
}
function IdGeneratorCreate() {
  // Start from 1, helps not to have falsy values
  let currentId = 1;
  return function () {
    let returnValue = currentId;
    currentId += 1;
    return returnValue;
  };
}

const idGenerator = IdGeneratorCreate();
const $$id = SymbolCreate("id");
function GetOrSetId(o: any): number {
  let id = o[$$id];
  if (id === undefined) {
    id = idGenerator();
    DefineValue(o, $$id, id);
  }
  return id;
}


/**
 * Return new generated id
 */
export function generate(): number {
  return idGenerator();
}

/**
 * Return true if o can have and id (object or function)
 */
export function hasId(o: any): boolean {
  return IsFunction(o) || IsObject(o);
}

/**
 * Return the corresponding id if able
 */
export function getId(o: any): number {
  return hasId(o) ? GetOrSetId(o) : NaN;
}
