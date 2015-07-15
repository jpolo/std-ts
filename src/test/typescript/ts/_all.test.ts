import { ITest } from "../../../main/typescript/ts/unit"

import cloneSuite from "./clone.test"
import collectionSuite from "./collection/_all.test"
import compareSuite from "./compare.test"
import dateSuite from "./date.test"
import errorSuite from "./error.test"
import geometrySuite from "./geometry/_all.test"
import hashSuite from "./hash.test"
import idSuite from "./id.test"
import inspectSuite from "./inspect.test"
import iteratorSuite from "./iterator.test"
import logSuite from "./log.test"
import mathSuite from "./math.test"
import randomSuite from "./random.test"
import reflectSuite from "./reflect.test"
import semverSuite from "./semver.test"
import signalSuite from "./signal.test"
import stacktraceSuite from "./stacktrace.test"
import storageSuite from "./storage/_all.test"
import timerSuite from "./timer.test"
import unitSuite from "./unit/_all.test"
import uriSuite from "./uri.test"
import uuidSuite from "./uuid.test"
import vmSuite from "./vm.test"
import yamlSuite from "./yaml.test"

export default <ITest[]>[].concat(
  cloneSuite,
  collectionSuite,
  compareSuite,
  dateSuite,
  errorSuite,
  geometrySuite,
  hashSuite,
  idSuite,
  inspectSuite,
  iteratorSuite,
  logSuite,
  mathSuite,
  randomSuite,
  reflectSuite,
  semverSuite,
  signalSuite,
  stacktraceSuite,
  storageSuite,
  timerSuite,
  unitSuite,
  uriSuite,
  uuidSuite,
  vmSuite,
  yamlSuite
);
