import arbitrarySuite from "./arbitrary.test"
import generatorSuite from "./generator.test"

//boot
import assertionSuite from "./assertion.test"
import qunitSuite from "./qunit.test"
import engineSuite from "./engine.test"

for (let suite of [assertionSuite, qunitSuite, engineSuite]) {
  suite();
}

export default arbitrarySuite.concat(generatorSuite);
