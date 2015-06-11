//import localSuite = require("./local.test")
//import sessionSuite = require("./session.test")
import memorySuite = require("./memory.test")
import cookieSuite = require("./cookie.test")

var exportSuite = memorySuite
  .concat(
    //sessionSuite,
    cookieSuite
  )
export = exportSuite;