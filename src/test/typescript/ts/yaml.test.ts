import { suite, test } from "../../../main/typescript/ts/unit/qunit";
import { parse } from "../../../main/typescript/ts/yaml";

export default suite("ts/yaml", (self) => {

  test(".parse()", (assert) => {
    // Boolean
    assert.deepEqual(
      parse(
        "valid_true:\n" +
        "  - true\n" +
        "  - True\n" +
        "  - TRUE\n" +
        "\n" +
        "valid_false:\n" +
        "  - false\n" +
        "  - False\n" +
        "  - FALSE\n"
      ),
      {
        valid_true: [true, true, true],
        valid_false: [false, false, false]
      }
    );

    // Null
    assert.deepEqual(
      parse(
        "---\n" +
        "  test: A test for null values\n" +
        "  thisis: null\n" +
        "  thistoo: NULL\n" +
        "  notnull: true\n" +
        "  tildeis: ~\n" +
        "  capitalized: Null\n" +
        "  end: test passed?\n"
      ),
      {
        test: "A test for null values",
        thisis: null,
        thistoo: null,
        notnull: true,
        tildeis: "~",
        capitalized: null,
        end: "test passed?"
      }
    );

    // Hash
    assert.deepEqual(
      parse(
        "---\n" +
        "  hash_inline: { name: Mail, email: 'mail@corporate.com' }\n" +
        "  hash_default:\n" +
        "    name: Default\n" +
        "    email: 'default@corporate.com'\n"
      ),
      {
        hash_inline: { name: "Mail", email: "mail@corporate.com" },
        hash_default: { name: "Default", email: "default@corporate.com" }
      }
    );


    // List
    assert.deepEqual(
      parse(
        "---\n" +
        "  list_inline: ['foo', 'bar', 'baz']\n" +
        "  list_default:\n" +
        "    - lots of milk\n" +
        "    - 'cookies'\n" +
        "    - 'something'\n"
      ),
      {
        list_inline: ["foo", "bar", "baz"],
        list_default: [ "lots of milk", "cookies", "something" ]
      }
    );

    // Comment
    assert.deepEqual(
      parse(
        "---\n" +
        "  #Name\n" +
        "  name: 'MyName'\n" +
        "  \n" +
        "  #Description\n" +
        "  mail: 'default@corporate.com'\n"
      ),
      {
        name: "MyName",
        mail: "default@corporate.com"
      }
    );

    // Error
    let wrong =
      "---\n" +
      "  name:\n" +
      "    - lots of milk\n" +
      "    - 'cookies':\n" +
      "    - 'something'\n";
    assert.throws(() => {
      parse(wrong, { sourceURL: "ts/yaml.test.yaml" });
    }, `SyntaxError: hash not properly dedented, near ":\\n    - \'something\'\\n" (ts/yaml.test.yaml:4:0)`);

    // console.warn(yaml.parse(wrong, { sourceURL: "ts/yaml.test.yaml" }))
  });

});
