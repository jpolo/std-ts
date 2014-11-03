import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import log = require("../../../main/typescript/ts/log")
import Logger = log.Logger
import Engine = log.engine.Engine
import Message = log.Message

var logSuite = suite("ts/log", (self) => {
  var ng: Engine
  
  self.setUp = () => {
    ng = new Engine()
  }
  
  test("logger()", (assert) => {
    assert.strictEqual(log.logger('test.foo.bar.baz').name, 'test.foo.bar.baz')
    assert.strictEqual(log.logger('test.foo.bar').name, 'test.foo.bar')
    assert.strictEqual(log.logger('test.foo').name, 'test.foo')
    assert.strictEqual(log.logger('test').name, 'test')
      
    assert.strictEqual(log.logger('test.foo.bar'), log.logger('test.foo.bar'))
  })
    
  test("Message#inspect()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", "mymessage")
    assert.strictEqual(message.inspect(), 'Message { level: DEBUG, group: "mygroup", message: "mymessage" }')
  })
    
  test("Message#toString()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", "mymessage")
    assert.strictEqual(message.toString(), '[DEBUG|mygroup] mymessage')
  })  
  
  
  test("Level#valueOf()", (assert) => {
    assert.strictEqual(+log.DEBUG, 0)
    assert.strictEqual(+log.INFO, 10)
    assert.strictEqual(+log.WARN, 20) 
    assert.strictEqual(+log.ERROR, 30)
    assert.strictEqual(+log.FATAL, 40)
  })
    
  test("Level#inspect()", (assert) => {
    assert.strictEqual(log.DEBUG.inspect(), 'Level { name: "DEBUG", value: 0 }')
    assert.strictEqual(log.INFO.inspect(), 'Level { name: "INFO", value: 10 }')
    assert.strictEqual(log.WARN.inspect(), 'Level { name: "WARN", value: 20 }') 
    assert.strictEqual(log.ERROR.inspect(), 'Level { name: "ERROR", value: 30 }')
    assert.strictEqual(log.FATAL.inspect(), 'Level { name: "FATAL", value: 40 }')
  })
    
  test("Level#toString()", (assert) => {
    assert.strictEqual(log.DEBUG.toString(), 'DEBUG')
    assert.strictEqual(log.INFO.toString(), 'INFO')
    assert.strictEqual(log.WARN.toString(), 'WARN') 
    assert.strictEqual(log.ERROR.toString(), 'ERROR')
    assert.strictEqual(log.FATAL.toString(), 'FATAL')
  })
  
  
  
  test("Logger#toString()", (assert) => {
    assert.strictEqual((new Logger('test.foo', ng)).toString(), 'Logger { test.foo }')
  })
})

export = logSuite