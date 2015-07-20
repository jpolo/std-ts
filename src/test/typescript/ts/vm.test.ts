import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import { global, run, compile } from "../../../main/typescript/ts/vm"

export default suite("ts/vm", (self) => {

  test(".global", (assert) => {
    assert.strictEqual(typeof global, "object")
    assert.strictEqual(global.setTimeout, setTimeout)
    assert.strictEqual(global.clearTimeout, clearTimeout)
  })

  test(".compile()", (assert) => {
    // simple
    let fn = compile("return 'abc';")
    assert.strictEqual(typeof fn, "function")
    assert.strictEqual(fn(), 'abc')

    //with context
    let context: {[key: string]: any} = {a: 1, b: 2, c: null}
    let fnCtx = compile("c = a + b; this.d = c;return c;")
    let returnValue = fnCtx(context)
    assert.strictEqual(returnValue, 3)
    assert.strictEqual(context['c'], 3)
    assert.strictEqual(context['d'], 3)
  })

  test(".run()", (assert) => {

    // simple
    let returnValue = run("return 'abc';")
    assert.strictEqual(returnValue, "abc")

    //with context
    let context: {[key: string]: any} = {a: 1, b: 2, c: null}
    returnValue = run("c = a + b; this.d = c;return c;", context)
    assert.strictEqual(returnValue, 3)
    assert.strictEqual(context['c'], 3)
    assert.strictEqual(context['d'], 3)
  })

})
