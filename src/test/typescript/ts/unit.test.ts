import unit = require("../../../main/typescript/ts/unit");
import suite = unit.suite;
import test = unit.test;
import TestEngine = unit.engine.Engine
import Assert = unit.engine.Assert
import AssertionType = unit.AssertionType;

var assertSuite = suite("ts/unit.Assert", (self) => {
  var engine = new TestEngine();
  var testCaseMock: unit.ITest;
  var reportMock: unit.ITestReport;
  var assertMock: Assert;

  self.setUp = () => {
    testCaseMock = { category: "", name: "", run: () => {} };
    reportMock = { assertions: [], startDate: new Date(), elapsedMilliseconds:0 };
    assertMock = new Assert(engine, testCaseMock, reportMock);
  }

  test("__position__()", (assert) => {
    var pos = assert.__position__();

    assert.strictEqual(pos.lineNumber, 248);
    assert.strictEqual(pos.columnNumber, 33);
  })

  test("__engine__", (assert) => {
    var ng = assert.__engine__;
    assert.ok(ng instanceof TestEngine);
  })

  test("strictEqual(l: any, r: any)", (assert) => {
    var assertions = reportMock.assertions;
    var i = 0;
    assertMock.strictEqual(null, null);
    assert.ok(assertions[i++].type === AssertionType.Success);

    assertMock.strictEqual(undefined, null);
    assert.ok(assertions[i++].type === AssertionType.Failure);

    assertMock.strictEqual(1, 1);
    assert.ok(assertions[i++].type === AssertionType.Success);

    assertMock.strictEqual("1", 1);
    assert.ok(assertions[i++].type === AssertionType.Failure);
  })

  test("equal(l: any, r: any)", (assert) => {
    var assertions = reportMock.assertions;
    var a = new unit.engine.Assert(engine, testCaseMock, reportMock);
    var i = 0;
    a.equal(null, null);
    assert.ok(assertions[i++].type === AssertionType.Success);

    a.equal(undefined, null);
    assert.ok(assertions[i++].type === AssertionType.Success);

    a.equal(1, 1);
    assert.ok(assertions[i++].type === AssertionType.Success);

    a.equal("1", 1);
    assert.ok(assertions[i++].type === AssertionType.Success);
  })

  test("throws(fn, expected)", (assert) => {
    var assertions = reportMock.assertions;
    var i = 0;
    assertMock.throws(() => {});
    assert.ok(assertions[i++].type === AssertionType.Failure);

    assertMock.throws(() => { throw new TypeError() });
    assert.ok(assertions[i++].type === AssertionType.Success);

    assertMock.throws(() => { throw new TypeError() }, TypeError);
    assert.ok(assertions[i++].type === AssertionType.Success);

    assertMock.throws(() => { throw new TypeError() }, Error);
    assert.ok(assertions[i++].type === AssertionType.Success);

    assertMock.throws(() => { throw new Error() }, TypeError);
    assert.ok(assertions[i++].type === AssertionType.Failure);
  })

})

var unitSuite = suite("ts/unit.TestEngine", (self) => {
  var engine = new TestEngine();


  test("testEquals(l: any, r: any)", (assert) => {
    assert.ok(engine.testEquals(1, 1))
    assert.ok(engine.testEquals(false, 0))
    assert.ok(!engine.testEquals(0, 1))
    assert.ok(!engine.testEquals([0], [0]))
    assert.ok(engine.testEquals("1", 1))
  })

  test("testEqualStrict(l: any, r: any)", (assert) => {
    assert.ok(engine.testEqualsStrict(1, 1))
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

  test("dump(v: any)", (assert) => {
    //primitives
    assert.ok(engine.dump(null) === 'null');
    assert.ok(engine.dump(undefined) === 'undefined');
    assert.ok(engine.dump(true) === 'true');
    assert.ok(engine.dump(false) === 'false');
    assert.ok(engine.dump(1) === '1');
    assert.ok(engine.dump("abc") === '"abc"');
    assert.ok(engine.dump('ab"c') === '"ab\\"c"');

    //array
    assert.ok(engine.dump(['abc', 1, true]) === '["abc", 1, true]');
    assert.ok(engine.dump([1, 2, 3, 4, 5, 6, 7, 8]) === '[1, 2, 3, 4, 5, 6, 7, ...]');

    //date
    assert.ok(engine.dump(new Date('1789-07-14T00:00:00.000Z')) === 'Date(1789-07-14T00:00:00.000Z)');

    //regexp
    assert.ok(engine.dump(/abc(.*)/gi) === '/abc(.*)/gi');
  })
});
var exportSuite = assertSuite.concat(unitSuite);

export = exportSuite
