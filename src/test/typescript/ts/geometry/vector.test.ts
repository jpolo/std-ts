import { suite, test, Assert } from "../../../../main/typescript/ts/unit/qunit";
import * as vector2 from "../../../../main/typescript/ts/geometry/vector2";
import * as vector3 from "../../../../main/typescript/ts/geometry/vector3";
import * as vector4 from "../../../../main/typescript/ts/geometry/vector4";

interface VectorModule<T> {
  add(a: T, b: T, dest?: T): T;
  copy(v: T, dest?: T): T;
  create(...args: number[]): T;
  divide(a: T, b: T, dest?: T): T;
  dot(a: T, b: T): number;
  lengthSquared(v: T): number;
  length(v: T): number;
  multiply(a: T, b: T, dest?: T): T;
  negate(v: T, dest?: T): T;
  normalize(v: T, dest?: T): T;
  scale(v: T, n: number, dest?: T): T;
  subtract(a: T, b: T, dest?: T): T;
}

function generateSuite(n: string, vector: VectorModule<number[]>, arity: number) {

  function create(): number[] {
    return new Array(arity);
  }

  function copy(a: number[]) {
    let r = new Array(arity);
    for (let i = 0; i < arity; i++) {
      r[i] = a[i];
    }
    return r;
  }

  function random(): number[] {
    let __rand = Math.random;
    let r = create();
    for (let i = 0; i < arity; i++) {
      r[i] = __rand() * 200 - 100;
    }
    return <any>r;
  }

  function gen(f: () => void, count = 10) {
    for (let i = 0; i < count; i++) {
      f();
    }
  }

  return suite(n, (self) => {

    test(".add(a, b)", (assert) => {
      gen(() => {

        let a = random();
        let b = random();
        let dest = create();
        let expected = create();
        for (let i = 0; i < arity; i++) {
          expected[i] = a[i] + b[i];
        }

        // alloc
        assert.deepEqual(vector.add(a, b), expected);

        // dest
        assert.deepEqual(vector.add(a, b, dest), expected);
        assert.deepEqual(dest, expected);

      });
    });

    test(".copy(from, to)", (assert) => {
      gen(() => {
        let v = random();
        let dest = create();
        let expected = copy(v);

        // alloc
        assert.deepEqual(vector.copy(v), expected);

        // dest
        assert.deepEqual(vector.copy(v, dest), expected);
        assert.deepEqual(dest, expected);
      });
    });


    test(".divide(a, b)", (assert) => {
      gen(() => {
        let a = random();
        let b = random();
        let dest = create();
        let expected = create();
        for (let i = 0; i < arity; i++) {
          expected[i] = a[i] / b[i];
        }

        // alloc
        assert.deepEqual(vector.divide(a, b), expected);

        // dest
        assert.deepEqual(vector.divide(a, b, dest), expected);
        assert.deepEqual(dest, expected);
      });
    });

    test(".dot(a, b)", (assert) => {
      gen(() => {
        let a = random();
        let b = random();
        let expected = 0;
        for (let i = 0; i < arity; i++) {
          expected += a[i] * b[i];
        }
        assert.strictEqual(vector.dot(a, b), expected);
      });
    });

    test(".lengthSquared(v)", (assert) => {
      gen(() => {
        let v = random();
        let expected = 0;
        for (let i = 0; i < arity; i++) {
          expected += v[i] * v[i];
        }
        assert.strictEqual(vector.lengthSquared(v), expected);
      });
    });

    test(".length(v)", (assert) => {
      gen(() => {
        let v = random();
        let expected = 0;
        for (let i = 0; i < arity; i++) {
          expected += v[i] * v[i];
        }
        expected = Math.sqrt(expected);
        assert.strictEqual(vector.length(v), expected);
      });
    });

    test(".multiply(a, b)", (assert) => {
      gen(() => {

        let a = random();
        let b = random();
        let dest = create();
        let expected = create();
        for (let i = 0; i < arity; i++) {
          expected[i] = a[i] * b[i];
        }

        // alloc
        assert.deepEqual(vector.multiply(a, b), expected);

        // dest
        assert.deepEqual(vector.multiply(a, b, dest), expected);
        assert.deepEqual(dest, expected);
      });
    });

    test(".negate(a)", (assert) => {
      gen(() => {

        let v = random();
        let dest = create();
        let expected = create();
        for (let i = 0; i < arity; i++) {
          expected[i] = -v[i];
        }

        // alloc
        assert.deepEqual(vector.negate(v), expected);

        // dest
        assert.deepEqual(vector.negate(v, dest), expected);
        assert.deepEqual(dest, expected);

      });
    });

    test(".normalize(a)", (assert) => {
      gen(() => {

        let v = random();
        let dest = create();
        let length = 0;
        for (let i = 0; i < arity; i++) {
          length += v[i] * v[i];
        }
        length = Math.sqrt(length);

        let factor = 1 / length;
        let expected = create();
        for (let i = 0; i < arity; i++) {
          expected[i] = v[i] * factor;
        }

        // alloc
        assert.deepEqual(vector.normalize(v), expected);

        // dest
        assert.deepEqual(vector.normalize(v, dest), expected);
        assert.deepEqual(dest, expected);

      });
    });

    test(".scale(a)", (assert) => {
      gen(() => {
        let v = random();
        let factor = Math.random();
        let dest = create();
        let expected = create();
        for (let i = 0; i < arity; i++) {
          expected[i] = v[i] * factor;
        }

        // alloc
        assert.deepEqual(vector.scale(v, factor), expected);

        // dest
        assert.deepEqual(vector.scale(v, factor, dest), expected);
        assert.deepEqual(dest, expected);
      });
    });

    test(".subtract(a, b)", (assert) => {
      gen(() => {
        let a = random();
        let b = random();
        let dest = create();
        let expected = create();
        for (let i = 0; i < arity; i++) {
          expected[i] = a[i] - b[i];
        }

        // alloc
        assert.deepEqual(vector.subtract(a, b), expected);

        // dest
        assert.deepEqual(vector.subtract(a, b, dest), expected);
        assert.deepEqual(dest, expected);
      });
    });

  });
}

let vector2Suite = generateSuite("ts/geometry/vector2", vector2, 2);
let vector3Suite = generateSuite("ts/geometry/vector3", vector3, 3);
let vector4Suite = generateSuite("ts/geometry/vector4", vector4, 4);


export default vector2Suite.concat(vector3Suite, vector4Suite);
