import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import inspect = require("../../../main/typescript/ts/inspect")

class TestClass {

  static displayName = 'TestClassFoo'
  
  constructor(public foo = true) {}
  
}

var inspectSuite = suite("ts/inspect.Inspect", (self) => {
  function inspectResults<T>(...args: Array<{ 0: T; 1: string; }>) {
    return args;
  }
  
  function generate<T>(assert, data: Array<{ 0: T; 1: string; }>, f: (v: T) => string) {
    for (var i = 0; i < data.length; ++i) {
      var r = data[i];
      assert.strictEqual(f(r[0]), r[1]);
    }
  }
  
  var inspectObj = new inspect.engine.Engine({ maxElements: 3, maxString: 15 })
  var BOOLEANS = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    [true, "true"],
    [false, "false"]
  );
  var NUMBERS = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    [NaN, "NaN"],
    [0, "0"],
    [1, "1"],
    [-1, "-1"],
    [1.234, "1.234"],
    [Math.PI, "3.141592653589793"]
  );
  var STRINGS = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    ['', '""'],
    ['foobar', '"foobar"'],
    ['lorem ipsum "sorem" foo bar', '"lorem ipsum \\"so..."']
  );
  var OBJECTS = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    [new Boolean(true), 'Boolean { true }'],
    [new Number(123.4545), 'Number { 123.4545 }'],
    [new String("foobar"), 'String { "foobar" }'],
    [{"foo": true, bar: 123}, '{ foo: true, bar: 123 }'],
    [{ _0: "p0", _1: "p1", _2: "p2", _3: "p3", _4: "p4", _5: "p5" }, '{ _0: "p0", _1: "p1", _2: "p2", ... }'],
    [new TestClass(), 'TestClassFoo { foo: true }'],
    [new TypeError("blah"), "TypeError {}" ]
  );
  var FUNCTIONS = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    [function (a, b, c) { return 'blah' }, 'function (a, b, c) {...}'],
    [function foo(a, b, c) { return 'blah' }, 'function foo(a, b, c) {...}']
  );
  var DATES = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    [new Date(0), 'Date { 1970-01-01T00:00:00.000Z }']
  );
  var REGEXP = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    [/abc/gi, '/abc/gi']
  );
  var ALL = [].concat(NUMBERS, BOOLEANS, STRINGS, OBJECTS, DATES);

  
  test("#stringify()", (assert) => {
    generate(assert, ALL, (o) => inspectObj.stringify(o));
  })
  
  test("#stringifyUndefined()", (assert) => {
    assert.strictEqual(inspectObj.stringifyUndefined(), 'undefined');
  })
  
  test("#stringifyNull()", (assert) => {
    assert.strictEqual(inspectObj.stringifyNull(), 'null');
  })
  
  test("#stringifyBoolean()", (assert) => {
    generate(assert, BOOLEANS, (b) => inspectObj.stringifyBoolean(b));
  })
  
  test("#stringifyNumber()", (assert) => {
    generate(assert, NUMBERS, (n) => inspectObj.stringifyNumber(n));
  })
  
  test("#stringifyString()", (assert) => {
    generate(assert, STRINGS, (s) => inspectObj.stringifyString(s));
  })
  
  test("#stringifyObject()", (assert) => {
    generate(assert, OBJECTS, (o) => inspectObj.stringifyObject(o));
  })
  
  test("#stringifyDate()", (assert) => {
    generate(assert, DATES, (d) => inspectObj.stringifyDate(d));
  })
  
})
  
export = inspectSuite