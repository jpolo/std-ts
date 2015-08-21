import { IGenerator, constant, oneOf, random, from } from "./generator"

const DATE_MAX_MILLISECONDS = 8640000000000000
const DATE_MIN_MILLISECONDS = -DATE_MAX_MILLISECONDS
const Now = Date.now || function () { return new Date().getTime() }
const GeneratorCreate = from

function GeneratorMap<A, B>(g: IGenerator<A>, f: (v: A) => B): IGenerator<B> {
  return g.map(f)
}

function GeneratorRandomInt(min: number|IGenerator<number>, max: number|IGenerator<number>) {
  return GeneratorMap(random(min, max), Math.floor)
}

function GeneratorRandomChar(min: number|IGenerator<number>, max: number|IGenerator<number>) {
  return GeneratorMap(random(min, max), function (n) {
    return String.fromCharCode(Math.floor(n))
  })
}

function GeneratorRandomDate(min: number|IGenerator<number>, max: number|IGenerator<number>) {
  return GeneratorMap(random(min, max), function (n) {
    return new Date(n)
  })
}

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
export const int8 = ArbitraryCreate(GeneratorRandomInt(-0x80, 0x7f))
export const int16 = ArbitraryCreate(GeneratorRandomInt(-0x8000, 0x7fff))
export const int32 = ArbitraryCreate(GeneratorRandomInt(-0x80000000, 0x7fffffff))

export const uint8 = ArbitraryCreate(GeneratorRandomInt(0, 0xff))
export const uint16 = ArbitraryCreate(GeneratorRandomInt(0, 0xffff))
export const uint32 = ArbitraryCreate(GeneratorRandomInt(0, 0xffffffff))

//String
export const char = ArbitraryCreate(GeneratorRandomChar(0, 0xff))
export const charASCII = ArbitraryCreate(GeneratorRandomChar(0x20, 0x7e))

//Date
const genNow = GeneratorCreate(Now)

const date = ArbitraryCreate(random(DATE_MIN_MILLISECONDS, DATE_MAX_MILLISECONDS))
const datePast = ArbitraryCreate(random(DATE_MIN_MILLISECONDS, genNow))
const dateFuture = ArbitraryCreate(random(genNow, DATE_MAX_MILLISECONDS))
