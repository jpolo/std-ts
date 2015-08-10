import { IGenerator, constant, oneOf, random } from "./generator";

function arbitrary<T>(g: IGenerator<T>) {
  return function () {
    return g.next();
  };
}

//Boolean
export const boolean = arbitrary(oneOf([ true, false ]));
export const truthy = arbitrary(oneOf<any>([ true, {}, [], new Date() ]));
export const falsy = arbitrary(oneOf<any>([ false, null, undefined, "", 0, NaN ]));

//Number
export const int8 = arbitrary(random(-0x80, 0x7f));
export const int16 = arbitrary(random(-0x8000, 0x7fff));
export const int32 = arbitrary(random(-0x80000000, 0x7fffffff));

export const uint8 = arbitrary(random(0, 0xff));
export const uint16 = arbitrary(random(0, 0xffff));
export const uint32 = arbitrary(random(0, 0xffffffff));

//String
export const char = arbitrary(random(0, 0xff).map(String.fromCharCode));
export const charASCII = arbitrary(random(0x20, 0x7e).map(String.fromCharCode));
/*
const date = arbitrary(random(0, 1000).map(function (v) { return new Date(v); }));
const datePast = arbitrary(integer(0, 1000).map(function (v) { return new Date(v); }));
const dateFuture = arbitrary(integer(0, 1000).map(function (v) { return new Date(v); }));
*/
