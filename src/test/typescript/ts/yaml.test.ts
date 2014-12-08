import unit = require("../../../main/typescript/ts/unit")
import suite = unit.suite
import test = unit.test
import yaml = require("../../../main/typescript/ts/yaml")

var yamlSuite = suite("ts/yaml", (self) => {
  
  test("parse()", (assert) => {
    //Boolean
    assert.deepEqual(
      yaml.parse(
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
    )
    
    //Null
    assert.deepEqual(
      yaml.parse(
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
    )
      
    //Hash
    assert.deepEqual(
      yaml.parse(
        "---\n" +
        "  hash_inline: { name: Mail, email: 'mail@corporate.com' }\n" +
        "  hash_default:\n" +
        "    name: Default\n" +
        "    email: 'default@corporate.com'\n"
      ), 
      {
        hash_inline: { name: 'Mail', email: 'mail@corporate.com' },
        hash_default: { name: 'Default', email: 'default@corporate.com' }
      }
    )
    
    
    //List
    assert.deepEqual(
      yaml.parse(
        "---\n" +
        "  list_inline: ['foo', 'bar', 'baz']\n" +
        "  list_default:\n" +
        "    - lots of milk\n" +
        "    - 'cookies'\n" +
        "    - 'something'\n"
      ),
      {
        list_inline: ['foo', 'bar', 'baz'],
        list_default: [ "lots of milk", 'cookies', 'something' ]
      }
      
    )
      
    //Comment
    assert.deepEqual(
      yaml.parse(
        "---\n" +
        "  #Name\n" +
        "  name: 'MyName'\n" +
        "  \n" +
        "  #Description\n" +
        "  mail: 'default@corporate.com'\n"
      ),
      {
        name: 'MyName',
        mail: 'default@corporate.com'
      }
    )
    
    //Error
    var wrong = 
      "---\n" +
      "  name:\n" +
      "    - lots of milk\n" +
      "    - 'cookies':\n" +
      "    - 'something'\n"
    assert.throws(() => {
      yaml.parse(wrong, { sourceURL: "ts/yaml.test.yaml" })
    }, 'SyntaxError: hash not properly dedented, near ":\\n    - \'something\'\\n" (ts/yaml.test.yaml:4:0)')
    
    //console.warn(yaml.parse(wrong, { sourceURL: "ts/yaml.test.yaml" }))
  })
  
})
  
export = yamlSuite