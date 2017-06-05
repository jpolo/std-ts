import { suite, test } from '../../../main/typescript/ts/testing/qunit';
import * as stacktrace from '../../../main/typescript/ts/stacktrace';

export default suite('ts/stacktrace', (self) => {
  const FILENAME = 'stacktrace.test.js';

  let errorEval: Error;
  let callstackEval: stacktrace.ICallSite[];

  let errorLocal: Error;
  let callstackLocal: stacktrace.ICallSite[];

  let errorNative: Error;

  function createStacktrace(): { error: Error, callstack: stacktrace.ICallSite[] } {
    const data = { error: null, callstack: null };
    // put in eval block so we can test line number
    (new Function(
      'stacktrace', 'exports',
      // pseudo script
      'exports.error = new Error();\n' +
      'exports.callstack = stacktrace.create();\n'
    ))(stacktrace, data);
    return data;
  }

  self.setUp = () => {
    errorLocal = new Error();
    callstackLocal = stacktrace.create();

    try {
      Number.prototype.toFixed.call({});
    } catch (e) {
      errorNative = e;
    }

    // put in eval block so we can test line number
    const d = createStacktrace();
    errorEval = d.error;
    callstackEval = d.callstack;
  };

  test('.get()', (assert) => {

    // Normal
    let callstack = stacktrace.get(errorLocal);
    let callsite = callstack[0];
    assert.strictEqual(callsite.getFileName().slice(-FILENAME.length), FILENAME);
    assert.strictEqual(typeof callsite.getLineNumber(), 'number');
    assert.strictEqual(typeof callsite.getColumnNumber(), 'number');
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), false);

    // Native
    callstack = stacktrace.get(errorNative);
    callsite = callstack[0];

    assert.ok(Array.isArray(callstack));
    assert.ok(callstack.length > 0);
    assert.strictEqual(callsite.getFileName(), 'native');
    assert.strictEqual(callsite.getLineNumber(), null);
    assert.strictEqual(callsite.getColumnNumber(), null);
    assert.strictEqual(callsite.isNative(), true);
    assert.strictEqual(callsite.isEval(), false);

    // Eval
    callstack = stacktrace.get(errorEval);
    callsite = callstack[0];
    assert.ok(Array.isArray(callstack));
    assert.ok(callstack.length > 0);
    assert.strictEqual(callsite.getLineNumber(), 1);
    assert.strictEqual(callsite.getColumnNumber(), 17);
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), true);
  });

  test('.create()', (assert) => {

    // Normal
    let callstack = callstackLocal;
    let callsite = callstack[0];
    assert.strictEqual(callsite.getFileName().slice(-FILENAME.length), FILENAME);
    assert.strictEqual(typeof callsite.getLineNumber(), 'number');
    assert.strictEqual(typeof callsite.getColumnNumber(), 'number');
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), false);

    // Eval
    callstack = callstackEval;
    callsite = callstack[0];
    assert.ok(Array.isArray(callstack));
    assert.ok(callstack.length > 0);
    assert.strictEqual(callsite.getLineNumber(), 2);
    assert.strictEqual(callsite.getColumnNumber(), 32);
    assert.strictEqual(callsite.isNative(), false);
    assert.strictEqual(callsite.isEval(), true);
  });

});
