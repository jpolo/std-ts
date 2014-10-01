import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import geometry = require("../../../main/typescript/ts/geometry")
import vector = geometry.vector
import matrix = geometry.matrix

var geometryVectorSuite = suite("ts/geometry.vector", (self) => {

  test('add(a, b)', (assert) => {
    //vector2
    assert.deepEqual(vector.add(vector.create(1, 2), vector.create(2, 2)), [3, 4])
      
    //vector3
    assert.deepEqual(vector.add(vector.create(1, 2, 3), vector.create(2, 2, 2)), [3, 4, 5])
      
    //vector4
    assert.deepEqual(vector.add(vector.create(1, 2, 3, 4), vector.create(2, 2, 2, 2)), [3, 4, 5, 6])
  })
    
  test('copy(from, to)', (assert) => {
    //vector2
    var vec2 = vector.create(0, 0)
    vector.copy(vector.create(1, 2), vec2)
    assert.deepEqual(vec2, [1, 2])
      
    //vector3
    var vec3 = vector.create(0, 0, 0)
    vector.copy(vector.create(1, 2, 3), vec3)
    assert.deepEqual(vec3, [1, 2, 3])
      
    //vector4
    var vec4 = vector.create(0, 0, 0, 0)
    vector.copy(vector.create(1, 2, 3, 4), vec4)
    assert.deepEqual(vec4, [1, 2, 3, 4])
  })
    
  test('divide(a, b)', (assert) => {
    //vector2
    assert.deepEqual(vector.divide(vector.create(1, 2), vector.create(2, 2)), [0.5, 1])
      
    //vector3
    assert.deepEqual(vector.divide(vector.create(1, 2, 3), vector.create(2, 2, 2)), [0.5, 1, 1.5])
      
    //vector4
    assert.deepEqual(vector.divide(vector.create(1, 2, 3, 4), vector.create(2, 2, 2, 2)), [0.5, 1, 1.5, 2])
  })
  
  test('dot(a, b)', (assert) => {
    //vector2
    assert.strictEqual(vector.dot(vector.create(1, 2), vector.create(0.5, 1)), 2.5)
      
    //vector3
    assert.strictEqual(vector.dot(vector.create(1, 2, 3), vector.create(0.5, 1, 1.5)), 7)
      
    //vector4
    assert.strictEqual(vector.dot(vector.create(1, 2, 3, 4), vector.create(0.5, 1, 1.5, 2)), 15)
  })
    
  test('lengthSquared(v)', (assert) => {
    //vector2
    assert.strictEqual(vector.lengthSquared(vector.create(1, 2)), 5)
      
    //vector3
    assert.strictEqual(vector.lengthSquared(vector.create(1, 2, 3)), 14)
      
    //vector4
    assert.strictEqual(vector.lengthSquared(vector.create(1, 2, 3, 4)), 30)
  })
    
  test('length(v)', (assert) => {
    //vector2
    assert.strictEqual(vector.length(vector.create(1, 2)), Math.sqrt(5))
      
    //vector3
    assert.strictEqual(vector.length(vector.create(1, 2, 3)), Math.sqrt(14))
      
    //vector4
    assert.strictEqual(vector.length(vector.create(1, 2, 3, 4)), Math.sqrt(30))
  })
    
  test('multiply(a, b)', (assert) => {
    //vector2
    assert.deepEqual(vector.multiply(vector.create(1, 2), vector.create(2, 2)), [2, 4])
      
    //vector3
    assert.deepEqual(vector.multiply(vector.create(1, 2, 3), vector.create(2, 2, 2)), [2, 4, 6])
      
    //vector4
    assert.deepEqual(vector.multiply(vector.create(1, 2, 3, 4), vector.create(2, 2, 2, 2)), [2, 4, 6, 8])
  })
    
  test('negate(a)', (assert) => {
    //vector2
    assert.deepEqual(vector.negate(vector.create(1, 2)), [-1, -2])
      
    //vector3
    assert.deepEqual(vector.negate(vector.create(1, 2, 3)), [-1, -2, -3])
      
    //vector4
    assert.deepEqual(vector.negate(vector.create(1, 2, 3, 4)), [-1, -2, -3, -4])
  })
    
  test('normalize(a)', (assert) => {
    //vector2
    assert.deepEqual(vector.normalize(vector.create(1, 2)), [0.4472135954999579, 0.8944271909999159])
      
    //vector3
    assert.deepEqual(vector.normalize(vector.create(1, 2, 3)), [0.2672612419124244, 0.5345224838248488, 0.8017837257372732])
      
    //vector4
    assert.deepEqual(vector.normalize(vector.create(1, 2, 3, 4)), [0.18257418583505536, 0.3651483716701107, 0.5477225575051661, 0.7302967433402214])
  })
    
  test('scale(a)', (assert) => {
    //vector2
    assert.deepEqual(vector.scale(vector.create(1, 2), 2), [2, 4])
      
    //vector3
    assert.deepEqual(vector.scale(vector.create(1, 2, 3), 2), [2, 4, 6])
      
    //vector4
    assert.deepEqual(vector.scale(vector.create(1, 2, 3, 4), 2), [2, 4, 6, 8])
  })
    
  test('subtract(a, b)', (assert) => {
    //vector2
    assert.deepEqual(vector.subtract(vector.create(1, 2), vector.create(2, 2)), [-1, 0])
      
    //vector3
    assert.deepEqual(vector.subtract(vector.create(1, 2, 3), vector.create(2, 2, 2)), [-1, 0, 1])
      
    //vector4
    assert.deepEqual(vector.subtract(vector.create(1, 2, 3, 4), vector.create(2, 2, 2, 2)), [-1, 0, 1, 2])
  })
    
})
  
var geometryMatrixSuite = suite("ts/geometry.matrix", () => {

  test('identity(a)', (assert) => {
    
    //mat2
    assert.deepEqual(
      matrix.identity(matrix.create(1, 2, 3, 4)), 
      [1, 0, 0, 1]
    )
      
    //mat3
    assert.deepEqual(
      matrix.identity(matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9)), 
      [1, 0, 0, 0, 1, 0, 0, 0, 1]
    )
      
    //mat4
    assert.deepEqual(
      matrix.identity(matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)), 
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    )
  })
    
  test('transpose(a)', (assert) => {
    
    //mat2
    var mat2 = matrix.create(1, 2, 3, 4)
    var expected2 = [1, 3, 2, 4]
    assert.deepEqual(matrix.transpose(mat2), expected2)
    assert.deepEqual(matrix.transpose(mat2, mat2), expected2)
      
    //mat3
    var mat3 = matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9)
    var expected3 = [1, 4, 7, 2, 5, 8, 3, 6, 9]
    assert.deepEqual(matrix.transpose(mat3), expected3)
    assert.deepEqual(matrix.transpose(mat3, mat3), expected3)
      
    //mat4
    var mat4 = matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
    var expected4 = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]
    assert.deepEqual(matrix.transpose(mat4), expected4)
    assert.deepEqual(matrix.transpose(mat4, mat4), expected4)
  })
  
})
  
var geometrySuite = geometryVectorSuite.concat(geometryMatrixSuite)
  
export = geometrySuite