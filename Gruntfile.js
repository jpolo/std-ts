module.exports = function(grunt) {


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
    
    tsConfig.read = function () {
      return content || (content = grunt.file.read(filePath));
    };
    
    tsConfig.readJSON = function () {
      return JSON.parse(tsConfig.read());
    };
    
    tsConfig.write = function (str) {
	  //tsconfig.files = grunt.file.expand(tsconfig.filesGlob);

	//var output = JSON.stringify(tsconfig, null, '\t') + require('os').EOL;
	  //if (output !== tsconfigContent) {
      content = str;
	  grunt.file.write(filePath, str);
    };
    
    tsConfig.writeJSON = function (json) {
  	  tsConfig.write(JSON.stringify(json, null, '\t') + require('os').EOL)
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
      // location to place (compiles) javascript test files
      "target_test_js": "target/js-test",
      // location to place documentation, etc.
      "target_report": "target/report"
    },

    // ---- clean workspace
    clean: {
      target: {
        src: "<%= dir.target %>"
      }
    },

    watch: {
      test: {
        files: ['<%= dir.source_ts %>/**/*.ts', '<%= dir.source_test_ts %>/**/*.ts'],
        tasks: ['typescript:compile_test'],
        options: {
          atBegin: true,
          interrupt: true
          //spawn: false,
        },
      }
    },

    // ----- TypeScript compilation
    //  See https://npmjs.org/package/grunt-typescript
    typescript: {
      // Compiles the code into a single file. Also generates a typescript declaration file
      compile: {
	    src: ['<%= dir.source_ts %>/**/*.ts'],
        dest: '<%= dir.target_js %>',
        options: tsConfig({
          rootDir: '<%= dir.source_ts %>'
        })
      },

      // Compiles the tests.
      compile_test: {
        src: ['<%= dir.source_test_ts %>/**/*.ts','<%= dir.source_ts %>/**/*.ts'],
        dest: '<%= dir.target_test_js %>',
        options: tsConfig({
          rootDir: '<%= dir.source %>'
        })
      }
    }
  });
  // ----- Setup tasks
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('compile', ['typescript:compile']);
  grunt.registerTask('test', ['typescript:compile_test'/*, 'jasmine'*/]);
  grunt.registerTask('default', ['compile']);
};
