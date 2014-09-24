import unit = require("../../../main/typescript/ts/unit")

//import geometrySuite = require("./geometry.test")
import mathSuite = require("./math.test")
import randomSuite = require("./random.test")
import unitSuite = require("./unit.test")
//import uriSuite = require("./uri.test")
import vmSuite = require("./vm.test")

var allSuite: unit.ITest[] = [].concat(
  //geometrySuite,
  mathSuite,
  randomSuite,
  unitSuite,
  //uriSuite,
  vmSuite
)

export = allSuite;
