import { IGenerator, constant, oneOf, random, from } from "./generator";
import {
  Now,
  INT8_MIN_VALUE, INT8_MAX_VALUE,
  INT16_MIN_VALUE, INT16_MAX_VALUE,
  INT32_MIN_VALUE, INT32_MAX_VALUE,
  UINT8_MIN_VALUE, UINT8_MAX_VALUE,
  UINT16_MIN_VALUE, UINT16_MAX_VALUE,
  UINT32_MIN_VALUE, UINT32_MAX_VALUE,
  DATE_MIN_MILLISECONDS, DATE_MAX_MILLISECONDS
} from "./util";

const Floor = Math.floor;
const GeneratorFrom = from;
const genNow = GeneratorFrom(Now);

function GeneratorMap<A, B>(g: IGenerator<A>, f: (v: A) => B): IGenerator<B> {
  return g.map(f);
}

function GeneratorRandomInt(min: number|IGenerator<number>, max: number|IGenerator<number>) {
  let genMin = GeneratorFrom<number>(<any>min);
  let genMax = GeneratorFrom<number>(<any>max);
  return GeneratorFrom(function (p) {
    let minValue = genMin.next(p);
    let maxValue = genMax.next(p);
    let n = p.random();
    return Floor(n * (maxValue - minValue + 1)) + minValue;
  });
}

function GeneratorRandomChar(min: number|IGenerator<number>, max: number|IGenerator<number>) {
  return GeneratorMap(GeneratorRandomInt(min, max), String.fromCharCode);
}

function GeneratorRandomDate(min: number|IGenerator<number>, max: number|IGenerator<number>) {
  return GeneratorMap(random(min, max), function (n) {
    return new Date(n);
  });
}

function ArbitraryCreate<T>(g: IGenerator<T>) {
  return function (p?: { size?: number; random?: () => number }) {
    return g.next(p);
  };
}

// Boolean
export const boolean = ArbitraryCreate(oneOf([ true, false ]));
export const truthy = ArbitraryCreate(oneOf<any>([ true, {}, [], new Date() ]));
export const falsy = ArbitraryCreate(oneOf<any>([ false, null, undefined, "", 0, NaN ]));

// Number
export const int8 = ArbitraryCreate(GeneratorRandomInt(INT8_MIN_VALUE, INT8_MAX_VALUE));
export const int16 = ArbitraryCreate(GeneratorRandomInt(INT16_MIN_VALUE, INT16_MAX_VALUE));
export const int32 = ArbitraryCreate(GeneratorRandomInt(INT32_MIN_VALUE, INT32_MAX_VALUE));

export const uint8 = ArbitraryCreate(GeneratorRandomInt(UINT8_MIN_VALUE, UINT8_MAX_VALUE));
export const uint16 = ArbitraryCreate(GeneratorRandomInt(UINT16_MIN_VALUE, UINT16_MAX_VALUE));
export const uint32 = ArbitraryCreate(GeneratorRandomInt(UINT32_MIN_VALUE, UINT32_MAX_VALUE));

// String
export const char = ArbitraryCreate(GeneratorRandomChar(0, 0xff));
export const charASCII = ArbitraryCreate(GeneratorRandomChar(0x20, 0x7e));

// Date
const date = ArbitraryCreate(random(DATE_MIN_MILLISECONDS, DATE_MAX_MILLISECONDS));
const datePast = ArbitraryCreate(random(DATE_MIN_MILLISECONDS, genNow));
const dateFuture = ArbitraryCreate(random(genNow, DATE_MAX_MILLISECONDS));
