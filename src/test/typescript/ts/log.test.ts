import { suite, test } from "../../../main/typescript/ts/unit/qunit"
import {
  DEBUG, INFO, WARN, ERROR, FATAL,
  ILevel, IMessage, IDispatcher, Level, Logger, Dispatcher, Message,
  logger, reporter
} from "../../../main/typescript/ts/log"

const logSuite = suite("ts/log", (self) => {
  let ng: Dispatcher
  let loggerObject: Logger
  let logs: IMessage[]

  self.setUp = () => {
    ng = new Dispatcher()
    loggerObject = ng.getLogger('test')
    logs = []

    ng.reporters['simple'] = {
      filter: null,
      reporter: new reporter.Array(logs)
    }
  }

  test(".logger()", (assert) => {
    assert.strictEqual(logger('test.foo.bar.baz').name, 'test.foo.bar.baz')
    assert.strictEqual(logger('test.foo.bar').name, 'test.foo.bar')
    assert.strictEqual(logger('test.foo').name, 'test.foo')
    assert.strictEqual(logger('test').name, 'test')

    assert.strictEqual(logger('test.foo.bar'), logger('test.foo.bar'))
  })

})

const MessageSuite = suite("ts/log.Message", (self) => {

  test("#constructor()", (assert) => {
    let m = new Message(DEBUG, "mygroup", ["mymessage"]);
    assert.strictEqual(m.level, DEBUG);
    assert.strictEqual(m.group, "mygroup");
    assert.deepEqual(m.data, ["mymessage"]);
  })

  test("#equals()", (assert) => {
    let message = new Message(DEBUG, "mygroup", ["mymessage"])
    assert.strictEqual(message.equals(null), false)
    assert.strictEqual(message.equals(new Message(DEBUG, "mygroup", ["mymessage"])), true)
    assert.strictEqual(message.equals(new Message(DEBUG, "mygrou", ["mymessage"])), false)
    assert.strictEqual(message.equals(new Message(DEBUG, "mygroup", ["mymessag"])), false)
  })

  test("#inspect()", (assert) => {
    let message = new Message(DEBUG, "mygroup", ["mymessage"])
    assert.strictEqual(message.inspect(), 'Message { level: DEBUG, group: "mygroup", data: ["mymessage"] }')
  })

  test("#toString()", (assert) => {
    assert.strictEqual(String(new Message(DEBUG, "mygroup", ["foo", "bar"])), '[DEBUG|mygroup] foo bar')
    assert.strictEqual(String(new Message(WARN, "mygroup", ["foo", 1])), '[WARN|mygroup] foo 1')
    assert.strictEqual(String(new Message(ERROR, "mygroup", ["foo", 1])), '[ERROR|mygroup] foo 1')
  })

})

const LevelSuite = suite("ts/log.Level", () => {
  const PRIVATE_KEY = Level['_constructorKey'];

  test("#constructor()", (assert) => {
    // private constructor
    assert.throws(() => {
      let l = new Level("blah", 0, {});
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
    let level = new Level("BLAH", DEBUG.value, PRIVATE_KEY)
    assert.strictEqual(level.compare(null), NaN)
    assert.strictEqual(DEBUG.compare(DEBUG), 0)
  })

  test("#equals()", (assert) => {
    let level = new Level("BLAH", DEBUG.value, PRIVATE_KEY)
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

const LoggerSuite = suite("ts/log.Logger", (self) => {
  // mock engine
  let logger: Logger;
  let logs: IMessage[] = [];
  let ng: IDispatcher = {
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

    // empty logs
    logs.length = 0;
  }

  test("#inspect()", (assert) => {
    assert.strictEqual(createLogger("test").inspect(), 'Logger { name: "test" }')
    assert.strictEqual(createLogger("test.foo").inspect(), 'Logger { name: "test.foo" }')
    assert.strictEqual(createLogger("test.foo.bar").inspect(), 'Logger { name: "test.foo.bar" }')
  })

  test("#debug()", (assert) => {
    assert.strictEqual(logs.length, 0)
    logger.debug("foo", "bar")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new Message(DEBUG, "foobar", ["foo", "bar"]))
  })

  test("#info()", (assert) => {
    assert.strictEqual(logs.length, 0)
    logger.info("foo", "bar")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new Message(INFO, "foobar", ["foo", "bar"]))
  })

  test("#warn()", (assert) => {
    assert.strictEqual(logs.length, 0)
    logger.warn("foo", "bar")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new Message(WARN, "foobar", ["foo", "bar"]))
  })

  test("#error()", (assert) => {
    assert.strictEqual(logs.length, 0)
    logger.error("foo", "bar")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new Message(ERROR, "foobar", ["foo", "bar"]))
  })

  test("#fatal()", (assert) => {
    assert.strictEqual(logs.length, 0)
    logger.fatal("foo", "bar")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new Message(FATAL, "foobar", ["foo", "bar"]))
  })

  test("#log()", (assert) => {
    assert.strictEqual(logs.length, 0)

    logger.log(DEBUG, "blah blah")
    assert.strictEqual(logs.length, 1)
    assert.equal(logs[0], new Message(DEBUG, "foobar", ["blah blah"]))

    logger.log(ERROR, "blah error")
    assert.strictEqual(logs.length, 2)
    assert.equal(logs[1], new Message(ERROR, "foobar", ["blah error"]))
  })

  test("#toString()", (assert) => {
    assert.strictEqual(createLogger("test").toString(), 'Logger { name: "test" }')
    assert.strictEqual(createLogger("test.foo").toString(), 'Logger { name: "test.foo" }')
  })

})

export default logSuite.concat(LevelSuite, MessageSuite, LoggerSuite);
