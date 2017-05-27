import { IStorage } from './storage'

// Util
const Now = Date.now || function () { return (new Date()).getTime() }
const OwnKeys = Object.keys || function (o) {
  const keys = []
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      keys.push(key)
    }
  }
  return keys
}
function ToString (o: string) { return '' + o }
const DefineGetter = Object.defineProperty ?
  function (o: any, name: string, getter: () => any) {
    Object.defineProperty(o, name, {get: getter})
  } :
  function (o: any, name: string, getter: () => any) {
    o.__defineGetter__(name, getter)
  }

const CookieRead = (function () {
  let cookiesStr = ''
  let cookies: { [key: string]: string } = {}
  const __document = typeof document !== 'undefined' ? document : null
  const __decode = decodeURIComponent
  const __read = function () {
    const currentCookieString = __document.cookie || ''

    if (currentCookieString !== cookiesStr) {
      cookiesStr = currentCookieString
      const cookieArray = cookiesStr.split('; ')
      cookies = {}

      for (const cookie of cookieArray) {
        const index = cookie.indexOf('=')
        if (index > 0) { // ignore nameless cookies
          const name = __decode(cookie.substring(0, index))
          // the first value that is seen for a cookie is the most
          // specific one.  values for the same cookie name that
          // follow are for less specific paths.
          if (cookies[name] === undefined) {
            cookies[name] = __decode(cookie.substring(index + 1))
          }
        }
      }
    }
    return cookies
  }
  return __read
}())

const CookieWrite = (function () {
  const __document = typeof document !== 'undefined' ? document : null
  const encodeKey = function (s: string) {
    let r = s
    if (r.length) {
      r = encodeURIComponent(r)
      r = r.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      r = r.replace(/[\(\)]/g, encodeURIComponent) // escape
    }
    return r
  }
  const encodeValue = function (s: string) {
    let r = s
    if (r.length) {
      r = encodeURIComponent(r)
      r = r.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)
    }
    return r
  }
  const write = function (key: string, value: string, options: WriteOptions = {}) {
    // options = __extend({ path: "/" }, options);
    const now = Now()
    const domain = options.domain
    const path = options.path || '/'
    const maxAge = options.maxAge
    const expires = options.expires
    const secure = options.secure
    let expirationDate = null
    let cookieDelete = false

    // Expiration
    if (expires !== undefined) {
      expirationDate = new Date(+expires)
    } else if (maxAge !== undefined) {
      expirationDate = new Date(now)
      expirationDate.setMilliseconds(expirationDate.getMilliseconds() + maxAge)
    }
    cookieDelete = +now >= +expirationDate

    // Encode
    let s = ''
    s += encodeKey(ToString(key))
    s += '=' + (cookieDelete ? '' : encodeValue(ToString(value)))
    if (expirationDate) {
      s += '; expires=' + expirationDate.toUTCString()
    }
    if (path) {
      s += '; path=' + path
    }
    if (domain) {
      s += '; domain=' + domain
    }
    if (secure) {
      s += '; secure'
    }

    const cookieOld = __document.cookie
    __document.cookie = s
    return (cookieOld !== __document.cookie)
  }
  return write
}())
const CookieClear = function () {
  document.cookie = ''
}
const __extends = function <T> (dest: T, ...exts: T[]) {
  for (const ext of exts) {
    const extKeys = OwnKeys(ext)
    for (const key of extKeys) {
      dest[key] = ext[key]
    }
  }
  return dest
}

export type WriteOptions = {
  domain?: string
  path?: string
  maxAge?: number
  expires?: number | Date
  secure?: boolean
}

export class CookieStorage implements IStorage {

  length: number

  constructor () {
    DefineGetter(this, 'length', () => {
      return this.size()
    })
  }

  isAvailable (): boolean {
    return true
  }

  key (index: number): string {
    index = index >>> 0
    let returnValue = null
    if (index >= 0) {
      returnValue = OwnKeys(CookieRead())[index]
    }
    return returnValue
  }

  getItem (k: string): string {
    return CookieRead()[k]
  }

  setItem (k: string, v: any, options?: WriteOptions): void {
    CookieWrite(k, v, options)
  }

  removeItem (k: string, options?: WriteOptions): void {
    const optionsRemove = { maxAge: -1 }
    CookieWrite(k, null, options ? __extends({}, options, optionsRemove) : optionsRemove)
  }

  clear (): void {
    CookieClear()
  }

  size (): number {
    return OwnKeys(CookieRead()).length
  }

}

export default new CookieStorage()
