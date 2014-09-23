import unit = require("../../../main/typescript/ts/unit");
import suite = unit.suite;
import test = unit.test;

import vm = require("../../../main/typescript/ts/vm");

var vmSuite = suite("ts/vm", (self) => {

  test("global", (assert) => {
    var global = vm.global;
    assert.strictEqual(typeof global, "object");
    assert.strictEqual(global.setTimeout, setTimeout);
    assert.strictEqual(global.clearTimeout, clearTimeout);
  })

  test("isInstanceOf(o, Class)", (assert) => {
    var isInstanceOf = vm.isInstanceOf;
    assert.ok(isInstanceOf(new String("fsdfs"), String));
    assert.ok(!isInstanceOf("fsdfs", Number));
  })

  test("stringTag(o)", (assert) => {
    var stringTag = vm.stringTag;
    assert.strictEqual(stringTag("fsdfs"), "String");
    assert.strictEqual(stringTag(new String("fsdfs")), "String");
    assert.strictEqual(stringTag(123), "Number");
    assert.strictEqual(stringTag([]), "Array");
  })

  test("callstack(offset?, error?)", (assert) => {
    var stack = vm.callstack();
    assert.instanceOf(stack, Array);
    assert.ok(stack.length > 0);
  })

  test("run(jscode: string, context?)", (assert) => {
    // simple
    var returnValue = vm.run("return 'abc';");
    assert.strictEqual(returnValue, "abc");

    //with context
    var context: {[key: string]: any} = {a: 1, b: 2, c: null};
    returnValue = vm.run("c = a + b; this.d = c;return c;", context);
    assert.strictEqual(returnValue, 3);
    assert.strictEqual(context['c'], 3);
    assert.strictEqual(context['d'], 3);
  })

})

export = vmSuite;
