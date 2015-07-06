import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit"
import id = require("../../../main/typescript/ts/id")

var idSuite = suite("ts/id", (self) => {
  
  test(".generate()", (assert) => {
    var current = id.generate();
    
    assert.strictEqual(id.generate(), current + 1);
    assert.strictEqual(id.generate(), current + 2);
    assert.strictEqual(id.generate(), current + 3);
  })
  
  test(".id()", (assert) => {
    //var hasWeakMap = !!WeakMap;
    
    //null, undefined, string, number
    assert.strictEqual(id.id(undefined), NaN);
    assert.strictEqual(id.id(null), NaN);
    assert.strictEqual(id.id(NaN), NaN);
    assert.strictEqual(id.id(123), NaN);
    assert.strictEqual(id.id("abc"), NaN);
    
    //Date
    var odate = new Date();
    var iddate = id.id(odate);
    assert.strictEqual(id.id(odate), iddate);
    assert.ok(id.id(odate) > 0);
    
    //Object
    var oplain = {};
    var idplain = id.id(oplain);
    assert.strictEqual(id.id(oplain), idplain);
    assert.strictEqual(id.id(oplain), iddate + 1);
    
  })

})

var exportSuite = idSuite;
export = exportSuite;