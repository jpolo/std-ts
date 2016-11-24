declare var Symbol: any;

// ECMA like
const idPropertyDescriptor: PropertyDescriptor = {
  configurable: true,
  enumerable: false,
  value: null,
  writable: false
};
function SymbolCreate(s: string): any { return typeof Symbol !== "undefined" ? Symbol(s) : "@@" + s; }
function DefinePropertyOrThrow(o: any, k: string, d: PropertyDescriptor) {
  const def = Object.defineProperty;
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
    const returnValue = currentId;
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
 *
 * @return a new identifier
 */
export function generate(): number {
  return idGenerator();
}

/**
 * Return true if o can have and id (object or function)
 *
 * @param o the object
 * @return
 */
export function hasId(o: any): boolean {
  return typeof o === "function" || (typeof o === "object" && o !== null);
}

/**
 * Return the corresponding id if able
 *
 * @param o the object
 * @return the o identifier
 */
export function getId(o: any): number {
  return hasId(o) ? GetOrSetId(o) : NaN;
}
