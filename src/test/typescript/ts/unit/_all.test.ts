import generatorSuite = require("./generator.test")

//boot
import assertionSuite = require("./assertion.test")
import engineSuite = require("./engine.test")
var bootSuites = [assertionSuite, engineSuite];

for (var i = 0, l = bootSuites.length; i < l; i++) {
  bootSuites[i]();
}

var exportSuite = generatorSuite;
export = exportSuite;