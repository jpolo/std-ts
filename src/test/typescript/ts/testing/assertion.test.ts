import { test } from './_boot.test';
import { IAssertionCallSite, Assertion } from '../../../../main/typescript/ts/testing/assertion';

export default test('ts/testing/assertion', (assert) => {

  const assertionType = 'SUCCESS';
  const message = 'my message';
  const position: IAssertionCallSite = {
    getThis() { return null; },
    getTypeName() { return ''; },
    getFunction() { return null; },
    getFunctionName() { return ''; },
    getMethodName() { return ''; },
    getFileName() { return ''; },
    getLineNumber() { return -1; },
    getColumnNumber() { return -1; },
    getEvalOrigin() { return null; },
    isTopLevel() { return false; },
    isEval() { return false; },
    isNative() { return false; },
    isConstructor() { return false; },
    getArguments() { return []; }, // {[key: number]: any; length: number}
    toString() { return ''; }
  };
  const a = new Assertion(assertionType, null, message, position, 'my stack');

  assert(a.name === assertionType, 'assertion.type failure');
  assert(a.test ===  null, 'assertion.test failure');
  assert(a.message === message, 'assertion.message failure');
  assert(a.position === position, 'assertion.position failure');

});
