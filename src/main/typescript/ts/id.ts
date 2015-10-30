declare var Symbol: any;

// ECMA like
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
const DefineValue = (function () {
  const __descriptor: PropertyDescriptor = {
    value: null,
    enumerable: false,
    configurable: true,
    writable: true
  };
  function DefineValue(o: any, k: string, v: any): void {
    __descriptor.value = v;
    DefinePropertyOrThrow(o, k, __descriptor);
  }
  return DefineValue;
}());
const GenerateId = (function () {
  // Start from 1, helps not to have falsy values
  let __currentId = 1;

  function GenerateId() {
    let returnValue = __currentId;
    __currentId += 1;
    return returnValue;
  }
  return GenerateId;
}());

const $$id = SymbolCreate("id");
function GetOrSetId(o: any): number {
  let id = o[$$id];
  if (id === undefined) {
    id = GenerateId();
    DefineValue(o, $$id, id);
  }
  return id;
}


/**
 * Return new generated id
 */
export function generate(): number {
  return GenerateId();
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
