module.exports = function(grunt) {
  var TARGET = 'es5';
  var INDENT = 2;
	
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
        options: {
          basePath: '<%= dir.source_ts %>',
          target: TARGET,
          module: 'amd',
          sourceMap: true,
          declaration: true,
          comments: true,
          indentStep: INDENT
        }
      },
      
      // Compiles the tests.
      compile_test: {
        src: ['<%= dir.source_test_ts %>/**/*.ts','<%= dir.source_ts %>/**/*.ts'],
        dest: '<%= dir.target_test_js %>',
        options: {
          basePath: '<%= dir.source %>',
          target: TARGET,
          module: 'amd',
          sourceMap: true,
          declaration: false,
          comments: false,
          indentStep: INDENT
        }
      }
    },
    // ------- Unit tests with code coverage
    //  See https://github.com/gruntjs/grunt-contrib-jasmine
    jasmine: {
      run: {
        src: ['<%= dir.target_test_js %>/main/**/*.js'],
        options: {
          // the tests
          specs: '<%= dir.target_test_js %>/test/**/*.test.js',
          keepRunner: true, // useful for debugging
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: '.grunt/grunt-contrib-jasmine/<%= target_test_js %>',
              // HACK: Fix nasty 'wrong uri' problem on windows. The location of the reporter.js
              //  contains backslashes that can't be resolved by requirejs
              map: {
                //'*': {
        			    //'.gruntgrunt-contrib-jasminegrunt-template-jasmine-istanbul\reporter.js':
                  //'.grunt/grunt-contrib-jasmine/grunt-template-jasmine-istanbul/reporter.js'
                //}
              }
            }
          }
        }

      }
    }
  });
  // ----- Setup tasks
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('compile', ['typescript:compile']);
  grunt.registerTask('test', ['typescript:compile_test', 'jasmine']);
  grunt.registerTask('default', ['compile']);
};
