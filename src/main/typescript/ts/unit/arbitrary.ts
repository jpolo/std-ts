import { IGenerator, constant, oneOf, random } from "./generator";

function arbitrary<T>(g: IGenerator<T>) {
  return function () {
    return g.next();
  };
}

//Boolean
const boolean = arbitrary(oneOf([ true, false ]));
const truthy = arbitrary(oneOf<any>([ true, {}, [], new Date() ]));
const falsy = arbitrary(oneOf<any>([ false, null, undefined, "", 0, NaN ]));

//Number
const int8 = arbitrary(random(-0x80, 0x7f));
const int16 = arbitrary(random(-0x8000, 0x7fff));
const int32 = arbitrary(random(-0x80000000, 0x7fffffff));

const uint8 = arbitrary(random(0, 0xff));
const uint16 = arbitrary(random(0, 0xffff));
const uint32 = arbitrary(random(0, 0xffffffff));

//String
const char = arbitrary(random(0, 0xff).map(String.fromCharCode));
const charASCII = arbitrary(random(0x20, 0x7e).map(String.fromCharCode));
/*
const date = arbitrary(random(0, 1000).map(function (v) { return new Date(v); }));
const datePast = arbitrary(integer(0, 1000).map(function (v) { return new Date(v); }));
const dateFuture = arbitrary(integer(0, 1000).map(function (v) { return new Date(v); }));
*/
