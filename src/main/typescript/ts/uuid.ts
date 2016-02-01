type ByteArray = { [k: number]: number; length: number; }

//Constant
const LENGTH = 16;

//Util
const __global: any = typeof window !== "undefined" ? window : (function() { return this; }());
const __buffer: ByteArray = ArrayCreate(16);
const __rng: () => number[] = (function () {
  let __rng;

  //Node
  if (typeof __global.require == 'function') {
    try {
      let _rb = __global.require('crypto').randomBytes;
      __rng = _rb ? function () {
        return _rb(LENGTH);
      } : null;
    } catch (e) {
    }
  }

  // Allow for MSIE11 msCrypto
  let __crypto = __global.crypto || __global.msCrypto;
  if (!__rng && __crypto && __crypto.getRandomValues) {
    let _rnds8 = ArrayCreate(16);
    __rng = function () {
      __crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!__rng) {
    let _rnds = ArrayCreate(16);
    let __random = Math.random;
    __rng = function () {
      for (let i = 0, r; i < LENGTH; i++) {
        if ((i & 0x03) === 0) r = __random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  return __rng;
}());

function Compare(a: number, b: number) {
  return a === b ? 0 : a < b ? -1 : 1;
}

function ArrayCreate(length: number): ByteArray {
  let returnValue;
  if (typeof Uint8Array !== "undefined") {
    returnValue = new Uint8Array(length);
  } else {
    returnValue = new Array(length);
    returnValue[0] = 0;/*v8 optim*/
  }
  return returnValue;
}

function Array16Fill(a: ByteArray, k: number): void {
  a[0] = a[1] = a[2] = a[3] =
  a[4] = a[5] = a[6] = a[7] =
  a[8] = a[9] = a[10] = a[11] =
  a[12] = a[13] = a[14] = a[15] = k;
}

function Array16Compare(a: ByteArray, b: ByteArray): number {
  return (
    Compare(a[0], b[0]) ||
    Compare(a[1], b[1]) ||
    Compare(a[2], b[2]) ||
    Compare(a[3], b[3]) ||
    Compare(a[4], b[4]) ||
    Compare(a[5], b[5]) ||
    Compare(a[6], b[6]) ||
    Compare(a[7], b[7]) ||
    Compare(a[8], b[8]) ||
    Compare(a[9], b[9]) ||
    Compare(a[10], b[10]) ||
    Compare(a[11], b[11]) ||
    Compare(a[12], b[12]) ||
    Compare(a[13], b[13]) ||
    Compare(a[14], b[14]) ||
    Compare(a[15], b[15])
  );
}

function Array16Copy(src: ByteArray, dest: ByteArray, offset: number) {
  if (src !== dest) {
    dest[0] = src[0 + offset] & 0xff;
    dest[1] = src[1 + offset] & 0xff;
    dest[2] = src[2 + offset] & 0xff;
    dest[3] = src[3 + offset] & 0xff;
    dest[4] = src[4 + offset] & 0xff;
    dest[5] = src[5 + offset] & 0xff;
    dest[6] = src[6 + offset] & 0xff;
    dest[7] = src[7 + offset] & 0xff;
    dest[8] = src[8 + offset] & 0xff;
    dest[9] = src[9 + offset] & 0xff;
    dest[10] = src[10 + offset] & 0xff;
    dest[11] = src[11 + offset] & 0xff;
    dest[12] = src[12 + offset] & 0xff;
    dest[13] = src[13 + offset] & 0xff;
    dest[14] = src[14 + offset] & 0xff;
    dest[15] = src[15 + offset] & 0xff;
  }
}

const __uint8ToHex: string[] = [];
function Array16ToString(a: ByteArray) {
  let f = __uint8ToHex;
  return f[a[0]] + f[a[1]] +
    f[a[2]] + f[a[3]] + '-' +
    f[a[4]] + f[a[5]] + '-' +
    f[a[6]] + f[a[7]] + '-' +
    f[a[8]] + f[a[9]] + '-' +
    f[a[10]] + f[a[11]] +
    f[a[12]] + f[a[13]] +
    f[a[14]] + f[a[15]];
}


const __hexToUint8: { [k: string]: number } = {};
for (let i = 0; i < 256; i++) {
  let s = (i + 0x100).toString(16).substr(1);
  __uint8ToHex[i] = s;
  __hexToUint8[s] = i;
}

function isUUID(o: any): boolean {
  return false;
}

function getRandomBytes(): number[] {
  let byteArray = new Array(LENGTH);
  setRandomBytes(byteArray);
  return byteArray;
}

function setRandomBytes(a: ByteArray): void {
  let randomBytes = __rng();
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;
  //a.length = LENGTH;
  Array16Copy(randomBytes, a, 0);
}

function parse(s: string): number[] {
  let byteArray = new Array(LENGTH);
  let i = 0;
  s.toLowerCase().replace(/[0-9a-f]{2}/g, <any>function (oct: string) {
    if (i < LENGTH) { // Don't overflow!
      byteArray[i] = __hexToUint8[oct] & 0xff;
      i += 1;
    }
  });

  // Zero out remaining bytes if string was short
  while (i < LENGTH) {
    byteArray[i] = 0;
    i += 1;
  }
  return byteArray;
}

function stringify(a: ByteArray): string {
  return Array16ToString(a);
}

export class UUID {
  BYTES_PER_ELEMENT = 1;

  byteLength = LENGTH;
  length = LENGTH;
  [i: number]: number;

  static cast(o: any): UUID {
    let id: UUID = null;
    if (o) {
      if (o instanceof UUID) {
        id = o;
      } else if (typeof o === "string") {
        id = UUID.parse(o);
      } else {

      }
    }
    return id;
  }

  static compare(a: UUID, b: UUID): number {
    return Array16Compare(a, b);
  }

  static generate(): UUID {
    let a = __rng();
    a[6] = (a[6] & 0x0f) | 0x40;
    a[8] = (a[8] & 0x3f) | 0x80;
    return new UUID(a);
  }

  static parse(s: string): UUID {
    return new UUID(parse(s));
  }

  constructor(byteArray?: ByteArray) {
    if (byteArray !== undefined) {
      Array16Copy(byteArray, this, 0);
    } else {
      Array16Fill(this, 0);
    }
  }

  clone(): UUID {
    return new UUID(this);
  }

  compare(other: UUID): number {
    return UUID.compare(this, other);
  }

  equal(other: any): boolean {
    return other && (other instanceof UUID) && (UUID.compare(this, other) === 0);
  }

  get(index: number): number {
    return this[index];
  }

  set(byteArray: ByteArray, offset = 0): void {
    Array16Copy(byteArray, this, offset);
  }

  inspect() {
    return "UUID { " + this.toString() + " }";
  }

  toJSON() {
    return this.toString();
  }

  toString(): string {
    return Array16ToString(this);
  }

  valueOf() {
    return this.toString();
  }
}
