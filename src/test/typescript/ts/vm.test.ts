import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import vm = require("../../../main/typescript/ts/vm")

export default suite("ts/vm", (self) => {

  test(".global", (assert) => {
    var global = vm.global
    assert.strictEqual(typeof global, "object")
    assert.strictEqual(global.setTimeout, setTimeout)
    assert.strictEqual(global.clearTimeout, clearTimeout)
  })

  test(".compile()", (assert) => {
    // simple
    var fn = vm.compile("return 'abc';")
    assert.strictEqual(typeof fn, "function")
    assert.strictEqual(fn(), 'abc')

    //with context
    var context: {[key: string]: any} = {a: 1, b: 2, c: null}
    var fnCtx = vm.compile("c = a + b; this.d = c;return c;")
    var returnValue = fnCtx(context)
    assert.strictEqual(returnValue, 3)
    assert.strictEqual(context['c'], 3)
    assert.strictEqual(context['d'], 3)
  })
  
  test(".eval()", (assert) => {
    // simple
    var returnValue = vm.eval("return 'abc';")
    assert.strictEqual(returnValue, "abc")

    //with context
    var context: {[key: string]: any} = {a: 1, b: 2, c: null}
    returnValue = vm.eval("c = a + b; this.d = c;return c;", context)
    assert.strictEqual(returnValue, 3)
    assert.strictEqual(context['c'], 3)
    assert.strictEqual(context['d'], 3)
  })

})