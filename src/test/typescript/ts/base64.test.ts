import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import base64 = require("../../../main/typescript/ts/base64")

var base64Suite = suite("ts/base64", (self) => {
  
  // [decoded, encoded]
  var data = [
    ['any carnal pleasure.', 'YW55IGNhcm5hbCBwbGVhc3VyZS4='],
    ['any carnal pleasure', 'YW55IGNhcm5hbCBwbGVhc3VyZQ=='],
    ['any carnal pleasur', 'YW55IGNhcm5hbCBwbGVhc3Vy'],
    ['any carnal pleasu', 'YW55IGNhcm5hbCBwbGVhc3U='],
    ['any carnal pleas', 'YW55IGNhcm5hbCBwbGVhcw=='],
    ['pleasure.', 'cGxlYXN1cmUu'],
    ['leasure.', 'bGVhc3VyZS4='],
    ['easure.', 'ZWFzdXJlLg=='],
    ['asure.', 'YXN1cmUu'],
    ['sure.', 'c3VyZS4='],
    ['dankogai', "ZGFua29nYWk="],
    ['小飼弾', "5bCP6aO85by+"],
    ['小飼弾', "5bCP6aO85by-"]
  ]
 
  test("encode()", (assert) => {
    for (var i = 0, l = data.length; i < l; ++i) {
      var decoded = data[i][0]
      var encoded = data[i][1]
      var actual = base64.encode(decoded)
      
      assert.strictEqual(
        actual,
        encoded,
        'encode('  + assert.__dump__(decoded) + ')' +
        ' should return ' + assert.__dump__(encoded) +
        ' but had ' + assert.__dump__(actual)
      )
    }
  })
  
  test("decode()", (assert) => {
    for (var i = 0, l = data.length; i < l; ++i) {
      var decoded = data[i][0]
      var encoded = data[i][1]
      var actual = base64.decode(encoded)
      
      assert.strictEqual(
        actual,
        decoded,
        'decode(' + assert.__dump__(encoded) + ')' +
        ' should return ' + assert.__dump__(decoded) + 
        ' but had ' + assert.__dump__(actual)
      )
    }
  })
  
})

export = base64Suite

