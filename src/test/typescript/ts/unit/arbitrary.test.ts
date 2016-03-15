import { suite, test } from "../../../../main/typescript/ts/unit/qunit";
import * as arbitrary from "../../../../main/typescript/ts/unit/arbitrary";

export default suite("ts/unit/arbitrary", (self) => {

  test(".boolean()", (assert) => {
    let gen = arbitrary.boolean({
      random: () => { return 0.2; }
    });


  });

});
