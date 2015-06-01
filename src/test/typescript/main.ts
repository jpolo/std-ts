import unit = require("../../main/typescript/ts/unit");
import htmlprinter = require("../../main/typescript/ts/unit/printer/html");
import allSuite = require("../../test/typescript/ts/_all.test");

var testPrinter = new htmlprinter.HTMLPrinter();
var testRunner = new unit.Runner();
testRunner.run(allSuite, (report) => { testPrinter.print(report); });
