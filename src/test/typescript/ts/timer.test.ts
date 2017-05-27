import { suite, test } from '../../../main/typescript/ts/unit/qunit'
import {
  setTimeout, clearTimeout,
  setInterval, clearInterval,
  setImmediate, clearImmediate
} from '../../../main/typescript/ts/timer'

export default suite('ts/timer', (self) => {

  function createSpy () {
    const o = {
      called: false,
      counter: 0,
      call: function () {
        o.called = true
        o.counter++
      }
    }
    return o
  }

  test('.setTimeout()', (assert, done) => {
    const spy = createSpy()
    const timeout = 5
    const timerId = setTimeout(spy.call, timeout)
    let pending = 3

    // arity
    assert.strictEqual(setTimeout.length, 2)

    function notify () {
      pending--
      if (pending === 0) {
        done()
      }
    }

    // timer id
    assert.strictEqual(typeof timerId, 'number')

    // assert called
    setTimeout(() => {
      assert.ok(!spy.called)
      notify()
    }, timeout - 1)
    setTimeout(() => {
      assert.ok(spy.called)
      assert.strictEqual(spy.counter, 1)
      notify()
    }, timeout + 1)

    // assert arguments
    setTimeout((a) => {
      assert.strictEqual(a, 'foo')
      notify()
    }, timeout + 2, 'foo')
  })

  test('.clearTimeout()', (assert, done) => {
    const spy = createSpy()
    const timeout = 5
    const timerId = setTimeout(spy.call, timeout)
    setTimeout(() => {
      clearTimeout(timerId)
    }, timeout - 1)
    setTimeout(() => {
      assert.ok(!spy.called)
      assert.strictEqual(spy.counter, 0)
      done()
    }, timeout + 1)
  })

  test('.setInterval()', (assert, done) => {
    const spy = createSpy()
    const intervalMs = 50
    const iterationMax = 4
    const timerId = setInterval(() => {
      spy.call() // increment
      if (spy.counter === iterationMax) {
        // finish
        clearInterval(timerId)

        // assertions
        assert.ok(spy.called)
        assert.strictEqual(spy.counter, iterationMax)
        done()
      }
    }, intervalMs)

    setTimeout(() => { if (!spy.called) { done() } }, ((iterationMax + 1) * intervalMs))

    assert.strictEqual(typeof timerId, 'number')
  })

  test('.clearInterval()', (assert, done) => {
    const spy = createSpy()
    const timeout = 5
    const timerId = setInterval(spy.call, timeout)
    setTimeout(() => {
      assert.strictEqual(spy.counter, 1)
    }, timeout + 1)
    setTimeout(() => {
      clearInterval(timerId)
    }, timeout + 1)
    setTimeout(() => {
      assert.strictEqual(spy.counter, 1)
      done()
    }, (2 * timeout) + 1)

    assert.strictEqual(typeof timerId, 'number')
  })

  test('.setImmediate()', (assert, done) => {
    const spy = createSpy()
    const timerId = setImmediate(spy.call)

    setTimeout(() => {
      assert.ok(spy.called)
      assert.strictEqual(spy.counter, 1)
      done()
    }, 1)

    assert.strictEqual(typeof timerId, 'number')
  })

  test('.clearImmediate()', (assert, done) => {
    const spy = createSpy()
    const timerId = setImmediate(spy.call)
    clearImmediate(timerId)
    setTimeout(() => {
      assert.ok(!spy.called)
      done()
    }, 1)
  })

})
