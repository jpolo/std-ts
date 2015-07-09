import { suite, test, Assert } from "../../../../main/typescript/ts/unit/qunit"
import quaternion = require("../../../../main/typescript/ts/geometry/quaternion")

export default suite("ts/geometry/quaternion", (self) => {
  
  var quatZ, quatA, quatB, quatID, quatTmp: [number, number, number, number]
  //var vec3: geometry.IVector3
  var deg90 = Math.PI / 2
  
  self.setUp = () => {
    quatZ = quaternion.create(0, 0, 0, 0)
    quatA = quaternion.create(1, 2, 3, 4)
    quatB = quaternion.create(5, 6, 7, 8)
    //out = [0, 0, 0, 0]
    //vec3 = vector.create(1, 1, -1)
    quatID = quaternion.create(0, 0, 0, 1)
    quatTmp = quaternion.create(0, 0, 0, 0)
  }
  
  test('.add(a, b)', (assert) => {
    assert.deepEqual(quaternion.add(quatA, quatB), [6, 8, 10, 12])
  })
  
  test('.conjugate(a)', (assert) => {
    assert.deepEqual(quaternion.conjugate(quatA), [-1, -2, -3, 4])
      
    var quatCopy = quaternion.copy(quatA)
    assert.deepEqual(quaternion.conjugate(quatCopy, quatCopy), [-1, -2, -3, 4])
  })
  
  test('.create()', (assert) => {
    assert.strictEqual(quatA.length, 4);
    assert.strictEqual(quatA[0], 1);
    assert.strictEqual(quatA[1], 2);
    assert.strictEqual(quatA[2], 3);
    assert.strictEqual(quatA[3], 4);
  })
  
  test('.copy(a)', (assert) => {
    var quat = quaternion.create(0, 0, 0, 0)
    quaternion.copy(quatA, quat)
    assert.deepEqual(quat, [1, 2, 3, 4])
  })
  
  test('.dot(a, b)', (assert) => {
    assert.strictEqual(quaternion.dot(quatA, quatB), 70)
  })
    
  test('.identity(a)', (assert) => {
    assert.deepEqual(quaternion.identity(), [0, 0, 0, 1])
  })
    
  test('.multiply(a, b)', (assert) => {
    var quatAmulB = [24, 48, 48, -6]
    assert.deepEqual(quaternion.multiply(quatA, quatB), quatAmulB)
    assert.deepEqual(quatA, [1, 2, 3, 4])//not modified
    assert.deepEqual(quatB, [5, 6, 7, 8])//not modified

    assert.deepEqual(quaternion.multiply(quatA, quatB, quatTmp), quatAmulB)
    assert.deepEqual(quatTmp, quatAmulB)
  })
    
  test('.normalize(a)', (assert) => {
    console.warn(quaternion.normalize(quatZ));
    
    assert.deepEqual(quaternion.normalize(quatZ), [NaN, NaN, NaN, NaN])
    assert.deepEqual(quaternion.normalize(quatB), [0.37904902178945165, 0.454858826147342, 0.5306686305052324, 0.6064784348631227])
    assert.deepEqual(quaternion.normalize(quatA), [0.18257418583505536, 0.3651483716701107, 0.5477225575051661, 0.7302967433402214])
  })
  
  test('.scale(a)', (assert) => {

    assert.deepEqual(quaternion.scale(quatA, 2), [2, 4, 6, 8])
      
  })
  
})
