import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import log = require("../../../main/typescript/ts/log")


var logSuite = suite("ts/log", (self) => {

  test("logger()", (assert) => {
    assert.strictEqual(log.logger('test.foo.bar.baz').name, 'test.foo.bar.baz')
    assert.strictEqual(log.logger('test.foo.bar').name, 'test.foo.bar')
    assert.strictEqual(log.logger('test.foo').name, 'test.foo')
    assert.strictEqual(log.logger('test').name, 'test')
      
    assert.strictEqual(log.logger('test.foo.bar'), log.logger('test.foo.bar'))
  })
  
  
})
  
export = logSuite