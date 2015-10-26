module.exports = function(grunt) {

  var EOL = require('os').EOL;
  var INDENT = "\t\t";
  var tsConfig = (function () {
    var filePath = "tsconfig.json";
    var content;

    function tsConfig(opt_options) {
      var optsDefault = tsConfig.readJSON().compilerOptions;
      var opts = {};
      for (var k in optsDefault) {
        opts[k] = optsDefault[k];
      }
      if (opts) {
        for (var k in opts) {
          opts[k] = opts[k];
        }
      }
      return opts;
    }

    tsConfig.path = function () {
      return filePath;
    };

    tsConfig.read = function (opt_force) {
      if (!content || opt_force) {
        content = grunt.file.read(filePath);
      }
      return content;
    };

    tsConfig.readJSON = function (opt_force) {
      return JSON.parse(tsConfig.read(opt_force));
    };

    tsConfig.write = function (str) {
      content = str;
      grunt.file.write(filePath, str);
    };

    tsConfig.writeJSON = function (json) {
      tsConfig.write(JSON.stringify(json, null, INDENT) + EOL);
    };

    return tsConfig;
  }());

  grunt.initConfig({
    // ----- Environment
    // read in some metadata from project descriptor
    project: grunt.file.readJSON('package.json'),
    // define some directories to be used during build
    dir: {
      // location of all source files
      "source": "src",

      // location where TypeScript source files are located
      "source_ts": "src/main/typescript",
      // location where TypeScript/Jasmine test files are located
      "source_test_ts": "src/test/typescript",

      // location where all build files shall be placed
      "target": "target",

      // location to place (compiled) javascript files
      "target_js": "target/js",

      // location to place documentation, etc.
      "target_report": "target/report"
    },

    tslint: {
      options: {
        configuration: grunt.file.readJSON('tslint.json')
      },
      src: {
        src: [
          '<%= dir.source_ts %>',
          '<%= dir.source_test_ts %>'
        ]
      }
    },

    // ---- clean workspace
    clean: {
      target: {
        src: ["<%= dir.target_js %>"]
      }
    },

    watch: {

      tsconfig: {
        files: [ '<%= dir.source_ts %>/**/*.ts', '<%= dir.source_test_ts %>/**/*.ts' ],
        tasks: [ 'tsconfig' ]
      },

      compile: {
        files: [ tsConfig.path() ],
        tasks: [ 'typescript:compile' ],
        options: {
          atBegin: true,
          interrupt: true
        },
      }
    },

    // ----- TypeScript compilation
    //  See https://npmjs.org/package/grunt-typescript
    typescript: {

      // Compiles the tests.
      compile: {
        src: ['<%= dir.source_test_ts %>/**/*.ts', '<%= dir.source_ts %>/**/*.ts'],
        dest: '<%= dir.target_js %>',
        options: tsConfig({
          rootDir: '<%= dir.source %>'
        })
      }
    }
  });
  // ----- Setup tasks
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('compile', ['tsconfig', 'typescript:compile']);
  grunt.registerTask('test', ['tsconfig', 'typescript:compile']);
  grunt.registerTask('default', ['compile']);

  grunt.registerTask('tsconfig', function () {
    var json = tsConfig.readJSON(true);
    json.files = grunt.file.expand(json.filesGlob);
    tsConfig.writeJSON(json);
  });
};
