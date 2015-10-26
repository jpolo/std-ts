import { suite, test } from "../../../main/typescript/ts/unit/qunit";
import { URI } from "../../../main/typescript/ts/uri";

const URISuite = suite("ts/uri.URI", (self) => {

  let uriDefault: URI;

  self.setUp = () => {
    uriDefault = URI.parse("http://localhost:8080/titi/tata?q=blah#id");
  }

  test(".parse()", (assert) => {
    let u = URI.parse("http://localhost:8080/titi/tata?q=blah#id")

    assert.strictEqual(u.scheme, "http")
    assert.strictEqual(u.userInfo, null)
    assert.strictEqual(u.domain, "localhost")
    assert.strictEqual(u.port, 8080)
    assert.strictEqual(u.path, "/titi/tata")
    assert.strictEqual(u.query["q"], "blah")
    assert.strictEqual(u.fragment, "id")
  })

  test("#equals()", (assert) => {
    assert.ok(!uriDefault.equals(URI.parse("http://localhost:8080/titi/tata?q=bla#id")));

    //same equality
    assert.ok(uriDefault.equals(URI.parse("http://localhost:8080/titi/tata?q=blah#id")));

    //fragment is not compared
    assert.ok(uriDefault.equals(URI.parse("http://localhost:8080/titi/tata?q=blah#ids")));
  })

  test("#toArray()", (assert) => {
    let a = uriDefault.toArray();

    assert.strictEqual(a[0], "http");
    assert.strictEqual(a[1], null);
    assert.strictEqual(a[2], "localhost");
    assert.strictEqual(a[3], 8080);
    assert.strictEqual(a[4], "/titi/tata");
    assert.deepEqual(a[5], { q: "blah" });
    assert.strictEqual(a[6], "id");

  })

  test("#toJSON()", (assert) => {
    assert.strictEqual(uriDefault.toJSON(), "http://localhost:8080/titi/tata?q=blah#id");
  })

  test("#inspect()", (assert) => {
    assert.strictEqual(URI.parse("").inspect(), "URI {}");
    assert.strictEqual(uriDefault.inspect(), "URI { http://localhost:8080/titi/tata?q=blah#id }");
  })

  test("#toString()", (assert) => {
    assert.strictEqual(String(uriDefault), "http://localhost:8080/titi/tata?q=blah#id");
  })
})

export default URISuite;
