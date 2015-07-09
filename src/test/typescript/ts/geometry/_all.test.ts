import quaternionSuite from "./quaternion.test"
import matrixSuite from "./matrix.test"
import vectorSuite from "./vector.test"

var exportSuite = quaternionSuite
  .concat(
    matrixSuite,
    vectorSuite
  )
export = exportSuite;