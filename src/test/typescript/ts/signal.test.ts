import unit = require("../../../main/typescript/ts/unit")
import test = unit.test;
import signal = require("../../../main/typescript/ts/signal")


var signalSuite = unit.suite("ts/signal", (self) => {
  
  test("signal()", (assert) => {
    
    assert.strictEqual(signal.signal("data"), "data");
    assert.throws(() => { signal.signal(undefined) });
    assert.throws(() => { signal.signal(null) });
    assert.throws(() => { signal.signal("") });
    
  })
  
  test("connect()", (assert) => {
    
    
  })
  
  test("disconnect()", (assert) => {
    
    
  })
  
});

export = signalSuite;