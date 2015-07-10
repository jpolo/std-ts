import unit = require("../../main/typescript/ts/unit");
import runner = require("../../main/typescript/ts/unit/runner");
import htmlprinter = require("../../main/typescript/ts/unit/printer/html");
import allSuite from "../../test/typescript/ts/_all.test";

var testPrinter = new htmlprinter.HTMLPrinter();
var testRunner = new runner.Runner();
testRunner.run(allSuite, (report) => { testPrinter.print(report); });
