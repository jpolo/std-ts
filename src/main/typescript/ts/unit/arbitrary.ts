import { IIterator, IIteratorResult } from "../iterator";
import { oneOf, random, from } from "./generator";
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

type IGenerator<T> = IIterator<T>;

function GeneratorCreate<T>(f: {(v?: any): IIteratorResult<T>}) {
  return {
    next(v?: any): IIteratorResult<T> {
      return f(v);
    }
  };
}

function GeneratorMap<T, U>(g: IGenerator<T>, f: (v: T) => U): IGenerator<U> {
  return GeneratorCreate(function (v?: any) {
    let iterResult = g.next(v);
    let iterMapped: IIteratorResult<U> = iterResult.done ? <any>iterResult : { done: false, value: f(iterResult.value) };
    return iterMapped;
  });
}

function GeneratorRandomInt(min: number|IGenerator<number>, max: number|IGenerator<number>) {
  let genMin = GeneratorFrom<number>(<any>min);
  let genMax = GeneratorFrom<number>(<any>max);
  return GeneratorFrom(function (p) {
    let minResult = genMin.next(p);
    let maxResult = genMax.next(p);
    let n = p.random();
    let minValue = minResult.value;
    let maxValue = maxResult.value;
    return minResult.done || maxResult.done ? NaN :
      Floor(n * (maxValue - minValue + 1)) + minValue;
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
export const date = ArbitraryCreate(GeneratorRandomDate(DATE_MIN_MILLISECONDS, DATE_MAX_MILLISECONDS));
export const datePast = ArbitraryCreate(GeneratorRandomDate(DATE_MIN_MILLISECONDS, genNow));
export const dateFuture = ArbitraryCreate(GeneratorRandomDate(genNow, DATE_MAX_MILLISECONDS));
