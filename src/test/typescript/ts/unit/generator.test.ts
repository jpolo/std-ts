import qunit = require("../../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import generator = require("../../../../main/typescript/ts/unit/generator")

var generatorSuite = suite("ts/unit/generator", (self) => {
  
  var params = {
    size: 5,
    random: random
  };
  var randomValue = 0;
  
  function random() {
     return randomValue;  
  }
  
  
  self.setUp = () => {
    randomValue = 0;
  }
  
  test(".constant()", (assert) => {  
    var genStr = generator.constant("foo")
    assert.strictEqual(genStr(params), "foo")
    assert.strictEqual(genStr(params), "foo")
    assert.strictEqual(genStr(params), "foo")
    
    var genNum = generator.constant(1)
    assert.strictEqual(genNum(params), 1)
    assert.strictEqual(genNum(params), 1)
    assert.strictEqual(genNum(params), 1)
    
  })
  
  test(".oneOf()", (assert) => {
    var data = ["foo", "bar", "baz"];
    var gen = generator.oneOf(data.map(generator.constant));    
    var part = 1 / data.length;

    assert.strictEqual(gen(params), "foo")
    randomValue += part;
    
    assert.strictEqual(gen(params), "bar")
    randomValue += part;
    
    assert.strictEqual(gen(params), "baz")
  })
  
  test(".array()", (assert) => {
    var gen = generator.array(generator.constant("foo"));
    
    var arr = gen(params);
    for (var i = 0, l = arr.length; i < l; i++) {
      assert.strictEqual(arr[i], "foo")
    }
  })

});
var exportSuite = generatorSuite;
export = exportSuite;