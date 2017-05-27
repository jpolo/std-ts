// import localSuite from "./local.test";
// import sessionSuite from "./session.test";
import memorySuite from './memory.test'
import cookieSuite from './cookie.test'

export default memorySuite
  .concat(
    // sessionSuite,
    cookieSuite
  )
