import unit = require("../../../main/typescript/ts/unit")

import dateSuite = require("./date.test")
import errorSuite = require("./error.test")
import geometrySuite = require("./geometry.test")
import hashSuite = require("./hash.test")
import idSuite = require("./id.test")
import inspectSuite = require("./inspect.test")
import logSuite = require("./log.test")
import mathSuite = require("./math.test")
import randomSuite = require("./random.test")
import reflectSuite = require("./reflect.test")
import semverSuite = require("./semver.test")
import stacktraceSuite = require("./stacktrace.test")
import unitSuite = require("./unit.test")
import uriSuite = require("./uri.test")
import timerSuite = require("./timer.test")
import vmSuite = require("./vm.test")
import yamlSuite = require("./yaml.test")

var allSuite: unit.ITest[] = [].concat(
  dateSuite,
  errorSuite,
  geometrySuite,
  hashSuite,
  idSuite,
  inspectSuite,
  logSuite,
  mathSuite,
  randomSuite,
  reflectSuite,
  semverSuite,
  stacktraceSuite,
  unitSuite,
  uriSuite,
  timerSuite,
  vmSuite,
  yamlSuite
)

export = allSuite
