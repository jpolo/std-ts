import { suite, test, Assert } from "../../../main/typescript/ts/unit/qunit";
import { getId, hasId, generate } from "../../../main/typescript/ts/id";

export default suite("ts/id", (self) => {

  test(".generate()", (assert) => {
    let current = generate();

    assert.strictEqual(generate(), current + 1);
    assert.strictEqual(generate(), current + 2);
    assert.strictEqual(generate(), current + 3);
  });

  test(".id()", (assert) => {
    // var hasWeakMap = !!WeakMap;

    // null, undefined, string, number
    assert.strictEqual(getId(undefined), NaN);
    assert.strictEqual(getId(null), NaN);
    assert.strictEqual(getId(NaN), NaN);
    assert.strictEqual(getId(123), NaN);
    assert.strictEqual(getId("abc"), NaN);

    // Date
    let odate = new Date();
    let iddate = getId(odate);
    assert.strictEqual(getId(odate), iddate);
    assert.ok(getId(odate) > 0);

    // Object
    let oplain = {};
    let idplain = getId(oplain);
    assert.strictEqual(getId(oplain), idplain);
    assert.strictEqual(getId(oplain), iddate + 1);

  });

});
