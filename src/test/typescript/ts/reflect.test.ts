import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import reflect = require("../../../main/typescript/ts/reflect")

class Parent {
  parentMethod() {}
}

class Child extends Parent {
  constructor(public foo: string = '', public bar: string = '') { super() }
  childMethod() {}
}

var reflectSuite = suite("ts/reflect", () => {
  var parentObj = new Parent()
  var childObj = new Child()
  
  test("apply()", (assert) => {
    var obj = {}
    function fn() {
      return [this, arguments]
    }
    var returnValue = reflect.apply(fn, obj, [ 'foo', 'bar' ])
    assert.strictEqual(returnValue[0], obj)
    assert.strictEqual(returnValue[1][0], 'foo')    
    assert.strictEqual(returnValue[1][1], 'bar')  
  })
    
  test("construct()", (assert) => {
    var childObj = reflect.construct(Child, [ '$0', '$1' ])
    assert.strictEqual(childObj.foo, '$0')
    assert.strictEqual(childObj.bar, '$1')
  })
  
  test("defineProperty()", (assert) => {
    var obj = {
      "foo": true
    }
    reflect.defineProperty(obj, 'bar', { value: 'barval' })
    assert.strictEqual(obj['bar'], 'barval')  
  })
  
  test("deleteProperty()", (assert) => {
    var obj = {
      "foo": true
    }
    
    assert.ok(reflect.hasOwn(obj, 'foo'))  
    assert.ok(reflect.deleteProperty(obj, 'foo'))
    assert.ok(!reflect.hasOwn(obj, 'foo'))  
    assert.ok(reflect.deleteProperty(obj, '$nonExistent'))
  })
    
  test("freeze()/isFrozen()", (assert) => {
    var obj = {
      "foo": true
    }
    
    assert.ok(!reflect.isFrozen(obj))
    assert.ok(reflect.freeze(obj))
    assert.ok(reflect.isFrozen(obj))
  })
  
  test("getPrototypeOf()", (assert) => {
    assert.strictEqual(reflect.getPrototypeOf(childObj), Child.prototype)
    assert.strictEqual(reflect.getPrototypeOf(parentObj), Parent.prototype)
  })
  
  test("has()", (assert) => {
    assert.ok(reflect.has(childObj, 'childMethod'))
    assert.ok(reflect.has(childObj, 'parentMethod'))
    assert.ok(reflect.has(childObj, 'toString'))
    assert.ok(!reflect.has(childObj, '$nonExistent'))
  })
    
  test("hasOwn()", (assert) => {
    assert.ok(reflect.hasOwn(Child.prototype, 'childMethod'))
    assert.ok(!reflect.hasOwn(childObj, 'childMethod'))
    assert.ok(!reflect.hasOwn(childObj, 'parentMethod'))
    assert.ok(!reflect.hasOwn(childObj, 'toString'))
    assert.ok(!reflect.hasOwn(childObj, '$nonExistent'))
  })
    
  test("ownKeys()", (assert) => {
    var keys = reflect.ownKeys(Child.prototype)
    assert.deepEqual(keys.sort(), [ 'childMethod', 'constructor' ].sort())
  })
    
  test("preventExtensions()/isExtensible()", (assert) => {
    var obj = {
      "foo": true
    }
    
    assert.ok(reflect.isExtensible(obj))
    assert.ok(reflect.preventExtensions(obj))
    assert.ok(!reflect.isExtensible(obj))
  })
  
  test("seal()/isSealed()", (assert) => {
    var obj = {
      "foo": true
    }
    
    assert.ok(!reflect.isSealed(obj))
    assert.ok(reflect.seal(obj))
    assert.ok(reflect.isSealed(obj))
  })
})
  
export = reflectSuite