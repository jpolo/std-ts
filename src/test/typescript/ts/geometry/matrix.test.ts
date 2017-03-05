import { suite, test } from '../../../../main/typescript/ts/unit/qunit';
import * as matrix2 from '../../../../main/typescript/ts/geometry/matrix2';
import * as matrix3 from '../../../../main/typescript/ts/geometry/matrix3';
import * as matrix4 from '../../../../main/typescript/ts/geometry/matrix4';

interface MatrixModule<T> {
  identity(dest?: T): T;
}

function generateSuite(n: string, matrix: MatrixModule<number[]>, arity: number) {
  const dimension = Math.sqrt(arity);

  function create(): number[] {
    return new Array(arity);
  }

  function copy(a: number[]) {
    const r = new Array(arity);
    for (let i = 0; i < arity; i++) {
      r[i] = a[i];
    }
    return r;
  }

  function random(): number[] {
    const __rand = Math.random;
    const r = create();
    for (let i = 0; i < arity; i++) {
      r[i] = __rand() * 200 - 100;
    }
    return r as any;
  }

  function getCol(i: number) {
    return i % dimension;
  }

  function getRow(i: number) {
    return Math.floor(i / dimension);
  }

  function gen(f: () => void, count = 10) {
    for (let i = 0; i < count; i++) {
      f();
    }
  }

  return suite(n, (self) => {

    test('.identity()', (assert) => {
      gen(() => {
        const dest = create();
        const expected = create();
        for (let i = 0; i < arity; i++) {
          if (getCol(i) === getRow(i)) {
            expected[i] = 1;
          } else {
            expected[i] = 0;
          }
        }

        // alloc
        assert.deepEqual(matrix.identity(), expected);

        // dest
        assert.deepEqual(matrix.identity(dest), expected);
        assert.deepEqual(dest, expected);

      });
    });
  });
}

const matrix2Suite = generateSuite('ts/geometry/matrix2', matrix2, 2 * 2);
const matrix3Suite = generateSuite('ts/geometry/matrix3', matrix3, 3 * 3);
const matrix4Suite = generateSuite('ts/geometry/matrix4', matrix4, 4 * 4);

/*
var matrixSuite = unit.suite("ts/geometry/matrix", (self) => {
  var mat2A, mat2B: geometry.IMatrix2
  var mat3A, mat3B: geometry.IMatrix3
  var mat4A, mat4B: geometry.IMatrix4

  self.setUp = () => {
    mat2A = matrix.create(
      1, 2,
      3, 4
    )
    mat2B = matrix.create(
      5, 6,
      7, 8
    )
    mat3A = matrix.create(
      1, 0, 0,
      0, 1, 0,
      1, 2, 1
    )
    mat3B = matrix.create(
      1, 0, 0,
      0, 1, 0,
      3, 4, 1
    )
    mat4A = matrix.create(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      1, 2, 3, 1
    )
    mat4B = matrix.create(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      4, 5, 6, 1
    )
  }

  test('.identity(a)', (assert) => {

    //mat2
    assert.deepEqual(
      matrix.identity(matrix.copy(mat2A)),
      [1, 0, 0, 1]
    )

    //mat3
    assert.deepEqual(
      matrix.identity(matrix.copy(mat3A)),
      [1, 0, 0, 0, 1, 0, 0, 0, 1]
    )

    //mat4
    assert.deepEqual(
      matrix.identity(matrix.copy(mat4A)),
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    )
  })

  test('.multiply(a, b)', (assert) => {

    //mat2
    assert.deepEqual(
      matrix.multiply(mat2A, mat2B),
      [ 23, 34,
        31, 46 ]
    )

    //mat3
    assert.deepEqual(
      matrix.multiply(mat3A, mat3B),
      [ 1, 0, 0,
        0, 1, 0,
        4, 6, 1 ]
    )

    //mat4
    assert.deepEqual(
      matrix.multiply(mat4A, mat4B),
      [ 1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        5, 7, 9, 1 ]
    )
  })

  test('.transpose(a)', (assert) => {

    //mat2
    var mat2 = matrix.create(1, 2, 3, 4)
    var expected2 = [1, 3, 2, 4]
    assert.deepEqual(matrix.transpose(mat2), expected2)
    assert.deepEqual(mat2, [1, 2, 3, 4])
    assert.deepEqual(matrix.transpose(mat2, mat2), expected2)

    //mat3
    var mat3 = matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9)
    var expected3 = [1, 4, 7, 2, 5, 8, 3, 6, 9]
    assert.deepEqual(matrix.transpose(mat3), expected3)
    assert.deepEqual(mat3, [1, 2, 3, 4, 5, 6, 7, 8, 9])
    assert.deepEqual(matrix.transpose(mat3, mat3), expected3)

    //mat4
    var mat4 = matrix.create(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
    var expected4 = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]
    assert.deepEqual(matrix.transpose(mat4), expected4)
    assert.deepEqual(mat4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    assert.deepEqual(matrix.transpose(mat4, mat4), expected4)
  })

})
*/

export default matrix2Suite.concat(matrix3Suite, matrix4Suite);
