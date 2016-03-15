import { suite, test } from "../../../../main/typescript/ts/unit/qunit";
import { array, constant, oneOf } from "../../../../main/typescript/ts/unit/generator";

class ParamsMock {
  size = 10;

  randomValue = 0;

  random() {
     return this.randomValue;
  }
}

export default suite("ts/unit/generator", (self) => {

  let params = new ParamsMock();

  self.setUp = () => {
    params.randomValue = 0;
  }

  test(".constant()", (assert) => {
    let genStr = constant("foo");
    assert.strictEqual(genStr.next(params).value, "foo");
    assert.strictEqual(genStr.next(params).value, "foo");
    assert.strictEqual(genStr.next(params).value, "foo");

    let genNum = constant(1);
    assert.strictEqual(genNum.next(params).value, 1);
    assert.strictEqual(genNum.next(params).value, 1);
    assert.strictEqual(genNum.next(params).value, 1);

  });

  test(".oneOf()", (assert) => {
    const data = ["foo", "bar", "baz"];

    // strict
    params.randomValue = 0;
    let gen = oneOf(data.map(constant));
    let part = 1 / data.length;

    assert.strictEqual(gen.next(params).value, "foo");
    params.randomValue += part;

    assert.strictEqual(gen.next(params).value, "bar");
    params.randomValue += part;

    assert.strictEqual(gen.next(params).value, "baz");

    // cast as constant generator
    params.randomValue = 0;
    gen = oneOf(data);

    assert.strictEqual(gen.next(params).value, "foo");
    params.randomValue += part;

    assert.strictEqual(gen.next(params).value, "bar");
    params.randomValue += part;

    assert.strictEqual(gen.next(params).value, "baz");
  });

  test(".array()", (assert) => {
    let length = 5;
    let genSize = constant(length);
    let gen = array(constant("foo"), genSize);
    params.randomValue = 1;

    let arr = gen(params);
    assert.strictEqual(arr.length, length);
    for (let gen of arr) {
      assert.strictEqual(gen, "foo");
    }
  });

  test(".tuple()", (assert) => {
    // let gens: [ IGenerator<string>, IGenerator<number> ] = [constant("foo"), constant(1)];
    // let gen = generator.tuple(gens);

    // let [ s, n ] = gen(params);

  });

});
