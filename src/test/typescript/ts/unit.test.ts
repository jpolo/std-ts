import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import TestEngine = unit.engine.Engine
import Assert = unit.engine.Assert

var assertSuite = suite("ts/unit.Assert", (self) => {
  var engine = new TestEngine()
  var testCaseMock: unit.ITest
  var reportMock: unit.ITestReport
  var assertMock: Assert
  
  var bootstrapDone = false;
  function bootstrap() {
    if (!bootstrapDone) {
      bootstrapDone = true
      var assertions = []
      var testCaseMock = { category: "", name: "", run: () => {} }
      var reportMock = { assertions: assertions, startDate: new Date(), elapsedMilliseconds:0 }
      var assertMock = new Assert(engine, testCaseMock, reportMock)
      
      var i = iter()
      assertMock.ok(true)
      assertMock.ok(false)
      if (
        !unit.SUCCESS === assertions[i()].type ||
        !unit.FAILURE === assertions[i()].type
      ) {
        throw new Error('[Fatal] ts/unit.Assert seems broken')
      }
    }
  }

  function iter() {
    var i = 0
    return function () {
      return i++
    }
  }
  
  self.setUp = () => {
    //check that assert is working fine
    bootstrap()
      
    //init mock
    testCaseMock = { category: "", name: "", run: () => {} }
    reportMock = { assertions: [], startDate: new Date(), elapsedMilliseconds:0 }
    assertMock = new Assert(engine, testCaseMock, reportMock)
  }

  /*test("__position__()", (assert) => {
    var pos = assert.__position__();

    assert.ok(pos.lineNumber === 248);
    assert.ok(pos.columnNumber === 33);
  })*/

  test(".__engine__", (assert) => {
    var ng = assert.__engine__
    assert.ok(ng instanceof TestEngine)
  })
    
  test(".ok(cond: boolean)", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.ok(true)
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.ok(false)
    assert.ok(assertions[i()].type == unit.FAILURE)
  })

  test(".strictEqual(l: any, r: any)", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.strictEqual(null, null)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.strictEqual(undefined, null)
    assert.ok(assertions[i()].type == unit.FAILURE)

    assertMock.strictEqual(1, 1)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.strictEqual<any>("1", 1)
    assert.ok(assertions[i()].type == unit.FAILURE)
    
    assertMock.strictEqual(NaN, NaN)
    assert.ok(assertions[i()].type == unit.SUCCESS)
  })

  test(".equal(l: any, r: any)", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.equal(null, null)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.equal(undefined, null)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.equal(1, 1)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.equal<any>("1", 1)
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.equal(NaN, NaN)
    assert.ok(assertions[i()].type == unit.SUCCESS)
  })

  test(".throws(fn, expected)", (assert) => {
    var assertions = reportMock.assertions
    var i = iter()
    assertMock.throws(() => {})
    assert.ok(assertions[i()].type == unit.FAILURE)

    assertMock.throws(() => { throw new TypeError() })
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.throws(() => { throw new TypeError() }, TypeError)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.throws(() => { throw new TypeError() }, Error)
    assert.ok(assertions[i()].type == unit.SUCCESS)

    assertMock.throws(() => { throw new Error() }, TypeError)
    assert.ok(assertions[i()].type == unit.FAILURE)
    
    assertMock.throws(() => { throw new Error("blah") }, "Error: blah")
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.throws(() => { throw new TypeError("blah") }, "TypeError: blah")
    assert.ok(assertions[i()].type == unit.SUCCESS)
    
    assertMock.throws(() => { throw new Error("foo") }, "Error: blah")
    assert.ok(assertions[i()].type == unit.FAILURE)
  })

})

var unitSuite = suite("ts/unit.TestEngine", (self) => {
  var engine = new TestEngine()


  test("testEquals(l: any, r: any)", (assert) => {
    assert.ok(engine.testEquals(1, 1))
    assert.ok(engine.testEquals(false, 0))
    assert.ok(!engine.testEquals(0, 1))
    assert.ok(!engine.testEquals([0], [0]))
    assert.ok(engine.testEquals("1", 1))
  })

  test("testEqualStrict(l: any, r: any)", (assert) => {
    assert.ok(engine.testEqualsStrict(1, 1))
    assert.ok(engine.testEqualsStrict(NaN, NaN))
    assert.ok(!engine.testEqualsStrict(false, 0))
    assert.ok(!engine.testEqualsStrict(0, 1))
    assert.ok(!engine.testEqualsStrict([0], [0]))
    assert.ok(!engine.testEqualsStrict("1", 1))
  })

  test("testEqualNear(l: any, r: any, epsilon: number)", (assert) => {
    assert.ok(engine.testEqualsNear(1, 1))
    assert.ok(engine.testEqualsNear(1, 1.1, 0.11));
    assert.ok(!engine.testEqualsNear(1.1, 1))
    assert.ok(!engine.testEqualsNear(false, 0))
    assert.ok(!engine.testEqualsNear(0, 1))
    assert.ok(!engine.testEqualsNear("1", 1))
  })
    
  test("testEqualDeep(l: any, r: any)", (assert) => {
    assert.ok(engine.testEqualsDeep([1], [1]))
    assert.ok(engine.testEqualsDeep([NaN], [NaN]))
    assert.ok(!engine.testEqualsDeep([false], [0]))
    assert.ok(!engine.testEqualsDeep(["1"], [1]))
  })

  test("dump(v: any)", (assert) => {
    //primitives
    assert.ok(engine.dump(null) === 'null')
    assert.ok(engine.dump(undefined) === 'undefined')
    assert.ok(engine.dump(true) === 'true')
    assert.ok(engine.dump(false) === 'false')
    assert.ok(engine.dump(1) === '1')
    assert.ok(engine.dump("abc") === '"abc"')
    assert.ok(engine.dump('ab"c') === '"ab\\"c"')

    //array
    assert.ok(engine.dump(['abc', 1, true]) === '["abc", 1, true]')
    assert.ok(engine.dump([1, 2, 3, 4, 5, 6, 7, 8]) === '[1, 2, 3, 4, 5, 6, 7, ...]')

    //date
    assert.ok(engine.dump(new Date('1789-07-14T00:00:00.000Z')) === 'Date { 1789-07-14T00:00:00.000Z }')

    //regexp
    assert.ok(engine.dump(/abc(.*)/gi) === '/abc(.*)/gi')
    
  })
});
var exportSuite = assertSuite.concat(unitSuite)

export = exportSuite
