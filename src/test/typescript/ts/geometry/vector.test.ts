import unit = require("../../../../main/typescript/ts/unit")
import test = unit.test
import vector = require("../../../../main/typescript/ts/geometry/vector")
import vector2 = require("../../../../main/typescript/ts/geometry/vector2")
import vector3 = require("../../../../main/typescript/ts/geometry/vector3")
import vector4 = require("../../../../main/typescript/ts/geometry/vector4")

interface VectorModule<T> {
  add(a: T, b: T, dest?: T): T
  copy(v: T, dest?: T): T
  create(...args: number[]): T
  divide(a: T, b: T, dest?: T): T
  dot(a: T, b: T): number
  lengthSquared(v: T): number
}

function generateSuite(n: string, vector: VectorModule<number[]>, arity: number) {

  function create(): number[] {
    return new Array(arity);
  }
  
  function copy(a: number[]) {
    var r = new Array(arity);
    for (var i = 0; i < arity; i++) {
      r[i] = a[i];  
    }
    return r;
  }
  
  function random(): number[] {
    var __rand = Math.random;
    var r = create();
    for (var i = 0; i < arity; i++) {
      r[i] = __rand();  
    }
    return <any>r;
  }
  
  function gen(f: () => void, count = 10) {
    for (var i = 0; i < count; i++) {
      f();
    }
  }
  
  return unit.suite(n, (self) => {
    
    test('.add(a, b)', (assert) => {
      gen(() => {
   
        var a = random();
        var b = random();
        var dest = create();
        var expected = create();
        for (var i = 0; i < arity; i++) {
          expected[i] = a[i] + b[i];
        }
      
        //alloc
        assert.deepEqual(vector.add(a, b), expected)
        
        //dest
        assert.deepEqual(vector.add(a, b, dest), expected)
        assert.deepEqual(dest, expected)
        
      })
    })
    
    test('.copy(from, to)', (assert) => {
      gen(() => {
        var v = random();
        var dest = create();
        var expected = copy(v);
        
        //alloc
        assert.deepEqual(vector.copy(v), expected)
        
        //dest
        assert.deepEqual(vector.copy(v, dest), expected)
        assert.deepEqual(dest, expected)
      })
      
    })
    
    
    test('.divide(a, b)', (assert) => {
      gen(() => { 
        var a = random();
        var b = random();
        var dest = create();
        var expected = create();
        for (var i = 0; i < arity; i++) {
          expected[i] = a[i] / b[i];
        }
      
        //alloc
        assert.deepEqual(vector.divide(a, b), expected)
        
        //dest
        assert.deepEqual(vector.divide(a, b, dest), expected)
        assert.deepEqual(dest, expected)
      })
    })
    
    test('.dot(a, b)', (assert) => {
      gen(() => {
        var a = random()
        var b = random()
        var expected = 0;
        for (var i = 0; i < arity; i++) {
          expected += a[i] * b[i];
        }
        assert.strictEqual(vector.dot(a, b), expected)
      })
    })
    
    test('.lengthSquared(v)', (assert) => {
      gen(() => {
        var v = random()
        var expected = 0;
        for (var i = 0; i < arity; i++) {
          expected += v[i] * v[i];
        }
        assert.strictEqual(vector.lengthSquared(v), expected)
      })
    })
    
  });
}

var vector2Suite = generateSuite("ts/geometry/vector2", vector2, 2);
var vector3Suite = generateSuite("ts/geometry/vector3", vector3, 3);
var vector4Suite = generateSuite("ts/geometry/vector4", vector4, 4);

var vectorSuite = unit.suite("ts/geometry/vector", (self) => {


  
    
  
    
  test('.length(v)', (assert) => {
    //vector2
    assert.strictEqual(vector.length(vector.create(1, 2)), Math.sqrt(5))
      
    //vector3
    assert.strictEqual(vector.length(vector.create(1, 2, 3)), Math.sqrt(14))
      
    //vector4
    assert.strictEqual(vector.length(vector.create(1, 2, 3, 4)), Math.sqrt(30))
  })
    
  test('.multiply(a, b)', (assert) => {
    //vector2
    assert.deepEqual(vector.multiply(vector.create(1, 2), vector.create(2, 2)), [2, 4])
      
    //vector3
    assert.deepEqual(vector.multiply(vector.create(1, 2, 3), vector.create(2, 2, 2)), [2, 4, 6])
      
    //vector4
    assert.deepEqual(vector.multiply(vector.create(1, 2, 3, 4), vector.create(2, 2, 2, 2)), [2, 4, 6, 8])
  })
    
  test('.negate(a)', (assert) => {
    //vector2
    assert.deepEqual(vector.negate(vector.create(1, 2)), [-1, -2])
      
    //vector3
    assert.deepEqual(vector.negate(vector.create(1, 2, 3)), [-1, -2, -3])
      
    //vector4
    assert.deepEqual(vector.negate(vector.create(1, 2, 3, 4)), [-1, -2, -3, -4])
  })
    
  test('.normalize(a)', (assert) => {
    //vector2
    assert.deepEqual(vector.normalize(vector.create(1, 2)), [0.4472135954999579, 0.8944271909999159])
      
    //vector3
    assert.deepEqual(vector.normalize(vector.create(1, 2, 3)), [0.2672612419124244, 0.5345224838248488, 0.8017837257372732])
      
    //vector4
    assert.deepEqual(vector.normalize(vector.create(1, 2, 3, 4)), [0.18257418583505536, 0.3651483716701107, 0.5477225575051661, 0.7302967433402214])
  })
    
  test('.scale(a)', (assert) => {
    //vector2
    assert.deepEqual(vector.scale(vector.create(1, 2), 2), [2, 4])
      
    //vector3
    assert.deepEqual(vector.scale(vector.create(1, 2, 3), 2), [2, 4, 6])
      
    //vector4
    assert.deepEqual(vector.scale(vector.create(1, 2, 3, 4), 2), [2, 4, 6, 8])
  })
    
  test('.subtract(a, b)', (assert) => {
    //vector2
    assert.deepEqual(vector.subtract(vector.create(1, 2), vector.create(2, 2)), [-1, 0])
      
    //vector3
    assert.deepEqual(vector.subtract(vector.create(1, 2, 3), vector.create(2, 2, 2)), [-1, 0, 1])
      
    //vector4
    assert.deepEqual(vector.subtract(vector.create(1, 2, 3, 4), vector.create(2, 2, 2, 2)), [-1, 0, 1, 2])
  })
    
})

var exportSuite = vector2Suite.concat(vector3Suite);
export = exportSuite;