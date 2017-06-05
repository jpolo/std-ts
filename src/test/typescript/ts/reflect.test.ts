import { suite, test } from '../../../main/typescript/ts/testing/qunit';
import * as reflect from '../../../main/typescript/ts/reflect';

class Parent {
  parentMethod() {}
}

class Child extends Parent {
  constructor(public foo = '', public bar = '') { super(); }
  childMethod() {}
}

export default suite('ts/reflect', () => {
  const parentObj = new Parent();
  const childObj = new Child();

  test('.apply()', (assert) => {
    const obj = {};
    function fn() {
      return [this, arguments];
    }
    const returnValue = reflect.apply(fn, obj, [ 'foo', 'bar' ]);
    assert.strictEqual(returnValue[0], obj);
    assert.strictEqual(returnValue[1][0], 'foo');
    assert.strictEqual(returnValue[1][1], 'bar');
  });

  test('.construct()', (assert) => {
    const childObj = reflect.construct(Child, [ '$0', '$1' ]);
    assert.strictEqual(childObj.foo, '$0');
    assert.strictEqual(childObj.bar, '$1');
  });

  test('.defineProperty()', (assert) => {
    const obj = {
      'foo': true
    };
    reflect.defineProperty(obj, 'bar', { value: 'barval' });
    assert.strictEqual(obj['bar'], 'barval');
  });

  test('.deleteProperty()', (assert) => {
    const obj = {
      'foo': true,
      '$notConfigurable': 2
    };

    Object.defineProperty(obj, '$notConfigurable', { value: 2, configurable: false });

    assert.ok(reflect.hasOwn(obj, 'foo'));
    assert.ok(reflect.deleteProperty(obj, 'foo'));
    assert.ok(!reflect.hasOwn(obj, 'foo'));
    assert.ok(reflect.deleteProperty(obj, '$nonExistent'));
    assert.ok(!reflect.deleteProperty(obj, '$notConfigurable'));
  });

  test('.freeze()/.isFrozen()', (assert) => {
    const obj = {
      'foo': true
    };

    assert.ok(!reflect.isFrozen(obj));
    assert.strictEqual(reflect.freeze(obj), obj);
    assert.ok(reflect.isFrozen(obj));
  });

  test('.get()', (assert) => {
    const obj = {};
    obj['_accessorProp'] = 'private';
    obj['valueProp'] = 'value';
    Object.defineProperty(obj, 'accessorProp', {
      get: function() { return obj['_accessorProp']; },
      set: function() {}
    });

    assert.strictEqual(reflect.get(obj, 'valueProp'), 'value');
    assert.strictEqual(reflect.get(obj, 'accessorProp'), 'private');
  });

  test('.getPrototypeOf()', (assert) => {
    assert.strictEqual(reflect.getPrototypeOf(childObj), Child.prototype);
    assert.strictEqual(reflect.getPrototypeOf(parentObj), Parent.prototype);
  });

  test('.has()', (assert) => {
    assert.ok(reflect.has(childObj, 'childMethod'));
    assert.ok(reflect.has(childObj, 'parentMethod'));
    assert.ok(reflect.has(childObj, 'toString'));
    assert.ok(!reflect.has(childObj, '$nonExistent'));
  });

  test('.hasOwn()', (assert) => {
    assert.ok(reflect.hasOwn(Child.prototype, 'childMethod'));
    assert.ok(!reflect.hasOwn(childObj, 'childMethod'));
    assert.ok(!reflect.hasOwn(childObj, 'parentMethod'));
    assert.ok(!reflect.hasOwn(childObj, 'toString'));
    assert.ok(!reflect.hasOwn(childObj, '$nonExistent'));
  });

  test('.ownKeys()', (assert) => {
    const keys = reflect.ownKeys(Child.prototype);
    assert.deepEqual(keys.sort(), [ 'childMethod', 'constructor' ].sort());
  });

  test('.preventExtensions()/.isExtensible()', (assert) => {
    const obj = {
      'foo': true
    };

    assert.ok(reflect.isExtensible(obj));
    assert.ok(reflect.preventExtensions(obj));
    assert.ok(!reflect.isExtensible(obj));
  });

  /*
  test(".seal()/.isSealed()", (assert) => {
    let obj = {
      "foo": true
    }

    assert.ok(!reflect.isSealed(obj))
    assert.ok(reflect.seal(obj))
    assert.ok(reflect.isSealed(obj))
  })*/

  test('.set()', (assert) => {
    const obj = {};
    obj['_accessorProp'] = '';
    obj['valueProp'] = '';
    Object.defineProperty(obj, 'accessorProp', {
      get: function() { return obj['_accessorProp']; },
      set: function(val) { obj['_accessorProp'] = val; }
    });

    Object.defineProperty(obj, 'readonlyProp', {
      value: 'defaultValue',
      writable: false
    });

    // value
    assert.strictEqual(reflect.set(obj, 'valueProp', 'value'), true);
    assert.strictEqual(obj['valueProp'], 'value');

    // non writable
    assert.strictEqual(reflect.set(obj, 'readonlyProp', 'newValue'), false);
    assert.strictEqual(obj['readonlyProp'], 'defaultValue');

    // accessor
    assert.strictEqual(reflect.set(obj, 'accessorProp', 'private'), true);
    assert.strictEqual(obj['_accessorProp'], 'private');
  });

  test('.stringTag(o)', (assert) => {
    const stringTag = reflect.stringTag;
    assert.strictEqual(stringTag(undefined), 'Undefined');
    assert.strictEqual(stringTag(null), 'Null');
    assert.strictEqual(stringTag(true), 'Boolean');
    assert.strictEqual(stringTag(new Boolean(true)), 'Boolean');
    assert.strictEqual(stringTag('fsdfs'), 'String');
    assert.strictEqual(stringTag(new String('fsdfs')), 'String');
    assert.strictEqual(stringTag(123), 'Number');
    assert.strictEqual(stringTag(NaN), 'Number');
    assert.strictEqual(stringTag(new Number(123.1)), 'Number');
    assert.strictEqual(stringTag([]), 'Array');
  });
});
