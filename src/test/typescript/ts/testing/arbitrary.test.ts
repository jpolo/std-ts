import { suite, test } from '../../../../main/typescript/ts/testing/qunit';
import * as arbitrary from '../../../../main/typescript/ts/testing/arbitrary';

export default suite('ts/testing/arbitrary', (self) => {

  test('.boolean()', (assert) => {
    const gen = arbitrary.boolean({
      random: () => { return 0.2; }
    });

  });

});
