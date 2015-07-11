import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import { 
  setTimeout, clearTimeout, 
  setInterval, clearInterval,
  setImmediate, clearImmediate
} from "../../../main/typescript/ts/timer"

export default suite("ts/timer", (self) => {

  function createSpy() {
    let o = {
      called: false,
      counter: 0,
      call: function () {
        o.called = true;
        o.counter++;
      }
    };
    return o;
  }
  
  
  test(".setTimeout()", (assert, done) => {
    let spy = createSpy();
    let timeout = 5;
    let timerId = setTimeout(spy.call, timeout);
    
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
  
  test(".clearTimeout()", (assert, done) => {
    let spy = createSpy();
    let timeout = 5;
    let timerId = setTimeout(spy.call, timeout);
    setTimeout(() => { 
      clearTimeout(timerId); 
    }, timeout - 1);
    setTimeout(() => { 
      assert.ok(!spy.called);
      assert.strictEqual(spy.counter, 0);
      done(); 
    }, timeout + 1);
  })
    
  test(".setInterval()", (assert, done) => {
    let spy = createSpy();
    let intervalMs = 50;
    let iterationMax = 4;
    let timerId = setInterval(() => {
      spy.call();//increment
      if (spy.counter === iterationMax) {
        //finish
        clearInterval(timerId); 
        
        //assertions
        assert.ok(spy.called);
        assert.strictEqual(spy.counter, iterationMax); 
        done(); 
      }
    }, intervalMs);
    

    setTimeout(() => { if (!spy.called) { done(); } }, ((iterationMax + 1) * intervalMs));
      
    assert.strictEqual(typeof timerId, 'number');
  })
  
  test(".clearInterval()", (assert, done) => {
    let spy = createSpy();
    let timeout = 5;
    let timerId = setInterval(spy.call, timeout);
    setTimeout(() => { 
      assert.strictEqual(spy.counter, 1); 
    }, timeout + 1);
    setTimeout(() => { 
      clearInterval(timerId);  
    }, timeout + 1);
    setTimeout(() => { 
      assert.strictEqual(spy.counter, 1); 
      done(); 
    }, (2 * timeout) + 1);
      
    assert.strictEqual(typeof timerId, 'number');
  })
    
  test(".setImmediate()", (assert, done) => {
    let spy = createSpy();
    let timerId = setImmediate(spy.call);
    setTimeout(() => { 
      assert.ok(spy.called);
      assert.strictEqual(spy.counter, 1);
      done(); 
    }, 1);
      
    assert.strictEqual(typeof timerId, 'number')
  })
  
  test(".clearImmediate()", (assert, done) => {
    let spy = createSpy();
    let timerId = setImmediate(spy.call);
    clearImmediate(timerId);
    setTimeout(() => { 
      assert.ok(!spy.called); 
      done();
    }, 1);
  })
  
})