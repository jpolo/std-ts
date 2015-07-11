import { suite, test } from "../../../main/typescript/ts/unit/qunit"
import { signal, has, connect, disconnect, count, emit } from "../../../main/typescript/ts/signal"

export default suite("ts/signal", (self) => {
  
  var receiver = {};
  var SIG = signal<string>("data");
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
    
    assert.strictEqual(signal("data"), "data");
    assert.throws(() => { signal(undefined) });
    assert.throws(() => { signal(null) });
    assert.throws(() => { signal("") });
    
  })
  
  test(".has()", (assert) => {
    assert.strictEqual(has(receiver, SIG), false);
    connect(receiver, SIG, function () {});
    assert.strictEqual(has(receiver, SIG), true);
  })
  
  test(".count()", (assert) => {
    assert.strictEqual(count(receiver, SIG), 0);
    connect(receiver, SIG, function () {});
    assert.strictEqual(count(receiver, SIG), 1);
    connect(receiver, SIG, function () {});
    assert.strictEqual(count(receiver, SIG), 2);
  })
  
  test(".connect()", (assert) => {
    assert.strictEqual(count(receiver, SIG), 0);
    connect(receiver, SIG, listener1);
    assert.strictEqual(count(receiver, SIG), 1);
    connect(receiver, SIG, listener1);
    assert.strictEqual(count(receiver, SIG), 2);
  })
  
  test(".disconnect()", (assert) => {
    assert.strictEqual(count(receiver, SIG), 0);
    connect(receiver, SIG, listener1);
    assert.strictEqual(count(receiver, SIG), 1);
    disconnect(receiver, SIG, listener1);
    assert.strictEqual(count(receiver, SIG), 0);
  })
  
  test(".emit()", (assert) => {
    connect(receiver, SIG, listener1);
    assert.deepEqual(stream, ["l1:foo"])
    
    stream = []
    connect(receiver, SIG, listener2);
    emit(receiver, SIG, "bar");
    assert.deepEqual(stream, ["l1:bar", "l2:bar"])
    
    stream = []
    connect(receiver, SIG, listener3);
    emit(receiver, SIG, "baz");
    assert.deepEqual(stream, ["l1:baz", "l2:baz", "l3:baz"])
    
    
    //disconnecting
    stream = []
    disconnect(receiver, SIG, listener2);
    emit(receiver, SIG, "foo");
    assert.deepEqual(stream, ["l1:foo", "l3:foo"])
    
    stream = []
    disconnect(receiver, SIG, listener1);
    emit(receiver, SIG, "foo");
    assert.deepEqual(stream, ["l3:foo"])
    /*
    stream = []
    disconnect(receiver, SIG, listener3);
    emit(receiver, SIG, "foo");
    assert.deepEqual(stream, [])*/
    
  })
  
})