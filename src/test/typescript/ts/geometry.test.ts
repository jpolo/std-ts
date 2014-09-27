import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import geometry = require("../../../main/typescript/ts/geometry")
import vector = geometry.vector

var geometrySuite = suite("ts/geometry.vector", (self) => {

  test('add()', (assert) => {
    var vec1 = vector.create2(1, 2)
    var vec2 = vector.create2(2, 2)
    assert.deepEqual(vector.add(vec1, vec2), [3, 4])
  })
    
  test('subtract()', (assert) => {
    var vec1 = vector.create2(1, 2)
    var vec2 = vector.create2(2, 2)
    assert.deepEqual(vector.subtract(vec1, vec2), [-1, 0])
  })
    
  test('lengthSquared(v)', (assert) => {
    assert.strictEqual(vector.lengthSquared(vector.create2(1, 2)), 5)
  })
    
  test('length(v)', (assert) => {
    assert.strictEqual(vector.length(vector.create2(1, 2)), Math.sqrt(5))
  })
  
})
  
export = geometrySuite