import unit = require("../../../main/typescript/ts/unit")

import dateSuite = require("./date.test")
import geometrySuite = require("./geometry.test")
import mathSuite = require("./math.test")
import randomSuite = require("./random.test")
import semverSuite = require("./semver.test")
import unitSuite = require("./unit.test")
import uriSuite = require("./uri.test")
import vmSuite = require("./vm.test")

var allSuite: unit.ITest[] = [].concat(
  dateSuite,
  geometrySuite,
  mathSuite,
  randomSuite,
  semverSuite,
  unitSuite,
  uriSuite,
  vmSuite
)

export = allSuite;
