import reflect = require("ts/reflect")

module hash {
  
  var __stringTag = reflect.stringTag
  
  export interface IHash {
    
    hash(s: SipState)
    
  }
  
  export class SipState {
    constructor(
      private _0: number = 0, 
      private _1: number = 0, 
      private _2: number = 0, 
      private _3: number = 0
    ) {
      
    }
    
    clone() {
      return new SipState(
        this._0,
        this._1,
        this._2,
        this._3
      )  
    }
    
    reset() {
      this._0 = 0
      this._1 = 0 
      this._2 = 0
      this._3 = 0  
    }
    
    result(): string {
      return ""
    }
    
    writeBytes(b: number[]) {
    }
    
    /*writeString(s: string) {
      for (var i = 0, l = s.length; i < l; ++i) {
        this.writeByte(s.charCodeAt(i))
      }
    }*/
  }
  
  export function hash(o: any): string {
    return _hash(o, new SipState()).result()
  }
  
  function _hash(o: any, s: SipState) {
    switch (__stringTag(o)) {
      case 'Null':
      case 'Undefined':
        s.writeBytes([0])
        break
      case 'Boolean':
        s.writeBytes([o ? 1 : 0])
        break
      case 'String':
        break
      case 'Number':
        break
        
      default:
        if ('hash' in o) {
          o.hash(s)
        } else {
          // hash default object
          var keys = Object.keys(o).sort()
          var keyc = keys.length
          for (var i = 0; i < keyc; ++i) {
            var key = keys[i]
            o.writeString(key)
            _hash(o[key], s)
          }
        }
    }
    return s
  }

  
}