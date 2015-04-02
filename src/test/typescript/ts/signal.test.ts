import unit = require("../../../main/typescript/ts/unit")
import test = unit.test;
import signal = require("../../../main/typescript/ts/signal")


var signalSuite = unit.suite("ts/signal", (self) => {
  
  var receiver = {};
  var SIG = signal.signal<string>("data");
  var stream: string[] = [];
    
  function listener1(s: string) {
    stream.push("l1:" + s);
  }
  
  function listener2(s: string) {
    stream.push("l2:" + s);
  }
  
  function listener3(s: string) {
    stream.push("l3:" + s);
  }
  
  self.setUp = () => {
    receiver = {};
    stream = [];
  }
  
  
  test(".signal()", (assert) => {
    
    assert.strictEqual(signal.signal("data"), "data");
    assert.throws(() => { signal.signal(undefined) });
    assert.throws(() => { signal.signal(null) });
    assert.throws(() => { signal.signal("") });
    
  })
  
  test(".has()", (assert) => {
    assert.strictEqual(signal.has(receiver, SIG), false);
    signal.connect(receiver, SIG, function () {});
    assert.strictEqual(signal.has(receiver, SIG), true);
  })
  
  test(".count()", (assert) => {
    assert.strictEqual(signal.count(receiver, SIG), 0);
    signal.connect(receiver, SIG, function () {});
    assert.strictEqual(signal.count(receiver, SIG), 1);
    signal.connect(receiver, SIG, function () {});
    assert.strictEqual(signal.count(receiver, SIG), 2);
  })
  
  test(".connect()", (assert) => {
    assert.strictEqual(signal.count(receiver, SIG), 0);
    signal.connect(receiver, SIG, listener1);
    assert.strictEqual(signal.count(receiver, SIG), 1);
    signal.connect(receiver, SIG, listener1);
    assert.strictEqual(signal.count(receiver, SIG), 2);
  })
  
  test(".disconnect()", (assert) => {
    assert.strictEqual(signal.count(receiver, SIG), 0);
    signal.connect(receiver, SIG, listener1);
    assert.strictEqual(signal.count(receiver, SIG), 1);
    signal.disconnect(receiver, SIG, listener1);
    assert.strictEqual(signal.count(receiver, SIG), 0);
  })
  
  test(".emit()", (assert) => {
    signal.connect(receiver, SIG, listener1);
    assert.deepEqual(stream, ["l1:foo"])
    
    stream = []
    signal.connect(receiver, SIG, listener2);
    signal.emit(receiver, SIG, "bar");
    assert.deepEqual(stream, ["l1:bar", "l2:bar"])
    
    stream = []
    signal.connect(receiver, SIG, listener3);
    signal.emit(receiver, SIG, "baz");
    assert.deepEqual(stream, ["l1:baz", "l2:baz", "l3:baz"])
    
    
    //disconnecting
    stream = []
    signal.disconnect(receiver, SIG, listener2);
    signal.emit(receiver, SIG, "foo");
    assert.deepEqual(stream, ["l1:foo", "l3:foo"])
    
    stream = []
    signal.disconnect(receiver, SIG, listener1);
    signal.emit(receiver, SIG, "foo");
    assert.deepEqual(stream, ["l3:foo"])
    /*
    stream = []
    signal.disconnect(receiver, SIG, listener3);
    signal.emit(receiver, SIG, "foo");
    assert.deepEqual(stream, [])*/
    
  })
  
});

export = signalSuite;