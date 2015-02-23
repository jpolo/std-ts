module semver {

  export interface ISemVer {
    major: number;
    minor: number;
    patch: number;
  }
  
  export class SemVer implements ISemVer {
    
    static compare(a: ISemVer, b: ISemVer): number {
      return NaN;
    }
    
    static stringify(v: ISemVer): string {
      return "";
    }
    
    constructor(
      public major = 0,
      public minor = 0,
      public patch = 0
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
    
    toJSON() {
      return __str(this);  
    }
    
    toString(): string {
      return SemVer.stringify(this);
    }
    
  }
  
  //util
  function __str(o) { return String(o); }
  
}
export = semver