import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import geometry = require("../../../main/typescript/ts/geometry")
import quaternion = geometry.quaternion
import vector = geometry.vector
import matrix = geometry.matrix

var geometryQuatSuite = suite("ts/geometry.quaternion", (self) => {
  
  var quatZ, quatA, quatB, quatID, quatTmp: geometry.IQuaternion
  var vec3: geometry.IVector3
  var deg90 = Math.PI / 2
  
  self.setUp = () => {
    quatZ = quaternion.create(0, 0, 0, 0)
    quatA = quaternion.create(1, 2, 3, 4)
    quatB = quaternion.create(5, 6, 7, 8)
    //out = [0, 0, 0, 0]
    vec3 = vector.create(1, 1, -1)
    quatID = quaternion.create(0, 0, 0, 1)
    quatTmp = quaternion.create(0, 0, 0, 0)
  }
  
  test('add(a, b)', (assert) => {
    assert.deepEqual(quaternion.add(quatA, quatB), [6, 8, 10, 12])
  })
  
  test('conjugate(a)', (assert) => {
    assert.deepEqual(quaternion.conjugate(quatA), [-1, -2, -3, 4])
      
    var quatCopy = quaternion.copy(quatA)
    assert.deepEqual(quaternion.conjugate(quatCopy, quatCopy), [-1, -2, -3, 4])
  })
  
  test('copy(a)', (assert) => {
    var quat = quaternion.create(0, 0, 0, 0)
    quaternion.copy(quatA, quat)
    assert.deepEqual(quat, [1, 2, 3, 4])
  })
  
  test('dot(a, b)', (assert) => {
    assert.strictEqual(quaternion.dot(quatA, quatB), 70)
  })
    
  test('identity(a)', (assert) => {
    assert.deepEqual(quaternion.identity(), [0, 0, 0, 1])
  })
    
  test('multiply(a, b)', (assert) => {
    var quatAmulB = [24, 48, 48, -6]
    assert.deepEqual(quaternion.multiply(quatA, quatB), quatAmulB)
    assert.deepEqual(quatA, [1, 2, 3, 4])//not modified
    assert.deepEqual(quatB, [5, 6, 7, 8])//not modified

    assert.deepEqual(quaternion.multiply(quatA, quatB, quatTmp), quatAmulB)
    assert.deepEqual(quatTmp, quatAmulB)
  })
    
  test('normalize(a)', (assert) => {
    assert.deepEqual(quaternion.normalize(quatZ), [NaN, NaN, NaN, NaN])
    assert.deepEqual(quaternion.normalize(quatB), [0.37904902178945165, 0.454858826147342, 0.5306686305052324, 0.6064784348631227])
    assert.deepEqual(quaternion.normalize(quatA), [0.18257418583505536, 0.3651483716701107, 0.5477225575051661, 0.7302967433402214])
  })
  
  test('scale(a)', (assert) => {

    assert.deepEqual(quaternion.scale(quatA, 2), [2, 4, 6, 8])
      
  })
  
})

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
  
var geometryMatrixSuite = suite("ts/geometry.matrix", (self) => {
  var mat2A, mat2B: geometry.IMatrix2
  var mat3A, mat3B: geometry.IMatrix3
  var mat4A, mat4B: geometry.IMatrix4
  
  self.setUp = () => {
    mat2A = matrix.create(
      1, 2, 
      3, 4
    )
    mat2B = matrix.create(
      5, 6, 
      7, 8
    )
    mat3A = matrix.create( 
      1, 0, 0,
      0, 1, 0,
      1, 2, 1
    )
    mat3B = matrix.create(
      1, 0, 0,
      0, 1, 0,
      3, 4, 1
    )
    mat4A = matrix.create(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      1, 2, 3, 1
    )
    mat4B = matrix.create(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      4, 5, 6, 1
    )
  }
  
  
  test('identity(a)', (assert) => {
    
    //mat2
    assert.deepEqual(
      matrix.identity(matrix.copy(mat2A)), 
      [1, 0, 0, 1]
    )
      
    //mat3
    assert.deepEqual(
      matrix.identity(matrix.copy(mat3A)), 
      [1, 0, 0, 0, 1, 0, 0, 0, 1]
    )
      
    //mat4
    assert.deepEqual(
      matrix.identity(matrix.copy(mat4A)), 
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    )
  })
    
  test('multiply(a, b)', (assert) => {
    
    //mat2
    assert.deepEqual(
      matrix.multiply(mat2A, mat2B), 
      [ 23, 34, 
        31, 46 ]
    )
      
    //mat3
    assert.deepEqual(
      matrix.multiply(mat3A, mat3B), 
      [ 1, 0, 0,
        0, 1, 0,
        4, 6, 1 ]
    )
      
    //mat4
    assert.deepEqual(
      matrix.multiply(mat4A, mat4B), 
      [ 1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        5, 7, 9, 1 ]
    )
  })
  
  test('transpose(a)', (assert) => {
    
    //mat2
    var mat2 = matrix.create(1, 2, 3, 4)
    var expected2 = [1, 3, 2, 4]
    assert.deepEqual(matrix.transpose(mat2), expected2)
    assert.deepEqual(mat2, [1, 2, 3, 4])
    assert.deepEqual(matrix.transpose(mat2, mat2), expected2)
      
    //mat3
    var mat3 = matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9)
    var expected3 = [1, 4, 7, 2, 5, 8, 3, 6, 9]
    assert.deepEqual(matrix.transpose(mat3), expected3)
    assert.deepEqual(mat3, [1, 2, 3, 4, 5, 6, 7, 8, 9])
    assert.deepEqual(matrix.transpose(mat3, mat3), expected3)
      
    //mat4
    var mat4 = matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
    var expected4 = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]
    assert.deepEqual(matrix.transpose(mat4), expected4)
    assert.deepEqual(mat4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    assert.deepEqual(matrix.transpose(mat4, mat4), expected4)
  })
  
})
  
var geometrySuite = geometryQuatSuite.concat(geometryVectorSuite, geometryMatrixSuite)
  
export = geometrySuite