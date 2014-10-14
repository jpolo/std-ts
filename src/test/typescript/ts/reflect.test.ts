import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import reflect = require("../../../main/typescript/ts/reflect")

class Parent {
  parentMethod() {}
}

class Child extends Parent {
  childMethod() {}
}

var reflectSuite = suite("ts/reflect", () => {
  var childObj = new Child()
  
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
  
})
  
export = reflectSuite