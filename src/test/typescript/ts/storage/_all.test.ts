//import localSuite from "./local.test"
//import sessionSuite from "./session.test"
import memorySuite from "./memory.test"
import cookieSuite from "./cookie.test"

var exportSuite = memorySuite
  .concat(
    //sessionSuite,
    cookieSuite
  )
export = exportSuite;