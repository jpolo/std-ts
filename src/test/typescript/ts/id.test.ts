import { suite, test } from '../../../main/typescript/ts/unit/qunit';
import { getId, hasId, generate } from '../../../main/typescript/ts/id';

export default suite('ts/id', (self) => {

  test('.generate()', (assert) => {
    const current = generate();

    assert.strictEqual(generate(), current + 1);
    assert.strictEqual(generate(), current + 2);
    assert.strictEqual(generate(), current + 3);
  });

  test('.id()', (assert) => {
    // var hasWeakMap = !!WeakMap;

    // null, undefined, string, number
    assert.strictEqual(getId(undefined), NaN);
    assert.strictEqual(getId(null), NaN);
    assert.strictEqual(getId(NaN), NaN);
    assert.strictEqual(getId(123), NaN);
    assert.strictEqual(getId('abc'), NaN);

    // Date
    const odate = new Date();
    const iddate = getId(odate);
    assert.strictEqual(getId(odate), iddate);
    assert.ok(getId(odate) > 0);

    // Object
    const oplain = {};
    const idplain = getId(oplain);
    assert.strictEqual(getId(oplain), idplain);
    assert.strictEqual(getId(oplain), iddate + 1);

  });

  test('.hasId()', (assert) => {
    // var hasWeakMap = !!WeakMap;

    // null, undefined, string, number
    assert.strictEqual(hasId(undefined), false);
    assert.strictEqual(hasId(null), false);
    assert.strictEqual(hasId(NaN), false);
    assert.strictEqual(hasId(123), false);
    assert.strictEqual(hasId('abc'), false);

    // Date
    assert.strictEqual(hasId(new Date()), true);

    // Object
    assert.strictEqual(hasId({}), true);

  });

});
