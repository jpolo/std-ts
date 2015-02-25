import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import semver = require("../../../main/typescript/ts/semver")
import ISemVer = semver.ISemVer
import SemVer = semver.SemVer

var semverSuite = suite("ts/semver.SemVer", (self) => {

  test('.parse()', (assert) => {
    ['1.2.3.4',
     'NOT VALID',
     "1.2",
     null,
     'Infinity.NaN.Infinity'
    ].forEach(function(v) {
      assert.throws(function() {
        SemVer.parse(v);
      }, {name:'TypeError', message:'Invalid Version: ' + v});
    });
  });
  
  test("#toString()", (assert) => {
    //simple
    var s = new SemVer(1, 2, 3);
    assert.strictEqual(s.toString(), "1.2.3");
    
    //with prerelease
    var pre = new SemVer(1, 2, 3, [5, 6]);
    assert.strictEqual(pre.toString(), "1.2.3-5.6");
  })
  
})
  
export = semverSuite