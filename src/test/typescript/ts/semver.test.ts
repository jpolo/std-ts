import { suite, test } from "../../../main/typescript/ts/unit/qunit";
import { ISemVer, SemVer } from "../../../main/typescript/ts/semver";

export default suite("ts/semver.SemVer", (self) => {

  test(".parse()", (assert) => {
    ["1.2.3.4",
     "NOT VALID",
     "1.2",
     // null,
     "Infinity.NaN.Infinity"
    ].forEach(function(v) {
      assert.throws(function () {
        SemVer.parse(v);
      }, "TypeError: Invalid Version: " + v);
    });
  });

  test("#toString()", (assert) => {
    // simple
    let s = new SemVer(1, 2, 3);
    assert.strictEqual(s.toString(), "1.2.3");

    // with prerelease
    let pre = new SemVer(1, 2, 3, [5, 6]);
    assert.strictEqual(pre.toString(), "1.2.3-5.6");

    // with build
    let build = new SemVer(1, 2, 3, [5, 6], ["foo", "bar"]);
    assert.strictEqual(build.toString(), "1.2.3-5.6");
  });

})
