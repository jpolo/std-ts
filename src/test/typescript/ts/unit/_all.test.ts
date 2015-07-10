import generatorSuite from "./generator.test"

//boot
import assertionSuite from "./assertion.test"
import engineSuite from "./engine.test"

for (let suite of [assertionSuite, engineSuite]) {
  suite();
}

export default generatorSuite//concat;