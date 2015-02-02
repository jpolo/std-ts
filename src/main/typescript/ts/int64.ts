module int64 {

  export interface IInt64 {
    hi: number
    lo: number
  }

  export class Int64 implements IInt64 {

    static compare(a: IInt64, b: IInt64): number {
      return (a.hi - b.hi) || (a.lo - b.lo);
    }

    static stringify(a: IInt64, radix: number = 10): string {
      return ""
    }


    hi: number;
    lo: number;

    constructor(
        hi: number = 0,
        lo: number = 0
    ) {
      this.hi = hi >>> 0;
      this.lo = lo >>> 0;
    }

    compare(o: IInt64) {
      return Int64.compare(this, o);
    }

    equals(o: any): boolean {
      return (
        this == o ||
        (this instanceof this.constructor && this.compare(o) === 0)
      );
    }

    inspect() {
      return "Int64 { " + this + " }";
    }

    toString(radix = 10) {
      return Int64.stringify(this, radix);
    }

  }

}

export = int64;