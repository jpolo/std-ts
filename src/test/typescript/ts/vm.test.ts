import { suite, test } from '../../../main/typescript/ts/unit/qunit';
import { global, run, compile } from '../../../main/typescript/ts/vm';

export default suite('ts/vm', (self) => {

  test('.global', (assert) => {
    assert.strictEqual(typeof global, 'object');
    assert.strictEqual(global['String'], String);
  });

  test('.compile()', (assert) => {
    // simple
    const fn = compile(`return "abc";`);
    assert.strictEqual(typeof fn, 'function');
    assert.strictEqual(fn(), 'abc');

    // with context
    const context: {[key: string]: any} = {a: 1, b: 2, c: null};
    const fnCtx = compile('c = a + b; this.d = c;return c;');
    const returnValue = fnCtx(context);
    assert.strictEqual(returnValue, 3);
    assert.strictEqual(context['c'], 3);
    assert.strictEqual(context['d'], 3);
  });

  test('.run()', (assert) => {

    // simple
    assert.strictEqual(run(`return "abc";`), 'abc');

    // with context
    const context: {[key: string]: any} = {a: 1, b: 2, c: null};
    assert.strictEqual(run('c = a + b; this.d = c;return c;', context), 3);
    assert.strictEqual(context['c'], 3);
    assert.strictEqual(context['d'], 3);
  });

});
