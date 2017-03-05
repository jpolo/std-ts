import { suite, test } from '../../../main/typescript/ts/unit/qunit';
import { UUID } from '../../../main/typescript/ts/uuid';

const uuidSuite = suite('ts/uuid', (self) => {

});

const UUIDSuite = suite('ts/uuid.UUID', (self) => {
  const ZERO = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  const DATA = [ 0xb3, 0x72, 0xe0, 0xa1, 0xb3, 0x91, 0x46, 0x10, 0x8e, 0x1a, 0xff, 0x7d, 0x51, 0xdb, 0x4e, 0x80 ];

  test('.generate()', (assert) => {

  });

  test('#constructor()', (assert) => {
    let id = new UUID();

    // zero
    assert.strictEqual(id.length, 16);
    for (let i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], ZERO[i]);
    }

    // with array
    id = new UUID(DATA);
    for (let i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], DATA[i]);
    }

  });

  test('#set()', (assert) => {
    const id = new UUID();

    // zero
    assert.strictEqual(id.length, 16);
    for (let i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], 0);
    }

    // with array
    id.set(DATA);
    for (let i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], DATA[i]);
    }

    // set again to zero
    id.set(ZERO);
    for (let i = 0, l = 16; i < l; i++) {
      assert.strictEqual(id[i], ZERO[i]);
    }

  });

  test('#toString()', (assert) => {
    let id = new UUID();
    assert.strictEqual(id.toString(), '00000000-0000-0000-0000-000000000000');

    id = new UUID(DATA);
    assert.strictEqual(id.toString(), 'b372e0a1-b391-4610-8e1a-ff7d51db4e80');
  });
});

export default uuidSuite.concat(UUIDSuite);
