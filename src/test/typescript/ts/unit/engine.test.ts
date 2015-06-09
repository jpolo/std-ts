import boot = require("./_boot.test")
import engine = require("../../../../main/typescript/ts/unit/engine")
import Engine = engine.Engine

var engineSuite = boot.test("ts/unit/engine", (assert) => {
  var path = "ts/unit/engine.Engine";
  var engine = new Engine()
  
  //#testEquals()
  var message = path + "#testEquals() failure";
  assert(engine.testEquals(1, 1), message)
  assert(engine.testEquals(false, 0), message)
  assert(!engine.testEquals(0, 1), message)
  assert(!engine.testEquals([0], [0]), message)
  assert(engine.testEquals("1", 1), message)


  //#testEqualsStrict()
  message = path + "#testEqualsStrict() failure";
  assert(engine.testEqualsStrict(1, 1), message)
  assert(engine.testEqualsStrict(NaN, NaN), message)
  assert(!engine.testEqualsStrict(false, 0), message)
  assert(!engine.testEqualsStrict(0, 1), message)
  assert(!engine.testEqualsStrict([0], [0]), message)
  assert(!engine.testEqualsStrict("1", 1), message)

  /*
  //#testEqualNear()
  message = path + "#testEqualsNear() failure";
  assert(engine.testEqualsNear(1, 1), message)
  assert(engine.testEqualsNear(1, 1.1, 0.11), message);
  assert(!engine.testEqualsNear(1.1, 1), message)
  assert(!engine.testEqualsNear(false, 0), message)
  assert(!engine.testEqualsNear(0, 1), message)
  assert(!engine.testEqualsNear("1", 1), message)
  */
    
  //#testEqualDeep()
  message = path + "#testEqualDeep() failure";
  assert(engine.testEqualsDeep([0, 1], [0, 1]), message)
  assert(engine.testEqualsDeep([0, ["a", "b"]], [0, ["a", "b"]]), message)
  assert(engine.testEqualsDeep([NaN, NaN], [NaN, NaN]))
  assert(engine.testEqualsDeep({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }), message)
  assert(!engine.testEqualsDeep({ foo: 1, bar: 2 }, { foo: 1 }), message)
  assert(!engine.testEqualsDeep([false], [0]), message)
  assert(!engine.testEqualsDeep(["1"], [1]), message)

  //#dump()
  message = path + "#testEqualDeep() failure";
  //primitives
  assert(engine.dump(null) === 'null', message)
  assert(engine.dump(undefined) === 'undefined', message)
  assert(engine.dump(true) === 'true', message)
  assert(engine.dump(false) === 'false', message)
  assert(engine.dump(1) === '1', message)
  assert(engine.dump("abc") === '"abc"', message)
  assert(engine.dump('ab"c') === '"ab\\"c"', message)

  //array
  assert(engine.dump(['abc', 1, true]) === '["abc", 1, true]', message)
  assert(engine.dump([1, 2, 3, 4, 5, 6, 7, 8]) === '[1, 2, 3, 4, 5, 6, 7, ...]', message)

  //date
  assert(engine.dump(new Date('1789-07-14T00:00:00.000Z')) === 'Date { 1789-07-14T00:00:00.000Z }', message)

  //regexp
  assert(engine.dump(/abc(.*)/gi) === '/abc(.*)/gi', message)
  
});
var exportSuite = engineSuite;
export = exportSuite;