import { IGenerator, constant, oneOf, random } from "./generator"

const StringFromCodeUnit = String.fromCharCode
const MathFloor = Math.floor

function ArbitraryCreate<T>(g: IGenerator<T>) {
  return function (p?: { size?: number; random?: () => number }) {
    return g.next(p)
  }
}

//Boolean
export const boolean = ArbitraryCreate(oneOf([ true, false ]))
export const truthy = ArbitraryCreate(oneOf<any>([ true, {}, [], new Date() ]))
export const falsy = ArbitraryCreate(oneOf<any>([ false, null, undefined, "", 0, NaN ]))

//Number
export const int8 = ArbitraryCreate(random(-0x80, 0x7f).map(MathFloor))
export const int16 = ArbitraryCreate(random(-0x8000, 0x7fff).map(MathFloor))
export const int32 = ArbitraryCreate(random(-0x80000000, 0x7fffffff).map(MathFloor))

export const uint8 = ArbitraryCreate(random(0, 0xff).map(MathFloor))
export const uint16 = ArbitraryCreate(random(0, 0xffff).map(MathFloor))
export const uint32 = ArbitraryCreate(random(0, 0xffffffff).map(MathFloor))

//String
export const char = ArbitraryCreate(random(0, 0xff).map(StringFromCodeUnit))
export const charASCII = ArbitraryCreate(random(0x20, 0x7e).map(StringFromCodeUnit))
/*
const date = ArbitraryCreate(random(0, 1000).map(function (v) { return new Date(v); }))
const datePast = ArbitraryCreate(integer(0, 1000).map(function (v) { return new Date(v); }))
const dateFuture = ArbitraryCreate(integer(0, 1000).map(function (v) { return new Date(v); }))
*/
