import qunit = require("../../../main/typescript/ts/unit/qunit")
import suite = qunit.suite
import test = qunit.test
import semver = require("../../../main/typescript/ts/semver")
import ISemVer = semver.ISemVer
import SemVer = semver.SemVer

var semverSuite = suite("ts/semver.SemVer", (self) => {

  test('.parse()', (assert) => {
    ['1.2.3.4',
     'NOT VALID',
     "1.2",
     //null,
     'Infinity.NaN.Infinity'
    ].forEach(function(v) {
      assert.throws(function () {
        SemVer.parse(v);
      }, 'TypeError: Invalid Version: ' + v);
    });
  });
  
  test("#toString()", (assert) => {
    //simple
    var s = new SemVer(1, 2, 3);
    assert.strictEqual(s.toString(), "1.2.3");
    
    //with prerelease
    var pre = new SemVer(1, 2, 3, [5, 6]);
    assert.strictEqual(pre.toString(), "1.2.3-5.6");
    
    //with build
    var build = new SemVer(1, 2, 3, [5, 6], ["foo", "bar"]);
    assert.strictEqual(build.toString(), "1.2.3-5.6");
  })
  
})
  
var exportSuite = semverSuite
export = exportSuite