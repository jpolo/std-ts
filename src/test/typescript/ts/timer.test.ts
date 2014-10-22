import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import timer = require("../../../main/typescript/ts/timer")

var timerSuite = suite("ts/timer", (self) => {

  test("setTimeout()", (assert, done) => {
    var called = false
    var timeout = 5
    var timerId = timer.setTimeout(() => { called = true }, timeout)
    setTimeout(() => { assert.ok(!called) }, timeout - 1)
    setTimeout(() => { assert.ok(called); done() }, timeout + 1)
    assert.strictEqual(typeof timerId, 'number')
  })
  
  test("clearTimeout()", (assert, done) => {
    var called = false
    var timeout = 5
    var timerId;
    setTimeout(() => { timer.clearTimeout(timerId) }, timeout - 1)
    timerId = timer.setTimeout(() => { called = true }, timeout)
    setTimeout(() => { assert.ok(!called); done() }, timeout + 1)
  })
    
  test("setInterval()", (assert, done) => {
    var called = 0
    var timeout = 5
    var timerId = timer.setInterval(() => { called++ }, timeout)
    setTimeout(() => { assert.strictEqual(called, 1); }, timeout + 1)
    setTimeout(() => { timer.clearInterval(timerId); done() }, timeout + 1)
      
    assert.strictEqual(typeof timerId, 'number')
  })
  
  test("clearInterval()", (assert, done) => {
    var called = 0
    var timeout = 5
    var timerId = timer.setInterval(() => { called++ }, timeout)
    setTimeout(() => { assert.strictEqual(called, 1); }, timeout + 1)
    setTimeout(() => { timer.clearInterval(timerId);  }, timeout + 1)
    setTimeout(() => { assert.strictEqual(called, 1); done() }, (2 * timeout) + 1)
      
    assert.strictEqual(typeof timerId, 'number')
  })
    
  test("setImmediate()", (assert, done) => {
    var called = false
    var timerId = timer.setImmediate(() => { called = true })
    setTimeout(() => { assert.ok(called); done() }, 1)
      
    assert.strictEqual(typeof timerId, 'number')
  })
  
  test("clearImmediate()", (assert, done) => {
    var called = false
    var timerId = timer.setImmediate(() => { called = true })
    timer.clearImmediate(timerId)
    setTimeout(() => { assert.ok(!called); done() }, 1)
  })
  
})
  
export = timerSuite