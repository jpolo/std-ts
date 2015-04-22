import unit = require("../../../../main/typescript/ts/unit")
import test = unit.test
import geometry = require("../../../../main/typescript/ts/geometry")
import matrix = geometry.matrix

var matrixSuite = unit.suite("ts/geometry/matrix", (self) => {
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
  
  
  test('.identity(a)', (assert) => {
    
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
    
  test('.multiply(a, b)', (assert) => {
    
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
  
  test('.transpose(a)', (assert) => {
    
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

var exportSuite = matrixSuite;
export = exportSuite;