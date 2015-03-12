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
  
  var inspector = new inspect.Inspector({ maxElements: 3, maxString: 15 })
  var EMPTY = inspectResults(
    [undefined, "undefined"],
    [null, "null"]
  );
  var BOOLEANS = inspectResults<boolean|Boolean>(
    [true, "true"],
    [false, "false"]
  );
  var BOOLEANS_OBJ = inspectResults(
    [new Boolean(true), "Boolean { true }"],
    [new Boolean(false), "Boolean { false }"]
  );
  var NUMBERS = inspectResults(
    [NaN, "NaN"],
    [0, "0"],
    [1, "1"],
    [-1, "-1"],
    [1.234, "1.234"],
    [Math.PI, "3.141592653589793"]
  );
  var NUMBERS_OBJ = inspectResults(
    [new Number(0), "Number { 0 }"],
    [new Number(123), "Number { 123 }"]
  );
  var STRINGS = inspectResults(
    ['', '""'],
    ['foobar', '"foobar"'],
    ['lorem ipsum "sorem" foo bar', '"lorem ipsum \\"so..."']
  );
  var STRINGS_OBJ = inspectResults(
    [new String("foobar"), 'String { "foobar" }'],
    [new String('lorem ipsum "sorem" foo bar'), 'String { "lorem ipsum \\"so..." }']
  );
  var OBJECTS = inspectResults(
    [new Boolean(true), 'Boolean { true }'],
    [new Number(123.4545), 'Number { 123.4545 }'],
    [new String("foobar"), 'String { "foobar" }'],
    [{"foo": true, bar: 123}, '{ foo: true, bar: 123 }'],
    [{ _0: "p0", _1: "p1", _2: "p2", _3: "p3", _4: "p4", _5: "p5" }, '{ _0: "p0", _1: "p1", _2: "p2", ... }'],
    [new TestClass(), 'TestClassFoo { foo: true }'],
    [new TypeError("blah"), "TypeError {}" ]
  );
  var FUNCTIONS = inspectResults(
    [function (a, b, c) { return 'blah' }, 'function (a, b, c) {...}'],
    [function foo(a, b, c) { return 'blah' }, 'function foo(a, b, c) {...}'],
    [String.prototype.charAt, 'function charAt() {...}']
  );
  var DATES = inspectResults(
    [new Date(0), 'Date { 1970-01-01T00:00:00.000Z }']
  );
  var REGEXP = inspectResults(
    [/abc/gi, '/abc/gi']
  );
  var ALL = [].concat(NUMBERS, BOOLEANS, BOOLEANS_OBJ, STRINGS, STRINGS_OBJ, OBJECTS, FUNCTIONS, DATES);

  
  test("#stringify()", (assert) => {
    generate(assert, ALL, (o) => inspector.stringify(o));
  })
  
  test("#stringifyUndefined()", (assert) => {
    assert.strictEqual(inspector.stringifyUndefined(), 'undefined');
  })
  
  test("#stringifyNull()", (assert) => {
    assert.strictEqual(inspector.stringifyNull(), 'null');
  })
  
  test("#stringifyBoolean()", (assert) => {
    generate(assert, BOOLEANS.concat(BOOLEANS_OBJ, EMPTY), (b) => inspector.stringifyBoolean(b));
  })
  
  test("#stringifyNumber()", (assert) => {
    generate(assert, NUMBERS.concat(NUMBERS_OBJ, EMPTY), (n) => inspector.stringifyNumber(n));
  })
  
  test("#stringifyString()", (assert) => {
    generate(assert, STRINGS.concat(STRINGS_OBJ, EMPTY), (s) => inspector.stringifyString(s));
  })
  
  test("#stringifyObject()", (assert) => {
    generate(assert, OBJECTS.concat(EMPTY), (o) => inspector.stringifyObject(o));
  })
  
  test("#stringifyFunction()", (assert) => {
    generate(assert, FUNCTIONS.concat(EMPTY), (o) => inspector.stringifyFunction(o));
  })
  
  test("#stringifyDate()", (assert) => {
    generate(assert, DATES.concat(EMPTY), (d) => inspector.stringifyDate(d));
  })
  
  test("#stringifyRegExp()", (assert) => {
    generate(assert, REGEXP.concat(EMPTY), (d) => inspector.stringifyRegExp(d));
  })
  
})
  
export = inspectSuite