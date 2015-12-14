import { suite, test, Assert, testc } from "../../../main/typescript/ts/unit/qunit";
import * as random from "../../../main/typescript/ts/random";

class AssertCustom extends Assert {

  generates<T>(f: () => T, expected: T[]) {
    let isSuccess = true;
    let message = "";
    expected.forEach((expected, index) => {
      let actual = f();
      if (!this.__engine__().equalsStrict(expected, actual)) {
        isSuccess = false;
        message += this.__dump__(actual) + " must be " + this.__dump__(expected) + "\n";
      }
    });
    this.__assert__(isSuccess, message, this.__position__());
  }
}

export default suite("ts/random.RandomGenerator('rc4')", (self) => {
  let test = testc(AssertCustom); // overload


  self.setUp = () => {
    // engineTest.seed("");
  };

  self.tearDown = () => {

  };

  test(".generate()", (assert) => {
    let rc4 = new random.RandomGenerator("rc4", "Example");
    assert.generates(
      rc4.generate.bind(rc4),
      [
        0.23486116157656023,
        0.7972798995050903,
        0.7032748228077568,
        0.6028563936814503,
        0.34828409722783166,
        0.0693748445625555
      ]
    );
  });

  /*test("engine.Pseudo", (assert) => {
    let engine = new random.engine.Pseudo("");

    assert.generates(
      engine.generate.bind(engine),
      [
        1,
        0.9235974954684081,
        0.9041418537984751,
        0.7623494746874472,
        0.31325315816067667,
        0.01927975276576525
      ]
    );
  });*/

  /*test("exponential()", (assert) => {
    let lambda = 1;
    let gen = random.exponential(lambda, engineSeed);

    [
      0.000005748605117677314,
      1.0646574798444046,
      0.3635763307126245,
      1.000987016183774,
      5.492164550826788,
      1.1377528210865933
    ]
    .forEach((expected, index) => {
      let actual = gen();
      assert.equal(actual, expected, "exponential#" + index + " => " + expected + " but had " + actual);
    })
  })*/

  /*
  test("nextBoolean()", (assert) => {
    assert.generates(
      () => { return random.nextBoolean(engineTest); },
      [
        true,
        true,
        false,
        false,
        true,
        false
      ]
    );
  });
  */

  /*
  test("nextChar()", (assert) => {
    assert.generates(
      () => { return random.nextChar(undefined, engineTest); },
      [
        "8",
        "7",
        "j",
        "j",
        "z",
        "h",
        "k",
        "4"
      ]
    );

  });
  */

/*
  test("nextInt()", (assert) => {
    let min = 1;
    let max = 10;
    assert.generates(
      () => { return random.nextInt(min, max, engineTest); },
      [
        10,
        9,
        3,
        3,
        7,
        2,
        3,
        9
      ]
    );

  });

  test("nextNumber()", (assert) => {
    let min = 1;
    let max = 10;

    assert.generates(
      () => { return random.nextNumber(min, max, engineTest); },
      [
        9.31218940283594,
        9.059621427339874,
        3.3701697214330943,
        3.281689313659207,
        7.250694047177509,
        2.774847985862226
      ]
    );

  });*/

  /*test("normal()", (assert) => {
    let gen = random.normal(1, 10, engineSeed);
    [
      -13.34248820815906,
      10.735053160829807,
      6.1251454804770695,
      -8.689450680748767,
      7.5298356818146015,
      4.532261995330767
    ]
    .forEach((expected) => {
      assert.equal(gen(), expected);
    })
  })*/

  /*test("triangular()", (assert) => {
    let gen = random.triangular(0, 10, 5, engineSeed);

    [
      0.016953743826203897,
      5.8476154367055075,
      3.9039360831475087,
      5.7132966201016595,
      9.546187323402302,
      5.996635661742805
    ]
    .forEach((expected) => {
      assert.equal(gen(), expected);
    })
  })*/

  /*test("weibull()", (assert) => {
    let gen = random.weibull(2, 2, engineSeed);

    [
      0.004795249781889287,
      2.063644814249201,
      1.2059458208603313,
      2.000986772753657,
      4.687073522285217,
      2.1333099363070462
    ]
    .forEach((expected) => {
      assert.equal(gen(), expected);
    })
  })*/

})
