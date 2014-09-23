import unit = require("../../main/typescript/ts/unit");
import allSuite = require("../../test/typescript/ts/_all.test");

var testPrinter = new unit.Printer();
var testRunner = new unit.Runner();
testRunner.run(allSuite, (report) => { testPrinter.print(report); });
