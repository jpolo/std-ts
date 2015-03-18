import unit = require("../../../main/typescript/ts/unit");
import suite = unit.suite;
import test = unit.test;
import timer = require("../../../main/typescript/ts/timer");

var timerSuite = suite("ts/timer", (self) => {

  function createSpy() {
    var o = {
      called: false,
      counter: 0,
      call: function () {
        o.called = true;
        o.counter++;
      }
    };
    return o;
  }
  
  
  test(".setTimeout(f: () => void, ms: number): number", (assert, done) => {
    var spy = createSpy();
    var timeout = 5;
    var timerId = timer.setTimeout(spy.call, timeout);
    
    setTimeout(() => { 
      assert.ok(!spy.called); 
    }, timeout - 1);
    setTimeout(() => { 
      assert.ok(spy.called);
      assert.strictEqual(spy.counter, 1); 
      done(); 
    }, timeout + 1);
    assert.strictEqual(typeof timerId, 'number');
  })
  
  test(".clearTimeout(id: number): void", (assert, done) => {
    var spy = createSpy();
    var timeout = 5;
    var timerId = timer.setTimeout(spy.call, timeout);
    setTimeout(() => { 
      timer.clearTimeout(timerId); 
    }, timeout - 1);
    setTimeout(() => { 
      assert.ok(!spy.called);
      assert.strictEqual(spy.counter, 0);
      done(); 
    }, timeout + 1);
  })
    
  test(".setInterval(f: () => void, ms: number): number", (assert, done) => {
    var spy = createSpy();
    var intervalMs = 50;
    var iterationMax = 4;
    var timerId = timer.setInterval(() => {
      spy.call();//increment
      if (spy.counter === iterationMax) {
        //finish
        timer.clearInterval(timerId); 
        
        //assertions
        assert.ok(spy.called);
        assert.strictEqual(spy.counter, iterationMax); 
        done(); 
      }
    }, intervalMs);
    

    setTimeout(() => { if (!spy.called) { done(); } }, ((iterationMax + 1) * intervalMs));
      
    assert.strictEqual(typeof timerId, 'number');
  })
  
  test(".clearInterval(id: number): void", (assert, done) => {
    var spy = createSpy();
    var timeout = 5;
    var timerId = timer.setInterval(spy.call, timeout);
    setTimeout(() => { 
      assert.strictEqual(spy.counter, 1); 
    }, timeout + 1);
    setTimeout(() => { 
      timer.clearInterval(timerId);  
    }, timeout + 1);
    setTimeout(() => { 
      assert.strictEqual(spy.counter, 1); 
      done(); 
    }, (2 * timeout) + 1);
      
    assert.strictEqual(typeof timerId, 'number');
  })
    
  test(".setImmediate(f: () => void): number", (assert, done) => {
    var spy = createSpy();
    var timerId = timer.setImmediate(spy.call);
    setTimeout(() => { 
      assert.ok(spy.called);
      assert.strictEqual(spy.counter, 1);
      done(); 
    }, 1);
      
    assert.strictEqual(typeof timerId, 'number')
  })
  
  test(".clearImmediate(id: number): void", (assert, done) => {
    var spy = createSpy();
    var timerId = timer.setImmediate(spy.call);
    timer.clearImmediate(timerId);
    setTimeout(() => { 
      assert.ok(!spy.called); 
      done();
    }, 1);
  })
  
})
  
export = timerSuite