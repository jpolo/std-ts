import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import log = require("../../../main/typescript/ts/log")
import Logger = log.Logger
import Engine = log.engine.Engine
import Message = log.Message

var logSuite = suite("ts/log", (self) => {
  var ng: Engine
  var logger: Logger
  var logs: log.IMessage[]
  
  self.setUp = () => {
    ng = new Engine()
    logger = ng.logger('test')
    logs = []
      
    ng.reporters['simple'] = {
      filter: null,
      reporter: new log.reporter.Array(logs)
    }
  }
  
  test("logger()", (assert) => {
    assert.strictEqual(log.logger('test.foo.bar.baz').name, 'test.foo.bar.baz')
    assert.strictEqual(log.logger('test.foo.bar').name, 'test.foo.bar')
    assert.strictEqual(log.logger('test.foo').name, 'test.foo')
    assert.strictEqual(log.logger('test').name, 'test')
      
    assert.strictEqual(log.logger('test.foo.bar'), log.logger('test.foo.bar'))
  })
    
  test("Message#equals()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", "mymessage")
    assert.strictEqual(message.equals(null), false)
    assert.strictEqual(message.equals(new Message(log.DEBUG, "mygroup", "mymessage")), true)
    assert.strictEqual(message.equals(new Message(log.DEBUG, "mygrou", "mymessage")), false)
    assert.strictEqual(message.equals(new Message(log.DEBUG, "mygroup", "mymessag")), false)
  })
    
  test("Message#inspect()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", "mymessage")
    assert.strictEqual(message.inspect(), 'Message { level: DEBUG, group: "mygroup", message: "mymessage" }')
  })
    
  test("Message#toString()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", "mymessage")
    assert.strictEqual(message.toString(), '[DEBUG|mygroup] mymessage')
  })
  
  test("Level#constructor()", (assert) => {
    assert.throws(() => {
      var l = new log.Level("blah", 0, {});
    })
  })

  test("Level#valueOf()", (assert) => {
    assert.strictEqual(+log.DEBUG, 0)
    assert.strictEqual(+log.INFO, 10)
    assert.strictEqual(+log.WARN, 20) 
    assert.strictEqual(+log.ERROR, 30)
    assert.strictEqual(+log.FATAL, 40)
  })
    
  test("Level#equals()", (assert) => {
    var level = new log.Level("BLAH", log.DEBUG.value, log.Level['_constructorKey'])
    assert.strictEqual(level.equals(null), false)
    assert.strictEqual(level.equals(log.DEBUG), true)
    assert.strictEqual(level.equals(log.INFO), false)
    assert.strictEqual(level.equals({ name: "BLAH", value: log.DEBUG.value}), false)
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
  
  
  test("Logger#inspect()", (assert) => {
    assert.strictEqual(ng.logger("test").inspect(), 'Logger { name: "test" }')
    assert.strictEqual(ng.logger("test.foo").inspect(), 'Logger { name: "test.foo" }')
    assert.strictEqual(ng.logger("test.foo.bar").inspect(), 'Logger { name: "test.foo.bar" }')
  })
    
  test("Logger#log()", (assert) => {
    assert.strictEqual(logs.length, 0)
    logger.log(log.DEBUG, "blah blah")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new log.Message(log.DEBUG, "test", "blah blah"))
  })
  
  test("Logger#toString()", (assert) => {
    assert.strictEqual(ng.logger("test").toString(), 'Logger { name: "test" }')
    assert.strictEqual(ng.logger("test.foo").toString(), 'Logger { name: "test.foo" }')
  })
})

export = logSuite