module semver {

  export interface ISemVer {
    major: number;
    minor: number;
    patch: number;
  }
  
  export class SemVer implements ISemVer {
    
    static compare(a: ISemVer, b: ISemVer): number {
      return __cmpMain(a, b) || __cmpPre(a, b);
    }
    
    static compareMain(a: ISemVer, b: ISemVer): number {
      return __cmpMain(a, b);
    }
    
    static comparePre(a: ISemVer, b: ISemVer): number {
      return __cmpPre(a, b);
    }
    
    static stringify(v: ISemVer): string {
      return "";
    }
    
    constructor(
      public major = 0,
      public minor = 0,
      public patch = 0,
      public prerelease = [],
      public build: number = null
    ) {
      
    }
    
    compare(o: ISemVer): number {
      return SemVer.compare(this, o);  
    }
    
    equals(o: any): boolean {
      return (
        this === o ||
        (
          o instanceof SemVer &&
          this.major === o.major
        )
      );
    }
    
    hash(s) {
      s.writeUint8(this.major);
      s.writeUint8(this.minor); 
      s.writeUint8(this.patch); 
    }
    
    inspect() {
      var s = "SemVer { ";
      s += "major: " + this.major;
      s += ", minor: " + this.minor;
      s += ", patch: " + this.patch;
      s += " }";
      return s;
    }
    
    toJSON() {
      return __str(this);  
    }
    
    toString(): string {
      return SemVer.stringify(this);
    }
    
  }
  
  //util
  function __str(o) { return String(o); }
  function __cmp(a: number, b: number) {
    /*var anum = numeric.test(a);
    var bnum = numeric.test(b);
  
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
  
    return (anum && !bnum) ? -1 :
           (bnum && !anum) ? 1 :
           a < b ? -1 :
           a > b ? 1 :
           0;*/
  }
  
  function __cmpMain(a: ISemVer, b: ISemVer): number {
    return NaN;
  }
  
  function __cmpPre(a: ISemVer, b: ISemVer): number {
    return NaN;
  }
  
}
export = semver