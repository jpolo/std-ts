import { IStorage } from "./storage";

// Util
const __now = Date.now || function () { return (new Date()).getTime(); };
const __keys = Object.keys || function (o) {
  const keys = [];
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
};
const __str = function (o: string) { return "" + o; };
const __defineGetter = Object.defineProperty ?
  function (o: any, name: string, getter: () => any) {
    Object.defineProperty(o, name, {get: getter});
  } :
  function (o: any, name: string, getter: () => any) {
    o.__defineGetter__(name, getter);
  };

const __cookieRead = (function () {
  let __cookiesStr = "";
  let __cookies: { [key: string]: string } = {};
  const __document = typeof document !== "undefined" ? document : null;
  const __decode = decodeURIComponent;
  const __read = function () {
    const currentCookieString = __document.cookie || "";

    if (currentCookieString !== __cookiesStr) {
      __cookiesStr = currentCookieString;
      const cookieArray = __cookiesStr.split("; ");
      __cookies = {};

      for (const cookie of cookieArray) {
        const index = cookie.indexOf("=");
        if (index > 0) { // ignore nameless cookies
          const name = __decode(cookie.substring(0, index));
          // the first value that is seen for a cookie is the most
          // specific one.  values for the same cookie name that
          // follow are for less specific paths.
          if (__cookies[name] === undefined) {
            __cookies[name] = __decode(cookie.substring(index + 1));
          }
        }
      }
    }
    return __cookies;
  };
  return __read;
}());

const __cookieWrite = (function () {
  const __document = typeof document !== "undefined" ? document : null;
  const __encodeKey = function (s: string) {
    let r = s;
    if (r.length) {
      r = encodeURIComponent(r);
      r = r.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
      r = r.replace(/[\(\)]/g, encodeURIComponent); // escape
    }
    return r;
  };
  const __encodeValue = function (s: string) {
    let r = s;
    if (r.length) {
      r = encodeURIComponent(r);
      r = r.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
    }
    return r;
  };
  const __write = function (key: string, value: string, options: WriteOptions = {}) {
    // options = __extend({ path: "/" }, options);
    const now = __now();
    const domain = options.domain;
    const path = options.path || "/";
    const maxAge = options.maxAge;
    const expires = options.expires;
    const secure = options.secure;
    let expirationDate = null;
    let cookieDelete = false;

    // Expiration
    if (expires !== undefined) {
      expirationDate = new Date(+expires);
    } else if (maxAge !== undefined) {
      expirationDate = new Date(now);
      expirationDate.setMilliseconds(expirationDate.getMilliseconds() + maxAge);
    }
    cookieDelete = +now >= +expirationDate;

    // Encode
    let s = "";
    s += __encodeKey(__str(key));
    s += "=" + (cookieDelete ? "" : __encodeValue(__str(value)));
    if (expirationDate) {
      s += "; expires=" + expirationDate.toUTCString();
    }
    if (path) {
      s += "; path=" + path;
    }
    if (domain) {
      s += "; domain=" + domain;
    }
    if (secure) {
      s += "; secure";
    }

    const cookieOld = __document.cookie;
    __document.cookie = s;
    return (cookieOld !== __document.cookie);
  };
  return __write;
}());
const __cookieClear = function () {
  document.cookie = "";
};
const __extends = function <T>(dest: T, ...exts: T[]) {
  for (const ext of exts) {
    const extKeys = __keys(ext);
    for (const key of extKeys) {
      dest[key] = ext[key];
    }
  }
  return dest;
};

export type WriteOptions = {
  domain?: string
  path?: string
  maxAge?: number
  expires?: number | Date
  secure?: boolean
}

export class CookieStorage implements IStorage {

  length: number;

  constructor() {
    __defineGetter(this, "length", () => {
      return this.size();
    });
  }

  isAvailable(): boolean {
    return true;
  }

  key(index: number): string {
    index = index >>> 0;
    let returnValue = null;
    if (index >= 0) {
      returnValue = __keys(__cookieRead())[index];
    }
    return returnValue;
  }

  getItem(k: string): string {
    return __cookieRead()[k];
  }

  setItem(k: string, v: any, options?: WriteOptions): void {
    __cookieWrite(k, v, options);
  }

  removeItem(k: string, options?: WriteOptions): void {
    const optionsRemove = { maxAge: -1 };
    __cookieWrite(k, null, options ? __extends({}, options, optionsRemove) : optionsRemove);
  }

  clear(): void {
    __cookieClear();
  }

  size(): number {
    return __keys(__cookieRead()).length;
  }

}

export default new CookieStorage();
