import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import uri = require("../../../main/typescript/ts/uri")
import URI = uri.URI

var uriSuite = suite("ts/uri", (self) => {
  var uriDefault = uri.parse('http://localhost:8080/titi/tata?q=blah#id') 
  
  
  test("parse()", (assert) => {
    var u = uriDefault
      
    assert.strictEqual(u.scheme, 'http')
    assert.strictEqual(u.userInfo, null)
    assert.strictEqual(u.domain, 'localhost')
    assert.strictEqual(u.port, 8080)
    assert.strictEqual(u.path, '/titi/tata')
    assert.strictEqual(u.query["q"], 'blah')
    assert.strictEqual(u.fragment, 'id')
  })
  
  test("URI#equals()", (assert) => {
    assert.ok(!uriDefault.equals(uri.parse('http://localhost:8080/titi/tata?q=bla#id')))
      
    //same equality
    assert.ok(uriDefault.equals(uri.parse('http://localhost:8080/titi/tata?q=blah#id')))
    
    //fragment is not compared
    assert.ok(uriDefault.equals(uri.parse('http://localhost:8080/titi/tata?q=blah#ids')))
  })
  
  
  test("URI#toJSON()", (assert) => {
    assert.strictEqual(uriDefault.toJSON(), 'http://localhost:8080/titi/tata?q=blah#id')
  })
  
  test("URI#toString()", (assert) => {
    assert.strictEqual(String(uriDefault), 'http://localhost:8080/titi/tata?q=blah#id')
  })
  
  
    
})
  
export = uriSuite;