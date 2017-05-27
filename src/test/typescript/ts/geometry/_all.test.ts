import quaternionSuite from './quaternion.test'
import matrixSuite from './matrix.test'
import vectorSuite from './vector.test'

export default quaternionSuite
  .concat(
    matrixSuite,
    vectorSuite
  )
