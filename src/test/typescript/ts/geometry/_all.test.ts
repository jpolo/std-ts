import quaternionSuite = require("./quaternion.test")
import matrixSuite = require("./matrix.test")
import vectorSuite = require("./vector.test")

var exportSuite = quaternionSuite
  .concat(
    matrixSuite,
    vectorSuite
  )
export = exportSuite;