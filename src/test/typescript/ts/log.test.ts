import unit = require("../../../main/typescript/ts/unit")
import test = unit.test
import log = require("../../../main/typescript/ts/log")
import ILevel = log.ILevel
import IMessage = log.IMessage
import Logger = log.Logger
import Dispatcher = log.Dispatcher
import Message = log.Message


var logSuite = unit.suite("ts/log", (self) => {
  var ng: Dispatcher
  var logger: Logger
  var logs: log.IMessage[]
  
  self.setUp = () => {
    ng = new Dispatcher()
    logger = ng.getLogger('test')
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

})

var MessageSuite = unit.suite("ts/log.Message", (self, test) => {
  
  test("#constructor()", (assert) => {
    var m = new Message(log.DEBUG, "mygroup", ["mymessage"]);
    assert.strictEqual(m.level, log.DEBUG);
    assert.strictEqual(m.group, "mygroup");
    assert.deepEqual(m.data, ["mymessage"]);
  })
  
  test("#equals()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", ["mymessage"])
    assert.strictEqual(message.equals(null), false)
    assert.strictEqual(message.equals(new Message(log.DEBUG, "mygroup", ["mymessage"])), true)
    assert.strictEqual(message.equals(new Message(log.DEBUG, "mygrou", ["mymessage"])), false)
    assert.strictEqual(message.equals(new Message(log.DEBUG, "mygroup", ["mymessag"])), false)
  })
    
  test("#inspect()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", ["mymessage"])
    assert.strictEqual(message.inspect(), 'Message { level: DEBUG, group: "mygroup", data: ["mymessage"] }')
  })
    
  test("#toString()", (assert) => {
    var message = new Message(log.DEBUG, "mygroup", ["mymessage"])
    assert.strictEqual(message.toString(), '[DEBUG|mygroup] mymessage')
  })
  
})

var LevelSuite = unit.suite("ts/log.Level", () => {
  var PRIVATE_KEY = log.Level['_constructorKey'];
  var DEBUG = log.DEBUG;
  var INFO = log.INFO;
  var WARN = log.WARN;
  var ERROR = log.ERROR;
  var FATAL = log.FATAL;

  test("#constructor()", (assert) => {
    //private constructor
    assert.throws(() => {
      var l = new log.Level("blah", 0, {});
    })
  })

  test("#valueOf()", (assert) => {
    assert.strictEqual(+DEBUG, 0)
    assert.strictEqual(+INFO, 10)
    assert.strictEqual(+WARN, 20) 
    assert.strictEqual(+ERROR, 30)
    assert.strictEqual(+FATAL, 40)
  })
  
  test("#compare()", (assert) => {
    var level = new log.Level("BLAH", DEBUG.value, PRIVATE_KEY)
    assert.strictEqual(level.compare(null), null)
    assert.strictEqual(DEBUG.compare(DEBUG), 0)
  })
    
  test("#equals()", (assert) => {
    var level = new log.Level("BLAH", DEBUG.value, PRIVATE_KEY)
    assert.strictEqual(level.equals(null), false)
    assert.strictEqual(level.equals(DEBUG), true)
    assert.strictEqual(level.equals(INFO), false)
    assert.strictEqual(level.equals({ name: "BLAH", value: DEBUG.value}), false)
  })
    
  test("#inspect()", (assert) => {
    assert.strictEqual(DEBUG.inspect(), 'Level { name: "DEBUG", value: 0 }')
    assert.strictEqual(INFO.inspect(), 'Level { name: "INFO", value: 10 }')
    assert.strictEqual(WARN.inspect(), 'Level { name: "WARN", value: 20 }') 
    assert.strictEqual(ERROR.inspect(), 'Level { name: "ERROR", value: 30 }')
    assert.strictEqual(FATAL.inspect(), 'Level { name: "FATAL", value: 40 }')
  })
    
  test("#toString()", (assert) => {
    assert.strictEqual(DEBUG.toString(), 'DEBUG')
    assert.strictEqual(INFO.toString(), 'INFO')
    assert.strictEqual(WARN.toString(), 'WARN') 
    assert.strictEqual(ERROR.toString(), 'ERROR')
    assert.strictEqual(FATAL.toString(), 'FATAL')
  })
})

var LoggerSuite = unit.suite("ts/log.Logger", (self) => {
  //mock engine
  var logger: Logger;
  var logs: IMessage[] = [];
  var ng: log.IDispatcher = {
    isEnabledFor: (level: ILevel, group: string) => { return true; },
    send: (level: ILevel, group: string, data: any[]) => {
      logs.push(createMessage(level, group, data));
    }
  };
  
  function createMessage(level: ILevel, group: string, data: any[]): IMessage {
    return new Message(level, group, data);
  }
  
  function createLogger(name: string) {
    return new Logger(name, ng);
  }
  
  self.setUp = () => {
    logger = createLogger("foobar");
    
    //empty logs
    logs.length = 0;
  }
  
  test("#inspect()", (assert) => {
    assert.strictEqual(createLogger("test").inspect(), 'Logger { name: "test" }')
    assert.strictEqual(createLogger("test.foo").inspect(), 'Logger { name: "test.foo" }')
    assert.strictEqual(createLogger("test.foo.bar").inspect(), 'Logger { name: "test.foo.bar" }')
  })
    
  test("#debug()", (assert) => {
    assert.strictEqual(logs.length, 0)
    logger.debug("blah blah")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new log.Message(log.DEBUG, "foobar", ["blah blah"]))
  })
  
  test("#log()", (assert) => {
    assert.strictEqual(logs.length, 0)
    
    logger.log(log.DEBUG, "blah blah")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new log.Message(log.DEBUG, "foobar", ["blah blah"]))
    
    logger.log(log.ERROR, "blah error")
    assert.strictEqual(logs.length, 2)
    assert.equal(logs[1], new log.Message(log.ERROR, "foobar", ["blah error"]))
  })
  
  test("#toString()", (assert) => {
    assert.strictEqual(createLogger("test").toString(), 'Logger { name: "test" }')
    assert.strictEqual(createLogger("test.foo").toString(), 'Logger { name: "test.foo" }')
  })
  
})

var exportSuite = logSuite.concat(LevelSuite, MessageSuite, LoggerSuite);

export = exportSuite