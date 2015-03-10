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
      assert.strictEqual(f(data[i][0]), data[i][1]);
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
    [1, "1"],
    [1.234, "1.234"],
    [Math.PI, "3.141592653589793"]
  );
  var STRINGS = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    ['', '""'],
    ['foobar', '"foobar"']
    ['lorem ipsum "sorem" foo bar', '"lorem ipsum \\"so..."']
  );
  var OBJECTS = inspectResults(
    [undefined, "undefined"],
    [null, "null"],
    [new Boolean(true), 'Boolean { true }'],
    [new Number(123.4545), 'Number { 123.4545 }']
  );
  var ALL = [].concat(NUMBERS, BOOLEANS, STRINGS, OBJECTS);
  
  test("#stringify()", (assert) => {
    //generate(assert, ALL, (o) => inspectObj.stringify(o));

    assert.strictEqual(inspectObj.stringify(undefined), 'undefined')
    assert.strictEqual(inspectObj.stringify(null), 'null')
    assert.strictEqual(inspectObj.stringify(true), 'true')
    assert.strictEqual(inspectObj.stringify(false), 'false')
    assert.strictEqual(inspectObj.stringify(new Boolean(true)), 'Boolean { true }')
    assert.strictEqual(inspectObj.stringify(0), '0')
    assert.strictEqual(inspectObj.stringify(123.4545), '123.4545')
    assert.strictEqual(inspectObj.stringify(new Number(123.4545)), 'Number { 123.4545 }')
    assert.strictEqual(inspectObj.stringify('foobar'), '"foobar"')
    assert.strictEqual(inspectObj.stringify(new String('foobar')), 'String { "foobar" }')
    assert.strictEqual(inspectObj.stringify('lorem ipsum "sorem" foo bar'), '"lorem ipsum \\"so..."')
    assert.strictEqual(inspectObj.stringify(Math.PI), '3.141592653589793')
    assert.strictEqual(inspectObj.stringify(new Date(0)), 'Date { 1970-01-01T00:00:00.000Z }')
    assert.strictEqual(inspectObj.stringify(/abc/gi), '/abc/gi') 
    assert.strictEqual(inspectObj.stringify(function foo(a, b, c) { return 'blah' }), 'function foo(a, b, c) {...}')
    assert.strictEqual(inspectObj.stringify({"foo": true, bar: 123}), '{ foo: true, bar: 123 }')
    assert.strictEqual(
      inspectObj.stringify({ _0: "p0", _1: "p1", _2: "p2", _3: "p3", _4: "p4", _5: "p5" }), 
      '{ _0: "p0", _1: "p1", _2: "p2", ... }'
    )
    assert.strictEqual(inspectObj.stringify(new TestClass()), 'TestClassFoo { foo: true }')
    assert.strictEqual(inspectObj.stringify(new TypeError("blah")), "TypeError {}")
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
  
  
})
  
export = inspectSuite