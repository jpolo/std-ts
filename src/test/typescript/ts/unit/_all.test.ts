import arbitrarySuite from './arbitrary.test';
import generatorSuite from './generator.test';

// boot
import assertionSuite from './assertion.test';
import equalSuite from './equal.test';
import qunitSuite from './qunit.test';
import engineSuite from './engine.test';

for (const suite of [assertionSuite, equalSuite, qunitSuite, engineSuite]) {
  suite();
}

export default arbitrarySuite.concat(generatorSuite);
